import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  generateDarajaAccessToken,
  getLandlordMpesaConfig,
  normalizeKenyanPhone,
  saveLandlordMpesaConfig,
  sendDarajaStkPush,
  type LandlordMpesaConfig,
} from "./mpesa.server";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: Superadmin privileges required.");
}

/**
 * 1. TENANT: Initiate M-Pesa STK Push Payment
 */
export const initiateTenantMpesaPayment = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        tenantId: z.string().uuid(),
        propertyCode: z.string().min(2),
        room: z.string().min(1),
        verifiedPhone: z.string().min(9),
        amount: z.number().min(1).max(300000),
        paymentPhone: z.string().min(9),
        origin: z.string().url().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Verify Property & Tenant relationship
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id, name, code, landlord_id")
      .eq("code", data.propertyCode.toUpperCase())
      .maybeSingle();

    if (!property) {
      throw new Error("Property not found with the specified code.");
    }

    const { data: tenant } = await supabaseAdmin
      .from("tenants")
      .select("*, units(id, unit_number, room_number, rent)")
      .eq("id", data.tenantId)
      .eq("property_id", property.id)
      .maybeSingle();

    if (!tenant) {
      throw new Error("Tenant record verification failed for this property.");
    }

    // 2. Normalize payment phone number
    const normalizedPhone = normalizeKenyanPhone(data.paymentPhone);

    // 3. Fetch Landlord's active M-Pesa configuration
    const mpesaConfig = await getLandlordMpesaConfig(property.landlord_id);

    if (!mpesaConfig || !mpesaConfig.is_active) {
      throw new Error(
        `Online M-Pesa is not yet configured for ${property.name}. Please contact your landlord (${property.name}) to complete setup or make payment via their standard collection account.`,
      );
    }

    const accountRef = `${mpesaConfig.account_reference_prefix || property.code}-${tenant.units?.unit_number || tenant.units?.room_number || "RENT"}`.replace(/[^a-zA-Z0-9_-]/g, "");

    // 4. Create pending transaction in database
    const { data: txRecord, error: txError } = await supabaseAdmin
      .from("mpesa_transactions")
      .insert({
        landlord_id: property.landlord_id,
        property_id: property.id,
        unit_id: tenant.unit_id,
        tenant_id: tenant.id,
        amount: data.amount,
        phone_number: normalizedPhone,
        account_reference: accountRef,
        transaction_description: `Rent for ${property.name}`,
        status: "initiated",
      })
      .select("id")
      .single();

    if (txError || !txRecord) {
      console.error("Failed to create mpesa_transactions record:", txError);
      throw new Error("Could not initialize payment transaction. Please try again.");
    }

    // 5. Send STK Push request to Safaricom Daraja
    const baseUrl = data.origin || process.env["APP_URL"] || "https://rentreceipt.co.ke";
    const callbackUrl = `${baseUrl.replace(/\/$/, "")}/api/public/mpesa/callback`;

    try {
      const stkRes = await sendDarajaStkPush({
        config: mpesaConfig,
        phoneNumber: normalizedPhone,
        amount: data.amount,
        accountReference: accountRef,
        transactionDesc: `Rent Payment`,
        callbackUrl,
      });

      // 6. Update transaction with Daraja identifiers
      await supabaseAdmin
        .from("mpesa_transactions")
        .update({
          merchant_request_id: stkRes.MerchantRequestID,
          checkout_request_id: stkRes.CheckoutRequestID,
          status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", txRecord.id);

      return {
        ok: true,
        transactionId: txRecord.id,
        checkoutRequestId: stkRes.CheckoutRequestID,
        customerMessage: stkRes.CustomerMessage || "Please enter your M-Pesa PIN on your phone to complete payment.",
        phone: normalizedPhone,
        amount: data.amount,
      };
    } catch (err: any) {
      // Mark transaction as failed
      await supabaseAdmin
        .from("mpesa_transactions")
        .update({
          status: "failed",
          result_desc: err?.message || "STK Push request failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", txRecord.id);

      throw new Error(err?.message || "Failed to send M-Pesa STK Push.");
    }
  });

/**
 * 2. TENANT / FRONTEND: Poll M-Pesa Payment Status
 */
export const getMpesaPaymentStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        transactionId: z.string().uuid().optional(),
        checkoutRequestId: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    let query = supabaseAdmin.from("mpesa_transactions").select("*");

    if (data.transactionId) {
      query = query.eq("id", data.transactionId);
    } else if (data.checkoutRequestId) {
      query = query.eq("checkout_request_id", data.checkoutRequestId);
    } else {
      throw new Error("Either transactionId or checkoutRequestId is required.");
    }

    const { data: tx, error } = await query.maybeSingle();

    if (error || !tx) {
      return { status: "not_found" as const };
    }

    if (tx.status === "success") {
      // Find the generated receipt
      let receipt: { public_id: string; receipt_number: string; balance: number; amount: number } | null = null;
      if (tx.tenant_id) {
        const { data: r } = await supabaseAdmin
          .from("receipts")
          .select("public_id, receipt_number, balance, amount")
          .eq("tenant_id", tx.tenant_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        receipt = r;
      }

      return {
        status: "success" as const,
        amount: tx.amount,
        mpesaReceiptNumber: tx.mpesa_receipt_number,
        paidAt: tx.paid_at,
        receiptNumber: receipt?.receipt_number || null,
        publicReceiptId: receipt?.public_id || null,
        balance: receipt?.balance ?? 0,
      };
    }

    if (tx.status === "failed" || tx.status === "cancelled" || tx.status === "timeout") {
      return {
        status: tx.status as "failed" | "cancelled" | "timeout",
        resultCode: tx.result_code,
        resultDesc: tx.result_desc || (tx.status === "cancelled" ? "Payment was cancelled on phone." : "Payment failed."),
      };
    }

    return {
      status: "pending" as const,
      amount: tx.amount,
      phone: tx.phone_number,
    };
  });

