import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Gift, MessageCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="px-4 sm:px-6 py-24 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-8 sm:p-14 text-center border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-background shadow-float space-y-6"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3.5 py-1.5 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" /> 1 Month Free Trial On Signup
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Transform your rental operations today
        </h2>

        <p className="mx-auto max-w-xl text-muted-foreground text-base sm:text-lg font-medium leading-relaxed">
          Join hundreds of Kenyan property owners issuing tamper-proof QR receipts and automating their rental cashflow. No manual receipt books, zero lost records.
        </p>

        <div className="pt-2 flex flex-wrap justify-center items-center gap-3.5">
          <Button
            asChild
            size="lg"
            className="rounded-full shadow-glow font-bold h-12 px-8 text-sm hover:scale-105 transition-all"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Start 1 Month Free <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-6 text-sm font-semibold border-border/80 hover:bg-muted"
          >
            <a
              href="https://wa.me/254742868209?text=Hello%20RentReceiptPro%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20landlord%20software."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="size-4 text-emerald-500" /> WhatsApp Support (0742868209)
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link to="/affiliate-program">
              <Gift className="mr-1.5 size-4 text-primary" /> Affiliate Program (Earn KSh 50)
            </Link>
          </Button>
        </div>

        <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" /> Setup in 2 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" /> Cancel anytime
          </span>
        </div>
      </motion.div>
    </section>
  );
}
