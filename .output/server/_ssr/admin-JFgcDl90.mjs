import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as createServerFn } from "./server-CcxMPe2M.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-naOhUN9N.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BpimbMVJ.mjs";
import { t as supabase } from "./client-CFjc3-zE.mjs";
import { c as stringType, n as booleanType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as CircleCheckBig, E as LoaderCircle, I as Copy, J as Building2, L as Clock, R as CircleX, X as BadgeCheck, a as TrendingUp, d as ShieldCheck, f as ShieldAlert, i as Users, k as Gift, o as Trash2, q as CalendarClock, r as Wallet, s as Ticket, v as Power, w as LogOut, y as Plus } from "../_libs/lucide-react.mjs";
import { a as ThemeToggle } from "./router-Km1VtMJO.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-JFgcDl90.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var voucherInput = objectType({
	code: stringType().trim().min(4).max(40),
	months: numberType().int().min(1).max(60),
	max_uses: numberType().int().min(1).max(1e4),
	expires_at: stringType().optional().nullable(),
	note: stringType().max(200).optional().nullable()
});
var getIsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8ec3a24cdfc816c6a99237bbadf5c75ae0affc14e8a68ec0663a4f7dc5edbfa9"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("98193c088815d6bbdd4155ffbad4b125116e51df7ef81d3d6aef43156e028e01"));
var listVouchers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0d9d41873cdb9cb77864a504e2480b1077b0809623ecc3cce7921d31fb33251f"));
var createVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => voucherInput.parse(d)).handler(createSsrRpc("08f4958d20db10bd41b2c5f20446ce43d86dde22b94b4a146a05057b239a871b"));
var setVoucherActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	active: booleanType()
}).parse(d)).handler(createSsrRpc("b98b4156ff19758fc838b6cff18a0372feda9e5dd73de3d2f813fd7c8145e2eb"));
var deleteVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ee89dd767c08fa82b56745e5421817bcaa0ac7056f98de734615535e1405e6cf"));
var grantAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().uuid(),
	months: numberType().int().min(1).max(60)
}).parse(d)).handler(createSsrRpc("7315e64b7b705826508942d72c2c637e2806b87b499a8ee29a491c3bfed2450b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().min(4).max(40) }).parse(d)).handler(createSsrRpc("b9baa550ffbd6640840715c8f50cdac54633c900de41356c04906e4f64e10d36"));
var getAffiliateStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0bc2604852b17ad77d3819403f2903e2d42b910991d5aad7099480599355a842"));
var listAdminWithdrawals = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1886751ecd8237eea14205bb493dabe5b83afe52f5fcda01a3ae7847c0cff492"));
var processWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	withdrawalId: stringType().uuid(),
	mpesaReference: stringType().min(1).max(100),
	adminNote: stringType().max(500).optional().nullable()
}).parse(d)).handler(createSsrRpc("60dc1ab6c3919049e353d5d2c0761bd31d54b961d1cdbe757b48a00a8af1826e"));
var rejectWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	withdrawalId: stringType().uuid(),
	adminNote: stringType().max(500).optional().nullable()
}).parse(d)).handler(createSsrRpc("506687a5291008c6b3c0f2aa6aec97dfb594d9987f54276624af91f1ec40488a"));
var startProcessingWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ withdrawalId: stringType().uuid() }).parse(d)).handler(createSsrRpc("ba9552e912393d9dc23d2b0c4783cf2cd91ef7e4003be09b93825dc7121320a9"));
function randomCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "RRP-";
	for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
