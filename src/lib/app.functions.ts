import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  announcementSchema,
  paymentSchema,
  propertySchema,
  settingsSchema,
  tenantSchema,
  unitSchema,
} from "./schemas";
import { z } from "zod";
import { clean } from "./clean";

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => settingsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(clean(data))
      .eq("id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const mine = context.userId;
    const [properties, units, tenants, payments, receipts, requests, notifications] =
      await Promise.all([
        sb
          .from("properties")
          .select("id,name,code,status,units_count,image_url,property_type")
          .eq("landlord_id", mine),
        sb.from("units").select("id,status,rent,property_id").eq("landlord_id", mine),
        sb
          .from("tenants")
          .select("id,full_name,rent_amount,status,lease_end,unit_id,property_id")
          .eq("landlord_id", mine),
        sb
          .from("payments")
          .select("id,amount,paid_at,method,status,tenant_id")
          .eq("landlord_id", mine)
          .order("paid_at", { ascending: false }),
        sb
          .from("receipts")
          .select("id,receipt_number,public_id,amount,issued_at,tenant_id")
          .eq("landlord_id", mine)
          .order("issued_at", { ascending: false })
          .limit(6),
        sb
          .from("maintenance_requests")
          .select("id,status,category,priority,created_at,description")
          .eq("landlord_id", mine),
        sb
          .from("notifications")
          .select("*")
          .eq("landlord_id", mine)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

    const unitRows = units.data ?? [];
    const tenantRows = tenants.data ?? [];
    const paymentRows = payments.data ?? [];
    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7);

    const monthlyIncome = paymentRows
      .filter((p) => (p.paid_at ?? "").startsWith(monthKey))
      .reduce((s, p) => s + Number(p.amount), 0);
    const expectedMonthly = tenantRows
      .filter((t) => t.status === "active")
      .reduce((s, t) => s + Number(t.rent_amount), 0);

    const revenueByMonth: { month: string; income: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      revenueByMonth.push({
        month: d.toLocaleDateString("en-GB", { month: "short" }),
        income: paymentRows
          .filter((p) => (p.paid_at ?? "").startsWith(key))
          .reduce((s, p) => s + Number(p.amount), 0),
      });
    }

    const soon = new Date(now.getTime() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    return {
      properties: properties.data ?? [],
      totals: {
        properties: (properties.data ?? []).length,
        units: unitRows.length,
        occupied: unitRows.filter((u) => u.status === "occupied").length,
        vacant: unitRows.filter((u) => u.status !== "occupied").length,
        tenants: tenantRows.length,
        monthlyIncome,
        expectedMonthly,
        outstanding: Math.max(expectedMonthly - monthlyIncome, 0),
        receipts: (receipts.data ?? []).length,
        openRequests: (requests.data ?? []).filter((r) => r.status !== "resolved").length,
      },
      revenueByMonth,
      recentPayments: paymentRows.slice(0, 6),
      recentReceipts: receipts.data ?? [],
      requests: requests.data ?? [],
      notifications: notifications.data ?? [],
      expiringLeases: tenantRows.filter((t) => t.lease_end && t.lease_end <= soon),
      tenants: tenantRows,
    };
  });

export const listProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("properties")
      .select("*, units(id,status,rent)")
      .eq("landlord_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const saveProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => propertySchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const payload = clean({ ...rest, code: rest.code.toUpperCase(), landlord_id: context.userId });
    const query = id
      ? context.supabase
          .from("properties")
          .update(payload)
          .eq("id", id)
          .eq("landlord_id", context.userId)
      : context.supabase.from("properties").insert(payload);
    const { error } = await query;
    if (error) throw error;
    return { ok: true };
  });

export const deleteProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("properties")
      .delete()
      .eq("id", data.id)
      .eq("landlord_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const listUnits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ propertyId: z.string().uuid().optional() }).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("units")
      .select("*, tenants(id,full_name,phone)")
      .eq("landlord_id", context.userId)
      .order("unit_number");
    if (data.propertyId) query = query.eq("property_id", data.propertyId);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows;
  });

export const saveUnit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => unitSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const payload = clean({ ...rest, landlord_id: context.userId });
    const { error } = id
      ? await context.supabase
          .from("units")
          .update(payload)
          .eq("id", id)
          .eq("landlord_id", context.userId)
      : await context.supabase.from("units").insert(payload);
    if (error) throw error;
    return { ok: true };
  });

export const deleteUnit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("units")
      .delete()
      .eq("id", data.id)
      .eq("landlord_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const listTenants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tenants")
      .select("*, properties(name,code), units(unit_number,room_number)")
      .eq("landlord_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const saveTenant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => tenantSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const payload = clean({
      ...rest,
      email: rest.email || null,
      lease_start: rest.lease_start || null,
      lease_end: rest.lease_end || null,
      landlord_id: context.userId,
    });
    const { error } = id
      ? await context.supabase
          .from("tenants")
          .update(payload)
          .eq("id", id)
          .eq("landlord_id", context.userId)
      : await context.supabase.from("tenants").insert(payload);
    if (error) throw error;
    if (rest.unit_id) {
      await context.supabase
        .from("units")
        .update({ status: "occupied" })
        .eq("id", rest.unit_id)
        .eq("landlord_id", context.userId);
    }
    return { ok: true };
  });

