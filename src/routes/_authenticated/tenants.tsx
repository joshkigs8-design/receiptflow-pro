import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteTenant,
  listPayments,
  listProperties,
  listTenants,
  listUnits,
  saveTenant,
} from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { money, shortDate, CURRENCY } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/tenants")({
  head: () => ({
    meta: [
      { title: "Tenants — Rent Receipt Pro" },
      {
        name: "description",
        content: "Tenant profiles, leases, rent amounts and contact details.",
      },
      { property: "og:title", content: "Tenants — Rent Receipt Pro" },
      { property: "og:description", content: "Manage tenant profiles and leases." },
    ],
  }),
  component: TenantsPage,
});

type Draft = {
  id?: string;
  property_id: string;
  unit_id: string;
  full_name: string;
  phone: string;
  email: string;
  national_id: string;
  occupation: string;
  emergency_contact: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  deposit_paid: number;
  status: string;
};

const blank: Draft = {
  property_id: "",
  unit_id: "",
  full_name: "",
  phone: "",
  email: "",
  national_id: "",
  occupation: "",
  emergency_contact: "",
  lease_start: "",
  lease_end: "",
  rent_amount: 0,
  deposit_paid: 0,
  status: "active",
};

function TenantsPage() {
  const qc = useQueryClient();
  const fetchTenants = useServerFn(listTenants);
  const fetchProperties = useServerFn(listProperties);
  const fetchUnits = useServerFn(listUnits);
  const fetchPayments = useServerFn(listPayments);
  const save = useServerFn(saveTenant);
  const remove = useServerFn(deleteTenant);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);
  const [rentalPeriod, setRentalPeriod] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });
  const [periodLabel, setPeriodLabel] = useState<string>("Current month");
  const [filter, setFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  
  // Pre-compute month options for the selector
  const monthOptions = useMemo(() => {
    const options = [];
    // Current month
    options.push({
      value: new Date().toISOString().slice(0, 7),
      label: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    });
    // Last 5 months
    for (let i = 1; i <= 5; i++) {
      const d = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
      options.push({
        value: d.toISOString().slice(0, 7),
        label: d.toLocaleDateString("en-GB", { month: "long" }) + " " + d.getFullYear(),
      });
    }
    return options;
  }, []);

  const tenants = useQuery({ queryKey: ["tenants"], queryFn: () => fetchTenants() });
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => fetchProperties() });
  const units = useQuery({
    queryKey: ["units", draft.property_id],
    queryFn: () => fetchUnits({ data: { propertyId: draft.property_id } }),
    enabled: Boolean(draft.property_id),
  });

  const payments = useQuery({ queryKey: ["payments"], queryFn: () => fetchPayments() });

  const selectedPeriod = useMemo(() => rentalPeriod, [rentalPeriod]);

  const rentStatuses = useMemo(() => {
    const rows = tenants.data ?? [];
    const period = selectedPeriod;
    const statuses: Record<string, {
      paidThisPeriod: number;
      monthlyRent: number;
      balance: number;
      totalBalance: number;
      thisPeriodBalance: number;
      priorArrears: number;
      status: "PAID" | "PARTIAL" | "UNPAID" | "ARREARS";
    }> = {};

    const allPayments = payments.data ?? [];

    rows.forEach((t) => {
      const monthlyRent = Number(t.rent_amount ?? 0);
      let paidThisPeriod = 0;
      let totalPaidAllTime = 0;

      // Calculate how many months the tenant has been active up to the selected period
      const startMonth = (t.lease_start || t.created_at || period).slice(0, 7);
      let monthsElapsed = 1;
      try {
        const sY = parseInt(startMonth.slice(0, 4));
        const sM = parseInt(startMonth.slice(5, 7));
        const pY = parseInt(period.slice(0, 4));
        const pM = parseInt(period.slice(5, 7));
        monthsElapsed = Math.max((pY - sY) * 12 + (pM - sM) + 1, 1);
      } catch {}

      allPayments.forEach((p: any) => {
        const pTenantId = p.tenant_id ?? "";
        if (pTenantId !== t.id) return;

        const pPeriod = (p.period_label || "").trim().toLowerCase();
        const paidAtMonth = (p.paid_at || "").slice(0, 7);
        const pAmount = Number(p.amount ?? 0);
        if (pAmount <= 0) return;

        totalPaidAllTime += pAmount;

        let selectedMonthLower = "";
        let selectedShortMonth = "";
        try {
          const d = new Date(period + "-01");
          selectedMonthLower = d.toLocaleDateString("en-GB", { month: "long" }).toLowerCase();
          selectedShortMonth = d.toLocaleDateString("en-GB", { month: "short" }).toLowerCase();
        } catch {}
        const selectedYear = period.slice(0, 4);

        const matchesPeriod =
          pPeriod === period ||
          pPeriod.startsWith(period) ||
          paidAtMonth === period ||
          (selectedMonthLower && pPeriod.includes(selectedMonthLower) && pPeriod.includes(selectedYear)) ||
          (selectedShortMonth && pPeriod.includes(selectedShortMonth) && pPeriod.includes(selectedYear)) ||
          (!pPeriod && paidAtMonth === period);

        if (matchesPeriod) {
          paidThisPeriod += pAmount;
        }
      });

      // Total rent accrued up to this period:
      const totalRentAccrued = monthsElapsed * monthlyRent;
      // Total balance outstanding across their entire lease/stay:
      const totalBalance = Math.max(totalRentAccrued - totalPaidAllTime, 0);
      // Unpaid portion of the currently selected month:
      const thisPeriodBalance = Math.max(monthlyRent - paidThisPeriod, 0);
      // Unpaid arrears carried forward from previous months:
      const priorArrears = Math.max(totalBalance - thisPeriodBalance, 0);

      let status: "PAID" | "PARTIAL" | "UNPAID" | "ARREARS";
      if (totalBalance <= 0) {
        status = "PAID";
      } else if (priorArrears > 0) {
        status = "ARREARS";
      } else if (paidThisPeriod > 0) {
        status = "PARTIAL";
      } else {
        status = "UNPAID";
      }

      statuses[t.id] = {
        paidThisPeriod,
        monthlyRent,
        balance: totalBalance, // Full balance shows the true remaining debt
        totalBalance,
        thisPeriodBalance,
        priorArrears,
        status,
      };
    });

    return statuses;
  }, [tenants.data, selectedPeriod, payments.data]);

  const filtered = useMemo(() => {
    const rows = tenants.data ?? [];
    if (!term.trim() && filter === "all") return rows;
    const q = term.toLowerCase().trim();
    return rows.filter(
      (t) =>
        (filter === "all"
          ? true
          : filter === "paid"
            ? rentStatuses[t.id]?.status === "PAID"
            : filter === "partial"
              ? rentStatuses[t.id]?.status === "PARTIAL"
              : filter === "unpaid"
                ? rentStatuses[t.id]?.status === "UNPAID"
                : filter === "arrears"
                  ? rentStatuses[t.id]?.status === "ARREARS"
                  : true) &&
        (t.full_name.toLowerCase().includes(q) ||
          t.phone.includes(q) ||
          (t.properties?.name ?? "").toLowerCase().includes(q)),
    );
  }, [tenants.data, term, filter, rentStatuses]);
  const expectedTotal = useMemo(() => {
    return Object.values(rentStatuses).reduce(
      (s, { monthlyRent }) => s + monthlyRent,
      0,
    );
  }, [rentStatuses]);

  const collectedTotal = useMemo(() => {
    return Object.values(rentStatuses).reduce(
      (s, { paidThisPeriod }) => s + paidThisPeriod,
      0,
    );
  }, [rentStatuses]);

  const outstandingTotal = useMemo(() => {
    return Object.values(rentStatuses).reduce(
      (s, item) => s + item.totalBalance,
      0,
    );
  }, [rentStatuses]);

  const paidCount = useMemo(() => {
    return Object.values(rentStatuses).filter(
      (s) => s.status === "PAID",
    ).length;
  }, [rentStatuses]);

  const partialCount = useMemo(() => {
    return Object.values(rentStatuses).filter(
      (s) => s.status === "PARTIAL",
    ).length;
  }, [rentStatuses]);

  const unpaidCount = useMemo(() => {
    return Object.values(rentStatuses).filter(
      (s) => s.status === "UNPAID",
    ).length;
  }, [rentStatuses]);

  const arrearsCount = useMemo(() => {
    return Object.values(rentStatuses).filter(
      (s) => s.status === "ARREARS",
    ).length;
  }, [rentStatuses]);

  const saveMutation = useMutation({
    mutationFn: (d: Draft) =>
      save({
        data: {
          ...d,
          property_id: d.property_id || null,
          unit_id: d.unit_id || null,
          email: d.email || null,
        },
      }),
    onSuccess: () => {
      toast.success("Tenant saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["tenants"] });
      qc.invalidateQueries({ queryKey: ["units"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save tenant"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Tenant removed");
      qc.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: () => toast.error("Could not remove tenant"),
  });

  return (
    <AppShell
      title="Tenants"
      description="Profiles, leases and rent per tenant"
      actions={
        <Button
          size="sm"
          className="rounded-full shadow-glow"
          onClick={() => {
            setDraft(blank);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add tenant
        </Button>
      }
    >
<div className="relative mb-6 max-w-sm">
        <Select
          value={rentalPeriod}
          onValueChange={(v) => {
            setRentalPeriod(v);
            setPeriodLabel(
              v ? `${v.replace("-", " ")}` : "Current month"
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Current month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Expected</p>
          <p className="mt-1 font-display text-xl font-bold">{money(expectedTotal, CURRENCY)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Collected</p>
          <p className="mt-1 font-display text-xl font-bold">{money(collectedTotal, CURRENCY)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Outstanding</p>
          <p className="mt-1 font-display text-xl font-bold">{money(outstandingTotal, CURRENCY)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">Tenants</p>
          <p className="mt-1 font-display text-xl font-bold">{filtered.length}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
        <Button
          size="sm"
          variant={filter === "paid" ? "default" : "outline"}
          className="rounded-full text-xs"
          onClick={() => setFilter("paid")}
        >
          Paid {paidCount}
        </Button>
        <Button
          size="sm"
          variant={filter === "partial" ? "default" : "outline"}
          className="rounded-full text-xs"
          onClick={() => setFilter("partial")}
        >
          Partial {partialCount}
        </Button>
        <Button
          size="sm"
          variant={filter === "unpaid" ? "default" : "outline"}
          className="rounded-full text-xs text-destructive"
          onClick={() => setFilter("unpaid")}
        >
          Unpaid {unpaidCount}
        </Button>
        <Button
          size="sm"
          variant={filter === "arrears" ? "default" : "outline"}
          className="rounded-full text-xs text-amber-600 dark:text-amber-400 border-amber-500/40"
          onClick={() => setFilter("arrears")}
        >
          In Arrears {arrearsCount}
        </Button>
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          className="rounded-full text-xs"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search name, phone or property"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          maxLength={80}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tenants found" hint="Add a tenant and assign them to a unit." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <article key={t.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{t.full_name}</h2>
                  <p className="text-xs text-muted-foreground">{t.phone}</p>
                </div>
                <Badge
                  variant={t.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {t.status}
                </Badge>
              </div>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Property</dt>
                  <dd className="truncate">{t.properties?.name ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Unit / room</dt>
                  <dd>
                    {t.units?.unit_number ?? "—"}
                    {t.units?.room_number ? ` · ${t.units.room_number}` : ""}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Monthly Rent</dt>
                  <dd className="font-semibold">{money(t.rent_amount)}</dd>
                </div>
<div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Lease ends</dt>
                  <dd>{shortDate(t.lease_end)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Paid this period</dt>
                  <dd className="font-medium">{money(rentStatuses[t.id]?.paidThisPeriod ?? 0, CURRENCY)}</dd>
                </div>
                {rentStatuses[t.id]?.priorArrears ? (
                  <div className="flex justify-between gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-1 rounded-lg">
                    <dt>Prior Unpaid Arrears</dt>
                    <dd>+{money(rentStatuses[t.id]?.priorArrears ?? 0, CURRENCY)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-2 pt-1 border-t border-border/40">
                  <dt className="font-semibold text-foreground">Total Balance Due</dt>
                  <dd className={`font-bold ${rentStatuses[t.id]?.totalBalance ? "text-rose-500 font-mono text-base" : "text-emerald-600 font-mono text-base"}`}>
                    {money(rentStatuses[t.id]?.totalBalance ?? 0, CURRENCY)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Rent status</dt>
                  <dd>
                    <Badge
                      variant={
                        rentStatuses[t.id]?.status === "PAID"
                          ? "default"
                          : rentStatuses[t.id]?.status === "ARREARS"
                          ? "destructive"
                          : rentStatuses[t.id]?.status === "PARTIAL"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize font-semibold text-[11px]"
                    >
                      {rentStatuses[t.id]?.status === "ARREARS"
                        ? "In Arrears"
                        : rentStatuses[t.id]?.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
              
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setDraft({
                      id: t.id,
                      property_id: t.property_id ?? "",
                      unit_id: t.unit_id ?? "",
                      full_name: t.full_name,
                      phone: t.phone,
                      email: t.email ?? "",
                      national_id: t.national_id ?? "",
                      occupation: t.occupation ?? "",
                      emergency_contact: t.emergency_contact ?? "",
                      lease_start: t.lease_start ?? "",
                      lease_end: t.lease_end ?? "",
                      rent_amount: Number(t.rent_amount ?? 0),
                      deposit_paid: Number(t.deposit_paid ?? 0),
                      status: t.status ?? "active",
                    });
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive"
                  onClick={() => {
                    if (confirm(`Remove ${t.full_name}?`)) deleteMutation.mutate(t.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit tenant" : "New tenant"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(draft);
            }}
          >
            <Field label="Full name" htmlFor="fullname">
              <Input
                id="fullname"
                required
                maxLength={120}
                value={draft.full_name}
                onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                required
                maxLength={24}
                placeholder="0712345678"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                maxLength={200}
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </Field>
            <Field label="National ID" htmlFor="nid">
              <Input
                id="nid"
                maxLength={40}
                value={draft.national_id}
                onChange={(e) => setDraft({ ...draft, national_id: e.target.value })}
              />
            </Field>
            <Field label="Property">
              <Select
                value={draft.property_id}
                onValueChange={(v) => setDraft({ ...draft, property_id: v, unit_id: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose property" />
                </SelectTrigger>
                <SelectContent>
                  {(properties.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Unit">
              <Select
                value={draft.unit_id}
                onValueChange={(v) => {
                  const unit = (units.data ?? []).find((u) => u.id === v);
                  setDraft({
                    ...draft,
                    unit_id: v,
                    rent_amount: unit ? Number(unit.rent ?? 0) : draft.rent_amount,
                  });
                }}
                disabled={!draft.property_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose unit" />
                </SelectTrigger>
                <SelectContent>
                  {(units.data ?? []).map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.unit_number}
                      {u.room_number ? ` · ${u.room_number}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monthly rent" htmlFor="rentamt">
              <Input
                id="rentamt"
                type="number"
                min={0}
                value={draft.rent_amount}
                onChange={(e) => setDraft({ ...draft, rent_amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Deposit paid" htmlFor="dep">
              <Input
                id="dep"
                type="number"
                min={0}
                value={draft.deposit_paid}
                onChange={(e) => setDraft({ ...draft, deposit_paid: Number(e.target.value) })}
              />
            </Field>
            <Field label="Lease start" htmlFor="ls">
              <Input
                id="ls"
                type="date"
                value={draft.lease_start}
                onChange={(e) => setDraft({ ...draft, lease_start: e.target.value })}
              />
            </Field>
            <Field label="Lease end" htmlFor="le">
              <Input
                id="le"
                type="date"
                value={draft.lease_end}
                onChange={(e) => setDraft({ ...draft, lease_end: e.target.value })}
              />
            </Field>
            <Field label="Occupation" htmlFor="occ">
              <Input
                id="occ"
                maxLength={120}
                value={draft.occupation}
                onChange={(e) => setDraft({ ...draft, occupation: e.target.value })}
              />
            </Field>
            <Field label="Emergency contact" htmlFor="ec">
              <Input
                id="ec"
                maxLength={120}
                value={draft.emergency_contact}
                onChange={(e) => setDraft({ ...draft, emergency_contact: e.target.value })}
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={saveMutation.isPending}>
                Save tenant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
