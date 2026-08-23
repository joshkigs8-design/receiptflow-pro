import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { money } from "@/lib/format";

const perks = [
  "Unlimited properties, units & tenants",
  "QR-verified PDF rent receipts",
  "Tenant portal & maintenance requests",
  "Income reports & analytics",
  "Custom receipt branding",
  "M-Pesa, card and bank payments via Paystack",
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5 text-primary" /> 1 month free on signup
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Try everything free for one month. Keep going from KSh 400 a month — cancel anytime.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((key, i) => {
            const plan = PLANS[key];
            const best = key === "yearly";
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`surface-card relative flex flex-col justify-between p-6 sm:p-7 ${best ? "ring-2 ring-primary shadow-glow" : ""}`}
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
      </div>
    </section>
  );
}
