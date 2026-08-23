import { motion } from "motion/react";
import { Star, Quote, Building2, CheckCircle2, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "James Kariuki",
    role: "Property Manager, 48 Units",
    location: "Kilimani & Roysambu, Nairobi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "Before RentReceiptPro, handwriting carbon-copy receipt books for 48 units took me two whole days every month. Now, I record the M-Pesa code and the tenant gets a branded PDF with QR code immediately. Tenants love it.",
    stats: "2 days/month saved",
  },
  {
    name: "Faith Mutua",
    role: "Hostel Owner, 80 Rooms",
    location: "Madaraka & Juja",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "With student hostels, parents frequently request official rent receipts for accounting. RentReceiptPro gives each student a link to their Tenant Portal so they download past receipts on demand without calling me.",
    stats: "Zero lost receipts",
  },
  {
    name: "David Omondi",
    role: "Real Estate Investor, 18 Apartments",
    location: "Milimani, Kisumu",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "The income analytics and QR verification seal make my property management look totally corporate and trustworthy. It's the best KSh 400 I spend on my rental business every month.",
    stats: "100% On-time tracking",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Verified Reviews
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Trusted by Kenyan landlords &amp; property managers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            See how property owners across Nairobi, Mombasa, Kisumu, and Eldoret have transformed their rent collections.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="surface-card relative p-8 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between hover:shadow-glow transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
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
                  className="size-11 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-[10px] text-primary font-medium">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
