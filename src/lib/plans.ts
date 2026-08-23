export const PLANS = {
  monthly: { label: "Monthly", amount: 400, months: 1, blurb: "Billed every month" },
  yearly: { label: "Yearly", amount: 4000, months: 12, blurb: "2 months free vs monthly" },
} as const;

export type PlanKey = keyof typeof PLANS;
