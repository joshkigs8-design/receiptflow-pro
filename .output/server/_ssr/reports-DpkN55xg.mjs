import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Download } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money } from "./format-DGi3p9Yo.mjs";
import { c as getReports, t as AppShell } from "./AppShell-BWAvuJ1R.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, r as BarChart, s as CartesianGrid, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DpkN55xg.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"var(--color-primary)",
	"var(--color-chart-2)",
	"var(--color-chart-4)"
];
function ReportsPage() {
	const fetchReports = useServerFn(getReports);
	const { data } = useQuery({
		queryKey: ["reports"],
		queryFn: () => fetchReports()
	});
	const payments = data?.payments ?? [];
	const units = data?.units ?? [];
	const tenants = data?.tenants ?? [];
	const byMonth = Array.from({ length: 12 }).map((_, i) => {
		const d = new Date((/* @__PURE__ */ new Date()).getFullYear(), i, 1);
		const key = d.toISOString().slice(0, 7);
		return {
			month: d.toLocaleDateString("en-GB", { month: "short" }),
			income: payments.filter((p) => (p.paid_at ?? "").startsWith(key)).reduce((s, p) => s + Number(p.amount), 0)
		};
	});
	const byMethod = [
		"cash",
		"mpesa",
		"bank",
		"card",
		"cheque"
	].map((m) => ({
		name: m,
		value: payments.filter((p) => p.method === m).reduce((s, p) => s + Number(p.amount), 0)
	})).filter((x) => x.value > 0);
	const totalIncome = payments.reduce((s, p) => s + Number(p.amount), 0);
	const expected = tenants.filter((t) => t.status === "active").reduce((s, t) => s + Number(t.rent_amount), 0);
	const occupied = units.filter((u) => u.status === "occupied").length;
	function exportCsv() {
		const header = "date,amount,method,status\n";
		const body = payments.map((p) => `${p.paid_at},${p.amount},${p.method},${p.status}`).join("\n");
		const blob = new Blob([header + body], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "payments.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Reports",
		description: "Income, occupancy and payment mix",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			className: "rounded-full",
			onClick: exportCsv,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export CSV"]
		}),
		"data-tsd-source": "/src/routes/_authenticated/reports.tsx:84:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			"data-tsd-source": "/src/routes/_authenticated/reports.tsx:93:7",
			children: [
				{
					label: "Total collected",
					value: money(totalIncome)
				},
				{
					label: "Expected monthly",
					value: money(expected)
				},
				{
					label: "Occupancy",
					value: units.length ? `${Math.round(occupied / units.length * 100)}%` : "—"
				}
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				"data-tsd-source": "/src/routes/_authenticated/reports.tsx:102:11",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground uppercase",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:103:13",
					children: c.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-2xl font-bold",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:104:13",
					children: c.value
				})]
			}, c.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			"data-tsd-source": "/src/routes/_authenticated/reports.tsx:109:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-6 lg:col-span-2",
				"data-tsd-source": "/src/routes/_authenticated/reports.tsx:110:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:111:11",
					children: "Income by month"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 h-72",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:112:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						"data-tsd-source": "/src/routes/_authenticated/reports.tsx:113:13",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: byMonth,
							"data-tsd-source": "/src/routes/_authenticated/reports.tsx:114:15",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)",
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:115:17"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "var(--color-muted-foreground)",
									fontSize: 12,
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:116:17"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--color-muted-foreground)",
									fontSize: 12,
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:117:17"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 12
									},
									formatter: (v) => money(v),
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:118:17"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "income",
									fill: "var(--color-primary)",
									radius: [
										8,
										8,
										0,
										0
									],
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:126:17"
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-6",
				"data-tsd-source": "/src/routes/_authenticated/reports.tsx:132:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:133:11",
					children: "Payment methods"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 h-72",
					"data-tsd-source": "/src/routes/_authenticated/reports.tsx:134:11",
					children: byMethod.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/reports.tsx:136:15",
						children: "No payments yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						"data-tsd-source": "/src/routes/_authenticated/reports.tsx:138:15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, {
							"data-tsd-source": "/src/routes/_authenticated/reports.tsx:139:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: byMethod,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 55,
								outerRadius: 90,
								"data-tsd-source": "/src/routes/_authenticated/reports.tsx:140:19",
								children: byMethod.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: COLORS[i % COLORS.length],
									"data-tsd-source": "/src/routes/_authenticated/reports.tsx:148:23"
								}, entry.name))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (v) => money(v),
								"data-tsd-source": "/src/routes/_authenticated/reports.tsx:151:19"
							})]
						})
					})
				})]
			})]
		})]
	});
}
//#endregion
export { ReportsPage as component };
