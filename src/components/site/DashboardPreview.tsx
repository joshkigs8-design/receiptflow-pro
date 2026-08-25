import { motion } from "motion/react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Layers,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Counter } from "./Counter";
import { money } from "@/lib/format";

const stats = [
  { icon: Building2, label: "Managed Estates", value: 14, suffix: " Properties", change: "+2 this quarter" },
  { icon: Users, label: "Active Tenants", value: 186, suffix: " Occupied", change: "98.4% Occupancy" },
  { icon: Wallet, label: "Monthly Collections", value: 4850000, isCurrency: true, change: "+18.2% vs last month" },
  { icon: FileCheck2, label: "Digital Receipts", value: 1420, suffix: " Issued", change: "100% Verified" },
];

const monthlyData = [
  { month: "Sep", amount: 3800000, height: 60 },
  { month: "Oct", amount: 4100000, height: 68 },
  { month: "Nov", amount: 4350000, height: 74 },
  { month: "Dec", amount: 4600000, height: 82 },
  { month: "Jan", amount: 4400000, height: 78 },
  { month: "Feb", amount: 4700000, height: 88 },
  { month: "Mar", amount: 4550000, height: 84 },
  { month: "Apr", amount: 4800000, height: 92 },
  { month: "May", amount: 4750000, height: 90 },
  { month: "Jun", amount: 4900000, height: 95 },
  { month: "Jul", amount: 5050000, height: 98 },
  { month: "Aug", amount: 5200000, height: 100 },
];

export function DashboardPreview() {
  return (
    <section id="preview" className="relative py-28 overflow-hidden bg-muted/20 border-t border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 h-80 bg-primary/10 blur-3xl rounded-full" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Real-Time Business Intelligence
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Complete command of your rental empire
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Track paid vs defaulters in one click, monitor occupancy health, and project cashflow across all properties.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="surface-card mt-14 p-6 sm:p-8 rounded-3xl border border-border/80 shadow-float space-y-8"
        >
          {/* Key Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {s.change}
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">{s.label}</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {s.isCurrency ? "KSh " : ""}
                  <Counter to={s.value} />
                  {s.suffix || ""}
                </p>
              </div>
            ))}
          </div>

          {/* Collection Growth Chart Container */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-foreground">Yearly Rent Collection Velocity</p>
                <p className="text-xs text-muted-foreground">Historical 12-Month Performance Across Kenya</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <TrendingUp className="size-3.5" /> +36.8% YoY Growth
              </div>
            </div>

            <div className="flex h-48 items-end gap-2 sm:gap-3 pt-6 border-b border-border/60">
              {monthlyData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${d.height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-lg gradient-primary relative group-hover:opacity-80 transition-opacity"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-mono font-bold py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap shadow-md">
                      {money(d.amount)}
                    </span>
                  </motion.div>
                  <span className="text-[10px] font-mono text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