/**
 * 3. LANDLORD: Get Own M-Pesa Settings (Masked)
 */
export const getLandlordMpesaSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const config = await getLandlordMpesaConfig(context.userId);

    if (!config) {
      return {
        configured: false,
        shortcode: "",
        consumer_key: "",
        consumer_secret_masked: "",
        passkey_masked: "",
        environment: "sandbox" as const,
        transaction_type: "CustomerPayBillOnline" as const,
        account_reference_prefix: "RRP",
        is_active: false,
      };
    }

    return {
      configured: true,
      shortcode: config.shortcode,
      consumer_key: config.consumer_key,
      consumer_secret_masked: config.consumer_secret ? "••••••••••••" + config.consumer_secret.slice(-4) : "",
      passkey_masked: config.passkey ? "••••••••••••" + config.passkey.slice(-4) : "",
      environment: config.environment,
      transaction_type: config.transaction_type,
      account_reference_prefix: config.account_reference_prefix || "RRP",
      is_active: config.is_active,
    };
  });

/**
 * 4. LANDLORD: Save M-Pesa Settings
 */
export const saveLandlordMpesaSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        shortcode: z.string().min(5).max(10),
        consumer_key: z.string().min(10),
        consumer_secret: z.string().min(10),
        passkey: z.string().min(10),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
        transaction_type: z.enum(["CustomerPayBillOnline", "CustomerBuyGoodsOnline"]).default("CustomerPayBillOnline"),
        account_reference_prefix: z.string().max(10).optional().nullable(),
        is_active: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    // If consumer_secret or passkey was submitted with mask, preserve existing stored secret
    let finalSecret = data.consumer_secret;
    let finalPasskey = data.passkey;

    if (data.consumer_secret.includes("••••") || data.passkey.includes("••••")) {
      const existing = await getLandlordMpesaConfig(context.userId);
      if (existing) {
        if (data.consumer_secret.includes("••••")) finalSecret = existing.consumer_secret;
        if (data.passkey.includes("••••")) finalPasskey = existing.passkey;
      }
    }

    await saveLandlordMpesaConfig(context.userId, {
      shortcode: data.shortcode,
      consumer_key: data.consumer_key,
      consumer_secret: finalSecret,
      passkey: finalPasskey,
      environment: data.environment,
      transaction_type: data.transaction_type,
      account_reference_prefix: data.account_reference_prefix || "RRP",
      is_active: data.is_active,
    });

    return { ok: true, message: "M-Pesa configuration saved successfully." };
  });

/**
 * 5. LANDLORD / ADMIN: Test Daraja Connection (OAuth Token Ping)
 */
