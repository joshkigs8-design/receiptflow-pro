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

      const meta = (profile as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const caretakersList = (meta?.caretakers as CaretakerRecord[]) || [];
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

      const meta = ((profile as Record<string, unknown>)?.metadata as Record<string, unknown>) || {};
      let caretakersList = ((meta.caretakers as CaretakerRecord[]) || []).slice();

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

      const meta = ((profile as Record<string, unknown>)?.metadata as Record<string, unknown>) || {};
      const caretakersList = ((meta.caretakers as CaretakerRecord[]) || []).filter((c) => c.id !== data.id);

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
        const meta = (p as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
        const list = (meta?.caretakers as CaretakerRecord[]) || [];
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

    // 2. Calculate balance
    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("tenant_id", tenant.id)
      .eq("landlord_id", data.landlord_id)
      .eq("period_label", period);

    const paidBefore = (existing ?? []).reduce((s, p) => s + Number(p.amount), 0);
    const balance = Number(tenant.rent_amount) - (paidBefore + data.amount);

    // 3. Insert payment record
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
        status: balance > 0 ? "partial" : "paid",
        notes: data.notes ? `${data.notes} (Issued by Caretaker: ${data.caretaker_name})` : `Issued on-site by Caretaker: ${data.caretaker_name}`,
      })
      .select()
      .single();

    if (payError || !payment) throw payError || new Error("Failed to record payment.");

    // 4. Fetch Landlord Profile Branding
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
        balance,
        issued_by: `${data.caretaker_name} (Caretaker) · ${profile?.company_name || "Codevanta"}`,
        snapshot: {
          company: profile?.company_name ?? "RentReceiptPro Landlord",
          currency: profile?.currency ?? "KSh",
          logo_url: profile?.logo_url ?? null,
          company_phone: profile?.phone ?? null,
          tenant_name: tenant.full_name,
          tenant_phone: tenant.phone,
          property: tenant.properties?.name ?? null,
          property_code: tenant.properties?.code ?? null,
          unit: tenant.units?.unit_number ?? null,
          room: tenant.units?.room_number ?? null,
          method: data.method,
          reference: data.reference ?? null,
          period: period,
          paid_at: data.paid_at,
          rent_amount: Number(tenant.rent_amount),
        },
      })
      .select("id, public_id, receipt_number")
      .single();

    if (receiptError || !receipt) throw receiptError || new Error("Failed to issue digital receipt.");

    // 6. Notify Master Landlord
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
      balance,
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.ticket_id);

    if (error) throw error;
    return { ok: true };
  });

export type CaretakerTenantRequest = {
  id: string;
  landlord_id: string;
  caretaker_id: string;
  caretaker_name: string;
  property_id: string;
  unit_id: string | null;
  tenant_id: string | null;
  request_type: "add_tenant" | "vacate_tenant";
  status: "pending" | "approved" | "rejected";
  data: {
    full_name?: string;
    phone?: string;
    email?: string | null;
    rent_amount?: number;
    deposit_paid?: number;
    emergency_contact?: string | null;
    lease_start?: string | null;
    notes?: string | null;
    reason?: string | null;
    departure_date?: string | null;
  };
  created_at: string;
  resolved_at?: string | null;
  properties?: { name: string; code: string } | null;
  units?: { unit_number: string; room_number: string | null } | null;
  tenants?: { full_name: string; phone: string } | null;
};

/**
 * 8. Caretaker: Submit Request to Add / Onboard New Tenant
 */
