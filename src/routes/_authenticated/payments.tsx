import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Receipt,
  Search,
  Smartphone,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  deletePayment,
  getSettings,
  listPayments,
  listReceipts,
  listTenants,
  recordPayment,
  updatePayment,
} from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHODS, money, shortDate } from "@/lib/format";
import { downloadReceiptPdf, type ReceiptRecord } from "@/lib/receipt-pdf";
import { downloadLandlordPaymentsPdf } from "@/lib/payments-report-pdf";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "Payments & Collections — Rent Receipt Pro" },
      {
        name: "description",
        content: "Track every rent payment, generate PDF reports, and issue verified digital receipts.",
      },
      { property: "og:title", content: "Payments & Collections — Rent Receipt Pro" },
      { property: "og:description", content: "Track rent payments and generate official PDF statements." },
    ],
  }),
  component: PaymentsPage,
});

const today = () => new Date().toISOString().slice(0, 10);

function exportPaymentsToCsv(rows: any[]) {
  if (!rows.length) {
    toast.error("No payments to export");
    return;
  }
  const headers = [
    "Date",
    "Tenant Name",
    "Tenant Phone",
    "Property",
    "Unit",
    "Payment Method",
    "Reference",
    "Period",
    "Amount",
    "Status",
    "Notes",
  ];
  const csvContent = [
    headers.join(","),
    ...rows.map((p) => {
      const tenant = p.tenants?.full_name || p.tenant_name || "";
      const phone = p.tenants?.phone || p.tenant_phone || "";
      const prop = p.properties?.name || p.property_name || "";
      const unit = p.units?.unit_number || p.units?.room_number || p.unit_name || "";
      return [
        `"${p.paid_at ? new Date(p.paid_at).toISOString().slice(0, 10) : ""}"`,
        `"${tenant.replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${prop.replace(/"/g, '""')}"`,
        `"${unit.replace(/"/g, '""')}"`,
        `"${p.method || ""}"`,
        `"${(p.reference || "").replace(/"/g, '""')}"`,
        `"${p.period_label || ""}"`,
        p.amount || 0,
        `"${p.status || "paid"}"`,
        `"${(p.notes || "").replace(/"/g, '""')}"`,
      ].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `RentReceipt_Payments_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Payments CSV exported successfully");
}

function PaymentsPage() {
  const qc = useQueryClient();
  const fetchPayments = useServerFn(listPayments);
  const fetchTenants = useServerFn(listTenants);
  const fetchReceipts = useServerFn(listReceipts);
  const fetchSettings = useServerFn(getSettings);
  const record = useServerFn(recordPayment);
  const update = useServerFn(updatePayment);
  const remove = useServerFn(deletePayment);

  const [open, setOpen] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [editing, setEditing] = useState<null | { id: string }>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  const [editDraft, setEditDraft] = useState({
    amount: 0,
    method: "mpesa",
    reference: "",
    paid_at: today(),
    period_label: "",
    notes: "",
  });

  const [draft, setDraft] = useState({
    tenant_id: "",
    amount: 0,
    method: "mpesa",
    reference: "",
    paid_at: today(),
    period_label: new Date().toISOString().slice(0, 7),
    notes: "",
  });

  const payments = useQuery({ queryKey: ["payments"], queryFn: () => fetchPayments() });
  const tenants = useQuery({ queryKey: ["tenants"], queryFn: () => fetchTenants() });
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });

  const rawPayments = payments.data ?? [];

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return rawPayments.filter((p: any) => {
      const matchesMethod =
        methodFilter === "all" ||
        p.method === methodFilter ||
        (methodFilter === "kcb" && (p.method === "kcb" || p.method === "kcb_buni"));

      const q = searchQuery.toLowerCase().trim();
      const tenantName = (p.tenants?.full_name || "").toLowerCase();
      const tenantPhone = (p.tenants?.phone || "").toLowerCase();
      const ref = (p.reference || "").toLowerCase();
      const unit = (p.units?.unit_number || p.units?.room_number || "").toLowerCase();
      const period = (p.period_label || "").toLowerCase();

      const matchesSearch =
        !q ||
        tenantName.includes(q) ||
        tenantPhone.includes(q) ||
        ref.includes(q) ||
        unit.includes(q) ||
        period.includes(q);

      return matchesMethod && matchesSearch;
    });
  }, [rawPayments, methodFilter, searchQuery]);

  const [page, setPage] = useState<number>(1);
  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = useMemo(() => {
    return filteredPayments.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredPayments, page, pageSize]);

  // Financial Metrics
  const metrics = useMemo(() => {
    const totalCollected = rawPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const mpesaVolume = rawPayments
      .filter((p) => p.method === "mpesa")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const kcbVolume = rawPayments
      .filter((p) => p.method === "kcb" || p.method === "kcb_buni")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const otherVolume = totalCollected - mpesaVolume - kcbVolume;

    return {
      totalCollected,
      mpesaVolume,
      kcbVolume,
      otherVolume,
      count: rawPayments.length,
    };
  }, [rawPayments]);

  const handleExportPdf = async () => {
    if (!filteredPayments.length) {
      toast.error("No payments available to export");
      return;
    }
    setExportingPdf(true);
    try {
      await downloadLandlordPaymentsPdf(filteredPayments, {
        company_name: settings.data?.company_name || null,
        full_name: settings.data?.full_name || null,
        email: null,
        phone: settings.data?.phone || null,
        currency: settings.data?.currency || "KSh",
      });
      toast.success("Landlord Payments PDF Statement generated & downloaded!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF statement");
    } finally {
      setExportingPdf(false);
    }
  };

  const mutation = useMutation({
    mutationFn: () => record({ data: draft }),
    onSuccess: async (res) => {
      toast.success(`Receipt ${res.receiptNumber} generated`);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["tenants"] });
      try {
        const list = (await fetchReceipts()) as unknown as ReceiptRecord[];
        const fresh = list.find((r) => r.public_id === res.publicId);
        if (fresh) await downloadReceiptPdf(fresh);
      } catch {
        toast.info("Receipt saved — download it from the Receipts page.");
      }
    },
    onError: (e: Error) => toast.error(e.message || "Could not record payment"),
  });

  const editMutation = useMutation({
    mutationFn: () => update({ data: { id: editing!.id, ...editDraft } }),
    onSuccess: () => {
      toast.success("Payment updated");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not update payment"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Payment deleted");
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete payment"),
  });

  return (
    <AppShell
      title="Payments"
      description="Every shilling collected, with instant receipts &amp; PDF reports"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5 text-xs font-semibold shadow-sm bg-background hover:bg-muted"
            onClick={handleExportPdf}
            disabled={exportingPdf || !filteredPayments.length}
          >
            {exportingPdf ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileText className="size-3.5 text-primary" />
            )}
            Export PDF Statement
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5 text-xs font-semibold shadow-sm bg-background hover:bg-muted"
            onClick={() => exportPaymentsToCsv(filteredPayments)}
            disabled={!filteredPayments.length}
          >
            <Download className="size-3.5 text-muted-foreground" /> CSV
          </Button>

          <Button size="sm" className="rounded-full shadow-glow font-bold text-xs" onClick={() => setOpen(true)}>
            <Plus className="size-4 mr-1" /> Record payment
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Financial Metrics Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">Total Collected</p>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Wallet className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
              {money(metrics.totalCollected)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{metrics.count} total payment records</p>
          </div>

          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">M-Pesa STK Push</p>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Smartphone className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{money(metrics.mpesaVolume)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Safaricom Daraja collections</p>
          </div>

          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">KCB BUNI PayBill</p>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Building className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-blue-600">{money(metrics.kcbVolume)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">KCB BUNI IPN collections</p>
          </div>

          <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">Bank &amp; Cash</p>
              <span className="p-2 rounded-xl bg-muted text-muted-foreground">
                <CreditCard className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{money(metrics.otherVolume)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Cash, cheque, and direct transfers</p>
          </div>
        </div>

        {/* 2. Main Payments Table Card with Search & Filters */}
        <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Receipt className="size-5 text-primary" /> Collections Ledger
              </h3>
              <p className="text-xs text-muted-foreground">
                Showing {filteredPayments.length} of {rawPayments.length} recorded payments
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenant, ref, unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-full text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-9 w-36 rounded-full text-xs font-semibold">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="mpesa">Safaricom M-Pesa</SelectItem>
                  <SelectItem value="kcb">KCB BUNI PayBill</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {payments.isLoading ? (
            <TableSkeleton rows={6} cols={10} />
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={searchQuery || methodFilter !== "all" ? "No payments match your filters" : "No payments recorded yet"}
              hint={
                searchQuery || methodFilter !== "all"
                  ? "Try clearing your search query or payment method filter."
                  : "Record your first rent collection to generate and dispatch an instant verified receipt."
              }
              action={
                searchQuery || methodFilter !== "all"
                  ? {
                      label: "Clear Filters",
                      onClick: () => {
                        setSearchQuery("");
                        setMethodFilter("all");
                      },
                    }
                  : {
                      label: "+ Record First Payment",
                      onClick: () => {
                        setDraft({
                          tenant_id: "",
                          amount: 0,
                          method: "mpesa",
                          reference: "",
                          paid_at: today(),
                          period_label: new Date().toISOString().slice(0, 7),
                          notes: "",
                        });
                        setOpen(true);
                      },
                    }
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[850px]">
                <thead className="text-left text-xs text-muted-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="p-3 rounded-l-xl">Date</th>
                    <th className="p-3">Tenant &amp; Property</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Period</th>
                    <th className="p-3">Receipt</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedPayments.map((p: any) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                        {shortDate(p.paid_at)}
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">{p.tenants?.full_name ?? "—"}</p>
                          <p className="text-[11px] text-muted-foreground">{p.properties?.name || "—"}</p>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-medium text-xs">
                        {p.units?.unit_number || p.units?.room_number || "—"}
                      </td>
                      <td className="p-3">
                        {p.method === "mpesa" ? (
                          <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/5 gap-1">
                            <Smartphone className="size-3" /> M-Pesa
                          </Badge>
                        ) : p.method === "kcb" || p.method === "kcb_buni" ? (
                          <Badge variant="outline" className="text-[10px] font-semibold text-blue-600 border-blue-500/30 bg-blue-500/5 gap-1">
                            <Building className="size-3" /> KCB PayBill
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-semibold capitalize">
                            {p.method}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground select-all">
                        {p.reference || "—"}
                      </td>
                      <td className="p-3 text-xs font-medium">{p.period_label ?? "—"}</td>
                      <td className="p-3">
                        {p.receipts?.[0]?.receipt_number ? (
                          <Badge variant="secondary" className="font-mono text-[10px] font-bold text-primary">
                            {p.receipts[0].receipt_number}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={p.status === "paid" ? "default" : "secondary"}
                          className="text-[10px] capitalize"
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-bold text-foreground font-mono">
                        {money(p.amount)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-full"
                            aria-label="Edit payment"
                            onClick={() => {
                              setEditing({ id: p.id });
                              setEditDraft({
                                amount: Number(p.amount),
                                method: p.method,
                                reference: p.reference ?? "",
                                paid_at: String(p.paid_at).slice(0, 10),
                                period_label: p.period_label ?? "",
                                notes: p.notes ?? "",
                              });
                            }}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-full text-destructive"
                            aria-label="Delete payment"
                            onClick={() => {
                              setDeletingPaymentId(p.id);
                            }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredPayments.length > pageSize && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs text-muted-foreground">
              <span>
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, filteredPayments.length)} of {filteredPayments.length} payments
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs gap-1"
                  disabled={page <= 1}
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-3.5" /> Previous
                </Button>
                <span className="font-semibold text-foreground px-1">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs gap-1"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.tenant_id) {
                toast.error("Select a tenant");
                return;
              }
              mutation.mutate();
            }}
          >
            <Field label="Tenant" className="sm:col-span-2">
              <Select
                value={draft.tenant_id}
                onValueChange={(v) => {
                  const t = (tenants.data ?? []).find((x) => x.id === v);
                  setDraft({ ...draft, tenant_id: v, amount: Number(t?.rent_amount ?? 0) });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose tenant" />
                </SelectTrigger>
                <SelectContent>
                  {(tenants.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name} · {t.units?.unit_number ?? "no unit"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Amount" htmlFor="amt">
              <Input
                id="amt"
                type="number"
                min={1}
                required
                value={draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Method">
              <Select value={draft.method} onValueChange={(v) => setDraft({ ...draft, method: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment date" htmlFor="pd">
              <Input
                id="pd"
                type="date"
                required
                value={draft.paid_at}
                onChange={(e) => setDraft({ ...draft, paid_at: e.target.value })}
              />
            </Field>
            <Field label="Period (YYYY-MM)" htmlFor="per">
              <Input
                id="per"
                maxLength={40}
                value={draft.period_label}
                onChange={(e) => setDraft({ ...draft, period_label: e.target.value })}
              />
            </Field>
            <Field label="Reference (M-Pesa code)" htmlFor="ref" className="sm:col-span-2">
              <Input
                id="ref"
                maxLength={80}
                value={draft.reference}
                onChange={(e) => setDraft({ ...draft, reference: e.target.value })}
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <Textarea
                maxLength={1000}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
                Save & generate receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit payment</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              editMutation.mutate();
            }}
          >
            <Field label="Amount" htmlFor="eamt">
              <Input
                id="eamt"
                type="number"
                min={1}
                required
                value={editDraft.amount}
                onChange={(e) => setEditDraft({ ...editDraft, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Method">
              <Select
                value={editDraft.method}
                onValueChange={(v) => setEditDraft({ ...editDraft, method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment date" htmlFor="epd">
              <Input
                id="epd"
                type="date"
                required
                value={editDraft.paid_at}
                onChange={(e) => setEditDraft({ ...editDraft, paid_at: e.target.value })}
              />
            </Field>
            <Field label="Period (YYYY-MM)" htmlFor="eper">
              <Input
                id="eper"
                maxLength={40}
                value={editDraft.period_label}
                onChange={(e) => setEditDraft({ ...editDraft, period_label: e.target.value })}
              />
            </Field>
            <Field label="Reference (M-Pesa code)" htmlFor="eref" className="sm:col-span-2">
              <Input
                id="eref"
                maxLength={80}
                value={editDraft.reference}
                onChange={(e) => setEditDraft({ ...editDraft, reference: e.target.value })}
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <Textarea
                maxLength={1000}
                value={editDraft.notes}
                onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={editMutation.isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingPaymentId)}
        onOpenChange={(isOpen) => !isOpen && setDeletingPaymentId(null)}
        title="Delete Payment & Receipt"
        description="Are you sure you want to delete this payment record and its associated digital receipt? This action cannot be undone."
        confirmText="Delete Payment"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deletingPaymentId) {
            deleteMutation.mutate(deletingPaymentId, {
              onSettled: () => setDeletingPaymentId(null),
            });
          }
        }}
      />
    </AppShell>
  );
}
