import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const PLANS = {
  monthly: { label: "Monthly", amount: 300, months: 1, blurb: "Billed every month" },
  yearly: { label: "Yearly", amount: 3000, months: 12, blurb: "2 months free vs monthly" },
} as const;

export type PlanKey = keyof typeof PLANS;

function paystackKey() {
  const key = process.env["PAYSTACK_SECRET_KEY"] ?? process.env["STRIPE_LIVE_API_KEY"];
  if (!key) throw new Error("Paystack secret key is not configured");
  return key;
}

function accessState(row: {
  status: string;
  trial_ends_at: string;
  current_period_end: string | null;
}) {
  const now = Date.now();
  const trialEnds = new Date(row.trial_ends_at).getTime();
  const periodEnds = row.current_period_end ? new Date(row.current_period_end).getTime() : 0;
  const paidActive = periodEnds > now;
  const trialActive = !paidActive && trialEnds > now;
  const endsAt = paidActive ? row.current_period_end : row.trial_ends_at;
  return {
    active: paidActive || trialActive,
    onTrial: trialActive,
    endsAt,
    daysLeft: Math.max(0, Math.ceil(((paidActive ? periodEnds : trialEnds) - now) / 86400000)),
  };
}

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
      .limit(20);

    return { subscription: data, ...accessState(data), history: history ?? [] };
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ plan: z.enum(["monthly", "yearly"]), origin: z.string().url() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const plan = PLANS[data.plan];
    const email = (context.claims as { email?: string }).email;
    if (!email) throw new Error("No email on account");

    const reference = `rrp_${data.plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: plan.amount * 100,
        currency: "KES",
        reference,
        callback_url: `${data.origin}/billing?reference=${reference}`,
        metadata: { user_id: context.userId, plan: data.plan },
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
      amount: plan.amount,
      currency: "KES",
      status: "pending",
    });

    return { authorization_url: json.data.authorization_url, reference };
  });

export const verifyCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ reference: z.string().min(6).max(120) }).parse(d))
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

    const planKey: PlanKey = tx.metadata?.plan === "yearly" ? "yearly" : "monthly";
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

      const base =
        sub?.current_period_end && new Date(sub.current_period_end).getTime() > Date.now()
          ? new Date(sub.current_period_end)
          : new Date();
      const next = new Date(base);
      next.setMonth(next.getMonth() + plan.months);

      await supabaseAdmin
        .from("subscriptions")
        .update({
          plan: planKey,
          status: "active",
          current_period_end: next.toISOString(),
          last_reference: data.reference,
          last_amount: plan.amount,
        })
        .eq("user_id", context.userId);

      await supabaseAdmin
        .from("subscription_payments")
        .upsert(
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
    }

    return { paid: true as const, plan: planKey };
  });
