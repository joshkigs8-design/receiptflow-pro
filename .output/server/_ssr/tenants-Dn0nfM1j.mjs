import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as Search, o as Trash2, v as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as Field, t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { a as deleteTenant, f as listProperties, g as listUnits, h as listTenants, t as AppShell, x as saveTenant } from "./AppShell-BWAvuJ1R.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-Dn0nfM1j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = {
	property_id: "",
	unit_id: "",
	full_name: "",
	phone: "",
	email: "",
	national_id: "",
	occupation: "",
	emergency_contact: "",
	lease_start: "",
	lease_end: "",
	rent_amount: 0,
	deposit_paid: 0,
	status: "active"
};
function TenantsPage() {
	const qc = useQueryClient();
	const fetchTenants = useServerFn(listTenants);
	const fetchProperties = useServerFn(listProperties);
	const fetchUnits = useServerFn(listUnits);
	const save = useServerFn(saveTenant);
	const remove = useServerFn(deleteTenant);
	const [term, setTerm] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(blank);
	const tenants = useQuery({
		queryKey: ["tenants"],
		queryFn: () => fetchTenants()
	});
	const properties = useQuery({
		queryKey: ["properties"],
		queryFn: () => fetchProperties()
	});
	const units = useQuery({
		queryKey: ["units", draft.property_id],
		queryFn: () => fetchUnits({ data: { propertyId: draft.property_id } }),
		enabled: Boolean(draft.property_id)
	});
	const filtered = (0, import_react.useMemo)(() => {
		const rows = tenants.data ?? [];
		if (!term.trim()) return rows;
		const q = term.toLowerCase();
		return rows.filter((t) => t.full_name.toLowerCase().includes(q) || t.phone.includes(q) || (t.properties?.name ?? "").toLowerCase().includes(q));
	}, [tenants.data, term]);
	const saveMutation = useMutation({
		mutationFn: (d) => save({ data: {
			...d,
			property_id: d.property_id || null,
			unit_id: d.unit_id || null,
			email: d.email || null
		} }),
		onSuccess: () => {
			toast.success("Tenant saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["tenants"] });
			qc.invalidateQueries({ queryKey: ["units"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message || "Could not save tenant")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Tenant removed");
			qc.invalidateQueries({ queryKey: ["tenants"] });
		},
		onError: () => toast.error("Could not remove tenant")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Tenants",
		description: "Profiles, leases and rent per tenant",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			className: "rounded-full shadow-glow",
			onClick: () => {
				setDraft(blank);
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add tenant"]
		}),
		"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:144:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6 max-w-sm",
				"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:160:7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
					"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:161:9"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Search name, phone or property",
					value: term,
					onChange: (e) => setTerm(e.target.value),
					maxLength: 80,
					"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:162:9"
				})]
			}),
			tenants.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:172:9",
				children: "Loading tenants…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No tenants found",
				hint: "Add a tenant and assign them to a unit.",
				"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:174:9"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:176:9",
				children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card p-5",
					"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:178:13",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:179:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:180:17",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate font-semibold",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:181:19",
									children: t.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:182:19",
									children: t.phone
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: t.status === "active" ? "default" : "secondary",
								className: "capitalize",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:184:17",
								children: t.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-1.5 text-sm",
							"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:191:15",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:192:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:193:19",
										children: "Property"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "truncate",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:194:19",
										children: t.properties?.name ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:196:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:197:19",
										children: "Unit / room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:198:19",
										children: [t.units?.unit_number ?? "—", t.units?.room_number ? ` · ${t.units.room_number}` : ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:203:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:204:19",
										children: "Rent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:205:19",
										children: money(t.rent_amount)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:207:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:208:19",
										children: "Lease ends"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:209:19",
										children: shortDate(t.lease_end)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:212:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "rounded-full",
								onClick: () => {
									setDraft({
										id: t.id,
										property_id: t.property_id ?? "",
										unit_id: t.unit_id ?? "",
										full_name: t.full_name,
										phone: t.phone,
										email: t.email ?? "",
										national_id: t.national_id ?? "",
										occupation: t.occupation ?? "",
										emergency_contact: t.emergency_contact ?? "",
										lease_start: t.lease_start ?? "",
										lease_end: t.lease_end ?? "",
										rent_amount: Number(t.rent_amount ?? 0),
										deposit_paid: Number(t.deposit_paid ?? 0),
										status: t.status ?? "active"
									});
									setOpen(true);
								},
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:213:17",
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "rounded-full text-destructive",
								onClick: () => {
									if (confirm(`Remove ${t.full_name}?`)) deleteMutation.mutate(t.id);
								},
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:239:17",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-3.5",
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:247:19"
								})
							})]
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:255:7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
					"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:256:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
						"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:257:11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:258:13",
							children: draft.id ? "Edit tenant" : "New tenant"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							saveMutation.mutate(draft);
						},
						"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:260:11",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								htmlFor: "fullname",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:267:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullname",
									required: true,
									maxLength: 120,
									value: draft.full_name,
									onChange: (e) => setDraft({
										...draft,
										full_name: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:268:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								htmlFor: "phone",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:276:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									required: true,
									maxLength: 24,
									placeholder: "0712345678",
									value: draft.phone,
									onChange: (e) => setDraft({
										...draft,
										phone: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:277:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								htmlFor: "email",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:286:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									maxLength: 200,
									value: draft.email,
									onChange: (e) => setDraft({
										...draft,
										email: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:287:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "National ID",
								htmlFor: "nid",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:295:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nid",
									maxLength: 40,
									value: draft.national_id,
									onChange: (e) => setDraft({
										...draft,
										national_id: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:296:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Property",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:303:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.property_id,
									onValueChange: (v) => setDraft({
										...draft,
										property_id: v,
										unit_id: ""
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:304:15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:308:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {
											placeholder: "Choose property",
											"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:309:19"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:311:17",
										children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p.id,
											"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:313:21",
											children: p.name
										}, p.id))
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Unit",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:320:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.unit_id,
									onValueChange: (v) => {
										const unit = (units.data ?? []).find((u) => u.id === v);
										setDraft({
											...draft,
											unit_id: v,
											rent_amount: unit ? Number(unit.rent ?? 0) : draft.rent_amount
										});
									},
									disabled: !draft.property_id,
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:321:15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:333:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {
											placeholder: "Choose unit",
											"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:334:19"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
										"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:336:17",
										children: (units.data ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: u.id,
											"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:338:21",
											children: [u.unit_number, u.room_number ? ` · ${u.room_number}` : ""]
										}, u.id))
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Monthly rent",
								htmlFor: "rentamt",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:346:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rentamt",
									type: "number",
									min: 0,
									value: draft.rent_amount,
									onChange: (e) => setDraft({
										...draft,
										rent_amount: Number(e.target.value)
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:347:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Deposit paid",
								htmlFor: "dep",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:355:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "dep",
									type: "number",
									min: 0,
									value: draft.deposit_paid,
									onChange: (e) => setDraft({
										...draft,
										deposit_paid: Number(e.target.value)
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:356:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Lease start",
								htmlFor: "ls",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:364:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ls",
									type: "date",
									value: draft.lease_start,
									onChange: (e) => setDraft({
										...draft,
										lease_start: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:365:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Lease end",
								htmlFor: "le",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:372:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "le",
									type: "date",
									value: draft.lease_end,
									onChange: (e) => setDraft({
										...draft,
										lease_end: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:373:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Occupation",
								htmlFor: "occ",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:380:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "occ",
									maxLength: 120,
									value: draft.occupation,
									onChange: (e) => setDraft({
										...draft,
										occupation: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:381:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Emergency contact",
								htmlFor: "ec",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:388:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ec",
									maxLength: 120,
									value: draft.emergency_contact,
									onChange: (e) => setDraft({
										...draft,
										emergency_contact: e.target.value
									}),
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:389:15"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "sm:col-span-2",
								"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:396:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: saveMutation.isPending,
									"data-tsd-source": "/src/routes/_authenticated/tenants.tsx:397:15",
									children: "Save tenant"
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
export { TenantsPage as component };
