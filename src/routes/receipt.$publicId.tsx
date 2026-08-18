import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Download, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getPublicReceipt } from "@/lib/portal.functions";
import { Button } from "@/components/ui/button";
import { money, shortDate } from "@/lib/format";
import { downloadReceiptPdf, qrDataUrl, receiptUrl, type ReceiptRecord } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/receipt/$publicId")({
  head: () => ({
    meta: [
      { title: "Rent Receipt Verification — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "View and download a verified digital rent receipt issued through Rent Receipt Pro.",
      },
      { property: "og:title", content: "Rent Receipt Verification" },
      { property: "og:description", content: "This rent receipt is verified against our records." },
    ],
  }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { publicId } = Route.useParams();
  const fetchReceipt = useServerFn(getPublicReceipt);
  const [qr, setQr] = useState("");

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

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2.5">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold">Rent Receipt Pro</span>
        </Link>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Verifying receipt…</p>
        ) : !receipt ? (
          <div className="surface-card p-8 text-center">
            <ShieldAlert className="mx-auto size-8 text-destructive" />
            <h1 className="mt-4 font-display text-xl font-bold">Receipt not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This code does not match any receipt in our records.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link to="/verify">Try another code</Link>
            </Button>
          </div>
        ) : (
          <article className="surface-card overflow-hidden">
            <div className="gradient-primary flex items-center justify-between p-6">
              <div>
                <p className="font-display text-lg font-bold text-primary-foreground">
                  {snap.company ?? "Codevanta Ventures"}
                </p>
                <p className="text-xs text-primary-foreground/80">Official rent receipt</p>
              </div>
              <div className="text-right text-primary-foreground">
                <p className="text-sm font-semibold">{receipt.receipt_number}</p>
                <p className="text-xs">{shortDate(receipt.issued_at)}</p>
              </div>
            </div>

            <div className="p-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
                <BadgeCheck className="size-3.5" /> Verified authentic
              </p>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Tenant", snap.tenant_name ?? "—"],
                  ["Phone", snap.tenant_phone ?? "—"],
                  ["Property", snap.property ?? "—"],
                  ["Unit / room", `${snap.unit ?? "—"}${snap.room ? ` · ${snap.room}` : ""}`],
                  ["Period", snap.period ?? "—"],
                  [
                    "Method",
                    `${snap.method ?? "—"}${snap.reference ? ` · ${snap.reference}` : ""}`,
                  ],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-1 text-sm font-medium capitalize">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Amount paid</p>
                  <p className="font-display text-3xl font-bold text-primary">
                    {money(receipt.amount, snap.currency)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Balance {money(receipt.balance, snap.currency)}
                  </p>
                </div>
                {qr ? (
                  <img
                    src={qr}
                    alt="Receipt verification QR code"
                    className="size-28 rounded-xl bg-white p-2"
                  />
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Button
                  className="rounded-full shadow-glow"
                  onClick={() =>
                    downloadReceiptPdf(receipt).catch(() => toast.error("Could not build the PDF"))
                  }
                >
                  <Download className="size-4" /> Download PDF
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
                  Print
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Issued by {receipt.issued_by ?? snap.company ?? "Codevanta Ventures"}
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