export const caretakerRequestAddTenant = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        caretaker_id: z.string(),
        landlord_id: z.string(),
        caretaker_name: z.string(),
        property_id: z.string().uuid(),
        unit_id: z.string().uuid(),
        full_name: z.string().min(2),
        phone: z.string().min(9),
        email: z.string().email().optional().or(z.literal("")),
        rent_amount: z.number().positive(),
        deposit_paid: z.number().nonnegative().default(0),
        emergency_contact: z.string().optional(),
        lease_start: z.string().optional(),
        notes: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Fetch unit & property names for clear notification
    const { data: unit } = await supabaseAdmin
      .from("units")
      .select("unit_number, properties(name)")
      .eq("id", data.unit_id)
      .maybeSingle();

    const unitNumber = unit?.unit_number || "Unit";
    const propName = (unit?.properties as { name?: string })?.name || "Property";

    const requestPayload = {
      landlord_id: data.landlord_id,
      caretaker_id: data.caretaker_id,
      caretaker_name: data.caretaker_name,
      property_id: data.property_id,
      unit_id: data.unit_id,
      tenant_id: null,
      request_type: "add_tenant",
      status: "pending",
      data: {
        full_name: data.full_name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        rent_amount: data.rent_amount,
        deposit_paid: data.deposit_paid,
        emergency_contact: data.emergency_contact?.trim() || null,
        lease_start: data.lease_start || new Date().toISOString().slice(0, 10),
        notes: data.notes?.trim() || null,
      },
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .insert(requestPayload as never);

      if (error) throw error;
    } catch (e) {
      console.warn("Table insert fallback for caretaker_tenant_requests:", e);
      // Fallback: Store in landlord profile metadata
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", data.landlord_id)
        .maybeSingle();

      const meta = ((profile as Record<string, unknown>)?.metadata as Record<string, unknown>) || {};
      const reqList = ((meta.caretaker_requests as CaretakerTenantRequest[]) || []).slice();
      reqList.unshift({
        id: `ctreq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ...requestPayload,
      } as CaretakerTenantRequest);

      await supabaseAdmin
        .from("profiles")
        .update({ metadata: { ...meta, caretaker_requests: reqList } } as never)
        .eq("id", data.landlord_id);
    }

    // Notify Landlord
    await supabaseAdmin.from("notifications").insert({
      landlord_id: data.landlord_id,
      title: "Pending Tenant Onboarding Request",
      body: `Caretaker ${data.caretaker_name} requested to add tenant ${data.full_name} (${data.phone}) to Room ${unitNumber} at ${propName}. Requires your confirmation.`,
      type: "tenant",
    });

    return { ok: true };
  });

/**
 * 9. Caretaker: Submit Request to Vacate / Move-Out Tenant
 */
export const caretakerRequestVacateTenant = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        caretaker_id: z.string(),
        landlord_id: z.string(),
        caretaker_name: z.string(),
        tenant_id: z.string().uuid(),
        reason: z.string().min(2),
        departure_date: z.string().default(() => new Date().toISOString().slice(0, 10)),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Fetch tenant & property
    const { data: tenant } = await supabaseAdmin
      .from("tenants")
      .select("id, full_name, phone, unit_id, property_id, properties(name), units(unit_number)")
      .eq("id", data.tenant_id)
      .eq("landlord_id", data.landlord_id)
      .single();

    if (!tenant) throw new Error("Tenant record not found.");

    const unitNumber = tenant.units?.unit_number || "Unit";
    const propName = tenant.properties?.name || "Property";

    const requestPayload = {
      landlord_id: data.landlord_id,
      caretaker_id: data.caretaker_id,
      caretaker_name: data.caretaker_name,
      property_id: tenant.property_id,
      unit_id: tenant.unit_id,
      tenant_id: tenant.id,
      request_type: "vacate_tenant",
      status: "pending",
      data: {
        full_name: tenant.full_name,
        phone: tenant.phone,
        reason: data.reason.trim(),
        departure_date: data.departure_date,
      },
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .insert(requestPayload as never);

      if (error) throw error;
    } catch (e) {
      console.warn("Table insert fallback for vacate tenant request:", e);
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", data.landlord_id)
        .maybeSingle();

      const meta = ((profile as Record<string, unknown>)?.metadata as Record<string, unknown>) || {};
      const reqList = ((meta.caretaker_requests as CaretakerTenantRequest[]) || []).slice();
      reqList.unshift({
        id: `ctreq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ...requestPayload,
      } as CaretakerTenantRequest);

      await supabaseAdmin
        .from("profiles")
        .update({ metadata: { ...meta, caretaker_requests: reqList } } as never)
        .eq("id", data.landlord_id);
    }

    // Notify Landlord
    await supabaseAdmin.from("notifications").insert({
      landlord_id: data.landlord_id,
      title: "Pending Tenant Move-Out Request",
      body: `Caretaker ${data.caretaker_name} requested move-out for ${tenant.full_name} (Room ${unitNumber} at ${propName}). Reason: ${data.reason}. Requires your confirmation.`,
      type: "tenant",
    });

    return { ok: true };
  });

/**
 * 10. Landlord: List Pending Caretaker Requests
 */
export const listPendingCaretakerRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    let requests: CaretakerTenantRequest[] = [];

    try {
      const { data, error } = await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .select(
          "*, properties:property_id(name, code), units:unit_id(unit_number, room_number), tenants:tenant_id(full_name, phone)",
        )
        .eq("landlord_id", context.userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!error && data) {
        requests = data as unknown as CaretakerTenantRequest[];
      }
    } catch {
      // Fallback
    }

    if (!requests.length) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", context.userId)
        .maybeSingle();

      const meta = (profile as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const allReqs = (meta?.caretaker_requests as CaretakerTenantRequest[]) || [];
      requests = allReqs.filter((r) => r.status === "pending");
    }

    return requests;
  });

