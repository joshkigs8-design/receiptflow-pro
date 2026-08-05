import { motion } from "motion/react";
import {
  BarChart3,
  Bell,
  Building2,
  CloudUpload,
  Download,
  FileSignature,
  FileText,
  LineChart,
  QrCode,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

const features = [
  { icon: Building2, title: "Property Management", text: "Unlimited properties with photos, GPS, amenities and notes." },
  { icon: Users, title: "Tenant Management", text: "Full tenant profiles, IDs, documents and lease dates." },
  { icon: FileText, title: "Digital Receipts", text: "Branded PDF receipts generated the moment rent is paid." },
  { icon: Download, title: "Online Download", text: "Tenants download or print receipts from any device." },
  { icon: QrCode, title: "QR Verification", text: "Every receipt carries a QR code that proves it is genuine." },
  { icon: Wallet, title: "Payment Tracking", text: "Cash, M-Pesa, bank, card and cheque with balances." },
  { icon: Wrench, title: "Maintenance Requests", text: "Tenants report issues; you track them to resolution." },
  { icon: BarChart3, title: "Reports", text: "Income, occupancy, arrears and yearly revenue exports." },
  { icon: LineChart, title: "Analytics", text: "Live charts on collections, vacancies and growth." },
  { icon: FileSignature, title: "Lease Management", text: "Store leases, renewals and expiry alerts." },
  { icon: Bell, title: "Notifications", text: "Rent reminders ready for email, SMS and WhatsApp." },
  { icon: CloudUpload, title: "Cloud Storage", text: "Documents and photos stored securely in the cloud." },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Platform</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            Everything a modern landlord needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            One platform for properties, people, payments and paperwork.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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