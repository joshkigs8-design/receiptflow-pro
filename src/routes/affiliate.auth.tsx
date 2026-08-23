import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Building2, CheckCircle2, Gift, Loader2, LogIn, UserPlus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/lib/theme";
import { enrollAffiliate, recordReferral } from "@/lib/affiliate.functions";

const searchSchema = z
  .object({
    mode: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .pipe(z.enum(["login", "signup"]))
      .optional(),
    ref: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .pipe(z.string().max(40))
      .optional(),
  })
  .passthrough();

export const Route = createFileRoute("/affiliate/auth")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Affiliate Portal Login & Signup — RentReceiptPro" },
      {
        name: "description",
        content:
          "Sign in or register for the RentReceiptPro Affiliate Program to earn KSh 50 for every paying landlord referral.",
      },
      { property: "og:title", content: "Affiliate Portal — RentReceiptPro" },
      {
        property: "og:description",
        content: "Access your affiliate dashboard, manage referrals and request M-Pesa payouts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/affiliate/auth" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/affiliate/auth" }],
  }),
  component: AffiliateAuthPage,
});

function AffiliateAuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const mode = search.mode === "signup" ? "signup" : "login";
  const urlRef = search.ref;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Robust referral code persistence in localStorage
  const [storedRef, setStoredRef] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      if (urlRef) {
        localStorage.setItem("rrp_referral_code", urlRef);
        return urlRef;
      }
      return localStorage.getItem("rrp_referral_code");
    }
    return urlRef ?? null;
  });

  useEffect(() => {
    if (urlRef) {
      setStoredRef(urlRef);
      if (typeof window !== "undefined") {
        localStorage.setItem("rrp_referral_code", urlRef);
      }
    }
  }, [urlRef]);

  // Check active session on initial mount
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (!error && data.session) {
        navigate({ to: "/affiliate", replace: true });
      } else {
        setCheckingSession(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  function switchMode(newMode: "login" | "signup") {
    setSentEmail(null);
    navigate({
      to: "/affiliate/auth",
      search: (prev) => ({ ...prev, mode: newMode }),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "signup") {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setBusy(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setBusy(false);
          return;
        }

        const effectiveRef = storedRef || urlRef || null;

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name.trim(),
              affiliate_signup: true,
              referral_code: effectiveRef,
            },
          },
        });

        if (error) throw error;

        // If email confirmation is required
        if (!data.session) {
          if (typeof window !== "undefined") {
            (window as any).rrp_isAffiliate = true;
          }
          setSentEmail(email.trim().toLowerCase());
          toast.success("Confirmation link sent to your email.");
          return;
        }

        // Active session created immediately
        toast.success("Account created successfully!");

        // Auto-enroll user as affiliate
        try {
          await enrollAffiliate();
        } catch (err) {
          console.warn("Auto-enrollment notice:", err);
        }

        // Record referral attribution if referred by someone else
        if (effectiveRef) {
          try {
            await recordReferral({ data: { referralCode: effectiveRef } });
          } catch (err) {
            console.warn("Referral recording skipped:", err);
          }
          if (typeof window !== "undefined") {
            localStorage.removeItem("rrp_referral_code");
          }
          setStoredRef(null);
        }

        navigate({ to: "/affiliate" });
      } else {
        // Mode === "login"
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        // Ensure affiliate enrollment exists
        try {
          await enrollAffiliate();
        } catch (err) {
          console.warn("Affiliate check notice:", err);
        }

        toast.success("Welcome back!");
        navigate({ to: "/affiliate" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking affiliate session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.70_0.215_48_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.79_0.17_65_/_0.20),transparent_60%)] animate-aurora" />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="surface-card relative w-full max-w-md p-8 shadow-xl">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
              <Building2 className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display font-bold text-foreground">RentReceiptPro</span>
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-primary/15 text-primary">
            <Wallet className="size-3.5" />
            Affiliate
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              mode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="size-4" />
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              mode === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="size-4" />
            Create Account
          </button>
        </div>

        {/* Heading */}
        <div className="mt-6">
          <h1 className="font-display text-2xl font-bold">
            {mode === "signup" ? "Create Affiliate Account" : "Affiliate Login"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Join the program and earn KSh 50 for every paying landlord referral."
              : "Sign in to track your referrals, earnings and payouts."}
          </p>
        </div>

        {/* Referral Banner Notice */}
        {storedRef && mode === "signup" && !sentEmail && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-2.5 text-xs text-primary">
            <Gift className="size-4 shrink-0" />
            <span>
              Referred by partner code: <strong className="font-mono">{storedRef}</strong>
            </span>
          </div>
        )}

        {/* Email Confirmation Notice State */}
        {sentEmail ? (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h3 className="mt-3 font-display text-lg font-bold">Confirm your email</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We emailed a confirmation link to <strong className="text-foreground">{sentEmail}</strong>.
              Please click the link in your email to activate your affiliate account, then sign in.
            </p>
            <Button
              type="button"
              className="mt-6 w-full rounded-full shadow-glow"
              onClick={() => switchMode("login")}
            >
              Go to Affiliate Login
            </Button>
          </div>
        ) : (
          /* Authentication Form */
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="affiliate-name">Full Name</Label>
                <Input
                  id="affiliate-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  required
                  maxLength={120}
                  autoComplete="name"
                  disabled={busy}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="affiliate-email">Email Address</Label>
              <Input
                id="affiliate-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                maxLength={200}
                autoComplete="email"
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliate-password">Password</Label>
              <Input
                id="affiliate-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                maxLength={72}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                disabled={busy}
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="affiliate-confirm-password">Confirm Password</Label>
                <Input
                  id="affiliate-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  maxLength={72}
                  autoComplete="new-password"
                  disabled={busy}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full font-semibold shadow-glow mt-2"
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "signup" ? (
                "Create Affiliate Account"
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </form>
        )}

        {/* Footer Switcher & Landlord Link */}
        <div className="mt-6 border-t border-border pt-4 text-center space-y-2">
          {!sentEmail && (
            <p className="text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an affiliate account?" : "Don't have an affiliate account yet?"}{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
              >
                {mode === "signup" ? "Login here" : "Sign up free"}
              </button>
            </p>
          )}
          <p className="text-xs text-muted-foreground pt-2">
            Are you a landlord?{" "}
            <Link to="/auth" className="font-medium text-foreground hover:text-primary underline">
              Landlord Login &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}