var stateStyles = {
	paid: "gradient-primary text-primary-foreground shadow-glow",
	trial: "bg-primary/15 text-primary",
	expired: "bg-muted text-muted-foreground"
};
function AdminFrame({ children, onSignOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-base font-bold",
						children: "Owner Admin Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: "Codevanta Ventures · Rent Receipt Pro"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
				onSignOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "rounded-full",
					onClick: onSignOut,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Sign out"
					})]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
			children
		})]
	});
}
function AdminSignIn({ onSignedIn }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
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
					data: {
						full_name: "Owner",
						company_name: "Codevanta Ventures"
					}
				}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-4 top-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card relative w-full max-w-md p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-11 items-center justify-center rounded-xl shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-2xl font-bold",
					children: "Owner admin sign-in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Private entrance to the Codevanta Ventures admin portal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-email",
								children: "Owner email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								maxLength: 200,
								autoComplete: "email"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								maxLength: 72,
								autoComplete: "current-password"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full rounded-full shadow-glow",
							disabled: busy,
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Enter admin portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full rounded-full",
							disabled: busy,
							onClick: createOwner,
							children: "First time? Create the owner account"
						})
					]
				})
			]
		})]
	});
}
function AdminRoute() {
	const qc = useQueryClient();
	const checkAdmin = useServerFn(getIsAdmin);
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	useQuery({
		queryKey: ["admin-session"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			setSignedIn(Boolean(data.user));
			return { user: Boolean(data.user) };
		}
	});
	const { data: role, isLoading: roleLoading } = useQuery({
		queryKey: ["is-admin"],
		queryFn: () => checkAdmin(),
		enabled: signedIn === true,
		retry: false
	});
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		setSignedIn(false);
	}
	if (signedIn === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" })
	}) });
	if (signedIn === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSignIn, { onSignedIn: async () => {
		setSignedIn(true);
		await qc.invalidateQueries();
	} });
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" })
		})
	});
	if (!role?.admin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mx-auto max-w-md p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 font-display text-xl font-bold",
					children: "Owner access only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This portal is limited to Codevanta Ventures administrators. Sign out and use the owner account."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {})
	});
}
function AffiliatesTab() {
	const qc = useQueryClient();
	const fetchStats = useServerFn(getAffiliateStats);
	const fetchWithdrawals = useServerFn(listAdminWithdrawals);
	const processWd = useServerFn(processWithdrawal);
	const rejectWd = useServerFn(rejectWithdrawal);
	const startProcessing = useServerFn(startProcessingWithdrawal);
	const { data: stats } = useQuery({
		queryKey: ["affiliate-stats"],
		queryFn: () => fetchStats()
	});
	const { data: withdrawals } = useQuery({
		queryKey: ["admin-withdrawals"],
		queryFn: () => fetchWithdrawals()
	});
	const processMutation = useMutation({
		mutationFn: (w) => processWd({ data: {
			withdrawalId: w.id,
			mpesaReference: w.mpesaRef,
			adminNote: w.note ?? null
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["affiliate-stats"] });
			qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
			toast.success("Withdrawal marked as paid");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not process withdrawal")
	});
	const rejectMutation = useMutation({
		mutationFn: (w) => rejectWd({ data: {
			withdrawalId: w.id,
			adminNote: w.note ?? null
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["affiliate-stats"] });
			qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
			toast.success("Withdrawal rejected, balance returned to affiliate");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not reject withdrawal")
	});
	useMutation({
		mutationFn: (id) => startProcessing({ data: { withdrawalId: id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["affiliate-stats"] });
			qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
		}
	});
	const s = stats?.stats;
	const statCards = [
		{
			label: "Total Affiliates",
			value: s?.totalAffiliates ?? 0,
			icon: Users
		},
		{
			label: "Total Referrals",
			value: s?.totalReferrals ?? 0,
			icon: Wallet
		},
		{
			label: "Successful Referrals",
			value: s?.successfulReferrals ?? 0,
			icon: CircleCheckBig
		},
		{
			label: "Total Commissions",
			value: s?.totalCommissions ?? 0,
			icon: Wallet
		},
		{
			label: "Pending Withdrawals",
			value: s?.pendingWithdrawals ?? 0,
			icon: Clock,
			color: "text-amber-600"
		},
		{
			label: "Paid Withdrawals",
			value: s?.paidWithdrawals ?? 0,
			icon: CircleCheckBig,
			color: "text-emerald-600"
		},
		{
			label: "Total Amount Paid",
			value: money(s?.totalAmountPaid ?? 0),
			icon: Wallet,
			color: "text-emerald-600"
		}
	];
	function getStatusBadge(status) {
		switch (status) {
			case "paid": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "default",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-3" }), " Paid"]
			});
			case "processing": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Processing"]
			});
			case "pending": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Pending"]
			});
			case "rejected": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "destructive",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }), " Rejected"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: status
			});
		}
	}
	function getActionButtons(w) {
		if (w.status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "default",
				className: "rounded-full",
				disabled: processMutation.isPending,
				onClick: () => {
					const mpesaRef = prompt("Enter M-Pesa transaction/reference number:");
					if (!mpesaRef) return;
					const note = prompt("Admin note (optional):") || "";
					processMutation.mutate({
						id: w.id,
						amount: w.amount,
						mpesaRef,
						note
					});
				},
				children: "Mark as Paid"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "destructive",
				className: "rounded-full",
				disabled: rejectMutation.isPending,
				onClick: () => {
					if (!confirm(`Reject withdrawal of ${money(w.amount)} for ${w.affiliate_email}? Balance will be returned.`)) return;
					const note = prompt("Rejection reason (optional):") || "";
					rejectMutation.mutate({
						id: w.id,
						note
					});
				},
				children: "Reject"
			})]
		});
		if (w.status === "processing") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "default",
				className: "rounded-full",
				disabled: processMutation.isPending,
				onClick: () => {
					const mpesaRef = prompt("Enter M-Pesa transaction/reference number:");
					if (!mpesaRef) return;
					const note = prompt("Admin note (optional):") || "";
					processMutation.mutate({
						id: w.id,
						amount: w.amount,
						mpesaRef,
						note
					});
				},
				children: "Mark as Paid"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "destructive",
				className: "rounded-full",
				disabled: rejectMutation.isPending,
				onClick: () => {
					if (!confirm(`Reject withdrawal of ${money(w.amount)} for ${w.affiliate_email}? Balance will be returned.`)) return;
					const note = prompt("Rejection reason (optional):") || "";
					rejectMutation.mutate({
						id: w.id,
						note
					});
				},
				children: "Reject"
			})]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: "Completed"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7",
				children: statCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: `size-4 ${c.color ?? "text-primary"}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl font-bold",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 font-display text-base font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-primary" }), " Withdrawal Management"]
				}), withdrawals?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Affiliate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "M-Pesa Number" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Requested Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "M-Pesa Ref" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Admin Action"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: withdrawals.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: w.affiliate_email ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Code: ", w.affiliate_code ?? "—"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-semibold",
							children: money(w.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-sm",
							children: w.mpesa_phone ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: shortDate(w.requested_at) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: getStatusBadge(w.status) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: w.processed_at ? shortDate(w.processed_at) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs text-muted-foreground",
							children: w.mpesa_reference ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: getActionButtons(w)
						})
					] }, w.id)) })] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No withdrawal requests yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 font-display text-base font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), " All Affiliates"]
				}), stats?.affiliates?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Affiliate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Referral Code" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Referrals" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Commissions" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Withdrawn" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pending Withdrawals" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: stats.affiliates.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.user_id }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono",
							children: a.referral_code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: a.status === "active" ? "default" : "secondary",
							children: a.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.total_referrals ?? 0 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: money(a.totalCommissions ?? 0) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: money(a.totalWithdrawn ?? 0) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: money(a.pendingWithdrawals ?? 0) })
					] }, a.user_id)) })] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No affiliates enrolled yet."
				})]
			})
		]
	});
}
function AdminDashboard() {
	const qc = useQueryClient();
	const fetchOverview = useServerFn(getAdminOverview);
	const fetchVouchers = useServerFn(listVouchers);
	const addVoucher = useServerFn(createVoucher);
	const toggleVoucher = useServerFn(setVoucherActive);
	const removeVoucher = useServerFn(deleteVoucher);
	const extend = useServerFn(grantAccess);
	const [code, setCode] = (0, import_react.useState)(randomCode);
	const [months, setMonths] = (0, import_react.useState)("1");
	const [maxUses, setMaxUses] = (0, import_react.useState)("1");
	const [expires, setExpires] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: ["admin-overview"],
		queryFn: () => fetchOverview()
	});
	const { data: vouchers } = useQuery({
		queryKey: ["admin-vouchers"],
		queryFn: () => fetchVouchers()
	});
	const create = useMutation({
		mutationFn: () => addVoucher({ data: {
			code,
			months: Number(months) || 1,
			max_uses: Number(maxUses) || 1,
			expires_at: expires || null,
			note: note || null
		} }),
		onSuccess: async () => {
			toast.success(`Voucher ${code.toUpperCase()} created`);
			setCode(randomCode());
			setNote("");
			setExpires("");
			await qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create voucher")
	});
	const toggle = useMutation({
		mutationFn: (v) => toggleVoucher({ data: v }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vouchers"] })
	});
	const del = useMutation({
		mutationFn: (id) => removeVoucher({ data: { id } }),
		onSuccess: () => {
			toast.success("Voucher deleted");
			qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
		}
	});
	const grant = useMutation({
		mutationFn: (v) => extend({ data: v }),
		onSuccess: (res) => {
			toast.success(`Access extended to ${shortDate(res.endsAt)}`);
			qc.invalidateQueries({ queryKey: ["admin-overview"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not extend access")
	});
	const stats = data?.stats;
	const cards = [
		{
			label: "Landlords",
			value: stats?.landlords ?? 0,
			icon: Users
		},
		{
			label: "Paying",
			value: stats?.paying ?? 0,
			icon: BadgeCheck
		},
		{
			label: "On trial",
			value: stats?.onTrial ?? 0,
			icon: CalendarClock
		},
		{
			label: "Expired",
			value: stats?.expired ?? 0,
			icon: ShieldAlert
		},
		{
			label: "Subscription revenue",
			value: money(stats?.revenue ?? 0),
			icon: TrendingUp
		},
		{
			label: "Properties",
			value: stats?.properties ?? 0,
			icon: Building2
		},
		{
			label: "Tenants",
			value: stats?.tenants ?? 0,
			icon: Users
		},
		{
			label: "Rent tracked",
			value: money(stats?.rentTracked ?? 0),
			icon: TrendingUp
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "size-4 text-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-bold",
					children: c.value
				})]
			}, c.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "landlords",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "landlords",
						children: "Landlords"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "vouchers",
						children: "Voucher codes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "payments",
						children: "Payments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "affiliates",
						children: "Affiliates"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "landlords",
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card overflow-x-auto p-5",
						children: data?.landlords.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[900px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Account"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Access until"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Portfolio"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Rent tracked"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 text-right",
										children: "Grant"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.landlords.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: l.full_name ?? l.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: l.email
											}),
											l.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: l.phone
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${stateStyles[l.state]}`,
											children: l.state
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 capitalize",
										children: l.plan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: shortDate(l.endsAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 text-muted-foreground",
										children: [
											l.properties,
											" props · ",
											l.tenants,
											" tenants"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: money(l.rentCollected)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "inline-flex gap-1.5",
											children: [1, 12].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "rounded-full",
												disabled: grant.isPending,
												onClick: () => grant.mutate({
													userId: l.id,
													months: m
												}),
												children: [
													"+",
													m,
													"m"
												]
											}, m))
										})
									})
								]
							}, l.id)) })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No landlord accounts yet" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "vouchers",
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-2 font-display text-base font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-4 text-primary" }), " Create a voucher"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Code",
										htmlFor: "code",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "code",
												value: code,
												onChange: (e) => setCode(e.target.value.toUpperCase()),
												className: "font-mono"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												onClick: () => setCode(randomCode()),
												children: "New"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Free months",
											htmlFor: "months",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "months",
												type: "number",
												min: 1,
												value: months,
												onChange: (e) => setMonths(e.target.value)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Max uses",
											htmlFor: "uses",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "uses",
												type: "number",
												min: 1,
												value: maxUses,
												onChange: (e) => setMaxUses(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Expires (optional)",
										htmlFor: "expires",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "expires",
											type: "date",
											value: expires,
											onChange: (e) => setExpires(e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Note (optional)",
										htmlFor: "note",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "note",
											value: note,
											onChange: (e) => setNote(e.target.value),
											placeholder: "Promo for Nakuru landlords"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full rounded-full shadow-glow",
										disabled: create.isPending,
										onClick: () => create.mutate(),
										children: create.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Create voucher"] })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card overflow-x-auto p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 font-display text-base font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "size-4 text-primary" }), " Vouchers"]
								}),
								vouchers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "mt-4 w-full min-w-[620px] text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-left text-xs uppercase text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Code"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Months"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Used"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Expires"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3 text-right",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: vouchers.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "inline-flex items-center gap-1.5 font-mono font-semibold hover:text-primary",
													onClick: () => {
														navigator.clipboard.writeText(v.code);
														toast.success("Code copied");
													},
													children: [
														v.code,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
													]
												}), v.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: v.note
												}) : null]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3",
												children: v.months
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-3",
												children: [
													v.used_count,
													"/",
													v.max_uses
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3",
												children: v.expires_at ? shortDate(v.expires_at) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${v.active && v.used_count < v.max_uses ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
													children: v.active ? v.used_count < v.max_uses ? "Active" : "Used up" : "Paused"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Toggle voucher",
														onClick: () => toggle.mutate({
															id: v.id,
															active: !v.active
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Delete voucher",
														onClick: () => del.mutate(v.id),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
													})]
												})
											})
										]
									}, v.id)) })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: "No vouchers yet — create one to give a landlord free months."
								}),
								data?.redemptions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-semibold uppercase text-muted-foreground",
										children: "Recent redemptions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-2 text-sm",
										children: data.redemptions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between border-t border-border pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													r.months,
													" month",
													r.months === 1 ? "" : "s",
													" · ",
													shortDate(r.created_at)
												]
											})]
										}, r.id))
									})]
								}) : null
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "payments",
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card overflow-x-auto p-5",
						children: data?.payments.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[700px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Account"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Reference"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: shortDate(p.paid_at ?? p.created_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: p.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 capitalize",
										children: p.plan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: money(p.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 font-mono text-xs text-muted-foreground",
										children: p.reference
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 capitalize",
										children: p.status
									})
								]
							}, p.id)) })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No subscription payments yet" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "affiliates",
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AffiliatesTab, {})
				})
			]
		})]
	});
}
//#endregion
export { AdminRoute as component };
