import { motion } from "motion/react";
import { Building2, FileText, ShieldCheck, Smartphone } from "lucide-react";
import { Counter } from "./Counter";

const pillars = [
  { icon: Building2, title: "Built for landlords", text: "Unlimited properties, units and tenants." },
  { icon: FileText, title: "Instant receipts", text: "Every payment produces a branded PDF receipt." },
  { icon: Smartphone, title: "Tenant self-service", text: "Tenants verify and download from any phone." },
  { icon: ShieldCheck, title: "Fraud proof", text: "QR codes verify every receipt against our records." },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            About Codevanta Ventures
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            Property management that finally feels <span className="gradient-text">effortless</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Rent Receipt Pro simplifies property management for landlords while giving tenants
            instant access to their receipts online. Track every shilling collected, every unit
            occupied and every lease expiring — from one luxury dashboard built for Kenyan
            landlords, hostels and real estate teams.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: "Collection rate", value: 98, suffix: "%" },
              { label: "Receipt time", value: 3, suffix: "s" },
              { label: "Uptime", value: 99, suffix: ".9%" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-primary">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="surface-card p-6 transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="gradient-primary inline-flex size-11 items-center justify-center rounded-2xl shadow-glow">
                <p.icon className="size-5 text-primary-foreground" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}