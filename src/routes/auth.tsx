import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/lib/theme";

const searchSchema = z.object({ mode: z.enum(["login", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Landlord Login — Rent Receipt Pro" },
      {
        name: "description",
        content: "Sign in or create your Rent Receipt Pro landlord account to manage properties and receipts.",
      },
      { property: "og:title", content: "Landlord Login — Rent Receipt Pro" },
      { property: "og:description", content: "Access your Rent Receipt Pro landlord dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

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
            data: { full_name: name, company_name: company || "Codevanta Ventures" },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account.");
          return;
        }
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
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

        <h1 className="mt-6 text-2xl font-bold">
          {signup ? "Create your landlord account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {signup
            ? "Start managing properties and issuing digital receipts."
            : "Sign in to your Codevanta Ventures dashboard."}
        </p>

        {sent ? (
          <p className="mt-6 rounded-2xl bg-accent p-4 text-sm">
            We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {signup ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
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
              </>
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
              {busy ? <Loader2 className="size-4 animate-spin" /> : signup ? "Create account" : "Sign in"}
            </Button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full rounded-full" onClick={google}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? "Already have an account?" : "New to Rent Receipt Pro?"}{" "}
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
          <Link to="/tenant" className="text-muted-foreground hover:text-foreground">
            I'm a tenant → open the portal
          </Link>
        </p>
      </div>
    </div>
  );
}