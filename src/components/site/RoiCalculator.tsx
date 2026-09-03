import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Check, Clock, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function RoiCalculator() {
  const [units, setUnits] = useState(24);
  const [avgRent, setAvgRent] = useState(20000);

  const monthlyRent = units * avgRent;
  const yearlyRent = monthlyRent * 12;
  const hoursSavedPerMonth = Math.round(units * 1.25);
  const paperSavingsYearly = units * 1200; // Receipt books, pens, delivery, printing
  const arrearsRecoveredEst = Math.round(monthlyRent * 0.04); // 4% average arrears recovered through automated tracking

  return (
    <section className="relative py-24 bg-muted/30 border-t border-border/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Calculator className="size-3.5 text-primary" /> Landlord ROI Estimator
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Calculate your operational savings
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            See how much time, paperwork cost, and rental revenue RentReceiptPro saves your rental business every year.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 items-center">
          {/* Sliders Box */}
          <div className="lg:col-span-6 surface-card p-6 sm:p-10 rounded-3xl border border-border/80 shadow-md space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-display font-bold text-base text-foreground">
                  Number of Rental Units Managed
                </label>
                <span className="font-mono text-xl font-bold text-primary px-3 py-1 bg-primary/10 rounded-xl">
                  {units} Units
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={150}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>2 Units</span>
                <span>50 Units</span>
                <span>150+ Units</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-display font-bold text-base text-foreground">
                  Average Rent per Unit (KSh)
                </label>
                <span className="font-mono text-xl font-bold text-primary px-3 py-1 bg-primary/10 rounded-xl">
                  {money(avgRent)}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={120000}
                step={1000}
                value={avgRent}
                onChange={(e) => setAvgRent(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>KSh 3,000 (Bedsitter)</span>
                <span>KSh 35,000 (2-Bed)</span>
                <span>KSh 120,000+ (Luxury/Commercial)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Check className="size-4 text-emerald-500" /> Subscription Cost: KSh 400/mo First-Time Offer (Standard: KSh 1,200/mo)
              </div>
              <p>Unlimited units, automated reconciliation, cancel anytime.</p>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <span>Time Saved</span>
                  <Clock className="size-4 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">
                  ~{hoursSavedPerMonth} hrs/mo
                </p>
                <p className="text-xs text-muted-foreground">Automated receipting &amp; tenant balance tracking</p>
              </div>

              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <span>Paperwork Eliminated</span>
                  <Wallet className="size-4 text-emerald-500" />
                </div>
                <p className="font-display text-3xl font-bold text-emerald-500">
                  {money(paperSavingsYearly)}/yr
                </p>
                <p className="text-xs text-muted-foreground">Zero manual receipt books, printing &amp; dispatch</p>
              </div>

              <div className="sm:col-span-2 surface-card p-6 rounded-3xl border border-primary/30 bg-primary/5 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="size-4" /> Estimated Arrears Prevented &amp; Recovered
                  </span>
                  <span className="font-mono text-xs font-bold bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                    +4% Efficiency
                  </span>
                </div>
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary">
                  {money(arrearsRecoveredEst)} <span className="text-xs font-normal text-muted-foreground">per month</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Real-time tenant rent tracking eliminates forgotten balances and disputed claims.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="w-full rounded-full shadow-glow font-bold h-12 text-sm">
              <Link to="/auth" search={{ mode: "signup" }}>
                Claim 1 Month Free Trial Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

