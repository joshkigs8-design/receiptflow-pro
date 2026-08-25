import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  Gift,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[96svh] flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* 1. Cinematic Architectural Photography Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800&auto=format&fit=crop&q=85"
          alt="Modern Luxury Apartment Architecture Kenya"
          className="size-full object-cover object-center filter brightness-[0.35] dark:brightness-[0.25] contrast-[1.1] scale-105 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,var(--color-primary)/0.22,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 text-center">
        {/* 2. Top Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl shadow-lg"
        >
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-blue-400 font-bold">#1 PropTech in Kenya</span>
          <span className="text-white/40">·</span>
          <span className="text-slate-200 hidden sm:inline">M-Pesa Daraja 3.0 &amp; KRA Tax Compliant PDFs</span>
        </motion.div>

        {/* 3. Main Multi-Billion Company Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white drop-shadow-md"
        >
          The Operating System for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">
            Modern Rental Real Estate
          </span>
        </motion.h1>

        {/* 4. Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-medium"
        >
          Issue instant, tamper-proof QR-verified PDF rent receipts, track M-Pesa payments in real time, delegate permissions to caretakers, and automate your entire Kenyan rental portfolio.
        </motion.p>

        {/* 5. CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 text-sm shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-400/40 transition-all hover:scale-105"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Start 1 Month Free Trial <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md h-12 px-6 text-sm font-semibold"
          >
            <a href="#demo">
              <QrCode className="mr-2 size-4 text-blue-400" /> Test Live Receipt Demo
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10"
          >
            <Link to="/tenant">
              <Users className="mr-1.5 size-4" /> Tenant Portal →
            </Link>
          </Button>
        </motion.div>

        {/* 6. Key Enterprise Trust Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-7 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> Instant M-Pesa WhatsApp Receipts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> Tamper-Proof Public QR Verification
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> Caretaker Sub-Accounts &amp; Approvals
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" /> 1-Click KRA Tax Financial Reports
          </span>
        </motion.div>

        {/* 7. REAL-ESTATE SHOWCASE & LIVE FINTECH DASHBOARD HERO MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 mx-auto max-w-5xl rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/20 backdrop-blur-2xl shadow-[0_20px_70px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="rounded-2xl bg-card border border-border/80 overflow-hidden text-left shadow-2xl">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  rentreceipt.co.ke/dashboard — Apex Real Estate Management Kenya
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Portfolio Active</span>
              </div>
            </div>

            {/* Mockup Body: Real-World Kenyan PropTech Dashboard Layout with Estate Photos */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Collected</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-foreground">KSh 4,820,000</p>
                  <p className="text-[11px] font-semibold text-emerald-500">+18.4% vs last month</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupancy Rate</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-foreground">98.4%</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">124 of 126 Units</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Properties</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-foreground">8 Estates</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">Nairobi &amp; Mombasa</p>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-1">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Receipts Issued</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-primary">1,248 Verified</p>
                  <p className="text-[11px] font-semibold text-primary">100% WhatsApp Delivered</p>
                </div>
              </div>

              {/* Two Column Section: Estate Showcase & Live Transaction Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Managed Estates with High-Res Photography */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" /> Active Managed Estates
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground">8 Properties</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=80"
                        alt="Kilimani Heights Nairobi"
                        className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-2.5 space-y-0.5">
                        <p className="font-bold text-xs text-foreground truncate">Kilimani Heights</p>
                        <p className="text-[10px] text-muted-foreground">32 Units · 100% Occupied</p>
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">KSh 1,440,000 / mo</p>
                      </div>
                    </div>

                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=80"
                        alt="Westlands Executive Suites"
                        className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-2.5 space-y-0.5">
                        <p className="font-bold text-xs text-foreground truncate">Westlands Executive</p>
                        <p className="text-[10px] text-muted-foreground">24 Units · 96% Occupied</p>
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">KSh 1,560,000 / mo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Live PDF Receipt Preview Card */}
                <div className="lg:col-span-6 p-4 rounded-2xl bg-card border-2 border-primary/40 shadow-glow space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="gradient-primary flex size-7 items-center justify-center rounded-lg shadow-sm">
                        <FileCheck2 className="size-4 text-primary-foreground" />
                      </span>
                      <div>
                        <p className="text-xs font-bold">OFFICIAL DIGITAL RENT RECEIPT</p>
                        <p className="text-[10px] font-mono text-muted-foreground">RCP-202608-8X92A</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> QR VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Tenant</p>
                      <p className="font-bold">Mary Wanjiku Mwangi</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Property &amp; Unit</p>
                      <p className="font-bold">Kilimani Heights · Apt 4B</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Period</p>
                      <p className="font-semibold">August 2026 Rent</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Amount Paid</p>
                      <p className="font-black text-sm text-primary">KSh 45,000.00</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="size-8 text-primary shrink-0" />
                      <div className="text-[10px] text-muted-foreground leading-tight">
                        <p className="font-bold text-foreground">Scannable Public Proof</p>
                        <p>rentreceipt.co.ke/receipt/RCP-8X92A</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/15 px-2.5 py-1 rounded-full">
                      <MessageCircle className="size-3.5" /> WhatsApp Sent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 8. Corporate Trust Metrics Banner */}
        <div className="mt-16 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-white">KSh 250M+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Rent Payments Tracked</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-white">14,000+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Units Managed Across Kenya</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-white">3 Seconds</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Receipt Generation &amp; WhatsApp</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-white">99.98%</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">System &amp; Server Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
