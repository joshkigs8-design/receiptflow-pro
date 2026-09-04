import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { listLeases, saveLease, deleteLease, listTenants } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { TableSkeleton } from "@/components/app/TableSkeleton";
import { EmptyState } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortDate, money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/leases")({
  head: () => ({
    meta: [
      { title: "Lease Agreements — Rent Receipt Pro" },
      {
        name: "description",
        content: "Manage tenant lease agreements, expiry alerts, and signed contracts.",
      },
    ],
  }),
  component: LeasesPage,
});

interface LeaseFormData {
  id?: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  status: "active" | "expiring" | "expired" | "terminated";
  document_url: string;
  signed: boolean;
}

const emptyForm: LeaseFormData = {
  tenant_id: "",
  start_date: "",
  end_date: "",
  status: "active",
  document_url: "",
  signed: false,
};

function LeasesPage() {
  const qc = useQueryClient();
  const fetchLeases = useServerFn(listLeases);
  const mutateLease = useServerFn(saveLease);
  const removeLease = useServerFn(deleteLease);
  const fetchTenants = useServerFn(listTenants);

  const { data: leases = [], isLoading } = useQuery({
    queryKey: ["leases"],
    queryFn: () => fetchLeases(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => fetchTenants(),
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<LeaseFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: (data: LeaseFormData) => mutateLease({ data }),
    onSuccess: () => {
      toast.success(formData.id ? "Lease updated successfully" : "Lease created successfully");
      qc.invalidateQueries({ queryKey: ["leases"] });
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save lease agreement");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeLease({ data: { id } }),
    onSuccess: () => {
      toast.success("Lease agreement removed");
      qc.invalidateQueries({ queryKey: ["leases"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to remove lease"),
  });

  // Calculate metrics
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const stats = useMemo(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let signed = 0;

    leases.forEach((l: any) => {
      if (l.signed) signed++;
      if (l.end_date) {
        const end = new Date(l.end_date);
        if (end < now) {
          expired++;
        } else if (end <= thirtyDaysFromNow) {
          expiring++;
          active++;
        } else {
          active++;
        }
      } else if (l.status === "active") {
        active++;
      }
    });

    return { active, expiring, expired, signed, total: leases.length };
  }, [leases, now, thirtyDaysFromNow]);

  const filteredLeases = useMemo(() => {
    return leases.filter((l: any) => {
      const name = (l.tenants?.full_name || "").toLowerCase();
      const prop = (l.tenants?.properties?.name || "").toLowerCase();
      const unit = (l.tenants?.units?.unit_number || "").toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !search || name.includes(q) || prop.includes(q) || unit.includes(q);

      if (!matchesSearch) return false;
      if (statusFilter === "all") return true;
      if (statusFilter === "expiring") {
        if (!l.end_date) return false;
        const end = new Date(l.end_date);
        return end >= now && end <= thirtyDaysFromNow;
      }
      if (statusFilter === "expired") {
        if (!l.end_date) return false;
        return new Date(l.end_date) < now;
      }
      return l.status === statusFilter;
    });
  }, [leases, search, statusFilter, now, thirtyDaysFromNow]);

  const openNewModal = () => {
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditModal = (lease: any) => {
    setFormData({
      id: lease.id,
      tenant_id: lease.tenant_id,
      start_date: lease.start_date || "",
      end_date: lease.end_date || "",
      status: lease.status || "active",
      document_url: lease.document_url || "",
      signed: Boolean(lease.signed),
    });
    setDialogOpen(true);
  };

  return (
    <AppShell
      title="Lease Agreements"
      description="Manage tenancy contracts, terms, signed documents, and renewals"
      actions={
        <Button onClick={openNewModal} className="rounded-full gap-1.5 shadow-glow font-semibold h-10 px-5">
          <Plus className="size-4" /> New Lease
        </Button>
      }
    >
      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Leases</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{stats.active}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Current ongoing tenancies</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">Expiring Soon</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-500">{stats.expiring}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Ending within 30 days</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">Expired</span>
            <AlertCircle className="size-4 text-rose-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-500">{stats.expired}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Need renewal or closeout</p>
        </div>

        <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Signed Contracts</span>
            <FileCheck2 className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-primary">{stats.signed}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Digitally or physically signed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant, property, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-2xl h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 rounded-2xl w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leases</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon (30d)</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leases Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filteredLeases.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title={search || statusFilter !== "all" ? "No matching lease agreements" : "No lease agreements recorded"}
          hint={
            search || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "Attach signed lease agreements, track contract dates, and get expiry alerts."
          }
          action={
            !search && statusFilter === "all"
              ? {
                  label: "Create First Lease",
                  onClick: openNewModal,
                }
              : undefined
          }
        />
      ) : (
        <div className="surface-card rounded-3xl border border-border/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property &amp; Unit</TableHead>
                  <TableHead>Term Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeases.map((lease: any) => {
                  const end = lease.end_date ? new Date(lease.end_date) : null;
                  const isExpired = end && end < now;
                  const isExpiring = end && end >= now && end <= thirtyDaysFromNow;

                  return (
                    <TableRow key={lease.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-semibold text-foreground text-sm">
                          {lease.tenants?.full_name || "Unknown Tenant"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {lease.tenants?.phone || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-medium text-foreground">
                          {lease.tenants?.properties?.name || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Unit {lease.tenants?.units?.unit_number || lease.tenants?.units?.room_number || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs flex items-center gap-1">
                          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                          <span>
                            {lease.start_date ? shortDate(lease.start_date) : "Open"} →{" "}
                            {lease.end_date ? shortDate(lease.end_date) : "Ongoing"}
                          </span>
                        </div>
                        {isExpired ? (
                          <span className="text-[10px] font-bold text-rose-500 block mt-0.5">Expired</span>
                        ) : isExpiring ? (
                          <span className="text-[10px] font-bold text-amber-500 block mt-0.5">Expiring soon</span>
                        ) : null}
                      </TableCell>

                      <TableCell className="font-display font-semibold text-sm">
                        {money(lease.tenants?.rent_amount ?? 0)}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            variant={
                              isExpired
                                ? "destructive"
                                : isExpiring
                                ? "secondary"
                                : lease.status === "active"
                                ? "default"
                                : "outline"
                            }
                            className="capitalize text-[11px]"
                          >
                            {isExpired ? "Expired" : isExpiring ? "Expiring" : lease.status}
                          </Badge>
                          {lease.signed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                              <CheckCircle2 className="size-3" /> Signed
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Unsigned</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {lease.document_url ? (
                          <a
                            href={lease.document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            <FileText className="size-3.5" />
                            <span>View PDF</span>
                            <ExternalLink className="size-3 opacity-70" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">No file</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
                            onClick={() => openEditModal(lease)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            onClick={() => setDeleteId(lease.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add / Edit Lease Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {formData.id ? "Edit Lease Agreement" : "Create Lease Agreement"}
            </DialogTitle>
            <DialogDescription>
              Record lease terms, duration dates, and document link for this tenancy.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!formData.tenant_id) {
                toast.error("Please select a tenant");
                return;
              }
              saveMutation.mutate(formData);
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label>Select Tenant *</Label>
              <Select
                value={formData.tenant_id}
                onValueChange={(v) => setFormData({ ...formData, tenant_id: v })}
                disabled={Boolean(formData.id)}
              >
                <SelectTrigger className="h-10 rounded-2xl">
                  <SelectValue placeholder="Select a tenant..." />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name} ({t.properties?.name || "No property"} · Unit {t.units?.unit_number || "—"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="h-10 rounded-2xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date / Expiry</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="h-10 rounded-2xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Lease Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="h-10 rounded-2xl capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex flex-col justify-end pb-1">
                <div className="flex items-center justify-between p-2 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-xs font-medium">Signed Contract</span>
                  <Switch
                    checked={formData.signed}
                    onCheckedChange={(checked) => setFormData({ ...formData, signed: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lease Document URL (PDF or Cloud Storage link)</Label>
              <Input
                type="url"
                placeholder="https://... (link to scanned PDF lease)"
                value={formData.document_url}
                onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
                className="h-10 rounded-2xl text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Paste a Google Drive, Dropbox, or Supabase Storage link to the signed contract.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-full font-semibold px-6"
              >
                {saveMutation.isPending ? "Saving..." : formData.id ? "Save Changes" : "Create Lease"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Lease Agreement"
        description="Are you sure you want to remove this lease agreement? The tenant profile and payment history will remain intact."
        confirmText="Delete Lease"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </AppShell>
  );
}
