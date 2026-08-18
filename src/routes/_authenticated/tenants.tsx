import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteTenant,
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
import { money, shortDate } from "@/lib/format";

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
  const save = useServerFn(saveTenant);
  const remove = useServerFn(deleteTenant);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);

  const tenants = useQuery({ queryKey: ["tenants"], queryFn: () => fetchTenants() });
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => fetchProperties() });
  const units = useQuery({
    queryKey: ["units", draft.property_id],
    queryFn: () => fetchUnits({ data: { propertyId: draft.property_id } }),
    enabled: Boolean(draft.property_id),
  });

  const filtered = useMemo(() => {
    const rows = tenants.data ?? [];
    if (!term.trim()) return rows;
    const q = term.toLowerCase();
    return rows.filter(
      (t) =>
        t.full_name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        (t.properties?.name ?? "").toLowerCase().includes(q),
    );
  }, [tenants.data, term]);

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
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search name, phone or property"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          maxLength={80}
        />
      </div>

      {tenants.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading tenants…</p>
      ) : filtered.length === 0 ? (
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
                  <dt className="text-muted-foreground">Rent</dt>
                  <dd className="font-semibold">{money(t.rent_amount)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Lease ends</dt>
                  <dd>{shortDate(t.lease_end)}</dd>
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
