import { createServerFn } from "@tanstack/react-start";
import { portalRequestSchema, portalVerifySchema } from "./schemas";
import { z } from "zod";

export const verifyTenant = createServerFn({ method: "POST" })
  .validator((data: unknown) => portalVerifySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id,name,code,address,landlord_id")
      .eq("code", data.code.toUpperCase())
      .maybeSingle();
    if (!property) return { ok: false as const, error: "No property found with that code." };

    const digits = data.phone.replace(/\D/g, "").slice(-9);
    const { data: tenants } = await supabaseAdmin
      .from("tenants")
      .select("*, units(unit_number,room_number,floor,rent,deposit)")
      .eq("property_id", property.id);

    const tenant = (tenants ?? []).find((t) => {
      const phoneMatch = t.phone.replace(/\D/g, "").endsWith(digits);
      const room = (t.units?.room_number ?? t.units?.unit_number ?? "").toLowerCase();
      return phoneMatch && room === data.room.trim().toLowerCase();
    });
    if (!tenant)
      return {
        ok: false as const,
        error: "We could not match that room number and phone number for this property.",
      };

    const [payments, receipts, announcements, requests, leases, landlordProfile] = await Promise.all([
      supabaseAdmin
        .from("payments")
        .select("id,amount,method,reference,paid_at,period_label,status,payment_method,reference_number")
        .eq("tenant_id", tenant.id)
        .order("paid_at", { ascending: false }),
      supabaseAdmin
        .from("receipts")
        .select("id,receipt_number,public_id,amount,balance,issued_at")
        .eq("tenant_id", tenant.id)
        .order("issued_at", { ascending: false }),
      supabaseAdmin
        .from("announcements")
        .select("id,title,body,category,created_at")
        .eq("landlord_id", property.landlord_id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("maintenance_requests")
        .select("id,category,description,priority,status,created_at")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("leases")
        .select("id,document_url,start_date,end_date,status")
        .eq("tenant_id", tenant.id),
      supabaseAdmin
        .from("profiles")
        .select("company_name,full_name,phone,business_details,logo_url")
        .eq("id", property.landlord_id)
        .maybeSingle(),
    ]);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthPayments = (payments.data ?? []).filter((p) => {
      const pPeriod = (p.period_label || "").trim();
      const pMonth = (p.paid_at || "").slice(0, 7);
      return pPeriod === currentMonth || pPeriod.startsWith(currentMonth) || pMonth === currentMonth;
    });
    const paidThisMonth = thisMonthPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const monthlyRent = Number(tenant.rent_amount ?? 0);
    const rentBalance = Math.max(monthlyRent - paidThisMonth, 0);

    const paidTotal = (payments.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);

    return {
      ok: true as const,
      tenant: {
        id: tenant.id,
        full_name: tenant.full_name,
        phone: tenant.phone,
        email: tenant.email,
        photo_url: tenant.photo_url,
        occupation: tenant.occupation,
        lease_start: tenant.lease_start,
        lease_end: tenant.lease_end,
        rent_amount: monthlyRent,
        deposit_paid: Number(tenant.deposit_paid ?? 0),
        status: tenant.status,
        unit: tenant.units?.unit_number ?? null,
        room: tenant.units?.room_number ?? null,
        floor: tenant.units?.floor ?? null,
      },
      property: { name: property.name, code: property.code, address: property.address },
      landlord: {
        company_name: landlordProfile.data?.company_name || "Property Management",
        full_name: landlordProfile.data?.full_name || "Landlord",
        phone: landlordProfile.data?.phone || "",
        business_details: landlordProfile.data?.business_details || "",
        logo_url: landlordProfile.data?.logo_url || null,
      },
      payments: payments.data ?? [],
      receipts: receipts.data ?? [],
      announcements: announcements.data ?? [],
      requests: requests.data ?? [],
      leases: leases.data ?? [],
      totals: {
        paidThisMonth,
        monthlyRent,
        rentBalance,
        status: paidThisMonth >= monthlyRent && monthlyRent > 0 ? ("PAID" as const) : paidThisMonth > 0 ? ("PARTIAL" as const) : ("UNPAID" as const),
        paidTotal,
      },
    };
  });

export const submitTenantRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => portalRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id,landlord_id")
      .eq("code", data.code.toUpperCase())
      .maybeSingle();
    if (!property) return { ok: false as const, error: "Property not found." };

    const digits = data.phone.replace(/\D/g, "").slice(-9);
    const { data: tenants } = await supabaseAdmin
      .from("tenants")
      .select("id,phone,unit_id,units(unit_number,room_number)")
      .eq("property_id", property.id);
    const tenant = (tenants ?? []).find((t) => {
      const room = (t.units?.room_number ?? t.units?.unit_number ?? "").toLowerCase();
      return t.phone.replace(/\D/g, "").endsWith(digits) && room === data.room.trim().toLowerCase();
    });
    if (!tenant) return { ok: false as const, error: "Verification failed." };

    const { error } = await supabaseAdmin.from("maintenance_requests").insert({
      landlord_id: property.landlord_id,
      tenant_id: tenant.id,
      property_id: property.id,
      unit_id: tenant.unit_id,
      category: data.category,
      description: data.description,
      priority: data.priority,
    });
    if (error) return { ok: false as const, error: "Could not submit request." };

    await supabaseAdmin.from("notifications").insert({
      landlord_id: property.landlord_id,
      title: "New maintenance request",
      body: data.description.slice(0, 140),
      type: "maintenance",
    });
    return { ok: true as const };
  });

export const getPublicReceipt = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z.object({ publicId: z.string().trim().min(6).max(64) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: receipt } = await supabaseAdmin
      .from("receipts")
      .select("receipt_number,public_id,amount,balance,issued_by,issued_at,snapshot")
      .eq("public_id", data.publicId)
      .maybeSingle();
    if (!receipt) return { ok: false as const };
    return { ok: true as const, receipt };
  });
