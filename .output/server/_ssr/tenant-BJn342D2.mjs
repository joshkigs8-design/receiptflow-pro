import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as LoaderCircle, J as Building2, M as Download, n as Wrench } from "../_libs/lucide-react.mjs";
import { a as ThemeToggle } from "./router-8Z92OHgn.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, i as REQUEST_CATEGORIES, n as PRIORITIES, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as Field } from "./Field-Cw-xjAVe.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { r as receiptUrl } from "./receipt-pdf-BOomGyU_.mjs";
import { n as submitTenantRequest, r as verifyTenant } from "./portal.functions-C61uNPou.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenant-BJn342D2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TenantPortal() {
	const verify = useServerFn(verifyTenant);
	const submit = useServerFn(submitTenantRequest);
	const [creds, setCreds] = (0, import_react.useState)({
		code: "",
		room: "",
		phone: ""
	});
	const [portal, setPortal] = (0, import_react.useState)(null);
	const [request, setRequest] = (0, import_react.useState)({
		category: "plumbing",
		priority: "normal",
		description: ""
	});
	const login = useMutation({
		mutationFn: () => verify({ data: creds }),
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setPortal(res);
		},
		onError: () => toast.error("Verification failed. Check your details.")
	});
	const raise = useMutation({
		mutationFn: () => submit({ data: {
			...creds,
			...request
		} }),
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			toast.success("Request sent to your landlord");
			setRequest({
				category: "plumbing",
				priority: "normal",
				description: ""
			});
		},
		onError: () => toast.error("Could not send the request")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display font-bold",
					children: "Tenant Portal"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-5xl px-4 py-10",
			children: !portal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mx-auto max-w-md p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold",
						children: "Verify your tenancy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Enter the property code from your landlord, your room number and your phone number."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit: (e) => {
							e.preventDefault();
							login.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Property code",
								htmlFor: "code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "code",
									required: true,
									maxLength: 24,
									placeholder: "CB-001",
									value: creds.code,
									onChange: (e) => setCreds({
										...creds,
										code: e.target.value.toUpperCase()
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Room / unit number",
								htmlFor: "room",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "room",
									required: true,
									maxLength: 40,
									value: creds.room,
									onChange: (e) => setCreds({
										...creds,
										room: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone number",
								htmlFor: "phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									required: true,
									maxLength: 24,
									placeholder: "0712345678",
									value: creds.phone,
									onChange: (e) => setCreds({
										...creds,
										phone: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full shadow-glow",
								disabled: login.isPending,
								children: login.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "View my account"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card flex flex-wrap items-center justify-between gap-4 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold",
							children: portal.tenant.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								portal.property.name,
								" · Unit ",
								portal.tenant.unit ?? "—",
								portal.tenant.room ? ` · Room ${portal.tenant.room}` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-full",
							onClick: () => setPortal(null),
							children: "Sign out"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									children: "Monthly rent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold",
									children: money(portal.tenant.rent_amount)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									children: "Total paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold text-primary",
									children: money(portal.totals.paid)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									children: "Outstanding"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold",
									children: money(portal.totals.outstanding)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "My receipts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							children: [portal.receipts.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-sm last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-medium",
										children: r.receipt_number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: shortDate(r.issued_at)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-primary",
										children: money(r.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: receiptUrl(r.public_id),
										target: "_blank",
										rel: "noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "rounded-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " View"]
										})
									})
								]
							}, r.id)), portal.receipts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "No receipts yet."
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Payment history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left text-xs text-muted-foreground uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2",
											children: "Period"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2",
											children: "Method"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 text-right",
											children: "Amount"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: portal.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: shortDate(p.paid_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: p.period_label ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 capitalize",
											children: p.method
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 text-right font-semibold",
											children: money(p.amount)
										})
									]
								}, p.id)) })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: "Report a maintenance issue"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-4 sm:grid-cols-2",
								onSubmit: (e) => {
									e.preventDefault();
									raise.mutate();
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Category",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: request.category,
											onValueChange: (v) => setRequest({
												...request,
												category: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REQUEST_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c,
												className: "capitalize",
												children: c
											}, c)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Priority",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: request.priority,
											onValueChange: (v) => setRequest({
												...request,
												priority: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: p,
												className: "capitalize",
												children: p
											}, p)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Describe the issue",
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											required: true,
											minLength: 4,
											maxLength: 2e3,
											rows: 4,
											value: request.description,
											onChange: (e) => setRequest({
												...request,
												description: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "rounded-full shadow-glow",
											disabled: raise.isPending,
											children: "Send request"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-8 font-semibold",
								children: "My requests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [portal.requests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: r.description
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "capitalize",
										children: r.status
									})]
								}, r.id)), portal.requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-muted-foreground",
									children: "No requests raised."
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Announcements"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-4",
							children: [portal.announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: a.body
							})] }, a.id)), portal.announcements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "No notices right now."
							}) : null]
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { TenantPortal as component };
