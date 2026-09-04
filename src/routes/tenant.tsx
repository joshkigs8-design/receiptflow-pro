import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building,
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
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  Phone,
  PhoneCall,
  Receipt,
  RefreshCw,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Wallet,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { submitTenantRequest, verifyTenant } from "@/lib/portal.functions";
import { initiateTenantMpesaPayment, getMpesaPaymentStatus } from "@/lib/mpesa.functions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Field } from "@/components/app/Field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function TenantPortal() {
  const verify = useServerFn(verifyTenant);
  const submit = useServerFn(submitTenantRequest);
  const initiateMpesa = useServerFn(initiateTenantMpesaPayment);
  const checkMpesaStatus = useServerFn(getMpesaPaymentStatus);

  const [creds, setCreds] = useState({ code: "", room: "", phone: "" });
  const [portal, setPortal] = useState<PortalData | null>(null);
  const [request, setRequest] = useState({
    category: "plumbing",
    priority: "normal",
    description: "",
  });

  // M-Pesa Payment Dialog & Flow State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payPhone, setPayPhone] = useState<string>("");
  const [payStep, setPayStep] = useState<"form" | "sending" | "waiting_pin" | "success" | "failed">("form");
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [stkCustomerMessage, setStkCustomerMessage] = useState<string>("");
  const [confirmedMpesaReceipt, setConfirmedMpesaReceipt] = useState<string | null>(null);
  const [confirmedPublicId, setConfirmedPublicId] = useState<string | null>(null);
  const [confirmedReceiptNumber, setConfirmedReceiptNumber] = useState<string | null>(null);
  const [confirmedNewBalance, setConfirmedNewBalance] = useState<number | null>(null);
  const [payErrorMessage, setPayErrorMessage] = useState<string | null>(null);
  const [stkTimer, setStkTimer] = useState<number>(60);

  // Initialize pay fields when portal loads or modal opens
  const openPayModal = () => {
    if (!portal) return;
    const defaultAmount = portal.totals.rentBalance > 0 ? portal.totals.rentBalance : portal.tenant.rent_amount;
    setPayAmount(defaultAmount);
    setPayPhone(portal.tenant.phone || creds.phone || "");
    setPayStep("form");
    setPayErrorMessage(null);
    setConfirmedMpesaReceipt(null);
    setConfirmedPublicId(null);
    setIsPayModalOpen(true);
  };

  // M-Pesa STK Push Initiation Mutation
  const payMutation = useMutation({
    mutationFn: async () => {
      if (!portal) throw new Error("Tenant session not loaded");
      if (payAmount <= 0) throw new Error("Please enter a valid amount greater than zero.");
      if (!payPhone.trim()) throw new Error("Please enter your M-Pesa phone number.");

      setPayStep("sending");
      setPayErrorMessage(null);

      const res = await initiateMpesa({
        data: {
          tenantId: portal.tenant.id,
          propertyCode: portal.property.code,
          room: creds.room,
          verifiedPhone: creds.phone,
          amount: payAmount,
          paymentPhone: payPhone.trim(),
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      return res;
    },
    onSuccess: (res) => {
      setCurrentTransactionId(res.transactionId);
      setStkCustomerMessage(res.customerMessage || "Check your phone for the M-Pesa PIN prompt.");
      setStkTimer(60);
      setPayStep("waiting_pin");
      toast.success("M-Pesa STK Push sent! Please check your phone.");
    },
    onError: (err: any) => {
      setPayStep("form");
      const msg = err?.message || "Could not send STK Push. Please verify details.";
      setPayErrorMessage(msg);
      toast.error(msg);
    },
  });

  // Polling Effect while waiting for M-Pesa PIN / Callback
  useEffect(() => {
    if (payStep !== "waiting_pin" || !currentTransactionId) return;

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setStkTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Status polling interval every 2500ms
    const pollInterval = setInterval(async () => {
      try {
        const res = await checkMpesaStatus({
          data: { transactionId: currentTransactionId },
        });

        if (res.status === "success") {
          clearInterval(pollInterval);
          clearInterval(countdownInterval);
          setConfirmedMpesaReceipt(res.mpesaReceiptNumber || "CONFIRMED");
          setConfirmedPublicId(res.publicReceiptId || null);
          setConfirmedReceiptNumber(res.receiptNumber || null);
          setConfirmedNewBalance(res.balance ?? 0);
          setPayStep("success");
          toast.success("🎉 Payment received & verified! Digital receipt ready.");
          // Refresh portal data
          login.mutate(creds);
        } else if (res.status === "failed" || res.status === "cancelled" || res.status === "timeout") {
          clearInterval(pollInterval);
          clearInterval(countdownInterval);
          setPayStep("failed");
          setPayErrorMessage(res.resultDesc || "Payment was not completed on your phone.");
          toast.error(res.resultDesc || "M-Pesa payment failed or was cancelled.");
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 2500);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [payStep, currentTransactionId]);

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

  // Hydration-safe credentials restore
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCreds(parsed);
        if (parsed.code && parsed.room && parsed.phone && !portal) {
          login.mutate(parsed);
        }
      }
    } catch {}
  }, []);

  const raise = useMutation({
    mutationFn: () => submit({ data: { ...creds, ...request } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Maintenance request submitted successfully");
      setRequest({ category: "plumbing", priority: "normal", description: "" });
      login.mutate(creds);
    },
    onError: () => toast.error("Failed to submit request"),
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Total Balance Due</p>
                  {((portal.totals as any).priorArrears ?? 0) > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20">
                      Has Past Arrears
                    </span>
                  ) : null}
                </div>
                <p className={`mt-2 font-display text-2xl font-bold ${portal.totals.rentBalance > 0 ? "text-rose-500 font-mono" : "text-foreground"}`}>
                  {money(portal.totals.rentBalance)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Remaining for this cycle</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {((portal.totals as any).priorArrears ?? 0) > 0
                    ? `Current Month: ${money((portal.totals as any).thisMonthBalance ?? 0)} · Past Arrears: +${money((portal.totals as any).priorArrears ?? 0)}`
                    : "Total balance outstanding"}
                </p>
              </div>

              <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-medium">Deposit on Record</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">
                  {money(portal.tenant.deposit_paid)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Security deposit held</p>
              </div>
            </div>

            {/* M-Pesa STK Push Instant Payment Hero Banner (Only shown if Landlord enabled M-Pesa) */}
            {portal.mpesaEnabled ? (
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-100 backdrop-blur-sm border border-white/20">
                      <Smartphone className="size-3.5" /> Instant Safaricom Daraja STK Push
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                      Pay Rent with M-Pesa
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                      Send rent securely to {portal.landlord.company_name}’s registered M-Pesa account. Receive an instant PIN prompt on your phone and get an official QR-verified PDF receipt immediately.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button
                      size="lg"
                      onClick={openPayModal}
                      className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 shadow-lg hover:shadow-xl transition-all gap-2 h-12 text-sm sm:text-base shrink-0 border-0"
                    >
                      <Smartphone className="size-4 text-emerald-600" />
                      Pay with M-Pesa ({portal.totals.rentBalance > 0 ? money(portal.totals.rentBalance) : money(portal.tenant.rent_amount)})
                      <ArrowRight className="size-4 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* KCB BUNI Paybill & Bank Payment Card (Only shown if Landlord enabled KCB) */}
            {portal.kcbEnabled && portal.kcbDetails ? (
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white shadow-xl shadow-blue-950/20 border border-blue-500/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-lg">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-100 backdrop-blur-sm border border-white/20">
                      <Building className="size-3.5" /> KCB BUNI Instant Bank &amp; Paybill Collection
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                      Pay Rent via KCB PayBill
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                      Pay directly via KCB App, Vooma, or M-Pesa Paybill. Payments are automatically reconciled with an instant official digital receipt.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2.5 min-w-[260px] text-xs">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2">
                      <span className="text-blue-200">KCB PayBill No:</span>
                      <span className="font-mono font-bold text-sm tracking-wider">{portal.kcbDetails.paybillNumber}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-blue-200">Account / Ref:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm bg-white/15 px-2 py-0.5 rounded-lg tracking-wider">
                          {portal.kcbDetails.reference}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-white/20 text-white rounded-md"
                          onClick={() => {
                            navigator.clipboard.writeText(portal.kcbDetails!.reference);
                            toast.success(`Copied Account Reference: ${portal.kcbDetails!.reference}`);
                          }}
                        >
                          <Copy className="size-3" />
                        </Button>
                      </div>
                    </div>
                    {portal.kcbDetails.accountNumber && (
                      <div className="flex items-center justify-between border-t border-white/15 pt-2 text-[11px]">
                        <span className="text-blue-200">KCB Account:</span>
                        <span className="font-mono text-white/90">{portal.kcbDetails.accountNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

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
                          <TableCell className="text-xs capitalize font-medium">{p.method || "M-Pesa"}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground select-all">
                            {p.reference || "—"}
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

        {/* Interactive M-Pesa STK Push Payment Modal */}
        <Dialog open={isPayModalOpen} onOpenChange={(open) => {
          if (payStep === "waiting_pin") {
            toast.info("Payment request is still processing on your phone...");
          }
          setIsPayModalOpen(open);
        }}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 border-border/80">
            {payStep === "form" && portal && (
              <div className="space-y-5">
                <DialogHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <Smartphone className="size-3.5" /> Lipa Na M-Pesa Online
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {portal.property.code}
                    </Badge>
                  </div>
                  <DialogTitle className="font-display text-xl font-bold">
                    Pay Rent with M-Pesa
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Payment will be credited directly to <strong>{portal.landlord.company_name}</strong> for <strong>Unit {portal.tenant.unit || portal.tenant.room}</strong>.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                  {/* Current Balance / Due Pill */}
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Outstanding Rent Due
                      </span>
                      <p className="font-display text-lg font-bold text-foreground">
                        {money(portal.totals.rentBalance > 0 ? portal.totals.rentBalance : portal.tenant.rent_amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="rounded-full text-xs h-7 px-2.5 font-semibold"
                        onClick={() => setPayAmount(portal.totals.rentBalance > 0 ? portal.totals.rentBalance : portal.tenant.rent_amount)}
                      >
                        Full Due
                      </Button>
                      {portal.totals.rentBalance > 1000 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full text-xs h-7 px-2.5"
                          onClick={() => setPayAmount(Math.round(portal.totals.rentBalance / 2))}
                        >
                          50%
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="payAmount" className="text-xs font-semibold">
                      Amount to Pay (KSh) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        KSh
                      </span>
                      <Input
                        id="payAmount"
                        type="number"
                        min={1}
                        max={300000}
                        step={1}
                        value={payAmount || ""}
                        onChange={(e) => setPayAmount(Math.max(0, Number(e.target.value)))}
                        className="pl-14 h-11 rounded-2xl font-display text-lg font-bold"
                        placeholder="10000"
                        required
                      />
                    </div>
                    {payAmount > portal.totals.rentBalance && portal.totals.rentBalance > 0 && (
                      <p className="text-[11px] text-amber-500 flex items-center gap-1">
                        <AlertCircle className="size-3" /> Note: This amount exceeds your current monthly balance.
                      </p>
                    )}
                  </div>

                  {/* M-Pesa Phone Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="payPhone" className="text-xs font-semibold">
                      M-Pesa Phone Number *
                    </Label>
                    <Input
                      id="payPhone"
                      type="tel"
                      placeholder="e.g. 0712345678 or 0112345678"
                      value={payPhone}
                      onChange={(e) => setPayPhone(e.target.value)}
                      className="font-mono h-11 rounded-2xl font-semibold"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">
                      You will receive an official Safaricom PIN prompt on this mobile line.
                    </p>
                  </div>

                  {payErrorMessage && (
                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2">
                      <XCircle className="size-4 shrink-0 mt-0.5" />
                      <span>{payErrorMessage}</span>
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-2 sm:justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-xs"
                    onClick={() => setIsPayModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => payMutation.mutate()}
                    disabled={payMutation.isPending || payAmount <= 0 || !payPhone.trim()}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 h-11 gap-2 shadow-glow text-xs sm:text-sm"
                  >
                    <Smartphone className="size-4" /> Pay with M-Pesa ({money(payAmount)})
                  </Button>
                </DialogFooter>
              </div>
            )}

            {payStep === "sending" && (
              <div className="py-10 text-center space-y-4">
                <div className="size-16 rounded-full bg-emerald-500/15 text-emerald-600 mx-auto flex items-center justify-center animate-pulse">
                  <Loader2 className="size-8 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold">Contacting Safaricom Daraja...</h3>
                  <p className="text-xs text-muted-foreground">Generating secure Lipa Na M-Pesa STK Push request</p>
                </div>
              </div>
            )}

            {payStep === "waiting_pin" && (
              <div className="py-6 text-center space-y-5">
                <div className="relative size-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="relative size-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Smartphone className="size-9 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h3 className="font-display text-xl font-bold">Check Your Phone!</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Safaricom has sent an STK prompt of <strong>{money(payAmount)}</strong> to <strong>{payPhone}</strong>.
                  </p>
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 mt-2">
                    <Lock className="size-3.5 text-emerald-600" /> Enter your M-Pesa PIN on your phone to approve.
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground pt-1">
                  <Clock className="size-3.5" /> Waiting for confirmation ({stkTimer}s)...
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => {
                      setPayStep("form");
                    }}
                  >
                    Cancel / Modify
                  </Button>
                </div>
              </div>
            )}

            {payStep === "success" && (
              <div className="py-6 text-center space-y-5">
                <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-10" />
                </div>

                <div className="space-y-1">
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs mb-1">
                    ✓ Verified by Safaricom
                  </Badge>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {money(payAmount)} Paid!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your rent payment has been recorded &amp; balance updated.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">M-Pesa Receipt:</span>
                    <span className="font-mono font-bold text-foreground">{confirmedMpesaReceipt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipt Number:</span>
                    <span className="font-mono text-foreground">{confirmedReceiptNumber || "Generated"}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2 font-semibold">
                    <span className="text-muted-foreground">Remaining Balance:</span>
                    <span className="text-emerald-600">{money(confirmedNewBalance ?? 0)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {confirmedPublicId && (
                    <a
                      href={receiptUrl(confirmedPublicId)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full rounded-full gap-1.5 text-xs font-bold h-10 shadow-glow">
                        <Download className="size-3.5" /> View Official PDF Receipt
                      </Button>
                    </a>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full text-xs h-10"
                    onClick={() => setIsPayModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {payStep === "failed" && (
              <div className="py-6 text-center space-y-5">
                <div className="size-16 rounded-full bg-rose-500/15 text-rose-600 mx-auto flex items-center justify-center">
                  <XCircle className="size-10" />
                </div>

                <div className="space-y-1 max-w-xs mx-auto">
                  <h3 className="font-display text-xl font-bold text-foreground">Payment Not Completed</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {payErrorMessage || "The payment could not be confirmed. No money was deducted from your account."}
                  </p>
                </div>

                <div className="pt-2 flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full text-xs h-10 px-4"
                    onClick={() => setIsPayModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="rounded-full text-xs font-bold h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setPayStep("form")}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
