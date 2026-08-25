import { motion } from "motion/react";
import { ArrowRight, Building, CheckCircle2, FileCheck2, Send, Smartphone, Sparkles, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Building,
    title: "ADD YOUR PROPERTIES",
    subtitle: "Add your properties, units and tenants.",
    description: "Map your buildings, apartments, and assign tenants with rent amounts in under 2 minutes (or send us your tenant list and we'll import it for you).",
    badge: "Quick 2-Min Setup",
  },
  {
    step: "02",
    icon: Wallet,
    title: "TRACK PAYMENTS",
    subtitle: "Record and monitor rental payments effortlessly.",
    description: "Log payments received via M-PESA, Bank transfers, Cheques, or Cash. Automatic balance calculation handles partial payments and arrears with zero math.",
    badge: "M-PESA Friendly",
  },
  {
    step: "03",
    icon: Send,
    title: "SEND RECEIPTS",
    subtitle: "Generate professional receipts and send them instantly.",
    description: "A tamper-proof PDF with cryptographic QR code is generated instantly and dispatched directly to the tenant's WhatsApp in a single click.",
    badge: "Instant WhatsApp Dispatch",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 bg-[#F7F8F5] dark:bg-[#061A13] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> 3-Step Effortless Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            FROM PAYMENT TO RECEIPT IN MINUTES.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            No more manual paper receipt books or lost records. Run your entire rental operations with zero friction.
          </p>
        </div>

        {/* 3-Step Horizontal Process with Connecting Line */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#087443]/40 via-[#C9A227]/40 to-[#087443]/40 -z-0" />

          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#E2E8E4] dark:border-white/10 shadow-sm hover:border-[#087443] transition-all flex flex-col justify-between group relative z-10"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-[#087443] dark:text-[#52B788]">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded-full border border-[#C9A227]/20">
                    {s.badge}
                  </span>
                </div>

                <div className="mt-6 flex size-14 items-center justify-center rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788] group-hover:scale-110 transition-transform">
                  <s.icon className="size-7 text-[#087443]" />
                </div>

                <h3 className="mt-6 font-display text-lg font-black text-[#101714] dark:text-[#F7F8F5]">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-[#087443] dark:text-[#52B788]">
                  {s.subtitle}
                </p>
                <p className="mt-3 text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E2E8E4] dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#087443] dark:text-[#52B788]">
                <CheckCircle2 className="size-4" /> Ready in seconds
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action CTA */}
        <div className="mt-14 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-12 px-8 text-sm shadow-md transition-all hover:scale-105 border border-[#C9A227]/30"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started In 2 Minutes <ArrowRight className="ml-2 size-4 text-[#C9A227]" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
