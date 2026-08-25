import { BookOpen, CheckCircle2, FileSpreadsheet, FileX2, Layers, Receipt, Search, Sparkles } from "lucide-react";

const problems = [
  {
    icon: BookOpen,
    title: "Still using notebooks?",
    solution: "Rental information becomes difficult to track.",
    explanation: "Paper receipt books get lost, water-damaged, and make searching historical payments a nightmare.",
  },
  {
    icon: Search,
    title: "Losing track of payments?",
    solution: "Know exactly who has paid and who hasn't.",
    explanation: "Instantly see arrears, partial payments, and upcoming rent with zero mental gymnastics.",
  },
  {
    icon: Receipt,
    title: "Sending receipts manually?",
    solution: "Generate professional receipts in seconds.",
    explanation: "Dispatch tamper-proof PDF receipts directly to the tenant's WhatsApp in under 3 seconds.",
  },
  {
    icon: Layers,
    title: "Managing multiple properties?",
    solution: "Keep your entire rental portfolio organized in one place.",
    explanation: "Switch effortlessly between different apartment blocks, commercial units, and student rentals.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-28 bg-[#F7F8F5] dark:bg-[#061A13] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> The Modern Property Solution
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5] leading-tight">
            RENTAL MANAGEMENT SHOULDN'T FEEL LIKE PAPERWORK.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Eliminate the clutter of paper receipt books, unverified text messages, and fragmented bank records.
          </p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Authentic Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#063B2A]/15 dark:border-white/15 shadow-[0_20px_50px_-15px_rgba(6,59,42,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=75"
                alt="Kenyan Property Manager Reviewing Rental Records"
                width="600"
                height="460"
                loading="lazy"
                decoding="async"
                className="w-full h-[460px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063B2A]/90 via-[#063B2A]/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="font-display font-black text-lg">Apex Real Estate Management</p>
                <p className="text-xs text-white/80">"Switching from paper receipt books saved us 15 hours every week."</p>
                <p className="text-[10px] text-[#C9A227] font-semibold pt-1">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Editorial Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#E2E8E4] dark:border-white/10 shadow-sm hover:border-[#087443] transition-all space-y-3 text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#E8F2ED] dark:bg-[#0D3528] text-[#063B2A] dark:text-[#52B788] group-hover:scale-105 transition-transform">
                    <p.icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">Solution</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-[#101714] dark:text-[#F7F8F5]">
                    {p.title}
                  </h3>
                  <p className="text-xs font-bold text-[#087443] dark:text-[#52B788]">
                    {p.solution}
                  </p>
                  <p className="text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed pt-1">
                    {p.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