/**
 * 11. Landlord: Resolve (Approve / Reject) Caretaker Request
 */
export const resolveCaretakerRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        request_id: z.string(),
        action: z.enum(["approve", "reject"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    // 1. Find request
    let request: CaretakerTenantRequest | null = null;

    try {
      const { data: req } = await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .select("*")
        .eq("id", data.request_id)
        .eq("landlord_id", context.userId)
        .maybeSingle();

      if (req) request = req as unknown as CaretakerTenantRequest;
    } catch {
      // Fallback
    }

    let isFromMetadata = false;
    let metaHolder: Record<string, unknown> = {};

    if (!request) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", context.userId)
        .maybeSingle();

      metaHolder = ((profile as Record<string, unknown>)?.metadata as Record<string, unknown>) || {};
      const allReqs = (metaHolder.caretaker_requests as CaretakerTenantRequest[]) || [];
      request = allReqs.find((r) => r.id === data.request_id) || null;
      isFromMetadata = true;
    }

    if (!request) throw new Error("Caretaker request not found.");

    if (data.action === "approve") {
      if (request.request_type === "add_tenant") {
        // Create Tenant in tenants table
        const { error: insErr } = await supabaseAdmin.from("tenants").insert({
          landlord_id: context.userId,
          property_id: request.property_id,
          unit_id: request.unit_id,
          full_name: request.data.full_name || "New Tenant",
          phone: request.data.phone || "",
          email: request.data.email || null,
          rent_amount: request.data.rent_amount || 0,
          deposit_paid: request.data.deposit_paid || 0,
          emergency_contact: request.data.emergency_contact || null,
          lease_start: request.data.lease_start || new Date().toISOString().slice(0, 10),
          status: "active",
        });

        if (insErr) throw insErr;

        // Mark unit occupied
        if (request.unit_id) {
          await supabaseAdmin
            .from("units")
            .update({ status: "occupied" })
            .eq("id", request.unit_id)
            .eq("landlord_id", context.userId);
        }
      } else if (request.request_type === "vacate_tenant" && request.tenant_id) {
        // Free unit
        if (request.unit_id) {
          await supabaseAdmin
            .from("units")
            .update({ status: "vacant" })
            .eq("id", request.unit_id)
            .eq("landlord_id", context.userId);
        }

        // Delete the tenant record (or set status: vacated and unit_id: null if foreign key exists)
        const { error: delErr } = await supabaseAdmin
          .from("tenants")
          .delete()
          .eq("id", request.tenant_id)
          .eq("landlord_id", context.userId);

        if (delErr) {
          await supabaseAdmin
            .from("tenants")
            .update({
              status: "vacated",
              unit_id: null,
              lease_end: request.data.departure_date || new Date().toISOString().slice(0, 10),
            })
            .eq("id", request.tenant_id)
            .eq("landlord_id", context.userId);
        }
      }
    }

    // Update status of request
    if (!isFromMetadata) {
      await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .update({
          status: data.action === "approve" ? "approved" : "rejected",
          resolved_at: new Date().toISOString(),
        } as never)
        .eq("id", data.request_id);
    } else {
      const allReqs = (metaHolder.caretaker_requests as CaretakerTenantRequest[]) || [];
      const updatedReqs = allReqs.map((r) =>
        r.id === data.request_id
          ? {
              ...r,
              status: (data.action === "approve" ? "approved" : "rejected") as "approved" | "rejected",
              resolved_at: new Date().toISOString(),
            }
          : r,
      );
      await supabaseAdmin
        .from("profiles")
        .update({ metadata: { ...metaHolder, caretaker_requests: updatedReqs } } as never)
        .eq("id", context.userId);
    }

    return { ok: true };
  });

/**
 * 12. Caretaker: List Own Submitted Requests
 */
export const listCaretakerOwnRequests = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        caretaker_id: z.string(),
        landlord_id: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    let requests: CaretakerTenantRequest[] = [];

    try {
      const { data: reqs, error } = await supabaseAdmin
        .from("caretaker_tenant_requests" as never)
        .select(
          "*, properties:property_id(name, code), units:unit_id(unit_number, room_number), tenants:tenant_id(full_name, phone)",
        )
        .eq("caretaker_id", data.caretaker_id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && reqs) {
        requests = reqs as unknown as CaretakerTenantRequest[];
      }
    } catch {
      // Fallback
    }

    if (!requests.length) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("metadata" as never)
        .eq("id", data.landlord_id)
        .maybeSingle();

      const meta = (profile as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const allReqs = (meta?.caretaker_requests as CaretakerTenantRequest[]) || [];
      requests = allReqs.filter((r) => r.caretaker_id === data.caretaker_id).slice(0, 20);
    }

    return requests;
  });

