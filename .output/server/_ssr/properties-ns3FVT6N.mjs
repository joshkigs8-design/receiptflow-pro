import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as Building2, b as Pencil, o as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, r as PROPERTY_TYPES } from "./format-DGi3p9Yo.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as AppShell } from "./AppShell-CbCnobvS.mjs";
import { d as listProperties, r as deleteProperty, v as saveProperty } from "./app.functions-Dx_E3cw9.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-ns3FVT6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = {
	name: "",
	code: "",
	property_type: "apartment",
	address: "",
	description: "",
	units_count: 0,
	status: "active",
	notes: ""
};
function PropertiesPage() {
	const qc = useQueryClient();
	const fetchAll = useServerFn(listProperties);
	const save = useServerFn(saveProperty);
	const remove = useServerFn(deleteProperty);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(blank);
	const { data, isLoading } = useQuery({
		queryKey: ["properties"],
		queryFn: () => fetchAll()
	});
	const saveMutation = useMutation({
		mutationFn: (d) => save({ data: {
			...d,
			amenities: []
		} }),
		onSuccess: () => {
			toast.success("Property saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["properties"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message || "Could not save property")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Property deleted");
			qc.invalidateQueries({ queryKey: ["properties"] });
		},
		onError: () => toast.error("Could not delete property")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Properties",
		description: "Buildings, hostels and houses you manage",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			className: "rounded-full shadow-glow",
			onClick: () => {
				setDraft(blank);
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add property"]
		}),
		children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading properties…"
		}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No properties yet",
			hint: "Add your first property to start tracking units and tenants."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: (data ?? []).map((p) => {
				const units = p.units ?? [];
				const occupied = units.filter((u) => u.status === "occupied").length;
				const potential = units.reduce((s, u) => s + Number(u.rent ?? 0), 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "gradient-primary mb-3 inline-flex size-10 items-center justify-center rounded-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-primary-foreground" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "truncate font-semibold",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Code ", p.code]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "capitalize",
								children: p.property_type
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 grid grid-cols-2 gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Units"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-semibold",
								children: [
									occupied,
									"/",
									units.length || p.units_count
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Rent potential"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-semibold",
								children: money(potential)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "rounded-full",
								onClick: () => {
									setDraft({
										id: p.id,
										name: p.name,
										code: p.code,
										property_type: p.property_type ?? "apartment",
										address: p.address ?? "",
										description: p.description ?? "",
										units_count: Number(p.units_count ?? 0),
										status: p.status ?? "active",
										notes: p.notes ?? ""
									});
									setOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), " Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "rounded-full text-destructive",
								onClick: () => {
									if (confirm(`Delete ${p.name}? This removes its units and tenants.`)) deleteMutation.mutate(p.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, p.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: draft.id ? "Edit property" : "New property" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4 sm:grid-cols-2",
					onSubmit: (e) => {
						e.preventDefault();
						saveMutation.mutate(draft);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property name",
							htmlFor: "name",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								required: true,
								maxLength: 120,
								value: draft.name,
								onChange: (e) => setDraft({
									...draft,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property code (tenants use this)",
							htmlFor: "code",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "code",
								required: true,
								maxLength: 24,
								placeholder: "CB-001",
								value: draft.code,
								onChange: (e) => setDraft({
									...draft,
									code: e.target.value.toUpperCase()
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.property_type,
								onValueChange: (v) => setDraft({
									...draft,
									property_type: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PROPERTY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									className: "capitalize",
									children: t
								}, t)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							htmlFor: "address",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "address",
								maxLength: 200,
								value: draft.address,
								onChange: (e) => setDraft({
									...draft,
									address: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Total units",
							htmlFor: "units",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "units",
								type: "number",
								min: 0,
								value: draft.units_count,
								onChange: (e) => setDraft({
									...draft,
									units_count: Number(e.target.value)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.status,
								onValueChange: (v) => setDraft({
									...draft,
									status: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "active",
									children: "Active"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "inactive",
									children: "Inactive"
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								maxLength: 2e3,
								value: draft.description,
								onChange: (e) => setDraft({
									...draft,
									description: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: saveMutation.isPending,
								children: "Save property"
							})
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { PropertiesPage as component };
