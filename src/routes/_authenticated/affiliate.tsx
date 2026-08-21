import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Loader2,
  Users,
  Wallet,
  ArrowUpRight,
  Clock,
  DollarSign,
  Share2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAffiliateDashboard, requestWithdrawal, enrollAffiliate, getAffiliate } from "@/lib/affiliate.functions";
import { money, shortDate } from "@/lib/format";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://rentreceipt.co.ke";

interface AffiliateData {
  user_id: string;
  referral_code: string;
  status: string;
  total_referrals: number;
  total_commissions_earned: number;
  total_withdrawn: number;
  pending_balance: number;
}

interface DashboardData {
  affiliate: AffiliateData | null;
  available_balance: number;
  pending_commissions: number;
  referral_count: number;
  commission_count: number;
  successful_referrals: number;
  referrals: Array<{
    id: string;
    referred_id: string;
    referral_code_used: string;
    created_at: string;
    user_email: string | null;
    user_name: string | null;
    has_paid: boolean;
  }>;
  commissions: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    subscription_payment_id: string;
    referral_id: string;
  }>;
  withdrawals: Array<{
    id: string;
    amount: number;
    status: string;
    mpesa_reference: string | null;
    requested_at: string;
    processed_at: string | null;
  }>;
}

export const Route = createFileRoute("/_authenticated/affiliate")({
  head: () => ({
    meta: [
      { title: "Affiliate Program — Rent Receipt Pro" },
      { name: "description", content: "Earn KSh 50 for every landlord you refer who becomes a paying customer." },
      { property: "og:title", content: "Affiliate Program — Rent Receipt Pro" },
      { property: "og:description", content: "Refer landlords and earn commissions." },
    ],
  }),
  component: AffiliatePage,
});

