import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Download,
  PieChart as PieChartIcon,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getReports } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { TableSkeleton } from "@/components/app/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Financial Reports & Net P&L — Rent Receipt Pro" },
      {
        name: "description",
        content: "Portfolio revenue, operating expenses, net operating income (P&L), and occupancy metrics.",
      },
    ],
  }),
  component: ReportsPage,
});

const METHOD_COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

const EXPENSE_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#A855F7", // Purple
  "#64748B", // Slate
];

function ReportsPage() {
  const fetchReports = useServerFn(getReports);
  const { data, isLoading } = useQuery({ queryKey: ["reports"], queryFn: () => fetchReports() });

  const payments = data?.payments ?? [];
  const units = data?.units ?? [];
  const tenants = data?.tenants ?? [];
  const expenses = data?.expenses ?? [];

  const totalIncome = useMemo(
    () => payments.reduce((s: number, p) => s + Number(p.amount || 0), 0),
    [payments]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((s: number, e: { amount: number | null }) => s + Number(e.amount || 0), 0),
    [expenses]
  );
  const netIncome = totalIncome - totalExpenses;
  const netProfitMargin = totalIncome > 0 ? Math.round((netIncome / totalIncome) * 100) : 0;

  const expectedMonthly = useMemo(
    () =>
      tenants
        .filter((t) => t.status === "active")
        .reduce((s: number, t) => s + Number(t.rent_amount || 0), 0),
    [tenants]
  );

  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const occupancyRate = units.length ? Math.round((occupiedUnits / units.length) * 100) : 0;

  // Monthly Cash Flow (Income vs Outflow)
  const monthlyCashflow = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const monthLabel = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });

      const income = payments
        .filter((p) => (p.paid_at ?? "").startsWith(key))
        .reduce((s: number, p) => s + Number(p.amount || 0), 0);

      const outflow = expenses
        .filter((e: { expense_date: string | null }) => (e.expense_date ?? "").startsWith(key))
        .reduce((s: number, e: { amount: number | null }) => s + Number(e.amount || 0), 0);

      result.push({
        month: monthLabel,
        income,
        expenses: outflow,
        net: income - outflow,
      });
    }
    return result;
  }, [payments, expenses]);

  // Payment methods breakdown
  const byMethod = useMemo(() => {
    return ["cash", "mpesa", "bank", "card", "cheque"]
      .map((m) => ({
        name: m.toUpperCase(),
        value: payments.filter((p) => (p.method || "").toLowerCase() === m).reduce((s: number, p) => s + Number(p.amount || 0), 0),
      }))
      .filter((x) => x.value > 0);
  }, [payments]);

  // Expenses category breakdown
  const byExpenseCategory = useMemo(() => {
    const catMap: Record<string, number> = {};
    expenses.forEach((e: { category: string | null; amount: number | null }) => {
      const c = e.category || "other";
      catMap[c] = (catMap[c] || 0) + Number(e.amount || 0);
    });
    return Object.entries(catMap)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  function exportCsv() {
    const header = "Type,Date,Category_or_Method,Amount_KSh,Status_or_Vendor\n";
    const paymentRows = payments.map(
      (p) => `Revenue,${p.paid_at || ""},${p.method || "mpesa"},${p.amount},${p.status || "confirmed"}`
    );
    const expenseRows = expenses.map(
      (e: { expense_date: string | null; category: string | null; amount: number | null; vendor: string | null }) =>
        `Expense,${e.expense_date || ""},${e.category || "other"},${e.amount},"${(e.vendor || "").replace(/"/g, '""')}"`
    );
    const blob = new Blob([[header, ...paymentRows, ...expenseRows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RentReceiptPro-PNL-Report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="Reports & Analytics"
      description="Portfolio revenue, operating outflow, net operating income (P&L), and occupancy metrics"
      actions={
        <Button size="sm" variant="outline" className="rounded-full gap-1.5 h-10 px-4 text-xs font-semibold" onClick={exportCsv}>
          <Download className="size-4" /> Export Complete P&L (CSV)
        </Button>
      }
    >
      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : (
        <>
          {/* Top KPI Cards: Revenue, Expenses, Net P&L, Occupancy */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross Rent Collected</span>
                <ArrowUpCircle className="size-4 text-emerald-500" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-emerald-500">{money(totalIncome)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">All confirmed rental receipts</p>
            </div>

            <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operating Expenses</span>
                <ArrowDownCircle className="size-4 text-rose-500" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-rose-500">{money(totalExpenses)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Repairs, utilities, staff, and taxes</p>
            </div>

            <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Net Operating Income (P&L)</span>
                <Wallet className="size-4 text-primary" />
              </div>
              <p className={`mt-2 font-display text-2xl font-bold ${netIncome >= 0 ? "text-primary" : "text-rose-500"}`}>
                {money(netIncome)}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Margin: {netProfitMargin}% net cash flow yield
              </p>
            </div>

            <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occupancy Rate</span>
                <Building2 className="size-4 text-blue-500" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-blue-500">
                {occupancyRate}%
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {occupiedUnits} of {units.length} units occupied · Exp: {money(expectedMonthly)}/mo
              </p>
            </div>
          </div>

          {/* Cash Flow Chart (Income vs Expenses by Month) */}
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold">Monthly Cash Flow &amp; Net Yield</h2>
                <p className="text-xs text-muted-foreground">Gross rental collections vs property operating expenses over the past 12 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-3 rounded-sm bg-emerald-500 inline-block" /> Rental Income
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-3 rounded-sm bg-rose-500 inline-block" /> Expenses
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCashflow} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 16,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => money(v)}
                  />
                  <Bar dataKey="income" name="Rental Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Operating Expenses" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Breakdown Section: Payment Methods & Expense Categories */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment Methods */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm">
              <h2 className="font-display text-base font-bold flex items-center gap-2 mb-1">
                <TrendingUp className="size-4 text-primary" /> Payment Method Mix
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Breakdown of tenant payment channels</p>

              <div className="h-64">
                {byMethod.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                    No payment records yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byMethod}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                      >
                        {byMethod.map((entry, i) => (
                          <Cell key={entry.name} fill={METHOD_COLORS[i % METHOD_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => money(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border/60">
                {byMethod.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-1.5 text-xs font-medium">
                    <span
                      className="size-2.5 rounded-full inline-block"
                      style={{ backgroundColor: METHOD_COLORS[i % METHOD_COLORS.length] }}
                    />
                    <span>{m.name}: {money(m.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Categories Breakdown */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm">
              <h2 className="font-display text-base font-bold flex items-center gap-2 mb-1">
                <PieChartIcon className="size-4 text-rose-500" /> Expense Category Distribution
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Cost center allocation across your properties</p>

              <div className="h-64">
                {byExpenseCategory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                    No expense records yet. Log expenses in Finances → Expenses.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byExpenseCategory}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                      >
                        {byExpenseCategory.map((entry, i) => (
                          <Cell key={entry.name} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => money(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border/60">
                {byExpenseCategory.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs font-medium">
                    <span
                      className="size-2.5 rounded-full inline-block"
                      style={{ backgroundColor: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }}
                    />
                    <span>{c.name}: {money(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
