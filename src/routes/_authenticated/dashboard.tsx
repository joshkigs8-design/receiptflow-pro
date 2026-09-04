import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  DoorOpen,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Megaphone,
  MessageCircle,
  Percent,
  Plus,
  Receipt,
  Share2,
  TrendingUp,
  UserPlus,
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
import { CollectionMeter } from "@/components/dashboard/CollectionMeter";
import { OccupancyGauge } from "@/components/dashboard/OccupancyGauge";
import { MotionContainer, MotionItem } from "@/components/ui/motion-stagger";
import { LiveRadar } from "@/components/ui/live-radar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { money, shortDate } from "@/lib/format";
import { receiptUrl } from "@/lib/receipt-pdf";
import { downloadLandlordManualPdf } from "@/lib/manual-pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Landlord Dashboard — Rent Receipt Pro" },
      {
        name: "description",
        content: "Track income, occupancy, tenants, and digital rent receipts in real time.",
      },
      { property: "og:title", content: "Landlord Dashboard — Rent Receipt Pro" },
      { property: "og:description", content: "Your live property performance overview." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const t = data?.totals;
  const cards = [
    {
      label: "Properties",
      value: t ? String(t.properties) : "—",
      sub: `${t?.units ?? 0} total units`,
      icon: Building2,
      color: "text-blue-500",
    },
    {
      label: "Occupancy Rate",
      value: t ? `${t.occupancyRate}%` : "—",
      sub: `${t?.occupied ?? 0} occupied · ${t?.vacant ?? 0} vacant`,
      icon: DoorOpen,
      color: "text-indigo-500",
    },
    {
      label: "Active Tenants",
      value: t ? String(t.tenants) : "—",
      sub: "Registered across properties",
      icon: Users,
      color: "text-cyan-500",
    },
    {
      label: "Collected This Month",
      value: t ? money(t.monthlyIncome) : "—",
      sub: `${t?.collectionRate ?? 0}% of expected target`,
      icon: Wallet,
      color: "text-emerald-500",
    },
    {
      label: "Outstanding Rent",
      value: t ? money(t.outstanding) : "—",
      sub: (t as any)?.priorArrears > 0 ? `Includes ${money((t as any).priorArrears)} prior arrears` : "Pending collection this month",
      icon: TrendingUp,
      color: t?.outstanding && t.outstanding > 0 ? "text-rose-500" : "text-emerald-500",
    },
    {
      label: "Open Maintenance",
      value: t ? String(t.openRequests) : "—",
      sub: "Active tenant tickets",
      icon: Wrench,
      color: t?.openRequests && t.openRequests > 0 ? "text-amber-500" : "text-muted-foreground",
    },
  ];

  function copyTenantPortalLink() {
    const url = `${window.location.origin}/tenant`;
    void navigator.clipboard.writeText(url);
    toast.success("Tenant Portal link copied! Share with your tenants.");
  }

  function shareReceiptWhatsApp(receiptNumber: string, publicId: string, amount: number, tenantName: string) {
    const url = receiptUrl(publicId);
    const message = encodeURIComponent(
      `Hello ${tenantName}, here is your official verified rent receipt (${receiptNumber}) for ${money(amount)}:\n${url}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  return (
    <AppShell
      title="Dashboard"
      description="Live overview of your rental portfolio and collections"
      actions={
        <div className="flex items-center gap-2">
          <LiveRadar status="online" label="M-Pesa Sync Active" className="hidden lg:inline-flex" />
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-9 gap-1.5 hidden sm:inline-flex"
            onClick={copyTenantPortalLink}
          >
            <Share2 className="size-3.5" /> Share Tenant Portal
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-9 gap-1.5 hidden md:inline-flex border-primary/30 text-primary hover:bg-primary/10 font-semibold"
            onClick={() => downloadLandlordManualPdf()}
          >
            <BookOpen className="size-3.5" /> Manual (PDF)
          </Button>
          <Button asChild size="sm" className="rounded-full shadow-glow text-xs h-9 gap-1.5 font-semibold tactile-press">
            <Link to="/payments">
              <Plus className="size-4" /> Record Payment
            </Link>
          </Button>
        </div>
      }
    >
      <MotionContainer className="space-y-6" staggerChildren={0.08}>
        {/* KPI Metric Cards */}
        <MotionContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.05}>
          {cards.map((c) => (
            <MotionItem key={c.label}>
              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.label}</p>
                  <span className="p-2 rounded-xl bg-accent/60 transition-transform group-hover:scale-105">
                    <c.icon className={`size-4 ${c.color}`} />
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="mt-3 h-7 w-28" />
                ) : (
                  <>
                    <p className="mt-2 font-display text-2xl font-bold tracking-tight">{c.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
                  </>
                )}
              </div>
            </MotionItem>
          ))}
        </MotionContainer>

        {/* Visual Performance Gauges: CollectionMeter & OccupancyGauge */}
        <MotionItem>
          <div className="grid gap-4 lg:grid-cols-3">
            <CollectionMeter
              collected={t?.monthlyIncome ?? 0}
              expected={t?.expectedMonthly ?? 0}
              outstanding={t?.outstanding ?? 0}
              priorArrears={(t as { priorArrears?: number } | undefined)?.priorArrears}
              collectionRate={t?.collectionRate ?? 0}
              className="lg:col-span-2"
            />
            <OccupancyGauge
              occupancyRate={t?.occupancyRate ?? 0}
              occupiedUnits={t?.occupied ?? 0}
              vacantUnits={t?.vacant ?? 0}
              totalUnits={t?.units ?? 0}
            />
          </div>
        </MotionItem>

        {/* Management Shortcuts Toolbar */}
        <MotionItem>
          <div className="surface-card p-5 rounded-3xl border border-border/80 shadow-sm space-y-3">
            <h3 className="font-display text-sm font-bold flex items-center gap-2">
              <Building2 className="size-4 text-primary" /> Management Shortcuts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              <Button asChild variant="outline" size="sm" className="rounded-xl h-10 text-xs justify-start px-3 tactile-press">
                <Link to="/tenants">
                  <UserPlus className="size-3.5 mr-1.5 text-blue-500" /> Add Tenant
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl h-10 text-xs justify-start px-3 tactile-press">
                <Link to="/properties">
                  <Building2 className="size-3.5 mr-1.5 text-indigo-500" /> New Property
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl h-10 text-xs justify-start px-3 tactile-press">
                <Link to="/announcements">
                  <Megaphone className="size-3.5 mr-1.5 text-amber-500" /> Post Notice
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl h-10 text-xs justify-start px-3 tactile-press">
                <Link to="/reports">
                  <Receipt className="size-3.5 mr-1.5 text-emerald-500" /> Full Reports
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadLandlordManualPdf()}
                className="rounded-xl h-10 text-xs justify-start px-3 col-span-2 sm:col-span-1 lg:col-span-1 text-primary border-primary/30 hover:bg-primary/10 font-semibold tactile-press"
              >
                <Download className="size-3.5 mr-1.5 text-primary" /> Manual (PDF)
              </Button>
            </div>
          </div>
        </MotionItem>

        {/* Charts & Receipts Grid */}
        <MotionItem>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Revenue Chart */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" /> Revenue Trend
                  </h2>
                  <p className="text-xs text-muted-foreground">Historical collections across the last 6 months</p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">KES Currency</Badge>
              </div>

              <div className="h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.revenueByMonth ?? []}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                        <stop offset="60%" stopColor="#087443" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#087443" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.45} />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} tickFormatter={(v) => `KSh ${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        borderColor: "var(--color-border)",
                        borderRadius: 16,
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                        backdropFilter: "blur(12px)",
                      }}
                      formatter={(v: number) => [money(v), "Rent Collected"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#revGrad)"
                      dot={{ r: 3, fill: "#10B981", strokeWidth: 2, stroke: "#FFFFFF" }}
                      activeDot={{ r: 6, fill: "#087443", stroke: "#34D399", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          {/* Recent Receipts & Expiring Leases */}
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold flex items-center gap-2">
                  <FileCheck2 className="size-4 text-primary" /> Recent Receipts
                </h2>
                <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                  <Link to="/receipts">All →</Link>
                </Button>
              </div>

              <div className="mt-3 space-y-2.5">
                {(data?.recentReceipts ?? []).slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="block truncate font-bold font-mono text-foreground">{r.receipt_number}</span>
                      <span className="text-[11px] text-muted-foreground">{shortDate(r.issued_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-primary">{money(Number(r.amount))}</span>
                      <a href={receiptUrl(r.public_id)} target="_blank" rel="noreferrer">
                        <Button size="icon" variant="ghost" className="size-7 rounded-full">
                          <Download className="size-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
                {!isLoading && (data?.recentReceipts ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">No receipts generated yet.</p>
                ) : null}
              </div>
            </div>

            {/* Expiring Leases */}
            <div className="pt-4 border-t border-border/80">
              <h2 className="font-display text-sm font-bold flex items-center gap-2">
                <Clock className="size-4 text-amber-500" /> Leases Expiring Soon (60 Days)
              </h2>
              <div className="mt-3 space-y-2">
                {(data?.expiringLeases ?? []).map((t2) => (
                  <div key={t2.id} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="font-semibold truncate">{t2.full_name}</span>
                    <span className="font-mono text-muted-foreground">{shortDate(t2.lease_end)}</span>
                  </div>
                ))}
                {!isLoading && (data?.expiringLeases ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-1">All leases are current and active.</p>
                ) : null}
              </div>
              </div>
            </div>
          </div>
        </MotionItem>

        {/* Recent Payments Feed */}
        <MotionItem>
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h2 className="font-display text-base font-bold flex items-center gap-2">
                  <Receipt className="size-4 text-primary" /> Recent Payment Transactions
                </h2>
                <p className="text-xs text-muted-foreground">Tenant rent payments recorded in your properties</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs h-8 whitespace-nowrap shrink-0 self-start sm:self-auto tactile-press">
                <Link to="/payments">View full payment ledger</Link>
              </Button>
            </div>

            {(data?.recentPayments ?? []).length ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property / Unit</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentPayments.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-mono">{shortDate(p.paid_at)}</TableCell>
                        <TableCell className="text-xs font-semibold">{p.tenants?.full_name || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.properties?.name || "—"} {p.units?.unit_number ? `· Unit ${p.units.unit_number}` : ""}
                        </TableCell>
                        <TableCell className="text-xs capitalize font-medium">{p.method}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "paid" ? "default" : "secondary"} className="text-[10px] capitalize">
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-display text-sm font-bold text-emerald-500">
                          {money(Number(p.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-6 text-sm text-muted-foreground text-center">No rent payments recorded yet.</p>
            )}
          </div>
        </MotionItem>
      </MotionContainer>
    </AppShell>
  );
}
