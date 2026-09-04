import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { money } from "@/lib/format";
import { AlertCircle, CheckCircle2, Clock, DollarSign, Target, TrendingUp, Wallet } from "lucide-react";

export interface CollectionMeterProps {
  collected: number;
  expected: number;
  outstanding: number;
  priorArrears?: number | undefined;
  collectionRate: number;
  className?: string | undefined;
}

export function CollectionMeter({
  collected,
  expected,
  outstanding,
  priorArrears,
  collectionRate,
  className,
}: CollectionMeterProps) {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const safeCollected = Math.max(0, Number.isFinite(collected) ? collected : 0);
  const safeExpected = Math.max(0, Number.isFinite(expected) ? expected : 0);
  const safeOutstanding = Math.max(0, Number.isFinite(outstanding) ? outstanding : 0);
  const safePriorArrears = Math.max(
    0,
    priorArrears !== undefined && Number.isFinite(priorArrears) ? priorArrears : 0
  );

  // Derive pending current cycle vs prior arrears
  // Arrears represents past due balance from prior cycles
  const arrearsAmount = safePriorArrears > 0 ? Math.min(safeOutstanding, safePriorArrears) : 0;
  // Pending current cycle is the current month portion awaiting payment
  const pendingCurrentAmount =
    safeOutstanding > arrearsAmount
      ? safeOutstanding - arrearsAmount
      : safeCollected < safeExpected
        ? safeExpected - safeCollected
        : 0;

  // Total denominator scale for the meter
  const totalScale = Math.max(
    safeExpected + arrearsAmount,
    safeCollected + pendingCurrentAmount + arrearsAmount,
    1
  );

  // Percentage calculations for the multi-segment bar
  const collectedPct = Math.min(100, Math.max(0, (safeCollected / totalScale) * 100));
  const pendingPct = Math.min(100 - collectedPct, Math.max(0, (pendingCurrentAmount / totalScale) * 100));
  const arrearsPct = Math.min(
    100 - collectedPct - pendingPct,
    Math.max(0, (arrearsAmount / totalScale) * 100)
  );

  // Effective rate
  const displayRate = Number.isFinite(collectionRate)
    ? Math.round(collectionRate)
    : safeExpected > 0
      ? Math.round((safeCollected / safeExpected) * 100)
      : 0;

  // Remaining to reach target
  const remainingToTarget = Math.max(0, safeExpected - safeCollected);

  // Status color for the rate badge
  const getRateBadge = () => {
    if (displayRate >= 95) {
      return {
        label: `${displayRate}% Collected`,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    }
    if (displayRate >= 75) {
      return {
        label: `${displayRate}% Collected`,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    }
    if (displayRate >= 50) {
      return {
        label: `${displayRate}% Collected`,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: `${displayRate}% Collected`,
      className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    };
  };

  const rateBadge = getRateBadge();

  return (
    <div
      role="region"
      aria-label="Monthly Rent Collection Meter"
      className={cn(
        "surface-card rounded-3xl p-6 border border-border/80 shadow-sm space-y-5 transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Header with Title, Target, and Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="size-4" />
            </span>
            <h3 className="font-display text-base font-bold text-foreground">
              Monthly Rent Collection Progress
            </h3>
          </div>
          <p className="text-xs text-muted-foreground pl-0.5">
            Current cycle progress vs expected target of{" "}
            <strong className="text-foreground font-semibold font-mono">{money(safeExpected)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge
            variant="outline"
            className={cn("text-xs font-mono font-bold px-3 py-1 border shadow-none", rateBadge.className)}
          >
            {rateBadge.label}
          </Badge>
        </div>
      </div>

      {/* Target Comparison Bar & Multi-Segment Progress Meter */}
      <div className="space-y-2">
        {/* The Multi-Segment Visual Progress Bar */}
        <div
          className="relative h-4 sm:h-5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 p-0.5 overflow-hidden flex border border-border/60 shadow-inner"
          title={`Collected: ${money(safeCollected)} · Pending: ${money(pendingCurrentAmount)} · Arrears: ${money(arrearsAmount)}`}
        >
          {/* Segment 1: Collected Rent (Emerald Safari Gradient) */}
          {safeCollected > 0 && (
            <div
              className={cn(
                "h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-1000 ease-out relative group",
                pendingPct === 0 && arrearsPct === 0 ? "rounded-full" : "rounded-l-full"
              )}
              style={{
                width: animated ? `${collectedPct}%` : "0%",
              }}
              title={`Collected: ${money(safeCollected)} (${collectedPct.toFixed(1)}%)`}
            >
              <span className="sr-only">Collected: {money(safeCollected)}</span>
            </div>
          )}

          {/* Segment 2: Pending Current Cycle (Amber Gradient) */}
          {pendingCurrentAmount > 0 && (
            <div
              className={cn(
                "h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out relative group",
                collectedPct === 0 ? "rounded-l-full" : "",
                arrearsPct === 0 ? "rounded-r-full" : ""
              )}
              style={{
                width: animated ? `${pendingPct}%` : "0%",
              }}
              title={`Pending Cycle: ${money(pendingCurrentAmount)} (${pendingPct.toFixed(1)}%)`}
            >
              <span className="sr-only">Pending Cycle: {money(pendingCurrentAmount)}</span>
            </div>
          )}

          {/* Segment 3: Outstanding / Arrears (Rose Gradient) */}
          {arrearsAmount > 0 && (
            <div
              className={cn(
                "h-full bg-gradient-to-r from-rose-600 to-rose-500 transition-all duration-1000 ease-out relative group rounded-r-full",
                collectedPct === 0 && pendingPct === 0 ? "rounded-l-full" : ""
              )}
              style={{
                width: animated ? `${arrearsPct}%` : "0%",
              }}
              title={`Arrears: ${money(arrearsAmount)} (${arrearsPct.toFixed(1)}%)`}
            >
              <span className="sr-only">Arrears: {money(arrearsAmount)}</span>
            </div>
          )}
        </div>

        {/* Target Comparison Tagline */}
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-0.5 px-0.5">
          <span className="flex items-center gap-1 font-medium">
            <Target className="size-3.5 text-primary" /> Target:{" "}
            <span className="font-mono font-bold text-foreground">{money(safeExpected)}</span>
          </span>
          <span>
            {remainingToTarget > 0 ? (
              <>
                <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                  {money(remainingToTarget)}
                </strong>{" "}
                remaining to 100% target
              </>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Target achieved for this cycle
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Breakdown Badges / Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Card 1: Collected Rent */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              Collected Rent
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-bold px-1.5 py-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
            >
              {displayRate}%
            </Badge>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-foreground font-mono">
              {money(safeCollected)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Received in current cycle
            </p>
          </div>
        </div>

        {/* Card 2: Pending Current Cycle */}
        <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
              Pending Cycle
            </span>
            <Clock className="size-3.5 text-amber-500" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-foreground font-mono">
              {money(pendingCurrentAmount)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Due before cycle closes
            </p>
          </div>
        </div>

        {/* Card 3: Prior Arrears */}
        <div className={cn(
          "p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 transition-colors",
          arrearsAmount > 0
            ? "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20"
            : "bg-muted/40 border-border/60"
        )}>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5",
              arrearsAmount > 0 ? "text-rose-700 dark:text-rose-400" : "text-muted-foreground"
            )}>
              <span className={cn(
                "size-2 rounded-full",
                arrearsAmount > 0 ? "bg-rose-500 ring-2 ring-rose-500/20" : "bg-muted-foreground/40"
              )} />
              Prior Arrears
            </span>
            <AlertCircle className={cn(
              "size-3.5",
              arrearsAmount > 0 ? "text-rose-500" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className={cn(
              "font-display text-lg font-bold font-mono",
              arrearsAmount > 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"
            )}>
              {money(arrearsAmount)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {arrearsAmount > 0 ? "Past due from earlier cycles" : "All prior cycles settled"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
