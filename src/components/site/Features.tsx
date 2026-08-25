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
  Zap,
} from "lucide-react";

const featureShowcase = [
  {
    icon: Building2,
    badge: "Multi-Estate Architecture",
    title: "Property Management",
    tagline: "Keep every property, unit and tenant organized from one place.",
    description:
      "Manage single apartments, multi-story residential blocks, commercial spaces, and student hostels with dedicated unit breakdown and occupancy tracking.",
    colSpan: "lg:col-span-6",
    highlight: "Unlimited properties & units",
  },
  {
    icon: Wallet,
    badge: "M-PESA & Bank Reconciliation",
    title: "Payment Tracking",
    tagline: "Know what has been paid, what is pending and what needs your attention.",
    description:
      "Log M-PESA Paybill, Till numbers, Bank transfers, Cheques, or Cash. Partial payments auto-adjust remaining balances without manual math.",
    colSpan: "lg:col-span-6",
    highlight: "Instant balance auto-matching",
  },
  {
    icon: FileCheck2,
    badge: "Public QR Verification",
    title: "Professional Receipts",
    tagline: "Create and send professional rental receipts instantly.",
    description:
      "Every generated receipt contains a cryptographically verified public QR code. Dispatched straight to tenant WhatsApp with official landlord digital seal.",
    colSpan: "lg:col-span-4",
    highlight: "Tamper-proof & branded PDF",
  },
  {
    icon: Users,
    badge: "5-Star Tenant Experience",
    title: "Tenant Management",
    tagline: "Keep tenant information organized and accessible whenever you need it.",
    description:
      "Store leases, tenant contact details, payment history, and emergency contacts. Tenants log in via OTP to download historical tax receipts on demand.",
    colSpan: "lg:col-span-4",
    highlight: "Self-service tenant portal",
  },
  {
    icon: BarChart3,
    badge: "KRA Tax Ready",
    title: "Reports & Insights",
    tagline: "Turn rental data into clear insights that help you make better decisions.",
    description:
      "Export rental income ledgers, occupancy percentages, and arrears statements formatted for Kenyan accountants and KRA annual tax filings.",
    colSpan: "lg:col-span-4",
    highlight: "1-Click PDF / Excel export",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 bg-[#FFFFFF] dark:bg-[#0A261D] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> Comprehensive Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            EVERYTHING YOU NEED TO RUN YOUR RENTALS.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            A complete suite of modern property management tools engineered specifically for Kenyan landlords.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {featureShowcase.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`p-7 sm:p-8 rounded-3xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 hover:border-[#087443] transition-all flex flex-col justify-between group shadow-sm ${f.colSpan}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788] group-hover:scale-110 transition-transform">
                    <f.icon className="size-6" />
                  </span>
                  <span className="text-[10px] font-bold text-[#087443] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] px-3 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="font-display text-xl font-bold text-[#101714] dark:text-[#F7F8F5]">
                    {f.title}
                  </h3>
                  <p className="text-xs font-bold text-[#087443] dark:text-[#52B788]">
                    {f.tagline}
                  </p>
                  <p className="text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed pt-1">
                    {f.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8E4] dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#087443] dark:text-[#52B788]">
                  <CheckCircle2 className="size-4" /> {f.highlight}
                </span>
                <span className="text-[#C9A227] font-bold group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
