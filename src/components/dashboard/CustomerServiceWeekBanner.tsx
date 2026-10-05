import * as React from "react";
import { HeartHandshake, MessageCircle, PartyPopper, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rrp_customer_service_week_2026_dismissed";

export interface CustomerServiceWeekBannerProps {
  className?: string;
}

export function CustomerServiceWeekBanner({ className }: CustomerServiceWeekBannerProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== "true") {
        setIsVisible(true);
      }
    } catch {
      // In case localStorage is blocked or unavailable
      setIsVisible(true);
    }
  }, []);

  function handleDismiss() {
    setIsClosing(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore localStorage errors
    }

    toast("Thank you for being part of the RentReceipt Pro family!", {
      description: "We appreciate your partnership. Happy Customer Service Week!",
      icon: "🎉",
    });

    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 250);
  }

  function handleWhatsAppChat() {
    const text = encodeURIComponent(
      "Hi RentReceipt Pro Team! Happy Customer Service Week! I am reaching out from my Landlord Dashboard."
    );
    window.open(`https://wa.me/254742868209?text=${text}`, "_blank");
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Customer Service Week Announcement"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-amber-500/30 dark:border-amber-500/20",
        "bg-gradient-to-r from-amber-500/10 via-primary/5 to-emerald-500/10",
        "dark:from-amber-500/15 dark:via-emerald-950/25 dark:to-primary/15",
        "p-5 sm:p-6 shadow-sm backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        isClosing ? "opacity-0 scale-98 max-h-0 py-0 my-0 overflow-hidden" : "opacity-100 scale-100",
        className
      )}
    >
      {/* Decorative ambient background glows */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-amber-400/20 dark:bg-amber-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Top right close button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss Customer Service Week announcement"
        className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-background/80 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      >
        <X className="size-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 pr-8">
        {/* Festive Icon Avatar */}
        <div className="relative shrink-0">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <HeartHandshake className="size-6 sm:size-7" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[10px] shadow">
            <PartyPopper className="size-3" />
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300"
            >
              <Sparkles className="size-3 text-amber-500 fill-amber-500/40" /> Customer Service Week
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">
              Celebrating You &bull; Oct 2026
            </span>
          </div>

          <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground">
            Happy Customer Service Week! Thank You For Trusting RentReceipt Pro
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            To our esteemed landlords, property managers, and caretakers: <strong className="text-foreground font-semibold">you are the heartbeat of RentReceipt Pro.</strong> Thank you for partnering with us to manage your properties, tenants, and collections. We are honored to serve you and remain devoted to supporting your rental business 24/7.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button
              type="button"
              size="sm"
              onClick={handleWhatsAppChat}
              className="rounded-full text-xs h-8 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold tactile-press"
            >
              <MessageCircle className="size-3.5" />
              Chat With Dedicated Support
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="rounded-full text-xs h-8 px-3.5 text-muted-foreground hover:text-foreground border-border/80 hover:bg-background/80"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

