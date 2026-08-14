import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  Building2,
  CreditCard,
  DoorOpen,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  PieChart,
  Receipt,
  Settings,
  Sparkles,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/lib/theme";
import { getSubscription } from "@/lib/billing.functions";
import { shortDate } from "@/lib/format";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/units", label: "Units", icon: DoorOpen },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/payments", label: "Payments", icon: Receipt },
  { to: "/receipts", label: "Receipts", icon: FileText },
  { to: "/requests", label: "Maintenance", icon: Wrench },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/reports", label: "Reports", icon: PieChart },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchSubscription = useServerFn(getSubscription);
  const { data: sub } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => fetchSubscription(),
    staleTime: 60_000,
  });
  const exempt = pathname === "/billing" || pathname === "/settings";
  const locked = sub ? !sub.active && !exempt : false;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-8 items-center justify-center rounded-lg shadow-glow">
              <Building2 className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-sm font-bold">Rent Receipt Pro</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X className="size-4" />
          </button>
        </div>

        <nav className="mt-2 space-y-1 px-3 pb-8">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
          <button
            onClick={() => setOpen(true)}
            className="glass inline-flex size-9 items-center justify-center rounded-full lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-bold">{title}</h1>
            {description ? (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Link
              to="/requests"
              aria-label="Notifications"
              className="glass inline-flex size-10 items-center justify-center rounded-full"
            >
              <Bell className="size-4" />
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        {sub && sub.onTrial ? (
          <div className="border-b border-border bg-primary/10 px-4 py-2.5 text-center text-xs font-medium">
            <Sparkles className="mr-1 inline size-3.5 text-primary" />
            Free trial — {sub.daysLeft} day{sub.daysLeft === 1 ? "" : "s"} left (ends{" "}
            {shortDate(sub.endsAt)}).{" "}
            <Link to="/billing" className="font-semibold text-primary hover:underline">
              Activate your plan
            </Link>
          </div>
        ) : null}

        <main className="mx-auto max-w-7xl px-4 py-8">
          {locked ? (
            <div className="surface-card mx-auto max-w-lg p-8 text-center">
              <span className="gradient-primary mx-auto flex size-14 items-center justify-center rounded-2xl shadow-glow">
                <Lock className="size-6 text-primary-foreground" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold">Your access has ended</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your free trial finished on {shortDate(sub?.endsAt)}. Subscribe for KSh 300/month or
                KSh 3,000/year to unlock your dashboard, tenants, payments and receipts again.
              </p>
              <Button asChild size="lg" className="mt-6 rounded-full shadow-glow">
                <Link to="/billing">
                  <CreditCard className="size-4" /> View plans
                </Link>
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}