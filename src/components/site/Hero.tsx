import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, FileCheck2, PlayCircle, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPoster from "@/assets/hero-poster.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <img
        src={heroPoster}
        alt="RentReceiptPro background"
        className="absolute inset-0 size-full object-cover"
      />

      <div className="absolute inset-0 bg-[oklch(0.14_0.02_50_/_0.75)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.72_0.2_47_/_0.38),transparent_55%),radial-gradient(circle_at_80%_70%,oklch(0.58_0.19_40_/_0.40),transparent_60%)] animate-aurora" />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-32 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
        >
          <FileCheck2 className="size-3.5" /> QR-verified digital receipts by Codevanta Ventures
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl"
        >
          RentReceiptPro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg"
        >
          Professional Rent Receipts. Simplified Property Management.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg"
        >
          RentReceiptPro helps landlords and property managers manage tenants, properties, rent payments, leases and professional rent receipts — all from one simple platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full shadow-glow">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/auth">Login</Link>
          </Button>
          <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold shadow-[0_0_20px_rgb(245_158_11_/_0.5)]">
            <Link to="/affiliate-program">
              <Wallet className="mr-1 size-4" /> Affiliate Program
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass rounded-full text-white">
            <Link to="/tenant">
              <Users className="mr-1 size-4" /> Tenant Portal
            </Link>
          </Button>
          <a
            href="#preview"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <PlayCircle className="size-5" /> Watch demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
