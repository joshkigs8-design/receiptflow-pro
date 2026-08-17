import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-DQEmNje3.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Trash2, v as Plus, y as Pencil } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate, t as PAYMENT_METHODS } from "./format-DGi3p9Yo.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { S as updatePayment, f as listReceipts, g as recordPayment, m as listTenants, n as deletePayment, u as listPayments } from "./app.functions-BaWVuJXn.mjs";
import { t as AppShell } from "./AppShell-BT3Pd2oE.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as downloadReceiptPdf } from "./receipt-pdf-BOomGyU_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-CfVXg2Uk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function PaymentsPage() {
	const qc = useQueryClient();
	const fetchPayments = useServerFn(listPayments);
	const fetchTenants = useServerFn(listTenants);
	const fetchReceipts = useServerFn(listReceipts);
	const record = useServerFn(recordPayment);
	const update = useServerFn(updatePayment);
	const remove = useServerFn(deletePayment);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editDraft, setEditDraft] = (0, import_react.useState)({
		amount: 0,
		method: "mpesa",
		reference: "",
		paid_at: today(),
		period_label: "",
		notes: ""
	});
	const [draft, setDraft] = (0, import_react.useState)({
		tenant_id: "",
		amount: 0,
		method: "mpesa",
		reference: "",
		paid_at: today(),
		period_label: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7),
		notes: ""
	});
	const payments = useQuery({
		queryKey: ["payments"],
		queryFn: () => fetchPayments()
	});
	const tenants = useQuery({
		queryKey: ["tenants"],
		queryFn: () => fetchTenants()
	});
	const mutation = useMutation({
		mutationFn: () => record({ data: draft }),
		onSuccess: async (res) => {
			toast.success(`Receipt ${res.receiptNumber} generated`);
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["receipts"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
			try {
				const fresh = (await fetchReceipts()).find((r) => r.public_id === res.publicId);
				if (fresh) await downloadReceiptPdf(fresh);
			} catch {
				toast.info("Receipt saved — download it from the Receipts page.");
			}
		},
		onError: (e) => toast.error(e.message || "Could not record payment")
	});
	const editMutation = useMutation({
		mutationFn: () => update({ data: {
			id: editing.id,
			...editDraft
		} }),
		onSuccess: () => {
			toast.success("Payment updated");
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["receipts"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message || "Could not update payment")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Payment deleted");
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["receipts"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message || "Could not delete payment")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Payments",
		description: "Every shilling collected, with instant receipts",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			className: "rounded-full shadow-glow",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Record payment"]
		}),
		children: [
			payments.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading payments…"
			}) : (payments.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No payments yet",
				hint: "Record a payment to generate the first receipt."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-x-auto p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Tenant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Unit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Period"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Receipt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (payments.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: shortDate(p.paid_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium",
								children: p.tenants?.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: p.units?.unit_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: p.period_label ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 capitalize",
								children: p.method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: p.receipts?.[0]?.receipt_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: p.status === "paid" ? "default" : "secondary",
									className: "capitalize",
									children: p.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right font-semibold",
								children: money(p.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "size-8 rounded-full",
										"aria-label": "Edit payment",
										onClick: () => {
											setEditing({ id: p.id });
											setEditDraft({
												amount: Number(p.amount),
												method: p.method,
												reference: p.reference ?? "",
												paid_at: String(p.paid_at).slice(0, 10),
												period_label: p.period_label ?? "",
												notes: p.notes ?? ""
											});
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "size-8 rounded-full text-destructive",
										"aria-label": "Delete payment",
										onClick: () => {
											if (confirm("Delete this payment and its receipt? This cannot be undone.")) deleteMutation.mutate(p.id);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								})
							})
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record payment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (!draft.tenant_id) {
								toast.error("Select a tenant");
								return;
							}
							mutation.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tenant",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.tenant_id,
									onValueChange: (v) => {
										const t = (tenants.data ?? []).find((x) => x.id === v);
										setDraft({
											...draft,
											tenant_id: v,
											amount: Number(t?.rent_amount ?? 0)
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose tenant" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (tenants.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: t.id,
										children: [
											t.full_name,
											" · ",
											t.units?.unit_number ?? "no unit"
										]
									}, t.id)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Amount",
								htmlFor: "amt",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "amt",
									type: "number",
									min: 1,
									required: true,
									value: draft.amount,
									onChange: (e) => setDraft({
										...draft,
										amount: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Method",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.method,
									onValueChange: (v) => setDraft({
										...draft,
										method: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m,
										className: "capitalize",
										children: m
									}, m)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Payment date",
								htmlFor: "pd",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pd",
									type: "date",
									required: true,
									value: draft.paid_at,
									onChange: (e) => setDraft({
										...draft,
										paid_at: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Period (YYYY-MM)",
								htmlFor: "per",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "per",
									maxLength: 40,
									value: draft.period_label,
									onChange: (e) => setDraft({
										...draft,
										period_label: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reference (M-Pesa code)",
								htmlFor: "ref",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ref",
									maxLength: 80,
									value: draft.reference,
									onChange: (e) => setDraft({
										...draft,
										reference: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notes",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									maxLength: 1e3,
									value: draft.notes,
									onChange: (e) => setDraft({
										...draft,
										notes: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: mutation.isPending,
									children: "Save & generate receipt"
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (v) => !v && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit payment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							editMutation.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Amount",
								htmlFor: "eamt",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "eamt",
									type: "number",
									min: 1,
									required: true,
									value: editDraft.amount,
									onChange: (e) => setEditDraft({
										...editDraft,
										amount: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Method",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editDraft.method,
									onValueChange: (v) => setEditDraft({
										...editDraft,
										method: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m,
										className: "capitalize",
										children: m
									}, m)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Payment date",
								htmlFor: "epd",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "epd",
									type: "date",
									required: true,
									value: editDraft.paid_at,
									onChange: (e) => setEditDraft({
										...editDraft,
										paid_at: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Period (YYYY-MM)",
								htmlFor: "eper",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "eper",
									maxLength: 40,
									value: editDraft.period_label,
									onChange: (e) => setEditDraft({
										...editDraft,
										period_label: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reference (M-Pesa code)",
								htmlFor: "eref",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "eref",
									maxLength: 80,
									value: editDraft.reference,
									onChange: (e) => setEditDraft({
										...editDraft,
										reference: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notes",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									maxLength: 1e3,
									value: editDraft.notes,
									onChange: (e) => setEditDraft({
										...editDraft,
										notes: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: editMutation.isPending,
									children: "Save changes"
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
export { PaymentsPage as component };
