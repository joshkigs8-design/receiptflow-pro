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

const searchSchema = z.object({ reference: z.string().optional() });

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
  const { reference } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
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
    onSuccess: async (res) => {
      if (res.paid) {
        toast.success("Payment confirmed — your subscription is active.");
      } else {
        toast.error("Payment was not completed.");
      }
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

  function handleShareWhatsApp(payment: SubscriptionPaymentRecord) {
    const planName = PLANS[(payment.plan as PlanKey) ?? "monthly"]?.label ?? payment.plan;
    const msg = encodeURIComponent(
      `Official RentReceiptPro Subscription Payment Confirmation:\nReceipt Ref: ${payment.reference}\nPlan: ${planName}\nAmount: ${money(payment.amount)}\nStatus: PAID & ACTIVE\nIssued by Codevanta Ventures (RentReceiptPro)`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
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
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              data?.active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted"
            }`}
          >
            {data?.onTrial ? <Sparkles className="size-3.5" /> : <BadgeCheck className="size-3.5" />}
            {data?.active ? (data.onTrial ? "Trial active" : "Active") : "Inactive"}
          </span>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PLANS) as PlanKey[]).map((key) => {
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
                Download official tax receipts and proof of payment for your accounting &amp; business deductions.
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
                    <th className="pb-3 text-right">Official Receipt</th>
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
                            <Eye className="size-3 text-primary" /> View
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
                            PDF Receipt
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
              No subscription payments recorded yet.
            </p>
          )}
        </div>
      </div>

      {/* Interactive Platform Receipt Preview Dialog */}
      <Dialog open={selectedPayment !== null} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="size-3.5" /> OFFICIAL TAX RECEIPT
              </span>
              <span className="font-mono text-xs text-muted-foreground font-bold">
                {selectedPayment ? `RRP-SUB-${selectedPayment.reference.slice(-8).toUpperCase()}` : ""}
              </span>
            </div>
            <DialogTitle className="font-display text-xl font-bold pt-2">
              Subscription Payment Receipt
            </DialogTitle>
            <DialogDescription className="text-xs">
              Issued by Codevanta Ventures for RentReceiptPro Software Services.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment ? (
            <div className="space-y-4 pt-2">
              {/* Midnight Header Box */}
              <div className="p-5 rounded-2xl bg-[#0B1220] text-white border-b-2 border-[#FF7A00]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">RentReceiptPro</h4>
                    <p className="text-xs text-slate-300">Cloud Property Management Platform</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-[#FFB020]">
                      {money(selectedPayment.amount)}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">PAID &amp; ACTIVE</p>
                  </div>
                </div>
              </div>

              {/* Billed-To Details */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Billed To (Subscriber)</span>
                  <p className="font-bold text-foreground mt-0.5">
                    {data?.profile?.company_name || data?.profile?.full_name || "Valued Landlord"}
                  </p>
                  {data?.profile?.email ? <p className="text-muted-foreground">{data.profile.email}</p> : null}
                  {data?.profile?.phone ? <p className="text-muted-foreground">{data.profile.phone}</p> : null}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Transaction Reference</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{selectedPayment.reference}</p>
                  <p className="text-muted-foreground">
                    Date: {shortDate(selectedPayment.paid_at ?? selectedPayment.created_at)}
                  </p>
                  <p className="text-muted-foreground">Gateway: Paystack Checkout</p>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-2">
                <div className="flex justify-between font-bold border-b border-border/60 pb-1.5">
                  <span>Service Item</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between items-start text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">
                      RentReceiptPro {PLANS[(selectedPayment.plan as PlanKey) ?? "monthly"]?.label ?? selectedPayment.plan} Plan
                    </p>
                    <p className="text-[11px]">Unlimited properties, units, tenants, QR receipts &amp; portals.</p>
                  </div>
                  <span className="font-bold text-foreground">{money(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                  <span>VAT / Taxes (0%):</span>
                  <span>KSh 0.00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm text-primary pt-1 border-t border-border/60">
                  <span>Total Amount Paid:</span>
                  <span>{money(selectedPayment.amount)}</span>
                </div>
              </div>

              {/* Security & Verification Notice */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600">
                <ShieldCheck className="size-5 shrink-0" />
                <p>
                  This official digital receipt is recorded on the RentReceiptPro central ledger and is valid for corporate business accounting and expense filing.
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
            <Button
              className="rounded-full shadow-glow font-bold text-xs gap-1.5 w-full"
              disabled={!selectedPayment || downloadingId === selectedPayment.id}
              onClick={() => selectedPayment && handleDownloadPdf(selectedPayment)}
            >
              {selectedPayment && downloadingId === selectedPayment.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 font-semibold text-xs gap-1.5 w-full"
              disabled={!selectedPayment}
              onClick={() => selectedPayment && handleShareWhatsApp(selectedPayment)}
            >
              <MessageCircle className="size-3.5" /> Share
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-xs gap-1.5 w-full"
              onClick={() => {
                if (selectedPayment) {
                  void navigator.clipboard.writeText(selectedPayment.reference);
                  toast.success("Payment reference copied to clipboard");
                }
              }}
            >
              <Copy className="size-3.5" /> Copy Ref
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}