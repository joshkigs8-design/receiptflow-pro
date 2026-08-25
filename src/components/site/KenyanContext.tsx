import { CheckCircle2, Globe, MapPin, MessageCircle, QrCode, ShieldCheck, Smartphone, Sparkles, Wallet } from "lucide-react";

const kenyanHighlights = [
  {
    icon: Smartphone,
    title: "M-PESA Friendly Workflows",
    desc: "Record Paybill, Till number, and M-PESA transactions with instant reference matching and balance updates.",
  },
  {
    icon: Wallet,
    title: "Kenyan Shilling (KES) Standard",
    desc: "Engineered natively for KES currency, local bank formats (KCB, Equity, Co-op, NCBA, Stanbic), and Kenyan rental terms.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Delivery",
    desc: "Kenyan tenants prefer WhatsApp over emails. One-click PDF receipt dispatch straight to their phone numbers.",
  },
  {
    icon: QrCode,
    title: "Tamper-Proof QR Receipts",
    desc: "Public QR validation portal prevents forged paper receipts for employers, embassies, and Kenyan bank loan applications.",
  },
  {
    icon: Globe,
    title: "Mobile-First Experience",
    desc: "Manage properties from your smartphone, tablet, or laptop wherever you are in Kenya or the diaspora.",
  },
  {
    icon: ShieldCheck,
    title: "KRA Tax Audit Ready",
    desc: "Export clean annual income ledgers and monthly statements ready for your Kenyan accountant and tax filings.",
  },
];

export function KenyanContext() {
  return (
    <section id="kenya" className="relative py-28 bg-[#FFFFFF] dark:bg-[#0A261D] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <span className="text-sm">🇰🇪</span> Local Relevance &amp; Compliance
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            BUILT FOR HOW RENTAL BUSINESS WORKS IN KENYA.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Tailored specifically for Kenyan landlords, estates, caretakers, and tenants.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#063B2A]/15 dark:border-white/15 shadow-[0_20px_50px_rgba(6,59,42,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=75"
                alt="Kenyan Landlord Reviewing Rent Collections"
                width="600"
                height="500"
                loading="lazy"
                decoding="async"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063B2A]/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-[#10B981] animate-ping" />
                  <p className="text-xs font-bold text-[#C9A227]">Nairobi · Mombasa · Kisumu · Nakuru · Eldoret</p>
                </div>
                <p className="font-display font-black text-lg">Designed for local Kenyan property realities</p>
                <p className="text-xs text-white/80">From single studio units to 200+ apartment complexes.</p>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Highlights */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kenyanHighlights.map((k) => (
              <div
                key={k.title}
                className="p-5 rounded-3xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 space-y-2 text-left hover:border-[#087443] transition-all"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788]">
                  <k.icon className="size-4 text-[#087443]" />
                </span>
                <h3 className="font-display font-bold text-sm text-[#101714] dark:text-[#F7F8F5]">
                  {k.title}
                </h3>
                <p className="text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed">
                  {k.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
