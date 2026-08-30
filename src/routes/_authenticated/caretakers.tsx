import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
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
  listCaretakers,
  saveCaretaker,
  deleteCaretaker,
  defaultPermissions,
  type CaretakerRecord,
  type CaretakerPermissions,
} from "@/lib/caretaker.functions";
import { listProperties } from "@/lib/app.functions";

export const Route = createFileRoute("/_authenticated/caretakers")({
  head: () => ({
    meta: [
      { title: "Caretakers & Property Agents — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Manage caretaker and agent sub-accounts. Grant on-site payment logging, receipt generation, and maintenance permissions for your rental properties.",
      },
    ],
  }),
  component: CaretakersPage,
});

function CaretakersPage() {
  const qc = useQueryClient();
  const fetchCaretakers = useServerFn(listCaretakers);
  const fetchProperties = useServerFn(listProperties);
  const saveFn = useServerFn(saveCaretaker);
  const deleteFn = useServerFn(deleteCaretaker);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<CaretakerRecord | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [propertyId, setPropertyId] = useState<string>("all");
  const [status, setStatus] = useState<"active" | "suspended">("active");
  const [perms, setPerms] = useState<CaretakerPermissions>(defaultPermissions);

  const { data: caretakers = [], isLoading } = useQuery({
    queryKey: ["caretakers"],
    queryFn: () => fetchCaretakers(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      saveFn({
        data: {
          id: editing?.id,
          name,
          phone,
          pin,
          property_id: propertyId === "all" ? null : propertyId,
          permissions: perms,
          status,
        },
      }),
    onSuccess: async () => {
      toast.success(editing ? "Caretaker updated successfully" : "Caretaker added successfully");
      await qc.invalidateQueries({ queryKey: ["caretakers"] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save caretaker"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: async () => {
      toast.success("Caretaker access revoked");
      await qc.invalidateQueries({ queryKey: ["caretakers"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to revoke access"),
  });

  function resetForm() {
    setEditing(null);
    setName("");
    setPhone("");
    setPin(generateRandomPin());
    setPropertyId("all");
    setStatus("active");
    setPerms(defaultPermissions);
  }

  function openCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(c: CaretakerRecord) {
    setEditing(c);
    setName(c.name);
    setPhone(c.phone);
    setPin(c.pin);
    setPropertyId(c.property_id || "all");
    setStatus(c.status);
    setPerms(c.permissions || defaultPermissions);
    setDialogOpen(true);
  }

  function generateRandomPin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  function togglePinVisibility(id: string) {
    setVisiblePins((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSendWhatsApp(c: CaretakerRecord) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://rentreceipt.co.ke";
    const assignedProp = properties.find((p) => p.id === c.property_id);
    const propName = assignedProp ? assignedProp.name : "All Assigned Properties";
    const propCode = assignedProp?.code ? `\n🏢 Property Code: ${assignedProp.code}` : "";

    const msg = encodeURIComponent(
      `Habari ${c.name}!\n\nYou have been assigned as an On-Site Caretaker / Property Agent for *${propName}* on RentReceiptPro.\n\nYou can log tenant payments, issue verified QR receipts on-site, and manage maintenance tickets.\n\n🌐 *Caretaker Terminal*: ${origin}/caretaker\n📱 *Login Phone*: ${c.phone}\n🔑 *Access PIN*: ${c.pin}${propCode}\n\nPlease keep your PIN secure.`,
    );
    window.open(`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  }

  const filtered = caretakers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.properties?.name && c.properties.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AppShell
      title="Caretakers & Staff"
      description="Delegate on-site receipt issuance and maintenance management while safeguarding your master account and billing."
      actions={
        <Button onClick={openCreate} className="rounded-full shadow-glow font-semibold text-xs gap-1.5 h-9">
          <Plus className="size-4" /> Add Caretaker
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Security / Role Isolation Notice */}
        <div className="surface-card p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-foreground">
                Strict Sub-Account Security &amp; Billing Isolation
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Caretakers can only log payments and resolve maintenance for their assigned buildings. They cannot view your billing settings, modify rental rates, or delete properties.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/30 text-emerald-600 shrink-0">
            {caretakers.length} Active Staff
          </Badge>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search caretaker name, phone..."
              className="pl-9 rounded-full text-xs h-10"
            />
          </div>
        </div>

        {/* Caretakers Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs">Loading caretakers...</span>
          </div>
        ) : filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const assignedProp = properties.find((p) => p.id === c.property_id);
              const isPinVisible = visiblePins[c.id];

              return (
                <div
                  key={c.id}
                  className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header: Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-foreground">{c.name}</h3>
                          <p className="text-xs font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="size-3 text-primary" /> {c.phone}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={c.status === "active" ? "default" : "secondary"}
                        className={`text-[10px] capitalize font-semibold ${
                          c.status === "active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : ""
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </div>

                    {/* Assigned Property */}
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground truncate">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {assignedProp ? assignedProp.name : c.properties?.name || "All Landlord Properties"}
                        </span>
                      </div>
                      {assignedProp?.code ? (
                        <span className="font-mono text-[10px] bg-background px-2 py-0.5 rounded border font-bold">
                          {assignedProp.code}
                        </span>
                      ) : null}
                    </div>

                    {/* PIN Credential Box */}
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-3.5 text-amber-500" />
                        <span className="text-muted-foreground">Access PIN:</span>
                        <span className="font-mono font-bold text-foreground">
                          {isPinVisible ? c.pin : "••••"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePinVisibility(c.id)}
                          className="p-1 hover:text-primary transition-colors text-muted-foreground"
                          title="Show/Hide PIN"
                        >
                          {isPinVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(c.pin);
                            toast.success("PIN copied to clipboard");
                          }}
                          className="p-1 hover:text-primary transition-colors text-muted-foreground"
                          title="Copy PIN"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Permission Badges */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Assigned Permissions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.permissions.can_record_payments ? (
                          <Badge variant="secondary" className="text-[10px] gap-1 bg-primary/10 text-primary border-primary/20">
                            <Receipt className="size-2.5" /> Issue Receipts
                          </Badge>
                        ) : null}
                        {c.permissions.can_manage_maintenance ? (
                          <Badge variant="secondary" className="text-[10px] gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
                            <Wrench className="size-2.5" /> Maintenance
                          </Badge>
                        ) : null}
                        {c.permissions.can_view_tenants ? (
                          <Badge variant="secondary" className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            <Users className="size-2.5" /> Tenants
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold gap-1 px-3 flex-1"
                      onClick={() => handleSendWhatsApp(c)}
                    >
                      <MessageCircle className="size-3" /> WhatsApp Invite
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full h-8 px-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm(`Revoke on-site access for ${c.name}?`)) {
                          deleteMutation.mutate(c.id);
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="surface-card p-12 text-center rounded-3xl border border-border/80 space-y-3">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <UserCheck className="size-6" />
            </div>
            <h3 className="font-display font-bold text-base">No Caretakers Added Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Add your on-site caretakers, estate agents, or property managers so they can record tenant payments and issue official receipts directly from their smartphones.
            </p>
            <Button onClick={openCreate} className="rounded-full shadow-glow font-semibold text-xs mt-2">
              <Plus className="size-4 mr-1.5" /> Add Your First Caretaker
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Caretaker Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editing ? "Edit Caretaker Permissions" : "Add Caretaker / Property Agent"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign on-site property access and select permitted operational tools.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-4 pt-2"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="cname" className="text-xs font-semibold">Caretaker Full Name *</Label>
              <Input
                id="cname"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Peter Mutua (Caretaker)"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="cphone" className="text-xs font-semibold">Phone Number (For Portal Login) *</Label>
              <Input
                id="cphone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678 or 254712345678"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            {/* Property Assignment */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assigned Property</Label>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Landlord Properties</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} {p.code ? `(${p.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Access PIN Generator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cpin" className="text-xs font-semibold">4-Digit Access PIN *</Label>
                <button
                  type="button"
                  onClick={() => setPin(generateRandomPin())}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="size-2.5" /> Generate Random
                </button>
              </div>
              <Input
                id="cpin"
                required
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 4821"
                className="rounded-xl h-10 font-mono text-sm tracking-widest"
              />
            </div>

            {/* Permissions Toggles */}
            <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
              <span className="text-xs font-bold text-foreground block">
                Operational Permissions
              </span>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div>
                  <p className="text-xs font-semibold text-foreground">Record Payments &amp; Issue Receipts</p>
                  <p className="text-[11px] text-muted-foreground">Allows logging rent &amp; generating QR receipts on-site</p>
                </div>
                <Switch
                  checked={perms.can_record_payments}
                  onCheckedChange={(c) => setPerms({ ...perms, can_record_payments: c })}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div>
                  <p className="text-xs font-semibold text-foreground">Manage Maintenance Desk</p>
                  <p className="text-[11px] text-muted-foreground">Allows accepting and resolving tenant maintenance tickets</p>
                </div>
                <Switch
                  checked={perms.can_manage_maintenance}
                  onCheckedChange={(c) => setPerms({ ...perms, can_manage_maintenance: c })}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div>
                  <p className="text-xs font-semibold text-foreground">View Tenant Directory</p>
                  <p className="text-[11px] text-muted-foreground">Access room numbers and tenant phone numbers</p>
                </div>
                <Switch
                  checked={perms.can_view_tenants}
                  onCheckedChange={(c) => setPerms({ ...perms, can_view_tenants: c })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-full shadow-glow font-bold text-xs h-10"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editing ? (
                  "Update Caretaker"
                ) : (
                  "Save & Issue Invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

