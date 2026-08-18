import { motion } from "motion/react";
import { ArrowUpRight, Building2, FileText, Users, Wallet } from "lucide-react";
import { Counter } from "./Counter";

const stats = [
  { icon: Building2, label: "Properties", value: 12 },
  { icon: Users, label: "Tenants", value: 148 },
  { icon: Wallet, label: "Collected (KSh)", value: 1840000 },
  { icon: FileText, label: "Receipts", value: 932 },
];

const bars = [42, 58, 51, 74, 66, 88, 79, 95, 84, 72, 90, 100];

export function DashboardPreview() {
  return (
    <section id="preview" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-72 bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Dashboard</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Your portfolio at a glance</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="surface-card mt-14 p-5 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent/60 p-5">
                <div className="flex items-center justify-between">
                  <s.icon className="size-4 text-primary" />
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold">
                  <Counter to={s.value} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold">Monthly collections</p>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </div>
              <p className="text-sm font-semibold text-primary">+24.8%</p>
            </div>
            <div className="mt-6 flex h-40 items-end gap-2">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="gradient-primary flex-1 rounded-t-lg"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
