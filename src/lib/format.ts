export const CURRENCY = "KSh";

export function money(value: number | string | null | undefined, currency = CURRENCY) {
  const n = Number(value ?? 0);
  return `${currency} ${n.toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
}

export function shortDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const PAYMENT_METHODS = ["cash", "mpesa", "kcb", "bank", "card", "cheque"] as const;
export const PROPERTY_TYPES = [
  "residential",
  "commercial",
  "mixed",
  "apartment",
  "villa",
  "hostel",
  "office",
  "warehouse",
  "other",
] as const;
export const PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const REQUEST_CATEGORIES = [
  "plumbing",
  "electrical",
  "security",
  "cleaning",
  "appliance",
  "general",
] as const;
