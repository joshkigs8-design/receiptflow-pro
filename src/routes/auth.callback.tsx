import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { recordReferral } from "@/lib/affiliate.functions";

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
        // Check for stored referral code
        const storedReferralCode = typeof window !== "undefined" ? localStorage.getItem("rrp_referral_code") : null;

        // Get the current session - Supabase automatically handles the OAuth callback
        // when the app loads with the #access_token and #refresh_token hash parameters
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
          // Session established successfully
          // Record referral if we have a stored code and this is a new user (no existing referral)
          if (storedReferralCode) {
            try {
              await recordReferral({ data: { referralCode: storedReferralCode } });
            } catch (err) {
              console.warn("Referral recording failed:", err);
            }
            localStorage.removeItem("rrp_referral_code");
          }
          toast.success("Signed in successfully!");
          setTimeout(() => {
            navigate({ to: "/dashboard" });
          }, 500);
        } else {
          // No session found
          setError("No session found. Please try again.");
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.25),transparent_60%)] animate-aurora" />

      <div className="surface-card relative w-full max-w-md p-8 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Signing you in...</p>
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
            <p className="mt-4 text-sm text-muted-foreground">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}
