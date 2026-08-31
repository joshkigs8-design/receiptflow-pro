import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowUpDown,
  BadgeCheck,
  Building,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  Gift,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  LogOut,
  MoreHorizontal,
  Phone,
  Plus,
  Power,
  Receipt,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Ticket,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/lib/theme";
import { AiBulkImporter } from "@/components/admin/AiBulkImporter";
import {
  createVoucher,
  deleteVoucher,
  getAdminOverview,
  getAffiliateStats,
  getIsAdmin,
  getLandlordPortfolio,
  grantAccess,
  listAdminWithdrawals,
  listPlatformPayments,
  listVouchers,
  processWithdrawal,
  rejectWithdrawal,
  setAffiliateStatus,
  setVoucherActive,
  startProcessingWithdrawal,
  updateLandlordSubscription,
} from "@/lib/admin.functions";
import {
  getAdminLandlordMpesaSettings,
  listAdminMpesaTransactions,
  saveAdminLandlordMpesaSettings,
  testLandlordMpesaConnection,
} from "@/lib/mpesa.functions";
import {
  getAdminLandlordKcbSettings,
  listAdminKcbTransactions,
  saveAdminLandlordKcbSettings,
  testLandlordKcbConnection,
} from "@/lib/payments/kcb.functions";
import { money, shortDate } from "@/lib/format";

const title = "Owner Admin Portal — Rent Receipt Pro";
const description =
  "Private owner control centre for Rent Receipt Pro: landlord accounts, subscription revenue, voucher codes, platform payments, and affiliate payouts.";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoute,
});

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "RRP-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const stateStyles: Record<string, string> = {
  paid: "gradient-primary text-primary-foreground shadow-glow",
  trial: "bg-amber-500/15 text-amber-500 border border-amber-500/30",
  expired: "bg-destructive/15 text-destructive border border-destructive/30",
};

