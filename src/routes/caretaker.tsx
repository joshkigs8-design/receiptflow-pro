import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  DoorOpen,
  Download,
  Eye,
  FileCheck2,
  FileText,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  MessageCircle,
  Phone,
  PhoneCall,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/lib/theme";
import { money, shortDate } from "@/lib/format";
import {
  caretakerLogin,
  getCaretakerPortalData,
  caretakerRecordPayment,
  caretakerUpdateMaintenance,
  caretakerRequestAddTenant,
  caretakerRequestVacateTenant,
  listCaretakerOwnRequests,
  type CaretakerPermissions,
  type CaretakerTenantRequest,
} from "@/lib/caretaker.functions";
import { receiptUrl, buildReceiptPdf, type ReceiptRecord } from "@/lib/receipt-pdf";

export const Route = createFileRoute("/caretaker")({
  head: () => ({
    meta: [
      { title: "Caretaker & Staff Portal — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "On-site mobile terminal for caretakers and property agents to log tenant payments, generate verified digital receipts, and resolve maintenance tickets.",
      },
    ],
  }),
  component: CaretakerPortalPage,
});

type CaretakerSession = {
  id: string;
  landlord_id: string;
  property_id: string | null;
  name: string;
  phone: string;
  permissions: CaretakerPermissions;
  landlord_company: string;
  landlord_phone: string;
  currency: string;
};

