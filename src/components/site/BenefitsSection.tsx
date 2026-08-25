import { motion } from "motion/react";
import { CheckCircle2, Clock, FolderGit2, Layers, Sparkles, TrendingUp, Wallet } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "SAVE TIME",
    headline: "Spend less time managing paperwork.",
    description:
      "Automate receipt creation and payment reconciliation so you can focus on expanding your rental investments instead of writing receipt books.",
    metric: "15+ Hours Saved / Month",
  },
  {
    icon: Layers,
    title: "STAY ORGANIZED",
    headline: "Keep properties, tenants and payments together.",
    description:
      "Everything in one unified, searchable hub. Find any historical payment, lease date, or tenant record in 2 seconds.",
    metric: "Zero Missing Records",
  },
  {
    icon: Wallet,
    title: "GET PAID WITH CONFIDENCE",
    headline: "Know exactly what has been collected and what remains pending.",
    description:
      "Real-time arrears tracking and automated WhatsApp reminders keep tenants accountable and boost monthly collection rates.",
    metric: "98%+ Collection Rate",
  },
  {
    icon: TrendingUp,
    title: "GROW WITH CLARITY",
    headline: "Use reports and insights to understand your rental business.",
    description:
      "Visualize revenue trends, compare property yields, and produce accountant-ready financial statements for tax audits.",
    metric: "100% Tax Compliant",
  },
];

export function BenefitsSection() {
  return (
    <section className="relative py-28 bg-[#F7F8F5] dark:bg-[#061A13] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> Measurable Landlord Impact
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            BUILT TO MAXIMIZE YOUR RENTAL RETURN.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Transform chaos into clarity with structured property automation.
          </p>
        </div>

        {/* 4 Large Premium Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, idx) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#E2E8E4] dark:border-white/10 shadow-sm hover:border-[#087443] transition-all flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788] group-hover:scale-110 transition-transform">
                    <b.icon className="size-6 text-[#087443]" />
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-0.5 rounded-full">
                    {b.title}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-base text-[#101714] dark:text-[#F7F8F5]">
                    {b.headline}
                  </h3>
                  <p className="text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed pt-1">
                    {b.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8E4] dark:border-white/10 text-xs font-bold text-[#087443] dark:text-[#52B788] flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> {b.metric}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

