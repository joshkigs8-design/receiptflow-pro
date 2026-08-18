import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Download, T as LoaderCircle, V as Building2, n as Wrench } from "../_libs/lucide-react.mjs";
import { r as ThemeToggle } from "./router-Dv0RVfoo.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, i as REQUEST_CATEGORIES, n as PRIORITIES, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as Field } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { r as receiptUrl } from "./receipt-pdf-BOomGyU_.mjs";
import { n as submitTenantRequest, r as verifyTenant } from "./portal.functions-BWJ2r8Mg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenant-DPi1e1_D.js
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
		"data-tsd-source": "/src/routes/tenant.tsx:79:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 py-4",
			"data-tsd-source": "/src/routes/tenant.tsx:80:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5",
				"data-tsd-source": "/src/routes/tenant.tsx:81:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					"data-tsd-source": "/src/routes/tenant.tsx:82:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
						className: "size-5 text-primary-foreground",
						"data-tsd-source": "/src/routes/tenant.tsx:83:13"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display font-bold",
					"data-tsd-source": "/src/routes/tenant.tsx:85:11",
					children: "Tenant Portal"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { "data-tsd-source": "/src/routes/tenant.tsx:87:9" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-5xl px-4 py-10",
			"data-tsd-source": "/src/routes/tenant.tsx:90:7",
			children: !portal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mx-auto max-w-md p-8",
				"data-tsd-source": "/src/routes/tenant.tsx:92:11",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold",
						"data-tsd-source": "/src/routes/tenant.tsx:93:13",
						children: "Verify your tenancy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/tenant.tsx:94:13",
						children: "Enter the property code from your landlord, your room number and your phone number."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit: (e) => {
							e.preventDefault();
							login.mutate();
						},
						"data-tsd-source": "/src/routes/tenant.tsx:97:13",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Property code",
								htmlFor: "code",
								"data-tsd-source": "/src/routes/tenant.tsx:104:15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "code",
									required: true,
									maxLength: 24,
									placeholder: "CB-001",
									value: creds.code,
									onChange: (e) => setCreds({
										...creds,
										code: e.target.value.toUpperCase()
									}),
									"data-tsd-source": "/src/routes/tenant.tsx:105:17"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Room / unit number",
								htmlFor: "room",
								"data-tsd-source": "/src/routes/tenant.tsx:114:15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "room",
									required: true,
									maxLength: 40,
									value: creds.room,
									onChange: (e) => setCreds({
										...creds,
										room: e.target.value
									}),
									"data-tsd-source": "/src/routes/tenant.tsx:115:17"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone number",
								htmlFor: "phone",
								"data-tsd-source": "/src/routes/tenant.tsx:123:15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									required: true,
									maxLength: 24,
									placeholder: "0712345678",
									value: creds.phone,
									onChange: (e) => setCreds({
										...creds,
										phone: e.target.value
									}),
									"data-tsd-source": "/src/routes/tenant.tsx:124:17"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full shadow-glow",
								disabled: login.isPending,
								"data-tsd-source": "/src/routes/tenant.tsx:133:15",
								children: login.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "size-4 animate-spin",
									"data-tsd-source": "/src/routes/tenant.tsx:138:36"
								}) : "View my account"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				"data-tsd-source": "/src/routes/tenant.tsx:143:11",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card flex flex-wrap items-center justify-between gap-4 p-6",
						"data-tsd-source": "/src/routes/tenant.tsx:144:13",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-tsd-source": "/src/routes/tenant.tsx:145:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold",
								"data-tsd-source": "/src/routes/tenant.tsx:146:17",
								children: portal.tenant.full_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								"data-tsd-source": "/src/routes/tenant.tsx:147:17",
								children: [
									portal.property.name,
									" · Unit ",
									portal.tenant.unit ?? "—",
									portal.tenant.room ? ` · Room ${portal.tenant.room}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-full",
							onClick: () => setPortal(null),
							"data-tsd-source": "/src/routes/tenant.tsx:152:15",
							children: "Sign out"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						"data-tsd-source": "/src/routes/tenant.tsx:157:13",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								"data-tsd-source": "/src/routes/tenant.tsx:158:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									"data-tsd-source": "/src/routes/tenant.tsx:159:17",
									children: "Monthly rent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold",
									"data-tsd-source": "/src/routes/tenant.tsx:160:17",
									children: money(portal.tenant.rent_amount)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								"data-tsd-source": "/src/routes/tenant.tsx:164:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									"data-tsd-source": "/src/routes/tenant.tsx:165:17",
									children: "Total paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold text-primary",
									"data-tsd-source": "/src/routes/tenant.tsx:166:17",
									children: money(portal.totals.paid)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-5",
								"data-tsd-source": "/src/routes/tenant.tsx:170:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									"data-tsd-source": "/src/routes/tenant.tsx:171:17",
									children: "Outstanding"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl font-bold",
									"data-tsd-source": "/src/routes/tenant.tsx:172:17",
									children: money(portal.totals.outstanding)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						"data-tsd-source": "/src/routes/tenant.tsx:178:13",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							"data-tsd-source": "/src/routes/tenant.tsx:179:15",
							children: "My receipts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3",
							"data-tsd-source": "/src/routes/tenant.tsx:180:15",
							children: [portal.receipts.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-sm last:border-0",
								"data-tsd-source": "/src/routes/tenant.tsx:182:19",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										"data-tsd-source": "/src/routes/tenant.tsx:186:21",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-medium",
											"data-tsd-source": "/src/routes/tenant.tsx:187:23",
											children: r.receipt_number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											"data-tsd-source": "/src/routes/tenant.tsx:188:23",
											children: shortDate(r.issued_at)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-primary",
										"data-tsd-source": "/src/routes/tenant.tsx:192:21",
										children: money(r.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: receiptUrl(r.public_id),
										target: "_blank",
										rel: "noreferrer",
										"data-tsd-source": "/src/routes/tenant.tsx:193:21",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "rounded-full",
											"data-tsd-source": "/src/routes/tenant.tsx:194:23",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												className: "size-3.5",
												"data-tsd-source": "/src/routes/tenant.tsx:195:25"
											}), " View"]
										})
									})
								]
							}, r.id)), portal.receipts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								"data-tsd-source": "/src/routes/tenant.tsx:201:19",
								children: "No receipts yet."
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						"data-tsd-source": "/src/routes/tenant.tsx:206:13",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							"data-tsd-source": "/src/routes/tenant.tsx:207:15",
							children: "Payment history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-x-auto",
							"data-tsd-source": "/src/routes/tenant.tsx:208:15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								"data-tsd-source": "/src/routes/tenant.tsx:209:17",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left text-xs text-muted-foreground uppercase",
									"data-tsd-source": "/src/routes/tenant.tsx:210:19",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										"data-tsd-source": "/src/routes/tenant.tsx:211:21",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2",
												"data-tsd-source": "/src/routes/tenant.tsx:212:23",
												children: "Date"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2",
												"data-tsd-source": "/src/routes/tenant.tsx:213:23",
												children: "Period"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2",
												"data-tsd-source": "/src/routes/tenant.tsx:214:23",
												children: "Method"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2 text-right",
												"data-tsd-source": "/src/routes/tenant.tsx:215:23",
												children: "Amount"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									"data-tsd-source": "/src/routes/tenant.tsx:218:19",
									children: portal.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										"data-tsd-source": "/src/routes/tenant.tsx:220:23",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3",
												"data-tsd-source": "/src/routes/tenant.tsx:221:25",
												children: shortDate(p.paid_at)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3",
												"data-tsd-source": "/src/routes/tenant.tsx:222:25",
												children: p.period_label ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 capitalize",
												"data-tsd-source": "/src/routes/tenant.tsx:223:25",
												children: p.method
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 text-right font-semibold",
												"data-tsd-source": "/src/routes/tenant.tsx:224:25",
												children: money(p.amount)
											})
										]
									}, p.id))
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						"data-tsd-source": "/src/routes/tenant.tsx:232:13",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								"data-tsd-source": "/src/routes/tenant.tsx:233:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, {
									className: "size-4 text-primary",
									"data-tsd-source": "/src/routes/tenant.tsx:234:17"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									"data-tsd-source": "/src/routes/tenant.tsx:235:17",
									children: "Report a maintenance issue"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-4 sm:grid-cols-2",
								onSubmit: (e) => {
									e.preventDefault();
									raise.mutate();
								},
								"data-tsd-source": "/src/routes/tenant.tsx:237:15",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Category",
										"data-tsd-source": "/src/routes/tenant.tsx:244:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: request.category,
											onValueChange: (v) => setRequest({
												...request,
												category: v
											}),
											"data-tsd-source": "/src/routes/tenant.tsx:245:19",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"data-tsd-source": "/src/routes/tenant.tsx:249:21",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { "data-tsd-source": "/src/routes/tenant.tsx:250:23" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												"data-tsd-source": "/src/routes/tenant.tsx:252:21",
												children: REQUEST_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: c,
													className: "capitalize",
													"data-tsd-source": "/src/routes/tenant.tsx:254:25",
													children: c
												}, c))
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Priority",
										"data-tsd-source": "/src/routes/tenant.tsx:261:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: request.priority,
											onValueChange: (v) => setRequest({
												...request,
												priority: v
											}),
											"data-tsd-source": "/src/routes/tenant.tsx:262:19",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"data-tsd-source": "/src/routes/tenant.tsx:266:21",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { "data-tsd-source": "/src/routes/tenant.tsx:267:23" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												"data-tsd-source": "/src/routes/tenant.tsx:269:21",
												children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: p,
													className: "capitalize",
													"data-tsd-source": "/src/routes/tenant.tsx:271:25",
													children: p
												}, p))
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Describe the issue",
										className: "sm:col-span-2",
										"data-tsd-source": "/src/routes/tenant.tsx:278:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											required: true,
											minLength: 4,
											maxLength: 2e3,
											rows: 4,
											value: request.description,
											onChange: (e) => setRequest({
												...request,
												description: e.target.value
											}),
											"data-tsd-source": "/src/routes/tenant.tsx:279:19"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										"data-tsd-source": "/src/routes/tenant.tsx:288:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "rounded-full shadow-glow",
											disabled: raise.isPending,
											"data-tsd-source": "/src/routes/tenant.tsx:289:19",
											children: "Send request"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-8 font-semibold",
								"data-tsd-source": "/src/routes/tenant.tsx:299:15",
								children: "My requests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								"data-tsd-source": "/src/routes/tenant.tsx:300:15",
								children: [portal.requests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3",
									"data-tsd-source": "/src/routes/tenant.tsx:302:19",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										"data-tsd-source": "/src/routes/tenant.tsx:303:21",
										children: r.description
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "capitalize",
										"data-tsd-source": "/src/routes/tenant.tsx:304:21",
										children: r.status
									})]
								}, r.id)), portal.requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-muted-foreground",
									"data-tsd-source": "/src/routes/tenant.tsx:310:19",
									children: "No requests raised."
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface-card p-6",
						"data-tsd-source": "/src/routes/tenant.tsx:315:13",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							"data-tsd-source": "/src/routes/tenant.tsx:316:15",
							children: "Announcements"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-4",
							"data-tsd-source": "/src/routes/tenant.tsx:317:15",
							children: [portal.announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								"data-tsd-source": "/src/routes/tenant.tsx:319:19",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									"data-tsd-source": "/src/routes/tenant.tsx:320:21",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									"data-tsd-source": "/src/routes/tenant.tsx:321:21",
									children: a.body
								})]
							}, a.id)), portal.announcements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								"data-tsd-source": "/src/routes/tenant.tsx:325:19",
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
