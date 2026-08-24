import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { recordReferral, enrollAffiliate } from "@/lib/affiliate.functions";
import { applyTheme } from "@/lib/theme";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const storedReferralCode =
          typeof window !== "undefined" ? localStorage.getItem("rrp_referral_code") : null;

        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setError(`Session error: ${sessionError.message}`);
          toast.error("Authentication failed");
          setTimeout(() => {
            navigate({ to: "/auth" });
          }, 2000);
          return;
        }

        if (data.session) {
          // Check if this user signed up as an affiliate
          const user = data.session.user;
          const isAffiliate =
            (typeof window !== "undefined" && (window as any).rrp_isAffiliate === true) ||
            user?.user_metadata?.["affiliate_signup"] === true;

          // Restore saved theme preference if present in metadata
          if (user?.user_metadata?.["theme_mode"] || user?.user_metadata?.["theme_accent"]) {
            const m = user.user_metadata["theme_mode"] || "system";
            const a = user.user_metadata["theme_accent"] || "emerald";
            applyTheme(m, a);
          }

          // If affiliate, ensure enrolled
          if (isAffiliate) {
            try {
              await enrollAffiliate();
            } catch (e) {
              console.warn("Auto-enrollment in callback notice:", e);
            }
          }

          // Record referral attribution if a code was stored
          if (storedReferralCode) {
            try {
              await recordReferral({ data: { referralCode: storedReferralCode } });
            } catch (err) {
              console.warn("Referral recording failed in callback:", err);
            }
            if (typeof window !== "undefined") {
              localStorage.removeItem("rrp_referral_code");
            }
          }

          toast.success("Signed in successfully!");

          setTimeout(() => {
            navigate({ to: isAffiliate ? "/affiliate" : "/dashboard" });
          }, 500);
        } else {
          setError("No active session found. Please sign in.");
          toast.error("Authentication failed");
          setTimeout(() => {
            navigate({ to: "/auth" });
          }, 2000);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        toast.error("Authentication error");
        setTimeout(() => {
          navigate({ to: "/auth" });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.70_0.215_48_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.79_0.17_65_/_0.20),transparent_60%)] animate-aurora" />

      <div className="surface-card relative w-full max-w-md p-8 text-center shadow-xl">
        {isProcessing ? (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-foreground">Confirming your account...</p>
            <p className="mt-1 text-xs text-muted-foreground">Please wait a moment while we set up your portal.</p>
          </>
        ) : error ? (
          <>
            <p className="text-lg font-semibold text-destructive">Authentication Error</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <p className="mt-4 text-xs text-muted-foreground">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Redirecting to your portal...</p>
          </>
        )}
      </div>
    </div>
  );
}
