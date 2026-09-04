import * as React from "react";
import { cn } from "@/lib/utils";

export type LiveRadarStatus = "online" | "syncing" | "offline";

export interface LiveRadarProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string | undefined;
  status?: LiveRadarStatus | undefined;
  className?: string | undefined;
  showPing?: boolean | undefined;
}

const statusConfig: Record<
  LiveRadarStatus,
  {
    defaultLabel: string;
    badgeClass: string;
    dotClass: string;
    pingClass: string;
    glowClass: string;
    ariaDescription: string;
  }
> = {
  online: {
    defaultLabel: "System Live · Real-time Sync",
    badgeClass:
      "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/15",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
    glowClass: "shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    ariaDescription: "Real-time sync active and connected to live database",
  },
  syncing: {
    defaultLabel: "Syncing Updates...",
    badgeClass:
      "bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/20 hover:bg-sky-500/15",
    dotClass: "bg-sky-500",
    pingClass: "bg-sky-400",
    glowClass: "shadow-[0_0_8px_rgba(14,165,233,0.6)]",
    ariaDescription: "Syncing database records with cloud server",
  },
  offline: {
    defaultLabel: "Offline (Local Cache)",
    badgeClass:
      "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 hover:bg-amber-500/15",
    dotClass: "bg-amber-500",
    pingClass: "hidden",
    glowClass: "shadow-none",
    ariaDescription: "Currently running offline using cached records",
  },
};

/**
 * LiveRadar renders an emerald real-time sync beacon dot and badge with concentric pulsing radar rings.
 */
export const LiveRadar = React.forwardRef<HTMLDivElement, LiveRadarProps>(
  (
    {
      label,
      status = "online",
      className,
      showPing = true,
      title,
      ...props
    },
    ref,
  ) => {
    const config = statusConfig[status];
    const displayLabel = label ?? config.defaultLabel;
    const tooltipText = title ?? config.ariaDescription;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        title={tooltipText}
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs transition-all duration-200 select-none shadow-xs",
          config.badgeClass,
          className,
        )}
        {...props}
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
          {showPing && status !== "offline" && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                config.pingClass,
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full transition-colors",
              config.dotClass,
              config.glowClass,
            )}
          />
        </span>
        <span className="font-medium tracking-tight truncate">
          {displayLabel}
        </span>
      </div>
    );
  },
);

LiveRadar.displayName = "LiveRadar";
