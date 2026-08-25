import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowLeft, Building2, Gift, KeyRound, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemePicker, ThemeToggle, type ThemeAccent, type ThemeMode, useTheme } from "@/lib/theme";
import { recordReferral } from "@/lib/affiliate.functions";

const searchSchema = z
  .object({
    mode: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .pipe(z.enum(["login", "signup", "forgot", "reset"]))
      .optional(),
    ref: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val[0] : val))
      .pipe(z.string().max(40))
      .optional(),
  })
  .passthrough();

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Landlord Login — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Sign in, reset password or create your Rent Receipt Pro landlord account to manage properties and receipts.",
      },
      { property: "og:title", content: "Landlord Login — Rent Receipt Pro" },
      { property: "og:description", content: "Access your Rent Receipt Pro landlord dashboard." },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "login" | "signup" | "forgot" | "reset";

function AuthPage() {
  const { mode: initialMode, ref } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode || "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const { mode: currentMode, accent: currentAccent } = useTheme();
  const [chosenMode, setChosenMode] = useState<ThemeMode>(currentMode);
  const [chosenAccent, setChosenAccent] = useState<ThemeAccent>(currentAccent);

  // Persist referral code in localStorage to survive page refreshes
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
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem("rrp_referral_code", ref);
    }
  }, [ref]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && mode !== "reset") {
        navigate({ to: "/dashboard", replace: true });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [navigate, mode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name,
              company_name: company || "Codevanta Ventures",
              referral_code: referralCode,
              theme_mode: chosenMode,
              theme_accent: chosenAccent,
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
            await recordReferral({ data: { referralCode } });
          } catch (err) {
            console.warn("Referral recording failed:", err);
          }
        }
        localStorage.removeItem("rrp_referral_code");
        setReferralCode(null);
        navigate({ to: "/dashboard" });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        if (error) throw error;
        setSent(true);
        toast.success("Password reset link sent to your email!");
      } else if (mode === "reset") {
        if (!password || password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated successfully! Welcome back.");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication request failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(`Google sign-in failed: ${error.message}`);
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.70_0.215_48_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.79_0.17_65_/_0.20),transparent_60%)] animate-aurora" />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="surface-card relative w-full max-w-md p-8 rounded-3xl border border-border/80 shadow-float">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold">Rent Receipt Pro</span>
        </Link>

        <h1 className="mt-6 text-2xl font-bold font-display">
          {mode === "signup"
            ? "Create your landlord account"
            : mode === "forgot"
              ? "Reset your password"
              : mode === "reset"
                ? "Set new password"
                : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Start managing properties and issuing digital receipts."
            : mode === "forgot"
              ? "Enter your email and we'll send you a password reset link."
              : mode === "reset"
                ? "Enter your new secure password below."
                : "Sign in to your Codevanta Ventures dashboard."}
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl bg-accent/40 border border-primary/20 p-5 text-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <MailCheck className="size-4" /> Link Sent Successfully
            </div>
            <p className="text-xs text-muted-foreground">
              We sent a secure link to <strong className="text-foreground">{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full rounded-full mt-2"
              onClick={() => {
                setSent(false);
                setMode("login");
              }}
            >
              ← Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <>
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
                <div className="space-y-2">
                  <Label htmlFor="company">Company / brand name</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Codevanta Ventures"
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="referralCode">Referral code (Optional)</Label>
                    {referralCode ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                        <Gift className="size-3" /> Code applied
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="referralCode"
                    value={referralCode ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.trim().toUpperCase();
                      setReferralCode(val || null);
                      if (typeof window !== "undefined") {
                        if (val) localStorage.setItem("rrp_referral_code", val);
                        else localStorage.removeItem("rrp_referral_code");
                      }
                    }}
                    placeholder="e.g. JOSH2026"
                    maxLength={20}
                    className="font-mono uppercase tracking-wider"
                  />
                  {referralCode ? (
                    <p className="text-[11px] text-muted-foreground">
                      Referred by an affiliate? This connects your account to your referrer.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}

            {mode !== "reset" ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="landlord@example.com"
                />
              </div>
            ) : null}

            {mode === "login" || mode === "signup" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setSent(false);
                      }}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
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
            ) : null}

            {mode === "reset" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={72}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={72}
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : null}

            {mode === "signup" ? (
              <div className="pt-3 pb-1 border-t border-border/60">
                <ThemePicker
                  valueMode={chosenMode}
                  valueAccent={chosenAccent}
                  onChange={(m, a) => {
                    setChosenMode(m);
                    setChosenAccent(a);
                  }}
                  compact={true}
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full rounded-full shadow-glow" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "signup" ? (
                "Create account"
              ) : mode === "forgot" ? (
                "Send reset link"
              ) : mode === "reset" ? (
                "Update password"
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        )}

        {mode === "forgot" ? (
          <div className="mt-5 text-center">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              onClick={() => {
                setMode("login");
                setSent(false);
              }}
            >
              <ArrowLeft className="size-3" /> Back to sign in
            </button>
          </div>
        ) : null}

        {mode === "login" || mode === "signup" ? (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" className="w-full rounded-full" onClick={google}>
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account?" : "New to Rent Receipt Pro?"}{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => {
                  setMode((m) => (m === "signup" ? "login" : "signup"));
                  setSent(false);
                }}
              >
                {mode === "signup" ? "Sign in" : "Create one"}
              </button>
            </p>
            <p className="mt-3 text-center text-sm">
              <Link to="/tenant" className="text-muted-foreground hover:text-foreground">
                I'm a tenant → open the portal
              </Link>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
