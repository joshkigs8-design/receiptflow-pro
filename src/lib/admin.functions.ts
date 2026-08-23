import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const voucherInput = z.object({
  code: z.string().trim().min(4).max(40),
  months: z.number().int().min(1).max(60),
  max_uses: z.number().int().min(1).max(10000),
  expires_at: z.string().optional().nullable(),
  note: z.string().max(200).optional().nullable(),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { admin: Boolean(data) };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [users, profiles, subs, payments, subPayments, props, units, tenants, redemptions, affiliates] =
      await Promise.all([
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        supabaseAdmin.from("profiles").select("id,full_name,company_name,phone,created_at"),
        supabaseAdmin.from("subscriptions").select("*"),
        supabaseAdmin.from("payments").select("id,landlord_id,amount,paid_at,payment_method,created_at"),
        supabaseAdmin
          .from("subscription_payments")
          .select("id,user_id,reference,plan,amount,currency,status,paid_at,created_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabaseAdmin.from("properties").select("id,landlord_id,name"),
        supabaseAdmin.from("units").select("id,property_id,unit_number,rent_amount"),
        supabaseAdmin.from("tenants").select("id,landlord_id,status,full_name"),
        supabaseAdmin
          .from("voucher_redemptions")
          .select("id,voucher_id,user_id,months,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabaseAdmin.from("affiliates").select("id,user_id,referral_code,status"),
      ]);

    const now = Date.now();
    const profileById = new Map((profiles.data ?? []).map((p) => [p.id, p]));
    const subByUser = new Map((subs.data ?? []).map((s) => [s.user_id, s]));
    const affiliateByUserId = new Map((affiliates.data ?? []).map((a) => [a.user_id, a]));

    const landlords = (users.data?.users ?? []).map((u) => {
      const sub = subByUser.get(u.id);
      const trialEnds = sub ? new Date(sub.trial_ends_at).getTime() : 0;
      const periodEnds = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : 0;
      const paidActive = periodEnds > now;
      const trialActive = !paidActive && trialEnds > now;
      const landlordPayments = (payments.data ?? []).filter((p) => p.landlord_id === u.id);

      return {
        id: u.id,
        email: u.email ?? "—",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        full_name: profileById.get(u.id)?.full_name ?? null,
        company_name: profileById.get(u.id)?.company_name ?? null,
        phone: profileById.get(u.id)?.phone ?? null,
        plan: sub?.plan ?? "—",
        status: sub?.status ?? "trial",
        state: paidActive ? "paid" : trialActive ? "trial" : "expired",
        endsAt: paidActive ? sub?.current_period_end : (sub?.trial_ends_at ?? null),
        properties: (props.data ?? []).filter((p) => p.landlord_id === u.id).length,
        tenants: (tenants.data ?? []).filter((t) => t.landlord_id === u.id).length,
        rentCollected: landlordPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0),
        paymentCount: landlordPayments.length,
        isAffiliate: affiliateByUserId.has(u.id),
      };
    });

    const successfulSubPayments = (subPayments.data ?? []).filter((p) => p.status === "success");
    const emailById = new Map(landlords.map((l) => [l.id, l.email]));
    const nameById = new Map(landlords.map((l) => [l.id, l.full_name || l.company_name || l.email]));

    // Calculate revenue breakdown by plan
    const planBreakdown = {
      monthly: successfulSubPayments.filter((p) => p.plan === "monthly").length,
      quarterly: successfulSubPayments.filter((p) => p.plan === "quarterly").length,
      semiannual: successfulSubPayments.filter((p) => p.plan === "semiannual").length,
      yearly: successfulSubPayments.filter((p) => p.plan === "yearly").length,
    };

    return {
      stats: {
        landlords: landlords.length,
        paying: landlords.filter((l) => l.state === "paid").length,
        onTrial: landlords.filter((l) => l.state === "trial").length,
        expired: landlords.filter((l) => l.state === "expired").length,
        revenue: successfulSubPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0),
        properties: (props.data ?? []).length,
        units: (units.data ?? []).length,
        tenants: (tenants.data ?? []).length,
        rentTracked: (payments.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0),
        rentReceiptsIssued: (payments.data ?? []).length,
        affiliatesCount: (affiliates.data ?? []).length,
        planBreakdown,
      },
      landlords: landlords.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
      payments: (subPayments.data ?? []).map((p) => ({
        ...p,
        email: emailById.get(p.user_id) ?? "—",
        name: nameById.get(p.user_id) ?? "—",
      })),
      redemptions: (redemptions.data ?? []).map((r) => ({
        ...r,
        email: emailById.get(r.user_id) ?? "—",
      })),
    };
  });

