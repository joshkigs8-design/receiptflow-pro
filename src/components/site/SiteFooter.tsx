import { Link } from "@tanstack/react-router";
import { BookOpen, Building2, Download, MessageCircle, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { downloadLandlordManualPdf } from "@/lib/manual-pdf";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#063B2A]/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#0A261D] text-left">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#063B2A] text-white shadow-sm">
              <Building2 className="size-4 text-[#C9A227]" />
            </span>
            <span className="font-display font-black text-lg text-[#101714] dark:text-[#F7F8F5]">
              RentReceipt <span className="text-[#087443] dark:text-[#10B981]">Pro</span>
            </span>
          </Link>
          
          <p className="text-xs font-mono font-bold text-[#087443] dark:text-[#52B788] uppercase tracking-wider">
            Smart Rental Management
          </p>

          <p className="text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed max-w-sm">
            Everything you need to manage rental properties, tenants and payments — beautifully organized in one powerful platform.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] px-3 py-1.5 rounded-full border border-[#063B2A]/10 w-fit font-semibold">
            <ShieldCheck className="size-3.5 text-[#C9A227]" />
            <span>Built for Kenyan Property Realities</span>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#101714] dark:text-[#F7F8F5]">Product</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-[#4A5B53] dark:text-[#94A89E] font-medium">
            <li>
              <a href="/#features" className="hover:text-[#087443] transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="/#pricing" className="hover:text-[#087443] transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="/#how-it-works" className="hover:text-[#087443] transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => downloadLandlordManualPdf()}
                className="hover:text-[#087443] transition-colors flex items-center gap-1.5 text-[#087443] dark:text-[#52B788] font-bold text-left"
              >
                <Download className="size-3 text-[#C9A227]" /> User Manual (PDF)
              </button>
            </li>
            <li>
              <Link to="/auth" search={{ mode: "signup" }} className="hover:text-[#087443] transition-colors font-bold text-[#087443] dark:text-[#52B788]">
                Get Started →
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Portals */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#101714] dark:text-[#F7F8F5]">Company</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-[#4A5B53] dark:text-[#94A89E] font-medium">
            <li>
              <a href="#kenya" className="hover:text-[#087443] transition-colors">
                About
              </a>
            </li>
            <li>
              <Link to="/affiliate-program" className="hover:text-[#087443] transition-colors">
                Affiliate Program
              </Link>
            </li>
            <li>
              <Link to="/tenant" className="hover:text-[#087443] transition-colors">
                Tenant Portal
              </Link>
            </li>
            <li>
              <Link to="/caretaker" className="hover:text-[#087443] transition-colors flex items-center gap-1">
                <UserCheck className="size-3 text-[#087443]" /> Caretaker Terminal
              </Link>
            </li>
            <li>
              <Link to="/verify" className="hover:text-[#087443] transition-colors">
                Receipt Verification
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources & Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#101714] dark:text-[#F7F8F5]">Contact &amp; Legal</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-[#4A5B53] dark:text-[#94A89E] font-medium">
            <li>
              <a
                href="https://wa.me/254742868209"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#087443] transition-colors flex items-center gap-1.5 text-[#087443] dark:text-[#52B788] font-bold"
              >
                <MessageCircle className="size-3.5 text-[#25D366]" /> WhatsApp: 0742868209
              </a>
            </li>
            <li>Nairobi, Kenya</li>
            <li className="pt-2">
              <Link to="/privacy-policy" className="hover:text-[#087443] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#087443] transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal & Kenya Signature */}
      <div className="border-t border-[#063B2A]/10 dark:border-white/10 px-6 py-6 text-xs text-[#4A5B53] dark:text-[#94A89E] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <p>© 2026 RentReceipt Pro. All rights reserved.</p>
        <p className="font-semibold text-[#063B2A] dark:text-[#52B788]">
          Built for landlords. Designed for Kenya. 🇰🇪
        </p>
        <p className="font-mono text-[11px]">www.rentreceipt.co.ke</p>
      </div>
    </footer>
  );
}
