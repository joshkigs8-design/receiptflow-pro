import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  Grid,
  List,
  Loader2,
  MessageCircle,
  Phone,
  QrCode,
  Receipt,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { listReceipts } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { money, shortDate } from "@/lib/format";
import { downloadReceiptPdf, receiptUrl, qrDataUrl, type ReceiptRecord } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/_authenticated/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts — Rent Receipt Pro" },
      {
        name: "description",
        content: "Download, share, and verify every digital rent receipt issued to tenants.",
      },
      { property: "og:title", content: "Receipts — Rent Receipt Pro" },
      { property: "og:description", content: "All your issued digital rent receipts." },
    ],
  }),
  component: ReceiptsPage,
});

function exportReceiptsToCsv(receipts: (ReceiptRecord & { tenants?: { full_name: string; phone?: string } })[]) {
  if (!receipts.length) {
    toast.error("No receipts to export");
    return;
  }
  const headers = ["Receipt Number", "Date Issued", "Tenant Name", "Tenant Phone", "Property", "Unit", "Period", "Amount", "Balance", "Payment Method", "Reference", "Verification URL"];
  const rows = receipts.map((r) => {
    const snap = r.snapshot ?? {};
    return [
      r.receipt_number,
      r.issued_at ? new Date(r.issued_at).toISOString().slice(0, 10) : "",
      snap.tenant_name || r.tenants?.full_name || "",
      snap.tenant_phone || r.tenants?.phone || "",
      snap.property || "",
      snap.unit || "",
      snap.period || "",
      r.amount,
      r.balance,
      snap.method || "",
      snap.reference || "",
      receiptUrl(r.public_id),
    ].map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipts_registry_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast.success(`Exported ${receipts.length} receipts to CSV`);
}

function ReceiptsPage() {
  const fetchReceipts = useServerFn(listReceipts);
  const { data, isLoading } = useQuery({ queryKey: ["receipts"], queryFn: () => fetchReceipts() });
  const rawRows = (data ?? []) as unknown as (ReceiptRecord & { tenants?: { full_name: string; phone?: string } })[];

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [previewReceipt, setPreviewReceipt] = useState<(ReceiptRecord & { tenants?: { full_name: string } }) | null>(null);
  const [previewQr, setPreviewQr] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Extract unique properties for filter
  const propertyOptions = useMemo(() => {
    const set = new Set<string>();
    rawRows.forEach((r) => {
      if (r.snapshot?.property) set.add(r.snapshot.property);
    });
    return Array.from(set);
  }, [rawRows]);

  // Filtered rows
  const filtered = useMemo(() => {
    return rawRows.filter((r) => {
      const snap = r.snapshot ?? {};
      const matchesProperty = propertyFilter === "all" || snap.property === propertyFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.receipt_number.toLowerCase().includes(q) ||
        (snap.tenant_name && snap.tenant_name.toLowerCase().includes(q)) ||
        (r.tenants?.full_name && r.tenants.full_name.toLowerCase().includes(q)) ||
        (snap.tenant_phone && snap.tenant_phone.includes(q)) ||
        (snap.reference && snap.reference.toLowerCase().includes(q)) ||
        (snap.property && snap.property.toLowerCase().includes(q));
      return matchesProperty && matchesSearch;
    });
  }, [rawRows, searchTerm, propertyFilter]);

  // Totals
  const totalAmount = useMemo(() => {
    return filtered.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  }, [filtered]);

  const avgAmount = filtered.length ? Math.round(totalAmount / filtered.length) : 0;

  async function handleDownload(r: ReceiptRecord) {
    setDownloadingId(r.receipt_number);
    try {
      await downloadReceiptPdf(r);
      toast.success(`Downloaded ${r.receipt_number}.pdf`);
    } catch {
      toast.error("Could not generate PDF");
    } finally {
      setDownloadingId(null);
    }
  }

  function handleOpenPreview(r: ReceiptRecord & { tenants?: { full_name: string } }) {
    setPreviewReceipt(r);
    qrDataUrl(receiptUrl(r.public_id))
      .then(setPreviewQr)
      .catch(() => setPreviewQr(""));
  }

  function shareWhatsApp(r: ReceiptRecord) {
    const snap = r.snapshot ?? {};
    const tenantName = snap.tenant_name || "Tenant";
    const url = receiptUrl(r.public_id);
    const text = encodeURIComponent(
      `Hello ${tenantName}, here is your official verified rent receipt (${r.receipt_number}) for ${money(Number(r.amount))}:\n${url}`
    );
    const phone = (snap.tenant_phone || "").replace(/\D/g, "");
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  }

  return (
    <AppShell
      title="Digital Rent Receipts"
      description="Cryptographically stamped &amp; QR-verifiable rent receipts"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs h-9 gap-1.5"
          onClick={() => exportReceiptsToCsv(filtered)}
        >
          <Download className="size-3.5 text-primary" /> Export CSV
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Receipts Stamped</p>
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <FileCheck2 className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{filtered.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Digital records on file</p>
          </div>

          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Total Rent Documented</p>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Wallet className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-emerald-500">{money(totalAmount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across selected receipts</p>
          </div>

          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Average Receipt Value</p>
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <TrendingUp className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{money(avgAmount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Mean transaction size</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search receipt #, tenant, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-full text-xs"
                />
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>

              {propertyOptions.length > 0 ? (
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="h-10 w-44 rounded-full text-xs">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {propertyOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-muted/60 p-1 rounded-full">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewMode === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Table view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No receipts match your search criteria"
            hint="Record rent payments on the Payments page to generate official verified receipts."
          />
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => {
              const snap = r.snapshot ?? {};
              const tenantName = snap.tenant_name || r.tenants?.full_name || "—";
              const isBusy = downloadingId === r.receipt_number;

              return (
                <article
                  key={r.public_id}
                  className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/40 group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {r.receipt_number}
                      </span>
                      <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10 border-emerald-500/20 gap-1 font-mono">
                        <CheckCircle2 className="size-3" /> VERIFIED
                      </Badge>
                    </div>

                    {/* Tenant & Property */}
                    <div className="space-y-1">
                      <p className="font-semibold text-base text-foreground truncate">{tenantName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        {snap.property || "—"} {snap.unit ? `· Unit ${snap.unit}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 shrink-0" /> Period: {snap.period || "—"}
                      </p>
                    </div>

                    {/* Amount & Balance */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount Paid</p>
                        <p className="font-display text-xl font-bold text-primary">
                          {money(Number(r.amount), snap.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Balance</p>
                        <p className={`text-xs font-bold ${Number(r.balance) > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                          {Number(r.balance) > 0 ? money(Number(r.balance), snap.currency) : "Settled (KSh 0)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 px-2 text-[11px] font-medium gap-1 justify-center whitespace-nowrap w-full"
                      onClick={() => handleOpenPreview(r)}
                    >
                      <Eye className="size-3 text-primary shrink-0" /> View
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 px-2 text-[11px] font-medium text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 gap-1 justify-center whitespace-nowrap w-full"
                      onClick={() => shareWhatsApp(r)}
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="size-3 shrink-0" /> Share
                    </Button>

                    <Button
                      size="sm"
                      className="rounded-full h-8 px-2 text-[11px] font-medium gap-1 shadow-glow justify-center whitespace-nowrap w-full"
                      disabled={isBusy}
                      onClick={() => handleDownload(r)}
                    >
                      {isBusy ? <Loader2 className="size-3 animate-spin shrink-0" /> : <Download className="size-3 shrink-0" />}
                      PDF
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property / Unit</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const snap = r.snapshot ?? {};
                  const isBusy = downloadingId === r.receipt_number;

                  return (
                    <TableRow key={r.public_id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-bold text-xs text-foreground">{r.receipt_number}</TableCell>
                      <TableCell className="text-xs font-mono">{shortDate(r.issued_at)}</TableCell>
                      <TableCell>
                        <p className="font-semibold text-xs">{snap.tenant_name || r.tenants?.full_name || "—"}</p>
                        {snap.tenant_phone ? (
                          <p className="text-[11px] text-muted-foreground font-mono">{snap.tenant_phone}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {snap.property || "—"} {snap.unit ? `· Unit ${snap.unit}` : ""}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">{snap.period || "—"}</TableCell>
                      <TableCell className="text-xs capitalize font-medium">{snap.method || "M-Pesa"}</TableCell>
                      <TableCell className="font-bold text-sm text-primary">
                        {money(Number(r.amount), snap.currency)}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        <span className={Number(r.balance) > 0 ? "text-rose-500" : "text-emerald-500"}>
                          {money(Number(r.balance), snap.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-full"
                            onClick={() => handleOpenPreview(r)}
                            title="Preview receipt"
                          >
                            <Eye className="size-3.5 text-primary" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-full text-emerald-500 hover:bg-emerald-500/10"
                            onClick={() => shareWhatsApp(r)}
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-full"
                            disabled={isBusy}
                            onClick={() => handleDownload(r)}
                            title="Download PDF"
                          >
                            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      <Dialog open={Boolean(previewReceipt)} onOpenChange={(open) => !open && setPreviewReceipt(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <FileCheck2 className="size-5 text-primary" /> Verified Digital Receipt Preview
            </DialogTitle>
            <DialogDescription>
              Receipt <strong className="font-mono text-foreground">{previewReceipt?.receipt_number}</strong> · Issued{" "}
              {previewReceipt ? shortDate(previewReceipt.issued_at) : ""}
            </DialogDescription>
          </DialogHeader>

          {previewReceipt ? (
            <div className="space-y-5 mt-2">
              {/* Receipt Preview Card */}
              <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
                <div className="gradient-primary p-4 text-primary-foreground flex justify-between items-center">
                  <div>
                    <p className="font-bold font-display">{previewReceipt.snapshot?.company ?? "Rent Receipt Pro"}</p>
                    <p className="text-xs text-primary-foreground/80">Official Verified Digital Receipt</p>
                  </div>
                  <Badge variant="outline" className="border-white/40 text-white text-[10px] uppercase font-mono">
                    Stamped
                  </Badge>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] font-bold">Tenant</span>
                      <p className="font-semibold text-sm mt-0.5">{previewReceipt.snapshot?.tenant_name || previewReceipt.tenants?.full_name}</p>
                      <p className="text-muted-foreground font-mono">{previewReceipt.snapshot?.tenant_phone || "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] font-bold">Property &amp; Unit</span>
                      <p className="font-semibold text-sm mt-0.5">{previewReceipt.snapshot?.property || "—"}</p>
                      <p className="text-muted-foreground">Unit {previewReceipt.snapshot?.unit || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] font-bold">Billing Period</span>
                      <p className="font-semibold mt-0.5">{previewReceipt.snapshot?.period || "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] font-bold">Payment Method</span>
                      <p className="font-semibold capitalize mt-0.5">{previewReceipt.snapshot?.method || "M-Pesa"}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount Paid</p>
                      <p className="font-display text-2xl font-bold text-primary">
                        {money(Number(previewReceipt.amount), previewReceipt.snapshot?.currency)}
                      </p>
                    </div>
                    {previewQr ? (
                      <img src={previewQr} alt="QR Code" className="size-20 rounded-xl bg-white p-1.5 border border-border" />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (previewReceipt) {
                  navigator.clipboard.writeText(receiptUrl(previewReceipt.public_id));
                  toast.success("Verification link copied");
                }
              }}
            >
              <Copy className="size-3.5 mr-1" /> Copy Link
            </Button>
            <Button
              className="rounded-full shadow-glow font-semibold"
              onClick={() => {
                if (previewReceipt) handleDownload(previewReceipt);
              }}
            >
              <Download className="size-3.5 mr-1" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
