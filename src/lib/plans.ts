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
    badge: "Best value",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
