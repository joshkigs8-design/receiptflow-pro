import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  Copy,
  Gift,
  Loader2,
  LogOut,
  Plus,
  Power,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/lib/theme";
import {
  createVoucher,
  deleteVoucher,
  getAdminOverview,
  getIsAdmin,
  grantAccess,
  listVouchers,
  setVoucherActive,
} from "@/lib/admin.functions";
import { money, shortDate } from "@/lib/format";

const title = "Owner Admin Portal — Rent Receipt Pro";
const description =
  "Private owner control centre for Rent Receipt Pro: landlord accounts, subscription revenue, voucher codes and manual access grants.";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoute,
});

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "RRP-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const stateStyles: Record<string, string> = {
  paid: "gradient-primary text-primary-foreground shadow-glow",
  trial: "bg-primary/15 text-primary",
  expired: "bg-muted text-muted-foreground",
};

function AdminFrame({ children, onSignOut }: { children: ReactNode; onSignOut?: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
        <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-bold">Owner Admin Portal</p>
          <p className="truncate text-xs text-muted-foreground">
            Codevanta Ventures · Rent Receipt Pro
          </p>
        </div>
        <ThemeToggle />
        {onSignOut ? (
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onSignOut}>
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

function AdminSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSignedIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function createOwner() {
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: { full_name: "Owner", company_name: "Codevanta Ventures" },
        },
      });
      if (error) throw error;
      if (!data.session) {
        toast.success("Confirm the link we emailed you, then sign in here.");
        return;
      }
      onSignedIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the owner account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="surface-card relative w-full max-w-md p-8">
        <span className="gradient-primary flex size-11 items-center justify-center rounded-xl shadow-glow">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Owner admin sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Private entrance to the Codevanta Ventures admin portal.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Owner email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full rounded-full shadow-glow" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Enter admin portal"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            disabled={busy}
            onClick={createOwner}
          >
            First time? Create the owner account
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminRoute() {
  const qc = useQueryClient();
  const checkAdmin = useServerFn(getIsAdmin);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      setSignedIn(Boolean(data.user));
      return { user: Boolean(data.user) };
    },
  });

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkAdmin(),
    enabled: signedIn === true,
    retry: false,
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    setSignedIn(false);
  }

  if (signedIn === null) {
    return (
      <AdminFrame>
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AdminFrame>
    );
  }

  if (signedIn === false) {
    return (
      <AdminSignIn
        onSignedIn={async () => {
          setSignedIn(true);
          await qc.invalidateQueries();
        }}
      />
    );
  }

  if (roleLoading) {
    return (
      <AdminFrame onSignOut={signOut}>
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AdminFrame>
    );
  }

  if (!role?.admin) {
    return (
      <AdminFrame onSignOut={signOut}>
        <div className="surface-card mx-auto max-w-md p-10 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
            <ShieldAlert className="size-6 text-muted-foreground" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">Owner access only</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This portal is limited to Codevanta Ventures administrators. Sign out and use the owner
            account.
          </p>
        </div>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame onSignOut={signOut}>
      <AdminDashboard />
    </AdminFrame>
  );
}

