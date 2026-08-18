import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
        <h2 className="relative font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
          Start issuing digital receipts today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Set up your first property in under five minutes. No paperwork, no lost receipt books.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/auth" search={{ mode: "signup" }}>
              Create free account <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="glass rounded-full text-primary-foreground"
          >
            <Link to="/tenant">I'm a tenant</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
