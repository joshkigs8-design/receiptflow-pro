import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const allPricingPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 400,
    period: "/ month",
    billingText: "Billed monthly (KES 400)",
    desc: "Flexible month-to-month property management.",
    badge: "Flexible",
    popular: false,
    savings: null,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 1100,
    period: "/ 3 months",
    billingText: "Billed every 3 months (KES 366/mo)",
    desc: "Great for quarterly rent tracking cycles.",
    badge: "Save KES 100",
    popular: false,
    savings: "Save KES 100",
  },
  {
    id: "half_year",
    name: "Semi-Annual",
    price: 2100,
    period: "/ 6 months",
    billingText: "Billed every 6 months (KES 350/mo)",
    desc: "Ideal for landlords managing multi-unit blocks.",
    badge: "Save KES 300",
    popular: false,
    savings: "Save KES 300",
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: 4000,
    period: "/ year",
    billingText: "Billed annually (KES 333/mo)",
    desc: "Best value for serious property managers & estates.",
    badge: "Best Value — Save KES 800",
    popular: true,
    savings: "Save KES 800 (17% OFF)",
  },
];

const sharedFeatures = [
  "Unlimited properties, estates & units",
  "Instant M-PESA & Bank WhatsApp receipts",
  "Public QR code verification portal",
  "Tenant self-service portal with phone OTP",
  "Caretaker sub-accounts with permission controls",
  "KRA tax reports & accountant financial export",
  "Maintenance request & photo work order tracking",
  "Priority WhatsApp & phone support",
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 bg-[#FFFFFF] dark:bg-[#0A261D] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> All Pricing Plans Included
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            SIMPLE PRICING. POWERFUL MANAGEMENT.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Transparent Kenyan rental software pricing. Start with a 1-month free trial — no credit card needed.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch max-w-7xl mx-auto">
          {allPricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between text-left transition-all relative ${
                plan.popular
                  ? "bg-[#063B2A] text-white border-2 border-[#C9A227] shadow-[0_20px_50px_rgba(6,59,42,0.25)] ring-2 ring-[#C9A227]/30"
                  : "bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 hover:border-[#087443] shadow-sm"
              }`}
            >
              {plan.badge ? (
                <span
                  className={`absolute -top-3 right-5 font-extrabold text-[10px] px-3 py-0.5 rounded-full shadow-sm ${
                    plan.popular
                      ? "bg-[#C9A227] text-[#101714]"
                      : "bg-[#087443] text-white"
                  }`}
                >
                  {plan.badge}
                </span>
              ) : null}

              <div className="space-y-4">
                <div>
                  <h3
                    className={`font-display text-lg font-bold ${
                      plan.popular ? "text-white" : "text-[#101714] dark:text-[#F7F8F5]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      plan.popular ? "text-white/70" : "text-[#4A5B53] dark:text-[#94A89E]"
                    }`}
                  >
                    {plan.desc}
                  </p>
                </div>

                <div className="space-y-0.5 pb-2 border-b border-current/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold">KES</span>
                    <span className="font-display text-3xl sm:text-4xl font-black">
                      {plan.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-[11px] ${
                        plan.popular ? "text-white/70" : "text-[#4A5B53] dark:text-[#94A89E]"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-mono ${
                      plan.popular ? "text-[#C9A227]" : "text-[#087443] dark:text-[#52B788]"
                    }`}
                  >
                    {plan.billingText}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {sharedFeatures.slice(0, plan.popular ? 8 : 5).map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-[11px] leading-tight">
                      <CheckCircle2
                        className={`size-3.5 shrink-0 mt-0.5 ${
                          plan.popular ? "text-[#C9A227]" : "text-[#087443]"
                        }`}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  asChild
                  size="sm"
                  className={`w-full rounded-full font-bold h-10 text-xs shadow-sm transition-all hover:scale-105 ${
                    plan.popular
                      ? "bg-[#087443] hover:bg-[#055732] text-white border border-[#C9A227]/40"
                      : "bg-[#063B2A] hover:bg-[#087443] text-white"
                  }`}
                >
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Select Plan <ArrowRight className="ml-1 size-3.5 text-[#C9A227]" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Concierge "Done-For-You Data Setup" Banner */}
        <div className="mt-12 max-w-5xl mx-auto rounded-3xl p-6 sm:p-7 bg-[#E8F2ED] dark:bg-[#0D3528] border-2 border-[#087443]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#063B2A] dark:text-[#52B788] bg-[#FFFFFF] dark:bg-[#0A261D] px-2.5 py-0.5 rounded-full border border-[#063B2A]/10">
                VIP Concierge Setup
              </span>
              <span className="text-xs font-mono font-bold text-[#087443] dark:text-[#C9A227]">
                KES 2,500 1-Time or KES 5,500/yr VIP Annual
              </span>
            </div>
            <h4 className="font-display font-bold text-base sm:text-lg text-[#101714] dark:text-[#F7F8F5]">
              Want us to import all your tenants, units &amp; rent data for you?
            </h4>
            <p className="text-xs text-[#4A5B53] dark:text-[#94A89E]">
              Send us your handwritten notebooks, Excel sheets, or WhatsApp lists. Our team will verify, structure, and load everything into your system within 2 hours.
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
