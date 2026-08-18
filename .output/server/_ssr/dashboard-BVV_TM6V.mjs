import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { O as FileText, V as Building2, a as TrendingUp, i as Users, j as DoorOpen, n as Wrench, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { s as getDashboard, t as AppShell } from "./AppShell-BWAvuJ1R.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BVV_TM6V.js
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
		"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:53:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:62:7",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:64:11",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:65:13",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground uppercase",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:66:15",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
							className: "size-4 text-primary",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:67:15"
						})]
					}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
						className: "mt-3 h-7 w-24",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:70:15"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl font-bold",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:72:15",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-3",
				"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:78:7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6 lg:col-span-2",
					"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:79:9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:80:11",
							children: "Revenue trend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:81:11",
							children: "Last 6 months"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-64",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:82:11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:83:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: data?.revenueByMonth ?? [],
									"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:84:15",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", {
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:85:17",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "rev",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:86:19",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "var(--color-primary)",
													stopOpacity: .6,
													"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:87:21"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "var(--color-primary)",
													stopOpacity: .05,
													"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:88:21"
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:91:17"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:92:17"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:93:17"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												background: "var(--color-card)",
												border: "1px solid var(--color-border)",
												borderRadius: 12
											},
											formatter: (v) => money(v),
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:94:17"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "income",
											stroke: "var(--color-primary)",
											strokeWidth: 2,
											fill: "url(#rev)",
											"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:102:17"
										})
									]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:114:9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:115:11",
							children: "Recent receipts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:116:11",
							children: [(data?.recentReceipts ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 text-sm",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:118:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:119:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-medium",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:120:19",
										children: r.receipt_number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:121:19",
										children: shortDate(r.issued_at)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:123:17",
									children: money(Number(r.amount))
								})]
							}, r.id)), !isLoading && (data?.recentReceipts ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:127:15",
								children: "No receipts yet."
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-8 font-semibold",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:131:11",
							children: "Leases expiring soon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:132:11",
							children: [(data?.expiringLeases ?? []).map((t2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-sm",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:134:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:135:17",
									children: t2.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:136:17",
									children: shortDate(t2.lease_end)
								})]
							}, t2.id)), !isLoading && (data?.expiringLeases ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:140:15",
								children: "Nothing expiring in 60 days."
							}) : null]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mt-6 p-6",
				"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:146:7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:147:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
						className: "size-4 text-primary",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:148:11"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:149:11",
						children: "Recent payments"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 overflow-x-auto",
					"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:151:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:152:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs text-muted-foreground uppercase",
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:153:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:154:15",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:155:17",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:156:17",
										children: "Method"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:157:17",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 text-right",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:158:17",
										children: "Amount"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:161:13",
							children: (data?.recentPayments ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:163:17",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:164:19",
										children: shortDate(p.paid_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 capitalize",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:165:19",
										children: p.method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 capitalize",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:166:19",
										children: p.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-right font-semibold",
										"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:167:19",
										children: money(Number(p.amount))
									})
								]
							}, p.id))
						})]
					}), !isLoading && (data?.recentPayments ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/dashboard.tsx:173:13",
						children: "No payments recorded yet."
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
