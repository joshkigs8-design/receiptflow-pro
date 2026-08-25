import { Link } from "@tanstack/react-router";
import { Building2, Menu, X, ArrowRight, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/lib/theme";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Interactive Demo", href: "/#demo" },
  { label: "Analytics", href: "/#preview" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Affiliate", to: "/affiliate-program" },
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
          className={`flex items-center justify-between rounded-full px-4 py-2 transition-all duration-300 ${
            scrolled
              ? "bg-card/85 backdrop-blur-xl border border-border/80 shadow-float"
              : "bg-background/40 backdrop-blur-md border border-border/40"
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base font-black tracking-tight leading-none">
                RentReceipt<span className="text-primary">Pro</span>
              </span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-tight mt-0.5 hidden sm:inline">
                Kenya PropTech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              ),
            )}

            <div className="h-4 w-px bg-border/80 mx-1" />

            <Link
              to="/tenant"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              Tenant Portal
            </Link>

            <Link
              to="/caretaker"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground flex items-center gap-1"
            >
              <UserCheck className="size-3 text-primary" /> Caretaker App
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-full sm:inline-flex text-xs font-semibold"
            >
              <Link to="/auth">Sign In</Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="rounded-full shadow-glow font-bold text-xs px-4 h-9"
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                Start 1 Month Free <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((v) => !v)}
              className="glass inline-flex size-9 items-center justify-center rounded-full lg:hidden text-foreground"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {open ? (
          <div className="glass-strong mt-2 flex flex-col gap-1 rounded-3xl p-4 lg:hidden border border-border/80 shadow-float animate-in fade-in-50 slide-in-from-top-2">
            {navLinks.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="h-px bg-border/60 my-1" />
            <Link
              to="/tenant"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-accent flex items-center justify-between"
            >
              <span>Tenant Self-Service Portal</span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </Link>
            <Link
              to="/caretaker"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-accent flex items-center justify-between"
            >
              <span>Caretaker &amp; Agent Terminal</span>
              <UserCheck className="size-4 text-primary" />
            </Link>
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Landlord Login
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
