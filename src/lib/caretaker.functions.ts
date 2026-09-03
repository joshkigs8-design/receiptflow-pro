import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CaretakerPermissions = {
  can_record_payments: boolean;
  can_manage_maintenance: boolean;
  can_view_tenants: boolean;
  can_send_announcements: boolean;
};

export type CaretakerRecord = {
  id: string;
  landlord_id: string;
  property_id: string | null;
  name: string;
  phone: string;
  pin: string;
  permissions: CaretakerPermissions;
  status: "active" | "suspended";
  created_at: string;
  updated_at?: string;
  properties?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export const defaultPermissions: CaretakerPermissions = {
  can_record_payments: true,
  can_manage_maintenance: true,
  can_view_tenants: true,
  can_send_announcements: false,
};

const caretakerSchema = z.object({
  id: z.string().uuid().optional(),
  property_id: z.string().uuid().nullable().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(9, "Valid phone number required"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(8),
  permissions: z.object({
    can_record_payments: z.boolean().default(true),
    can_manage_maintenance: z.boolean().default(true),
    can_view_tenants: z.boolean().default(true),
    can_send_announcements: z.boolean().default(false),
  }),
  status: z.enum(["active", "suspended"]).default("active"),
});

// Helper: Ensure caretakers table or fallback metadata storage exists
async function ensureCaretakersTable() {
  try {
    await supabaseAdmin.rpc("create_caretakers_table_if_missing" as never);
  } catch {
    // If RPC doesn't exist, proceed with direct table operations
  }
}

/**
 * 1. Landlord: List Caretakers
 */
export const listCaretakers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureCaretakersTable();

    try {
      const { data, error } = await supabaseAdmin
        .from("caretakers" as never)
        .select("*, properties:property_id(id, name, code)")
        .eq("landlord_id", context.userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as unknown as CaretakerRecord[]) ?? [];
    } catch (err) {
      console.warn("Caretakers table query fallback:", err);
      // Fallback: Read from landlord profile metadata if table not yet created
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", context.userId)
        .maybeSingle();

      const profileObj = profile as unknown as { metadata?: { caretakers?: CaretakerRecord[] } } | null;
      const caretakersList = profileObj?.metadata?.caretakers || [];
      return caretakersList;
    }
  });

/**
 * 2. Landlord: Save (Create / Update) Caretaker
 */
