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

    const [users, profiles, subs, payments, subPayments, props, tenants, redemptions] =
      await Promise.all([
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 500 }),
        supabaseAdmin.from("profiles").select("id,full_name,company_name,phone,created_at"),
        supabaseAdmin.from("subscriptions").select("*"),
        supabaseAdmin.from("payments").select("id,landlord_id,amount,paid_at"),
        supabaseAdmin
          .from("subscription_payments")
          .select("id,user_id,reference,plan,amount,status,paid_at,created_at")
          .order("created_at", { ascending: false })
          .limit(50),
        supabaseAdmin.from("properties").select("id,landlord_id"),
        supabaseAdmin.from("tenants").select("id,landlord_id,status"),
        supabaseAdmin
          .from("voucher_redemptions")
          .select("id,voucher_id,user_id,months,created_at")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    const now = Date.now();
    const profileById = new Map((profiles.data ?? []).map((p) => [p.id, p]));
    const subByUser = new Map((subs.data ?? []).map((s) => [s.user_id, s]));

    const landlords = (users.data?.users ?? []).map((u) => {
      const sub = subByUser.get(u.id);
      const trialEnds = sub ? new Date(sub.trial_ends_at).getTime() : 0;
      const periodEnds = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : 0;
      const paidActive = periodEnds > now;
      const trialActive = !paidActive && trialEnds > now;
      return {
        id: u.id,
        email: u.email ?? "—",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        full_name: profileById.get(u.id)?.full_name ?? null,
        company_name: profileById.get(u.id)?.company_name ?? null,
        phone: profileById.get(u.id)?.phone ?? null,
        plan: sub?.plan ?? "—",
        state: paidActive ? "paid" : trialActive ? "trial" : "expired",
        endsAt: paidActive ? sub?.current_period_end : (sub?.trial_ends_at ?? null),
        properties: (props.data ?? []).filter((p) => p.landlord_id === u.id).length,
        tenants: (tenants.data ?? []).filter((t) => t.landlord_id === u.id).length,
        rentCollected: (payments.data ?? [])
          .filter((p) => p.landlord_id === u.id)
          .reduce((s, p) => s + Number(p.amount ?? 0), 0),
      };
    });

    const successful = (subPayments.data ?? []).filter((p) => p.status === "success");
    const emailById = new Map(landlords.map((l) => [l.id, l.email]));

    return {
      stats: {
        landlords: landlords.length,
        paying: landlords.filter((l) => l.state === "paid").length,
        onTrial: landlords.filter((l) => l.state === "trial").length,
        expired: landlords.filter((l) => l.state === "expired").length,
        mrr: successful
          .filter((p) => p.plan === "monthly")
          .reduce((s, p) => s + Number(p.amount ?? 0), 0),
        revenue: successful.reduce((s, p) => s + Number(p.amount ?? 0), 0),
        properties: (props.data ?? []).length,
        tenants: (tenants.data ?? []).length,
        rentTracked: (payments.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0),
      },
      landlords: landlords.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
      payments: (subPayments.data ?? []).map((p) => ({
        ...p,
        email: emailById.get(p.user_id) ?? "—",
      })),
      redemptions: (redemptions.data ?? []).map((r) => ({
        ...r,
        email: emailById.get(r.user_id) ?? "—",
      })),
    };
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
  .inputValidator((d: unknown) => voucherInput.parse(d))
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
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(d))
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
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("vouchers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const grantAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
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
  .inputValidator((d: unknown) => z.object({ code: z.string().trim().min(4).max(40) }).parse(d))
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

    const [affiliates, referrals, commissions, withdrawals] = await Promise.all([
      supabaseAdmin.from("affiliates").select("*"),
      supabaseAdmin.from("referrals").select("*"),
      supabaseAdmin.from("commissions").select("*"),
      supabaseAdmin.from("withdrawals").select("*"),
    ]);

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
        totalCommissions: commissionByAffiliate.get(a.user_id) ?? 0,
        totalWithdrawn: withdrawalByAffiliate.get(a.user_id)?.paid ?? 0,
        pendingWithdrawals: withdrawalByAffiliate.get(a.user_id)?.pending ?? 0,
      })),
      withdrawals: (withdrawals.data ?? []).map((w) => ({
        ...w,
        affiliate: affiliateMap.get(w.affiliate_id) ?? null,
      })).sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()),
    };
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

    // Get affiliate emails and referral codes
    const affiliateIds = [...new Set((withdrawals ?? []).map((w) => w.affiliate_id))];
    const [userRes, affiliatesRes] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 500 }),
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
  .inputValidator((d: unknown) =>
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
  .inputValidator((d: unknown) =>
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
  .inputValidator((d: unknown) =>
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
