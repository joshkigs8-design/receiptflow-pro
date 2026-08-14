import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { getReports } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Rent Receipt Pro" },
      { name: "description", content: "Income, occupancy and arrears analytics for your portfolio." },
      { property: "og:title", content: "Reports & Analytics — Rent Receipt Pro" },
      { property: "og:description", content: "Understand your rental income at a glance." },
    ],
  }),
  component: ReportsPage,
});

const COLORS = ["var(--color-primary)", "var(--color-chart-2)", "var(--color-chart-4)"];

function ReportsPage() {
  const fetchReports = useServerFn(getReports);
  const { data } = useQuery({ queryKey: ["reports"], queryFn: () => fetchReports() });

  const payments = data?.payments ?? [];
  const units = data?.units ?? [];
  const tenants = data?.tenants ?? [];

  const byMonth = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(new Date().getFullYear(), i, 1);
    const key = d.toISOString().slice(0, 7);
    return {
      month: d.toLocaleDateString("en-GB", { month: "short" }),
      income: payments
        .filter((p) => (p.paid_at ?? "").startsWith(key))
        .reduce((s, p) => s + Number(p.amount), 0),
    };
  });

  const byMethod = ["cash", "mpesa", "bank", "card", "cheque"]
    .map((m) => ({
      name: m,
      value: payments.filter((p) => p.method === m).reduce((s, p) => s + Number(p.amount), 0),
    }))
    .filter((x) => x.value > 0);

  const totalIncome = payments.reduce((s, p) => s + Number(p.amount), 0);
  const expected = tenants
    .filter((t) => t.status === "active")
    .reduce((s, t) => s + Number(t.rent_amount), 0);
  const occupied = units.filter((u) => u.status === "occupied").length;

  function exportCsv() {
    const header = "date,amount,method,status\n";
    const body = payments
      .map((p) => `${p.paid_at},${p.amount},${p.method},${p.status}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="Reports"
      description="Income, occupancy and payment mix"
      actions={
        <Button size="sm" variant="outline" className="rounded-full" onClick={exportCsv}>
          <Download className="size-4" /> Export CSV
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total collected", value: money(totalIncome) },
          { label: "Expected monthly", value: money(expected) },
          {
            label: "Occupancy",
            value: units.length ? `${Math.round((occupied / units.length) * 100)}%` : "—",
          },
        ].map((c) => (
          <div key={c.label} className="surface-card p-5">
            <p className="text-xs text-muted-foreground uppercase">{c.label}</p>
            <p className="mt-3 font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-6 lg:col-span-2">
          <h2 className="font-semibold">Income by month</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
                <Bar dataKey="income" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Payment methods</h2>
          <div className="mt-6 h-72">
            {byMethod.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byMethod} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                    {byMethod.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => money(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}