export const getLandlordPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ landlordId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [propsRes, unitsRes, tenantsRes, paymentsRes] = await Promise.all([
      supabaseAdmin.from("properties").select("*").eq("landlord_id", data.landlordId),
      supabaseAdmin.from("units").select("*, properties(name)").order("unit_number"),
      supabaseAdmin.from("tenants").select("*").eq("landlord_id", data.landlordId),
      supabaseAdmin
        .from("payments")
        .select("*")
        .eq("landlord_id", data.landlordId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    const propertyIds = new Set((propsRes.data ?? []).map((p) => p.id));
    const landlordUnits = (unitsRes.data ?? []).filter((u) => propertyIds.has(u.property_id));

    return {
      properties: propsRes.data ?? [],
      units: landlordUnits,
      tenants: tenantsRes.data ?? [],
      payments: paymentsRes.data ?? [],
    };
  });

export const updateLandlordSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      userId: z.string().uuid(),
      plan: z.enum(["monthly", "quarterly", "semiannual", "yearly"]).optional(),
      endsAt: z.string().optional().nullable(),
      status: z.enum(["active", "trial", "expired"]).optional(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const updatePayload: Record<string, any> = {};
    if (data.plan) updatePayload.plan = data.plan;
    if (data.status) updatePayload.status = data.status;
    if (data.endsAt !== undefined) {
      updatePayload.current_period_end = data.endsAt ? new Date(data.endsAt).toISOString() : null;
      if (data.endsAt && new Date(data.endsAt).getTime() > Date.now()) {
        updatePayload.status = "active";
      }
    }

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update(updatePayload)
      .eq("user_id", data.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPlatformPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [paymentsRes, tenantsRes, propsRes, usersRes] = await Promise.all([
      supabaseAdmin
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin.from("tenants").select("id,full_name,phone,email,landlord_id,unit_id"),
      supabaseAdmin.from("properties").select("id,name,landlord_id"),
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const tenantMap = new Map((tenantsRes.data ?? []).map((t) => [t.id, t]));
    const userMap = new Map((usersRes.data?.users ?? []).map((u) => [u.id, u.email]));
    const propMap = new Map((propsRes.data ?? []).map((p) => [p.id, p.name]));

    return (paymentsRes.data ?? []).map((p) => {
      const tenant = p.tenant_id ? tenantMap.get(p.tenant_id) : null;
      const landlordEmail = userMap.get(p.landlord_id) ?? "—";
      return {
        ...p,
        tenant_name: tenant?.full_name ?? "—",
        tenant_phone: tenant?.phone ?? "—",
        landlord_email: landlordEmail,
      };
    });
  });

export const listVouchers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { data, error } = await context.supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => voucherInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("vouchers").insert({
      code: data.code.toUpperCase(),
      months: data.months,
      max_uses: data.max_uses,
      expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
      note: data.note ?? null,
      created_by: context.userId,
    });
    if (error)
      throw new Error(
        error.message.includes("duplicate") ? "That code already exists" : error.message,
      );
    return { ok: true };
  });

export const setVoucherActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("vouchers")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("vouchers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const grantAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ userId: z.string().uuid(), months: z.number().int().min(1).max(60) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("current_period_end,trial_ends_at")
      .eq("user_id", data.userId)
      .maybeSingle();
    const candidates = [Date.now()];
    if (sub?.current_period_end) candidates.push(new Date(sub.current_period_end).getTime());
    if (sub?.trial_ends_at) candidates.push(new Date(sub.trial_ends_at).getTime());
    const base = new Date(Math.max(...candidates));
    base.setMonth(base.getMonth() + data.months);
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "active", current_period_end: base.toISOString() })
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true, endsAt: base.toISOString() };
  });

export const redeemVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ code: z.string().trim().min(4).max(40) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: res, error } = await context.supabase.rpc("redeem_voucher", {
      _code: data.code,
    });
    if (error) throw new Error(error.message);
    return res as { ok: boolean; message?: string; months?: number; ends_at?: string };
  });

