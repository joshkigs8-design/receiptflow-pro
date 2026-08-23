import { motion } from "motion/react";
import { ArrowRight, Building, CheckCircle2, FileCheck2, Send, Smartphone, Sparkles, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Building,
    title: "Add Properties & Tenants",
    description: "Input your buildings, apartments, rooms, and assign tenants with their rent amounts in under 2 minutes.",
    badge: "Quick Setup",
  },
  {
    step: "02",
    icon: Wallet,
    title: "Record Rent Collection",
    description: "Enter payments received via M-Pesa, bank transfer, cheque, or cash. Automatic balance calculation handles partial payments.",
    badge: "M-Pesa Ready",
  },
  {
    step: "03",
    icon: Send,
    title: "Instant Verified Digital Receipt",
    description: "A tamper-proof PDF with cryptographic QR code is generated instantly. Share on WhatsApp or SMS in a single click.",
    badge: "Instant Delivery",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Seamless Workflow
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            How RentReceiptPro Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            No more manual paper receipt books or lost records. Run your entire rental operations in three effortless steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="surface-card relative p-8 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between hover:shadow-glow transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    {s.step}
                  </span>
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold">
                    {s.badge}
                  </span>
                </div>

                <div className="mt-6 flex size-14 items-center justify-center rounded-2xl bg-accent group-hover:scale-110 transition-transform text-primary">
                  <s.icon className="size-7" />
                </div>

                <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-primary">
                <CheckCircle2 className="size-4" /> Ready in seconds
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full shadow-glow font-bold px-8">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started In 2 Minutes <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

