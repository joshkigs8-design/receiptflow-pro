import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  DoorOpen,
  FileCheck2,
  FileText,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadLandlordManualPdf } from "@/lib/manual-pdf";

export function Hero() {
  return (
    <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-[#F7F8F5] dark:bg-[#061A13] text-[#101714] dark:text-[#F7F8F5]">
      {/* Background Atmosphere & Soft Radial Lighting (No Grid Marks) */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#087443]/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-[400px] h-[300px] bg-[#C9A227]/10 blur-[110px] rounded-full" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: INSTANT SSR PAINT (ZERO OPACITY BLOCKING FOR 100/100 FCP)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 text-left space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#063B2A]/15 dark:border-white/15 bg-[#E8F2ED] dark:bg-[#0D3528] px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] shadow-sm">
              <span className="text-sm">🇰🇪</span>
              <span className="tracking-wide">BUILT FOR RENTAL BUSINESSES IN KENYA</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#101714] dark:text-[#F7F8F5]">
              MANAGE RENTALS. <br className="hidden sm:inline" />
              <span className="text-[#C9A227] dark:text-[#E5BA38]">WITHOUT THE HEADACHE.</span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-xl text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E] leading-relaxed font-normal">
              Manage properties, keep track of tenants, monitor payments and send professional receipts — all from one beautifully simple platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold h-13 px-8 text-sm sm:text-base shadow-[0_10px_25px_-5px_rgba(8,116,67,0.35)] transition-all hover:scale-105 border border-[#C9A227]/40"
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start Managing Your Rentals <ArrowRight className="ml-2 size-4 text-[#C9A227]" />
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => downloadLandlordManualPdf()}
                className="rounded-full border-[#063B2A]/20 dark:border-white/20 bg-[#FFFFFF] dark:bg-[#0A261D] text-[#087443] dark:text-[#52B788] hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] h-13 px-6 text-sm font-bold shadow-sm gap-2"
              >
                <BookOpen className="size-4 text-[#C9A227]" /> Download Manual (PDF)
              </Button>
            </div>

            <div className="pt-2 text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] flex items-center gap-2">
              <span>No complicated setup</span>
              <span>•</span>
              <span>Built for landlords</span>
              <span>•</span>
              <span>Access anywhere</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3D/LIFESTYLE PRODUCTION SAAS & SMARTPHONE COMPOSITION       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative animate-in fade-in duration-700">
            {/* Ambient Shadow Box */}
            <div className="relative mx-auto max-w-[540px] lg:max-w-none">
              
              {/* Laptop Shell Container */}
              <div className="rounded-3xl p-3 sm:p-4 bg-[#FFFFFF] dark:bg-[#0A261D] border-2 border-[#063B2A]/10 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(6,59,42,0.18)] text-left space-y-4">
                
                {/* Window Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] dark:border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400 inline-block" />
                    <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-[#4A5B53] dark:text-[#94A89E] font-medium hidden sm:inline">
                      rentreceipt.co.ke/dashboard — Live Portfolio
                    </span>
                  </div>
                  <span className="font-bold text-[11px] text-[#087443] bg-[#E8F2ED] dark:bg-[#0D3528] px-2.5 py-0.5 rounded-full border border-[#087443]/20">
                    ● Active Session
                  </span>
                </div>

                {/* Dashboard Production Layout */}
                <div className="space-y-4">
                  {/* Top 3 KPI Cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 space-y-1">
                      <p className="text-[10px] font-bold text-[#4A5B53] dark:text-[#94A89E] uppercase tracking-wider">Properties</p>
                      <p className="font-display text-lg sm:text-xl font-extrabold text-[#101714] dark:text-[#F7F8F5]">14 Estates</p>
                      <p className="text-[10px] text-[#087443] font-semibold">186 Units</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 space-y-1">
                      <p className="text-[10px] font-bold text-[#4A5B53] dark:text-[#94A89E] uppercase tracking-wider">Collected</p>
                      <p className="font-display text-lg sm:text-xl font-extrabold text-[#063B2A] dark:text-[#52B788]">KES 4.82M</p>
                      <p className="text-[10px] text-[#087443] font-semibold">98.4% Rate</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#087443]/20 space-y-1">
                      <p className="text-[10px] font-bold text-[#063B2A] dark:text-[#52B788] uppercase tracking-wider">Pending</p>
                      <p className="font-display text-lg sm:text-xl font-extrabold text-[#C9A227]">KES 145K</p>
                      <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] font-semibold">3 Tenants</p>
                    </div>
                  </div>

                  {/* Mini Collection Graph + Recent Payment Feed */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <p className="font-bold text-[#101714] dark:text-[#F7F8F5] flex items-center gap-1.5">
                        <TrendingUp className="size-3.5 text-[#087443]" /> Monthly Collection Velocity
                      </p>
                      <span className="font-mono text-[10px] text-[#087443] font-bold">+24.5% vs 2025</span>
                    </div>

                    {/* Chart Bars */}
                    <div className="flex items-end gap-1.5 h-16 pt-2 border-b border-[#E2E8E4] dark:border-white/10">
                      {[40, 52, 60, 55, 70, 65, 82, 78, 88, 92, 95, 100].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-[#E8F2ED] dark:bg-[#0D3528] rounded-t-sm h-full flex items-end">
                          <div
                            style={{ height: `${val}%` }}
                            className={`w-full rounded-t-sm ${
                              idx >= 10 ? "bg-[#C9A227]" : "bg-[#087443]"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Recent Transaction Row */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-[#087443]/15 text-[#087443]">
                          <Check className="size-3.5 stroke-[3]" />
                        </span>
                        <div>
                          <p className="font-bold text-[#101714] dark:text-[#F7F8F5]">Mary W. Mwangi · Apt 4B</p>
                          <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] font-mono">M-PESA: QKH7829X1P</p>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-[#063B2A] dark:text-[#52B788]">KES 45,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Smartphone: Digital Rent Receipt Display */}
              <div className="absolute -bottom-8 -right-2 sm:-right-6 w-60 sm:w-68 rounded-3xl p-3.5 bg-[#FFFFFF] dark:bg-[#0A261D] border-2 border-[#C9A227] shadow-[0_20px_50px_rgba(201,162,39,0.25)] text-left space-y-3 hidden sm:block">
                <div className="flex items-center justify-between border-b border-[#E2E8E4] dark:border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="size-4 text-[#087443]" />
                    <span className="font-display font-extrabold text-[11px] tracking-tight">RENT RECEIPT</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#087443] bg-[#E8F2ED] dark:bg-[#0D3528] px-2 py-0.5 rounded-full">
                    QR VERIFIED
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B53] dark:text-[#94A89E]">Tenant:</span>
                    <span className="font-bold">Mary W. Mwangi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B53] dark:text-[#94A89E]">Property:</span>
                    <span className="font-bold">Kilimani Heights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B53] dark:text-[#94A89E]">Unit:</span>
                    <span className="font-bold">Unit 4B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B53] dark:text-[#94A89E]">Method:</span>
                    <span className="font-bold text-[#087443]">M-PESA</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E2E8E4] dark:border-white/10">
                    <span className="font-bold text-[#063B2A] dark:text-[#F7F8F5]">Paid:</span>
                    <span className="font-bold font-mono text-[#087443] text-xs">KES 45,000</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#E8F2ED] dark:bg-[#0D3528] flex items-center justify-between gap-2 text-[10px]">
                  <QrCode className="size-6 text-[#063B2A] dark:text-[#52B788]" />
                  <span className="font-semibold text-[#087443] flex items-center gap-1">
                    <MessageCircle className="size-3" /> WhatsApp Sent
                  </span>
                </div>
              </div>

              {/* Floating UI Badges */}
              <div className="absolute -top-4 -left-4 bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#063B2A]/15 dark:border-white/15 px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce duration-1000">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#087443] text-white">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Rent Paid ✓</span>
              </div>

              <div className="absolute top-1/2 -left-6 bg-[#063B2A] text-white px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-bold hidden sm:flex">
                <Zap className="size-3.5 text-[#C9A227]" />
                <span>KES 245,000 Collected Today</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