// Affiliate admin functions
export const getAffiliateStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [affiliates, referrals, commissions, withdrawals, users] = await Promise.all([
      supabaseAdmin.from("affiliates").select("*"),
      supabaseAdmin.from("referrals").select("*"),
      supabaseAdmin.from("commissions").select("*"),
      supabaseAdmin.from("withdrawals").select("*"),
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const userMap = new Map((users.data?.users ?? []).map((u) => [u.id, u.email]));
    const affiliateMap = new Map((affiliates.data ?? []).map((a) => [a.user_id, a]));
    const commissionByAffiliate = new Map<string, number>();
    const withdrawalByAffiliate = new Map<string, { pending: number; paid: number; rejected: number }>();

    for (const c of commissions.data ?? []) {
      commissionByAffiliate.set(c.affiliate_id, (commissionByAffiliate.get(c.affiliate_id) ?? 0) + Number(c.amount ?? 0));
    }

    for (const w of withdrawals.data ?? []) {
      const curr = withdrawalByAffiliate.get(w.affiliate_id) ?? { pending: 0, paid: 0, rejected: 0 };
      if (w.status === "pending") curr.pending += Number(w.amount ?? 0);
      else if (w.status === "paid") curr.paid += Number(w.amount ?? 0);
      else if (w.status === "rejected") curr.rejected += Number(w.amount ?? 0);
      withdrawalByAffiliate.set(w.affiliate_id, curr);
    }

    const successfulReferrals = new Set<string>();
    for (const c of commissions.data ?? []) {
      if (c.status !== "pending") successfulReferrals.add(c.referral_id);
    }

    return {
      stats: {
        totalAffiliates: affiliates.data?.length ?? 0,
        totalReferrals: referrals.data?.length ?? 0,
        successfulReferrals: successfulReferrals.size,
        totalCommissions: commissions.data?.length ?? 0,
        pendingWithdrawals: withdrawals.data?.filter((w) => w.status === "pending").length ?? 0,
        paidWithdrawals: withdrawals.data?.filter((w) => w.status === "paid").length ?? 0,
        totalAmountPaid: withdrawals.data?.filter((w) => w.status === "paid").reduce((s, w) => s + Number(w.amount ?? 0), 0) ?? 0,
      },
      affiliates: (affiliates.data ?? []).map((a) => ({
        ...a,
        email: userMap.get(a.user_id) ?? "—",
        totalCommissions: commissionByAffiliate.get(a.user_id) ?? 0,
        totalWithdrawn: withdrawalByAffiliate.get(a.user_id)?.paid ?? 0,
        pendingWithdrawals: withdrawalByAffiliate.get(a.user_id)?.pending ?? 0,
      })),
      withdrawals: (withdrawals.data ?? []).map((w) => ({
        ...w,
        affiliate: affiliateMap.get(w.affiliate_id) ?? null,
        affiliate_email: userMap.get(w.affiliate_id) ?? "—",
      })).sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()),
    };
  });

export const setAffiliateStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      affiliateId: z.string().uuid(),
      status: z.enum(["active", "paused", "banned"]),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("affiliates")
      .update({ status: data.status })
      .eq("id", data.affiliateId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminWithdrawals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: withdrawals, error } = await supabaseAdmin
      .from("withdrawals")
      .select("*")
      .order("requested_at", { ascending: false });

    if (error) throw new Error(error.message);

    const affiliateIds = [...new Set((withdrawals ?? []).map((w) => w.affiliate_id))];
    const [userRes, affiliatesRes] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabaseAdmin.from("affiliates").select("user_id, referral_code").in("user_id", affiliateIds),
    ]);
    const userMap = new Map((userRes.data?.users ?? []).map((u) => [u.id, u.email]));
    const affiliateMap = new Map((affiliatesRes.data ?? []).map((a) => [a.user_id, a.referral_code]));

    return (withdrawals ?? []).map((w) => ({
      ...w,
      affiliate_email: userMap.get(w.affiliate_id) ?? "—",
      affiliate_code: affiliateMap.get(w.affiliate_id) ?? "—",
    }));
  });

export const processWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      withdrawalId: z.string().uuid(),
      mpesaReference: z.string().min(1).max(100),
      adminNote: z.string().max(500).optional().nullable(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: result, error } = await supabaseAdmin.rpc("process_withdrawal", {
      _withdrawal_id: data.withdrawalId,
      _mpesa_reference: data.mpesaReference,
      _admin_id: context.userId,
    });

    if (error) throw new Error(error.message);
    return result;
  });

export const rejectWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      withdrawalId: z.string().uuid(),
      adminNote: z.string().max(500).optional().nullable(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: result, error } = await supabaseAdmin.rpc("reject_withdrawal", {
      _withdrawal_id: data.withdrawalId,
      _admin_id: context.userId,
    });

    if (error) throw new Error(error.message);
    return result;
  });

export const startProcessingWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      withdrawalId: z.string().uuid(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: result, error } = await supabaseAdmin.rpc("start_processing_withdrawal", {
      _withdrawal_id: data.withdrawalId,
      _admin_id: context.userId,
    });

    if (error) throw new Error(error.message);
    return result;
  });
