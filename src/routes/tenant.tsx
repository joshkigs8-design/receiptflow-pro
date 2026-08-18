import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Building2, Download, Loader2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { submitTenantRequest, verifyTenant } from "@/lib/portal.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/app/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/lib/theme";
import { PRIORITIES, REQUEST_CATEGORIES, money, shortDate } from "@/lib/format";
import { receiptUrl } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/tenant")({
  head: () => ({
    meta: [
      { title: "Tenant Portal — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Tenants: verify with your property code, room number and phone to view payments, download receipts and report maintenance issues.",
      },
      { property: "og:title", content: "Tenant Portal — Rent Receipt Pro" },
      { property: "og:description", content: "View your rent payments and download receipts." },
    ],
  }),
  component: TenantPortal,
});

type PortalData = Extract<Awaited<ReturnType<typeof verifyTenant>>, { ok: true }>;

function TenantPortal() {
  const verify = useServerFn(verifyTenant);
  const submit = useServerFn(submitTenantRequest);
  const [creds, setCreds] = useState({ code: "", room: "", phone: "" });
  const [portal, setPortal] = useState<PortalData | null>(null);
  const [request, setRequest] = useState({
    category: "plumbing",
    priority: "normal",
    description: "",
  });

  const login = useMutation({
    mutationFn: () => verify({ data: creds }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setPortal(res);
    },
    onError: () => toast.error("Verification failed. Check your details."),
  });

  const raise = useMutation({
    mutationFn: () => submit({ data: { ...creds, ...request } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Request sent to your landlord");
      setRequest({ category: "plumbing", priority: "normal", description: "" });
    },
    onError: () => toast.error("Could not send the request"),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold">Tenant Portal</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {!portal ? (
          <div className="surface-card mx-auto max-w-md p-8">
            <h1 className="font-display text-2xl font-bold">Verify your tenancy</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the property code from your landlord, your room number and your phone number.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                login.mutate();
              }}
            >
              <Field label="Property code" htmlFor="code">
                <Input
                  id="code"
                  required
                  maxLength={24}
                  placeholder="CB-001"
                  value={creds.code}
                  onChange={(e) => setCreds({ ...creds, code: e.target.value.toUpperCase() })}
                />
              </Field>
              <Field label="Room / unit number" htmlFor="room">
                <Input
                  id="room"
                  required
                  maxLength={40}
                  value={creds.room}
                  onChange={(e) => setCreds({ ...creds, room: e.target.value })}
                />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                <Input
                  id="phone"
                  required
                  maxLength={24}
                  placeholder="0712345678"
                  value={creds.phone}
                  onChange={(e) => setCreds({ ...creds, phone: e.target.value })}
                />
              </Field>
              <Button
                type="submit"
                className="w-full rounded-full shadow-glow"
                disabled={login.isPending}
              >
                {login.isPending ? <Loader2 className="size-4 animate-spin" /> : "View my account"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h1 className="font-display text-2xl font-bold">{portal.tenant.full_name}</h1>
                <p className="text-sm text-muted-foreground">
                  {portal.property.name} · Unit {portal.tenant.unit ?? "—"}
                  {portal.tenant.room ? ` · Room ${portal.tenant.room}` : ""}
                </p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => setPortal(null)}>
                Sign out
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground uppercase">Monthly rent</p>
                <p className="mt-3 font-display text-2xl font-bold">
                  {money(portal.tenant.rent_amount)}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground uppercase">Total paid</p>
                <p className="mt-3 font-display text-2xl font-bold text-primary">
                  {money(portal.totals.paid)}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground uppercase">Outstanding</p>
                <p className="mt-3 font-display text-2xl font-bold">
                  {money(portal.totals.outstanding)}
                </p>
              </div>
            </div>

            <section className="surface-card p-6">
              <h2 className="font-semibold">My receipts</h2>
              <ul className="mt-4 space-y-3">
                {portal.receipts.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-sm last:border-0"
                  >
                    <span>
                      <span className="block font-medium">{r.receipt_number}</span>
                      <span className="text-xs text-muted-foreground">
                        {shortDate(r.issued_at)}
                      </span>
                    </span>
                    <span className="font-semibold text-primary">{money(r.amount)}</span>
                    <a href={receiptUrl(r.public_id)} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Download className="size-3.5" /> View
                      </Button>
                    </a>
                  </li>
                ))}
                {portal.receipts.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No receipts yet.</li>
                ) : null}
              </ul>
            </section>

            <section className="surface-card p-6">
              <h2 className="font-semibold">Payment history</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground uppercase">
                    <tr>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Period</th>
                      <th className="pb-2">Method</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portal.payments.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="py-3">{shortDate(p.paid_at)}</td>
                        <td className="py-3">{p.period_label ?? "—"}</td>
                        <td className="py-3 capitalize">{p.method}</td>
                        <td className="py-3 text-right font-semibold">{money(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="surface-card p-6">
              <div className="flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                <h2 className="font-semibold">Report a maintenance issue</h2>
              </div>
              <form
                className="mt-4 grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  raise.mutate();
                }}
              >
                <Field label="Category">
                  <Select
                    value={request.category}
                    onValueChange={(v) => setRequest({ ...request, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="capitalize">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Priority">
                  <Select
                    value={request.priority}
                    onValueChange={(v) => setRequest({ ...request, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p} className="capitalize">
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Describe the issue" className="sm:col-span-2">
                  <Textarea
                    required
                    minLength={4}
                    maxLength={2000}
                    rows={4}
                    value={request.description}
                    onChange={(e) => setRequest({ ...request, description: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    className="rounded-full shadow-glow"
                    disabled={raise.isPending}
                  >
                    Send request
                  </Button>
                </div>
              </form>

              <h3 className="mt-8 font-semibold">My requests</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {portal.requests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{r.description}</span>
                    <Badge variant="secondary" className="capitalize">
                      {r.status}
                    </Badge>
                  </li>
                ))}
                {portal.requests.length === 0 ? (
                  <li className="text-muted-foreground">No requests raised.</li>
                ) : null}
              </ul>
            </section>

            <section className="surface-card p-6">
              <h2 className="font-semibold">Announcements</h2>
              <ul className="mt-4 space-y-4">
                {portal.announcements.map((a) => (
                  <li key={a.id}>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.body}</p>
                  </li>
                ))}
                {portal.announcements.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No notices right now.</li>
                ) : null}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
