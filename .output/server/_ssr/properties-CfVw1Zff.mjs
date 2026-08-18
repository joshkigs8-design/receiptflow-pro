import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { V as Building2, o as Trash2, v as Plus, y as Pencil } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, r as PROPERTY_TYPES } from "./format-DGi3p9Yo.mjs";
import { n as Field, t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { f as listProperties, i as deleteProperty, t as AppShell, y as saveProperty } from "./AppShell-BWAvuJ1R.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-CfVw1Zff.js
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
		"data-tsd-source": "/src/routes/_authenticated/properties.tsx:96:5",
		children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			"data-tsd-source": "/src/routes/_authenticated/properties.tsx:113:9",
			children: "Loading properties…"
		}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No properties yet",
			hint: "Add your first property to start tracking units and tenants.",
			"data-tsd-source": "/src/routes/_authenticated/properties.tsx:115:9"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			"data-tsd-source": "/src/routes/_authenticated/properties.tsx:120:9",
			children: (data ?? []).map((p) => {
				const units = p.units ?? [];
				const occupied = units.filter((u) => u.status === "occupied").length;
				const potential = units.reduce((s, u) => s + Number(u.rent ?? 0), 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card p-6",
					"data-tsd-source": "/src/routes/_authenticated/properties.tsx:126:15",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:127:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:128:19",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "gradient-primary mb-3 inline-flex size-10 items-center justify-center rounded-2xl",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:129:21",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
											className: "size-5 text-primary-foreground",
											"data-tsd-source": "/src/routes/_authenticated/properties.tsx:130:23"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "truncate font-semibold",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:132:21",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:133:21",
										children: ["Code ", p.code]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "capitalize",
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:135:19",
								children: p.property_type
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 grid grid-cols-2 gap-3 text-sm",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:139:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:140:19",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:141:21",
									children: "Units"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-semibold",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:142:21",
									children: [
										occupied,
										"/",
										units.length || p.units_count
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:146:19",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:147:21",
									children: "Rent potential"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:148:21",
									children: money(potential)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:151:17",
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
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:152:19",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
									className: "size-3.5",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:171:21"
								}), " Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "rounded-full text-destructive",
								onClick: () => {
									if (confirm(`Delete ${p.name}? This removes its units and tenants.`)) deleteMutation.mutate(p.id);
								},
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:173:19",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-3.5",
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:183:21"
								})
							})]
						})
					]
				}, p.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			"data-tsd-source": "/src/routes/_authenticated/properties.tsx:192:7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
				"data-tsd-source": "/src/routes/_authenticated/properties.tsx:193:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					"data-tsd-source": "/src/routes/_authenticated/properties.tsx:194:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						"data-tsd-source": "/src/routes/_authenticated/properties.tsx:195:13",
						children: draft.id ? "Edit property" : "New property"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4 sm:grid-cols-2",
					onSubmit: (e) => {
						e.preventDefault();
						saveMutation.mutate(draft);
					},
					"data-tsd-source": "/src/routes/_authenticated/properties.tsx:197:11",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property name",
							htmlFor: "name",
							className: "sm:col-span-2",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:204:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								required: true,
								maxLength: 120,
								value: draft.name,
								onChange: (e) => setDraft({
									...draft,
									name: e.target.value
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:205:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property code (tenants use this)",
							htmlFor: "code",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:213:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "code",
								required: true,
								maxLength: 24,
								placeholder: "CB-001",
								value: draft.code,
								onChange: (e) => setDraft({
									...draft,
									code: e.target.value.toUpperCase()
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:214:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Type",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:223:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.property_type,
								onValueChange: (v) => setDraft({
									...draft,
									property_type: v
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:224:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:228:17",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { "data-tsd-source": "/src/routes/_authenticated/properties.tsx:229:19" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:231:17",
									children: PROPERTY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										className: "capitalize",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:233:21",
										children: t
									}, t))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							htmlFor: "address",
							className: "sm:col-span-2",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:240:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "address",
								maxLength: 200,
								value: draft.address,
								onChange: (e) => setDraft({
									...draft,
									address: e.target.value
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:241:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Total units",
							htmlFor: "units",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:248:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "units",
								type: "number",
								min: 0,
								value: draft.units_count,
								onChange: (e) => setDraft({
									...draft,
									units_count: Number(e.target.value)
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:249:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:257:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.status,
								onValueChange: (v) => setDraft({
									...draft,
									status: v
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:258:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:259:17",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { "data-tsd-source": "/src/routes/_authenticated/properties.tsx:260:19" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									"data-tsd-source": "/src/routes/_authenticated/properties.tsx:262:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:263:19",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "inactive",
										"data-tsd-source": "/src/routes/_authenticated/properties.tsx:264:19",
										children: "Inactive"
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							className: "sm:col-span-2",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:268:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								maxLength: 2e3,
								value: draft.description,
								onChange: (e) => setDraft({
									...draft,
									description: e.target.value
								}),
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:269:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "sm:col-span-2",
							"data-tsd-source": "/src/routes/_authenticated/properties.tsx:275:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: saveMutation.isPending,
								"data-tsd-source": "/src/routes/_authenticated/properties.tsx:276:15",
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
