import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const recordReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ referralCode: z.string().min(4).max(20) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("record_referral", {
      _referred_id: context.userId,
      _referral_code: data.referralCode,
    });
    if (error) throw new Error(error.message);
    return { affiliateId: result };
  });

export const enrollAffiliate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("enroll_affiliate", {
      _user_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return data;
  });

export const getAffiliate = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const getAffiliateDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_affiliate_dashboard", {
      _user_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return data;
  });

export const requestWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      amount: z.number().min(300),
      mpesaPhone: z.string().min(10).max(15),
      note: z.string().max(500).optional().nullable(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("request_withdrawal", {
      _affiliate_id: context.userId,
      _amount: data.amount,
      _mpesa_phone: data.mpesaPhone,
    });
    if (error) throw new Error(error.message);
    return result;
  });

export const getWithdrawals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("withdrawals")
      .select("*")
      .eq("affiliate_id", context.userId)
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });