import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ArrowDownCircle,
  Building2,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  Pencil,
  Plus,
  Receipt,
  Search,
  Tag,
  Trash2,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { listExpenses, saveExpense, deleteExpense, listProperties } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/TableSkeleton";
import { EmptyState } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortDate, money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Property Expenses & P&L — Rent Receipt Pro" },
      {
        name: "description",
        content: "Track property operating expenses, vendor payments, and cash flow outflows.",
      },
    ],
  }),
  component: ExpensesPage,
});

const EXPENSE_CATEGORIES = [
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "salaries", label: "Staff & Caretaker Salaries" },
  { value: "electricity", label: "Electricity / KPLC Tokens" },
  { value: "water", label: "Water & Borehole" },
  { value: "garbage", label: "Garbage Collection" },
  { value: "security", label: "Security & Guard Services" },
  { value: "taxes", label: "County Rates & Land Rates" },
  { value: "maintenance", label: "General Maintenance" },
  { value: "other", label: "Other Operating Expenses" },
] as const;

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];

interface ExpenseFormData {
  id?: string;
  property_id: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  vendor: string;
  receipt_image_url: string;
  notes: string;
}

const emptyForm: ExpenseFormData = {
  property_id: "",
  category: "repairs",
  amount: 0,
  expense_date: new Date().toISOString().slice(0, 10),
  vendor: "",
  receipt_image_url: "",
  notes: "",
};

function ExpensesPage() {
  const qc = useQueryClient();
  const fetchExpenses = useServerFn(listExpenses);
  const mutateExpense = useServerFn(saveExpense);
  const removeExpense = useServerFn(deleteExpense);
  const fetchProps = useServerFn(listProperties);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => fetchExpenses(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProps(),
  });

  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: (data: ExpenseFormData) =>
      mutateExpense({
        data: {
          ...data,
          amount: Number(data.amount),
          property_id: data.property_id || undefined,
          vendor: data.vendor || undefined,
          receipt_image_url: data.receipt_image_url || undefined,
          notes: data.notes || undefined,
        },
      }),
    onSuccess: () => {
      toast.success(formData.id ? "Expense updated" : "Expense recorded successfully");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["reports"] });
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to record expense");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeExpense({ data: { id } }),
    onSuccess: () => {
      toast.success("Expense removed");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["reports"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete expense"),
  });

  // Calculate stats
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  const stats = useMemo(() => {
    let thisMonthTotal = 0;
    let allTimeTotal = 0;
    const catMap: Record<string, number> = {};

    expenses.forEach((e: any) => {
      const amt = Number(e.amount || 0);
      allTimeTotal += amt;
      if ((e.expense_date || "").startsWith(currentMonthKey)) {
        thisMonthTotal += amt;
      }
      catMap[e.category] = (catMap[e.category] || 0) + amt;
    });

    let topCat = "—";
    let topCatAmt = 0;
    Object.entries(catMap).forEach(([cat, sum]) => {
      if (sum > topCatAmt) {
        topCatAmt = sum;
        const found = EXPENSE_CATEGORIES.find((c) => c.value === cat);
        topCat = found ? found.label : cat;
      }
    });

    return { thisMonthTotal, allTimeTotal, topCat, totalCount: expenses.length };
  }, [expenses, currentMonthKey]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e: any) => {
      const vendor = (e.vendor || "").toLowerCase();
      const notes = (e.notes || "").toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !search || vendor.includes(q) || notes.includes(q);

      if (!matchesSearch) return false;
      if (propertyFilter !== "all" && e.property_id !== propertyFilter) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, search, propertyFilter, categoryFilter]);

  const openNewModal = () => {
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditModal = (e: any) => {
    setFormData({
      id: e.id,
      property_id: e.property_id || "",
      category: e.category || "repairs",
      amount: Number(e.amount || 0),
      expense_date: e.expense_date || new Date().toISOString().slice(0, 10),
      vendor: e.vendor || "",
      receipt_image_url: e.receipt_image_url || "",
      notes: e.notes || "",
    });
    setDialogOpen(true);
  };

  const exportCsv = () => {
    if (!filteredExpenses.length) {
      toast.info("No expense data to export");
      return;
    }
    const headers = ["Date", "Property", "Category", "Amount (KSh)", "Vendor", "Notes"];
    const rows = filteredExpenses.map((e: any) => [
      e.expense_date,
      `"${(e.properties?.name || "All Properties").replace(/"/g, '""')}"`,
      e.category,
      e.amount,
      `"${(e.vendor || "").replace(/"/g, '""')}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RentReceiptPro-Expenses-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Expenses exported to CSV");
  };

  return (
    <AppShell
      title="Expenses & Outflow"
      description="Track property maintenance, vendor payouts, utility bills, and cash outflow"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportCsv}
            className="rounded-full gap-1.5 h-10 px-4 text-xs font-medium"
          >
            <Download className="size-3.5" /> Export CSV
          </Button>
          <Button onClick={openNewModal} className="rounded-full gap-1.5 shadow-glow font-semibold h-10 px-5">
            <Plus className="size-4" /> Add Expense
          </Button>
        </div>
      }
    >
      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This Month</span>
            <TrendingDown className="size-4 text-rose-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-500">
            {money(stats.thisMonthTotal)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Operating expenses logged this month</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">All-Time Outflow</span>
            <Wallet className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{money(stats.allTimeTotal)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Across {stats.totalCount} expense records</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">Top Cost Driver</span>
            <Tag className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-lg font-bold truncate">{stats.topCat}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Highest aggregate category</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Tax Deductible</span>
            <Receipt className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-primary">100%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">KRA compliant expense tracking</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-2xl h-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="h-10 rounded-2xl w-36 text-xs">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 rounded-2xl w-40 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expenses Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          icon={ArrowDownCircle}
          title={search || propertyFilter !== "all" || categoryFilter !== "all" ? "No matching expenses" : "No expenses recorded yet"}
          hint={
            search || propertyFilter !== "all" || categoryFilter !== "all"
              ? "Try broadening your search query or filters."
              : "Log maintenance costs, caretaker salaries, electricity, and utilities to track true Net Rental Yield."
          }
          action={
            !search && propertyFilter === "all" && categoryFilter === "all"
              ? {
                  label: "Log First Expense",
                  onClick: openNewModal,
                }
              : undefined
          }
        />
      ) : (
        <div className="surface-card rounded-3xl border border-border/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Vendor / Payee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Receipt / Document</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((e: any) => {
                  const catLabel = EXPENSE_CATEGORIES.find((c) => c.value === e.category)?.label || e.category;
                  return (
                    <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {shortDate(e.expense_date)}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs font-medium">
                          {catLabel}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {e.properties?.name || "General Portfolio"}
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">
                          {e.vendor || "—"}
                        </div>
                        {e.notes && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                            {e.notes}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-display font-bold text-sm text-rose-500 whitespace-nowrap">
                        −{money(e.amount)}
                      </TableCell>

                      <TableCell>
                        {e.receipt_image_url ? (
                          <a
                            href={e.receipt_image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            <ImageIcon className="size-3.5" />
                            <span>Receipt</span>
                            <ExternalLink className="size-3 opacity-70" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
                            onClick={() => openEditModal(e)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            onClick={() => setDeleteId(e.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {formData.id ? "Edit Expense" : "Record Property Expense"}
            </DialogTitle>
            <DialogDescription>
              Record maintenance bills, utility purchases, staff wages, and property expenses.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formData.amount <= 0) {
                toast.error("Please enter an amount greater than 0");
                return;
              }
              saveMutation.mutate(formData);
            }}
            className="space-y-4 py-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: ExpenseCategory) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className="h-10 rounded-2xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-xs">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (KSh) *</Label>
                <Input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="e.g. 4500"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="h-10 rounded-2xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Property (Optional)</Label>
                <Select
                  value={formData.property_id || "none"}
                  onValueChange={(v) => setFormData({ ...formData, property_id: v === "none" ? "" : v })}
                >
                  <SelectTrigger className="h-10 rounded-2xl text-xs">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General / All Properties</SelectItem>
                    {properties.map((p: any) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Expense Date *</Label>
                <Input
                  type="date"
                  required
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  className="h-10 rounded-2xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vendor / Payee Name</Label>
              <Input
                placeholder="e.g. Nairobi Water, Kenya Power, Fundi Otieno, Caretaker"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="h-10 rounded-2xl text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Receipt / Invoice Photo URL (Optional)</Label>
              <Input
                type="url"
                placeholder="https://... (link to receipt image or PDF)"
                value={formData.receipt_image_url}
                onChange={(e) => setFormData({ ...formData, receipt_image_url: e.target.value })}
                className="h-10 rounded-2xl text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes &amp; Description</Label>
              <Textarea
                placeholder="Details of the repairs or purchase..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="rounded-2xl resize-none text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-full font-semibold px-6"
              >
                {saveMutation.isPending ? "Saving..." : formData.id ? "Update Expense" : "Record Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Expense Record"
        description="Are you sure you want to remove this expense record? This will adjust your Net P&L metrics accordingly."
        confirmText="Delete Expense"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </AppShell>
  );
}
