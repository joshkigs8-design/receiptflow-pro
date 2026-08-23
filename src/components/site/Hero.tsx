import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  Gift,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPoster from "@/assets/hero-poster.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16">
      {/* Background Poster and Layers */}
      <img
        src={heroPoster}
        alt="RentReceiptPro background"
        className="absolute inset-0 size-full object-cover"
      />

      <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,oklch(0.72_0.2_47_/_0.4),transparent_55%),radial-gradient(circle_at_75%_75%,oklch(0.58_0.19_40_/_0.4),transparent_60%)] animate-aurora" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-16 text-center">
        {/* Top Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg"
        >
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <FileCheck2 className="size-3.5 text-[#FFB020]" />
          <span>#1 Digital Rent Receipt &amp; Property Platform in Kenya</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl leading-[1.08] font-black text-white sm:text-6xl lg:text-7xl tracking-tight drop-shadow-md"
        >
          Professional Rent Receipts.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFB020] to-[#FFA040]">
            Effortless Property Management.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-medium"
        >
          Issue instant, tamper-proof QR-verified PDF rent receipts, track M-Pesa payments, manage tenant leases, and automate maintenance tickets — all from one high-performance platform.
        </motion.p>

        {/* Key Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs text-white/90 font-medium"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 border border-white/15">
            <CheckCircle2 className="size-3.5 text-emerald-400" /> QR Code Verification
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 border border-white/15">
            <CheckCircle2 className="size-3.5 text-emerald-400" /> M-Pesa &amp; Bank Tracking
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 border border-white/15">
            <CheckCircle2 className="size-3.5 text-emerald-400" /> WhatsApp Receipt Sharing
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 border border-white/15">
            <CheckCircle2 className="size-3.5 text-emerald-400" /> Tenant Self-Service Portal
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#FF7A00] hover:bg-[#E56E00] text-white font-bold h-12 px-7 text-sm shadow-[0_0_25px_rgba(255,122,0,0.5)] border border-orange-400/40 transition-all hover:scale-105"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Start 1 Month Free <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#FFB020] hover:bg-[#E59E15] text-[#0B1220] font-bold h-12 px-6 text-sm shadow-[0_0_20px_rgba(255,176,32,0.4)] border border-amber-300 transition-all hover:scale-105"
          >
            <Link to="/affiliate-program">
              <Gift className="mr-1.5 size-4 text-[#0B1220]" /> Earn KSh 50 / Referral
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md h-12 px-5 text-sm font-semibold"
          >
            <Link to="/tenant">
              <Users className="mr-1.5 size-4 text-slate-200" /> Tenant Portal
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full text-slate-200 hover:text-white hover:bg-white/10 h-12 px-4 text-sm"
          >
            <Link to="/auth">Landlord Login →</Link>
          </Button>
        </motion.div>

        {/* Social Proof Counters Footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white"
        >
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-[#FFB020]">15,000+</p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Receipts Generated</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-emerald-400">99.8%</p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Collection Tracking</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-[#FF7A00]">KSh 400</p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Flat Monthly Rate</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-cyan-400">4.9 / 5.0</p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Landlord Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