export const testLandlordMpesaConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        consumer_key: z.string().min(5),
        consumer_secret: z.string().min(5),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    let secret = data.consumer_secret;
    if (secret.includes("••••")) {
      const existing = await getLandlordMpesaConfig(context.userId);
      if (existing) secret = existing.consumer_secret;
    }

    try {
      const token = await generateDarajaAccessToken(data.consumer_key, secret, data.environment);
      return {
        ok: true,
        message: `Connection Verified! Successfully authenticated with Safaricom Daraja (${data.environment.toUpperCase()}).`,
      };
    } catch (err: any) {
      throw new Error(err?.message || "Daraja Connection Test Failed.");
    }
  });

/**
 * 6. ADMIN: List Platform M-Pesa STK Transactions
 */
export const listAdminMpesaTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);

    const [txRes, landlordsRes, propertiesRes, tenantsRes] = await Promise.all([
      supabaseAdmin
        .from("mpesa_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin.from("profiles").select("id, full_name, company_name"),
      supabaseAdmin.from("properties").select("id, name, code"),
      supabaseAdmin.from("tenants").select("id, full_name, phone"),
    ]);

    const landlordMap = new Map((landlordsRes.data ?? []).map((l) => [l.id, l.full_name || l.company_name || "—"]));
    const propertyMap = new Map((propertiesRes.data ?? []).map((p) => [p.id, p.name]));
    const tenantMap = new Map((tenantsRes.data ?? []).map((t) => [t.id, t]));

    return (txRes.data ?? []).map((tx) => {
      const t = tx.tenant_id ? tenantMap.get(tx.tenant_id) : null;
      return {
        ...tx,
        landlord_name: landlordMap.get(tx.landlord_id) ?? "—",
        property_name: tx.property_id ? propertyMap.get(tx.property_id) ?? "—" : "—",
        tenant_name: t?.full_name ?? "—",
      };
    });
  });

/**
 * 7. ADMIN: Get Landlord M-Pesa Settings for Onboarding / Inspection
 */
export const getAdminLandlordMpesaSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ landlordId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const config = await getLandlordMpesaConfig(data.landlordId);

    if (!config) {
      return {
        configured: false,
        shortcode: "",
        consumer_key: "",
        consumer_secret_masked: "",
        passkey_masked: "",
        environment: "sandbox" as const,
        transaction_type: "CustomerPayBillOnline" as const,
        account_reference_prefix: "RRP",
        is_active: false,
      };
    }

    return {
      configured: true,
      shortcode: config.shortcode,
      consumer_key: config.consumer_key,
      consumer_secret_masked: config.consumer_secret ? "••••••••••••" + config.consumer_secret.slice(-4) : "",
      passkey_masked: config.passkey ? "••••••••••••" + config.passkey.slice(-4) : "",
      environment: config.environment,
      transaction_type: config.transaction_type,
      account_reference_prefix: config.account_reference_prefix || "RRP",
      is_active: config.is_active,
    };
  });

/**
 * 8. ADMIN: Save / Update Landlord M-Pesa Settings
 */
export const saveAdminLandlordMpesaSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        landlordId: z.string().uuid(),
        shortcode: z.string().min(5).max(10),
        consumer_key: z.string().min(10),
        consumer_secret: z.string().min(10),
        passkey: z.string().min(10),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
        transaction_type: z.enum(["CustomerPayBillOnline", "CustomerBuyGoodsOnline"]).default("CustomerPayBillOnline"),
        account_reference_prefix: z.string().max(10).optional().nullable(),
        is_active: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);

    let finalSecret = data.consumer_secret;
    let finalPasskey = data.passkey;

    if (data.consumer_secret.includes("••••") || data.passkey.includes("••••")) {
      const existing = await getLandlordMpesaConfig(data.landlordId);
      if (existing) {
        if (data.consumer_secret.includes("••••")) finalSecret = existing.consumer_secret;
        if (data.passkey.includes("••••")) finalPasskey = existing.passkey;
      }
    }

    await saveLandlordMpesaConfig(data.landlordId, {
      shortcode: data.shortcode,
      consumer_key: data.consumer_key,
      consumer_secret: finalSecret,
      passkey: finalPasskey,
      environment: data.environment,
      transaction_type: data.transaction_type,
      account_reference_prefix: data.account_reference_prefix || "RRP",
      is_active: data.is_active,
    });

    return { ok: true, message: "Landlord M-Pesa configuration updated successfully by admin." };
  });
