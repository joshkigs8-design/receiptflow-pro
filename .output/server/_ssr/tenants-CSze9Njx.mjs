import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as Search, o as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as AppShell } from "./AppShell-DhE8hA2t.mjs";
import { b as saveTenant, d as listProperties, h as listUnits, i as deleteTenant, m as listTenants } from "./app.functions-CSaEaBHB.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-CSze9Njx.js
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
	const [rentalPeriod, setRentalPeriod] = (0, import_react.useState)(() => {
		return (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
	});
	const [periodLabel, setPeriodLabel] = (0, import_react.useState)("Current month");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const monthOptions = (0, import_react.useMemo)(() => {
		const options = [];
		options.push({
			value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7),
			label: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
				month: "long",
				year: "numeric"
			})
		});
		for (let i = 1; i <= 5; i++) {
			const d = /* @__PURE__ */ new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1e3);
			options.push({
				value: d.toISOString().slice(0, 7),
				label: d.toLocaleDateString("en-GB", { month: "long" }) + " " + d.getFullYear()
			});
		}
		return options;
	}, []);
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
	const payments = useQuery({
		queryKey: ["payments"],
		queryFn: () => fetchPayments()
	});
	const selectedPeriod = (0, import_react.useMemo)(() => rentalPeriod, [rentalPeriod]);
	const rentStatuses = (0, import_react.useMemo)(() => {
		const rows = tenants.data ?? [];
		const period = selectedPeriod;
		const statuses = {};
		const allPayments = payments.data ?? [];
		rows.forEach((t) => {
			const monthlyRent = Number(t.rent_amount ?? 0);
			let paidThisPeriod = 0;
			allPayments.forEach((p) => {
				const pPeriod = p.period_label ?? "";
				const pTenantId = p.tenant_id ?? "";
				const pAmount = Number(p.amount ?? 0);
				if (pTenantId === t.id && pPeriod === period && pAmount > 0) paidThisPeriod += pAmount;
			});
			const balance = Math.max(monthlyRent - paidThisPeriod, 0);
			let status;
			if (paidThisPeriod <= 0) status = "UNPAID";
			else if (paidThisPeriod < monthlyRent) status = "PARTIAL";
			else status = "PAID";
			statuses[t.id] = {
				paidThisPeriod,
				monthlyRent,
				balance,
				status
			};
		});
		return statuses;
	}, [
		tenants.data,
		rentalPeriod,
		payments.data
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const rows = tenants.data ?? [];
		if (!term.trim() && filter === "all") return rows;
		const q = term.toLowerCase();
		return rows.filter((t) => (filter === "all" || filter === "paid" ? true : filter === "partial" ? rentStatuses[t.id]?.status === "PARTIAL" : filter === "unpaid" ? rentStatuses[t.id]?.status === "UNPAID" : false) && (t.full_name.toLowerCase().includes(q) || t.phone.includes(q) || (t.properties?.name ?? "").toLowerCase().includes(q)));
	}, [
		tenants.data,
		term,
		filter
	]);
	const expectedTotal = (0, import_react.useMemo)(() => {
		return Object.values(rentStatuses).reduce((s, { monthlyRent }) => s + monthlyRent, 0);
	}, [rentStatuses]);
	const collectedTotal = (0, import_react.useMemo)(() => {
		return Object.values(rentStatuses).reduce((s, { paidThisPeriod }) => s + paidThisPeriod, 0);
	}, [rentStatuses]);
	const outstandingTotal = (0, import_react.useMemo)(() => {
		return Math.max(expectedTotal - collectedTotal, 0);
	}, [expectedTotal, collectedTotal]);
	const paidCount = (0, import_react.useMemo)(() => {
		return Object.values(rentStatuses).filter((s) => s.status === "PAID").length;
	}, [rentStatuses]);
	const partialCount = (0, import_react.useMemo)(() => {
		return Object.values(rentStatuses).filter((s) => s.status === "PARTIAL").length;
	}, [rentStatuses]);
	const unpaidCount = (0, import_react.useMemo)(() => {
		return Object.values(rentStatuses).filter((s) => s.status === "UNPAID").length;
	}, [rentStatuses]);
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
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mb-6 max-w-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: rentalPeriod,
					onValueChange: (v) => {
						setRentalPeriod(v);
						setPeriodLabel(v ? `${v.replace("-", " ")}` : "Current month");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Current month" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: opt.value,
						children: opt.label
					}, opt.value)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase",
						children: "Expected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-bold",
						children: money(expectedTotal, "KSh")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase",
						children: "Collected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-bold",
						children: money(collectedTotal, "KSh")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase",
						children: "Outstanding"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-bold",
						children: money(outstandingTotal, "KSh")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase",
						children: "Tenants"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-bold",
						children: filtered.length
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: paidCount > 0 ? "default" : "outline",
						className: "rounded-full text-xs",
						onClick: () => setFilter("paid"),
						children: ["Paid ", paidCount]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: partialCount > 0 ? "default" : "outline",
						className: "rounded-full text-xs",
						onClick: () => setFilter("partial"),
						children: ["Partial ", partialCount]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: unpaidCount > 0 ? "default" : "outline",
						className: "rounded-full text-xs text-destructive",
						onClick: () => setFilter("unpaid"),
						children: ["Unpaid ", unpaidCount]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "rounded-full text-xs",
						onClick: () => setFilter("all"),
						children: "All"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6 max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Search name, phone or property",
					value: term,
					onChange: (e) => setTerm(e.target.value),
					maxLength: 80
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No tenants found",
				hint: "Add a tenant and assign them to a unit."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate font-semibold",
									children: t.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: t.phone
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: t.status === "active" ? "default" : "secondary",
								className: "capitalize",
								children: t.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-1.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Property"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "truncate",
										children: t.properties?.name ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Unit / room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [t.units?.unit_number ?? "—", t.units?.room_number ? ` · ${t.units.room_number}` : ""] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Rent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: money(t.rent_amount)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Lease ends"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: shortDate(t.lease_end) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Paid this period"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(rentStatuses[t.id]?.paidThisPeriod ?? 0, "KSh") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Balance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: money(rentStatuses[t.id]?.balance ?? 0, "KSh") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Rent status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: rentStatuses[t.id]?.status === "PAID" ? "default" : rentStatuses[t.id]?.status === "PARTIAL" ? "secondary" : "destructive",
										className: "capitalize",
										children: rentStatuses[t.id]?.status
									}) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
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
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "rounded-full text-destructive",
								onClick: () => {
									if (confirm(`Remove ${t.full_name}?`)) deleteMutation.mutate(t.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: draft.id ? "Edit tenant" : "New tenant" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							saveMutation.mutate(draft);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								htmlFor: "fullname",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullname",
									required: true,
									maxLength: 120,
									value: draft.full_name,
									onChange: (e) => setDraft({
										...draft,
										full_name: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								htmlFor: "phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									required: true,
									maxLength: 24,
									placeholder: "0712345678",
									value: draft.phone,
									onChange: (e) => setDraft({
										...draft,
										phone: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								htmlFor: "email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									maxLength: 200,
									value: draft.email,
									onChange: (e) => setDraft({
										...draft,
										email: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "National ID",
								htmlFor: "nid",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nid",
									maxLength: 40,
									value: draft.national_id,
									onChange: (e) => setDraft({
										...draft,
										national_id: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Property",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.property_id,
									onValueChange: (v) => setDraft({
										...draft,
										property_id: v,
										unit_id: ""
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose property" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Unit",
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose unit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (units.data ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: u.id,
										children: [u.unit_number, u.room_number ? ` · ${u.room_number}` : ""]
									}, u.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Monthly rent",
								htmlFor: "rentamt",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rentamt",
									type: "number",
									min: 0,
									value: draft.rent_amount,
									onChange: (e) => setDraft({
										...draft,
										rent_amount: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Deposit paid",
								htmlFor: "dep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "dep",
									type: "number",
									min: 0,
									value: draft.deposit_paid,
									onChange: (e) => setDraft({
										...draft,
										deposit_paid: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Lease start",
								htmlFor: "ls",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ls",
									type: "date",
									value: draft.lease_start,
									onChange: (e) => setDraft({
										...draft,
										lease_start: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Lease end",
								htmlFor: "le",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "le",
									type: "date",
									value: draft.lease_end,
									onChange: (e) => setDraft({
										...draft,
										lease_end: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Occupation",
								htmlFor: "occ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "occ",
									maxLength: 120,
									value: draft.occupation,
									onChange: (e) => setDraft({
										...draft,
										occupation: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Emergency contact",
								htmlFor: "ec",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ec",
									maxLength: 120,
									value: draft.emergency_contact,
									onChange: (e) => setDraft({
										...draft,
										emergency_contact: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: saveMutation.isPending,
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
