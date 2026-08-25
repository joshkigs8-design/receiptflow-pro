import { Link } from "@tanstack/react-router";
import { Building2, MessageCircle, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 text-left">
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display font-black text-lg">
              RentReceipt<span className="text-primary">Pro</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            The standard in digital rent receipting and automated rental property management in Kenya. Issue tamper-proof QR verified receipts, track M-Pesa collections, and manage tenant lifecycles.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            <ShieldCheck className="size-3.5" />
            <span>M-Pesa Daraja 3.0 &amp; KRA Tax Receipt Ready</span>
          </div>
        </div>

        {/* Product Suite */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground font-medium">
            <li>
              <a href="/#features" className="hover:text-primary transition-colors">
                Key Features
              </a>
            </li>
            <li>
              <a href="/#demo" className="hover:text-primary transition-colors">
                Live Receipt Simulator
              </a>
            </li>
            <li>
              <a href="/#preview" className="hover:text-primary transition-colors">
                Portfolio Analytics
              </a>
            </li>
            <li>
              <a href="/#pricing" className="hover:text-primary transition-colors">
                Subscription &amp; Pricing
              </a>
            </li>
            <li>
              <Link to="/affiliate-program" className="hover:text-primary transition-colors">
                Affiliate Program (KSh 50/Ref)
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals & Terminals */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Portals</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground font-medium">
            <li>
              <Link to="/auth" className="hover:text-primary transition-colors">
                Landlord Master Login
              </Link>
            </li>
            <li>
              <Link to="/tenant" className="hover:text-primary transition-colors">
                Tenant Self-Service Portal
              </Link>
            </li>
            <li>
              <Link to="/caretaker" className="hover:text-primary transition-colors flex items-center gap-1">
                <UserCheck className="size-3 text-primary" /> Caretaker Terminal
              </Link>
            </li>
            <li>
              <Link to="/verify" className="hover:text-primary transition-colors">
                Public QR Receipt Verification
              </Link>
            </li>
            <li>
              <Link to="/download" className="hover:text-primary transition-colors">
                Android App (PWA)
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Support &amp; Legal</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground font-medium">
            <li>
              <a
                href="https://wa.me/254742868209"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
              >
                <MessageCircle className="size-3.5" /> WhatsApp: 0742868209
              </a>
            </li>
            <li>Nairobi, Kenya</li>
            <li className="pt-2">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 px-6 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <p>© {new Date().getFullYear()} Codevanta Ventures. All rights reserved.</p>
        <p className="font-mono text-[11px]">RentReceiptPro v2.4.0 · Kenya PropTech Engine</p>
      </div>
    </footer>
  );
}
