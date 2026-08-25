import { motion } from "motion/react";
import { Star, Quote, Building2, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

const testimonials = [
  {
    name: "James Mwangi Kariuki",
    role: "Managing Director, Apex Properties (74 Units)",
    location: "Kilimani & Westlands, Nairobi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "Handwriting physical carbon receipt books for 74 units used to swallow our first week of every single month. With RentReceiptPro, our caretakers record M-Pesa codes on-site and the tenant receives a QR-verified PDF in 3 seconds. Our collection speed improved by 40%.",
    stats: "40% Faster Collections",
  },
  {
    name: "Faith Njeri Mutua",
    role: "Estate Operator, 120 Units Student & Studio Complex",
    location: "Juja & Madaraka, Nairobi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "Parents constantly call demanding official rent receipts for employer education allowances and tax returns. The Tenant Portal gives every tenant their own verified ledger to download past receipts without ever needing to call me.",
    stats: "Zero Lost Receipts",
  },
  {
    name: "David Ochieng Omondi",
    role: "Commercial & Residential Landlord (32 Units)",
    location: "Milimani, Kisumu & Nyali, Mombasa",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "The year-end financial statement export saved our auditor 3 weeks of work during KRA tax filing. The tamper-proof QR code gives our company a professional prestige that tenants respect.",
    stats: "100% KRA Tax Audit Ready",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Verified Customer Stories
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Trusted by Kenyan landlords managing thousands of units
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            See how property owners across Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret automated their rental cashflow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="surface-card relative p-8 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between hover:border-primary/50 hover:shadow-float transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {t.stats}
                  </span>
                </div>

                <Quote className="size-8 text-primary/20 mt-6" />

                <p className="mt-2 text-sm text-foreground/90 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  width="48"
                  height="48"
                  loading="lazy"
                  decoding="async"
                  className="size-12 rounded-full object-cover border-2 border-[#087443]/30 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">{t.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  <p className="text-[10px] text-primary font-semibold mt-0.5 truncate">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
