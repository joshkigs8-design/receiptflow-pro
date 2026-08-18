import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-DAZwhL9P.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { m as listRequests, t as AppShell, w as updateRequestStatus } from "./AppShell-CmMfWdS1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests-yl1QPJ8V.js
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
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading requests…"
		}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No maintenance requests",
			hint: "Tenants can raise issues from the tenant portal."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: (data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card flex flex-wrap items-start gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "capitalize",
									children: r.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "capitalize",
									children: r.priority
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: shortDate(r.created_at)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							children: r.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: r.status ?? "open",
						onValueChange: (v) => mutation.mutate({
							id: r.id,
							status: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "open",
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "in_progress",
								children: "In progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "resolved",
								children: "Resolved"
							})
						] })]
					})
				})]
			}, r.id))
		})
	});
}
//#endregion
export { RequestsPage as component };
