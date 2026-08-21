import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLANS, type PlanKey } from "./plans";
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
