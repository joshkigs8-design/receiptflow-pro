import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as supabase } from "./client-CFjc3-zE.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as LoaderCircle, I as Copy, L as Clock, O as Info, P as DollarSign, V as CircleAlert, W as Check, Z as ArrowUpRight, i as Users, p as Share2, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { enrollAffiliate, getAffiliateDashboard, requestWithdrawal } from "./affiliate.functions-Bwy6Kuv7.mjs";
import { t as AppShell } from "./AppShell-C9P82U5L.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/affiliate-Cz9s6REz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://rentreceipt.co.ke";
function AffiliatePage() {
	const queryClient = useQueryClient();
	useNavigate();
	const fetchDashboard = useServerFn(getAffiliateDashboard);
	const enroll = useServerFn(enrollAffiliate);
	const requestWithdraw = useServerFn(requestWithdrawal);
	const { data: session, isLoading: sessionLoading } = useQuery({
		queryKey: ["affiliate-session"],
		queryFn: async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error || !data.session) return null;
			return data.session;
		},
		staleTime: 6e4
	});
	const { data: dashboardRaw, isLoading: dashboardLoading, refetch } = useQuery({
		queryKey: ["affiliate-dashboard"],
		queryFn: () => fetchDashboard(),
		staleTime: 3e4,
		enabled: !!session
	});
	const dashboard = dashboardRaw;
	const [showWithdrawalModal, setShowWithdrawalModal] = (0, import_react.useState)(false);
	const [withdrawAmount, setWithdrawAmount] = (0, import_react.useState)("");
	const [mpesaPhone, setMpesaPhone] = (0, import_react.useState)("");
	const [withdrawNote, setWithdrawNote] = (0, import_react.useState)("");
	const affiliate = dashboard?.affiliate;
	const referralLink = affiliate ? `${BASE_URL}/affiliate/auth?ref=${affiliate.referral_code}` : "";
	const availableBalance = dashboard?.available_balance ?? 0;
	const pendingCommissions = dashboard?.pending_commissions ?? 0;
	const totalEarnings = affiliate?.total_commissions_earned ?? 0;
	const totalWithdrawn = affiliate?.total_withdrawn ?? 0;
	const totalReferrals = dashboard?.referral_count ?? 0;
	const successfulReferrals = dashboard?.successful_referrals ?? 0;
	const enrollMutation = useMutation({
		mutationFn: () => enroll(),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
			await queryClient.refetchQueries({ queryKey: ["affiliate-dashboard"] });
			toast.success("Affiliate account created!");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create affiliate account")
	});
	const withdrawalMutation = useMutation({
		mutationFn: () => requestWithdraw({ data: {
			amount: Number(withdrawAmount),
			mpesaPhone,
			note: withdrawNote || null
		} }),
		onSuccess: () => {
			setShowWithdrawalModal(false);
			setWithdrawAmount("");
			setMpesaPhone("");
			setWithdrawNote("");
			queryClient.invalidateQueries({ queryKey: ["affiliate-dashboard"] });
			toast.success("Withdrawal requested! Admin will process within 24 hours.");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not request withdrawal")
	});
	async function copyReferralLink() {
		await navigator.clipboard.writeText(referralLink);
		toast.success("Referral link copied!");
	}
	async function shareReferralLink() {
		if (navigator.share) try {
			await navigator.share({
				title: "Join Rent Receipt Pro",
				text: "Earn KSh 50 for every referral! Join Rent Receipt Pro - the best property management platform for landlords.",
				url: referralLink
			});
		} catch {}
		else await copyReferralLink();
	}
	function getPaymentStatusBadge(hasPaid) {
		if (hasPaid) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant: "default",
			className: "gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Paid"]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant: "secondary",
			className: "gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Pending"]
		});
	}
	const stats = [
		{
			label: "Total Earnings",
			value: money(totalEarnings),
			icon: Wallet,
			color: "text-emerald-600"
		},
		{
			label: "Available Balance",
			value: money(availableBalance),
			icon: DollarSign,
			color: "text-primary"
		},
		{
			label: "Pending Earnings",
			value: money(pendingCommissions),
			icon: Clock,
			color: "text-amber-600"
		},
		{
			label: "Total Referrals",
			value: String(totalReferrals),
			icon: Users,
			color: "text-blue-600"
		},
		{
			label: "Successful Referrals",
			value: String(successfulReferrals),
			icon: Check,
			color: "text-emerald-600"
		},
		{
			label: "Total Withdrawn",
			value: money(totalWithdrawn),
			icon: ArrowUpRight,
			color: "text-muted-foreground"
		}
	];
	if (sessionLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Affiliate Program",
		description: "Earn KSh 50 for every paying referral",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-screen flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" })
		})
	});
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Affiliate Program",
		description: "Earn KSh 50 for every paying referral",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mx-auto max-w-2xl p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mx-auto size-12 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl font-bold",
					children: "Please sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "You need to be logged in to access the affiliate dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6 rounded-full shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/affiliate/auth",
						children: "Sign in or create account"
					})
				})
			]
		})
	});
	if (!affiliate) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Affiliate Program",
		description: "Earn KSh 50 for every paying referral",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mx-auto max-w-2xl p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mx-auto size-12 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl font-bold",
					children: "Join the Affiliate Program"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Earn KSh 50 for every landlord you refer who becomes a paying Rent Receipt Pro customer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 rounded-full shadow-glow",
					onClick: () => enrollMutation.mutate(),
					disabled: enrollMutation.isPending,
					children: enrollMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Create Affiliate Account"
				})
			]
		})
	});
	if (dashboardLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Affiliate Program",
		description: "Earn KSh 50 for every paying referral",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Affiliate Program",
		description: "Earn KSh 50 for every landlord you refer who becomes a paying customer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card p-6 lg:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl lg:text-3xl font-bold",
							children: "Earn KSh 50 for Every Referral"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Refer landlords to RentReceiptPro and earn KSh 50 when they become paying customers."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-3 w-full lg:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									readOnly: true,
									value: referralLink,
									className: "font-mono text-sm bg-muted",
									"aria-label": "Your referral link"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: copyReferralLink,
									className: "whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4 mr-1" }), " Copy"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: shareReferralLink,
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
					children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: stat.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, { className: `size-5 ${stat.color}` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl font-bold",
							children: stat.value
						})]
					}, stat.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "font-display text-lg",
							children: "Your Referrals"
						}), totalReferrals === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Share your referral link to start earning"
						})]
					}), dashboard?.referrals?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date Joined" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payment Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Commission" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date Earned" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: dashboard.referrals.map((ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: ref.user_name ?? "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: ref.user_email ?? "No email"
							})] }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: shortDate(ref.created_at) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: ref.has_paid ? "default" : "secondary",
								className: "gap-1",
								children: ref.has_paid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Active Customer"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Trial / Pending"] })
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: getPaymentStatusBadge(ref.has_paid) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: ref.has_paid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-emerald-600",
								children: money(50)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "—"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground",
								children: ref.has_paid ? dashboard.commissions?.find((c) => c.referral_id === ref.id && c.status !== "pending")?.created_at ? shortDate(dashboard.commissions.find((c) => c.referral_id === ref.id && c.status !== "pending")?.created_at) : "—" : "—"
							})
						] }, ref.id)) })] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto size-12 text-muted-foreground/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-semibold",
								children: "No referrals yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Share your referral link above. When someone signs up and pays, you'll see them here."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "font-display text-lg",
							children: "Request Withdrawal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-4 border-emerald-200 bg-emerald-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-emerald-800",
											children: "Available Balance"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-display text-3xl font-bold text-emerald-800",
										children: money(availableBalance)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-emerald-700",
										children: "Ready to withdraw"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-4 border-amber-200 bg-amber-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-amber-800",
											children: "Minimum Withdrawal"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-display text-3xl font-bold text-amber-800",
										children: "KSh 300"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-amber-700",
										children: "You need at least this amount"
									})
								]
							})]
						}),
						dashboard?.withdrawals?.length && dashboard.withdrawals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-semibold",
								children: "Recent Withdrawals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: dashboard.withdrawals.slice(0, 5).map((wd) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 bg-muted rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: money(wd.amount)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											shortDate(wd.requested_at),
											" ·",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: wd.status === "paid" ? "default" : wd.status === "pending" ? "outline" : "destructive",
												children: wd.status
											})
										]
									})] }), wd.mpesa_reference && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono text-muted-foreground",
										children: wd.mpesa_reference
									})]
								}, wd.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full sm:w-auto rounded-full shadow-glow",
								onClick: () => setShowWithdrawalModal(true),
								disabled: availableBalance < 300 || withdrawalMutation.isPending,
								children: withdrawalMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : availableBalance < 300 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 mr-2" }), "Need KSh 300+ to withdraw"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 mr-2" }), "Request Withdrawal"] })
							}), availableBalance < 300 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground text-center",
								children: "You need at least KSh 300 available before you can request a withdrawal."
							})]
						})
					]
				}),
				showWithdrawalModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/50",
					onClick: () => setShowWithdrawalModal(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "w-full max-w-md p-6",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Request Withdrawal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setShowWithdrawalModal(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								withdrawalMutation.mutate();
							},
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "amount",
											children: "Amount (KSh)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "amount",
											type: "number",
											min: 300,
											max: availableBalance,
											step: 50,
											value: withdrawAmount,
											onChange: (e) => setWithdrawAmount(e.target.value),
											placeholder: "300",
											required: true,
											disabled: withdrawalMutation.isPending
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["Minimum KSh 300 · Maximum ", money(availableBalance)]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "mpesaPhone",
											children: "M-Pesa Phone Number"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "mpesaPhone",
											type: "tel",
											value: mpesaPhone,
											onChange: (e) => setMpesaPhone(e.target.value),
											placeholder: "07XXXXXXXX",
											required: true,
											disabled: withdrawalMutation.isPending,
											maxLength: 15
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "We'll send the money to this M-Pesa number"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "note",
										children: "Note (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "note",
										value: withdrawNote,
										onChange: (e) => setWithdrawNote(e.target.value),
										placeholder: "Any additional details for admin",
										maxLength: 500,
										disabled: withdrawalMutation.isPending
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										className: "flex-1",
										onClick: () => setShowWithdrawalModal(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "flex-1 rounded-full shadow-glow",
										disabled: withdrawalMutation.isPending,
										children: withdrawalMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Submit Request"
									})]
								})
							]
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { AffiliatePage as component };
