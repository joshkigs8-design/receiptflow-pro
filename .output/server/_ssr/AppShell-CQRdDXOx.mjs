import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as createServerFn } from "./server-DQauuc8a.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DkoqJTkl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CY7VG7vy.mjs";
import { t as supabase } from "./client-CFjc3-zE.mjs";
import { c as stringType, i as enumType, s as objectType } from "../_libs/zod.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as FileText, C as Megaphone, D as LayoutDashboard, F as CreditCard, G as ChartPie, J as Building2, N as DoorOpen, S as Menu, T as Lock, Y as Bell, g as Receipt, i as Users, l as Sparkles, m as Settings, n as Wrench, r as Wallet, t as X, w as LogOut } from "../_libs/lucide-react.mjs";
import { a as ThemeToggle } from "./router-BDISlBH8.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-CQRdDXOx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getSubscription = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1f90e7e423cd1b478c90cbd4d80049ba204470112ca1bc61aff404b7357133cf"));
var startCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	plan: enumType(["monthly", "yearly"]),
	origin: stringType().url()
}).parse(d)).handler(createSsrRpc("01e996661c3848d9bb13e2aa645239bfbf1a89febf5bd5d8b2241ab08624051e"));
var verifyCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ reference: stringType().min(6).max(120) }).parse(d)).handler(createSsrRpc("f0b9df10baeca915f1693d3b226975f2c9c3f4178bcb64a0e41b1524364ad743"));
var nav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/properties",
		label: "Properties",
		icon: Building2
	},
	{
		to: "/units",
		label: "Units",
		icon: DoorOpen
	},
	{
		to: "/tenants",
		label: "Tenants",
		icon: Users
	},
	{
		to: "/payments",
		label: "Payments",
		icon: Receipt
	},
	{
		to: "/receipts",
		label: "Receipts",
		icon: FileText
	},
	{
		to: "/requests",
		label: "Maintenance",
		icon: Wrench
	},
	{
		to: "/announcements",
		label: "Announcements",
		icon: Megaphone
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartPie
	},
	{
		to: "/billing",
		label: "Billing",
		icon: CreditCard
	},
	{
		to: "/affiliate",
		label: "Affiliate Program",
		icon: Wallet
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ title, description, actions, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const fetchSubscription = useServerFn(getSubscription);
	const { data: sub } = useQuery({
		queryKey: ["subscription"],
		queryFn: () => fetchSubscription(),
		staleTime: 6e4
	});
	const exempt = pathname === "/billing" || pathname === "/settings";
	const locked = sub ? !sub.active && !exempt : false;
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center justify-between px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-8 items-center justify-center rounded-lg shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold",
							children: "Rent Receipt Pro"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "lg:hidden",
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-2 space-y-1 px-3 pb-8",
					children: nav.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/50 lg:hidden",
				onClick: () => setOpen(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(true),
								className: "glass inline-flex size-9 items-center justify-center rounded-full lg:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate font-display text-lg font-bold",
									children: title
								}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: description
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									actions,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/requests",
										"aria-label": "Notifications",
										className: "glass inline-flex size-10 items-center justify-center rounded-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										className: "rounded-full",
										onClick: signOut,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "Sign out"
										})]
									})
								]
							})
						]
					}),
					sub && sub.onTrial ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border bg-primary/10 px-4 py-2.5 text-center text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 inline size-3.5 text-primary" }),
							"Free trial — ",
							sub.daysLeft,
							" day",
							sub.daysLeft === 1 ? "" : "s",
							" left (ends",
							" ",
							shortDate(sub.endsAt),
							").",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/billing",
								className: "font-semibold text-primary hover:underline",
								children: "Activate your plan"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto max-w-7xl px-4 py-8",
						children: locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card mx-auto max-w-lg p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gradient-primary mx-auto flex size-14 items-center justify-center rounded-2xl shadow-glow",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-6 text-primary-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 font-display text-2xl font-bold",
									children: "Your access has ended"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: [
										"Your free trial finished on ",
										shortDate(sub?.endsAt),
										". Subscribe for KSh 300/month or KSh 3,000/year to unlock your dashboard, tenants, payments and receipts again."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "mt-6 rounded-full shadow-glow",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/billing",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), " View plans"]
									})
								})
							]
						}) : children
					})
				]
			})
		]
	});
}
//#endregion
export { verifyCheckout as i, getSubscription as n, startCheckout as r, AppShell as t };
