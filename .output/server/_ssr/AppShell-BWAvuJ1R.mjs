import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as createServerFn } from "./server-DsGdTo1N.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc--FJINHQa.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DGtjvBYq.mjs";
import { t as supabase } from "./client-C8qgcHBz.mjs";
import { c as stringType, i as enumType, r as coerce, s as objectType } from "../_libs/zod.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as LogOut, E as LayoutDashboard, H as Bell, M as CreditCard, O as FileText, R as ChartPie, S as Megaphone, V as Building2, h as Receipt, i as Users, j as DoorOpen, l as Sparkles, n as Wrench, p as Settings, t as X, w as Lock, x as Menu } from "../_libs/lucide-react.mjs";
import { r as ThemeToggle } from "./router-Dv0RVfoo.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
import { a as propertySchema, c as unitSchema, n as paymentSchema, o as settingsSchema, s as tenantSchema, t as announcementSchema } from "./schemas-DUPaCA9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-BWAvuJ1R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c451e54a9d2ab97753c2c74f857230c04311a69b1d08e273506d09d1891833f5"));
var saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => settingsSchema.parse(data)).handler(createSsrRpc("5487d7ed4fa27016c4a5375b56a35f0724412287133d6cf4a9b6c7b47cfef4de"));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d1b118821565a072a8272f3ff225b6ed85fb49c5888b71420f125d78a5e3e1e2"));
var listProperties = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5b8a25bae5676e90b8cd8a48918ab2013bfc20b84d1953fc7e200cab835c57c8"));
var saveProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => propertySchema.parse(data)).handler(createSsrRpc("759d823327e0d1379330ea78c0aa0ecbc4b4a623e2cd308ba6660e730ff9b4c4"));
var deleteProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("2f6b0943266923933b1a56abfae9fc738b87e99cf1fcf119029f7e7c65ab9790"));
var listUnits = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ propertyId: stringType().uuid().optional() }).parse(data ?? {})).handler(createSsrRpc("290ba7a69eb68e1b2e3bf73ccdb9452a534c177c98821eead0dc923f7a9e7080"));
var saveUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => unitSchema.parse(data)).handler(createSsrRpc("fe23efd2522d389f72aeb49c1a78a584c847a7921764ba4c45506bb2ade95a31"));
var deleteUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("241b3d16261a8d77f387f8e5b4a961f3463f871c29c6a56a3384afb66d5c52ab"));
var listTenants = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ecb6539f444664f98a1e97dcf6c7a71945f57b545701f90a18a47097aff00677"));
var saveTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => tenantSchema.parse(data)).handler(createSsrRpc("669402d1503873ad5760e13f8cf6e942466a7cf0bb682c0aff70fd5970411697"));
var deleteTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("234d49972d75ebb9a80c704625a1cd82be249f8d02ac5dbaa38e61fcc5c731d9"));
var listPayments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8237a64b6fb844fc7443ae575d9ce00c365c3651a5cb3bc54224c0a5f304e638"));
var recordPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => paymentSchema.parse(data)).handler(createSsrRpc("495504ec31c4f24cb7a01f41486baa51be718df0cf7567a25269b4267cdc2039"));
var listReceipts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("239a0a15e853d3ec484d8688d348a657842d9599f5e2cbb97583770e0346caa0"));
var updatePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	amount: coerce.number().positive(),
	method: stringType().min(1).max(40),
	reference: stringType().max(80).optional().nullable(),
	paid_at: stringType().min(4),
	period_label: stringType().max(40).optional().nullable(),
	notes: stringType().max(1e3).optional().nullable()
}).parse(data)).handler(createSsrRpc("b28c39fd8891c05a268c7759789c7cdd3f624cf4b859399dcf5190d823450171"));
var deletePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("b582cc06f0c046ad78eb457809370783ed49186ddfe833feb42daeeb5e557200"));
var listRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4c23af5cdc6874ce7e29fcb8c436c2ec37a90de1cbee1278d1985ee2cf6081c0"));
var updateRequestStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"open",
		"in_progress",
		"resolved"
	])
}).parse(data)).handler(createSsrRpc("15b806b7cf6f4bcf86632629ead957c274b475e57ae2dddac283da9e97ff5ea5"));
var listAnnouncements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("998b28c735c1d642c5d5b92637b4d6877a15677f8331e8cfbc97b5c6ddb763be"));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => announcementSchema.parse(data)).handler(createSsrRpc("bba92786a66d46f9d0c56b08716b67808e96b95733cc15001a237faeb62b18e5"));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("406e9770249dd0c75efac7d8d13c2918bdb7fa83d159d1784b17db16bf44edbe"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ term: stringType().trim().min(2).max(80) }).parse(data)).handler(createSsrRpc("b244f16c083ff9d8806db70383fc4204d412eb557928b3eafddebc2eab6a75be"));
var getReports = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a4692c1846b6bceaea30624edbf2d560f8793ad6c4d2fa3b0a67e89e83e83b20"));
var getSubscription = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1f90e7e423cd1b478c90cbd4d80049ba204470112ca1bc61aff404b7357133cf"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	plan: enumType(["monthly", "yearly"]),
	origin: stringType().url()
}).parse(d)).handler(createSsrRpc("01e996661c3848d9bb13e2aa645239bfbf1a89febf5bd5d8b2241ab08624051e"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ reference: stringType().min(6).max(120) }).parse(d)).handler(createSsrRpc("f0b9df10baeca915f1693d3b226975f2c9c3f4178bcb64a0e41b1524364ad743"));
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
		"data-tsd-source": "/src/components/app/AppShell.tsx:76:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
				"data-tsd-source": "/src/components/app/AppShell.tsx:77:7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center justify-between px-5",
					"data-tsd-source": "/src/components/app/AppShell.tsx:82:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-center gap-2.5",
						"data-tsd-source": "/src/components/app/AppShell.tsx:83:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-8 items-center justify-center rounded-lg shadow-glow",
							"data-tsd-source": "/src/components/app/AppShell.tsx:84:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "size-4 text-primary-foreground",
								"data-tsd-source": "/src/components/app/AppShell.tsx:85:15"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold",
							"data-tsd-source": "/src/components/app/AppShell.tsx:87:13",
							children: "Rent Receipt Pro"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "lg:hidden",
						"aria-label": "Close menu",
						"data-tsd-source": "/src/components/app/AppShell.tsx:89:11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"data-tsd-source": "/src/components/app/AppShell.tsx:90:13"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-2 space-y-1 px-3 pb-8",
					"data-tsd-source": "/src/components/app/AppShell.tsx:94:9",
					children: nav.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`,
							"data-tsd-source": "/src/components/app/AppShell.tsx:98:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-4",
								"data-tsd-source": "/src/components/app/AppShell.tsx:108:17"
							}), item.label]
						}, item.to);
					})
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/50 lg:hidden",
				onClick: () => setOpen(false),
				"data-tsd-source": "/src/components/app/AppShell.tsx:117:9"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				"data-tsd-source": "/src/components/app/AppShell.tsx:120:7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl",
						"data-tsd-source": "/src/components/app/AppShell.tsx:121:9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(true),
								className: "glass inline-flex size-9 items-center justify-center rounded-full lg:hidden",
								"aria-label": "Open menu",
								"data-tsd-source": "/src/components/app/AppShell.tsx:122:11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
									className: "size-4",
									"data-tsd-source": "/src/components/app/AppShell.tsx:127:13"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								"data-tsd-source": "/src/components/app/AppShell.tsx:129:11",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate font-display text-lg font-bold",
									"data-tsd-source": "/src/components/app/AppShell.tsx:130:13",
									children: title
								}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									"data-tsd-source": "/src/components/app/AppShell.tsx:132:15",
									children: description
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								"data-tsd-source": "/src/components/app/AppShell.tsx:135:11",
								children: [
									actions,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/requests",
										"aria-label": "Notifications",
										className: "glass inline-flex size-10 items-center justify-center rounded-full",
										"data-tsd-source": "/src/components/app/AppShell.tsx:137:13",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
											className: "size-4",
											"data-tsd-source": "/src/components/app/AppShell.tsx:142:15"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { "data-tsd-source": "/src/components/app/AppShell.tsx:144:13" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										className: "rounded-full",
										onClick: signOut,
										"data-tsd-source": "/src/components/app/AppShell.tsx:145:13",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
											className: "size-4",
											"data-tsd-source": "/src/components/app/AppShell.tsx:146:15"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											"data-tsd-source": "/src/components/app/AppShell.tsx:147:15",
											children: "Sign out"
										})]
									})
								]
							})
						]
					}),
					sub && sub.onTrial ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border bg-primary/10 px-4 py-2.5 text-center text-xs font-medium",
						"data-tsd-source": "/src/components/app/AppShell.tsx:153:11",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "mr-1 inline size-3.5 text-primary",
								"data-tsd-source": "/src/components/app/AppShell.tsx:154:13"
							}),
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
								"data-tsd-source": "/src/components/app/AppShell.tsx:157:13",
								children: "Activate your plan"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto max-w-7xl px-4 py-8",
						"data-tsd-source": "/src/components/app/AppShell.tsx:163:9",
						children: locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card mx-auto max-w-lg p-8 text-center",
							"data-tsd-source": "/src/components/app/AppShell.tsx:165:13",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gradient-primary mx-auto flex size-14 items-center justify-center rounded-2xl shadow-glow",
									"data-tsd-source": "/src/components/app/AppShell.tsx:166:15",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										className: "size-6 text-primary-foreground",
										"data-tsd-source": "/src/components/app/AppShell.tsx:167:17"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 font-display text-2xl font-bold",
									"data-tsd-source": "/src/components/app/AppShell.tsx:169:15",
									children: "Your access has ended"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									"data-tsd-source": "/src/components/app/AppShell.tsx:170:15",
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
									"data-tsd-source": "/src/components/app/AppShell.tsx:174:15",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/billing",
										"data-tsd-source": "/src/components/app/AppShell.tsx:175:17",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
											className: "size-4",
											"data-tsd-source": "/src/components/app/AppShell.tsx:176:19"
										}), " View plans"]
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
export { updatePayment as C, saveUnit as S, recordPayment as _, deleteTenant as a, saveSettings as b, getReports as c, listPayments as d, listProperties as f, listUnits as g, listTenants as h, deleteProperty as i, getSettings as l, listRequests as m, deleteAnnouncement as n, deleteUnit as o, listReceipts as p, deletePayment as r, getDashboard as s, AppShell as t, listAnnouncements as u, saveAnnouncement as v, updateRequestStatus as w, saveTenant as x, saveProperty as y };
