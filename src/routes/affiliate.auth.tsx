import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Building2, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/lib/theme";

const searchSchema = z.object({ mode: z.enum(["login", "signup"]).optional(), ref: z.string().max(20).optional() });

export const Route = createFileRoute("/affiliate/auth")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Affiliate Login — Rent Receipt Pro" },
      { name: "description", content: "Sign in or create your Rent Receipt Pro affiliate account to earn commissions." },
      { property: "og:title", content: "Affiliate Login — Rent Receipt Pro" },
      { property: "og:description", content: "Access your affiliate dashboard and start earning." },
    ],
  }),
  component: AffiliateAuthPage,
});

function AffiliateAuthPage() {
  const { mode, ref } = Route.useSearch();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  // Persist referral code in localStorage
  const [referralCode, setReferralCode] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rrp_referral_code");
      if (stored) return stored;
      if (ref) {
        localStorage.setItem("rrp_referral_code", ref);
        return ref;
      }
    }
    return ref ?? null;
  });

  useEffect(() => {
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem("rrp_referral_code", ref);
    }
  }, [ref]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name,
              affiliate_signup: true,
              referral_code: referralCode,
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account.");
          return;
        }
        if (referralCode) {
          try {
            const { recordReferral } = await import("@/lib/affiliate.functions");
            await recordReferral({ data: { referralCode } });
          } catch (err) {
            console.warn("Referral recording failed:", err);
          }
        }
        localStorage.removeItem("rrp_referral_code");
        setReferralCode(null);
        navigate({ to: "/affiliate" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/affiliate" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.25),transparent_60%)] animate-aurora" />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="surface-card relative w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold">Rent Receipt Pro</span>
        </Link>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-primary/15 text-primary">
            <Wallet className="size-3.5" />
            Affiliate Portal
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          {signup ? "Create your affiliate account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {signup
            ? "Start earning KSh 50 for every landlord you refer."
            : "Sign in to your affiliate dashboard."}
        </p>

        {sent ? (
          <p className="mt-6 rounded-2xl bg-accent p-4 text-sm">
            We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {signup ? (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={120}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={72}
              />
            </div>
            <Button type="submit" className="w-full rounded-full shadow-glow" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : signup ? (
                "Create affiliate account"
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? "Already have an account?" : "New to the affiliate program?"}{" "}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() => {
              setSignup((v) => !v);
              setSent(false);
            }}
          >
            {signup ? "Sign in" : "Create one"}
          </button>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link to="/auth" className="text-muted-foreground hover:text-foreground">
            ← Landlord login instead
          </Link>
        </p>
      </div>
    </div>
  );
}