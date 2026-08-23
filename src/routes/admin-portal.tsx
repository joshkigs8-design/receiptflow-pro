import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  Gift,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
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
import { ThemeToggle } from "@/lib/theme";
import { money, shortDate } from "@/lib/format";
import {
  adminDirectAuth,
  getAdminOverview,
  grantAccess,
  createVoucher,
  listVouchers,
  setVoucherActive,
  deleteVoucher,
  listAdminWithdrawals,
  processWithdrawal,
  rejectWithdrawal,
  verifyAdmin2FAPin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin-portal")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mobile Admin Portal — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "High-security mobile-friendly administrative console for platform management, subscription grants, and affiliate payouts.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MobileAdminPage,
});

type AdminSession = {
  authenticated: boolean;
  token?: string;
  email?: string;
  is2FAEnabled: boolean;
};

const STORAGE_KEY = "rrp_mobile_admin_auth";

function MobileAdminPage() {
  const qc = useQueryClient();
  const authFn = useServerFn(adminDirectAuth);
  const overviewFn = useServerFn(getAdminOverview);
  const grantFn = useServerFn(grantAccess);
  const listVouchersFn = useServerFn(listVouchers);
  const createVoucherFn = useServerFn(createVoucher);
  const setVoucherActiveFn = useServerFn(setVoucherActive);
  const deleteVoucherFn = useServerFn(deleteVoucher);
  const listWithdrawalsFn = useServerFn(listAdminWithdrawals);
  const processWithdrawalFn = useServerFn(processWithdrawal);
  const rejectWithdrawalFn = useServerFn(rejectWithdrawal);
  const verify2FAFn = useServerFn(verifyAdmin2FAPin);

  // Authentication State
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loginMode, setLoginMode] = useState<"master_key" | "email">("master_key");
  const [masterKeyInput, setMasterKeyInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [twoFactorPinInput, setTwoFactorPinInput] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "landlords" | "vouchers" | "payouts" | "security">("overview");

  // Filter & Search State
  const [landlordSearch, setLandlordSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "trial" | "expired">("all");

  // 2FA Action Confirmation Modal State
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const [actionPin, setActionPin] = useState("");
  const [actionDescription, setActionDescription] = useState("");

  // Grant Modal State
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState<{ id: string; name: string; email: string } | null>(null);
  const [grantMonths, setGrantMonths] = useState<number>(1);
  const [grantReason, setGrantReason] = useState<string>("Promotion / Support courtesy");

  // New Voucher Modal State
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [newVoucherCode, setNewVoucherCode] = useState("");
  const [newVoucherMonths, setNewVoucherMonths] = useState(1);
  const [newVoucherMaxUses, setNewVoucherMaxUses] = useState(10);
  const [newVoucherNote, setNewVoucherNote] = useState("");

  // 2FA Security Preferences
  const [is2FARequired, setIs2FARequired] = useState(true);

  // Load Session from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSession(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const loginMutation = useMutation({
    mutationFn: () => {
      if (loginMode === "master_key") {
        return authFn({ data: { masterKey: masterKeyInput, twoFactorPin: twoFactorPinInput } });
      } else {
        return authFn({ data: { email: emailInput, password: passwordInput, twoFactorPin: twoFactorPinInput } });
      }
    },
    onSuccess: (res) => {
      const newSession: AdminSession = {
        authenticated: true,
        token: res.token || "admin_session",
        email: emailInput || "Master Admin",
        is2FAEnabled: true,
      };
      setSession(newSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      toast.success("Admin access granted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Authentication failed"),
  });

  function handleSignOut() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setMasterKeyInput("");
    setPasswordInput("");
    setTwoFactorPinInput("");
    toast.success("Locked admin console");
  }

  // Load Overview Data
  const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["mobile_admin_overview", session?.token],
    enabled: !!session?.authenticated,
    queryFn: () => overviewFn(),
  });

  // Load Vouchers
  const { data: vouchers = [], refetch: refetchVouchers } = useQuery({
    queryKey: ["mobile_admin_vouchers", session?.token],
    enabled: !!session?.authenticated,
    queryFn: () => listVouchersFn(),
  });

  // Load Withdrawals
  const { data: withdrawals = [], refetch: refetchWithdrawals } = useQuery({
    queryKey: ["mobile_admin_withdrawals", session?.token],
    enabled: !!session?.authenticated,
    queryFn: () => listWithdrawalsFn(),
  });

  // Security Guard for Sensitive Operations
  function request2FAProtectedAction(desc: string, action: () => Promise<void>) {
    if (!is2FARequired) {
      action();
      return;
    }
    setActionDescription(desc);
    setPendingAction(() => action);
    setActionPin("");
    setPinPromptOpen(true);
  }

  const verifyPinMutation = useMutation({
    mutationFn: () => verify2FAFn({ data: { pin: actionPin } }),
    onSuccess: async () => {
      setPinPromptOpen(false);
      if (pendingAction) {
        await pendingAction();
        setPendingAction(null);
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Invalid 2FA PIN"),
  });

  const grantMutation = useMutation({
    mutationFn: (args: { userId: string; months: number; reason: string }) =>
      grantFn({ data: args }),
    onSuccess: async () => {
      toast.success("Subscription extension applied successfully!");
      setGrantModalOpen(false);
      await refetchOverview();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to grant access"),
  });

  const createVoucherMutation = useMutation({
    mutationFn: () =>
      createVoucherFn({
        data: {
          code: newVoucherCode.trim().toUpperCase(),
          months: Number(newVoucherMonths),
          max_uses: Number(newVoucherMaxUses),
          note: newVoucherNote.trim() || null,
        },
      }),
    onSuccess: async () => {
      toast.success("Promotional voucher created!");
      setVoucherModalOpen(false);
      setNewVoucherCode("");
      setNewVoucherNote("");
      await refetchVouchers();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to create voucher"),
  });

  const toggleVoucherMutation = useMutation({
    mutationFn: (args: { id: string; active: boolean }) =>
      setVoucherActiveFn({ data: args }),
    onSuccess: async () => {
      toast.success("Voucher status updated");
      await refetchVouchers();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Action failed"),
  });

  const processWithdrawalMutation = useMutation({
    mutationFn: (args: { withdrawalId: string; mpesaReceiptNumber: string }) =>
      processWithdrawalFn({ data: args }),
    onSuccess: async () => {
      toast.success("Affiliate withdrawal marked as PAID!");
      await refetchWithdrawals();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Processing failed"),
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: (args: { withdrawalId: string; adminNote?: string }) =>
      rejectWithdrawalFn({ data: args }),
    onSuccess: async () => {
      toast.success("Withdrawal rejected and funds refunded to affiliate.");
      await refetchWithdrawals();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Rejection failed"),
  });

  // Filtered Landlords
  const allLandlords = overview?.landlords || [];
  const filteredLandlords = allLandlords.filter((l) => {
    const matchesSearch =
      (l.full_name || "").toLowerCase().includes(landlordSearch.toLowerCase()) ||
      (l.company_name || "").toLowerCase().includes(landlordSearch.toLowerCase()) ||
      (l.email || "").toLowerCase().includes(landlordSearch.toLowerCase()) ||
      (l.phone || "").includes(landlordSearch);

    const matchesStatus =
      statusFilter === "all" ? true : l.state === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ---------------------------------------------------------------------------
  // 1. UN-AUTHENTICATED: MOBILE ADMIN LOGIN SCREEN
  // ---------------------------------------------------------------------------
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <header className="flex h-16 items-center justify-between border-b border-border/80 px-5 sm:px-8 bg-card/60 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground font-bold shadow-glow">
              <ShieldCheck className="size-4" />
            </span>
            <span className="font-display font-bold text-sm tracking-tight">Admin Console</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md surface-card p-6 sm:p-8 rounded-3xl border-2 border-primary/20 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="size-14 rounded-2xl gradient-primary text-white flex items-center justify-center mx-auto shadow-glow">
                <Lock className="size-7" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Superadmin Mobile Portal</h1>
              <p className="text-xs text-muted-foreground">
                High-security management terminal. Direct login with your Master Security Key or Superadmin Credentials.
              </p>
            </div>

            {/* Login Mode Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-muted/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLoginMode("master_key")}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === "master_key" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                <KeyRound className="size-3.5 text-primary" /> Master Key
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("email")}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === "email" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                <Users className="size-3.5 text-primary" /> Email Login
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginMutation.mutate();
              }}
              className="space-y-4"
            >
              {loginMode === "master_key" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="masterKey" className="text-xs font-semibold">Master Security Passcode</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="masterKey"
                      type="password"
                      required
                      value={masterKeyInput}
                      onChange={(e) => setMasterKeyInput(e.target.value)}
                      placeholder="Enter Master Security Key"
                      className="pl-10 rounded-2xl h-11 text-xs font-mono"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="adminEmail" className="text-xs font-semibold">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="admin@rentreceipt.co.ke"
                      className="rounded-2xl h-11 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword" className="text-xs font-semibold">Admin Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="rounded-2xl h-11 text-xs"
                    />
                  </div>
                </>
              )}

              {/* 2FA PIN Input */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactorPin" className="text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-emerald-500" /> 6-Digit 2FA Security PIN
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-mono">Default: 889900</span>
                </div>
                <Input
                  id="twoFactorPin"
                  type="password"
                  maxLength={6}
                  value={twoFactorPinInput}
                  onChange={(e) => setTwoFactorPinInput(e.target.value)}
                  placeholder="••••••"
                  className="rounded-2xl h-11 font-mono tracking-widest text-center text-sm font-bold"
                />
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
                    <ShieldCheck className="size-4 mr-1.5" /> Unlock Superadmin Terminal
                  </>
                )}
              </Button>
            </form>

            <div className="pt-3 border-t border-border/60 text-center">
              <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">
                &larr; Return to Landlord Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATED: MOBILE SUPERADMIN CONSOLE
  // ---------------------------------------------------------------------------
  const stats = overview?.stats;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/80 px-4 sm:px-8 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground font-bold shadow-glow">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <h2 className="font-display font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
              Superadmin Console
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 py-0 font-mono">
                OWNER
              </Badge>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Mobile Terminal · 2FA Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOverview()}
            className="rounded-full size-8 p-0"
            title="Refresh Ledger"
          >
            <RefreshCw className="size-3.5 text-primary" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-full h-8 text-xs text-red-500 hover:bg-red-500/10 px-2.5 gap-1"
          >
            <Lock className="size-3" /> <span className="hidden sm:inline">Lock</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1.5 rounded-2xl bg-muted/70 border border-border/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === "overview" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="size-3.5 text-primary" />
            <span className="hidden sm:inline">KPIs</span>
            <span className="sm:hidden">KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("landlords")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === "landlords" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
            }`}
          >
            <Users className="size-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Landlords</span>
            <span className="sm:hidden">Users</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vouchers")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === "vouchers" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
            }`}
          >
            <Ticket className="size-3.5 text-purple-500" />
            <span className="hidden sm:inline">Vouchers</span>
            <span className="sm:hidden">Codes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payouts")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 relative ${
              activeTab === "payouts" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
            }`}
          >
            <Wallet className="size-3.5 text-amber-500" />
            <span className="hidden sm:inline">Affiliates</span>
            <span className="sm:hidden">Payouts</span>
            {withdrawals.filter((w) => w.status === "pending").length > 0 ? (
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === "security" ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
            }`}
          >
            <ShieldCheck className="size-3.5 text-blue-500" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">2FA</span>
          </button>
        </div>

        {isOverviewLoading ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="size-7 animate-spin text-primary" />
            <span className="text-xs">Decrypting platform ledger...</span>
          </div>
        ) : (
          <>
            {/* ----------------------------------------------------------------- */}
            {/* TAB 1: OVERVIEW METRICS */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "overview" && stats && (
              <div className="space-y-5">
                {/* Top KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="surface-card p-4 rounded-3xl border border-border/80 space-y-1">
                    <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <CreditCard className="size-3 text-emerald-500" /> Platform Revenue
                    </p>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-emerald-600">
                      {money(stats.revenue)}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Paystack payments</p>
                  </div>

                  <div className="surface-card p-4 rounded-3xl border border-border/80 space-y-1">
                    <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Users className="size-3 text-primary" /> Total Landlords
                    </p>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {stats.landlords}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {stats.paying} Paid · {stats.onTrial} Trial
                    </p>
                  </div>

                  <div className="surface-card p-4 rounded-3xl border border-border/80 space-y-1">
                    <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Building2 className="size-3 text-blue-500" /> Portfolio Scope
                    </p>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {stats.properties} Props
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {stats.units} Units · {stats.tenants} Tenants
                    </p>
                  </div>

                  <div className="surface-card p-4 rounded-3xl border border-border/80 space-y-1">
                    <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Receipt className="size-3 text-purple-500" /> Rent Tracked
                    </p>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {money(stats.rentTracked)}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">{stats.rentReceiptsIssued} receipts</p>
                  </div>
                </div>

                {/* Subscription Plan Breakdown */}
                <div className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 space-y-4">
                  <h4 className="font-display font-bold text-sm flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" /> Subscription Plan Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <span className="text-[11px] text-muted-foreground">Monthly (KSh 400)</span>
                      <p className="font-display font-bold text-base mt-0.5">{stats.planBreakdown.monthly}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <span className="text-[11px] text-muted-foreground">Quarterly (KSh 1.1k)</span>
                      <p className="font-display font-bold text-base mt-0.5">{stats.planBreakdown.quarterly}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <span className="text-[11px] text-muted-foreground">Semi-Annual (KSh 2.1k)</span>
                      <p className="font-display font-bold text-base mt-0.5">{stats.planBreakdown.semiannual}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-center">
                      <span className="text-[11px] text-muted-foreground">Yearly (KSh 4.0k)</span>
                      <p className="font-display font-bold text-base mt-0.5">{stats.planBreakdown.yearly}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Platform Subscription Payments */}
                <div className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 space-y-4">
                  <h4 className="font-display font-bold text-sm flex items-center gap-2">
                    <CreditCard className="size-4 text-emerald-500" /> Recent Paystack Platform Transactions
                  </h4>
                  {overview.payments.length ? (
                    <div className="space-y-2">
                      {overview.payments.slice(0, 10).map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-foreground">{p.name || p.email}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              Ref: {p.reference} · {shortDate(p.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-display font-bold text-emerald-600">
                              {money(p.amount)}
                            </span>
                            <Badge
                              variant="secondary"
                              className="block text-[10px] uppercase font-bold py-0 mt-0.5"
                            >
                              {p.plan}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-xs text-muted-foreground italic">
                      No platform subscription payments recorded yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 2: LANDLORDS & SUBSCRIPTION EXTENDER */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "landlords" && (
              <div className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Users className="size-4 text-emerald-500" /> Registered Landlord Accounts
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Search, view subscriber details, and grant 1-tap subscription extensions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        value={landlordSearch}
                        onChange={(e) => setLandlordSearch(e.target.value)}
                        placeholder="Search landlord, email, phone..."
                        className="pl-8 rounded-full text-xs h-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={(v: "all" | "paid" | "trial" | "expired") => setStatusFilter(v)}>
                      <SelectTrigger className="rounded-full text-xs h-9 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {filteredLandlords.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground truncate">
                            {l.full_name || l.company_name || "Landlord Account"}
                          </span>
                          <Badge
                            variant={l.state === "paid" ? "default" : l.state === "trial" ? "secondary" : "destructive"}
                            className={`text-[10px] uppercase font-bold py-0 ${
                              l.state === "paid"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : l.state === "trial"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  : ""
                            }`}
                          >
                            {l.state}
                          </Badge>
                          {l.isAffiliate && (
                            <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/30 py-0">
                              Affiliate
                            </Badge>
                          )}
                        </div>

                        <p className="text-[11px] text-muted-foreground font-mono">
                          {l.email} {l.phone ? `· ${l.phone}` : ""}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                          <span>🏢 {l.properties} Props</span>
                          <span>👥 {l.tenants} Tenants</span>
                          <span>💰 {money(l.rentCollected)} rent</span>
                          <span>⏳ Ends: {l.endsAt ? shortDate(l.endsAt) : "—"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedLandlord({
                              id: l.id,
                              name: l.full_name || l.company_name || l.email,
                              email: l.email,
                            });
                            setGrantMonths(1);
                            setGrantModalOpen(true);
                          }}
                          className="rounded-full text-xs h-8 px-3 text-primary border-primary/30 hover:bg-primary/10 gap-1"
                        >
                          <Gift className="size-3" /> Grant Access
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 3: PROMOTIONAL VOUCHERS */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "vouchers" && (
              <div className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Ticket className="size-4 text-purple-500" /> Platform Voucher Engine
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Issue promotional free-access voucher codes for marketing campaigns.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setVoucherModalOpen(true)}
                    className="rounded-full shadow-glow text-xs font-semibold gap-1 h-9"
                  >
                    <Plus className="size-3.5" /> New Voucher
                  </Button>
                </div>

                <div className="space-y-3 pt-2">
                  {vouchers.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-primary">{v.code}</span>
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {v.months} {v.months === 1 ? "Month" : "Months"} Free
                          </Badge>
                          <Badge
                            variant={v.active ? "default" : "secondary"}
                            className={`text-[10px] ${v.active ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}`}
                          >
                            {v.active ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Used: {v.used_count} / {v.max_uses} max {v.note ? `· "${v.note}"` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            request2FAProtectedAction("Toggle voucher status", async () => {
                              await toggleVoucherMutation.mutateAsync({ id: v.id, active: !v.active });
                            });
                          }}
                          className="h-8 text-xs rounded-full"
                        >
                          {v.active ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 4: AFFILIATE PAYOUT APPROVALS */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "payouts" && (
              <div className="surface-card p-5 sm:p-6 rounded-3xl border border-border/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold flex items-center gap-2">
                      <Wallet className="size-4 text-amber-500" /> Affiliate M-Pesa Withdrawal Queue
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Review, approve, and disburse referral commission earnings to affiliates.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {withdrawals.length} Requests
                  </Badge>
                </div>

                <div className="space-y-3 pt-2">
                  {withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-foreground">{w.affiliate_email}</span>
                            <Badge
                              variant={w.status === "paid" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}
                              className={`text-[10px] uppercase font-bold ${
                                w.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""
                              }`}
                            >
                              {w.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            M-Pesa: {w.mpesa_phone || "—"} ({w.affiliate_email}) · Requested {shortDate(w.requested_at)}
                          </p>
                        </div>
                        <span className="font-display font-bold text-emerald-600 text-sm sm:text-base">
                          {money(w.amount)}
                        </span>
                      </div>

                      {w.status === "pending" && (
                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                          <Button
                            size="sm"
                            className="rounded-full shadow-glow font-bold text-xs h-8 flex-1 gap-1"
                            onClick={() => {
                              const refCode = window.prompt("Enter M-Pesa Transaction Code (e.g. SHB81920KA):");
                              if (!refCode) return;
                              request2FAProtectedAction("Approve affiliate payout", async () => {
                                await processWithdrawalMutation.mutateAsync({
                                  withdrawalId: w.id,
                                  mpesaReceiptNumber: refCode.trim().toUpperCase(),
                                });
                              });
                            }}
                          >
                            <Check className="size-3.5" /> Approve &amp; Mark Paid
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full text-xs text-red-500 hover:bg-red-500/10 h-8 px-3"
                            onClick={() => {
                              request2FAProtectedAction("Reject affiliate payout", async () => {
                                await rejectWithdrawalMutation.mutateAsync({
                                  withdrawalId: w.id,
                                  adminNote: "Details mismatch / manual review needed",
                                });
                              });
                            }}
                          >
                            <X className="size-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 5: SECURITY & 2FA CONFIGURATION */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "security" && (
              <div className="surface-card p-6 rounded-3xl border border-border/80 space-y-6">
                <div>
                  <h3 className="font-display text-base font-bold flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-500" /> Platform Security &amp; 2FA Control
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Superadmin authentication policies, Master PIN protection, and mobile Android bookmarking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">Require 2FA PIN for Sensitive Actions</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Enforces 6-digit Security PIN verification before granting subscriptions or disbursing affiliate payouts.
                      </p>
                    </div>
                    <Switch
                      checked={is2FARequired}
                      onCheckedChange={(c) => {
                        setIs2FARequired(c);
                        toast.success(c ? "2FA verification enabled" : "2FA verification bypassed");
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-600 flex items-center gap-1.5">
                    <Smartphone className="size-3.5" /> How to Access on Your Android Phone
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Open Chrome on your phone and navigate to: <code className="font-mono text-foreground font-bold">https://rentreceipt.co.ke/admin-portal</code></li>
                    <li>Tap the 3-dots menu in Chrome &rarr; select <strong>"Add to Home screen"</strong>.</li>
                    <li>This installs the Admin Portal as a dedicated standalone app icon on your phone!</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: 2FA PIN VERIFICATION PROMPT */}
      <Dialog open={pinPromptOpen} onOpenChange={setPinPromptOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="size-6" />
          </div>

          <div className="space-y-1">
            <DialogTitle className="font-display text-base font-bold">Superadmin 2FA Verification</DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your 6-digit Master PIN to execute: <br />
              <strong className="text-foreground">{actionDescription}</strong>
            </DialogDescription>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyPinMutation.mutate();
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              maxLength={6}
              autoFocus
              value={actionPin}
              onChange={(e) => setActionPin(e.target.value)}
              placeholder="••••••"
              className="rounded-2xl h-12 font-mono tracking-widest text-center text-base font-bold"
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-full rounded-full shadow-glow font-bold text-xs h-10"
                disabled={verifyPinMutation.isPending || actionPin.length < 4}
              >
                {verifyPinMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Verify & Execute"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: GRANT SUBSCRIPTION EXTENSION */}
      <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
              <Gift className="size-5 text-primary" /> Grant Platform Access
            </DialogTitle>
            <DialogDescription className="text-xs">
              Extend subscription access for <strong className="text-foreground">{selectedLandlord?.name}</strong> ({selectedLandlord?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Duration to Grant</Label>
              <Select value={String(grantMonths)} onValueChange={(v) => setGrantMonths(Number(v))}>
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">+1 Month Free</SelectItem>
                  <SelectItem value="3">+3 Months Free</SelectItem>
                  <SelectItem value="6">+6 Months Free</SelectItem>
                  <SelectItem value="12">+1 Year (12 Months) Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="grantReason" className="text-xs font-semibold">Reason for Grant</Label>
              <Input
                id="grantReason"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                placeholder="e.g. VIP onboarding / Special courtesy"
                className="rounded-xl h-10 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              className="w-full rounded-full shadow-glow font-bold text-xs h-10"
              disabled={grantMutation.isPending}
              onClick={() => {
                if (!selectedLandlord) return;
                request2FAProtectedAction(`Grant ${grantMonths} month(s) to ${selectedLandlord.name}`, async () => {
                  await grantMutation.mutateAsync({
                    userId: selectedLandlord.id,
                    months: grantMonths,
                    reason: grantReason,
                  });
                });
              }}
            >
              {grantMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Confirm Extension"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: CREATE VOUCHER */}
      <Dialog open={voucherModalOpen} onOpenChange={setVoucherModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
              <Ticket className="size-5 text-purple-500" /> Create Platform Voucher
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate a promo code landlords can redeem during signup or in billing.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              request2FAProtectedAction(`Create voucher ${newVoucherCode}`, async () => {
                await createVoucherMutation.mutateAsync();
              });
            }}
            className="space-y-3 pt-1"
          >
            <div className="space-y-1">
              <Label htmlFor="vCode" className="text-xs font-semibold">Promo Code (e.g. KENYA2026) *</Label>
              <Input
                id="vCode"
                required
                value={newVoucherCode}
                onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                placeholder="VIPFREE"
                className="rounded-xl h-10 font-mono font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="vMonths" className="text-xs font-semibold">Free Months *</Label>
                <Input
                  id="vMonths"
                  type="number"
                  required
                  min={1}
                  max={60}
                  value={newVoucherMonths}
                  onChange={(e) => setNewVoucherMonths(Number(e.target.value))}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="vMax" className="text-xs font-semibold">Max Redemptions *</Label>
                <Input
                  id="vMax"
                  type="number"
                  required
                  min={1}
                  max={10000}
                  value={newVoucherMaxUses}
                  onChange={(e) => setNewVoucherMaxUses(Number(e.target.value))}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="vNote" className="text-xs font-semibold">Campaign Note</Label>
              <Input
                id="vNote"
                value={newVoucherNote}
                onChange={(e) => setNewVoucherNote(e.target.value)}
                placeholder="e.g. Twitter launch promo"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-full shadow-glow font-bold text-xs h-10"
                disabled={createVoucherMutation.isPending || !newVoucherCode}
              >
                {createVoucherMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Generate Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

