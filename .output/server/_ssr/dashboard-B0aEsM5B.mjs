import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as FileText, J as Building2, N as DoorOpen, a as TrendingUp, i as Users, n as Wrench, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as AppShell } from "./AppShell-PG6l2ot8.mjs";
import { o as getDashboard } from "./app.functions-Pj4e3HK0.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B0aEsM5B.js
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function DashboardPage() {
	const fetchDashboard = useServerFn(getDashboard);
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fetchDashboard()
	});
	const t = data?.totals;
	const cards = [
		{
			label: "Properties",
			value: t ? String(t.properties) : "—",
			icon: Building2
		},
		{
			label: "Units",
			value: t ? `${t.occupied}/${t.units} occupied` : "—",
			icon: DoorOpen
		},
		{
			label: "Tenants",
			value: t ? String(t.tenants) : "—",
			icon: Users
		},
		{
			label: "Collected this month",
			value: t ? money(t.monthlyIncome) : "—",
			icon: Wallet
		},
		{
			label: "Outstanding",
			value: t ? money(t.outstanding) : "—",
			icon: TrendingUp
		},
		{
			label: "Open requests",
			value: t ? String(t.openRequests) : "—",
			icon: Wrench
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dashboard",
		description: "Live overview of your portfolio",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			className: "rounded-full shadow-glow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/payments",
				children: "Record payment"
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground uppercase",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "size-4 text-primary" })]
					}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-24" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl font-bold",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Revenue trend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Last 6 months"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: data?.revenueByMonth ?? [],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "rev",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-primary)",
												stopOpacity: .6
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-primary)",
												stopOpacity: .05
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												background: "var(--color-card)",
												border: "1px solid var(--color-border)",
												borderRadius: 12
											},
											formatter: (v) => money(v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "income",
											stroke: "var(--color-primary)",
											strokeWidth: 2,
											fill: "url(#rev)"
										})
									]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Recent receipts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							children: [(data?.recentReceipts ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-medium",
										children: r.receipt_number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: shortDate(r.issued_at)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									children: money(Number(r.amount))
								})]
							}, r.id)), !isLoading && (data?.recentReceipts ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "No receipts yet."
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-8 font-semibold",
							children: "Leases expiring soon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							children: [(data?.expiringLeases ?? []).map((t2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: t2.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: shortDate(t2.lease_end)
								})]
							}, t2.id)), !isLoading && (data?.expiringLeases ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "Nothing expiring in 60 days."
							}) : null]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mt-6 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Recent payments"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2",
									children: "Method"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right",
									children: "Amount"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data?.recentPayments ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3",
									children: shortDate(p.paid_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 capitalize",
									children: p.method
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 capitalize",
									children: p.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 text-right font-semibold",
									children: money(Number(p.amount))
								})
							]
						}, p.id)) })]
					}), !isLoading && (data?.recentPayments ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-sm text-muted-foreground",
						children: "No payments recorded yet."
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
