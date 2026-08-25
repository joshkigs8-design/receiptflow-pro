import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Loader2,
  MessageCircle,
  Printer,
  QrCode,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSubscription, startCheckout, verifyCheckout } from "@/lib/billing.functions";
import { PLANS, type PlanKey } from "@/lib/plans";
import { money, shortDate } from "@/lib/format";
import {
  buildSubscriptionReceiptPdf,
  type SubscriptionPaymentRecord,
} from "@/lib/subscription-receipt-pdf";
import { SubscriptionReceiptPrinter } from "@/components/receipt-printer";

const searchSchema = z
  .object({
    reference: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .optional(),
    trxref: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .optional(),
  })
  .passthrough();

export const Route = createFileRoute("/_authenticated/billing")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Billing & Subscription — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Manage your Rent Receipt Pro subscription — KSh 400 per month or KSh 4,000 per year, with 2 months free on signup.",
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
  const qc = useQueryClient();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const rawRef = search.reference || search.trxref;
  const reference = typeof rawRef === "string" ? rawRef : undefined;
  const fetchSubscription = useServerFn(getSubscription);
  const checkout = useServerFn(startCheckout);
  const verify = useServerFn(verifyCheckout);
  const [pending, setPending] = useState<PlanKey | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<SubscriptionPaymentRecord | null>(null);
  const verified = useRef(false);

  const { data } = useQuery({ queryKey: ["subscription"], queryFn: () => fetchSubscription() });

  const verifyMutation = useMutation({
    mutationFn: (ref: string) => verify({ data: { reference: ref } }),
    onSuccess: async (res, ref) => {
      if (res.paid) {
        toast.success("Payment confirmed — your subscription is active!");
        const updated = await fetchSubscription();
        await qc.invalidateQueries({ queryKey: ["subscription"] });
        // Automatically open animated receipt printer for the newly confirmed payment
        const found = updated.history?.find((h) => h.reference === ref) || updated.history?.[0];
        if (found) {
          setSelectedPayment(found as SubscriptionPaymentRecord);
        }
      } else {
        toast.error("Payment was not completed.");
      }
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

  async function handleDownloadPdf(payment: SubscriptionPaymentRecord) {
    try {
      setDownloadingId(payment.id);
      const doc = await buildSubscriptionReceiptPdf(payment, data?.profile);
      doc.save(`RentReceiptPro_Subscription_Receipt_${payment.reference}.pdf`);
      toast.success("Subscription receipt downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate PDF receipt");
    } finally {
      setDownloadingId(null);
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
        {/* Current Status Header Card */}
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border border-border/80 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Current status</p>
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
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              data?.active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted"
            }`}
          >
            {data?.onTrial ? <Sparkles className="size-3.5" /> : <BadgeCheck className="size-3.5" />}
            {data?.active ? (data.onTrial ? "Trial active" : "Active") : "Inactive"}
          </span>
        </div>

        {/* Main Production Plan Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(["monthly", "quarterly", "semiannual", "yearly"] as PlanKey[]).map((key) => {
            const plan = PLANS[key];
            const best = key === "yearly";
            return (
              <div
                key={key}
                className={`surface-card relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 rounded-3xl ${best ? "ring-2 ring-primary shadow-glow" : ""}`}
              >
                <div>
                  {plan.badge ? (
                    <span className="gradient-primary absolute right-5 top-5 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {plan.badge}
                    </span>
                  ) : null}
                  <h3 className="font-display text-lg font-bold">{plan.label}</h3>
                  <p className="mt-3 font-display text-3xl sm:text-4xl font-bold">
                    {money(plan.amount)}
                    <span className="ml-1 text-xs sm:text-sm font-medium text-muted-foreground">
                      /{plan.periodLabel}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.blurb}</p>

                  <ul className="mt-6 space-y-2.5 text-xs sm:text-sm">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 sm:size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="mt-7 w-full rounded-full shadow-glow font-semibold"
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

        {/* ------------------------------------------------------------- */}
        {/* VIP CONCIERGE / DONE-FOR-YOU DATA ENTRY & ONBOARDING PACKAGES  */}
        {/* ------------------------------------------------------------- */}
        <div className="surface-card relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card to-background shadow-glow">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="size-3.5" /> VIP Done-For-You Data Setup
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold">
                Too busy to type in your tenants? We'll enter everything for you!
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send us your tenant list, room numbers, rent amounts and arrears via <strong>WhatsApp, Excel or PDF photos</strong>. Our dedicated concierge team will input, map, and verify your entire property portfolio within 24 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>All properties, units &amp; tenant records entered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Starting rent balances &amp; deposit mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>1-on-1 WhatsApp Caretaker &amp; Agent training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Dedicated VIP account manager</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-3 shrink-0">
              {/* Option 1: 1-Time Setup Service */}
              <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">1-Time Concierge Setup</span>
                  <span className="font-display font-bold text-base text-primary">KSh 2,500</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Complete portfolio data migration + 1 month system access.
                </p>
                <Button
                  size="sm"
                  className="w-full rounded-full shadow-glow text-xs"
                  disabled={pending !== null}
                  onClick={() => pay("concierge_setup")}
                >
                  {pending === "concierge_setup" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Order 1-Time Setup (KSh 2,500)"
                  )}
                </Button>
              </div>

              {/* Option 2: VIP Annual Concierge Bundle */}
              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary flex items-center gap-1">
                    <Sparkles className="size-3" /> VIP Annual Bundle
                  </span>
                  <span className="font-display font-bold text-base text-primary">KSh 5,500 / yr</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  1-Year Unlimited Subscription + Full Setup included (Save KSh 1,000).
                </p>
                <Button
                  size="sm"
                  variant="default"
                  className="w-full rounded-full shadow-glow text-xs font-bold"
                  disabled={pending !== null}
                  onClick={() => pay("concierge_annual")}
                >
                  {pending === "concierge_annual" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Get VIP Annual (KSh 5,500)"
                  )}
                </Button>
              </div>

              <a
                href="https://wa.me/254742868209?text=Hello%20RentReceiptPro%20Team%2C%20I%20would%20like%20the%20Done-For-You%20Data%20Setup%20service%20for%20my%20properties.%20Here%20is%20my%20tenant%20list."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                <MessageCircle className="size-3.5" /> Send list via WhatsApp (0742868209) →
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Secure payments by Paystack — M-Pesa, card and bank supported. New accounts get 14 days
          free. Need help? WhatsApp 0742868209.
        </p>

        {/* Subscription Payment History Ledger & Official Receipts */}
        <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <FileCheck2 className="size-4 text-primary" /> Platform Payment History &amp; Receipts
              </h3>
              <p className="text-xs text-muted-foreground">
                Click any payment to open the animated receipt printer and download official tax receipts for your business deductions.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
              {data?.history.length ?? 0} Recorded
            </Badge>
          </div>

          {data?.history.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="text-left text-xs uppercase text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Receipt Terminal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.history.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-xs font-mono">{shortDate(row.paid_at ?? row.created_at)}</td>
                      <td className="py-3 capitalize font-semibold text-xs">
                        {PLANS[(row.plan as PlanKey) ?? "monthly"]?.label ?? row.plan}
                      </td>
                      <td className="py-3 font-display font-bold text-xs text-emerald-500">
                        {money(row.amount)}
                      </td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {row.reference}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={row.status === "success" ? "default" : "secondary"}
                          className={`text-[10px] uppercase font-bold ${
                            row.status === "success"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : ""
                          }`}
                        >
                          {row.status === "success" ? "Paid & Settled" : row.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-8 px-2.5 text-xs gap-1"
                            onClick={() => setSelectedPayment(row as SubscriptionPaymentRecord)}
                          >
                            <Eye className="size-3 text-primary" /> Print / View
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-full h-8 px-2.5 text-xs gap-1 shadow-glow"
                            disabled={downloadingId === row.id}
                            onClick={() => handleDownloadPdf(row as SubscriptionPaymentRecord)}
                          >
                            {downloadingId === row.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Download className="size-3" />
                            )}
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground italic py-4 text-center">
              No subscription payments recorded yet. Test a payment using the 2 Shillings Test button above.
            </p>
          )}
        </div>
      </div>

      {/* Animated Physical Receipt Printer Dialog */}
      <Dialog open={selectedPayment !== null} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-6 bg-background border-border">
          <DialogHeader className="text-center pb-1">
            <DialogTitle className="font-display text-lg font-bold">
              Subscription Receipt Terminal
            </DialogTitle>
            <DialogDescription className="text-xs">
              Official Tax Receipt &amp; Proof of Payment issued by Codevanta Ventures
            </DialogDescription>
          </DialogHeader>

          {selectedPayment ? (
            <div className="py-2">
              <SubscriptionReceiptPrinter
                payment={selectedPayment}
                {...(data?.profile ? { landlord: data.profile } : {})}
                autoAnimate={true}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}