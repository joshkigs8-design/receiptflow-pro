import { motion } from "motion/react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileText,
  Lock,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";

const bentoFeatures = [
  {
    icon: QrCode,
    badge: "Public Verification",
    title: "Tamper-Proof QR Code Receipts",
    description:
      "Every generated receipt contains a cryptographically verified public QR code. Tenants, banks, employers and embassies can scan to verify authenticity in 1 second.",
    highlight: "Zero forgery risk",
    colSpan: "lg:col-span-8",
  },
  {
    icon: Smartphone,
    badge: "M-Pesa Daraja 3.0",
    title: "Automated M-Pesa & Bank Tracking",
    description:
      "Record M-Pesa Till, Paybill, Bank transfers, Cheques or Cash. Auto-reconciles rent payments against units and calculates balances instantly.",
    highlight: "Instant Reconciliation",
    colSpan: "lg:col-span-4",
  },
  {
    icon: UserCheck,
    badge: "Delegated Access",
    title: "Caretaker & Agent Permissions",
    description:
      "Invite your estate caretakers with restricted on-site permissions: they can record payments and issue receipts, but cannot alter rent prices or delete properties.",
    highlight: "Role-Based Security",
    colSpan: "lg:col-span-4",
  },
  {
    icon: Users,
    badge: "5-Star Experience",
    title: "Tenant Self-Service Portal",
    description:
      "Tenants log in seamlessly with phone OTP to view their full payment history, download historical tax receipts, and submit maintenance tickets with photos.",
    highlight: "Zero Landlord Phone Calls",
    colSpan: "lg:col-span-4",
  },
  {
    icon: BarChart3,
    badge: "KRA Ready",
    title: "Tax & Financial Year-End Reports",
    description:
      "Export comprehensive rental income reports, occupancy charts, and arrears statements formatted for Kenyan accountants and KRA tax compliance.",
    highlight: "1-Click Excel / PDF Export",
    colSpan: "lg:col-span-4",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Enterprise Platform Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Engineered for high-performing Kenyan landlords
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            From single residential apartments to multi-hundred unit commercial portfolios — all your property operations in one unified system.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {bentoFeatures.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`surface-card group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl border border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-float ${f.colSpan}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="size-6" />
                  </span>
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {f.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> {f.highlight}
                </span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Learn more →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
