import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deletePayment,
  listPayments,
  listReceipts,
  listTenants,
  recordPayment,
  updatePayment,
} from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
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

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Rent Receipt Pro" },
      {
        name: "description",
        content: "Record rent payments and instantly issue digital receipts.",
      },
      { property: "og:title", content: "Payments — Rent Receipt Pro" },
      { property: "og:description", content: "Record payments and generate receipts instantly." },
    ],
  }),
  component: PaymentsPage,
});

const today = () => new Date().toISOString().slice(0, 10);

function PaymentsPage() {
  const qc = useQueryClient();
  const fetchPayments = useServerFn(listPayments);
  const fetchTenants = useServerFn(listTenants);
  const fetchReceipts = useServerFn(listReceipts);
  const record = useServerFn(recordPayment);
  const update = useServerFn(updatePayment);
  const remove = useServerFn(deletePayment);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<null | { id: string }>(null);
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

  const mutation = useMutation({
    mutationFn: () => record({ data: draft }),
    onSuccess: async (res) => {
      toast.success(`Receipt ${res.receiptNumber} generated`);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
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
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete payment"),
  });

  return (
    <AppShell
      title="Payments"
      description="Every shilling collected, with instant receipts"
      actions={
        <Button size="sm" className="rounded-full shadow-glow" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Record payment
        </Button>
      }
    >
      {payments.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading payments…</p>
      ) : (payments.data ?? []).length === 0 ? (
        <EmptyState
          title="No payments yet"
          hint="Record a payment to generate the first receipt."
        />
      ) : (
        <div className="surface-card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Tenant</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Period</th>
                <th className="p-3">Method</th>
                <th className="p-3">Receipt</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(payments.data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">{shortDate(p.paid_at)}</td>
                  <td className="p-3 font-medium">{p.tenants?.full_name ?? "—"}</td>
                  <td className="p-3">{p.units?.unit_number ?? "—"}</td>
                  <td className="p-3">{p.period_label ?? "—"}</td>
                  <td className="p-3 capitalize">{p.method}</td>
                  <td className="p-3">{p.receipts?.[0]?.receipt_number ?? "—"}</td>
                  <td className="p-3">
                    <Badge
                      variant={p.status === "paid" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-semibold">{money(p.amount)}</td>
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
                          if (
                            confirm("Delete this payment and its receipt? This cannot be undone.")
                          )
                            deleteMutation.mutate(p.id);
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
    </AppShell>
  );
}
