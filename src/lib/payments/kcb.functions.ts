import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getLandlordKcbConfig,
  saveLandlordKcbConfig,
  testKcbConnection,
  type LandlordKcbConfig,
} from "./kcb.server";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: Superadmin privileges required.");
}

/**
 * 1. LANDLORD: Get Own KCB Settings (Masked)
 */
export const getLandlordKcbSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const config = await getLandlordKcbConfig(context.userId);

    const baseUrl = process.env["APP_URL"] || "https://www.rentreceipt.co.ke";
    const ipnUrl = `${baseUrl.replace(/\/$/, "")}/api/public/kcb/ipn`;

    if (!config) {
      return {
        configured: false,
        paybill_number: "",
        account_number: "",
        client_key: "",
        client_secret_masked: "",
        ipn_secret_token_masked: "",
        environment: "sandbox" as const,
        account_reference_prefix: "RR",
        is_active: false,
        connection_status: "not_configured" as const,
        last_tested_at: null,
        ipn_url: ipnUrl,
      };
    }

    return {
      configured: true,
      paybill_number: config.paybill_number,
      account_number: config.account_number || "",
      client_key: config.client_key,
      client_secret_masked: config.client_secret ? "••••••••••••" + config.client_secret.slice(-4) : "",
      ipn_secret_token_masked: config.ipn_secret_token ? "••••••••••••" + config.ipn_secret_token.slice(-4) : "",
      environment: config.environment,
      account_reference_prefix: config.account_reference_prefix || "RR",
      is_active: config.is_active,
      connection_status: config.connection_status || "configured",
      last_tested_at: config.last_tested_at || null,
      ipn_url: ipnUrl,
    };
  });

/**
 * 2. LANDLORD: Save KCB Settings
 */
export const saveLandlordKcbSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        paybill_number: z.string().min(3).max(20),
        account_number: z.string().max(30).optional().nullable(),
        client_key: z.string().min(5),
        client_secret: z.string().min(5),
        ipn_secret_token: z.string().optional().nullable(),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
        account_reference_prefix: z.string().max(10).optional().nullable(),
        is_active: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    let finalSecret = data.client_secret;
    let finalIpnSecret = data.ipn_secret_token;

    // If secrets submitted with mask, preserve existing stored secret
    if (data.client_secret.includes("••••") || (data.ipn_secret_token && data.ipn_secret_token.includes("••••"))) {
      const existing = await getLandlordKcbConfig(context.userId);
      if (existing) {
        if (data.client_secret.includes("••••")) finalSecret = existing.client_secret;
        if (data.ipn_secret_token && data.ipn_secret_token.includes("••••")) finalIpnSecret = existing.ipn_secret_token;
      }
    }

    await saveLandlordKcbConfig(context.userId, {
      paybill_number: data.paybill_number,
      account_number: data.account_number || null,
      client_key: data.client_key,
      client_secret: finalSecret,
      ipn_secret_token: finalIpnSecret || null,
      environment: data.environment,
      account_reference_prefix: data.account_reference_prefix || "RR",
      is_active: data.is_active,
      connection_status: "configured",
    });

    return { ok: true, message: "KCB BUNI configuration saved successfully." };
  });

/**
 * 3. LANDLORD / ADMIN: Test KCB Connection (OAuth Token Ping)
 */
export const testLandlordKcbConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        client_key: z.string().min(3),
        client_secret: z.string().min(3),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    let secret = data.client_secret;
    if (secret.includes("••••")) {
      const existing = await getLandlordKcbConfig(context.userId);
      if (existing) secret = existing.client_secret;
    }

    try {
      const res = await testKcbConnection(data.client_key, secret, data.environment);

      // Record successful test status in database if config exists
      const existing = await getLandlordKcbConfig(context.userId);
      if (existing) {
        await supabaseAdmin
          .from("landlord_kcb_configs")
          .update({
            connection_status: "connected",
            last_tested_at: new Date().toISOString(),
          })
          .eq("landlord_id", context.userId);
      }

      return res;
    } catch (err: any) {
      // Record failed test status in database
      const existing = await getLandlordKcbConfig(context.userId);
      if (existing) {
        await supabaseAdmin
          .from("landlord_kcb_configs")
          .update({
            connection_status: "failed",
            last_tested_at: new Date().toISOString(),
          })
          .eq("landlord_id", context.userId);
      }

      throw new Error(err?.message || "KCB BUNI Connection Test Failed.");
    }
  });

/**
 * 4. ADMIN: List Platform KCB IPN Transactions
 */
export const listAdminKcbTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);

    const [txRes, landlordsRes, propertiesRes, tenantsRes] = await Promise.all([
      supabaseAdmin
        .from("kcb_transactions")
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
 * 5. ADMIN: Get Landlord KCB Settings for Onboarding / Inspection
 */
export const getAdminLandlordKcbSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ landlordId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const config = await getLandlordKcbConfig(data.landlordId);

    if (!config) {
      return {
        configured: false,
        paybill_number: "",
        account_number: "",
        client_key: "",
        client_secret_masked: "",
        ipn_secret_token_masked: "",
        environment: "sandbox" as const,
        account_reference_prefix: "RR",
        is_active: false,
        connection_status: "not_configured" as const,
        last_tested_at: null,
      };
    }

    return {
      configured: true,
      paybill_number: config.paybill_number,
      account_number: config.account_number || "",
      client_key: config.client_key,
      client_secret_masked: config.client_secret ? "••••••••••••" + config.client_secret.slice(-4) : "",
      ipn_secret_token_masked: config.ipn_secret_token ? "••••••••••••" + config.ipn_secret_token.slice(-4) : "",
      environment: config.environment,
      account_reference_prefix: config.account_reference_prefix || "RR",
      is_active: config.is_active,
      connection_status: config.connection_status || "configured",
      last_tested_at: config.last_tested_at || null,
    };
  });

/**
 * 6. ADMIN: Save / Update Landlord KCB Settings
 */
export const saveAdminLandlordKcbSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        landlordId: z.string().uuid(),
        paybill_number: z.string().min(3).max(20),
        account_number: z.string().max(30).optional().nullable(),
        client_key: z.string().min(5),
        client_secret: z.string().min(5),
        ipn_secret_token: z.string().optional().nullable(),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
        account_reference_prefix: z.string().max(10).optional().nullable(),
        is_active: z.boolean().default(true),
        connection_status: z
          .enum([
            "untested",
            "connected",
            "failed",
            "not_configured",
            "configured",
            "connection_successful",
            "connection_failed",
            "awaiting_approval",
          ])
          .default("connected"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);

    let finalSecret = data.client_secret;
    let finalIpnSecret = data.ipn_secret_token;

    if (data.client_secret.includes("••••") || (data.ipn_secret_token && data.ipn_secret_token.includes("••••"))) {
      const existing = await getLandlordKcbConfig(data.landlordId);
      if (existing) {
        if (data.client_secret.includes("••••")) finalSecret = existing.client_secret;
        if (data.ipn_secret_token && data.ipn_secret_token.includes("••••")) finalIpnSecret = existing.ipn_secret_token;
      }
    }

    await saveLandlordKcbConfig(data.landlordId, {
      paybill_number: data.paybill_number,
      account_number: data.account_number || null,
      client_key: data.client_key,
      client_secret: finalSecret,
      ipn_secret_token: finalIpnSecret || null,
      environment: data.environment,
      account_reference_prefix: data.account_reference_prefix || "RR",
      is_active: data.is_active,
      connection_status: data.connection_status,
    });

    return { ok: true, message: "Landlord KCB configuration updated successfully by admin." };
  });
