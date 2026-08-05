/** Replaces undefined values with null so Postgres payloads stay well typed. */
export function clean<T extends Record<string, unknown>>(obj: T) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    out[key] = value === undefined ? null : value;
  }
  return out as { [K in keyof T]-?: Exclude<T[K], undefined> | null };
}