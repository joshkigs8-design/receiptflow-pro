import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const selfServicePlans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: 400,
      period: "/ month",
      desc: "Flexible month-to-month property management.",
      badge: "Flexible",
      features: [
        "Unlimited properties & units",
        "Instant M-PESA WhatsApp receipts",
        "Public QR verification portal",
        "Tenant self-service portal",
        "Caretaker sub-accounts",
      ],
      popular: false,
    },
    {
      id: "annual",
      name: "Annual Plan",
      price: 4000,
      period: "/ year",
      desc: "Best value for professional landlords (Save KSh 800).",
      badge: "Most Popular — Save 17%",
      features: [
        "Unlimited properties & units",
        "Instant M-PESA WhatsApp receipts",
        "Public QR verification portal",
        "Tenant self-service portal",
        "Caretaker sub-accounts & permissions",
        "KRA tax & financial reports export",
        "Priority 24/7 WhatsApp VIP support",
      ],
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-28 bg-[#FFFFFF] dark:bg-[#0A261D] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> Transparent Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            SIMPLE PRICING. POWERFUL MANAGEMENT.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Plans designed for Kenyan landlords, caretakers, and property management agencies.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
          {selfServicePlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`p-8 sm:p-9 rounded-3xl flex flex-col justify-between text-left transition-all ${
                plan.popular
                  ? "bg-[#063B2A] text-white border-2 border-[#C9A227] shadow-[0_20px_60px_rgba(6,59,42,0.3)] relative"
                  : "bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 shadow-sm"
              }`}
            >
              {plan.popular ? (
                <span className="absolute -top-3.5 right-8 bg-[#C9A227] text-[#101714] font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-md">
                  {plan.badge}
                </span>
              ) : null}

              <div className="space-y-6">
                <div>
                  <h3 className={`font-display text-xl font-bold ${plan.popular ? "text-white" : "text-[#101714] dark:text-[#F7F8F5]"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${plan.popular ? "text-white/70" : "text-[#4A5B53] dark:text-[#94A89E]"}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold">KES</span>
                  <span className="font-display text-4xl sm:text-5xl font-black">{plan.price.toLocaleString()}</span>
                  <span className={`text-xs ${plan.popular ? "text-white/70" : "text-[#4A5B53] dark:text-[#94A89E]"}`}>{plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-current/10">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs">
                      <CheckCircle2 className={`size-4 shrink-0 ${plan.popular ? "text-[#C9A227]" : "text-[#087443]"}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  asChild
                  size="lg"
                  className={`w-full rounded-full font-bold h-12 text-sm shadow-md transition-all hover:scale-105 ${
                    plan.popular
                      ? "bg-[#087443] hover:bg-[#055732] text-white border border-[#C9A227]/40"
                      : "bg-[#063B2A] hover:bg-[#087443] text-white"
                  }`}
                >
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Start 1 Month Free Trial <ArrowRight className="ml-1.5 size-4 text-[#C9A227]" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIP Concierge "Done-For-You Data Setup" Banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-6 sm:p-7 bg-[#E8F2ED] dark:bg-[#0D3528] border-2 border-[#087443]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#063B2A] dark:text-[#52B788] bg-[#FFFFFF] dark:bg-[#0A261D] px-2.5 py-0.5 rounded-full">
              VIP Concierge Onboarding
            </span>
            <h4 className="font-display font-bold text-base sm:text-lg text-[#101714] dark:text-[#F7F8F5]">
              Want us to import all your tenants &amp; units for you?
            </h4>
            <p className="text-xs text-[#4A5B53] dark:text-[#94A89E]">
              Send us your handwritten notebooks, Excel sheets, or WhatsApp lists. Our team will structure and load everything into your system within 2 hours.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white text-xs font-bold shrink-0 h-11 px-6 shadow-md border border-[#C9A227]/30"
          >
            <a
              href="https://wa.me/254742868209?text=Hello%20RentReceiptPro%20Team%2C%20I%20have%20my%20tenant%20list%20and%20need%20the%20Done-For-You%20Data%20Setup."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="size-4 text-[#C9A227]" /> WhatsApp Us (0742868209)
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
