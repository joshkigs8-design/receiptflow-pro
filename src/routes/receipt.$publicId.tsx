import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  MessageCircle,
  Phone,
  Printer,
  QrCode,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { getPublicReceipt } from "@/lib/portal.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { money, shortDate } from "@/lib/format";
import { downloadReceiptPdf, qrDataUrl, receiptUrl, type ReceiptRecord } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/receipt/$publicId")({
  head: () => ({
    meta: [
      { title: "Rent Receipt Verification — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "View, share, and download a verified digital rent receipt issued through Rent Receipt Pro.",
      },
      { property: "og:title", content: "Rent Receipt Verification — Rent Receipt Pro" },
      { property: "og:description", content: "Official cryptographically verified proof of rent payment." },
    ],
  }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { publicId } = Route.useParams();
  const fetchReceipt = useServerFn(getPublicReceipt);
  const [qr, setQr] = useState("");
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["public-receipt", publicId],
    queryFn: () => fetchReceipt({ data: { publicId } }),
  });

  useEffect(() => {
    qrDataUrl(receiptUrl(publicId))
      .then(setQr)
      .catch(() => setQr(""));
  }, [publicId]);

  const receipt = data?.ok ? (data.receipt as unknown as ReceiptRecord) : null;
  const snap = receipt?.snapshot ?? {};

  const totalPaid = Number(receipt?.amount ?? 0);
  const bal = Number(receipt?.balance ?? 0);
  const priorArrears = Math.max(0, Number(snap.prior_arrears ?? 0));
  const rentAmount = Number(snap.rent_amount && snap.rent_amount > 0 ? snap.rent_amount : totalPaid);

  const amountToArrears =
    snap.amount_to_arrears !== undefined
      ? Number(snap.amount_to_arrears)
      : priorArrears > 0
        ? Math.min(priorArrears, totalPaid)
        : 0;

  const amountToRent =
    snap.amount_to_rent !== undefined
      ? Number(snap.amount_to_rent)
      : Math.max(0, totalPaid - amountToArrears);

  async function handleDownload() {
    if (!receipt) return;
    setDownloading(true);
    try {
      await downloadReceiptPdf(receipt);
      toast.success(`Downloaded ${receipt.receipt_number}.pdf`);
    } catch {
      toast.error("Could not generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  function shareWhatsApp() {
    if (!receipt) return;
    const url = receiptUrl(publicId);
    const text = encodeURIComponent(
      `*OFFICIAL RENT RECEIPT — RENT RECEIPT PRO*\n\n` +
      `🧾 *Receipt Number:* ${receipt.receipt_number}\n` +
      `👤 *Tenant:* ${snap.tenant_name || "Valued Tenant"}\n` +
      `🏠 *Property:* ${snap.property || "Rental Property"}${snap.unit ? ` (Unit ${snap.unit})` : ""}\n` +
      `📅 *Billing Period:* ${snap.period || "Current Period"}\n\n` +
      `💰 *Payment Details:*\n` +
      `• *Amount Received:* ${money(totalPaid, snap.currency)}\n` +
      `• *Payment Method:* ${(snap.method || "M-Pesa").toUpperCase()}${snap.reference ? ` (Ref: ${snap.reference})` : ""}\n` +
      (priorArrears > 0
        ? `• *Cleared From Prior Arrears:* ${money(amountToArrears, snap.currency)}\n• *Applied To Current Rent:* ${money(amountToRent, snap.currency)}\n`
        : "") +
      `• *Net Balance Remaining:* ${bal > 0 ? money(bal, snap.currency) : "KSh 0 (Fully Settled ✔)"}\n\n` +
      `🔐 *Verify Online & Download PDF:*\n${url}\n\n` +
      `_Authorized by ${receipt.issued_by || snap.company || "Rent Receipt Pro"}_`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Top Navigation & Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-5" />
            </span>
            <div>
              <span className="font-display font-bold text-base block">Rent Receipt Pro</span>
              <span className="text-[10px] text-muted-foreground">Nationwide Digital Registry · Kenya</span>
            </div>
          </Link>

          <Badge variant="outline" className="text-xs font-mono gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            <ShieldCheck className="size-3.5" /> Registry Verified
          </Badge>
        </div>

        {isLoading ? (
          <div className="surface-card p-12 text-center rounded-3xl border border-border/80 shadow-lg">
            <p className="text-sm text-muted-foreground animate-pulse">Verifying cryptographic receipt record…</p>
          </div>
        ) : !receipt ? (
          <div className="surface-card p-10 text-center rounded-3xl border border-border/80 shadow-xl space-y-4">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <ShieldAlert className="size-7" />
            </span>
            <h1 className="font-display text-2xl font-bold">Receipt Not Found</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              This verification link does not match any authenticated record in the RentReceipt Pro registry. Please check the URL or contact your landlord.
            </p>
            <Button asChild variant="outline" className="rounded-full mt-2">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        ) : (
          /* Upgraded Verified Receipt Document Card */
          <article className="surface-card overflow-hidden rounded-3xl border border-border/80 shadow-2xl space-y-0">
            {/* Header Banner in Deep Forest Green #063B2A */}
            <div className="bg-[#063B2A] p-6 sm:p-8 text-white relative overflow-hidden border-b-4 border-[#C9A227]">
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-emerald-400">
                <FileCheck2 className="size-48" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                    {snap.company || "Rent Receipt Pro"}
                  </p>
                  <p className="text-xs text-emerald-200 font-medium">
                    Official Verified Digital Rent Receipt
                  </p>
                  {snap.company_phone ? (
                    <p className="text-xs text-emerald-100/90 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="size-3" /> {snap.company_phone}
                    </p>
                  ) : null}
                </div>
                <div className="sm:text-right space-y-1">
                  <p className="font-mono text-sm sm:text-base font-bold bg-white/10 px-3 py-1.5 rounded-xl inline-block border border-white/20">
                    {receipt.receipt_number}
                  </p>
                  <p className="text-xs text-emerald-200 block">
                    Issued: {shortDate(receipt.issued_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Official Cryptographic Authenticity Stamp */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> OFFICIAL DIGITAL STAMP &bull; CRYPTOGRAPHICALLY SECURED
                </span>
                <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  Ref: {receipt.public_id.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* Tenancy & Payment Grid */}
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tenant Name</dt>
                  <dd className="text-sm font-semibold text-foreground">{snap.tenant_name ?? "—"}</dd>
                  {snap.tenant_phone ? (
                    <dd className="text-muted-foreground font-mono text-[11px]">{snap.tenant_phone}</dd>
                  ) : null}
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Property &amp; Unit</dt>
                  <dd className="text-sm font-semibold text-foreground">{snap.property ?? "—"}</dd>
                  <dd className="text-muted-foreground text-[11px]">
                    Unit {snap.unit ?? "—"}{snap.room ? ` · Room ${snap.room}` : ""}
                  </dd>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Rental Billing Period</dt>
                  <dd className="text-sm font-semibold text-foreground">{snap.period ?? "—"}</dd>
                  <dd className="text-muted-foreground text-[11px]">Paid on {shortDate(snap.paid_at || receipt.issued_at)}</dd>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Payment Method</dt>
                  <dd className="text-sm font-semibold capitalize text-foreground">{snap.method ?? "M-Pesa"}</dd>
                  {snap.reference ? (
                    <dd className="text-muted-foreground font-mono text-[11px]">Ref: {snap.reference}</dd>
                  ) : null}
                </div>
              </dl>

              {/* Detailed FIFO Accounting Breakdown Card */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wallet className="size-3.5 text-primary" /> Payment Breakdown &amp; Allocation
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    FIFO Deduction
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {priorArrears > 0 ? (
                    <>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Prior Accumulated Arrears:</span>
                        <span className="font-mono text-rose-500 font-semibold">{money(priorArrears, snap.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Current Month Contracted Rent:</span>
                        <span className="font-mono font-medium">{money(rentAmount, snap.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-border/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Allocated to Clear Prior Arrears:
                        </span>
                        <span className="font-mono">-{money(amountToArrears, snap.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Allocated to Current Rent:
                        </span>
                        <span className="font-mono">-{money(amountToRent, snap.currency)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Current Month Rent Due:</span>
                        <span className="font-mono font-medium">{money(rentAmount, snap.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Allocated Directly to Rent:
                        </span>
                        <span className="font-mono">-{money(totalPaid, snap.currency)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Totals Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/80">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Received</p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-primary">
                      {money(totalPaid, snap.currency)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Net Outstanding Balance</p>
                    <p className={`font-display text-xl sm:text-2xl font-bold ${bal > 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {bal > 0 ? money(bal, snap.currency) : "KSh 0.00 (Settled ✔)"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {bal > 0 ? "Pending balance awaiting payment" : "Tenancy account is fully up to date"}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Verification Visual Card */}
              {qr ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <img
                    src={qr}
                    alt="Verification QR code"
                    className="size-24 rounded-xl border border-border shrink-0"
                  />
                  <div className="text-xs text-muted-foreground space-y-1 text-center sm:text-left">
                    <p className="font-bold text-foreground text-sm flex items-center justify-center sm:justify-start gap-1.5">
                      <QrCode className="size-4 text-primary" /> Instant Smartphone Verification
                    </p>
                    <p className="leading-relaxed">
                      Scan this QR code with any smartphone camera to independently verify authentic digital registration, payment timestamps, and tenancy records.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                <Button
                  className="rounded-full shadow-glow font-bold h-11 px-4 text-xs gap-1.5 justify-center w-full whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={downloading}
                  onClick={handleDownload}
                >
                  <Download className="size-4 shrink-0" /> Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 font-semibold justify-center w-full whitespace-nowrap"
                  onClick={shareWhatsApp}
                >
                  <MessageCircle className="size-4 shrink-0" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-xs gap-1.5 justify-center w-full whitespace-nowrap"
                  onClick={() => {
                    navigator.clipboard.writeText(receiptUrl(publicId));
                    toast.success("Verification link copied to clipboard");
                  }}
                >
                  <Copy className="size-4 shrink-0" /> Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-xs gap-1.5 justify-center w-full whitespace-nowrap"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4 shrink-0" /> Print
                </Button>
              </div>

              {/* Security Footer */}
              <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <p>
                  Issued by: <strong className="text-foreground">{receipt.issued_by ?? snap.company ?? "Rent Receipt Pro"}</strong>
                </p>
                <p className="font-mono text-[11px]">RentReceipt Pro Digital Authority &bull; Kenya</p>
              </div>
            </div>
          </article>
        )}

        {/* Landlord Call to Action */}
        <div className="surface-card p-6 rounded-3xl border border-border/80 text-center space-y-3">
          <h3 className="font-display text-base font-bold">Are you a landlord or property manager?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Issue automated digital receipts with M-Pesa tracking, tenant portals, and payment records in under 5 minutes.
          </p>
          <Button asChild size="sm" className="rounded-full shadow-glow font-bold text-xs">
            <Link to="/auth" search={{ mode: "signup" }}>Create Free Landlord Account →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
