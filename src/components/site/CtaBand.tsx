import { Link } from "@tanstack/react-router";
import { ArrowRight, Gift, MessageCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="px-4 sm:px-6 py-24 bg-[#F7F8F5] dark:bg-[#061A13]">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-8 sm:p-14 text-center border-2 border-[#C9A227]/40 bg-[#063B2A] text-white shadow-[0_25px_70px_rgba(6,59,42,0.4)] space-y-6">
        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(8,116,67,0.4),transparent_70%)]" />

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0A261D] border border-[#C9A227]/40 px-3.5 py-1.5 text-xs font-bold text-[#C9A227]">
          <Sparkles className="size-3.5" /> 1 Month Free Trial On Signup
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          READY TO TAKE CONTROL OF YOUR RENTALS?
        </h2>

        <p className="mx-auto max-w-xl text-white/80 text-base sm:text-lg font-medium leading-relaxed">
          Stop juggling notebooks, spreadsheets and scattered payment records. Bring your rental business into one simple platform.
        </p>

        <div className="pt-2 flex flex-wrap justify-center items-center gap-3.5 relative z-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#087443] hover:bg-[#055732] text-white font-bold h-12 px-8 text-sm shadow-lg transition-all hover:scale-105 border border-[#C9A227]/50"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started Today <ArrowRight className="ml-2 size-4 text-[#C9A227]" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-6 text-sm font-semibold border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
          >
            <a href="#features">Explore RentReceipt Pro</a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10"
          >
            <Link to="/tenant">Tenant Portal →</Link>
          </Button>
        </div>

        <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-white/70 font-semibold relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-[#C9A227]" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-[#C9A227]" /> Setup in 2 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-[#C9A227]" /> Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
