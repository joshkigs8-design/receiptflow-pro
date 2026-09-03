import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLANS, type PlanKey, getPlanPrice } from "./plans";
import { accessState, nextPeriodEnd, paystackKey } from "./billing.server";

export const getSubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    let { data } = await context.supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (!data) {
      const inserted = await context.supabase
        .from("subscriptions")
        .insert({ user_id: context.userId })
        .select("*")
        .maybeSingle();
      data = inserted.data;
    }
    if (!data) throw new Error("Could not load subscription");

    const { data: history } = await context.supabase
      .from("subscription_payments")
      .select("id,reference,plan,amount,currency,status,paid_at,created_at")
      .order("created_at", { ascending: false })
      .limit(30);

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("company_name,full_name,phone")
      .eq("id", context.userId)
      .maybeSingle();

    const email = (context.claims as { email?: string })?.email ?? "";

    const historyList = history ?? [];
    const successfulPayments = historyList.filter(
      (h) => h.status === "success" || h.status === "paid",
    );
    const isFirstTimeUser = successfulPayments.length === 0;

    return {
      subscription: data,
      ...accessState(data),
      history: historyList,
      isFirstTimeUser,
      profile: {
        company_name: profile?.company_name || null,
        full_name: profile?.full_name || null,
        phone: profile?.phone || null,
        email,
      },
    };
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        plan: z.enum(["monthly", "quarterly", "semiannual", "yearly", "concierge_setup", "concierge_annual"]),
        origin: z.string().url(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string }).email;
    if (!email) throw new Error("No email on account");

    // Check if user has any previous successful subscription payment
    const { count } = await context.supabase
      .from("subscription_payments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .eq("status", "success");

    const isFirstTime = (count ?? 0) === 0;
    const finalAmount = getPlanPrice(data.plan, isFirstTime);

    const reference = `rrp_${data.plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: finalAmount * 100,
        currency: "KES",
        reference,
        callback_url: `${data.origin}/billing?reference=${reference}`,
        metadata: {
          user_id: context.userId,
          plan: data.plan,
          is_first_time: isFirstTime,
        },
      }),
    });

    const json = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };
    if (!res.ok || !json.status || !json.data?.authorization_url) {
      console.error("Paystack initialize failed", json.message);
      throw new Error(json.message ?? "Could not start payment");
    }

    await context.supabase.from("subscription_payments").insert({
      user_id: context.userId,
      reference,
      plan: data.plan,
      amount: finalAmount,
      currency: "KES",
      status: "pending",
    });

    return { authorization_url: json.data.authorization_url, reference };
  });

export const verifyCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ reference: z.string().min(6).max(120) }).parse(d))
  .handler(async ({ data, context }) => {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${paystackKey()}` } },
    );
    const json = (await res.json()) as {
      status?: boolean;
      data?: { status?: string; amount?: number; metadata?: { user_id?: string; plan?: PlanKey } };
    };
    const tx = json.data;
    if (!res.ok || !json.status || !tx) throw new Error("Could not verify payment");
    if (tx.status !== "success") return { paid: false as const };
    if (tx.metadata?.user_id && tx.metadata.user_id !== context.userId) {
      throw new Error("This payment belongs to another account");
    }

    const rawPlan = tx.metadata?.plan;
    const planKey: PlanKey = (rawPlan && rawPlan in PLANS) ? (rawPlan as PlanKey) : "monthly";
    const plan = PLANS[planKey];

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("subscription_payments")
      .select("status")
      .eq("reference", data.reference)
      .maybeSingle();

    if (existing?.status !== "success") {
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("current_period_end")
        .eq("user_id", context.userId)
        .maybeSingle();

      const next = nextPeriodEnd(sub?.current_period_end ?? null, planKey);

      await supabaseAdmin
        .from("subscriptions")
        .update({
          plan: planKey,
          status: "active",
          current_period_end: next,
          last_reference: data.reference,
          last_amount: plan.amount,
        })
        .eq("user_id", context.userId);

      await supabaseAdmin.from("subscription_payments").upsert(
        {
          user_id: context.userId,
          reference: data.reference,
          plan: planKey,
          amount: plan.amount,
          currency: "KES",
          status: "success",
          paid_at: new Date().toISOString(),
        },
        { onConflict: "reference" },
      );

      // Get the subscription_payment UUID for commission creation
      const { data: sp } = await supabaseAdmin
        .from("subscription_payments")
        .select("id")
        .eq("reference", data.reference)
        .maybeSingle();

      // Create affiliate commission if user was referred
      if (sp?.id) {
        try {
          await supabaseAdmin.rpc("create_commission", {
            _subscription_payment_id: sp.id,
          });
        } catch (err) {
          // Commission creation failed (no referral, self-referral, or duplicate)
          // Log but don't fail the payment
          console.warn("Affiliate commission creation skipped:", err);
        }
      }
    }

    return { paid: true as const, plan: planKey };
  });
