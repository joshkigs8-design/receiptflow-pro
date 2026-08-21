import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money } from "./format-DGi3p9Yo.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as AppShell } from "./AppShell-PG6l2ot8.mjs";
import { a as deleteUnit, d as listProperties, h as listUnits, x as saveUnit } from "./app.functions-Pj4e3HK0.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/units-DQ7yiuqo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = {
	property_id: "",
	unit_number: "",
	room_number: "",
	floor: "",
	rent: 0,
	deposit: 0,
	status: "vacant",
	utilities: ""
};
function UnitsPage() {
	const qc = useQueryClient();
	const fetchUnits = useServerFn(listUnits);
	const fetchProperties = useServerFn(listProperties);
	const save = useServerFn(saveUnit);
	const remove = useServerFn(deleteUnit);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(blank);
	const properties = useQuery({
		queryKey: ["properties"],
		queryFn: () => fetchProperties()
	});
	const units = useQuery({
		queryKey: ["units", filter],
		queryFn: () => fetchUnits({ data: filter === "all" ? {} : { propertyId: filter } })
	});
	const saveMutation = useMutation({
		mutationFn: (d) => save({ data: d }),
		onSuccess: () => {
			toast.success("Unit saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["units"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message || "Could not save unit")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Unit deleted");
			qc.invalidateQueries({ queryKey: ["units"] });
		},
		onError: () => toast.error("Could not delete unit")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Units & rooms",
		description: "Rent, deposits and occupancy per unit",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			className: "rounded-full shadow-glow",
			onClick: () => {
				setDraft({
					...blank,
					property_id: (properties.data ?? [])[0]?.id ?? ""
				});
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add unit"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 max-w-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: filter,
					onValueChange: setFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All properties" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All properties"
					}), (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: p.id,
						children: p.name
					}, p.id))] })]
				})
			}),
			units.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading units…"
			}) : (units.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No units yet",
				hint: "Add units so tenants and rent can be tracked."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-x-auto p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Unit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Room"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Floor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Rent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Tenant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (units.data ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium",
								children: u.unit_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: u.room_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: u.floor ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: money(u.rent)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: u.tenants?.[0]?.full_name ?? "Vacant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: u.status === "occupied" ? "default" : "secondary",
									className: "capitalize",
									children: u.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "rounded-full",
									onClick: () => {
										setDraft({
											id: u.id,
											property_id: u.property_id,
											unit_number: u.unit_number,
											room_number: u.room_number ?? "",
											floor: u.floor ?? "",
											rent: Number(u.rent ?? 0),
											deposit: Number(u.deposit ?? 0),
											status: u.status ?? "vacant",
											utilities: u.utilities ?? ""
										});
										setOpen(true);
									},
									children: "Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "rounded-full text-destructive",
									onClick: () => {
										if (confirm(`Delete unit ${u.unit_number}?`)) deleteMutation.mutate(u.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							})
						]
					}, u.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: draft.id ? "Edit unit" : "New unit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (!draft.property_id) {
								toast.error("Select a property first");
								return;
							}
							saveMutation.mutate(draft);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Property",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.property_id,
									onValueChange: (v) => setDraft({
										...draft,
										property_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose property" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Unit number",
								htmlFor: "unit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "unit",
									required: true,
									maxLength: 40,
									value: draft.unit_number,
									onChange: (e) => setDraft({
										...draft,
										unit_number: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Room number (tenant login)",
								htmlFor: "room",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "room",
									maxLength: 40,
									value: draft.room_number,
									onChange: (e) => setDraft({
										...draft,
										room_number: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Floor",
								htmlFor: "floor",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "floor",
									maxLength: 24,
									value: draft.floor,
									onChange: (e) => setDraft({
										...draft,
										floor: e.target.value
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "vacant",
											children: "Vacant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "occupied",
											children: "Occupied"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "maintenance",
											children: "Maintenance"
										})
									] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Monthly rent",
								htmlFor: "rent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rent",
									type: "number",
									min: 0,
									value: draft.rent,
									onChange: (e) => setDraft({
										...draft,
										rent: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Deposit",
								htmlFor: "deposit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "deposit",
									type: "number",
									min: 0,
									value: draft.deposit,
									onChange: (e) => setDraft({
										...draft,
										deposit: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Utilities included",
								htmlFor: "utilities",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "utilities",
									maxLength: 500,
									placeholder: "Water, garbage, WiFi",
									value: draft.utilities,
									onChange: (e) => setDraft({
										...draft,
										utilities: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: saveMutation.isPending,
									children: "Save unit"
								})
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { UnitsPage as component };
