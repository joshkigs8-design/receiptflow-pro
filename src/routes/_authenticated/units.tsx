import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { DoorOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUnit, listProperties, listUnits, saveUnit } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/TableSkeleton";
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
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/units")({
  head: () => ({
    meta: [
      { title: "Units & Rooms — Rent Receipt Pro" },
      { name: "description", content: "Track every unit, room, rent amount and occupancy status." },
      { property: "og:title", content: "Units & Rooms — Rent Receipt Pro" },
      { property: "og:description", content: "Manage units, rooms and rent amounts." },
    ],
  }),
  component: UnitsPage,
});

type Draft = {
  id?: string;
  property_id: string;
  unit_number: string;
  room_number: string;
  floor: string;
  rent: number;
  deposit: number;
  status: string;
  utilities: string;
  image_url: string;
  notes: string;
};

const blank: Draft = {
  property_id: "",
  unit_number: "",
  room_number: "",
  floor: "",
  rent: 0,
  deposit: 0,
  status: "vacant",
  utilities: "",
  image_url: "",
  notes: "",
};

function UnitsPage() {
  const qc = useQueryClient();
  const fetchUnits = useServerFn(listUnits);
  const fetchProperties = useServerFn(listProperties);
  const save = useServerFn(saveUnit);
  const remove = useServerFn(deleteUnit);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);
  const [deletingUnit, setDeletingUnit] = useState<{ id: string; unit_number: string } | null>(null);

  const properties = useQuery({ queryKey: ["properties"], queryFn: () => fetchProperties() });
  const units = useQuery({
    queryKey: ["units", filter],
    queryFn: () => fetchUnits({ data: filter === "all" ? {} : { propertyId: filter } }),
  });

  const saveMutation = useMutation({
    mutationFn: (d: Draft) => save({ data: d }),
    onSuccess: () => {
      toast.success("Unit saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["units"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save unit"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Unit deleted");
      qc.invalidateQueries({ queryKey: ["units"] });
    },
    onError: () => toast.error("Could not delete unit"),
  });

  return (
    <AppShell
      title="Units & rooms"
      description="Rent, deposits and occupancy per unit"
      actions={
        <Button
          size="sm"
          className="rounded-full shadow-glow"
          onClick={() => {
            setDraft({ ...blank, property_id: (properties.data ?? [])[0]?.id ?? "" });
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add unit
        </Button>
      }
    >
      <div className="mb-6 max-w-xs">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All properties</SelectItem>
            {(properties.data ?? []).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {units.isLoading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (units.data ?? []).length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No units found"
          hint="Add units to your property to track rooms, rent amounts, utilities and tenant occupancy."
          action={{
            label: "+ Add First Unit",
            onClick: () => {
              setDraft(blank);
              setOpen(true);
            },
          }}
        />
      ) : (
        <div className="surface-card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="p-3">Unit</th>
                <th className="p-3">Room</th>
                <th className="p-3">Floor</th>
                <th className="p-3">Rent</th>
                <th className="p-3">Tenant</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {(units.data ?? []).map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3 font-medium">{u.unit_number}</td>
                  <td className="p-3">{u.room_number ?? "—"}</td>
                  <td className="p-3">{u.floor ?? "—"}</td>
                  <td className="p-3">{money(u.rent)}</td>
                  <td className="p-3">{u.tenants?.[0]?.full_name ?? "Vacant"}</td>
                  <td className="p-3">
                    <Badge
                      variant={u.status === "occupied" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => {
                        setDraft({
                          id: u.id,
                          property_id: u.property_id,
                          unit_number: u.unit_number,
                          room_number: u.room_number ?? "",
                          floor: u.floor ?? "",
                          rent: Number(u.rent ?? 0),
                          deposit: Number(u.deposit ?? 0),
                          status: u.status ?? "vacant",
                          utilities: u.utilities ?? "",
                          image_url: (u as any).image_url ?? "",
                          notes: (u as any).notes ?? "",
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
                        setDeletingUnit({ id: u.id, unit_number: u.unit_number });
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit unit" : "New unit"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.property_id) {
                toast.error("Select a property first");
                return;
              }
              saveMutation.mutate(draft);
            }}
          >
            <Field label="Property" className="sm:col-span-2">
              <Select
                value={draft.property_id}
                onValueChange={(v) => setDraft({ ...draft, property_id: v })}
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
            <Field label="Unit number" htmlFor="unit">
              <Input
                id="unit"
                required
                maxLength={40}
                value={draft.unit_number}
                onChange={(e) => setDraft({ ...draft, unit_number: e.target.value })}
              />
            </Field>
            <Field label="Room number (tenant login)" htmlFor="room">
              <Input
                id="room"
                maxLength={40}
                value={draft.room_number}
                onChange={(e) => setDraft({ ...draft, room_number: e.target.value })}
              />
            </Field>
            <Field label="Floor" htmlFor="floor">
              <Input
                id="floor"
                maxLength={24}
                value={draft.floor}
                onChange={(e) => setDraft({ ...draft, floor: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monthly rent" htmlFor="rent">
              <Input
                id="rent"
                type="number"
                min={0}
                value={draft.rent}
                onChange={(e) => setDraft({ ...draft, rent: Number(e.target.value) })}
              />
            </Field>
            <Field label="Deposit" htmlFor="deposit">
              <Input
                id="deposit"
                type="number"
                min={0}
                value={draft.deposit}
                onChange={(e) => setDraft({ ...draft, deposit: Number(e.target.value) })}
              />
            </Field>
            <Field label="Utilities included" htmlFor="utilities" className="sm:col-span-2">
              <Input
                id="utilities"
                maxLength={500}
                placeholder="Water, garbage, WiFi"
                value={draft.utilities}
                onChange={(e) => setDraft({ ...draft, utilities: e.target.value })}
              />
            </Field>
            <Field label="Unit Photo URL (Optional)" htmlFor="uimg" className="sm:col-span-2">
              <Input
                id="uimg"
                maxLength={600}
                placeholder="https://..."
                value={draft.image_url}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
              />
            </Field>
            <Field label="Internal Notes (Optional)" className="sm:col-span-2">
              <Input
                maxLength={1000}
                placeholder="Key codes, inventory, meter number..."
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={saveMutation.isPending}>
                Save unit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingUnit)}
        onOpenChange={(isOpen) => !isOpen && setDeletingUnit(null)}
        title="Delete Unit"
        description={`Are you sure you want to delete Unit ${deletingUnit?.unit_number}? This action cannot be undone.`}
        confirmText="Delete Unit"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deletingUnit) {
            deleteMutation.mutate(deletingUnit.id, {
              onSettled: () => setDeletingUnit(null),
            });
          }
        }}
      />
    </AppShell>
  );
}
