import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { BadgeCheck, Check, CreditCard, Loader2, Sparkles, Ticket } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemVoucher } from "@/lib/admin.functions";
import { getSubscription, startCheckout, verifyCheckout } from "@/lib/billing.functions";
import { PLANS, type PlanKey } from "@/lib/plans";
import { money, shortDate } from "@/lib/format";

const searchSchema = z.object({ reference: z.string().optional() });

export const Route = createFileRoute("/_authenticated/billing")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Billing & Subscription — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Manage your Rent Receipt Pro subscription — KSh 300 per month or KSh 3,000 per year, with 1 month free on signup.",
      },
      { property: "og:title", content: "Billing & Subscription — Rent Receipt Pro" },
      { property: "og:description", content: "Activate or renew your Rent Receipt Pro plan." },
    ],
  }),
  component: BillingPage,
});

const perks = [
  "Unlimited properties, units and tenants",
  "Instant QR-verified PDF receipts",
  "Tenant portal & maintenance requests",
  "Income reports and analytics",
  "Custom receipt branding",
];

function BillingPage() {
  const { reference } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchSubscription = useServerFn(getSubscription);
  const checkout = useServerFn(startCheckout);
  const verify = useServerFn(verifyCheckout);
  const redeem = useServerFn(redeemVoucher);
  const [pending, setPending] = useState<PlanKey | null>(null);
  const [voucher, setVoucher] = useState("");
  const verified = useRef(false);

  const { data } = useQuery({ queryKey: ["subscription"], queryFn: () => fetchSubscription() });

  const redeemMutation = useMutation({
    mutationFn: (code: string) => redeem({ data: { code } }),
    onSuccess: async (res) => {
      if (res.ok) {
        toast.success(
          `Voucher applied — ${res.months} free month${res.months === 1 ? "" : "s"} added.`,
        );
        setVoucher("");
        await qc.invalidateQueries({ queryKey: ["subscription"] });
      } else {
        toast.error(res.message ?? "Voucher could not be applied");
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Voucher could not be applied"),
  });

  const verifyMutation = useMutation({
    mutationFn: (ref: string) => verify({ data: { reference: ref } }),
    onSuccess: async (res) => {
      if (res.paid) toast.success("Payment confirmed — your subscription is active.");
      else toast.error("Payment was not completed.");
      await qc.invalidateQueries({ queryKey: ["subscription"] });
      navigate({ to: "/billing", search: {}, replace: true });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Verification failed"),
  });

  useEffect(() => {
    if (reference && !verified.current) {
      verified.current = true;
      verifyMutation.mutate(reference);
    }
  }, [reference, verifyMutation]);

  async function pay(plan: PlanKey) {
    setPending(plan);
    try {
      const res = await checkout({ data: { plan, origin: window.location.origin } });
      window.location.href = res.authorization_url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start payment");
      setPending(null);
    }
  }

  const statusLabel = !data
    ? "Loading…"
    : data.onTrial
      ? `Free trial · ${data.daysLeft} days left`
      : data.active
        ? `${PLANS[(data.subscription.plan as PlanKey) ?? "monthly"]?.label ?? "Active"} plan · renews ${shortDate(data.endsAt)}`
        : "No active subscription";

  return (
    <AppShell title="Billing" description="Your Rent Receipt Pro subscription and payment history">
      <div className="space-y-8">
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Current status</p>
            <p className="mt-1 font-display text-xl font-bold">{statusLabel}</p>
            {data ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {data.active
                  ? `Access valid until ${shortDate(data.endsAt)}`
                  : `Ended ${shortDate(data.endsAt)}`}
              </p>
            ) : null}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              data?.active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted"
            }`}
          >
            {data?.onTrial ? <Sparkles className="size-3.5" /> : <BadgeCheck className="size-3.5" />}
            {data?.active ? (data.onTrial ? "Trial active" : "Active") : "Inactive"}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {(Object.keys(PLANS) as PlanKey[]).map((key) => {
            const plan = PLANS[key];
            const best = key === "yearly";
            return (
              <div
                key={key}
                className={`surface-card relative overflow-hidden p-7 ${best ? "ring-2 ring-primary" : ""}`}
              >
                {best ? (
                  <span className="gradient-primary absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold text-primary-foreground">
                    Best value
                  </span>
                ) : null}
                <h3 className="font-display text-lg font-bold">{plan.label}</h3>
                <p className="mt-3 font-display text-4xl font-bold">
                  {money(plan.amount)}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /{key === "yearly" ? "year" : "month"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-7 w-full rounded-full shadow-glow"
                  variant={best ? "default" : "outline"}
                  disabled={pending !== null}
                  onClick={() => pay(key)}
                >
                  {pending === key ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="size-4" /> Pay with Paystack
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Secure payments by Paystack — M-Pesa, card and bank supported. New accounts get 2 months
          free. Need help? WhatsApp 0742868209.
        </p>

        <div className="surface-card p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-bold">
            <Ticket className="size-4 text-primary" /> Have a voucher code?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your code to add free months to your account instantly.
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (voucher.trim().length >= 4) redeemMutation.mutate(voucher.trim());
            }}
          >
            <Input
              value={voucher}
              onChange={(e) => setVoucher(e.target.value.toUpperCase())}
              placeholder="RRP-XXXXXX"
              className="font-mono sm:max-w-xs"
              aria-label="Voucher code"
            />
            <Button
              type="submit"
              className="rounded-full"
              disabled={redeemMutation.isPending || voucher.trim().length < 4}
            >
              {redeemMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Apply voucher"
              )}
            </Button>
          </form>
        </div>

        <div className="surface-card p-6">
          <h3 className="font-display text-base font-bold">Payment history</h3>
          {data?.history.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Reference</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="py-2.5">{shortDate(row.paid_at ?? row.created_at)}</td>
                      <td className="py-2.5 capitalize">{row.plan}</td>
                      <td className="py-2.5">{money(row.amount)}</td>
                      <td className="py-2.5 font-mono text-xs text-muted-foreground">
                        {row.reference}
                      </td>
                      <td className="py-2.5 capitalize">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No payments yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
