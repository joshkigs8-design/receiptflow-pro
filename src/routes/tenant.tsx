import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  Megaphone,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
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
          "Official Tenant Portal: verify your tenancy, track rent payments, download official verified PDF receipts, and submit maintenance requests.",
      },
      { property: "og:title", content: "Tenant Portal — Rent Receipt Pro" },
      { property: "og:description", content: "View rent status, download PDF receipts and submit maintenance requests." },
    ],
  }),
  component: TenantPortal,
});

type PortalData = Extract<Awaited<ReturnType<typeof verifyTenant>>, { ok: true }>;

const LOCAL_STORAGE_KEY = "rrp_tenant_creds";

export function TenantPortal() {
  const verify = useServerFn(verifyTenant);
  const submit = useServerFn(submitTenantRequest);

  const [creds, setCreds] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { code: "", room: "", phone: "" };
  });

  const [portal, setPortal] = useState<PortalData | null>(null);
  const [request, setRequest] = useState({
    category: "plumbing",
    priority: "normal",
    description: "",
  });

  const login = useMutation({
    mutationFn: (overrideCreds?: { code: string; room: string; phone: string }) =>
      verify({ data: overrideCreds || creds }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setPortal(res);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(creds));
      }
      toast.success(`Welcome back, ${res.tenant.full_name}!`);
    },
    onError: () => toast.error("Verification failed. Please verify your property code, room, and phone number."),
  });

  // Auto-login if valid credentials exist
  useEffect(() => {
    if (creds.code && creds.room && creds.phone && !portal && !login.isPending) {
      login.mutate(creds);
    }
  }, []);

  const raise = useMutation({
    mutationFn: () => submit({ data: { ...creds, ...request } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Maintenance request sent to your landlord!");
      setRequest({ category: "plumbing", priority: "normal", description: "" });
      // Re-verify to refresh request list
      login.mutate(creds);
    },
    onError: () => toast.error("Could not send the request. Please try again."),
  });

  function handleSignOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setPortal(null);
    setCreds({ code: "", room: "", phone: "" });
    toast.info("Signed out of Tenant Portal");
  }

  function shareReceiptWhatsApp(receiptNumber: string, publicId: string, amount: number) {
    const url = receiptUrl(publicId);
    const message = encodeURIComponent(
      `Hello, here is my official RentReceiptPro verified rent receipt (${receiptNumber}) for ${money(amount)}:\n${url}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Building2 className="size-5 text-primary-foreground" />
          </span>
          <div>
            <span className="font-display font-bold text-base block">Tenant Portal</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">RentReceiptPro Digital Portal</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {portal ? (
            <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs gap-1.5" onClick={handleSignOut}>
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {!portal ? (
          /* Login / Verification Screen */
          <div className="relative mx-auto max-w-md">
            <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-2xl" />
            <div className="surface-card relative p-8 sm:p-10 rounded-3xl border border-border/80 shadow-2xl space-y-6">
              <div className="space-y-2 text-center">
                <span className="gradient-primary mx-auto flex size-12 items-center justify-center rounded-2xl shadow-glow">
                  <KeyRound className="size-6 text-primary-foreground" />
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight mt-3">Access Tenant Portal</h1>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Verify with your property code, room / unit number, and registered phone number.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  login.mutate(creds);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="code">Property Code</Label>
                  <Input
                    id="code"
                    required
                    maxLength={24}
                    placeholder="e.g. CB-001"
                    value={creds.code}
                    onChange={(e) => setCreds({ ...creds, code: e.target.value.toUpperCase() })}
                    className="font-mono uppercase font-bold tracking-wider h-11 rounded-2xl"
                  />
                  <p className="text-[11px] text-muted-foreground">Provided by your landlord / estate manager.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room / Unit Number</Label>
                  <Input
                    id="room"
                    required
                    maxLength={40}
                    placeholder="e.g. A4, 102, or Room 5"
                    value={creds.room}
                    onChange={(e) => setCreds({ ...creds, room: e.target.value })}
                    className="h-11 rounded-2xl font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    required
                    maxLength={24}
                    placeholder="e.g. 0712345678"
                    value={creds.phone}
                    onChange={(e) => setCreds({ ...creds, phone: e.target.value })}
                    className="font-mono h-11 rounded-2xl font-semibold"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full shadow-glow font-bold h-11 mt-2 text-sm"
                  disabled={login.isPending}
                >
                  {login.isPending ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <UserCheck className="size-4 mr-1.5" />}
                  View My Tenancy &amp; Receipts
                </Button>
              </form>

              <div className="pt-4 border-t border-border/60 text-center">
                <p className="text-xs text-muted-foreground">
                  Are you a landlord or property manager?{" "}
                  <Link to="/auth" className="font-semibold text-primary hover:underline">
                    Sign in here →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Tenant Portal Active Dashboard */
          <div className="space-y-6">
            {/* Top Tenancy Identity Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      {portal.tenant.full_name}
                    </h1>
                    <Badge variant="outline" className="font-mono text-xs uppercase text-primary border-primary/30">
                      Tenant
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <strong>{portal.property.name}</strong> · Unit {portal.tenant.unit || portal.tenant.room || "—"}
                    {portal.tenant.floor ? ` (Floor ${portal.tenant.floor})` : ""}
                  </p>
                  {portal.property.address ? (
                    <p className="text-xs text-muted-foreground">{portal.property.address}</p>
                  ) : null}
                </div>

                {/* Live Rent Status Pill */}
                <div className="sm:text-right space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    This Month's Rent Status
                  </span>
                  <div className="inline-flex items-center gap-2">
                    {portal.totals.status === "PAID" ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm">
                        <CheckCircle2 className="size-4" /> PAID IN FULL
                      </span>
                    ) : portal.totals.status === "PARTIAL" ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-sm">
                        <Clock className="size-4" /> PARTIAL ({money(portal.totals.rentBalance)} due)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-sm">
                        <AlertCircle className="size-4" /> UNPAID / DUE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-medium">Monthly Rent</p>
                <p className="mt-2 font-display text-2xl font-bold">{money(portal.tenant.rent_amount)}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Standard monthly rate</p>
              </div>

              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-medium">Paid This Month</p>
                <p className="mt-2 font-display text-2xl font-bold text-emerald-500">
                  {money(portal.totals.paidThisMonth)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Recorded for active period</p>
              </div>

              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-medium">Balance Due</p>
                <p className={`mt-2 font-display text-2xl font-bold ${portal.totals.rentBalance > 0 ? "text-rose-500" : "text-foreground"}`}>
                  {money(portal.totals.rentBalance)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Remaining for this cycle</p>
              </div>

              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-medium">Deposit on Record</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">
                  {money(portal.tenant.deposit_paid)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Security deposit held</p>
              </div>
            </div>

            {/* Landlord Payment & Contact Instructions */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1">
                    <Wallet className="size-3.5" /> Landlord Payment &amp; Inquiries
                  </span>
                  <h3 className="font-display text-lg font-bold mt-1">
                    {portal.landlord.company_name} ({portal.landlord.full_name})
                  </h3>
                </div>

                {portal.landlord.phone ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full gap-1.5 text-xs h-9"
                      onClick={() => window.open(`tel:${portal.landlord.phone}`, "_self")}
                    >
                      <PhoneCall className="size-3.5 text-emerald-500" /> Call Landlord
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${portal.landlord.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello, this is ${portal.tenant.full_name} from ${portal.property.name} Unit ${portal.tenant.unit || portal.tenant.room}.`
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      <MessageCircle className="size-3.5" /> WhatsApp
                    </Button>
                  </div>
                ) : null}
              </div>

              {portal.landlord.business_details ? (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs sm:text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {portal.landlord.business_details}
                </div>
              ) : null}
            </div>

            {/* Official Receipts Section */}
            <section className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="font-display text-lg font-bold flex items-center gap-2">
                    <FileCheck2 className="size-5 text-primary" /> Official Rent Receipts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Digitally verified rent receipts stamped by RentReceiptPro
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{portal.receipts.length} Issued</Badge>
              </div>

              {portal.receipts.length ? (
                <div className="divide-y divide-border/60">
                  {portal.receipts.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-foreground">{r.receipt_number}</span>
                          <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                            Verified
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="size-3.5" /> Issued on {shortDate(r.issued_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-display text-lg font-bold text-primary">{money(r.amount)}</span>
                        <a href={receiptUrl(r.public_id)} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs gap-1.5">
                            <Download className="size-3.5" /> PDF
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 px-3 text-xs gap-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                          onClick={() => shareReceiptWhatsApp(r.receipt_number, r.public_id, Number(r.amount))}
                        >
                          <Share2 className="size-3.5" /> Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No receipts issued yet. When your landlord logs payments, receipts appear here instantly." />
              )}
            </section>

            {/* Payment History Table */}
            <section className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Receipt className="size-5 text-primary" /> Complete Payment History
              </h2>
              {portal.payments.length ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-[650px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference / Code</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portal.payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs font-mono">{shortDate(p.paid_at)}</TableCell>
                          <TableCell className="text-xs font-semibold">{p.period_label || "—"}</TableCell>
                          <TableCell className="text-xs capitalize font-medium">{p.method || p.payment_method || "M-Pesa"}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground select-all">
                            {p.reference || p.reference_number || "—"}
                          </TableCell>
                          <TableCell className="text-right font-display text-sm font-bold text-emerald-500">
                            {money(p.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState title="No payment records found." />
              )}
            </section>

            {/* Maintenance Requests Hub */}
            <section className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <Wrench className="size-5 text-primary" /> Report a Maintenance Issue
                </h2>
                <p className="text-xs text-muted-foreground">
                  Submit maintenance requests directly to your landlord for quick resolution.
                </p>
              </div>

              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  raise.mutate();
                }}
              >
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={request.category}
                    onValueChange={(v) => setRequest({ ...request, category: v })}
                  >
                    <SelectTrigger className="h-10 rounded-2xl capitalize">
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
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select
                    value={request.priority}
                    onValueChange={(v) => setRequest({ ...request, priority: v })}
                  >
                    <SelectTrigger className="h-10 rounded-2xl capitalize">
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
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Describe the Issue in Detail *</Label>
                  <Textarea
                    required
                    minLength={6}
                    maxLength={2000}
                    rows={4}
                    placeholder="e.g. Water leak under the kitchen sink tap since yesterday morning..."
                    value={request.description}
                    onChange={(e) => setRequest({ ...request, description: e.target.value })}
                    className="rounded-2xl resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    className="rounded-full shadow-glow font-semibold h-10 px-6"
                    disabled={raise.isPending || !request.description.trim()}
                  >
                    {raise.isPending ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Wrench className="size-4 mr-1.5" />}
                    Submit Maintenance Ticket
                  </Button>
                </div>
              </form>

              {/* Maintenance Tickets List */}
              <div className="pt-6 border-t border-border/80 space-y-3">
                <h3 className="font-display text-sm font-bold flex items-center gap-1.5">
                  <Clock className="size-4 text-muted-foreground" /> Your Submitted Tickets
                </h3>
                {portal.requests.length ? (
                  <div className="space-y-2.5">
                    {portal.requests.map((r) => (
                      <div
                        key={r.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold uppercase tracking-wider text-primary text-[11px]">
                              {r.category}
                            </span>
                            <span className="text-muted-foreground font-mono">· {shortDate(r.created_at)}</span>
                          </div>
                          <p className="text-foreground text-sm font-medium leading-relaxed">{r.description}</p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <Badge
                            variant={
                              r.status === "resolved"
                                ? "default"
                                : r.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize text-[11px]"
                          >
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No maintenance tickets raised.</p>
                )}
              </div>
            </section>

            {/* Landlord Noticeboard / Announcements */}
            <section className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Megaphone className="size-5 text-primary" /> Noticeboard &amp; Announcements
              </h2>
              {portal.announcements.length ? (
                <div className="space-y-3">
                  {portal.announcements.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">{a.title}</p>
                        <span className="text-[11px] text-muted-foreground font-mono">{shortDate(a.created_at)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{a.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">No announcements posted right now.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
