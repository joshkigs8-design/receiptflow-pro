import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProperty, listProperties, saveProperty } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPES, money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Rent Receipt Pro" },
      { name: "description", content: "Add and manage all your rental properties in one place." },
      { property: "og:title", content: "Properties — Rent Receipt Pro" },
      { property: "og:description", content: "Manage your property portfolio." },
    ],
  }),
  component: PropertiesPage,
});

type Draft = {
  id?: string;
  name: string;
  code: string;
  property_type: string;
  address: string;
  description: string;
  units_count: number;
  status: string;
  notes: string;
};

const blank: Draft = {
  name: "",
  code: "",
  property_type: "apartment",
  address: "",
  description: "",
  units_count: 0,
  status: "active",
  notes: "",
};

function PropertiesPage() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listProperties);
  const save = useServerFn(saveProperty);
  const remove = useServerFn(deleteProperty);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);

  const { data, isLoading } = useQuery({ queryKey: ["properties"], queryFn: () => fetchAll() });

  const saveMutation = useMutation({
    mutationFn: (d: Draft) => save({ data: { ...d, amenities: [] } }),
    onSuccess: () => {
      toast.success("Property saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save property"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Property deleted");
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: () => toast.error("Could not delete property"),
  });

  return (
    <AppShell
      title="Properties"
      description="Buildings, hostels and houses you manage"
      actions={
        <Button
          size="sm"
          className="rounded-full shadow-glow"
          onClick={() => {
            setDraft(blank);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add property
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading properties…</p>
      ) : (data ?? []).length === 0 ? (
        <EmptyState title="No properties yet" hint="Add your first property to start tracking units and tenants." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((p) => {
            const units = p.units ?? [];
            const occupied = units.filter((u) => u.status === "occupied").length;
            const potential = units.reduce((s, u) => s + Number(u.rent ?? 0), 0);
            return (
              <article key={p.id} className="surface-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="gradient-primary mb-3 inline-flex size-10 items-center justify-center rounded-2xl">
                      <Building2 className="size-5 text-primary-foreground" />
                    </span>
                    <h2 className="truncate font-semibold">{p.name}</h2>
                    <p className="text-xs text-muted-foreground">Code {p.code}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {p.property_type}
                  </Badge>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Units</dt>
                    <dd className="font-semibold">
                      {occupied}/{units.length || p.units_count}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Rent potential</dt>
                    <dd className="font-semibold">{money(potential)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setDraft({
                        id: p.id,
                        name: p.name,
                        code: p.code,
                        property_type: p.property_type ?? "apartment",
                        address: p.address ?? "",
                        description: p.description ?? "",
                        units_count: Number(p.units_count ?? 0),
                        status: p.status ?? "active",
                        notes: p.notes ?? "",
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-destructive"
                    onClick={() => {
                      if (confirm(`Delete ${p.name}? This removes its units and tenants.`)) {
                        deleteMutation.mutate(p.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit property" : "New property"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(draft);
            }}
          >
            <Field label="Property name" htmlFor="name" className="sm:col-span-2">
              <Input
                id="name"
                required
                maxLength={120}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label="Property code (tenants use this)" htmlFor="code">
              <Input
                id="code"
                required
                maxLength={24}
                placeholder="CB-001"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Type">
              <Select
                value={draft.property_type}
                onValueChange={(v) => setDraft({ ...draft, property_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Address" htmlFor="address" className="sm:col-span-2">
              <Input
                id="address"
                maxLength={200}
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              />
            </Field>
            <Field label="Total units" htmlFor="units">
              <Input
                id="units"
                type="number"
                min={0}
                value={draft.units_count}
                onChange={(e) => setDraft({ ...draft, units_count: Number(e.target.value) })}
              />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea
                maxLength={2000}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={saveMutation.isPending}>
                Save property
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}