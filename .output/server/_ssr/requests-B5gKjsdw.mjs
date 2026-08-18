import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { m as listRequests, t as AppShell, w as updateRequestStatus } from "./AppShell-BWAvuJ1R.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests-B5gKjsdw.js
var import_jsx_runtime = require_jsx_runtime();
function RequestsPage() {
	const qc = useQueryClient();
	const fetchRequests = useServerFn(listRequests);
	const setStatus = useServerFn(updateRequestStatus);
	const { data, isLoading } = useQuery({
		queryKey: ["requests"],
		queryFn: () => fetchRequests()
	});
	const mutation = useMutation({
		mutationFn: (input) => setStatus({ data: input }),
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["requests"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: () => toast.error("Could not update status")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Maintenance",
		description: "Requests raised by your tenants",
		"data-tsd-source": "/src/routes/_authenticated/requests.tsx:51:5",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			"data-tsd-source": "/src/routes/_authenticated/requests.tsx:53:9",
			children: "Loading requests…"
		}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No maintenance requests",
			hint: "Tenants can raise issues from the tenant portal.",
			"data-tsd-source": "/src/routes/_authenticated/requests.tsx:55:9"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			"data-tsd-source": "/src/routes/_authenticated/requests.tsx:60:9",
			children: (data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card flex flex-wrap items-start gap-4 p-5",
				"data-tsd-source": "/src/routes/_authenticated/requests.tsx:62:13",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					"data-tsd-source": "/src/routes/_authenticated/requests.tsx:63:15",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							"data-tsd-source": "/src/routes/_authenticated/requests.tsx:64:17",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "capitalize",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:65:19",
									children: r.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "capitalize",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:66:19",
									children: r.priority
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:69:19",
									children: shortDate(r.created_at)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							"data-tsd-source": "/src/routes/_authenticated/requests.tsx:71:17",
							children: r.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							"data-tsd-source": "/src/routes/_authenticated/requests.tsx:72:17",
							children: [
								r.tenants?.full_name ?? "Tenant",
								" · ",
								r.properties?.name ?? "—",
								" · Unit",
								" ",
								r.units?.unit_number ?? "—"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-40",
					"data-tsd-source": "/src/routes/_authenticated/requests.tsx:77:15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: r.status ?? "open",
						onValueChange: (v) => mutation.mutate({
							id: r.id,
							status: v
						}),
						"data-tsd-source": "/src/routes/_authenticated/requests.tsx:78:17",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							"data-tsd-source": "/src/routes/_authenticated/requests.tsx:84:19",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { "data-tsd-source": "/src/routes/_authenticated/requests.tsx:85:21" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							"data-tsd-source": "/src/routes/_authenticated/requests.tsx:87:19",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "open",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:88:21",
									children: "Open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "in_progress",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:89:21",
									children: "In progress"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "resolved",
									"data-tsd-source": "/src/routes/_authenticated/requests.tsx:90:21",
									children: "Resolved"
								})
							]
						})]
					})
				})]
			}, r.id))
		})
	});
}
//#endregion
export { RequestsPage as component };