function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length || !rows[0]) {
    toast.error("No data to export");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? "";
          const str = typeof val === "object" ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Exported ${rows.length} rows to CSV`);
}

function AdminFrame({
  children,
  onSignOut,
  onRefresh,
  isRefreshing,
}: {
  children: ReactNode;
  onSignOut?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-base font-bold">Owner Admin Portal</p>
            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider text-primary border-primary/40 bg-primary/5">
              Superadmin
            </Badge>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Codevanta Ventures · Rent Receipt Pro Enterprise Console
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 text-xs gap-1.5"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          ) : null}

          <ThemeToggle />

          {onSignOut ? (
            <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs gap-1.5" onClick={onSignOut}>
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

function AdminSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSignedIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function createOwner() {
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: { full_name: "Owner", company_name: "Codevanta Ventures" },
        },
      });
      if (error) throw error;
      if (!data.session) {
        toast.success("Confirm the link we emailed you, then sign in here.");
        return;
      }
      onSignedIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the owner account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.70_0.215_48_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.79_0.17_65_/_0.20),transparent_60%)] animate-aurora" />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="surface-card relative w-full max-w-md p-8 shadow-2xl border border-border/80">
        <span className="gradient-primary flex size-12 items-center justify-center rounded-2xl shadow-glow">
          <ShieldCheck className="size-6 text-primary-foreground" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Owner Admin Console</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Authorized owner access to Codevanta Ventures &amp; Rent Receipt Pro controls.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Owner email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              autoComplete="email"
              placeholder="admin@codevanta.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full rounded-full shadow-glow font-semibold" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Access Admin Console"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full text-xs"
            disabled={busy}
            onClick={createOwner}
          >
            First time? Initialize Owner Account
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminRoute() {
  const qc = useQueryClient();
  const checkAdmin = useServerFn(getIsAdmin);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      setSignedIn(Boolean(data.user));
      return { user: Boolean(data.user) };
    },
  });

  const { data: role, isLoading: roleLoading, refetch, isFetching } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkAdmin(),
    enabled: signedIn === true,
    retry: false,
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    setSignedIn(false);
  }

  if (signedIn === null) {
    return (
      <AdminFrame>
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AdminFrame>
    );
  }

  if (signedIn === false) {
    return (
      <AdminSignIn
        onSignedIn={async () => {
          setSignedIn(true);
          await qc.invalidateQueries();
        }}
      />
    );
  }

  if (roleLoading) {
    return (
      <AdminFrame onSignOut={signOut}>
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AdminFrame>
    );
  }

  if (!role?.admin) {
    return (
      <AdminFrame onSignOut={signOut}>
        <div className="surface-card mx-auto max-w-md p-10 text-center shadow-xl">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <ShieldAlert className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">Owner Access Required</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            This portal is restricted to authorized Codevanta Ventures platform administrators.
          </p>
          <Button variant="outline" className="mt-6 rounded-full" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame
      onSignOut={signOut}
      onRefresh={() => {
        void qc.invalidateQueries();
      }}
      isRefreshing={isFetching}
    >
      <AdminDashboard />
    </AdminFrame>
  );
}

function AdminDashboard() {
  const qc = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);
  const fetchVouchers = useServerFn(listVouchers);
  const addVoucher = useServerFn(createVoucher);
  const toggleVoucher = useServerFn(setVoucherActive);
  const removeVoucher = useServerFn(deleteVoucher);
  const extend = useServerFn(grantAccess);
  const updateSub = useServerFn(updateLandlordSubscription);
  const fetchLandlordPortfolio = useServerFn(getLandlordPortfolio);
  const fetchPlatformPayments = useServerFn(listPlatformPayments);
  const fetchAdminMpesa = useServerFn(listAdminMpesaTransactions);
  const fetchAdminLandlordMpesa = useServerFn(getAdminLandlordMpesaSettings);
  const saveAdminLandlordMpesa = useServerFn(saveAdminLandlordMpesaSettings);
  const testMpesa = useServerFn(testLandlordMpesaConnection);
  const fetchAdminKcb = useServerFn(listAdminKcbTransactions);
  const fetchAdminLandlordKcb = useServerFn(getAdminLandlordKcbSettings);
  const saveAdminLandlordKcb = useServerFn(saveAdminLandlordKcbSettings);
  const testKcb = useServerFn(testLandlordKcbConnection);

  // Queries
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
  });
  const { data: vouchers } = useQuery({
    queryKey: ["admin-vouchers"],
    queryFn: () => fetchVouchers(),
  });
  const { data: platformPayments } = useQuery({
    queryKey: ["platform-payments"],
    queryFn: () => fetchPlatformPayments(),
  });
  const { data: mpesaTransactions = [], isLoading: mpesaLoading, refetch: refetchMpesa } = useQuery({
    queryKey: ["admin_mpesa_transactions"],
    queryFn: () => fetchAdminMpesa(),
  });
  const { data: kcbTransactions = [], isLoading: kcbLoading, refetch: refetchKcb } = useQuery({
    queryKey: ["admin_kcb_transactions"],
    queryFn: () => fetchAdminKcb(),
  });

  // State: Global Filters & Search
  const [activeTab, setActiveTab] = useState("overview");
  const [landlordSearch, setLandlordSearch] = useState("");
  const [landlordFilter, setLandlordFilter] = useState<"all" | "paid" | "trial" | "expired">("all");
  const [subPaymentSearch, setSubPaymentSearch] = useState("");
  const [subPlanFilter, setSubPlanFilter] = useState<string>("all");
  const [platformPaymentSearch, setPlatformPaymentSearch] = useState("");
  const [paymentProviderTab, setPaymentProviderTab] = useState<"mpesa" | "kcb">("mpesa");
  const [mpesaSearch, setMpesaSearch] = useState("");
  const [mpesaStatusFilter, setMpesaStatusFilter] = useState<string>("all");
  const [selectedMpesaTx, setSelectedMpesaTx] = useState<any | null>(null);
  const [mpesaPayloadModalOpen, setMpesaPayloadModalOpen] = useState(false);
  const [kcbSearch, setKcbSearch] = useState("");
  const [kcbStatusFilter, setKcbStatusFilter] = useState<string>("all");
  const [selectedKcbTx, setSelectedKcbTx] = useState<any | null>(null);
  const [kcbPayloadModalOpen, setKcbPayloadModalOpen] = useState(false);

  // Modals state
  const [selectedLandlord, setSelectedLandlord] = useState<any | null>(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editAccessModalOpen, setEditAccessModalOpen] = useState(false);
  const [adminMpesaModalOpen, setAdminMpesaModalOpen] = useState(false);
  const [adminKcbModalOpen, setAdminKcbModalOpen] = useState(false);
  const [customPlan, setCustomPlan] = useState<"monthly" | "quarterly" | "semiannual" | "yearly">("monthly");
  const [customEndsAt, setCustomEndsAt] = useState("");
  const [customStatus, setCustomStatus] = useState<"active" | "trial" | "expired">("active");

  const [adminMpesaForm, setAdminMpesaForm] = useState({
    shortcode: "",
    consumer_key: "",
    consumer_secret: "",
    passkey: "",
    environment: "sandbox" as "sandbox" | "production",
    transaction_type: "CustomerPayBillOnline" as "CustomerPayBillOnline" | "CustomerBuyGoodsOnline",
    account_reference_prefix: "RRP",
    is_active: true,
  });

  const [adminKcbForm, setAdminKcbForm] = useState({
    paybill_number: "",
    account_number: "",
    client_key: "",
    client_secret: "",
    ipn_secret_token: "",
    environment: "sandbox" as "sandbox" | "production",
    account_reference_prefix: "RR",
    is_active: true,
  });

  // Voucher Generator Form
  const [code, setCode] = useState(randomCode);
  const [months, setMonths] = useState("1");
  const [maxUses, setMaxUses] = useState("1");
  const [expires, setExpires] = useState("");
  const [note, setNote] = useState("");

  // Portfolio Inspector query
  const { data: landlordPortfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["landlord-portfolio", selectedLandlord?.id],
    queryFn: () => fetchLandlordPortfolio({ data: { landlordId: selectedLandlord.id } }),
    enabled: Boolean(selectedLandlord?.id) && portfolioModalOpen,
  });

  // Admin Landlord M-Pesa Settings query
  const { isLoading: landlordMpesaLoading } = useQuery({
    queryKey: ["admin-landlord-mpesa", selectedLandlord?.id],
    queryFn: async () => {
      const res = await fetchAdminLandlordMpesa({ data: { landlordId: selectedLandlord.id } });
      if (res) {
        setAdminMpesaForm({
          shortcode: res.shortcode || "",
          consumer_key: res.consumer_key || "",
          consumer_secret: res.consumer_secret_masked || "",
          passkey: res.passkey_masked || "",
          environment: res.environment || "sandbox",
          transaction_type: res.transaction_type || "CustomerPayBillOnline",
          account_reference_prefix: res.account_reference_prefix || "RRP",
          is_active: res.is_active ?? true,
        });
      }
      return res;
    },
    enabled: Boolean(selectedLandlord?.id) && adminMpesaModalOpen,
  });

  const saveAdminMpesaMut = useMutation({
    mutationFn: () =>
      saveAdminLandlordMpesa({
        data: {
          landlordId: selectedLandlord.id,
          ...adminMpesaForm,
        },
      }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Landlord M-Pesa configuration updated successfully!");
      setAdminMpesaModalOpen(false);
      qc.invalidateQueries({ queryKey: ["admin_mpesa_transactions"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save M-Pesa configuration"),
  });

  const testAdminMpesaMut = useMutation({
    mutationFn: () =>
      testMpesa({
        data: {
          consumer_key: adminMpesaForm.consumer_key,
          consumer_secret: adminMpesaForm.consumer_secret,
          environment: adminMpesaForm.environment,
        },
      }),
    onSuccess: (res: any) => toast.success(res?.message || "Connection successful"),
    onError: (err: any) => toast.error(err?.message || "Test connection failed"),
  });

  // Admin Landlord KCB Settings query
  const { isLoading: landlordKcbLoading } = useQuery({
    queryKey: ["admin-landlord-kcb", selectedLandlord?.id],
    queryFn: async () => {
      const res = await fetchAdminLandlordKcb({ data: { landlordId: selectedLandlord.id } });
      if (res) {
        setAdminKcbForm({
          paybill_number: res.paybill_number || "",
          account_number: res.account_number || "",
          client_key: res.client_key || "",
          client_secret: res.client_secret_masked || "",
          ipn_secret_token: res.ipn_secret_token_masked || "",
          environment: res.environment || "sandbox",
          account_reference_prefix: res.account_reference_prefix || "RR",
          is_active: res.is_active ?? true,
        });
      }
      return res;
    },
    enabled: Boolean(selectedLandlord?.id) && adminKcbModalOpen,
  });

  const saveAdminKcbMut = useMutation({
    mutationFn: () =>
      saveAdminLandlordKcb({
        data: {
          landlordId: selectedLandlord.id,
          ...adminKcbForm,
        },
      }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Landlord KCB configuration updated successfully!");
      setAdminKcbModalOpen(false);
      qc.invalidateQueries({ queryKey: ["admin_kcb_transactions"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save KCB configuration"),
  });

  const testAdminKcbMut = useMutation({
    mutationFn: () =>
      testKcb({
        data: {
          client_key: adminKcbForm.client_key,
          client_secret: adminKcbForm.client_secret,
          environment: adminKcbForm.environment,
        },
      }),
    onSuccess: (res: any) => toast.success(res?.message || "KCB connection successful"),
    onError: (err: any) => toast.error(err?.message || "KCB test connection failed"),
  });
  const create = useMutation({
    mutationFn: () =>
      addVoucher({
        data: {
          code,
          months: Number(months) || 1,
          max_uses: Number(maxUses) || 1,
          expires_at: expires || null,
          note: note || null,
        },
      }),
    onSuccess: async () => {
      toast.success(`Voucher ${code.toUpperCase()} created`);
      setCode(randomCode());
      setNote("");
      setExpires("");
      await qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create voucher"),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => toggleVoucher({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vouchers"] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeVoucher({ data: { id } }),
    onSuccess: () => {
      toast.success("Voucher deleted");
      qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
  });

  const grant = useMutation({
    mutationFn: (v: { userId: string; months: number }) => extend({ data: v }),
    onSuccess: (res) => {
      toast.success(`Access extended to ${shortDate(res.endsAt)}`);
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not extend access"),
  });

  const updateSubscriptionMut = useMutation({
    mutationFn: () =>
      updateSub({
        data: {
          userId: selectedLandlord.id,
          plan: customPlan,
          endsAt: customEndsAt || null,
          status: customStatus,
        },
      }),
    onSuccess: () => {
      toast.success("Landlord subscription updated successfully");
      setEditAccessModalOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const stats = overview?.stats;

  // Filtered Landlords
  const filteredLandlords = useMemo(() => {
    const list = overview?.landlords ?? [];
    return list.filter((l) => {
      const matchesFilter = landlordFilter === "all" || l.state === landlordFilter;
      const q = landlordSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.email.toLowerCase().includes(q) ||
        (l.full_name && l.full_name.toLowerCase().includes(q)) ||
        (l.company_name && l.company_name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [overview?.landlords, landlordFilter, landlordSearch]);

  // Filtered Sub Payments
  const filteredSubPayments = useMemo(() => {
    const list = overview?.payments ?? [];
    return list.filter((p) => {
      const matchesPlan = subPlanFilter === "all" || p.plan === subPlanFilter;
      const q = subPaymentSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.email.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        (p.name && p.name.toLowerCase().includes(q));
      return matchesPlan && matchesSearch;
    });
  }, [overview?.payments, subPlanFilter, subPaymentSearch]);

  // Filtered Platform Payments
  const filteredPlatformPayments = useMemo(() => {
    const list = platformPayments ?? [];
    const q = platformPaymentSearch.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.tenant_name.toLowerCase().includes(q) ||
        p.landlord_email.toLowerCase().includes(q) ||
        (p.method && p.method.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q))
    );
  }, [platformPayments, platformPaymentSearch]);

  // Filtered M-Pesa STK Transactions
  const filteredMpesaTx = useMemo(() => {
    const list = mpesaTransactions || [];
    const q = mpesaSearch.toLowerCase().trim();
    return list.filter((t: any) => {
      const matchesStatus = mpesaStatusFilter === "all" || t.status === mpesaStatusFilter;
      const matchesSearch =
        !q ||
        (t.tenant_name && t.tenant_name.toLowerCase().includes(q)) ||
        (t.landlord_name && t.landlord_name.toLowerCase().includes(q)) ||
        (t.property_name && t.property_name.toLowerCase().includes(q)) ||
        (t.phone_number && t.phone_number.includes(q)) ||
        (t.mpesa_receipt_number && t.mpesa_receipt_number.toLowerCase().includes(q)) ||
        (t.account_reference && t.account_reference.toLowerCase().includes(q)) ||
        (t.checkout_request_id && t.checkout_request_id.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [mpesaTransactions, mpesaSearch, mpesaStatusFilter]);

  // M-Pesa Statistics
  const mpesaStats = useMemo(() => {
    const list = mpesaTransactions || [];
    const successful = list.filter((t) => t.status === "success");
    const pending = list.filter((t) => t.status === "pending" || t.status === "initiated");
    const failed = list.filter((t) => t.status === "failed" || t.status === "cancelled" || t.status === "timeout");
    const totalVolume = successful.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      totalCount: list.length,
      successCount: successful.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      totalVolume,
    };
  }, [mpesaTransactions]);

  // Filtered KCB BUNI IPN Transactions
  const filteredKcbTx = useMemo(() => {
    const list = kcbTransactions || [];
    const q = kcbSearch.toLowerCase().trim();
    return list.filter((t: any) => {
      const matchesStatus = kcbStatusFilter === "all" || t.status === kcbStatusFilter;
      const matchesSearch =
        !q ||
        (t.tenant_name && t.tenant_name.toLowerCase().includes(q)) ||
        (t.landlord_name && t.landlord_name.toLowerCase().includes(q)) ||
        (t.property_name && t.property_name.toLowerCase().includes(q)) ||
        (t.phone_number && t.phone_number.includes(q)) ||
        (t.kcb_transaction_id && t.kcb_transaction_id.toLowerCase().includes(q)) ||
        (t.account_reference && t.account_reference.toLowerCase().includes(q)) ||
        (t.customer_name && t.customer_name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [kcbTransactions, kcbSearch, kcbStatusFilter]);

  // KCB Statistics
  const kcbStats = useMemo(() => {
    const list = kcbTransactions || [];
    const successful = list.filter((t: any) => t.status === "success");
    const pending = list.filter((t: any) => t.status === "pending" || t.status === "pending_reconciliation");
    const failed = list.filter((t: any) => t.status === "failed" || t.status === "cancelled");
    const totalVolume = successful.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

    return {
      totalCount: list.length,
      successCount: successful.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      totalVolume,
    };
  }, [kcbTransactions]);

  const cards = [
    { label: "Total Landlords", value: stats?.landlords ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Paying Subscribers", value: stats?.paying ?? 0, icon: BadgeCheck, color: "text-emerald-500" },
    { label: "Active Trials", value: stats?.onTrial ?? 0, icon: CalendarClock, color: "text-amber-500" },
    { label: "Expired Accounts", value: stats?.expired ?? 0, icon: ShieldAlert, color: "text-rose-500" },
    { label: "Subscription Revenue", value: money(stats?.revenue ?? 0), icon: TrendingUp, color: "text-primary" },
    { label: "Platform Rent Tracked", value: money(stats?.rentTracked ?? 0), icon: Wallet, color: "text-emerald-400" },
    { label: "Managed Properties", value: stats?.properties ?? 0, icon: Building2, color: "text-indigo-400" },
    { label: "Total Tenants", value: stats?.tenants ?? 0, icon: Users, color: "text-cyan-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-5 transition-all hover:shadow-md border border-border/80 rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">{c.label}</p>
              <span className="p-2 rounded-xl bg-accent/60">
                <c.icon className={`size-4 ${c.color}`} />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="p-1.5 h-auto bg-muted/60 rounded-2xl gap-1">
            <TabsTrigger value="overview" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <Sparkles className="size-4 mr-1.5 text-primary" /> Overview &amp; Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-importer" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold bg-[#E8F2ED] dark:bg-[#0D3528] text-[#087443] dark:text-[#52B788] border border-[#087443]/30">
              <Sparkles className="size-4 mr-1.5 text-[#C9A227]" /> ✨ AI Bulk Import
            </TabsTrigger>
            <TabsTrigger value="landlords" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <Users className="size-4 mr-1.5" /> Landlords ({overview?.landlords.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <CreditCard className="size-4 mr-1.5" /> Subscriptions ({overview?.payments.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="platform-payments" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <Receipt className="size-4 mr-1.5" /> Platform Receipts ({platformPayments?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="mpesa-center" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Smartphone className="size-4 mr-1.5 text-emerald-600" /> M-Pesa STK ({mpesaTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <Wallet className="size-4 mr-1.5 text-amber-500" /> Affiliate Hub
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
              <Ticket className="size-4 mr-1.5" /> Vouchers ({vouchers?.length ?? 0})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Subscription Plans Breakdown Card */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" /> Plan Distribution
                </h3>
                <Badge variant="outline" className="font-mono text-xs">Active Tiers</Badge>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { label: "Monthly (KSh 400)", count: stats?.planBreakdown?.monthly ?? 0, color: "bg-blue-500" },
                  { label: "Quarterly (KSh 1,100)", count: stats?.planBreakdown?.quarterly ?? 0, color: "bg-amber-500" },
                  { label: "Half Year (KSh 2,100)", count: stats?.planBreakdown?.semiannual ?? 0, color: "bg-indigo-500" },
                  { label: "Yearly (KSh 4,000)", count: stats?.planBreakdown?.yearly ?? 0, color: "bg-emerald-500" },
                ].map((tier) => (
                  <div key={tier.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{tier.label}</span>
                      <span className="font-bold">{tier.count} subscribers</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${tier.color}`}
                        style={{
                          width: `${stats?.paying ? Math.round((tier.count / stats.paying) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats Snapshot */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <Layers className="size-4 text-primary" /> Platform Capacity
              </h3>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Rental Units</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stats?.units ?? 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Receipts Issued</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stats?.rentReceiptsIssued ?? 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Affiliates</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stats?.affiliatesCount ?? 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Avg Rent / Landlord</p>
                  <p className="mt-1 font-display text-lg font-bold">
                    {stats?.landlords ? money(Math.round((stats.rentTracked ?? 0) / stats.landlords)) : "KSh 0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <KeyRound className="size-4 text-primary" /> Quick Owner Actions
              </h3>
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full justify-start rounded-2xl h-11 bg-[#087443]/10 text-[#087443] dark:text-[#52B788] hover:bg-[#087443]/20 border border-[#087443]/30 font-bold"
                  variant="outline"
                  onClick={() => setActiveTab("ai-importer")}
                >
                  <Sparkles className="size-4 mr-2 text-[#C9A227]" /> ✨ AI Bulk Unit Importer
                </Button>
                <Button
                  className="w-full justify-start rounded-2xl h-11"
                  variant="outline"
                  onClick={() => setActiveTab("vouchers")}
                >
                  <Ticket className="size-4 mr-2 text-primary" /> Create Promo Voucher
                </Button>
                <Button
                  className="w-full justify-start rounded-2xl h-11"
                  variant="outline"
                  onClick={() => setActiveTab("affiliates")}
                >
                  <Wallet className="size-4 mr-2 text-amber-500" /> Review M-Pesa Payout Queue
                </Button>
                <Button
                  className="w-full justify-start rounded-2xl h-11"
                  variant="outline"
                  onClick={() => exportToCsv("all_landlords", overview?.landlords ?? [])}
                >
                  <Download className="size-4 mr-2 text-emerald-500" /> Export Landlord Directory (CSV)
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Subscriptions Stream */}
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Recent Revenue Stream
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("subscriptions")}>
                View all payments →
              </Button>
            </div>
            {overview?.payments.slice(0, 5).length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.payments.slice(0, 5).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{shortDate(p.paid_at ?? p.created_at)}</TableCell>
                        <TableCell className="font-medium text-xs">{p.email}</TableCell>
                        <TableCell className="capitalize text-xs font-semibold">{p.plan}</TableCell>
                        <TableCell className="font-bold text-xs">{money(p.amount)}</TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">{p.reference}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "success" ? "default" : "secondary"} className="text-[10px]">
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No subscription payments recorded yet.</p>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: LANDLORDS MANAGEMENT */}
        <TabsContent value="landlords" className="space-y-5">
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Users className="size-5 text-primary" /> Landlords Directory
                </h3>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredLandlords.length} of {overview?.landlords.length ?? 0} registered accounts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name, email, phone..."
                    value={landlordSearch}
                    onChange={(e) => setLandlordSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full text-xs"
                  />
                  {landlordSearch ? (
                    <button
                      onClick={() => setLandlordSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center bg-muted/60 p-1 rounded-full text-xs">
                  {(["all", "paid", "trial", "expired"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setLandlordFilter(st)}
                      className={`px-3 py-1 rounded-full font-medium transition-all capitalize ${
                        landlordFilter === st ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 gap-1.5 text-xs"
                  onClick={() => exportToCsv("landlords_list", filteredLandlords)}
                >
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </div>

            {filteredLandlords.length ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[950px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Landlord Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Access Until</TableHead>
                      <TableHead>Portfolio</TableHead>
                      <TableHead>Rent Tracked</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLandlords.map((l) => (
                      <TableRow key={l.id} className="hover:bg-muted/30">
                        <TableCell>
                          <p className="font-semibold text-sm">{l.full_name || l.company_name || "—"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{l.email}</p>
                          {l.phone ? <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="size-3" /> {l.phone}</p> : null}
                          {l.isAffiliate ? (
                            <Badge variant="secondary" className="text-[10px] mt-1 gap-1 text-amber-500 bg-amber-500/10 border-amber-500/20">
                              <Wallet className="size-3" /> Affiliate
                            </Badge>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${stateStyles[l.state]}`}
                          >
                            {l.state}
                          </span>
                        </TableCell>
                        <TableCell className="capitalize text-xs font-medium">{l.plan || "—"}</TableCell>
                        <TableCell className="text-xs font-mono">{shortDate(l.endsAt)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{l.properties}</span> properties ·{" "}
                          <span className="font-semibold text-foreground">{l.tenants}</span> tenants
                        </TableCell>
                        <TableCell className="text-xs font-semibold">{money(l.rentCollected)}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-8 px-2.5 text-xs gap-1 text-[#087443] dark:text-[#52B788] hover:bg-[#087443]/10 font-bold border-[#087443]/30"
                              onClick={() => {
                                setSelectedLandlord(l);
                                setActiveTab("ai-importer");
                              }}
                            >
                              <Sparkles className="size-3 text-[#C9A227]" /> AI Import
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-8 px-2.5 text-xs gap-1"
                              onClick={() => {
                                setSelectedLandlord(l);
                                setPortfolioModalOpen(true);
                              }}
                            >
                              <Eye className="size-3.5 text-primary" /> View
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-8 px-2 text-xs gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 font-semibold"
                              onClick={() => {
                                setSelectedLandlord(l);
                                setAdminMpesaModalOpen(true);
                              }}
                            >
                              <Smartphone className="size-3 text-emerald-600" /> M-Pesa
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-8 px-2 text-xs gap-1 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 font-semibold"
                              onClick={() => {
                                setSelectedLandlord(l);
                                setAdminKcbModalOpen(true);
                              }}
                            >
                              <Building className="size-3 text-blue-600" /> KCB
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-8 px-2.5 text-xs gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 font-semibold"
                              onClick={() => {
                                setSelectedLandlord(l);
                                setCustomPlan((l.plan as any) || "monthly");
                                setCustomEndsAt(l.endsAt ? new Date(l.endsAt).toISOString().slice(0, 10) : "");
                                setCustomStatus(l.state === "paid" ? "active" : l.state === "trial" ? "trial" : "expired");
                                setEditAccessModalOpen(true);
                              }}
                            >
                              <SlidersHorizontal className="size-3.5" /> Edit Access
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full h-8 px-2 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                              disabled={grant.isPending}
                              onClick={() => grant.mutate({ userId: l.id, months: 1 })}
                            >
                              +1m
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState title="No landlords match your filter criteria" />
            )}
          </div>
        </TabsContent>

        {/* TAB 3: SUBSCRIPTION PAYMENTS & LEDGER */}
        <TabsContent value="subscriptions" className="space-y-5">
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <CreditCard className="size-5 text-primary" /> Subscription Ledger
                </h3>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredSubPayments.length} subscription transactions · Total:{" "}
                  <strong className="text-foreground">
                    {money(filteredSubPayments.filter((p) => p.status === "success").reduce((s, p) => s + Number(p.amount ?? 0), 0))}
                  </strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ref, email..."
                    value={subPaymentSearch}
                    onChange={(e) => setSubPaymentSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full text-xs"
                  />
                </div>

                <Select value={subPlanFilter} onValueChange={setSubPlanFilter}>
                  <SelectTrigger className="h-9 w-36 rounded-full text-xs">
                    <SelectValue placeholder="All plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semiannual">Half Year</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 gap-1.5 text-xs"
                  onClick={() => exportToCsv("subscription_payments", filteredSubPayments)}
                >
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </div>

            {filteredSubPayments.length ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[850px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference Number</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-mono">{shortDate(p.paid_at ?? p.created_at)}</TableCell>
                        <TableCell>
                          <p className="text-xs font-semibold">{p.name !== "—" ? p.name : p.email}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{p.email}</p>
                        </TableCell>
                        <TableCell className="capitalize text-xs font-medium">
                          <Badge variant="outline" className="text-[11px]">
                            {p.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-sm">{money(p.amount)}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground select-all">{p.reference}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "success" ? "default" : "secondary"} className="text-xs font-semibold">
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState title="No subscription transactions match your filters" />
            )}
          </div>
        </TabsContent>

        {/* TAB 4: PLATFORM RECEIPTS MONITOR */}
        <TabsContent value="platform-payments" className="space-y-5">
          <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Receipt className="size-5 text-primary" /> Live Rent Receipts Feed
                </h3>
                <p className="text-xs text-muted-foreground">
                  Audit log of tenant rent payments issued across properties nationwide
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenant, landlord, method..."
                    value={platformPaymentSearch}
                    onChange={(e) => setPlatformPaymentSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full text-xs"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 gap-1.5 text-xs"
                  onClick={() => exportToCsv("platform_rent_receipts", filteredPlatformPayments)}
                >
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </div>

            {filteredPlatformPayments.length ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Ref / M-Pesa Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlatformPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-mono">{shortDate(p.paid_at || p.created_at)}</TableCell>
                        <TableCell>
                          <p className="font-semibold text-xs">{p.tenant_name}</p>
                          {p.tenant_phone !== "—" ? (
                            <p className="text-[11px] text-muted-foreground">{p.tenant_phone}</p>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{p.landlord_email}</TableCell>
                        <TableCell className="font-bold text-xs text-emerald-500">{money(p.amount)}</TableCell>
                        <TableCell className="text-xs font-mono">{p.period_label || "—"}</TableCell>
                        <TableCell className="text-xs capitalize font-medium">{p.method || "M-Pesa"}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground select-all">
                          {p.reference || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState title="No rent payments recorded yet" />
            )}
          </div>
        </TabsContent>

        {/* TAB 5: AFFILIATE HUB & PAYOUTS */}
        <TabsContent value="affiliates" className="space-y-6">
          <AffiliatesHub />
        </TabsContent>

        {/* TAB 6: VOUCHER CODES ENGINE */}
        <TabsContent value="vouchers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
            {/* Voucher Generator Card */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 font-display text-base font-bold">
                <Gift className="size-4 text-primary" /> Create Promo Voucher
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate redeemable coupon codes that grant free months of platform subscription access.
              </p>

              <div className="space-y-4 pt-2">
                <Field label="Voucher Code" htmlFor="code">
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="font-mono uppercase font-bold tracking-wider"
                    />
                    <Button variant="outline" size="sm" className="rounded-xl px-3" onClick={() => setCode(randomCode())}>
                      Generate
                    </Button>
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Free Months" htmlFor="months">
                    <Input
                      id="months"
                      type="number"
                      min={1}
                      max={60}
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                    />
                  </Field>
                  <Field label="Max Uses" htmlFor="uses">
                    <Input
                      id="uses"
                      type="number"
                      min={1}
                      max={10000}
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Expiration Date (Optional)" htmlFor="expires">
                  <Input
                    id="expires"
                    type="date"
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                  />
                </Field>

                <Field label="Internal Note / Campaign" htmlFor="note">
                  <Input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Kenya Landlords Forum Promo"
                  />
                </Field>

                <Button
                  className="w-full rounded-full shadow-glow font-semibold h-11"
                  disabled={create.isPending}
                  onClick={() => create.mutate()}
                >
                  {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-1.5" />}
                  Create Voucher Code
                </Button>
              </div>
            </div>

            {/* Vouchers Table Card */}
            <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-base font-bold">
                  <Ticket className="size-4 text-primary" /> Active &amp; Historical Vouchers
                </h3>
                <Badge variant="outline" className="font-mono text-xs">{vouchers?.length ?? 0} Total</Badge>
              </div>

              {vouchers?.length ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-[650px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code &amp; Note</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Redemptions</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchers.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell>
                            <button
                              className="inline-flex items-center gap-1.5 font-mono font-bold hover:text-primary transition-colors text-sm"
                              onClick={() => {
                                void navigator.clipboard.writeText(v.code);
                                toast.success(`Copied ${v.code}`);
                              }}
                            >
                              {v.code} <Copy className="size-3.5 text-muted-foreground" />
                            </button>
                            {v.note ? <p className="text-xs text-muted-foreground mt-0.5">{v.note}</p> : null}
                          </TableCell>
                          <TableCell className="text-xs font-semibold">{v.months} mo</TableCell>
                          <TableCell className="text-xs font-mono">
                            {v.used_count} / {v.max_uses}
                          </TableCell>
                          <TableCell className="text-xs">{v.expires_at ? shortDate(v.expires_at) : "Never"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={v.active && v.used_count < v.max_uses ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {v.active ? (v.used_count < v.max_uses ? "Active" : "Depleted") : "Paused"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 rounded-full"
                                aria-label="Toggle active"
                                onClick={() => toggle.mutate({ id: v.id, active: !v.active })}
                              >
                                <Power className={`size-3.5 ${v.active ? "text-emerald-500" : "text-muted-foreground"}`} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                aria-label="Delete voucher"
                                onClick={() => {
                                  if (confirm(`Delete voucher ${v.code}?`)) del.mutate(v.id);
                                }}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState title="No promotional vouchers created yet" />
              )}

              {/* Recent Redemptions Log */}
              {overview?.redemptions.length ? (
                <div className="mt-8 pt-6 border-t border-border/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recent Voucher Redemptions Audit Log
                  </h4>
                  <div className="space-y-2">
                    {overview.redemptions.slice(0, 8).map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs">
                        <span className="font-medium font-mono">{r.email}</span>
                        <span className="text-muted-foreground">
                          Granted <strong className="text-foreground">{r.months} months</strong> · {shortDate(r.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>

        {/* TAB: AI BULK UNIT IMPORTER */}
        <TabsContent value="ai-importer" className="space-y-6">
          <AiBulkImporter
            landlords={overview?.landlords ?? []}
            initialLandlordId={selectedLandlord?.id}
          />
        </TabsContent>

        {/* TAB: DIGITAL PAYMENTS CENTER (M-PESA & KCB) */}
        <TabsContent value="mpesa-center" className="space-y-6">
          {/* Provider Switcher Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-muted/60 p-1 rounded-2xl border border-border/60">
              <button
                type="button"
                onClick={() => setPaymentProviderTab("mpesa")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  paymentProviderTab === "mpesa"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="size-3.5 text-emerald-600" />
                Safaricom M-Pesa STK ({mpesaTransactions.length})
              </button>
              <button
                type="button"
                onClick={() => setPaymentProviderTab("kcb")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  paymentProviderTab === "kcb"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building className="size-3.5 text-blue-600" />
                KCB BUNI IPN ({kcbTransactions.length})
              </button>
            </div>
          </div>

          {/* SAFARICOM M-PESA TRANSACTIONS VIEW */}
          {paymentProviderTab === "mpesa" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. M-Pesa Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Total Volume Settled</span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                      <Smartphone className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
                    {money(mpesaStats.totalVolume)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Successful Daraja STK collections</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Successful Payments</span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                      <CheckCircle className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold">{mpesaStats.successCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Received &amp; verified receipts</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Pending STK Requests</span>
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <Clock className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-amber-500">{mpesaStats.pendingCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Awaiting PIN prompt completion</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Failed / Cancelled</span>
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                      <XCircle className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-rose-500">{mpesaStats.failedCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Cancelled or timed out attempts</p>
                </div>
              </div>

              {/* 2. M-Pesa Live Transactions Table Card */}
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Smartphone className="size-5 text-emerald-600" /> Real-Time M-Pesa Daraja Transactions
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Complete multi-landlord STK Push payment lifecycle audit log
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tenant, phone, receipt..."
                        value={mpesaSearch}
                        onChange={(e) => setMpesaSearch(e.target.value)}
                        className="pl-9 h-9 rounded-full text-xs"
                      />
                    </div>

                    <Select value={mpesaStatusFilter} onValueChange={setMpesaStatusFilter}>
                      <SelectTrigger className="h-9 w-32 rounded-full text-xs font-semibold">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="success">Successful</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-9 text-xs gap-1.5"
                      onClick={() => exportToCsv("rentreceipt_mpesa_transactions", filteredMpesaTx)}
                      disabled={!filteredMpesaTx.length}
                    >
                      <Download className="size-3.5" /> CSV
                    </Button>
                  </div>
                </div>

                {filteredMpesaTx.length ? (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date / Time</TableHead>
                          <TableHead>Tenant &amp; Property</TableHead>
                          <TableHead>Landlord</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>M-Pesa Phone</TableHead>
                          <TableHead>Receipt / Ref</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMpesaTx.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {shortDate(tx.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="font-semibold text-xs text-foreground">{tx.tenant_name || "Tenant"}</p>
                                <p className="text-[11px] text-muted-foreground">{tx.property_name || "—"}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-muted-foreground">
                              {tx.landlord_name}
                            </TableCell>
                            <TableCell className="font-bold text-xs text-foreground font-mono">
                              {money(tx.amount)}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {tx.phone_number}
                            </TableCell>
                            <TableCell>
                              {tx.mpesa_receipt_number ? (
                                <Badge variant="outline" className="font-mono font-bold text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
                                  {tx.mpesa_receipt_number}
                                </Badge>
                              ) : (
                                <span className="font-mono text-xs text-muted-foreground">
                                  {tx.account_reference || "—"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] font-semibold uppercase ${
                                  tx.status === "success"
                                    ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                                    : tx.status === "pending" || tx.status === "initiated"
                                    ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                                    : "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                                }`}
                              >
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="rounded-full h-8 text-xs gap-1 text-primary"
                                onClick={() => {
                                  setSelectedMpesaTx(tx);
                                  setMpesaPayloadModalOpen(true);
                                }}
                              >
                                <Eye className="size-3.5" /> Inspect
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <EmptyState title="No M-Pesa STK transactions match your filters." />
                )}
              </div>
            </div>
          )}

          {/* KCB BUNI NOTIFICATIONS VIEW */}
          {paymentProviderTab === "kcb" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. KCB Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Total Volume Settled</span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                      <Building className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-blue-600">
                    {money(kcbStats.totalVolume)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Successful KCB BUNI collections</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Successful Payments</span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                      <CheckCircle className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold">{kcbStats.successCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Received &amp; reconciled receipts</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Pending Reconciliation</span>
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <Clock className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-amber-500">{kcbStats.pendingCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Awaiting tenant unit match</p>
                </div>

                <div className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Failed / Cancelled</span>
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                      <XCircle className="size-4" />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-rose-500">{kcbStats.failedCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Failed or rejected IPN events</p>
                </div>
              </div>

              {/* 2. KCB Live IPN Transactions Table Card */}
              <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Building className="size-5 text-blue-600" /> Real-Time KCB BUNI IPN Transactions
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Instant Payment Notification (IPN) audit trail for KCB Paybill and Bank collections
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tenant, ref, tx ID..."
                        value={kcbSearch}
                        onChange={(e) => setKcbSearch(e.target.value)}
                        className="pl-9 h-9 rounded-full text-xs"
                      />
                    </div>

                    <Select value={kcbStatusFilter} onValueChange={setKcbStatusFilter}>
                      <SelectTrigger className="h-9 w-36 rounded-full text-xs font-semibold">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="success">Successful</SelectItem>
                        <SelectItem value="pending_reconciliation">Pending Match</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-9 text-xs gap-1.5"
                      onClick={() => exportToCsv("rentreceipt_kcb_transactions", filteredKcbTx)}
                      disabled={!filteredKcbTx.length}
                    >
                      <Download className="size-3.5" /> CSV
                    </Button>
                  </div>
                </div>

                {filteredKcbTx.length ? (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date / Time</TableHead>
                          <TableHead>Tenant &amp; Property</TableHead>
                          <TableHead>Landlord</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Customer / Phone</TableHead>
                          <TableHead>KCB Tx ID &amp; Ref</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredKcbTx.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {shortDate(tx.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="font-semibold text-xs text-foreground">{tx.tenant_name || "Tenant"}</p>
                                <p className="text-[11px] text-muted-foreground">{tx.property_name || "—"}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-muted-foreground">
                              {tx.landlord_name}
                            </TableCell>
                            <TableCell className="font-bold text-xs text-foreground font-mono">
                              {money(tx.amount)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-foreground">{tx.customer_name || "—"}</p>
                                <p className="font-mono text-[11px] text-muted-foreground">{tx.phone_number || "—"}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <Badge variant="outline" className="font-mono font-bold text-xs text-blue-600 border-blue-500/30 bg-blue-500/5">
                                  {tx.kcb_transaction_id}
                                </Badge>
                                <p className="font-mono text-[10px] text-muted-foreground">
                                  Ref: {tx.account_reference}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] font-semibold uppercase ${
                                  tx.status === "success"
                                    ? "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                                    : tx.status === "pending_reconciliation"
                                    ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                                    : "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                                }`}
                              >
                                {tx.status === "pending_reconciliation" ? "Pending Match" : tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="rounded-full h-8 text-xs gap-1 text-primary"
                                onClick={() => {
                                  setSelectedKcbTx(tx);
                                  setKcbPayloadModalOpen(true);
                                }}
                              >
                                <Eye className="size-3.5" /> Inspect
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <EmptyState title="No KCB BUNI transactions match your filters." />
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* DIALOG: M-PESA TRANSACTION PAYLOAD INSPECTOR */}
      <Dialog open={mpesaPayloadModalOpen} onOpenChange={setMpesaPayloadModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div className="space-y-1">
                <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                  <Smartphone className="size-5 text-emerald-600" /> M-Pesa Transaction Inspector
                </DialogTitle>
                <DialogDescription className="text-xs">
                  ID: <span className="font-mono">{selectedMpesaTx?.id}</span>
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className={`text-[10px] font-semibold uppercase ${
                  selectedMpesaTx?.status === "success"
                    ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                    : selectedMpesaTx?.status === "pending"
                    ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                    : "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                }`}
              >
                {selectedMpesaTx?.status}
              </Badge>
            </div>
          </DialogHeader>

          {selectedMpesaTx && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Tenant / Property</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedMpesaTx.tenant_name}</p>
                  <p className="text-muted-foreground">{selectedMpesaTx.property_name}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Landlord Account</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedMpesaTx.landlord_name}</p>
                  <p className="text-muted-foreground">{selectedMpesaTx.phone_number}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Amount &amp; Ref</span>
                  <p className="font-bold text-foreground mt-0.5">{money(selectedMpesaTx.amount)}</p>
                  <p className="font-mono text-muted-foreground">{selectedMpesaTx.account_reference}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">M-Pesa Receipt</span>
                  <p className="font-mono font-bold text-emerald-600 mt-0.5">
                    {selectedMpesaTx.mpesa_receipt_number || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{shortDate(selectedMpesaTx.created_at)}</p>
                </div>
              </div>

              {selectedMpesaTx.result_desc && (
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Result Description</span>
                  <p className="mt-0.5 text-foreground">{selectedMpesaTx.result_desc}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Raw Daraja Webhook Callback</Label>
                <div className="p-3 rounded-2xl bg-muted/60 border border-border/80 max-h-48 overflow-y-auto font-mono text-[11px] text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(selectedMpesaTx.raw_callback || { checkout_request_id: selectedMpesaTx.checkout_request_id, merchant_request_id: selectedMpesaTx.merchant_request_id }, null, 2)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full text-xs"
              onClick={() => setMpesaPayloadModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 1: LANDLORD PORTFOLIO INSPECTOR */}
      <Dialog open={portfolioModalOpen} onOpenChange={setPortfolioModalOpen}>
        <DialogContent className="max-w-3xl rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                  <Building2 className="size-5 text-primary" /> Landlord Portfolio: {selectedLandlord?.full_name || selectedLandlord?.email}
                </DialogTitle>
                <DialogDescription>
                  Account Email: <strong className="text-foreground">{selectedLandlord?.email}</strong> · Company:{" "}
                  <strong className="text-foreground">{selectedLandlord?.company_name || "—"}</strong>
                </DialogDescription>
              </div>

              <Button
                size="sm"
                className="rounded-full bg-[#087443] hover:bg-[#063B2A] text-white text-xs font-bold gap-1.5 shadow-sm self-start sm:self-auto shrink-0"
                onClick={() => {
                  setPortfolioModalOpen(false);
                  setActiveTab("ai-importer");
                }}
              >
                <Sparkles className="size-3.5 text-[#C9A227]" /> ✨ AI Bulk Import Units
              </Button>
            </div>
          </DialogHeader>

          {portfolioLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {/* Portfolio Stats Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-muted/50 text-center border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Properties</p>
                  <p className="text-2xl font-bold mt-1">{landlordPortfolio?.properties.length ?? 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 text-center border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Units</p>
                  <p className="text-2xl font-bold mt-1">{landlordPortfolio?.units.length ?? 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 text-center border border-border/60">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Active Tenants</p>
                  <p className="text-2xl font-bold mt-1">{landlordPortfolio?.tenants.length ?? 0}</p>
                </div>
              </div>

              {/* Properties List */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm">Managed Properties</h4>
                {landlordPortfolio?.properties.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {landlordPortfolio.properties.map((p) => (
                      <div key={p.id} className="p-3.5 rounded-2xl border border-border/70 bg-card/60">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.address || "No address specified"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No properties registered yet.</p>
                )}
              </div>

              {/* Tenants List */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm">Registered Tenants</h4>
                {landlordPortfolio?.tenants.length ? (
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tenant Name</TableHead>
                          <TableHead>Phone / Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {landlordPortfolio.tenants.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="font-medium text-xs">{t.full_name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono">{t.phone || t.email || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={t.status === "active" ? "default" : "secondary"} className="text-[10px]">
                                {t.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No tenants onboarded yet.</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" className="rounded-full" onClick={() => setPortfolioModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT ACCESS & PLAN ASSIGNMENT */}
      <Dialog open={editAccessModalOpen} onOpenChange={setEditAccessModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" /> Update Subscription Access
            </DialogTitle>
            <DialogDescription>
              Assign plan tier or manually extend account access for <strong className="text-foreground">{selectedLandlord?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label>Assigned Plan Tier</Label>
              <Select value={customPlan} onValueChange={(val: any) => setCustomPlan(val)}>
                <SelectTrigger className="h-10 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly (KSh 400)</SelectItem>
                  <SelectItem value="quarterly">Quarterly (KSh 1,100)</SelectItem>
                  <SelectItem value="semiannual">Half Year (KSh 2,100)</SelectItem>
                  <SelectItem value="yearly">Yearly (KSh 4,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Access Status</Label>
              <Select value={customStatus} onValueChange={(val: any) => setCustomStatus(val)}>
                <SelectTrigger className="h-10 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Full access)</SelectItem>
                  <SelectItem value="trial">Free Trial</SelectItem>
                  <SelectItem value="expired">Expired (Locked)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Access Valid Until (Date)</Label>
              <Input
                type="date"
                value={customEndsAt}
                onChange={(e) => setCustomEndsAt(e.target.value)}
                className="h-10 rounded-2xl"
              />
              <p className="text-[11px] text-muted-foreground">
                Set a custom expiration date or leave unchanged.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full" onClick={() => setEditAccessModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full shadow-glow"
              disabled={updateSubscriptionMut.isPending}
              onClick={() => updateSubscriptionMut.mutate()}
            >
              {updateSubscriptionMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: SUPERADMIN LANDLORD M-PESA CREDENTIAL ONBOARDING & VAULT */}
      <Dialog open={adminMpesaModalOpen} onOpenChange={setAdminMpesaModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Smartphone className="size-5 text-emerald-600" /> Configure M-Pesa STK Collection
            </DialogTitle>
            <DialogDescription>
              Managing credentials for <strong className="text-foreground">{selectedLandlord?.full_name || selectedLandlord?.email}</strong>. Secrets are stored with AES-256-GCM encryption at rest.
            </DialogDescription>
          </DialogHeader>

          {landlordMpesaLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <div className="space-y-0.5">
                  <Label htmlFor="admin_mpesa_active" className="text-xs font-semibold cursor-pointer">
                    Enable STK Push for this Landlord
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    When active, tenants can pay rent via instant Lipa Na M-Pesa STK push.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="admin_mpesa_active"
                  checked={adminMpesaForm.is_active}
                  onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, is_active: e.target.checked })}
                  className="size-4 accent-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="admin_shortcode" className="text-xs">Shortcode (Paybill / Till)</Label>
                  <Input
                    id="admin_shortcode"
                    value={adminMpesaForm.shortcode}
                    onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, shortcode: e.target.value.trim() })}
                    placeholder="e.g. 174379"
                    className="font-mono text-xs h-9 rounded-2xl font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_env" className="text-xs">Environment</Label>
                  <Select
                    value={adminMpesaForm.environment}
                    onValueChange={(v: "sandbox" | "production") => {
                      const next = { ...adminMpesaForm, environment: v };
                      if (v === "sandbox" && (!adminMpesaForm.shortcode || !adminMpesaForm.passkey)) {
                        next.shortcode = "174379";
                        next.passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                      }
                      setAdminMpesaForm(next);
                    }}
                  >
                    <SelectTrigger id="admin_env" className="h-9 rounded-2xl text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                      <SelectItem value="production">Production (Live Payments)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_txtype" className="text-xs">Transaction Type</Label>
                  <Select
                    value={adminMpesaForm.transaction_type}
                    onValueChange={(v: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline") =>
                      setAdminMpesaForm({ ...adminMpesaForm, transaction_type: v })
                    }
                  >
                    <SelectTrigger id="admin_txtype" className="h-9 rounded-2xl text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CustomerPayBillOnline">Paybill (CustomerPayBillOnline)</SelectItem>
                      <SelectItem value="CustomerBuyGoodsOnline">Buy Goods / Till (CustomerBuyGoodsOnline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_prefix" className="text-xs">Account Ref Prefix</Label>
                  <Input
                    id="admin_prefix"
                    value={adminMpesaForm.account_reference_prefix}
                    onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, account_reference_prefix: e.target.value.trim() })}
                    placeholder="e.g. RRP"
                    className="font-mono text-xs h-9 rounded-2xl uppercase font-bold"
                  />
                </div>
              </div>

              {adminMpesaForm.environment === "sandbox" && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-3">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Auto-fill standard Safaricom Sandbox Shortcode (174379) &amp; Passkey
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-7 px-3 text-emerald-600 border-emerald-500/30 font-semibold shrink-0"
                    onClick={() => {
                      setAdminMpesaForm((prev) => ({
                        ...prev,
                        shortcode: "174379",
                        passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
                        transaction_type: "CustomerPayBillOnline",
                      }));
                      toast.success("Filled Safaricom Sandbox defaults!");
                    }}
                  >
                    Fill Defaults
                  </Button>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin_ck" className="text-xs">Daraja Consumer Key</Label>
                <Input
                  id="admin_ck"
                  value={adminMpesaForm.consumer_key}
                  onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, consumer_key: e.target.value.trim() })}
                  placeholder="Paste Consumer Key from developer.safaricom.co.ke"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin_cs" className="text-xs">Daraja Consumer Secret</Label>
                <Input
                  id="admin_cs"
                  type="password"
                  value={adminMpesaForm.consumer_secret}
                  onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, consumer_secret: e.target.value.trim() })}
                  placeholder="••••••••••••"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin_pk" className="text-xs">Lipa Na M-Pesa Online Passkey</Label>
                <Input
                  id="admin_pk"
                  type="password"
                  value={adminMpesaForm.passkey}
                  onChange={(e) => setAdminMpesaForm({ ...adminMpesaForm, passkey: e.target.value.trim() })}
                  placeholder="••••••••••••"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs h-9 gap-1.5 font-semibold"
                  disabled={testAdminMpesaMut.isPending || !adminMpesaForm.consumer_key || !adminMpesaForm.consumer_secret}
                  onClick={() => testAdminMpesaMut.mutate()}
                >
                  {testAdminMpesaMut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                  Test Daraja Connection
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button variant="outline" className="rounded-full text-xs" onClick={() => setAdminMpesaModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full shadow-glow text-xs font-semibold"
              disabled={saveAdminMpesaMut.isPending || !adminMpesaForm.shortcode || !adminMpesaForm.consumer_key}
              onClick={() => saveAdminMpesaMut.mutate()}
            >
              {saveAdminMpesaMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save & Encrypt Configuration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: KCB TRANSACTION PAYLOAD INSPECTOR */}
      <Dialog open={kcbPayloadModalOpen} onOpenChange={setKcbPayloadModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div className="space-y-1">
                <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                  <Building className="size-5 text-blue-600" /> KCB BUNI IPN Inspector
                </DialogTitle>
                <DialogDescription className="text-xs">
                  ID: <span className="font-mono">{selectedKcbTx?.id}</span>
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className={`text-[10px] font-semibold uppercase ${
                  selectedKcbTx?.status === "success"
                    ? "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                    : selectedKcbTx?.status === "pending_reconciliation"
                    ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                    : "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                }`}
              >
                {selectedKcbTx?.status}
              </Badge>
            </div>
          </DialogHeader>

          {selectedKcbTx && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Tenant / Unit</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedKcbTx.tenant_name || "Unmatched"}</p>
                  <p className="text-muted-foreground">{selectedKcbTx.property_name || "—"}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Landlord Account</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedKcbTx.landlord_name}</p>
                  <p className="text-muted-foreground">{selectedKcbTx.customer_name || selectedKcbTx.phone_number}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">Amount &amp; Ref</span>
                  <p className="font-bold text-foreground mt-0.5">{money(selectedKcbTx.amount)}</p>
                  <p className="font-mono text-muted-foreground">{selectedKcbTx.account_reference}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground block text-[11px]">KCB Transaction ID</span>
                  <p className="font-mono font-bold text-blue-600 mt-0.5">
                    {selectedKcbTx.kcb_transaction_id}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{shortDate(selectedKcbTx.created_at)}</p>
                </div>
              </div>

              {selectedKcbTx.raw_ipn && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Raw KCB IPN Webhook Payload</Label>
                  <pre className="p-3 rounded-2xl bg-muted text-[11px] font-mono overflow-x-auto max-h-56 border border-border/60">
                    {JSON.stringify(selectedKcbTx.raw_ipn, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="rounded-full text-xs" onClick={() => setKcbPayloadModalOpen(false)}>
              Close Inspector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ADMIN LANDLORD KCB BUNI CONFIGURATION */}
      <Dialog open={adminKcbModalOpen} onOpenChange={setAdminKcbModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Building className="size-5 text-blue-600" /> KCB BUNI Configuration
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure KCB BUNI Paybill, Account &amp; API credentials for{" "}
              <strong className="text-foreground">{selectedLandlord?.full_name}</strong> ({selectedLandlord?.email}).
            </DialogDescription>
          </DialogHeader>

          {landlordKcbLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3.5 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="admin_kcb_paybill" className="text-xs">KCB PayBill Number *</Label>
                  <Input
                    id="admin_kcb_paybill"
                    value={adminKcbForm.paybill_number}
                    onChange={(e) => setAdminKcbForm({ ...adminKcbForm, paybill_number: e.target.value.trim() })}
                    placeholder="e.g. 522522"
                    className="font-mono text-xs h-9 rounded-2xl font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_kcb_acc" className="text-xs">KCB Account Number</Label>
                  <Input
                    id="admin_kcb_acc"
                    value={adminKcbForm.account_number}
                    onChange={(e) => setAdminKcbForm({ ...adminKcbForm, account_number: e.target.value.trim() })}
                    placeholder="e.g. 1122334455"
                    className="font-mono text-xs h-9 rounded-2xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_kcb_env" className="text-xs">Environment</Label>
                  <Select
                    value={adminKcbForm.environment}
                    onValueChange={(v: "sandbox" | "production") =>
                      setAdminKcbForm({ ...adminKcbForm, environment: v })
                    }
                  >
                    <SelectTrigger id="admin_kcb_env" className="h-9 rounded-2xl text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox / UAT</SelectItem>
                      <SelectItem value="production">Production (Live)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_kcb_prefix" className="text-xs">Account Ref Prefix</Label>
                  <Input
                    id="admin_kcb_prefix"
                    value={adminKcbForm.account_reference_prefix}
                    onChange={(e) => setAdminKcbForm({ ...adminKcbForm, account_reference_prefix: e.target.value.trim().toUpperCase() })}
                    placeholder="e.g. RR"
                    className="font-mono text-xs h-9 rounded-2xl uppercase font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin_kcb_key" className="text-xs">KCB BUNI Client Key / App ID</Label>
                <Input
                  id="admin_kcb_key"
                  value={adminKcbForm.client_key}
                  onChange={(e) => setAdminKcbForm({ ...adminKcbForm, client_key: e.target.value.trim() })}
                  placeholder="Paste Consumer/Client Key from buni.kcbgroup.com"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin_kcb_sec" className="text-xs">KCB BUNI Client Secret</Label>
                <Input
                  id="admin_kcb_sec"
                  type="password"
                  value={adminKcbForm.client_secret}
                  onChange={(e) => setAdminKcbForm({ ...adminKcbForm, client_secret: e.target.value.trim() })}
                  placeholder="••••••••••••"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin_kcb_token" className="text-xs">Webhook IPN Secret Token (Optional)</Label>
                <Input
                  id="admin_kcb_token"
                  type="password"
                  value={adminKcbForm.ipn_secret_token}
                  onChange={(e) => setAdminKcbForm({ ...adminKcbForm, ipn_secret_token: e.target.value.trim() })}
                  placeholder="Shared secret token for IPN verification"
                  className="font-mono text-xs h-9 rounded-2xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs h-9 gap-1.5 font-semibold text-blue-600 border-blue-500/30"
                  disabled={testAdminKcbMut.isPending || !adminKcbForm.client_key || !adminKcbForm.client_secret}
                  onClick={() => testAdminKcbMut.mutate()}
                >
                  {testAdminKcbMut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                  Test KCB OAuth Connection
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button variant="outline" className="rounded-full text-xs" onClick={() => setAdminKcbModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full shadow-glow text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              disabled={saveAdminKcbMut.isPending || !adminKcbForm.paybill_number}
              onClick={() => saveAdminKcbMut.mutate()}
            >
              {saveAdminKcbMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save & Encrypt Configuration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AffiliatesHub() {
  const qc = useQueryClient();
  const fetchStats = useServerFn(getAffiliateStats);
  const fetchWithdrawals = useServerFn(listAdminWithdrawals);
  const processWd = useServerFn(processWithdrawal);
  const rejectWd = useServerFn(rejectWithdrawal);
  const startProcessingWd = useServerFn(startProcessingWithdrawal);
  const updateStatus = useServerFn(setAffiliateStatus);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: () => fetchStats(),
  });
  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => fetchWithdrawals(),
  });

  // State: Modals & Search
  const [affiliateSearch, setAffiliateSearch] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [mpesaRefInput, setMpesaRefInput] = useState("");
  const [adminNoteInput, setAdminNoteInput] = useState("");

  const processMutation = useMutation({
    mutationFn: () =>
      processWd({
        data: {
          withdrawalId: selectedWithdrawal.id,
          mpesaReference: mpesaRefInput,
          adminNote: adminNoteInput || null,
        },
      }),
    onSuccess: () => {
      toast.success("Withdrawal marked as paid!");
      setPayModalOpen(false);
      setMpesaRefInput("");
      setAdminNoteInput("");
      qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to process withdrawal"),
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      rejectWd({
        data: {
          withdrawalId: selectedWithdrawal.id,
          adminNote: adminNoteInput || null,
        },
      }),
    onSuccess: () => {
      toast.success("Withdrawal rejected. Balance returned to affiliate.");
      setRejectModalOpen(false);
      setAdminNoteInput("");
      qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to reject withdrawal"),
  });

  const toggleStatusMut = useMutation({
    mutationFn: (v: { affiliateId: string; status: "active" | "paused" | "banned" }) =>
      updateStatus({ data: v }),
    onSuccess: () => {
      toast.success("Affiliate status updated");
      qc.invalidateQueries({ queryKey: ["admin-affiliates"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const filteredAffiliates = useMemo(() => {
    const list = stats?.affiliates ?? [];
    const q = affiliateSearch.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (a: any) =>
        a.email.toLowerCase().includes(q) ||
        a.referral_code.toLowerCase().includes(q)
    );
  }, [stats?.affiliates, affiliateSearch]);

  const statCards = [
    { label: "Total Affiliates", value: stats?.stats?.totalAffiliates ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Total Referrals", value: stats?.stats?.totalReferrals ?? 0, icon: TrendingUp, color: "text-indigo-500" },
    { label: "Paying Referrals", value: stats?.stats?.successfulReferrals ?? 0, icon: BadgeCheck, color: "text-emerald-500" },
    { label: "Pending Payouts", value: stats?.stats?.pendingWithdrawals ?? 0, icon: Clock, color: "text-amber-500" },
    { label: "Paid Out to Date", value: money(stats?.stats?.totalAmountPaid ?? 0), icon: Wallet, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Affiliate Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((c) => (
          <div key={c.label} className="surface-card p-5 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wide text-muted-foreground">{c.label}</p>
              <c.icon className={`size-4 ${c.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Withdrawal Queue Card */}
      <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <Wallet className="size-5 text-primary" /> M-Pesa Payout Queue
            </h3>
            <p className="text-xs text-muted-foreground">
              Review affiliate withdrawal requests and record M-Pesa transaction reference codes.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-9 gap-1.5 text-xs self-start sm:self-auto"
            onClick={() => exportToCsv("affiliate_withdrawals", withdrawals ?? [])}
          >
            <Download className="size-3.5" /> Export Payouts CSV
          </Button>
        </div>

        {withdrawals?.length ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate Partner</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>M-Pesa Phone</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>M-Pesa Ref</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <p className="font-semibold text-xs">{w.affiliate_email}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">Code: {w.affiliate_code}</p>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-emerald-500">{money(w.amount)}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{w.mpesa_phone}</TableCell>
                    <TableCell className="text-xs">{shortDate(w.requested_at)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={w.status === "paid" ? "default" : w.status === "pending" ? "secondary" : "destructive"}
                        className="text-[10px] capitalize"
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground select-all">
                      {w.mpesa_reference || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {w.status === "pending" || w.status === "processing" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="rounded-full h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            onClick={() => {
                              setSelectedWithdrawal(w);
                              setPayModalOpen(true);
                            }}
                          >
                            <Check className="size-3 mr-1" /> Mark Paid
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full h-8 px-3 text-xs"
                            onClick={() => {
                              setSelectedWithdrawal(w);
                              setRejectModalOpen(true);
                            }}
                          >
                            <X className="size-3 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Settled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState title="No withdrawal requests in queue" />
        )}
      </div>

      {/* All Affiliates Directory Card */}
      <div className="surface-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <Users className="size-5 text-primary" /> Affiliate Partner Directory
            </h3>
            <p className="text-xs text-muted-foreground">
              {filteredAffiliates.length} enrolled partners tracking referrals and commissions
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search partner email, code..."
              value={affiliateSearch}
              onChange={(e) => setAffiliateSearch(e.target.value)}
              className="pl-9 h-9 rounded-full text-xs"
            />
          </div>
        </div>

        {filteredAffiliates.length ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[850px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Partner Account</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Referrals Count</TableHead>
                  <TableHead>Total Earned</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-xs font-mono">{a.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono font-bold text-xs text-primary border-primary/30">
                        {a.referral_code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={a.status === "active" ? "default" : a.status === "paused" ? "secondary" : "destructive"}
                        className="text-[10px] capitalize"
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-xs">{a.total_referrals ?? 0}</TableCell>
                    <TableCell className="font-bold text-xs text-emerald-500">{money(a.totalCommissions ?? 0)}</TableCell>
                    <TableCell className="font-semibold text-xs">{money(a.totalWithdrawn ?? 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        {a.status === "active" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-8 text-xs text-amber-500 hover:bg-amber-500/10"
                            onClick={() => toggleStatusMut.mutate({ affiliateId: a.id, status: "paused" })}
                          >
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-8 text-xs text-emerald-500 hover:bg-emerald-500/10"
                            onClick={() => toggleStatusMut.mutate({ affiliateId: a.id, status: "active" })}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState title="No affiliate partners registered yet" />
        )}
      </div>

      {/* DIALOG: PROCESS M-PESA PAYOUT */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-500" /> Settle M-Pesa Withdrawal
            </DialogTitle>
            <DialogDescription>
              Paying <strong className="text-foreground">{money(selectedWithdrawal?.amount ?? 0)}</strong> to{" "}
              <strong className="text-foreground">{selectedWithdrawal?.mpesa_phone}</strong> ({selectedWithdrawal?.affiliate_email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="mpesaRef">M-Pesa Transaction Code / Ref *</Label>
              <Input
                id="mpesaRef"
                placeholder="e.g. QK8472910J"
                value={mpesaRefInput}
                onChange={(e) => setMpesaRefInput(e.target.value.toUpperCase())}
                className="font-mono uppercase font-bold tracking-wider"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the confirmation code received from Safaricom M-Pesa.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNote">Internal Note (Optional)</Label>
              <Input
                id="adminNote"
                placeholder="e.g. Sent via B2C M-Pesa Portal"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full" onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow font-semibold"
              disabled={!mpesaRefInput.trim() || processMutation.isPending}
              onClick={() => processMutation.mutate()}
            >
              {processMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Confirm Settlement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: REJECT WITHDRAWAL */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" /> Reject Withdrawal Request
            </DialogTitle>
            <DialogDescription>
              Rejecting this request will immediately return the{" "}
              <strong className="text-foreground">{money(selectedWithdrawal?.amount ?? 0)}</strong> to the affiliate's balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="rejectNote">Reason for Rejection (Optional)</Label>
              <Input
                id="rejectNote"
                placeholder="e.g. Incorrect M-Pesa phone number provided"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full font-semibold"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              {rejectMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Reject & Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
