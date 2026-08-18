import { motion } from "motion/react";
import { BarChart3, Building2, FileText, QrCode, Users, Wallet } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Property & Unit Management",
    text: "Unlimited properties with photos, GPS, amenities and notes.",
  },
  {
    icon: Users,
    title: "Tenant Management",
    text: "Full tenant profiles, IDs, documents and lease dates.",
  },
  {
    icon: FileText,
    title: "Professional Rent Receipts",
    text: "Branded PDF receipts generated the moment rent is paid.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    text: "Every receipt carries a QR code that proves it is genuine.",
  },
  {
    icon: Wallet,
    title: "Rent Payment Tracking",
    text: "Cash, M-Pesa, bank, card and cheque with balances.",
  },
  {
    icon: BarChart3,
    title: "Rental Business Dashboard",
    text: "Income, occupancy, arrears and revenue exports.",
  },
  {
    icon: Building2,
    title: "Lease Management",
    text: "Manage lease agreements, terms, and renewal dates for all properties.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Platform</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Everything a modern landlord needs
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group surface-card relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
