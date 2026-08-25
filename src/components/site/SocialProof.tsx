import { motion } from "motion/react";
import { Building2, Clock, FileCheck2, ShieldCheck, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { Counter } from "./Counter";

const metrics = [
  {
    icon: Building2,
    label: "Properties Managed",
    value: 14000,
    prefix: "",
    suffix: "+",
    description: "Across Nairobi & Kenyan counties",
  },
  {
    icon: Wallet,
    label: "Payments Tracked",
    value: 250,
    prefix: "KES ",
    suffix: "M+",
    description: "M-PESA & Bank collections",
  },
  {
    icon: FileCheck2,
    label: "Receipts Generated",
    value: 120000,
    prefix: "",
    suffix: "+",
    description: "100% QR-verified & dispatched",
  },
  {
    icon: Clock,
    label: "Admin Time Saved",
    value: 95,
    prefix: "",
    suffix: "%",
    description: "Zero manual paperwork",
  },
];

export function SocialProof() {
  return (
    <section className="relative py-12 bg-[#FFFFFF] dark:bg-[#0A261D] border-y border-[#E2E8E4] dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#087443] dark:text-[#52B788]">
            BUILT FOR MODERN RENTAL MANAGEMENT
          </p>
          <p className="text-xs text-[#4A5B53] dark:text-[#94A89E]">
            Empowering Kenyan landlords, property managers, and rental agencies nationwide
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center space-y-1.5 p-4 rounded-2xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10"
            >
              <div className="flex justify-center">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788]">
                  <m.icon className="size-4" />
                </span>
              </div>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#101714] dark:text-[#F7F8F5] tracking-tight">
                {m.prefix}
                <Counter to={m.value} />
                {m.suffix}
              </p>
              <p className="text-xs font-bold text-[#063B2A] dark:text-[#52B788]">{m.label}</p>
              <p className="text-[11px] text-[#4A5B53] dark:text-[#94A89E]">{m.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
