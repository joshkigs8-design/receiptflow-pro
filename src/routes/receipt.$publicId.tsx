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
      `Here is an official verified digital rent receipt (${receipt.receipt_number}) for ${money(Number(receipt.amount), snap.currency)}:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <div>
              <span className="font-display font-bold text-base block">Rent Receipt Pro</span>
              <span className="text-[10px] text-muted-foreground">Nationwide Digital Registry · Kenya</span>
            </div>
          </Link>

          <Badge variant="outline" className="text-xs font-mono gap-1 text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
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
              This code does not match any authenticated receipt on the RentReceiptPro registry. Please check the URL or contact your landlord.
            </p>
            <Button asChild variant="outline" className="rounded-full mt-2">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        ) : (
          /* Verified Receipt Document Card */
          <article className="surface-card overflow-hidden rounded-3xl border border-border/80 shadow-2xl space-y-0">
            {/* Header Banner */}
            <div className="gradient-primary p-6 sm:p-8 text-primary-foreground relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <FileCheck2 className="size-48" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <p className="font-display text-2xl font-bold tracking-tight">
                    {snap.company ?? "Rent Receipt Pro"}
                  </p>
                  <p className="text-xs text-primary-foreground/90 font-medium">
                    Official Verified Digital Rent Receipt
                  </p>
                  {snap.company_phone ? (
                    <p className="text-xs text-primary-foreground/80 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="size-3" /> {snap.company_phone}
                    </p>
                  ) : null}
                </div>
                <div className="sm:text-right space-y-1">
                  <p className="font-mono text-sm sm:text-base font-bold bg-black/20 px-3 py-1 rounded-xl inline-block border border-white/20">
                    {receipt.receipt_number}
                  </p>
                  <p className="text-xs text-primary-foreground/80 block">
                    Issued: {shortDate(receipt.issued_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Authenticity Stamp */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <BadgeCheck className="size-4" /> VERIFIED AUTHENTIC DIGITAL STAMP
                </span>
                <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  Ref: {receipt.public_id.slice(0, 12)}...
                </span>
              </div>

              {/* Tenancy & Payment Grid */}
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tenant Name</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{snap.tenant_name ?? "—"}</dd>
                  {snap.tenant_phone ? <dd className="text-muted-foreground font-mono text-[11px]">{snap.tenant_phone}</dd> : null}
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Property &amp; Unit</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{snap.property ?? "—"}</dd>
                  <dd className="text-muted-foreground text-[11px]">
                    Unit {snap.unit ?? "—"}{snap.room ? ` · Room ${snap.room}` : ""}
                  </dd>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Rental Billing Period</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{snap.period ?? "—"}</dd>
                  <dd className="text-muted-foreground text-[11px]">Paid on {shortDate(snap.paid_at || receipt.issued_at)}</dd>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <dt className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Payment Method</dt>
                  <dd className="mt-1 text-sm font-semibold capitalize text-foreground">{snap.method ?? "M-Pesa"}</dd>
                  {snap.reference ? (
                    <dd className="text-muted-foreground font-mono text-[11px]">Ref: {snap.reference}</dd>
                  ) : null}
                </div>
              </dl>

              {/* Financial Breakdown & QR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-2xl bg-muted/40 border border-border/60">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Amount Paid</p>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-primary">
                    {money(Number(receipt.amount), snap.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Balance Remaining:{" "}
                    <strong className={Number(receipt.balance) > 0 ? "text-rose-500" : "text-emerald-500"}>
                      {Number(receipt.balance) > 0 ? money(Number(receipt.balance), snap.currency) : "Settled (KSh 0)"}
                    </strong>
                  </p>
                </div>

                {qr ? (
                  <div className="flex items-center gap-3 self-center sm:self-auto bg-background p-2.5 rounded-2xl border border-border/80 shadow-sm">
                    <img
                      src={qr}
                      alt="Verification QR code"
                      className="size-24 rounded-xl"
                    />
                    <div className="text-[10px] text-muted-foreground space-y-0.5 max-w-[110px]">
                      <p className="font-bold text-foreground">Scan QR Code</p>
                      <p>Instant camera verification</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  className="rounded-full shadow-glow font-bold h-11 px-6 text-xs gap-1.5"
                  disabled={downloading}
                  onClick={handleDownload}
                >
                  <Download className="size-4" /> Download Official PDF
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-xs gap-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 font-semibold"
                  onClick={shareWhatsApp}
                >
                  <MessageCircle className="size-4" /> Share WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-xs gap-1.5"
                  onClick={() => {
                    navigator.clipboard.writeText(receiptUrl(publicId));
                    toast.success("Verification link copied to clipboard");
                  }}
                >
                  <Copy className="size-4" /> Copy Link
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full h-11 px-4 text-xs gap-1.5"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" /> Print
                </Button>
              </div>

              {/* Security Footer */}
              <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <p>
                  Issued by: <strong className="text-foreground">{receipt.issued_by ?? snap.company ?? "Rent Receipt Pro"}</strong>
                </p>
                <p className="font-mono text-[11px]">RentReceiptPro Digital Authority</p>
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
