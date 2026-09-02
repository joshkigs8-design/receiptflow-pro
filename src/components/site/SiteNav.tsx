import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Building2, Download, Menu, Receipt, ShieldCheck, Sparkles, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/lib/theme";
import { downloadLandlordManualPdf } from "@/lib/manual-pdf";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Kenyan Context", href: "/#kenya" },
  { label: "Affiliate", to: "/affiliate-program" },
  { label: "Windows App", to: "/download" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-full px-4 sm:px-5 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-[#FFFFFF]/90 dark:bg-[#0A261D]/90 backdrop-blur-xl border border-[#063B2A]/10 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(6,59,42,0.12)]"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo: Minimal House + Receipt Concept */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#063B2A] text-white shadow-sm group-hover:bg-[#087443] transition-colors">
              <Building2 className="size-4 text-[#C9A227]" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base font-extrabold tracking-tight text-[#101714] dark:text-[#F7F8F5] leading-none">
                RentReceipt <span className="text-[#087443] dark:text-[#10B981]">Pro</span>
              </span>
              <span className="text-[9px] font-mono text-[#4A5B53] dark:text-[#94A89E] uppercase tracking-widest leading-tight mt-0.5 hidden sm:inline">
                Smart Rental Management
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] hover:text-[#063B2A] dark:hover:text-[#F7F8F5] hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] hover:text-[#063B2A] dark:hover:text-[#F7F8F5] hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] transition-colors"
                >
                  {l.label}
                </a>
              ),
            )}

            <div className="h-4 w-px bg-[#E2E8E4] dark:bg-white/10 mx-1.5" />

            <Link
              to="/tenant"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] hover:text-[#063B2A] dark:hover:text-[#F7F8F5] transition-colors"
            >
              Tenant Portal
            </Link>

            <button
              type="button"
              onClick={() => downloadLandlordManualPdf()}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#087443] dark:text-[#52B788] hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] transition-colors inline-flex items-center gap-1"
            >
              <Download className="size-3 text-[#C9A227]" /> Manual (PDF)
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-full sm:inline-flex text-xs font-semibold text-[#101714] dark:text-[#F7F8F5] hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528]"
            >
              <Link to="/auth">Log In</Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white font-bold text-xs px-4 h-9 shadow-md transition-all hover:scale-105 border border-[#C9A227]/30"
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                Get Started <ArrowRight className="ml-1 size-3.5 text-[#C9A227]" />
              </Link>
            </Button>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#E2E8E4] dark:border-white/10 md:hidden text-[#101714] dark:text-[#F7F8F5]"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {open ? (
          <div className="mt-2 flex flex-col gap-1 rounded-3xl p-4 bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#063B2A]/10 dark:border-white/10 shadow-xl md:hidden animate-in fade-in-50 slide-in-from-top-2">
            {navLinks.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528]"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528]"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="h-px bg-[#E2E8E4] dark:bg-white/10 my-1" />
            <Link
              to="/tenant"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] flex items-center justify-between"
            >
              <span>Tenant Self-Service Portal</span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/caretaker"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] flex items-center justify-between"
            >
              <span>Caretaker Terminal</span>
              <UserCheck className="size-4 text-[#087443]" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                downloadLandlordManualPdf();
              }}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528] flex items-center justify-between text-[#087443] dark:text-[#52B788]"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-[#C9A227]" />
                <span>User Manual (PDF)</span>
              </span>
              <Download className="size-4" />
            </button>
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E8F2ED] dark:hover:bg-[#0D3528]"
            >
              Landlord Log In
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
