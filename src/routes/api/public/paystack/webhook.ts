import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { nextPeriodEnd, paystackKey } from "@/lib/billing.server";
import { PLANS, type PlanKey } from "@/lib/plans";

export const Route = createFileRoute("/api/public/paystack/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", paystackKey()).update(body).digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as {
          event?: string;
          data?: {
            reference?: string;
            status?: string;
            metadata?: { user_id?: string; plan?: PlanKey };
          };
        };
        if (event.event !== "charge.success" || event.data?.status !== "success") {
          return new Response("ignored");
        }

        const userId = event.data.metadata?.user_id;
        const reference = event.data.reference;
        if (!userId || !reference) {
          return new Response("Missing userId or reference", { status: 200 });
        }

        const rawPlan = event.data.metadata?.plan;
        const planKey: PlanKey = (rawPlan && rawPlan in PLANS) ? (rawPlan as PlanKey) : "monthly";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: existing } = await supabaseAdmin
          .from("subscription_payments")
          .select("status")
          .eq("reference", reference)
          .maybeSingle();
        if (existing?.status === "success") return new Response("ok");

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("current_period_end")
          .eq("user_id", userId)
          .maybeSingle();

        await supabaseAdmin
          .from("subscriptions")
          .update({
            plan: planKey,
            status: "active",
            current_period_end: nextPeriodEnd(sub?.current_period_end ?? null, planKey),
            last_reference: reference ?? null,
            last_amount: PLANS[planKey].amount,
          })
          .eq("user_id", userId);

        await supabaseAdmin.from("subscription_payments").upsert(
          {
            user_id: userId,
            reference,
            plan: planKey,
            amount: PLANS[planKey].amount,
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
          .eq("reference", reference)
          .maybeSingle();

        // Create affiliate commission if user was referred
        if (sp?.id) {
          try {
            await supabaseAdmin.rpc("create_commission", {
              _subscription_payment_id: sp.id,
            });
          } catch (err) {
            // Commission creation failed (no referral, self-referral, or duplicate)
            // Log but don't fail the webhook
            console.warn("Affiliate commission creation skipped:", err);
          }
        }

        return new Response("ok");
      },
    },
  },
});
