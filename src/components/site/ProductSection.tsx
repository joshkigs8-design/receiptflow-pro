import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Home,
  LayoutDashboard,
  Layers,
  MessageCircle,
  QrCode,
  Receipt,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { money } from "@/lib/format";

const sidebarNav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Building2, label: "Properties", count: "14" },
  { icon: Users, label: "Tenants", count: "186" },
  { icon: Wallet, label: "Payments", count: "New" },
  { icon: Receipt, label: "Receipts", count: "1,248" },
  { icon: BarChart3, label: "Reports & Tax" },
  { icon: Wrench, label: "Maintenance", count: "2" },
  { icon: Settings, label: "Settings" },
];

export function ProductSection() {
  return (
    <section className="relative py-28 bg-[#063B2A] text-white overflow-hidden">
      {/* Ambient Lighting & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(8,116,67,0.35),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#C9A227] bg-[#0A261D] border border-[#C9A227]/30">
            <Sparkles className="size-3.5" /> High-Performance PropTech Interface
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white">
            YOUR ENTIRE RENTAL BUSINESS. AT A GLANCE.
          </h2>
          <p className="text-base sm:text-lg text-white/80">
            Engineered with extreme precision for speed, effortless record-keeping, and crystal-clear financial clarity.
          </p>
        </div>

        {/* Large Detailed SaaS Production Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-3 sm:p-5 bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.5)] text-left"
        >
          <div className="rounded-2xl bg-[#061A13] border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Top SaaS App Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0A261D]/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500 inline-block" />
                  <span className="size-3 rounded-full bg-amber-500 inline-block" />
                  <span className="size-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <span className="font-mono text-xs text-white/70">
                  rentreceipt.co.ke/app — Nairobi Rental Portfolio Management
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#C9A227] bg-[#C9A227]/15 px-2.5 py-0.5 rounded-full border border-[#C9A227]/30">
                Sample Live Data View
              </span>
            </div>

            {/* Main App Workspace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
              
              {/* Sidebar Navigation */}
              <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r border-white/10 p-4 space-y-1.5 bg-[#0A261D]/40">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1">Menu</p>
                {sidebarNav.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      item.active
                        ? "bg-[#087443] text-white shadow-md"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="size-4 text-[#C9A227]" />
                      <span>{item.label}</span>
                    </div>
                    {item.count ? (
                      <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-white/80">
                        {item.count}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Central Dashboard Data Area */}
              <div className="md:col-span-9 lg:col-span-10 p-5 sm:p-7 space-y-6">
                
                {/* 4 Stat Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-[#0A261D] border border-white/10 space-y-1">
                    <p className="text-[11px] font-bold text-white/50 uppercase">Total Collected</p>
                    <p className="font-display text-2xl font-black text-white">KES 4,820,000</p>
                    <p className="text-[11px] text-[#10B981] font-semibold">+18.4% vs last month</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0A261D] border border-white/10 space-y-1">
                    <p className="text-[11px] font-bold text-white/50 uppercase">Occupancy Rate</p>
                    <p className="font-display text-2xl font-black text-white">98.4%</p>
                    <p className="text-[11px] text-white/70 font-semibold">124 of 126 Units</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0A261D] border border-white/10 space-y-1">
                    <p className="text-[11px] font-bold text-white/50 uppercase">Pending Arrears</p>
                    <p className="font-display text-2xl font-black text-[#C9A227]">KES 145,000</p>
                    <p className="text-[11px] text-[#C9A227] font-semibold">3 Units Pending</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#087443]/30 border border-[#087443]/50 space-y-1">
                    <p className="text-[11px] font-bold text-[#52B788] uppercase">Receipts Sent</p>
                    <p className="font-display text-2xl font-black text-white">1,248 Total</p>
                    <p className="text-[11px] text-[#52B788] font-semibold">100% WhatsApp Verified</p>
                  </div>
                </div>

                {/* 2-Column Split: Monthly Velocity Chart & Live Tenant Ledger Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left: Collection Velocity Graph */}
                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0A261D] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">12-Month Rental Collection Growth</p>
                        <p className="text-[11px] text-white/50">Historical Performance Across 14 Estates</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-full">
                        +36.8% YoY
                      </span>
                    </div>

                    <div className="flex items-end gap-2 h-36 pt-4 border-b border-white/10">
                      {[
                        { m: "Sep", h: 50 },
                        { m: "Oct", h: 60 },
                        { m: "Nov", h: 68 },
                        { m: "Dec", h: 75 },
                        { m: "Jan", h: 72 },
                        { m: "Feb", h: 80 },
                        { m: "Mar", h: 84 },
                        { m: "Apr", h: 88 },
                        { m: "May", h: 90 },
                        { m: "Jun", h: 94 },
                        { m: "Jul", h: 97 },
                        { m: "Aug", h: 100 },
                      ].map((bar, idx) => (
                        <div key={bar.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div
                            style={{ height: `${bar.h}%` }}
                            className={`w-full rounded-t-sm ${
                              idx >= 10 ? "bg-[#C9A227]" : "bg-[#087443]"
                            }`}
                          />
                          <span className="text-[9px] font-mono text-white/50">{bar.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Recent Payment Records */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0A261D] border border-white/10 space-y-3">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="size-3.5 text-[#C9A227]" /> Live Collection Activity
                    </p>

                    <div className="space-y-2">
                      {[
                        {
                          name: "Mary Wanjiku Mwangi",
                          estate: "Kilimani Heights · Apt 4B",
                          amount: "KES 45,000",
                          status: "Receipt Sent",
                          ref: "QKH7829X1P",
                        },
                        {
                          name: "Brian Otieno Odhiambo",
                          estate: "Westlands Executive · Unit 8A",
                          amount: "KES 65,000",
                          status: "Receipt Sent",
                          ref: "QKJ9921M0R",
                        },
                        {
                          name: "Esther Chemutai",
                          estate: "Roysambu Greens · Unit B12",
                          amount: "KES 22,000",
                          status: "Receipt Sent",
                          ref: "QKL4410K9T",
                        },
                      ].map((row, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-white truncate">{row.name}</p>
                            <p className="text-[10px] text-white/50">{row.estate}</p>
                            <p className="text-[9px] font-mono text-white/40">{row.ref}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold font-mono text-white">{row.amount}</p>
                            <span className="text-[9px] text-[#10B981] font-semibold flex items-center gap-0.5 justify-end">
                              <CheckCircle2 className="size-2.5" /> {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
