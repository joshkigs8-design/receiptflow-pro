type Cleaned<T> = {
  [K in keyof T]-?: undefined extends T[K] ? Exclude<T[K], undefined> | null : T[K];
};

/** Replaces undefined values with null so Postgres payloads stay well typed. */
export function clean<T extends Record<string, unknown>>(obj: T): Cleaned<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    out[key] = value === undefined ? null : value;
  }
  return out as Cleaned<T>;
}
