import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="gradient-primary relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-8 py-16 text-center shadow-glow"
      >
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,oklch(1_0_0_/_0.25),transparent)] bg-[length:200%_100%]" />
        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl drop-shadow-sm">
          Start issuing digital receipts today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/90 text-base sm:text-lg font-medium">
          Set up your first property in under five minutes. No paperwork, no lost receipt books.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center items-center gap-3.5">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-[#0B1220] hover:bg-slate-100 font-bold shadow-xl border border-white/40 transition-all hover:scale-105"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Create free account <ArrowRight className="ml-1.5 size-4 text-[#FF7A00]" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#0B1220] text-white hover:bg-[#111C2E] font-semibold border border-white/20 shadow-lg"
          >
            <Link to="/affiliate-program">
              <Gift className="mr-1.5 size-4 text-[#FFB020]" /> Affiliate Program (Earn KSh 50)
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-black/25 hover:bg-black/40 text-white border border-white/30 backdrop-blur-sm"
          >
            <Link to="/tenant">I'm a tenant →</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
