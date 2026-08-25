import { motion } from "motion/react";
import { ArrowRight, Building, CheckCircle2, FileCheck2, Send, Smartphone, Sparkles, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Building,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
    title: "Add Properties & Units",
    description: "Map your buildings, apartments, and assign tenants with rent amounts in under 2 minutes (or send us your list and we'll import it).",
    badge: "Quick 2-Min Setup",
  },
  {
    step: "02",
    icon: Wallet,
    image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80",
    title: "Record Rent Collection",
    description: "Log payments received via M-Pesa Till/Paybill, Bank transfers, Cheques, or Cash. Automatic balance calculation handles partial payments.",
    badge: "M-Pesa Auto-Match",
  },
  {
    step: "03",
    icon: Send,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    title: "Instant QR Digital Receipt",
    description: "A tamper-proof PDF with cryptographic QR code is generated instantly. Dispatched to the tenant's WhatsApp in a single click.",
    badge: "3-Sec WhatsApp Delivery",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Seamless 3-Step Operations
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            How RentReceiptPro works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No more manual paper receipt books or lost records. Run your entire rental operations in three effortless steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="surface-card group relative overflow-hidden rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between hover:border-primary/50 hover:shadow-float transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-border/60">
                <img
                  src={s.image}
                  alt={s.title}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <span className="absolute top-4 left-4 font-mono text-2xl font-black text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                  {s.step}
                </span>
                <span className="absolute top-4 right-4 rounded-full bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold shadow-md">
                  {s.badge}
                </span>
              </div>

              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> Ready in seconds
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-14 text-center">
          <Button asChild size="lg" className="rounded-full shadow-glow font-bold px-8 h-12 text-sm">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started In 2 Minutes <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
