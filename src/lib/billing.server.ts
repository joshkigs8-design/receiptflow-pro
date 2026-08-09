import { PLANS, type PlanKey } from "./plans";

export function paystackKey() {
  const key = process.env["PAYSTACK_SECRET_KEY"] ?? process.env["STRIPE_LIVE_API_KEY"];
  if (!key) throw new Error("Paystack secret key is not configured");
  return key;
}

export function accessState(row: {
  status: string;
  trial_ends_at: string;
  current_period_end: string | null;
}) {
  const now = Date.now();
  const trialEnds = new Date(row.trial_ends_at).getTime();
  const periodEnds = row.current_period_end ? new Date(row.current_period_end).getTime() : 0;
  const paidActive = periodEnds > now;
  const trialActive = !paidActive && trialEnds > now;
  return {
    active: paidActive || trialActive,
    onTrial: trialActive,
    endsAt: paidActive ? row.current_period_end : row.trial_ends_at,
    daysLeft: Math.max(0, Math.ceil(((paidActive ? periodEnds : trialEnds) - now) / 86400000)),
  };
}

export function nextPeriodEnd(current: string | null, plan: PlanKey) {
  const base =
    current && new Date(current).getTime() > Date.now() ? new Date(current) : new Date();
  const next = new Date(base);
  next.setMonth(next.getMonth() + PLANS[plan].months);
  return next.toISOString();
}
