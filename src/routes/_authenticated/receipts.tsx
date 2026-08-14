import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { listReceipts } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { money, shortDate } from "@/lib/format";
import { downloadReceiptPdf, receiptUrl, type ReceiptRecord } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/_authenticated/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts — Rent Receipt Pro" },
      { name: "description", content: "Download, share and verify every digital rent receipt issued." },
      { property: "og:title", content: "Receipts — Rent Receipt Pro" },
      { property: "og:description", content: "All your issued digital rent receipts." },
    ],
  }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const fetchReceipts = useServerFn(listReceipts);
  const { data, isLoading } = useQuery({ queryKey: ["receipts"], queryFn: () => fetchReceipts() });
  const rows = (data ?? []) as unknown as (ReceiptRecord & { tenants?: { full_name: string } })[];

  return (
    <AppShell title="Receipts" description="Every receipt is QR-verifiable">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading receipts…</p>
      ) : rows.length === 0 ? (
        <EmptyState title="No receipts yet" hint="Record a payment to issue your first receipt." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <article key={r.public_id} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold">{r.receipt_number}</p>
                <QrCode className="size-4 text-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{shortDate(r.issued_at)}</p>
              <p className="mt-4 text-sm">{r.tenants?.full_name ?? r.snapshot?.tenant_name ?? "—"}</p>
              <p className="mt-1 font-display text-2xl font-bold text-primary">
                {money(r.amount, r.snapshot?.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                Balance {money(r.balance, r.snapshot?.currency)}
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    downloadReceiptPdf(r).catch(() => toast.error("Could not build the PDF"))
                  }
                >
                  <Download className="size-3.5" /> PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(receiptUrl(r.public_id));
                    toast.success("Verification link copied");
                  }}
                >
                  <Copy className="size-3.5" /> Link
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}