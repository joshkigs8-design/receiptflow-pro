export const PLANS = {
  monthly: {
    label: "Monthly",
    amount: 400,
    regularAmount: 1200,
    months: 1,
    periodLabel: "month",
    blurb: "Flexible month-to-month property management. Special KSh 400 welcome offer for first-time users!",
    badge: "First-Time Offer: 67% OFF",
    savingsText: "Save KSh 800 on your first month",
  },
  quarterly: {
    label: "Quarterly",
    amount: 1100,
    regularAmount: 3200,
    months: 3,
    periodLabel: "3 months",
    blurb: "Billed every 3 months • Great for quarterly rent cycles",
    badge: "Save KSh 2,100",
    savingsText: "Save KSh 2,100 on first checkout",
  },
  semiannual: {
    label: "Half Year",
    amount: 2100,
    regularAmount: 6000,
    months: 6,
    periodLabel: "6 months",
    blurb: "Billed every 6 months • Ideal for multi-unit blocks",
    badge: "Save KSh 3,900",
    savingsText: "Save KSh 3,900 on first checkout",
  },
  yearly: {
    label: "Yearly",
    amount: 4000,
    regularAmount: 10800,
    months: 12,
    periodLabel: "year",
    blurb: "Billed annually • Best value for property managers & estates",
    badge: "Best Value — 63% OFF",
    savingsText: "Save KSh 6,800 on your first year",
  },
  concierge_setup: {
    label: "VIP Data Entry Setup",
    amount: 2500,
    regularAmount: 5000,
    months: 1,
    periodLabel: "one-time setup",
    blurb: "Send your Excel / WhatsApp list — our team enters and verifies all units, tenants & balances for you",
    badge: "Done-For-You",
    savingsText: "50% OFF Data Migration",
  },
  concierge_annual: {
    label: "VIP Annual + Full Setup",
    amount: 5500,
    regularAmount: 14000,
    months: 12,
    periodLabel: "year",
    blurb: "1-Year Subscription + Complete Done-For-You Data Entry & Onboarding for all properties & caretakers",
    badge: "VIP All-Inclusive",
    savingsText: "Save KSh 8,500 on all-in-one package",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/**
 * Returns the effective checkout price for a user.
 * First-time users (no prior successful subscription payment) get the welcome promotional price (e.g. KSh 400/mo).
 * Renewing / existing subscribers pay the standard subscription rate (e.g. KSh 1,200/mo).
 */
export function getPlanPrice(planKey: PlanKey, isFirstTime: boolean): number {
  const plan = PLANS[planKey];
  return isFirstTime ? plan.amount : plan.regularAmount;
}

