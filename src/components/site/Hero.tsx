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
    <section className="relative min-h-[92svh] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-background">
      {/* 1. FinTech Enterprise Background Grid & Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent blur-[120px] rounded-full" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 text-center">
        {/* 2. Top Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md shadow-sm"
        >
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-primary font-bold">#1 PropTech in Kenya</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground hidden sm:inline">M-Pesa Daraja 3.0 &amp; KRA Compliant PDFs</span>
        </motion.div>

        {/* 3. Main Multi-Billion Company Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground"
        >
          The Operating System for{" "}
          <span className="gradient-primary bg-clip-text text-transparent">
            Modern Rental Real Estate
          </span>
        </motion.h1>

        {/* 4. Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-medium"
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
            className="rounded-full shadow-glow font-bold h-12 px-8 text-sm transition-all hover:scale-105"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Start 1 Month Free Trial <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-6 text-sm font-semibold border-border/80 hover:bg-muted/80 backdrop-blur-md"
          >
            <a href="#demo">
              <QrCode className="mr-2 size-4 text-primary" /> Test Live Receipt Demo
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-5 text-sm font-semibold text-muted-foreground hover:text-foreground"
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
          className="mt-7 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" /> Instant M-Pesa WhatsApp Receipts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" /> Tamper-Proof Public QR Verification
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" /> Caretaker Sub-Accounts &amp; Approvals
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" /> 1-Click KRA Tax Financial Reports
          </span>
        </motion.div>

        {/* 7. LIVE INTERACTIVE FINTECH DASHBOARD HERO MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 mx-auto max-w-5xl rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-border/80 via-border/40 to-transparent border border-border/60 shadow-float"
        >
          <div className="rounded-2xl bg-card border border-border/80 overflow-hidden text-left shadow-2xl">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  rentreceipt.co.ke/dashboard — Codevanta Ventures Ltd
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Portfolio Active</span>
              </div>
            </div>

            {/* Mockup Body: Real-World Kenyan PropTech Dashboard Layout */}
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
                  <p className="text-[11px] font-semibold text-muted-foreground">Nairobi &amp; Kiambu</p>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-1">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Receipts Issued</p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-primary">1,248 Verified</p>
                  <p className="text-[11px] font-semibold text-primary">100% WhatsApp Delivered</p>
                </div>
              </div>

              {/* Two Column Section: Live M-Pesa Feed & Live Receipt Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Feed: Recent Transactions */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Zap className="size-3.5 text-primary" /> Live M-Pesa &amp; Bank Rent Feed
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground">Auto-Reconciled</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: "Mary Wanjiku Mwangi",
                        prop: "Kilimani Heights — Unit 4B",
                        amount: "KSh 45,000",
                        ref: "QKH7829X1P",
                        time: "3 mins ago",
                        status: "Receipt Sent",
                      },
                      {
                        name: "Brian Otieno Odhiambo",
                        prop: "Westlands Executive — Unit 8A",
                        amount: "KSh 65,000",
                        ref: "QKJ9921M0R",
                        time: "24 mins ago",
                        status: "Receipt Sent",
                      },
                      {
                        name: "Esther Chemutai",
                        prop: "Roysambu Greens — Unit B12",
                        amount: "KSh 22,000",
                        ref: "QKL4410K9T",
                        time: "1 hour ago",
                        status: "Receipt Sent",
                      },
                    ].map((tx, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{tx.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{tx.prop}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                            M-Pesa: {tx.ref} · {tx.time}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm text-foreground">{tx.amount}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5">
                            <CheckCircle2 className="size-3" /> {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
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
        <div className="mt-16 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-foreground">KSh 250M+</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Rent Payments Tracked</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-foreground">14,000+</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Units Managed Across Kenya</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-foreground">3 Seconds</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Receipt Generation &amp; WhatsApp</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black text-foreground">99.98%</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">System &amp; Server Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
