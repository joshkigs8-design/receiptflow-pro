import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DoorOpen } from "lucide-react";

export interface OccupancyGaugeProps {
  occupancyRate: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalUnits: number;
  className?: string | undefined;
}

export function OccupancyGauge({
  occupancyRate,
  occupiedUnits,
  vacantUnits,
  totalUnits,
  className,
}: OccupancyGaugeProps) {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    // Trigger smooth stroke animation after mount
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const safeTotal = totalUnits > 0 ? totalUnits : occupiedUnits + vacantUnits;
  const clampedRate = Math.min(100, Math.max(0, Number.isFinite(occupancyRate) ? occupancyRate : 0));
  const roundedRate = Math.round(clampedRate);
  const vacantRate = safeTotal > 0 ? Math.min(100, Math.max(0, (vacantUnits / safeTotal) * 100)) : 0;

  // Outer ring geometry (Occupied - Emerald)
  const outerRadius = 80;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerOffset = animated
    ? outerCircumference - (clampedRate / 100) * outerCircumference
    : outerCircumference;

  // Inner ring geometry (Vacant - Slate track)
  const innerRadius = 66;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerOffset = animated
    ? innerCircumference - (vacantRate / 100) * innerCircumference
    : innerCircumference;

  // Determine status chip variant
  const getStatusChip = () => {
    if (safeTotal === 0) {
      return {
        label: "No Units",
        className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      };
    }
    if (clampedRate >= 95) {
      return {
        label: "Full Occupancy",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    }
    if (clampedRate >= 80) {
      return {
        label: "Healthy Portfolio",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    }
    if (clampedRate >= 60) {
      return {
        label: "Moderate Occupancy",
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: "Attention Needed",
      className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    };
  };

  const status = getStatusChip();

  return (
    <div
      role="meter"
      aria-label="Occupancy Rate Gauge"
      aria-valuenow={roundedRate}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${roundedRate}% Occupied`}
      className={cn(
        "surface-card rounded-3xl p-6 border border-border/80 shadow-sm flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DoorOpen className="size-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">Occupancy Rate</h3>
            <p className="text-[11px] text-muted-foreground">Portfolio capacity</p>
          </div>
        </div>

        {/* Status chip */}
        <Badge
          variant="outline"
          className={cn("text-[11px] font-semibold px-2.5 py-0.5 border shadow-none", status.className)}
        >
          {status.label}
        </Badge>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="size-48 -rotate-90 transform drop-shadow-sm transition-transform duration-500"
        >
          <defs>
            {/* High-contrast Emerald gradient for occupied arc */}
            <linearGradient id="occupancyEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#087443" />
            </linearGradient>

            {/* Slate gradient for vacant track */}
            <linearGradient id="vacantSlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10B981" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Track (Muted Slate Background) */}
          <circle
            cx="100"
            cy="100"
            r={outerRadius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="13"
            className="text-slate-100 dark:text-slate-800/80"
          />

          {/* Outer Ring (Occupied - Emerald Gradient with Smooth Stroke Animation) */}
          <circle
            cx="100"
            cy="100"
            r={outerRadius}
            fill="transparent"
            stroke="url(#occupancyEmeraldGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={outerCircumference}
            strokeDashoffset={outerOffset}
            style={{
              transition: "stroke-dashoffset 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            filter="url(#emeraldGlow)"
          />

          {/* Inner Track (Muted Slate Inner Guide) */}
          <circle
            cx="100"
            cy="100"
            r={innerRadius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="5"
            className="text-slate-100/70 dark:text-slate-800/40"
          />

          {/* Inner Ring (Vacant Unit Contrast Ring - Slate) */}
          {vacantRate > 0 && (
            <circle
              cx="100"
              cy="100"
              r={innerRadius}
              fill="transparent"
              stroke="url(#vacantSlateGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={innerCircumference}
              strokeDashoffset={innerOffset}
              style={{
                transition: "stroke-dashoffset 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              opacity={0.8}
            />
          )}
        </svg>

        {/* Centered Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {roundedRate}%
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Occupied
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            {safeTotal} {safeTotal === 1 ? "unit" : "units"} total
          </span>
        </div>
      </div>

      {/* Mini Badge: "X occupied · Y vacant" */}
      <div className="w-full flex flex-col items-center gap-3 pt-1">
        <Badge
          variant="outline"
          className="rounded-full px-3 py-1 text-xs font-semibold bg-muted/40 border-border/80 text-foreground"
        >
          {occupiedUnits} occupied · {vacantUnits} vacant
        </Badge>

        {/* Clean breakdown legend */}
        <div className="w-full grid grid-cols-2 gap-2 pt-1 border-t border-border/60 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10">
            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Occupied
              </span>
              <span className="font-mono font-bold text-foreground truncate block">
                {occupiedUnits} units
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-500/5 dark:bg-slate-500/10">
            <span className="size-2 rounded-full bg-slate-500 ring-2 ring-slate-500/20 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                Vacant
              </span>
              <span className="font-mono font-bold text-foreground truncate block">
                {vacantUnits} units
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