export const saveCaretaker = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => caretakerSchema.parse(d))
  .handler(async ({ data, context }) => {
    const cleanPhone = data.phone.trim().replace(/\s+/g, "");
    const cleanPin = data.pin.trim();

    try {
      if (data.id) {
        // Update existing
        const { error } = await supabaseAdmin
          .from("caretakers" as never)
          .update({
            property_id: data.property_id || null,
            name: data.name.trim(),
            phone: cleanPhone,
            pin: cleanPin,
            permissions: data.permissions,
            status: data.status,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", data.id)
          .eq("landlord_id", context.userId);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabaseAdmin.from("caretakers" as never).insert({
          landlord_id: context.userId,
          property_id: data.property_id || null,
          name: data.name.trim(),
          phone: cleanPhone,
          pin: cleanPin,
          permissions: data.permissions,
          status: data.status,
          created_at: new Date().toISOString(),
        } as never);

        if (error) throw error;
      }

      return { ok: true };
    } catch (err) {
      console.warn("Caretaker table insert fallback to profile metadata:", err);
      // Fallback metadata sync
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", context.userId)
        .maybeSingle();

      const profileObj = profile as unknown as { metadata?: { caretakers?: CaretakerRecord[] } & Record<string, unknown> } | null;
      const meta = profileObj?.metadata || {};
      let caretakersList = (meta.caretakers || []).slice();

      if (data.id) {
        caretakersList = caretakersList.map((c) =>
          c.id === data.id
            ? {
                ...c,
                property_id: data.property_id || null,
                name: data.name.trim(),
                phone: cleanPhone,
                pin: cleanPin,
                permissions: data.permissions,
                status: data.status,
                updated_at: new Date().toISOString(),
              }
            : c,
        );
      } else {
        const newRecord: CaretakerRecord = {
          id: `ct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          landlord_id: context.userId,
          property_id: data.property_id || null,
          name: data.name.trim(),
          phone: cleanPhone,
          pin: cleanPin,
          permissions: data.permissions,
          status: data.status,
          created_at: new Date().toISOString(),
        };
        caretakersList.unshift(newRecord);
      }

      await supabaseAdmin
        .from("profiles")
        .update({ metadata: { ...meta, caretakers: caretakersList } } as never)
        .eq("id", context.userId);

      return { ok: true };
    }
  });

/**
 * 3. Landlord: Delete / Revoke Caretaker
 */
export const deleteCaretaker = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    try {
      const { error } = await supabaseAdmin
        .from("caretakers" as never)
        .delete()
        .eq("id", data.id)
        .eq("landlord_id", context.userId);

      if (error) throw error;
    } catch {
      // Fallback: Remove from profile metadata
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", context.userId)
        .maybeSingle();

      const profileObj = profile as unknown as { metadata?: { caretakers?: CaretakerRecord[] } & Record<string, unknown> } | null;
      const meta = profileObj?.metadata || {};
      const caretakersList = (meta.caretakers || []).filter((c) => c.id !== data.id);

      await supabaseAdmin
        .from("profiles")
        .update({ metadata: { ...meta, caretakers: caretakersList } } as never)
        .eq("id", context.userId);
    }

    return { ok: true };
  });

/**
 * 4. Caretaker Authentication (Phone + PIN)
 */
export const caretakerLogin = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        phone: z.string().min(9),
        pin: z.string().min(4),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const cleanPhone = data.phone.trim().replace(/\s+/g, "");
    const cleanPin = data.pin.trim();

    let caretaker: CaretakerRecord | null = null;

    try {
      const { data: ct, error } = await supabaseAdmin
        .from("caretakers" as never)
        .select("*, properties:property_id(id, name, code)")
        .eq("phone", cleanPhone)
        .eq("pin", cleanPin)
        .eq("status", "active")
        .maybeSingle();

      if (!error && ct) {
        caretaker = ct as unknown as CaretakerRecord;
      }
    } catch (e) {
      console.warn("DB query error for caretaker login:", e);
    }

    // Fallback: search profile metadata across landlords
    if (!caretaker) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, company_name, metadata" as never)
        .not("metadata" as never, "is", null);

      for (const p of profiles || []) {
        const profileObj = p as unknown as { metadata?: { caretakers?: CaretakerRecord[] } };
        const list = profileObj?.metadata?.caretakers || [];
        const match = list.find(
          (c) =>
            c.phone.replace(/\s+/g, "") === cleanPhone &&
            c.pin === cleanPin &&
            c.status === "active",
        );
        if (match) {
          caretaker = match;
          break;
        }
      }
    }

    if (!caretaker) {
      return { ok: false as const, error: "Invalid caretaker phone number or access PIN." };
    }

    // Fetch landlord branding
    const { data: landlordProfile } = await supabaseAdmin
      .from("profiles")
      .select("company_name, phone, currency, logo_url")
      .eq("id", caretaker.landlord_id)
      .maybeSingle();

    return {
      ok: true as const,
      caretaker: {
        id: caretaker.id,
        landlord_id: caretaker.landlord_id,
        property_id: caretaker.property_id,
        name: caretaker.name,
        phone: caretaker.phone,
        permissions: caretaker.permissions,
        landlord_company: landlordProfile?.company_name || "Property Management",
        landlord_phone: landlordProfile?.phone || "",
        currency: landlordProfile?.currency || "KSh",
      },
    };
  });

/**
 * 5. Caretaker Portal Data (Properties, Tenants, Units, Maintenance)
 */
export const getCaretakerPortalData = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        caretaker_id: z.string(),
        landlord_id: z.string(),
        property_id: z.string().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Get properties assigned to this caretaker (or all landlord properties if null)
    let propQuery = supabaseAdmin
      .from("properties")
      .select("id, name, code, property_type, units_count, image_url")
      .eq("landlord_id", data.landlord_id);

    if (data.property_id) {
      propQuery = propQuery.eq("id", data.property_id);
    }
    const { data: properties } = await propQuery;
    const propertyIds = (properties || []).map((p) => p.id);

    // 2. Get units for these properties
    const { data: units } = await supabaseAdmin
      .from("units")
      .select("id, unit_number, room_number, floor, rent, deposit, status, property_id")
      .in("property_id", propertyIds.length ? propertyIds : ["00000000-0000-0000-0000-000000000000"])
      .order("unit_number");

    // 3. Get tenants for these properties
    const { data: tenants } = await supabaseAdmin
      .from("tenants")
      .select("id, full_name, phone, rent_amount, status, unit_id, property_id, properties(name, code), units(unit_number, room_number)")
      .in("property_id", propertyIds.length ? propertyIds : ["00000000-0000-0000-0000-000000000000"])
      .eq("status", "active")
      .order("full_name");

    // 4. Get recent receipts issued for these properties
    const { data: receipts } = await supabaseAdmin
      .from("receipts")
      .select("id, receipt_number, public_id, amount, balance, issued_at, issued_by, snapshot, tenant_id, tenants(full_name)")
      .eq("landlord_id", data.landlord_id)
      .order("issued_at", { ascending: false })
      .limit(30);

    // 5. Get maintenance tickets
    const { data: maintenance } = await supabaseAdmin
      .from("maintenance_requests")
      .select("id, category, priority, status, description, created_at, tenants(full_name, phone), properties(name), units(unit_number)")
      .in("property_id", propertyIds.length ? propertyIds : ["00000000-0000-0000-0000-000000000000"])
      .order("created_at", { ascending: false })
      .limit(30);

    return {
      properties: properties || [],
      units: units || [],
      tenants: tenants || [],
      receipts: receipts || [],
      maintenance: maintenance || [],
    };
  });

/**
 * 6. Caretaker Action: Record Rent Payment & Issue Landlord Receipt On-Site
 */
export const caretakerRecordPayment = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        caretaker_id: z.string(),
        landlord_id: z.string(),
        caretaker_name: z.string(),
        tenant_id: z.string().uuid(),
        amount: z.number().positive(),
        method: z.enum(["mpesa", "cash", "bank", "cheque", "other"]).default("mpesa"),
        reference: z.string().optional(),
        paid_at: z.string().default(() => new Date().toISOString().slice(0, 10)),
        period_label: z.string().optional(),
        notes: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Fetch tenant details
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .select("*, properties(name, code), units(unit_number, room_number)")
      .eq("id", data.tenant_id)
      .eq("landlord_id", data.landlord_id)
      .single();

    if (tenantError || !tenant) {
      throw new Error("Tenant record not found or unauthorized for this property.");
    }

    const period = data.period_label || data.paid_at.slice(0, 7);
    const monthlyRent = Number(tenant.rent_amount ?? 0);

    // 2. Calculate cumulative balance across tenant tenancy
    const startPeriod = (tenant.lease_start || tenant.created_at || period).slice(0, 7);
    let monthsElapsed = 1;
    try {
      const sY = parseInt(startPeriod.slice(0, 4));
      const sM = parseInt(startPeriod.slice(5, 7));
      const pY = parseInt(period.slice(0, 4));
      const pM = parseInt(period.slice(5, 7));
      monthsElapsed = Math.max((pY - sY) * 12 + (pM - sM) + 1, 1);
    } catch {}

    const totalRentAccrued = monthsElapsed * monthlyRent;

    // Fetch all existing payments for this tenant
    const { data: allPayments } = await supabaseAdmin
      .from("payments")
      .select("amount, period_label, paid_at")
      .eq("tenant_id", tenant.id)
      .eq("landlord_id", data.landlord_id);

    const paidBeforeAll = (allPayments ?? []).reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);
    const paidBeforePeriod = (allPayments ?? [])
      .filter((p: any) => p.period_label === period || (p.paid_at && p.paid_at.startsWith(period)))
      .reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);

    const totalRemainingBalance = Math.max(totalRentAccrued - (paidBeforeAll + data.amount), 0);
    const periodRemainingBalance = Math.max(monthlyRent - (paidBeforePeriod + data.amount), 0);
    const priorArrears = Math.max(totalRemainingBalance - periodRemainingBalance, 0);

    const { data: payment, error: payError } = await supabaseAdmin
      .from("payments")
      .insert({
        landlord_id: data.landlord_id,
        tenant_id: tenant.id,
        property_id: tenant.property_id,
        unit_id: tenant.unit_id,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        paid_at: data.paid_at,
        period_label: period,
        status: totalRemainingBalance > 0 ? "partial" : "paid",
        notes: data.notes ? `${data.notes} (Issued by Caretaker: ${data.caretaker_name})` : `Issued on-site by Caretaker: ${data.caretaker_name}`,
      })
      .select()
      .single();

    if (payError || !payment) throw payError || new Error("Failed to record payment.");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("company_name, currency, logo_url, phone")
      .eq("id", data.landlord_id)
      .maybeSingle();

    const receiptNumber = `RCP-${data.paid_at.replaceAll("-", "").slice(0, 6)}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    // 5. Generate Official QR Receipt
    const { data: receipt, error: receiptError } = await supabaseAdmin
      .from("receipts")
      .insert({
        landlord_id: data.landlord_id,
        payment_id: payment.id,
        tenant_id: tenant.id,
        receipt_number: receiptNumber,
        amount: data.amount,
        balance: totalRemainingBalance,
        issued_by: `${data.caretaker_name} (Caretaker) · ${profile?.company_name || "Codevanta"}`,
        snapshot: {
          company: profile?.company_name ?? "RentReceiptPro Landlord",
          currency: profile?.currency ?? "KSh",
          logo_url: profile?.logo_url ?? null,
          company_phone: profile?.phone ?? null,
          tenant_name: tenant.full_name,
          tenant_phone: tenant.phone,
          property_code: tenant.properties?.code ?? null,
          unit: tenant.units?.unit_number ?? null,
          room: tenant.units?.room_number ?? null,
          method: data.method,
          reference: data.reference ?? null,
          period: period,
          paid_at: data.paid_at,
          rent_amount: Number(tenant.rent_amount),
          prior_arrears: priorArrears,
          total_balance: totalRemainingBalance,
          period_balance: periodRemainingBalance,
        },
      })
      .select("id, public_id, receipt_number")
      .single();

    if (receiptError || !receipt) throw receiptError || new Error("Failed to issue digital receipt.");

    await supabaseAdmin.from("notifications").insert({
      landlord_id: data.landlord_id,
      title: "On-site Receipt Issued by Caretaker",
      body: `Caretaker ${data.caretaker_name} issued ${receiptNumber} (KSh ${data.amount.toLocaleString()}) to ${tenant.full_name} (${tenant.properties?.name || "Unit"}).`,
      type: "receipt",
    });

    return {
      ok: true,
      publicId: receipt.public_id,
      receiptNumber: receipt.receipt_number,
      balance: totalRemainingBalance,
    };
  });

/**
 * 7. Caretaker Action: Update Maintenance Ticket
 */
export const caretakerUpdateMaintenance = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        ticket_id: z.string().uuid(),
        status: z.enum(["pending", "in_progress", "resolved", "cancelled"]),
        caretaker_name: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("maintenance_requests")
      .update({
        status: data.status,
      })
      .eq("id", data.ticket_id);

    if (error) throw error;
    return { ok: true };
  });

