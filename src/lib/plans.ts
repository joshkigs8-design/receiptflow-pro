export const PLANS = {
  monthly: { label: "Monthly", amount: 300, months: 1, blurb: "Billed every month" },
  yearly: { label: "Yearly", amount: 3000, months: 12, blurb: "2 months free vs monthly" },
} as const;

export type PlanKey = keyof typeof PLANS;