function AdminDashboard() {
  const qc = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);
  const fetchVouchers = useServerFn(listVouchers);
  const addVoucher = useServerFn(createVoucher);
  const toggleVoucher = useServerFn(setVoucherActive);
  const removeVoucher = useServerFn(deleteVoucher);
  const extend = useServerFn(grantAccess);

  const [code, setCode] = useState(randomCode);
  const [months, setMonths] = useState("1");
  const [maxUses, setMaxUses] = useState("1");
  const [expires, setExpires] = useState("");
  const [note, setNote] = useState("");

  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: () => fetchOverview() });
  const { data: vouchers } = useQuery({
    queryKey: ["admin-vouchers"],
    queryFn: () => fetchVouchers(),
  });

  const create = useMutation({
    mutationFn: () =>
      addVoucher({
        data: {
          code,
          months: Number(months) || 1,
          max_uses: Number(maxUses) || 1,
          expires_at: expires || null,
          note: note || null,
        },
      }),
    onSuccess: async () => {
      toast.success(`Voucher ${code.toUpperCase()} created`);
      setCode(randomCode());
      setNote("");
      setExpires("");
      await qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create voucher"),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => toggleVoucher({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vouchers"] }),
  });
  const del = useMutation({
    mutationFn: (id: string) => removeVoucher({ data: { id } }),
    onSuccess: () => {
      toast.success("Voucher deleted");
      qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
  });
  const grant = useMutation({
    mutationFn: (v: { userId: string; months: number }) => extend({ data: v }),
    onSuccess: (res) => {
      toast.success(`Access extended to ${shortDate(res.endsAt)}`);
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not extend access"),
  });

  const stats = data?.stats;
  const cards = [
    { label: "Landlords", value: stats?.landlords ?? 0, icon: Users },
    { label: "Paying", value: stats?.paying ?? 0, icon: BadgeCheck },
    { label: "On trial", value: stats?.onTrial ?? 0, icon: CalendarClock },
    { label: "Expired", value: stats?.expired ?? 0, icon: ShieldAlert },
    { label: "Subscription revenue", value: money(stats?.revenue ?? 0), icon: TrendingUp },
    { label: "Properties", value: stats?.properties ?? 0, icon: Building2 },
    { label: "Tenants", value: stats?.tenants ?? 0, icon: Users },
    { label: "Rent tracked", value: money(stats?.rentTracked ?? 0), icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <c.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="landlords">
        <TabsList>
          <TabsTrigger value="landlords">Landlords</TabsTrigger>
          <TabsTrigger value="vouchers">Voucher codes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="landlords" className="mt-5">
          <div className="surface-card overflow-x-auto p-5">
            {data?.landlords.length ? (
              <table className="w-full min-w-[900px] text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Account</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Access until</th>
                    <th className="pb-3">Portfolio</th>
                    <th className="pb-3">Rent tracked</th>
                    <th className="pb-3 text-right">Grant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.landlords.map((l) => (
                    <tr key={l.id} className="border-t border-border">
                      <td className="py-3">
                        <p className="font-medium">{l.full_name ?? l.email}</p>
                        <p className="text-xs text-muted-foreground">{l.email}</p>
                        {l.phone ? (
                          <p className="text-xs text-muted-foreground">{l.phone}</p>
                        ) : null}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${stateStyles[l.state]}`}
                        >
                          {l.state}
                        </span>
                      </td>
                      <td className="py-3 capitalize">{l.plan}</td>
                      <td className="py-3">{shortDate(l.endsAt)}</td>
                      <td className="py-3 text-muted-foreground">
                        {l.properties} props · {l.tenants} tenants
                      </td>
                      <td className="py-3">{money(l.rentCollected)}</td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-1.5">
                          {[1, 12].map((m) => (
                            <Button
                              key={m}
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              disabled={grant.isPending}
                              onClick={() => grant.mutate({ userId: l.id, months: m })}
                            >
                              +{m}m
                            </Button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No landlord accounts yet" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="vouchers" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
            <div className="surface-card p-6">
              <h3 className="flex items-center gap-2 font-display text-base font-bold">
                <Gift className="size-4 text-primary" /> Create a voucher
              </h3>
              <div className="mt-5 space-y-4">
                <Field label="Code" htmlFor="code">
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={() => setCode(randomCode())}>
                      New
                    </Button>
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Free months" htmlFor="months">
                    <Input
                      id="months"
                      type="number"
                      min={1}
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                    />
                  </Field>
                  <Field label="Max uses" htmlFor="uses">
                    <Input
                      id="uses"
                      type="number"
                      min={1}
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Expires (optional)" htmlFor="expires">
                  <Input
                    id="expires"
                    type="date"
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                  />
                </Field>
                <Field label="Note (optional)" htmlFor="note">
                  <Input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Promo for Nakuru landlords"
                  />
                </Field>
                <Button
                  className="w-full rounded-full shadow-glow"
                  disabled={create.isPending}
                  onClick={() => create.mutate()}
                >
                  {create.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="size-4" /> Create voucher
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="surface-card overflow-x-auto p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold">
                <Ticket className="size-4 text-primary" /> Vouchers
              </h3>
              {vouchers?.length ? (
                <table className="mt-4 w-full min-w-[620px] text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="pb-3">Code</th>
                      <th className="pb-3">Months</th>
                      <th className="pb-3">Used</th>
                      <th className="pb-3">Expires</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map((v) => (
                      <tr key={v.id} className="border-t border-border">
                        <td className="py-3">
                          <button
                            className="inline-flex items-center gap-1.5 font-mono font-semibold hover:text-primary"
                            onClick={() => {
                              void navigator.clipboard.writeText(v.code);
                              toast.success("Code copied");
                            }}
                          >
                            {v.code} <Copy className="size-3.5" />
                          </button>
                          {v.note ? (
                            <p className="text-xs text-muted-foreground">{v.note}</p>
                          ) : null}
                        </td>
                        <td className="py-3">{v.months}</td>
                        <td className="py-3">
                          {v.used_count}/{v.max_uses}
                        </td>
                        <td className="py-3">{v.expires_at ? shortDate(v.expires_at) : "—"}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              v.active && v.used_count < v.max_uses
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {v.active
                              ? v.used_count < v.max_uses
                                ? "Active"
                                : "Used up"
                              : "Paused"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Toggle voucher"
                              onClick={() => toggle.mutate({ id: v.id, active: !v.active })}
                            >
                              <Power className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Delete voucher"
                              onClick={() => del.mutate(v.id)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No vouchers yet — create one to give a landlord free months.
                </p>
              )}

              {data?.redemptions.length ? (
                <div className="mt-8">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Recent redemptions
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm">
                    {data.redemptions.map((r) => (
                      <li key={r.id} className="flex justify-between border-t border-border pt-2">
                        <span>{r.email}</span>
                        <span className="text-muted-foreground">
                          {r.months} month{r.months === 1 ? "" : "s"} · {shortDate(r.created_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-5">
          <div className="surface-card overflow-x-auto p-5">
            {data?.payments.length ? (
              <table className="w-full min-w-[700px] text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Account</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="py-3">{shortDate(p.paid_at ?? p.created_at)}</td>
                      <td className="py-3">{p.email}</td>
                      <td className="py-3 capitalize">{p.plan}</td>
                      <td className="py-3">{money(p.amount)}</td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {p.reference}
                      </td>
                      <td className="py-3 capitalize">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No subscription payments yet" />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
