import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  Clock,
  Copy,
  DollarSign,
  Info,
  Loader2,
  LogIn,
  LogOut,
  Share2,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/lib/theme";
import { money, shortDate } from "@/lib/format";
import {
  getAffiliateDashboard,
  requestWithdrawal,
  enrollAffiliate,
} from "@/lib/affiliate.functions";

export const Route = createFileRoute("/affiliate/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Affiliate Dashboard — RentReceiptPro" },
      {
        name: "description",
        content: "Track your referrals, commissions and payouts with RentReceiptPro.",
      },
      { property: "og:title", content: "Affiliate Dashboard — RentReceiptPro" },
      {
        property: "og:description",
        content: "Manage your affiliate link, track referred landlords, and request M-Pesa payouts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/affiliate" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/affiliate" }],
  }),
  component: AffiliateDashboardPage,
});

interface AffiliateProfile {
  user_id: string;
  referral_code: string;
  status: string;
  total_referrals: number;
  total_commissions_earned: number;
  total_withdrawn: number;
  pending_balance: number;
}

interface ReferralItem {
  id: string;
  referred_id: string;
  referral_code_used: string;
  created_at: string;
  user_email: string | null;
  user_name: string | null;
  has_paid: boolean;
}

interface CommissionItem {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  subscription_payment_id: string;
  referral_id: string;
}

interface WithdrawalItem {
  id: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "rejected" | string;
  mpesa_phone?: string | null;
  mpesa_reference?: string | null;
  admin_note?: string | null;
  requested_at: string;
  processed_at?: string | null;
}

interface DashboardPayload {
  affiliate: AffiliateProfile | null;
  available_balance: number;
  pending_commissions: number;
  referral_count: number;
  commission_count: number;
  successful_referrals: number;
  referrals: ReferralItem[];
  commissions: CommissionItem[];
  withdrawals: WithdrawalItem[];
}

function AffiliateDashboardPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchDashboardFn = useServerFn(getAffiliateDashboard);
  const enrollFn = useServerFn(enrollAffiliate);
  const requestWithdrawalFn = useServerFn(requestWithdrawal);

  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  // Query Auth Session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["affiliate-auth-session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return null;
      return data.session;
    },
    staleTime: 60_000,
  });

  // Query Dashboard Data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["affiliate-dashboard"],
    queryFn: async () => {
      const res = await fetchDashboardFn();
      return res as DashboardPayload;
    },
    enabled: !!session,
    staleTime: 30_000,
  });

  // Auto-enroll if logged in but no affiliate record yet
  const enrollMutation = useMutation({
    mutationFn: () => enrollFn(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
      toast.success("Affiliate account activated!");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not activate affiliate profile");
    },
  });

  useEffect(() => {
    if (session && dashboardData && !dashboardData.affiliate && !enrollMutation.isPending) {
      enrollMutation.mutate();
    }
  }, [session, dashboardData, enrollMutation]);

  // Withdrawal Mutation
  const withdrawalMutation = useMutation({
    mutationFn: async () => {
      const amt = Number(withdrawAmount);
      if (!amt || isNaN(amt) || amt < 300) {
        throw new Error("Minimum withdrawal amount is KSh 300");
      }
      if (amt > (dashboardData?.available_balance ?? 0)) {
        throw new Error("Amount exceeds your available balance");
      }
      if (!mpesaPhone.trim()) {
        throw new Error("Please enter your M-Pesa phone number");
      }

      return await requestWithdrawalFn({
        data: {
          amount: amt,
          mpesaPhone: mpesaPhone.trim(),
          note: withdrawNote.trim() || null,
        },
      });
    },
    onSuccess: async () => {
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setMpesaPhone("");
      setWithdrawNote("");
      await queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
      toast.success("Withdrawal request submitted! Payout will be processed within 24 hours.");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not submit withdrawal request");
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/affiliate/auth", search: { mode: "login" } });
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://rentreceipt.co.ke";
  const referralCode = dashboardData?.affiliate?.referral_code ?? "";
  const referralLink = referralCode ? `${origin}/affiliate/auth?ref=${referralCode}` : "";

  async function copyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  async function shareLink() {
    if (!referralLink) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join RentReceiptPro",
          text: "Streamline your rental properties with RentReceiptPro digital rent receipts!",
          url: referralLink,
        });
      } catch {
        // User closed share dialog
      }
    } else {
      await copyLink();
    }
  }

  // 1. Loading State
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading affiliate portal...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Strictly Protected)
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <header className="border-b border-border bg-card/60 backdrop-blur-xl px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="gradient-primary flex size-8 items-center justify-center rounded-lg shadow-glow">
                <Building2 className="size-4 text-primary-foreground" />
              </span>
              <span className="font-display text-base font-bold">RentReceiptPro</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="surface-card w-full max-w-md p-8 text-center shadow-xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wallet className="size-7" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold">Affiliate Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Please login or create an affiliate account to access your referral link, track commissions, and request payouts.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg" className="w-full rounded-full shadow-glow font-semibold">
                <Link to="/affiliate/auth" search={{ mode: "login" }}>
                  <LogIn className="mr-2 size-4" /> Login
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-full font-semibold">
                <Link to="/affiliate/auth" search={{ mode: "signup" }}>
                  <UserPlus className="mr-2 size-4" /> Create Account
                </Link>
              </Button>
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <Link to="/affiliate-program" className="text-xs text-muted-foreground hover:text-primary underline">
                Learn more about the Affiliate Program &rarr;
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
          RentReceiptPro Affiliate System &middot; &copy; {new Date().getFullYear()} Codevanta Ventures
        </footer>
      </div>
    );
  }

  // 3. Loading Dashboard Data
  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching your affiliate statistics...</p>
        </div>
      </div>
    );
  }

  const affiliate = dashboardData?.affiliate;
  const availableBalance = dashboardData?.available_balance ?? 0;
  const pendingEarnings = dashboardData?.pending_commissions ?? 0;
  const totalEarnings = affiliate?.total_commissions_earned ?? 0;
  const totalWithdrawn = affiliate?.total_withdrawn ?? 0;
  const totalReferrals = dashboardData?.referral_count ?? 0;
  const successfulReferrals = dashboardData?.successful_referrals ?? 0;
  const referralsList = dashboardData?.referrals ?? [];
  const withdrawalsList = dashboardData?.withdrawals ?? [];

  const statCards = [
    {
      label: "Total Earnings",
      value: money(totalEarnings),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      description: "Lifetime commissions earned",
    },
    {
      label: "Available Balance",
      value: money(availableBalance),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Ready for withdrawal",
      highlight: true,
    },
    {
      label: "Pending Earnings",
      value: money(pendingEarnings),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      description: "Awaiting referral checkout",
    },
    {
      label: "Total Referrals",
      value: String(totalReferrals),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      description: "Landlords registered with your code",
    },
    {
      label: "Successful Referrals",
      value: String(successfulReferrals),
      icon: BadgeCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      description: "Paid customer conversions",
    },
    {
      label: "Total Withdrawn",
      value: money(totalWithdrawn),
      icon: ArrowUpRight,
      color: "text-muted-foreground",
      bg: "bg-muted",
      description: "Successfully paid to M-Pesa",
    },
  ];

  function getStatusBadge(status: string) {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-600 text-white gap-1 hover:bg-emerald-700">
            <Check className="size-3" /> Paid
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-600 text-white gap-1 hover:bg-blue-700">
            <Clock className="size-3" /> Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1 bg-amber-50 dark:bg-amber-950/30">
            <Clock className="size-3" /> Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dedicated Affiliate Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow">
                <Building2 className="size-5 text-primary-foreground" />
              </span>
              <span className="font-display font-bold text-base hidden sm:inline">RentReceiptPro</span>
            </Link>
            <span className="h-4 w-px bg-border hidden sm:inline" />
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/15 text-primary">
              <Wallet className="size-3" />
              Affiliate Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={handleSignOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Affiliate Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your referrals, commissions and withdrawals in real time.
            </p>
          </div>
          {referralCode && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-muted-foreground">Your Code:</span>
              <span className="font-mono text-sm font-bold bg-muted px-2.5 py-1 rounded-lg border border-border">
                {referralCode}
              </span>
            </div>
          )}
        </div>

        {/* Referral Link Action Card */}
        <div className="surface-card p-6 sm:p-8 rounded-3xl shadow-sm border border-border/80">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Share2 className="size-3.5" /> Share &amp; Earn
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold">Your Unique Referral Link</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Share this link on WhatsApp, Facebook, X, or directly with landlords. You earn{" "}
                <strong className="text-foreground">KSh 50</strong> every time someone signs up and becomes a paying customer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Input
                  readOnly
                  value={referralLink}
                  aria-label="Your referral link"
                  className="font-mono text-xs sm:text-sm bg-muted/60 pr-10 border-border select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <Button onClick={copyLink} className="rounded-full shadow-glow font-semibold whitespace-nowrap">
                {copied ? <Check className="size-4 mr-1.5" /> : <Copy className="size-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <Button variant="outline" onClick={shareLink} className="rounded-full font-semibold whitespace-nowrap">
                <Share2 className="size-4 mr-1.5" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* 6 Statistics Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((st) => (
            <Card
              key={st.label}
              className={`p-5 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                st.highlight ? "border-primary/40 ring-1 ring-primary/20 bg-primary/[0.02]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase font-medium tracking-wider text-muted-foreground">{st.label}</p>
                <span className={`inline-flex size-8 items-center justify-center rounded-xl ${st.bg}`}>
                  <st.icon className={`size-4 ${st.color}`} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold tracking-tight">{st.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground truncate">{st.description}</p>
            </Card>
          ))}
        </div>

        {/* Referrals Section */}
        <div className="surface-card p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Referrals Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                All landlords registered via your personal referral link.
              </p>
            </div>
            <Badge variant="secondary" className="self-start sm:self-auto">
              {referralsList.length} total
            </Badge>
          </div>

          {referralsList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Referred User</TableHead>
                    <TableHead className="font-semibold">Date Joined</TableHead>
                    <TableHead className="font-semibold">Account Status</TableHead>
                    <TableHead className="font-semibold">Payment Status</TableHead>
                    <TableHead className="font-semibold">Commission</TableHead>
                    <TableHead className="font-semibold">Date Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralsList.map((ref) => {
                    const matchedCommission = dashboardData?.commissions.find(
                      (c) => c.referral_id === ref.id && c.status !== "pending"
                    );

                    return (
                      <TableRow key={ref.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{ref.user_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{ref.user_email || "No email"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{shortDate(ref.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant={ref.has_paid ? "default" : "secondary"} className="gap-1">
                            {ref.has_paid ? (
                              <>
                                <Check className="size-3" /> Paying Customer
                              </>
                            ) : (
                              <>
                                <Clock className="size-3" /> Free Trial / Pending
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ref.has_paid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="size-3" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" /> Pending Checkout
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {ref.has_paid ? (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {money(50)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground">
                          {matchedCommission?.created_at ? shortDate(matchedCommission.created_at) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl">
              <Users className="mx-auto size-12 text-muted-foreground/40" />
              <h3 className="mt-3 font-display font-semibold text-base">No referrals yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                Share your referral link above with landlords. When they create an account and pay, they will appear here.
              </p>
              <Button onClick={copyLink} size="sm" variant="outline" className="mt-4 rounded-full">
                <Copy className="size-3.5 mr-1.5" /> Copy Referral Link
              </Button>
            </div>
          )}
        </div>

        {/* Withdrawal & Payouts Section */}
        <div className="surface-card p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
                <Wallet className="size-5 text-primary" />
                Withdrawals &amp; Payouts
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Request M-Pesa payouts and track your withdrawal history.
              </p>
            </div>

            <Button
              onClick={() => setShowWithdrawModal(true)}
              disabled={availableBalance < 300}
              className="rounded-full shadow-glow font-semibold self-start sm:self-auto"
            >
              <ArrowUpRight className="mr-1.5 size-4" /> Request Withdrawal
            </Button>
          </div>

          {/* Balance Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 rounded-2xl border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Wallet className="size-5" />
                <span className="font-semibold text-sm">Available Balance</span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {money(availableBalance)}
              </p>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                {availableBalance >= 300 ? "Ready to withdraw to M-Pesa" : "Minimum withdrawal is KSh 300"}
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Info className="size-5" />
                <span className="font-semibold text-sm">Payout Policy</span>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-amber-900 dark:text-amber-100">
                KSh 300 Min &middot; 24h M-Pesa
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Withdrawals are reviewed and sent via M-Pesa within 24 hours.
              </p>
            </Card>
          </div>

          {/* Withdrawal History Table */}
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-sm text-foreground">Withdrawal History</h3>

            {withdrawalsList.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Date Requested</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">M-Pesa Phone</TableHead>
                      <TableHead className="font-semibold">M-Pesa Ref</TableHead>
                      <TableHead className="font-semibold">Admin Note</TableHead>
                      <TableHead className="font-semibold">Date Processed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalsList.map((wd) => (
                      <TableRow key={wd.id}>
                        <TableCell className="font-semibold">{money(wd.amount)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{shortDate(wd.requested_at)}</TableCell>
                        <TableCell>{getStatusBadge(wd.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{wd.mpesa_phone || "—"}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {wd.mpesa_reference || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {wd.admin_note || "—"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground">
                          {wd.processed_at ? shortDate(wd.processed_at) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-4">
                No withdrawal requests yet. When you earn KSh 300+, request a payout anytime.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="surface-card w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="gradient-primary flex size-8 items-center justify-center rounded-lg shadow-glow">
                  <Wallet className="size-4 text-primary-foreground" />
                </span>
                <h3 className="font-display text-lg font-bold">Request M-Pesa Withdrawal</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                withdrawalMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (KSh)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min={300}
                  max={availableBalance}
                  step={50}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="300"
                  required
                  disabled={withdrawalMutation.isPending}
                />
                <p className="text-[11px] text-muted-foreground flex justify-between">
                  <span>Minimum: KSh 300</span>
                  <span>Available: {money(availableBalance)}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-phone">M-Pesa Phone Number</Label>
                <Input
                  id="withdraw-phone"
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="07XXXXXXXX or 2547XXXXXXXX"
                  required
                  maxLength={15}
                  disabled={withdrawalMutation.isPending}
                />
                <p className="text-[11px] text-muted-foreground">
                  The M-Pesa registered number to receive the payout.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-note">Note for Admin (Optional)</Label>
                <Input
                  id="withdraw-note"
                  type="text"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  placeholder="e.g. Please process to Safaricom line"
                  maxLength={500}
                  disabled={withdrawalMutation.isPending}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={withdrawalMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-full shadow-glow font-semibold"
                  disabled={withdrawalMutation.isPending}
                >
                  {withdrawalMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-auto px-6 py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Codevanta Ventures &middot; RentReceiptPro Affiliate Program</p>
      </footer>
    </div>
  );
}

