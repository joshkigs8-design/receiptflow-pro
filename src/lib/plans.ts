export const PLANS = {
  monthly: {
    label: "Monthly",
    amount: 400,
    months: 1,
    periodLabel: "month",
    blurb: "Billed every month",
    badge: null,
  },
  quarterly: {
    label: "Quarterly",
    amount: 1100,
    months: 3,
    periodLabel: "3 months",
    blurb: "Billed every 3 months",
    badge: "Save KSh 100",
  },
  semiannual: {
    label: "Half Year",
    amount: 2100,
    months: 6,
    periodLabel: "6 months",
    blurb: "Billed every 6 months",
    badge: "Save KSh 300",
  },
  yearly: {
    label: "Yearly",
    amount: 4000,
    months: 12,
    periodLabel: "year",
    blurb: "Billed annually",
    badge: "Best Value",
  },
  concierge_setup: {
    label: "VIP Data Entry Setup",
    amount: 2500,
    months: 1,
    periodLabel: "one-time setup",
    blurb: "Send your Excel / WhatsApp list — our team enters and verifies all units, tenants & balances for you",
    badge: "Done-For-You",
  },
  concierge_annual: {
    label: "VIP Annual + Full Setup",
    amount: 5500,
    months: 12,
    periodLabel: "year",
    blurb: "1-Year Subscription + Complete Done-For-You Data Entry & Onboarding for all properties & caretakers",
    badge: "VIP All-Inclusive",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
