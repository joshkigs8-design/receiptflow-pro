import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-DQEmNje3.mjs";
import { t as PLANS } from "./billing.server-D8lRBSqW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as Check, M as CreditCard, T as LoaderCircle, U as BadgeCheck, l as Sparkles, s as Ticket } from "../_libs/lucide-react.mjs";
import { n as Route$11 } from "./router-49H3NiY0.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { s as redeemVoucher } from "./admin.functions-DqMJe8Kr.mjs";
import { i as verifyCheckout, n as getSubscription, r as startCheckout, t as AppShell } from "./AppShell-BT3Pd2oE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-kUk6mbKr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var perks = [
	"Unlimited properties, units and tenants",
	"Instant QR-verified PDF receipts",
	"Tenant portal & maintenance requests",
	"Income reports and analytics",
	"Custom receipt branding"
];
function BillingPage() {
	const { reference } = Route$11.useSearch();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fetchSubscription = useServerFn(getSubscription);
	const checkout = useServerFn(startCheckout);
	const verify = useServerFn(verifyCheckout);
	const redeem = useServerFn(redeemVoucher);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [voucher, setVoucher] = (0, import_react.useState)("");
	const verified = (0, import_react.useRef)(false);
	const { data } = useQuery({
		queryKey: ["subscription"],
		queryFn: () => fetchSubscription()
	});
	const redeemMutation = useMutation({
		mutationFn: (code) => redeem({ data: { code } }),
		onSuccess: async (res) => {
			if (res.ok) {
				toast.success(`Voucher applied — ${res.months} free month${res.months === 1 ? "" : "s"} added.`);
				setVoucher("");
				await qc.invalidateQueries({ queryKey: ["subscription"] });
			} else toast.error(res.message ?? "Voucher could not be applied");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Voucher could not be applied")
	});
	const verifyMutation = useMutation({
		mutationFn: (ref) => verify({ data: { reference: ref } }),
		onSuccess: async (res) => {
			if (res.paid) toast.success("Payment confirmed — your subscription is active.");
			else toast.error("Payment was not completed.");
			await qc.invalidateQueries({ queryKey: ["subscription"] });
			navigate({
				to: "/billing",
				search: {},
				replace: true
			});
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Verification failed")
	});
	(0, import_react.useEffect)(() => {
		if (reference && !verified.current) {
			verified.current = true;
			verifyMutation.mutate(reference);
		}
	}, [reference, verifyMutation]);
	async function pay(plan) {
		setPending(plan);
		try {
			const res = await checkout({ data: {
				plan,
				origin: window.location.origin
			} });
			window.location.href = res.authorization_url;
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not start payment");
			setPending(null);
		}
	}
	const statusLabel = !data ? "Loading…" : data.onTrial ? `Free trial · ${data.daysLeft} days left` : data.active ? `${PLANS[data.subscription.plan ?? "monthly"]?.label ?? "Active"} plan · renews ${shortDate(data.endsAt)}` : "No active subscription";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Billing",
		description: "Your Rent Receipt Pro subscription and payment history",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex flex-wrap items-center justify-between gap-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Current status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl font-bold",
							children: statusLabel
						}),
						data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: data.active ? `Access valid until ${shortDate(data.endsAt)}` : `Ended ${shortDate(data.endsAt)}`
						}) : null
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${data?.active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted"}`,
						children: [data?.onTrial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3.5" }), data?.active ? data.onTrial ? "Trial active" : "Active" : "Inactive"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: Object.keys(PLANS).map((key) => {
						const plan = PLANS[key];
						const best = key === "yearly";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `surface-card relative overflow-hidden p-7 ${best ? "ring-2 ring-primary" : ""}`,
							children: [
								best ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gradient-primary absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold text-primary-foreground",
									children: "Best value"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-bold",
									children: plan.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 font-display text-4xl font-bold",
									children: [money(plan.amount), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 text-sm font-medium text-muted-foreground",
										children: ["/", key === "yearly" ? "year" : "month"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: plan.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 space-y-2.5 text-sm",
									children: perks.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: p
										})]
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-7 w-full rounded-full shadow-glow",
									variant: best ? "default" : "outline",
									disabled: pending !== null,
									onClick: () => pay(key),
									children: pending === key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), " Pay with Paystack"] })
								})
							]
						}, key);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Secure payments by Paystack — M-Pesa, card and bank supported. New accounts get 1 month free. Need help? WhatsApp 0742868209."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "flex items-center gap-2 font-display text-base font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "size-4 text-primary" }), " Have a voucher code?"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Enter your code to add free months to your account instantly."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex flex-col gap-3 sm:flex-row",
							onSubmit: (e) => {
								e.preventDefault();
								if (voucher.trim().length >= 4) redeemMutation.mutate(voucher.trim());
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: voucher,
								onChange: (e) => setVoucher(e.target.value.toUpperCase()),
								placeholder: "RRP-XXXXXX",
								className: "font-mono sm:max-w-xs",
								"aria-label": "Voucher code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: redeemMutation.isPending || voucher.trim().length < 4,
								children: redeemMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Apply voucher"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold",
						children: "Payment history"
					}), data?.history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Reference"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.history.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: shortDate(row.paid_at ?? row.created_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 capitalize",
										children: row.plan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: money(row.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 font-mono text-xs text-muted-foreground",
										children: row.reference
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 capitalize",
										children: row.status
									})
								]
							}, row.id)) })]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "No payments yet."
					})]
				})
			]
		})
	});
}
//#endregion
export { BillingPage as component };
