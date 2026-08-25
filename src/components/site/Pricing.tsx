import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, CheckCircle2, MessageCircle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanKey } from "@/lib/plans";
import { money } from "@/lib/format";

const perks = [
  "Unlimited properties, units & tenants",
  "QR-verified PDF rent receipts",
  "Tenant portal & maintenance requests",
  "Income reports & analytics",
  "Custom receipt branding",
  "M-Pesa, card and bank payments via Paystack",
];

const standardPlanKeys: PlanKey[] = ["monthly", "quarterly", "semiannual", "yearly"];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> 1 month free on signup
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
            Simple, honest pricing for Kenyan landlords
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Try everything free for one month. Keep going from KSh 400 a month — cancel anytime.
          </p>
        </motion.div>

        {/* 1. Standard Self-Service Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {standardPlanKeys.map((key, i) => {
            const plan = PLANS[key];
            const best = key === "yearly";
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`surface-card relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl ${best ? "ring-2 ring-primary shadow-glow" : ""}`}
              >
                <div>
                  {plan.badge ? (
                    <span className="gradient-primary absolute right-5 top-5 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {plan.badge}
                    </span>
                  ) : null}
                  <h3 className="font-display text-lg font-bold">{plan.label}</h3>
                  <p className="mt-3 font-display text-3xl sm:text-4xl font-bold">
                    {money(plan.amount)}
                    <span className="ml-1 text-xs sm:text-sm font-medium text-muted-foreground">
                      /{plan.periodLabel}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.blurb}</p>
                  <ul className="mt-6 space-y-2.5 text-xs sm:text-sm">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 sm:size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant={best ? "default" : "outline"}
                  className="mt-8 w-full rounded-full shadow-glow"
                >
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Start 1 month free
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* 2. VIP Concierge "Done-For-You Setup" Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="surface-card relative overflow-hidden p-8 sm:p-10 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background shadow-float"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary">
                <Zap className="size-3.5" /> Done-For-You Concierge Onboarding
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                Too busy to input your properties &amp; tenants? We'll do it for you!
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Just send us your tenant list, room numbers, and arrears via <strong>WhatsApp, Excel, or photos of your notebook</strong>. Our team will input, map, and verify your entire property portfolio within 24 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>100% full tenant &amp; unit data migration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Starting balances &amp; deposit mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>1-on-1 Caretaker WhatsApp training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>Live support agent on standby</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-4 shrink-0 bg-card/80 p-6 rounded-2xl border border-border/80">
              <div className="text-center pb-2 border-b border-border/60">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  VIP Setup Package
                </p>
                <p className="font-display text-3xl font-bold text-primary mt-1">KSh 2,500</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  1-Time Setup or bundled with VIP Annual at KSh 5,500/yr
                </p>
              </div>

              <Button asChild size="lg" className="w-full rounded-full shadow-glow font-bold text-sm">
                <a
                  href="https://wa.me/254742868209?text=Hello%20RentReceiptPro%20Team%2C%20I%20would%20like%20the%20Done-For-You%20Data%20Setup%20service%20for%20my%20properties.%20Here%20is%20my%20tenant%20list."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="size-4" /> Send List on WhatsApp
                </a>
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                WhatsApp: 0742868209 · Fast 24-Hour Turnaround
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
