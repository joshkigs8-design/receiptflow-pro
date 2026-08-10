import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/lib/theme";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Owner Admin Sign-In — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Private owner sign-in for the Rent Receipt Pro admin portal: platform revenue, landlords and voucher codes.",
      },
      { property: "og:title", content: "Owner Admin Sign-In — Rent Receipt Pro" },
      { property: "og:description", content: "Private owner access to the Rent Receipt Pro admin portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function createOwner(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-login`,
          data: { full_name: "Owner", company_name: "Codevanta Ventures" },
        },
      });
      if (error) throw error;
      if (!data.session) {
        toast.success("Confirm the link we emailed you, then sign in here.");
        return;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the owner account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.22),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.22),transparent_60%)] animate-aurora" />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="surface-card relative w-full max-w-md p-8">
        <span className="gradient-primary flex size-11 items-center justify-center rounded-xl shadow-glow">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Owner admin sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Private entrance to the Codevanta Ventures admin portal — platform revenue, landlord
          accounts and voucher codes.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Owner email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full rounded-full shadow-glow" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Enter admin portal"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            disabled={busy}
            onClick={createOwner}
          >
            First time? Create the owner account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth" className="hover:text-foreground">
            Landlord login instead
          </Link>
        </p>
      </div>
    </div>
  );
}