function AffiliatePage() {
  const queryClient = useQueryClient();
  const fetchDashboard = useServerFn(getAffiliateDashboard);
  const enroll = useServerFn(enrollAffiliate);
  const requestWithdraw = useServerFn(requestWithdrawal);

  const { data: dashboardRaw, isLoading, refetch } = useQuery({
    queryKey: ["affiliate-dashboard"],
    queryFn: () => fetchDashboard(),
    staleTime: 30_000,
  });

  const dashboard = dashboardRaw as DashboardData | undefined;

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  const affiliate = dashboard?.affiliate;
  const referralLink = affiliate ? `${BASE_URL}/auth?ref=${affiliate.referral_code}` : "";
  const availableBalance = dashboard?.available_balance ?? 0;
  const pendingCommissions = dashboard?.pending_commissions ?? 0;
  const totalEarnings = affiliate?.total_commissions_earned ?? 0;
  const totalWithdrawn = affiliate?.total_withdrawn ?? 0;
  const totalReferrals = dashboard?.referral_count ?? 0;
  const successfulReferrals = dashboard?.successful_referrals ?? 0;
  const pendingReferrals = totalReferrals - successfulReferrals;

  const enrollMutation = useMutation({
    mutationFn: () => enroll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
      toast.success("Affiliate account created!");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create affiliate account"),
  });

  const withdrawalMutation = useMutation({
    mutationFn: () => requestWithdraw({
      data: {
        amount: Number(withdrawAmount),
        mpesaPhone,
        note: withdrawNote || null,
      },
    }),
    onSuccess: () => {
      setShowWithdrawalModal(false);
      setWithdrawAmount("");
      setMpesaPhone("");
      setWithdrawNote("");
      queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
      toast.success("Withdrawal requested! Admin will process within 24 hours.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not request withdrawal"),
  });

  async function copyReferralLink() {
    await navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  }

  async function shareReferralLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Rent Receipt Pro",
          text: "Earn KSh 50 for every referral! Join Rent Receipt Pro - the best property management platform for landlords.",
          url: referralLink,
        });
      } catch {
        // User cancelled or error - ignore
      }
    } else {
      await copyReferralLink();
    }
  }

  function getPaymentStatusBadge(hasPaid: boolean) {
    if (hasPaid) {
      return (
        <Badge variant="default" className="gap-1">
          <Check className="size-3" /> Paid
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="size-3" /> Pending
      </Badge>
    );
  }

  function getCommissionStatusBadge(status: string) {
    switch (status) {
      case "available":
        return <Badge variant="default">Available</Badge>;
      case "withdrawn":
        return <Badge variant="secondary">Withdrawn</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  const stats = [
    { label: "Total Earnings", value: money(totalEarnings), icon: Wallet, color: "text-emerald-600" },
    { label: "Available Balance", value: money(availableBalance), icon: DollarSign, color: "text-primary" },
    { label: "Pending Earnings", value: money(pendingCommissions), icon: Clock, color: "text-amber-600" },
    { label: "Total Referrals", value: String(totalReferrals), icon: Users, color: "text-blue-600" },
    { label: "Successful Referrals", value: String(successfulReferrals), icon: Check, color: "text-emerald-600" },
    { label: "Total Withdrawn", value: money(totalWithdrawn), icon: ArrowUpRight, color: "text-muted-foreground" },
  ];

  if (!affiliate && !enrollMutation.isPending) {
    return (
      <AppShell title="Affiliate Program" description="Earn KSh 50 for every paying referral">
        <div className="surface-card mx-auto max-w-2xl p-8 text-center">
          <Wallet className="mx-auto size-12 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold">Join the Affiliate Program</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Earn KSh 50 for every landlord you refer who becomes a paying Rent Receipt Pro customer.
          </p>
          <Button
            className="mt-6 rounded-full shadow-glow"
            onClick={() => enrollMutation.mutate()}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Create Affiliate Account"}
          </Button>
        </div>
      </AppShell>
    );
  }

  if (isLoading && !affiliate) {
    return (
      <AppShell title="Affiliate Program" description="Earn KSh 50 for every paying referral">
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Affiliate Program" description="Earn KSh 50 for every landlord you refer who becomes a paying customer">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="surface-card p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold">Earn KSh 50 for Every Referral</h2>
              <p className="mt-2 text-muted-foreground">
                Refer landlords to RentReceiptPro and earn KSh 50 when they become paying customers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex-1 flex gap-2">
                <Input
                  readOnly
                  value={referralLink}
                  className="font-mono text-sm bg-muted"
                  aria-label="Your referral link"
                />
                <Button variant="outline" onClick={copyReferralLink} className="whitespace-nowrap">
                  <Copy className="size-4 mr-1" /> Copy
                </Button>
              </div>
              <Button variant="outline" onClick={shareReferralLink} className="gap-2">
                <Share2 className="size-4" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Referral Table */}
        <div className="surface-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <CardTitle className="font-display text-lg">Your Referrals</CardTitle>
            {totalReferrals === 0 && (
              <span className="text-xs text-muted-foreground">
                Share your referral link to start earning
              </span>
            )}
          </div>

          {dashboard?.referrals?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.referrals.map((ref: any) => (
                    <TableRow key={ref.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ref.user_name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{ref.user_email ?? "No email"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{shortDate(ref.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={ref.has_paid ? "default" : "secondary"} className="gap-1">
                          {ref.has_paid ? (
                            <>
                              <Check className="size-3" /> Active Customer
                            </>
                          ) : (
                            <>
                              <Clock className="size-3" /> Trial / Pending
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(ref.has_paid)}</TableCell>
                      <TableCell>
                        {ref.has_paid ? (
                          <span className="font-semibold text-emerald-600">{money(50)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ref.has_paid
                          ? dashboard.commissions
                              ?.find((c: any) => c.referral_id === ref.id && c.status !== "pending")
                              ?.created_at
                              ? shortDate(
                                  dashboard.commissions.find(
                                    (c: any) => c.referral_id === ref.id && c.status !== "pending"
                                  )?.created_at
                                )
                              : "—"
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto size-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No referrals yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your referral link above. When someone signs up and pays, you'll see them here.
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Withdrawal Section */}
        <div className="surface-card p-6">
          <CardTitle className="font-display text-lg">Request Withdrawal</CardTitle>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="p-4 border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-2">
                <Wallet className="size-5 text-emerald-600" />
                <span className="font-semibold text-emerald-800">Available Balance</span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-emerald-800">{money(availableBalance)}</p>
              <p className="mt-1 text-xs text-emerald-700">Ready to withdraw</p>
            </Card>

            <Card className="p-4 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Minimum Withdrawal</span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-amber-800">KSh 300</p>
              <p className="mt-1 text-xs text-amber-700">You need at least this amount</p>
            </Card>
          </div>

          {dashboard?.withdrawals?.length && dashboard.withdrawals.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold">Recent Withdrawals</h4>
              <div className="mt-3 space-y-2">
                {dashboard.withdrawals.slice(0, 5).map((wd: any) => (
                  <div key={wd.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div>
                      <p className="font-medium">{money(wd.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {shortDate(wd.requested_at)} ·{" "}
                        <Badge variant={wd.status === "paid" ? "default" : wd.status === "pending" ? "outline" : "destructive"}>
                          {wd.status}
                        </Badge>
                      </p>
                    </div>
                    {wd.mpesa_reference && (
                      <span className="text-xs font-mono text-muted-foreground">{wd.mpesa_reference}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              className="w-full sm:w-auto rounded-full shadow-glow"
              onClick={() => setShowWithdrawalModal(true)}
              disabled={availableBalance < 300 || withdrawalMutation.isPending}
            >
              {withdrawalMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : availableBalance < 300 ? (
                <>
                  <AlertCircle className="size-4 mr-2" />
                  Need KSh 300+ to withdraw
                </>
              ) : (
                <>
                  <ArrowUpRight className="size-4 mr-2" />
                  Request Withdrawal
                </>
              )}
            </Button>
            {availableBalance < 300 && (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                You need at least KSh 300 available before you can request a withdrawal.
              </p>
            )}
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/50" onClick={() => setShowWithdrawalModal(false)}>
            <Card className="w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Request Withdrawal</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowWithdrawalModal(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); withdrawalMutation.mutate(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KSh)</Label>
                  <Input
                    id="amount"
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
                  <p className="text-xs text-muted-foreground">
                    Minimum KSh 300 · Maximum {money(availableBalance)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesaPhone"
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    required
                    disabled={withdrawalMutation.isPending}
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send the money to this M-Pesa number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Input
                    id="note"
                    value={withdrawNote}
                    onChange={(e) => setWithdrawNote(e.target.value)}
                    placeholder="Any additional details for admin"
                    maxLength={500}
                    disabled={withdrawalMutation.isPending}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowWithdrawalModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-full shadow-glow" disabled={withdrawalMutation.isPending}>
                    {withdrawalMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}