export const deleteTenant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("tenants")
      .delete()
      .eq("id", data.id)
      .eq("landlord_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("payments")
      .select(
        "*, tenants(full_name,phone,rent_amount), properties(name), units(unit_number,room_number), receipts(id,receipt_number,public_id)",
      )
      .eq("landlord_id", context.userId)
      .order("paid_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const recordPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => paymentSchema.parse(data))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: tenant, error: tenantError } = await sb
      .from("tenants")
      .select("*, properties(name,code), units(unit_number,room_number)")
      .eq("id", data.tenant_id)
      .eq("landlord_id", context.userId)
      .single();
    if (tenantError) throw tenantError;

    const period = data.period_label || data.paid_at.slice(0, 7);
    const { data: existing } = await sb
      .from("payments")
      .select("amount")
      .eq("tenant_id", tenant.id)
      .eq("landlord_id", context.userId)
      .eq("period_label", period);
    const paidBefore = (existing ?? []).reduce((s, p) => s + Number(p.amount), 0);
    const balance = Number(tenant.rent_amount) - (paidBefore + data.amount);

    const { data: payment, error } = await sb
      .from("payments")
      .insert({
        landlord_id: context.userId,
        tenant_id: tenant.id,
        property_id: tenant.property_id,
        unit_id: tenant.unit_id,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        paid_at: data.paid_at,
        period_label: period,
        status: balance > 0 ? "partial" : "paid",
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;

    const { data: profile } = await sb
      .from("profiles")
      .select("company_name,currency,logo_url,phone")
      .eq("id", context.userId)
      .maybeSingle();

    const receiptNumber = `RCP-${data.paid_at.replaceAll("-", "").slice(0, 6)}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const { data: receipt, error: receiptError } = await sb
      .from("receipts")
      .insert({
        landlord_id: context.userId,
        payment_id: payment.id,
        tenant_id: tenant.id,
        receipt_number: receiptNumber,
        amount: data.amount,
        balance,
        issued_by: data.issued_by || profile?.company_name || "Codevanta Ventures",
        snapshot: {
          company: profile?.company_name ?? "Codevanta Ventures",
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
      .select("id,public_id,receipt_number")
      .single();
    if (receiptError) throw receiptError;

    await sb.from("notifications").insert({
      landlord_id: context.userId,
      title: "Receipt generated",
      body: `${receiptNumber} for ${tenant.full_name}`,
      type: "receipt",
    });

    return { publicId: receipt.public_id, receiptNumber: receipt.receipt_number, balance };
  });

export const listReceipts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("receipts")
      .select("*, tenants(full_name,phone)")
      .eq("landlord_id", context.userId)
      .order("issued_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const listRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("maintenance_requests")
      .select("*, tenants(full_name,phone), properties(name), units(unit_number,room_number)")
      .eq("landlord_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const updateRequestStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["open", "in_progress", "resolved"]) }).parse(
      data,
    ),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("maintenance_requests")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("landlord_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const listAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("announcements")
      .select("*, properties(name)")
      .eq("landlord_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const saveAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => announcementSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("announcements")
      .insert(clean({ ...data, property_id: data.property_id || null, landlord_id: context.userId }));
    if (error) throw error;
    return { ok: true };
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("announcements")
      .delete()
      .eq("id", data.id)
      .eq("landlord_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

export const globalSearch = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ term: z.string().trim().min(2).max(80) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const like = `%${data.term}%`;
    const mine = context.userId;
    const [tenants, properties, receipts] = await Promise.all([
      sb
        .from("tenants")
        .select("id,full_name,phone,status")
        .eq("landlord_id", mine)
        .or(`full_name.ilike.${like},phone.ilike.${like},national_id.ilike.${like}`)
        .limit(6),
      sb
        .from("properties")
        .select("id,name,code")
        .eq("landlord_id", mine)
        .or(`name.ilike.${like},code.ilike.${like}`)
        .limit(6),
      sb
        .from("receipts")
        .select("id,receipt_number,public_id,amount")
        .eq("landlord_id", mine)
        .ilike("receipt_number", like)
        .limit(6),
    ]);
    return {
      tenants: tenants.data ?? [],
      properties: properties.data ?? [],
      receipts: receipts.data ?? [],
    };
  });

export const getReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const mine = context.userId;
    const [payments, tenants, units] = await Promise.all([
      sb.from("payments").select("amount,paid_at,method,status,tenant_id").eq("landlord_id", mine),
      sb.from("tenants").select("id,full_name,rent_amount,status").eq("landlord_id", mine),
      sb.from("units").select("id,status,rent").eq("landlord_id", mine),
    ]);
    return {
      payments: payments.data ?? [],
      tenants: tenants.data ?? [],
      units: units.data ?? [],
    };
  });