import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  DoorOpen,
  FileText,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboard } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { money, shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Landlord Dashboard — Rent Receipt Pro" },
      { name: "description", content: "Track income, occupancy, tenants and receipts in real time." },
      { property: "og:title", content: "Landlord Dashboard — Rent Receipt Pro" },
      { property: "og:description", content: "Your live property performance overview." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDashboard() });

  const t = data?.totals;
  const cards = [
    { label: "Properties", value: t ? String(t.properties) : "—", icon: Building2 },
    { label: "Units", value: t ? `${t.occupied}/${t.units} occupied` : "—", icon: DoorOpen },
    { label: "Tenants", value: t ? String(t.tenants) : "—", icon: Users },
    { label: "Collected this month", value: t ? money(t.monthlyIncome) : "—", icon: Wallet },
    { label: "Outstanding", value: t ? money(t.outstanding) : "—", icon: TrendingUp },
    { label: "Open requests", value: t ? String(t.openRequests) : "—", icon: Wrench },
  ];

  return (
    <AppShell
      title="Dashboard"
      description="Live overview of your portfolio"
      actions={
        <Button asChild size="sm" className="rounded-full shadow-glow">
          <Link to="/payments">Record payment</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase">{c.label}</p>
              <c.icon className="size-4 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-7 w-24" />
            ) : (
              <p className="mt-3 font-display text-2xl font-bold">{c.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-6 lg:col-span-2">
          <h2 className="font-semibold">Revenue trend</h2>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueByMonth ?? []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Recent receipts</h2>
          <ul className="mt-4 space-y-3">
            {(data?.recentReceipts ?? []).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{r.receipt_number}</span>
                  <span className="text-xs text-muted-foreground">{shortDate(r.issued_at)}</span>
                </span>
                <span className="font-semibold text-primary">{money(Number(r.amount))}</span>
              </li>
            ))}
            {!isLoading && (data?.recentReceipts ?? []).length === 0 ? (
              <li className="text-sm text-muted-foreground">No receipts yet.</li>
            ) : null}
          </ul>

          <h2 className="mt-8 font-semibold">Leases expiring soon</h2>
          <ul className="mt-4 space-y-3">
            {(data?.expiringLeases ?? []).map((t2) => (
              <li key={t2.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{t2.full_name}</span>
                <span className="text-xs text-muted-foreground">{shortDate(t2.lease_end)}</span>
              </li>
            ))}
            {!isLoading && (data?.expiringLeases ?? []).length === 0 ? (
              <li className="text-sm text-muted-foreground">Nothing expiring in 60 days.</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="surface-card mt-6 p-6">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="font-semibold">Recent payments</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentPayments ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="py-3">{shortDate(p.paid_at)}</td>
                  <td className="py-3 capitalize">{p.method}</td>
                  <td className="py-3 capitalize">{p.status}</td>
                  <td className="py-3 text-right font-semibold">{money(Number(p.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && (data?.recentPayments ?? []).length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}