function CaretakerPortalPage() {
  const qc = useQueryClient();
  const loginFn = useServerFn(caretakerLogin);
  const portalDataFn = useServerFn(getCaretakerPortalData);
  const recordPayFn = useServerFn(caretakerRecordPayment);
  const updateMaintFn = useServerFn(caretakerUpdateMaintenance);
  const reqAddTenantFn = useServerFn(caretakerRequestAddTenant);
  const reqVacateTenantFn = useServerFn(caretakerRequestVacateTenant);
  const listOwnReqsFn = useServerFn(listCaretakerOwnRequests);

  // Authentication State
  const [session, setSession] = useState<CaretakerSession | null>(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [activeTab, setActiveTab] = useState<"issue" | "tenants" | "maintenance" | "requests" | "receipts">("issue");

  // Payment Form State
  const [tenantId, setTenantId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mpesa" | "cash" | "bank" | "cheque">("mpesa");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [periodLabel, setPeriodLabel] = useState(
    () => new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
  );

  // Add Tenant Dialog State
  const [addTenantOpen, setAddTenantOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantPhone, setNewTenantPhone] = useState("");
  const [newTenantEmail, setNewTenantEmail] = useState("");
  const [newTenantUnitId, setNewTenantUnitId] = useState("");
  const [newTenantRent, setNewTenantRent] = useState("");
  const [newTenantDeposit, setNewTenantDeposit] = useState("");
  const [newTenantStart, setNewTenantStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [newTenantNotes, setNewTenantNotes] = useState("");

  // Vacate Tenant Dialog State
  const [vacateOpen, setVacateOpen] = useState(false);
  const [vacateTarget, setVacateTarget] = useState<{ id: string; name: string; room: string } | null>(null);
  const [vacateReason, setVacateReason] = useState("");
  const [vacateDate, setVacateDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Success Receipt Modal State
  const [lastIssued, setLastIssued] = useState<{
    publicId: string;
    receiptNumber: string;
    tenantName: string;
    amount: number;
    phone: string;
    room: string;
  } | null>(null);

  // Tenant Search State
  const [tenantSearch, setTenantSearch] = useState("");

  // Load Session from LocalStorage on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rrp_caretaker_session");
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: () => loginFn({ data: { phone: loginPhone, pin: loginPin } }),
    onSuccess: (res) => {
      if (res.ok && res.caretaker) {
        setSession(res.caretaker);
        localStorage.setItem("rrp_caretaker_session", JSON.stringify(res.caretaker));
        toast.success(`Welcome back, ${res.caretaker.name}`);
      } else {
        toast.error(res.error || "Login failed");
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Connection error"),
  });

  function handleSignOut() {
    localStorage.removeItem("rrp_caretaker_session");
    setSession(null);
    setLoginPhone("");
    setLoginPin("");
    toast.success("Logged out successfully");
  }

  // Load Portal Data when Logged In
  const { data: portalData, isLoading: isDataLoading, refetch } = useQuery({
    queryKey: ["caretaker_portal", session?.id],
    enabled: !!session,
    queryFn: () =>
      portalDataFn({
        data: {
          caretaker_id: session!.id,
          landlord_id: session!.landlord_id,
          property_id: session!.property_id,
        },
      }),
  });

  // Load Caretaker's Own Submitted Requests
  const { data: ownRequests = [], refetch: refetchRequests } = useQuery({
    queryKey: ["caretaker_own_requests", session?.id],
    enabled: !!session,
    queryFn: () =>
      listOwnReqsFn({
        data: {
          caretaker_id: session!.id,
          landlord_id: session!.landlord_id,
        },
      }),
  });

  const recordPaymentMutation = useMutation({
    mutationFn: () =>
      recordPayFn({
        data: {
          caretaker_id: session!.id,
          landlord_id: session!.landlord_id,
          caretaker_name: session!.name,
          tenant_id: tenantId,
          amount: Number(amount),
          method,
          reference: reference.trim() || undefined,
          period_label: periodLabel,
          notes: notes.trim() || undefined,
        },
      }),
    onSuccess: async (res) => {
      const selectedTenant = portalData?.tenants.find((t) => t.id === tenantId);
      toast.success("Payment recorded & official receipt issued!");
      setLastIssued({
        publicId: res.publicId,
        receiptNumber: res.receiptNumber,
        tenantName: selectedTenant?.full_name || "Tenant",
        amount: Number(amount),
        phone: selectedTenant?.phone || "",
        room: selectedTenant?.units?.unit_number || selectedTenant?.units?.room_number || "",
      });
      // Reset payment form
      setAmount("");
      setReference("");
      setNotes("");
      await refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to record payment"),
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: "in_progress" | "resolved" }) =>
      updateMaintFn({
        data: {
          ticket_id: ticketId,
          status,
          caretaker_name: session!.name,
        },
      }),
    onSuccess: async () => {
      toast.success("Maintenance ticket updated");
      await refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const requestAddTenantMutation = useMutation({
    mutationFn: () => {
      const selectedUnit = portalData?.units.find((u) => u.id === newTenantUnitId);
      return reqAddTenantFn({
        data: {
          caretaker_id: session!.id,
          landlord_id: session!.landlord_id,
          caretaker_name: session!.name,
          property_id: selectedUnit?.property_id || portalData?.properties[0]?.id || "",
          unit_id: newTenantUnitId,
          full_name: newTenantName,
          phone: newTenantPhone,
          email: newTenantEmail || undefined,
          rent_amount: Number(newTenantRent),
          deposit_paid: Number(newTenantDeposit) || 0,
          lease_start: newTenantStart,
          notes: newTenantNotes || undefined,
        },
      });
    },
    onSuccess: async () => {
      toast.success("Tenant onboarding request submitted for landlord confirmation!");
      setAddTenantOpen(false);
      setNewTenantName("");
      setNewTenantPhone("");
      setNewTenantEmail("");
      setNewTenantUnitId("");
      setNewTenantRent("");
      setNewTenantDeposit("");
      setNewTenantNotes("");
      await refetchRequests();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit request"),
  });

  const requestVacateTenantMutation = useMutation({
    mutationFn: () =>
      reqVacateTenantFn({
        data: {
          caretaker_id: session!.id,
          landlord_id: session!.landlord_id,
          caretaker_name: session!.name,
          tenant_id: vacateTarget!.id,
          reason: vacateReason,
          departure_date: vacateDate,
        },
      }),
    onSuccess: async () => {
      toast.success("Tenant move-out request submitted for landlord confirmation!");
      setVacateOpen(false);
      setVacateTarget(null);
      setVacateReason("");
      await refetchRequests();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit move-out request"),
  });

  // Auto-populate rent when selecting tenant
  function handleTenantSelect(tId: string) {
    setTenantId(tId);
    const t = portalData?.tenants.find((item) => item.id === tId);
    if (t) {
      setAmount(String(t.rent_amount));
    }
  }

  function handleUnitSelectForNewTenant(uId: string) {
    setNewTenantUnitId(uId);
    const u = portalData?.units.find((item) => item.id === uId);
    if (u) {
      setNewTenantRent(String(u.rent));
      setNewTenantDeposit(String(u.deposit || u.rent));
    }
  }

  function handleShareReceiptWhatsApp(publicId: string, tenantPhone: string, tenantName: string, amt: number, rNum: string) {
    const url = receiptUrl(publicId);
    const msg = encodeURIComponent(
      `Habari ${tenantName}!\n\nYour official rent payment receipt *${rNum}* for KSh ${amt.toLocaleString()} has been issued by Caretaker ${session?.name}.\n\n📄 Download or view your verified PDF receipt here:\n${url}\n\nThank you!`,
    );
    window.open(`https://wa.me/${tenantPhone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  }

  // If Not Authenticated, Display Fast Login Terminal
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Navigation Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/80 px-5 sm:px-8 bg-card/60 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground font-bold shadow-glow">
              <Building2 className="size-4" />
            </span>
            <span className="font-display font-bold text-sm tracking-tight">RentReceiptPro</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
              Landlord Login &rarr;
            </Link>
          </div>
        </header>

        {/* Login Container */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="size-6" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Caretaker Portal</h1>
              <p className="text-xs text-muted-foreground">
                On-site terminal for property caretakers and agents to issue digital receipts, onboard tenants &amp; log rent.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="loginPhone" className="text-xs font-semibold">Registered Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="loginPhone"
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="pl-10 rounded-xl h-11 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="loginPin" className="text-xs font-semibold">4-Digit Access PIN</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="loginPin"
                    type="password"
                    maxLength={8}
                    required
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••"
                    className="pl-10 rounded-xl h-11 font-mono tracking-widest text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full shadow-glow font-bold text-xs h-11 mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="size-4 mr-1.5" /> Access Caretaker Terminal
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-border/60 text-center space-y-2">
              <p className="text-[11px] text-muted-foreground">
                Don't have your access PIN? Ask your landlord or property owner to invite you from their dashboard.
              </p>
              <Link to="/tenant" className="text-xs font-semibold text-primary hover:underline block">
                Looking for the Tenant Portal? Click here &rarr;
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Caretaker Authenticated Terminal View
  const activeTenants = (portalData?.tenants || []).filter(
    (t) =>
      t.full_name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.phone.includes(tenantSearch) ||
      (t.units?.unit_number && t.units.unit_number.toLowerCase().includes(tenantSearch.toLowerCase())),
  );

  const pendingRequestsCount = ownRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/80 px-4 sm:px-8 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground font-bold shadow-sm">
            <Building2 className="size-4" />
          </span>
          <div>
            <h2 className="font-display font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
              {session.landlord_company}
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20 py-0">
                Caretaker
              </Badge>
            </h2>
            <p className="text-[11px] text-muted-foreground font-mono">
              Staff: {session.name} ({session.phone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-full h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
          >
            <LogOut className="size-3.5" /> <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Caretaker Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-muted/60 border border-border/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("issue")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "issue" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Receipt className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Issue Receipt</span>
            <span className="sm:hidden">Issue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tenants")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "tenants" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Tenants</span>
            <span className="sm:hidden">Tenants</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("maintenance")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === "maintenance" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wrench className="size-3.5 text-blue-500" />
            <span className="hidden sm:inline">Maintenance</span>
            <span className="sm:hidden">Tickets</span>
            {(portalData?.maintenance || []).filter((m) => m.status === "pending").length > 0 ? (
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === "requests" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-3.5 text-amber-500" />
            <span className="hidden sm:inline">Approvals</span>
            <span className="sm:hidden">Status</span>
            {pendingRequestsCount > 0 ? (
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("receipts")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "receipts" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck2 className="size-3.5 text-purple-500" />
            <span className="hidden sm:inline">Issued Feed</span>
            <span className="sm:hidden">Feed</span>
          </button>
        </div>

        {isDataLoading ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs">Connecting to property ledger...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: ISSUE RECEIPT FORM */}
            {activeTab === "issue" && (
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div>
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Receipt className="size-5 text-primary" /> Issue Instant Rent Receipt
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Record on-site tenant payment (M-Pesa or Cash) and create an official QR-verified PDF receipt.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {portalData?.tenants.length ?? 0} Tenants Ready
                  </Badge>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!tenantId) {
                      toast.error("Please select a tenant");
                      return;
                    }
                    recordPaymentMutation.mutate();
                  }}
                  className="space-y-4"
                >
                  {/* Select Tenant */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Select Tenant / Unit *</Label>
                    <Select value={tenantId} onValueChange={handleTenantSelect}>
                      <SelectTrigger className="rounded-2xl h-11 text-xs">
                        <SelectValue placeholder="Choose room and tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {(portalData?.tenants || []).map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            Room {t.units?.unit_number || t.units?.room_number || "—"} · {t.full_name} ({money(t.rent_amount)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount & Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="payAmount" className="text-xs font-semibold">Amount Paid (KSh) *</Label>
                      <Input
                        id="payAmount"
                        type="number"
                        required
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        className="rounded-2xl h-11 font-display text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="payPeriod" className="text-xs font-semibold">Rent Period Label</Label>
                      <Input
                        id="payPeriod"
                        value={periodLabel}
                        onChange={(e) => setPeriodLabel(e.target.value)}
                        placeholder="e.g. August 2026"
                        className="rounded-2xl h-11 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Payment Method & Reference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Payment Method *</Label>
                      <Select value={method} onValueChange={(v: "mpesa" | "cash" | "bank" | "cheque") => setMethod(v)}>
                        <SelectTrigger className="rounded-2xl h-11 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="payRef" className="text-xs font-semibold">
                        {method === "mpesa" ? "M-Pesa Confirmation Code" : "Reference / Note"}
                      </Label>
                      <Input
                        id="payRef"
                        value={reference}
                        onChange={(e) => setReference(e.target.value.toUpperCase())}
                        placeholder={method === "mpesa" ? "e.g. SHB7192KA1" : "Reference code"}
                        className="rounded-2xl h-11 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5">
                    <Label htmlFor="payNotes" className="text-xs font-semibold">Internal Caretaker Note (Optional)</Label>
                    <Input
                      id="payNotes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Water token deposit included"
                      className="rounded-2xl h-10 text-xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full rounded-full shadow-glow font-bold text-xs h-12 mt-3"
                    disabled={recordPaymentMutation.isPending || !tenantId || !amount}
                  >
                    {recordPaymentMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="size-4 mr-1.5" /> Issue Verified Receipt
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* TAB 2: TENANTS & UNITS DIRECTORY */}
            {activeTab === "tenants" && (
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Users className="size-4 text-emerald-500" /> Building Tenant Directory
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Contact tenants, onboard newcomers, or submit move-out departure requests.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-52">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        value={tenantSearch}
                        onChange={(e) => setTenantSearch(e.target.value)}
                        placeholder="Search room or tenant..."
                        className="pl-8 rounded-full text-xs h-9"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setAddTenantOpen(true)}
                      className="rounded-full shadow-glow font-semibold text-xs gap-1 h-9 shrink-0"
                    >
                      <UserPlus className="size-3.5" /> Onboard Tenant
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {activeTenants.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-background px-2 py-0.5 rounded border border-border">
                            Room {t.units?.unit_number || t.units?.room_number || "—"}
                          </span>
                          <span className="font-semibold text-xs text-foreground truncate">{t.full_name}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Phone className="size-3 text-primary" /> {t.phone}
                        </p>
                        <p className="text-[11px] font-display font-bold text-primary mt-0.5">
                          Rent: {money(t.rent_amount)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${t.phone}`}
                            className="inline-flex items-center justify-center size-8 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                            title="Call Tenant"
                          >
                            <PhoneCall className="size-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              handleTenantSelect(t.id);
                              setActiveTab("issue");
                            }}
                            className="inline-flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title="Issue Receipt for Tenant"
                          >
                            <Receipt className="size-3.5" />
                          </button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setVacateTarget({
                              id: t.id,
                              name: t.full_name,
                              room: t.units?.unit_number || t.units?.room_number || "",
                            });
                            setVacateOpen(true);
                          }}
                          className="h-7 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 rounded-full"
                        >
                          <UserMinus className="size-3 mr-1" /> Vacate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MAINTENANCE TICKETS */}
            {activeTab === "maintenance" && (
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Wrench className="size-4 text-blue-500" /> On-Site Maintenance Tickets
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tenant-reported repairs and maintenance issues for your assigned property.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {portalData?.maintenance.length ?? 0} Tickets
                  </Badge>
                </div>

                {portalData?.maintenance.length ? (
                  <div className="space-y-3">
                    {portalData.maintenance.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-bold bg-background px-2 py-0.5 rounded border mr-2">
                              Unit {m.units?.unit_number || "—"}
                            </span>
                            <span className="font-semibold text-xs capitalize">{m.category} Issue</span>
                          </div>
                          <Badge
                            variant={m.status === "resolved" ? "default" : "secondary"}
                            className={`text-[10px] uppercase font-bold ${
                              m.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : m.status === "in_progress"
                                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}
                          >
                            {m.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-xs text-foreground leading-relaxed">{m.description}</p>

                        <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40 gap-2">
                          <span>
                            Tenant: {m.tenants?.full_name} ({m.tenants?.phone}) · {shortDate(m.created_at)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {m.status !== "in_progress" && m.status !== "resolved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-7 text-xs px-2.5 text-blue-600"
                                onClick={() =>
                                  updateTicketMutation.mutate({ ticketId: m.id, status: "in_progress" })
                                }
                              >
                                Mark In Progress
                              </Button>
                            )}
                            {m.status !== "resolved" && (
                              <Button
                                size="sm"
                                className="rounded-full h-7 text-xs px-2.5 shadow-glow"
                                onClick={() =>
                                  updateTicketMutation.mutate({ ticketId: m.id, status: "resolved" })
                                }
                              >
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-xs text-muted-foreground italic">
                    No active maintenance tickets reported.
                  </p>
                )}
              </div>
            )}

            {/* TAB 4: PENDING APPROVALS & REQUESTS */}
            {activeTab === "requests" && (
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Clock className="size-4 text-amber-500" /> Submitted Landlord Requests
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tenant additions and move-out requests submitted by you, awaiting master landlord confirmation.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {ownRequests.length} Total
                  </Badge>
                </div>

                {ownRequests.length ? (
                  <div className="space-y-3">
                    {ownRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {req.request_type === "add_tenant" ? (
                              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                                <UserPlus className="size-3" /> New Tenant Onboarding
                              </span>
                            ) : (
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600 font-bold flex items-center gap-1 text-[11px]">
                                <UserMinus className="size-3" /> Tenant Move-Out Request
                              </span>
                            )}
                          </div>
                          <Badge
                            variant={req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary"}
                            className={`text-[10px] uppercase font-bold ${
                              req.status === "pending"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : req.status === "approved"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : ""
                            }`}
                          >
                            {req.status === "pending" ? "Pending Landlord Confirmation" : req.status}
                          </Badge>
                        </div>

                        <div className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
                          {req.request_type === "add_tenant" ? (
                            <>
                              <p className="font-bold text-foreground">
                                {req.data.full_name} ({req.data.phone})
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                Unit: {req.units?.unit_number || "Room"} · Rent: {money(req.data.rent_amount || 0)} · Deposit: {money(req.data.deposit_paid || 0)}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-foreground">
                                Move-Out: {req.data.full_name || req.tenants?.full_name}
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                Reason: {req.data.reason} · Departure: {req.data.departure_date}
                              </p>
                            </>
                          )}
                        </div>

                        <p className="text-[10px] text-muted-foreground">
                          Submitted on {shortDate(req.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-xs text-muted-foreground italic">
                    No submitted tenant requests.
                  </p>
                )}
              </div>
            )}

            {/* TAB 5: ISSUED RECEIPTS FEED */}
            {activeTab === "receipts" && (
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <FileCheck2 className="size-4 text-purple-500" /> Recent Receipts Issued
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Official digital receipts generated on-site for this building.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {portalData?.receipts.length ?? 0} Issued
                  </Badge>
                </div>

                {portalData?.receipts.length ? (
                  <div className="space-y-2.5">
                    {portalData.receipts.map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">{r.receipt_number}</span>
                            <span className="font-semibold text-xs">{r.tenants?.full_name || "Tenant"}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Issued {shortDate(r.issued_at)} · By {r.issued_by || "Caretaker"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-display font-bold text-xs sm:text-sm text-emerald-500">
                            {money(r.amount)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-8 px-2 text-xs text-emerald-600 gap-1"
                            onClick={() =>
                              handleShareReceiptWhatsApp(
                                r.public_id,
                                (r.snapshot as Record<string, string>)?.[`tenant_phone`] || "",
                                r.tenants?.full_name || "Tenant",
                                Number(r.amount),
                                r.receipt_number,
                              )
                            }
                          >
                            <MessageCircle className="size-3" /> WhatsApp
                          </Button>
                          <a
                            href={receiptUrl(r.public_id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center size-8 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
                            title="View Public Verified Receipt"
                          >
                            <Eye className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-xs text-muted-foreground italic">
                    No receipts recorded recently.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL 1: ADD / ONBOARD TENANT (REQUEST) */}
      <Dialog open={addTenantOpen} onOpenChange={setAddTenantOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <UserPlus className="size-5 text-primary" /> Onboard New Tenant
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in tenant details. This will be submitted as a pending request for landlord confirmation.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTenantUnitId) {
                toast.error("Please select a unit/room");
                return;
              }
              requestAddTenantMutation.mutate();
            }}
            className="space-y-3.5 pt-2"
          >
            {/* Unit / Room Selection */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select Room / Unit *</Label>
              <Select value={newTenantUnitId} onValueChange={handleUnitSelectForNewTenant}>
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Choose unit" />
                </SelectTrigger>
                <SelectContent>
                  {(portalData?.units || []).map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      Unit {u.unit_number || u.room_number || "—"} ({money(u.rent)}/mo) — {u.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tenant Name */}
            <div className="space-y-1">
              <Label htmlFor="ntName" className="text-xs font-semibold">Tenant Full Name *</Label>
              <Input
                id="ntName"
                required
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="e.g. Grace Wanjiku"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ntPhone" className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  id="ntPhone"
                  required
                  value={newTenantPhone}
                  onChange={(e) => setNewTenantPhone(e.target.value)}
                  placeholder="0712345678"
                  className="rounded-xl h-10 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ntEmail" className="text-xs font-semibold">Email (Optional)</Label>
                <Input
                  id="ntEmail"
                  type="email"
                  value={newTenantEmail}
                  onChange={(e) => setNewTenantEmail(e.target.value)}
                  placeholder="grace@example.com"
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>

            {/* Rent Amount & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ntRent" className="text-xs font-semibold">Monthly Rent (KSh) *</Label>
                <Input
                  id="ntRent"
                  type="number"
                  required
                  min={1}
                  value={newTenantRent}
                  onChange={(e) => setNewTenantRent(e.target.value)}
                  placeholder="15000"
                  className="rounded-xl h-10 text-xs font-bold font-display"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ntDep" className="text-xs font-semibold">Deposit Paid (KSh)</Label>
                <Input
                  id="ntDep"
                  type="number"
                  min={0}
                  value={newTenantDeposit}
                  onChange={(e) => setNewTenantDeposit(e.target.value)}
                  placeholder="15000"
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>

            {/* Lease Start Date */}
            <div className="space-y-1">
              <Label htmlFor="ntStart" className="text-xs font-semibold">Move-In / Lease Start Date</Label>
              <Input
                id="ntStart"
                type="date"
                value={newTenantStart}
                onChange={(e) => setNewTenantStart(e.target.value)}
                className="rounded-xl h-10 text-xs"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label htmlFor="ntNotes" className="text-xs font-semibold">Caretaker Onboarding Note</Label>
              <Input
                id="ntNotes"
                value={newTenantNotes}
                onChange={(e) => setNewTenantNotes(e.target.value)}
                placeholder="e.g. Keys handed over, electricity meter checked"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-full shadow-glow font-bold text-xs h-10"
                disabled={requestAddTenantMutation.isPending || !newTenantName || !newTenantPhone || !newTenantUnitId}
              >
                {requestAddTenantMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Submit Onboarding Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: VACATE / MOVE-OUT TENANT (REQUEST) */}
      <Dialog open={vacateOpen} onOpenChange={setVacateOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2 text-red-600">
              <UserMinus className="size-5" /> Request Tenant Move-Out
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit departure confirmation for Room {vacateTarget?.room} ({vacateTarget?.name}). Requires landlord approval.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!vacateReason) {
                toast.error("Please enter a move-out reason");
                return;
              }
              requestVacateTenantMutation.mutate();
            }}
            className="space-y-3.5 pt-2"
          >
            <div className="space-y-1">
              <Label htmlFor="vacDate" className="text-xs font-semibold">Departure Date</Label>
              <Input
                id="vacDate"
                type="date"
                value={vacateDate}
                onChange={(e) => setVacateDate(e.target.value)}
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="vacReason" className="text-xs font-semibold">Reason for Move-Out *</Label>
              <Input
                id="vacReason"
                required
                value={vacateReason}
                onChange={(e) => setVacateReason(e.target.value)}
                placeholder="e.g. Relocating, End of lease, Handed over keys"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                variant="destructive"
                className="w-full rounded-full font-bold text-xs h-10"
                disabled={requestVacateTenantMutation.isPending || !vacateReason}
              >
                {requestVacateTenantMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Submit Move-Out for Approval"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Instant Success Receipt Dialog */}
      <Dialog open={lastIssued !== null} onOpenChange={(open) => !open && setLastIssued(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7 text-center space-y-4">
          <div className="size-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="space-y-1">
            <DialogTitle className="font-display text-xl font-bold">Official Receipt Issued!</DialogTitle>
            <DialogDescription className="text-xs font-mono font-bold text-primary">
              {lastIssued?.receiptNumber}
            </DialogDescription>
          </div>

          {lastIssued ? (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenant Name:</span>
                <span className="font-bold text-foreground">{lastIssued.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit / Room:</span>
                <span className="font-mono font-bold">Room {lastIssued.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-emerald-500 font-display text-sm">{money(lastIssued.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuer:</span>
                <span className="text-muted-foreground">{session.name} (Caretaker)</span>
              </div>
            </div>
          ) : null}

          <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <Button
              className="rounded-full shadow-glow font-bold text-xs gap-1.5 h-10 w-full"
              onClick={() => {
                if (lastIssued) {
                  handleShareReceiptWhatsApp(
                    lastIssued.publicId,
                    lastIssued.phone,
                    lastIssued.tenantName,
                    lastIssued.amount,
                    lastIssued.receiptNumber,
                  );
                }
              }}
            >
              <MessageCircle className="size-4" /> Send to WhatsApp
            </Button>
            <a
              href={lastIssued ? receiptUrl(lastIssued.publicId) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted font-semibold text-xs h-10 w-full transition-colors"
            >
              <Download className="size-3.5 mr-1.5" /> Download PDF
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
