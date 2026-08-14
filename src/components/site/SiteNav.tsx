import { Link } from "@tanstack/react-router";
import { Building2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/lib/theme";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "glass-strong" : "border border-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              Rent Receipt <span className="gradient-text">Pro</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/tenant"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Tenant Portal
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full shadow-glow">
              <Link to="/auth" search={{ mode: "signup" }}>
                Get Started
              </Link>
            </Button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="glass inline-flex size-10 items-center justify-center rounded-full md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {open ? (
          <div className="glass-strong mt-2 flex flex-col gap-1 rounded-3xl p-3 md:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </a>
            ))}
            <Link to="/tenant" className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent">
              Tenant Portal
            </Link>
            <Link to="/auth" className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent">
              Login
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}