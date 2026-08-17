import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-DQEmNje3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Download, U as BadgeCheck, V as Building2, f as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as Route$1 } from "./router-49H3NiY0.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as qrDataUrl, r as receiptUrl, t as downloadReceiptPdf } from "./receipt-pdf-BOomGyU_.mjs";
import { t as getPublicReceipt } from "./portal.functions-BTo1aQBD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt._publicId-vaK1f4CG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptPage() {
	const { publicId } = Route$1.useParams();
	const fetchReceipt = useServerFn(getPublicReceipt);
	const [qr, setQr] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["public-receipt", publicId],
		queryFn: () => fetchReceipt({ data: { publicId } })
	});
	(0, import_react.useEffect)(() => {
		qrDataUrl(receiptUrl(publicId)).then(setQr).catch(() => setQr(""));
	}, [publicId]);
	const receipt = data?.ok ? data.receipt : null;
	const snap = receipt?.snapshot ?? {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-6 inline-flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display font-bold",
					children: "Rent Receipt Pro"
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Verifying receipt…"
			}) : !receipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto size-8 text-destructive" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-xl font-bold",
						children: "Receipt not found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "This code does not match any receipt in our records."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-6 rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/verify",
							children: "Try another code"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gradient-primary flex items-center justify-between p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold text-primary-foreground",
						children: snap.company ?? "Codevanta Ventures"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-primary-foreground/80",
						children: "Official rent receipt"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: receipt.receipt_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: shortDate(receipt.issued_at)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3.5" }), " Verified authentic"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 grid gap-4 sm:grid-cols-2",
							children: [
								["Tenant", snap.tenant_name ?? "—"],
								["Phone", snap.tenant_phone ?? "—"],
								["Property", snap.property ?? "—"],
								["Unit / room", `${snap.unit ?? "—"}${snap.room ? ` · ${snap.room}` : ""}`],
								["Period", snap.period ?? "—"],
								["Method", `${snap.method ?? "—"}${snap.reference ? ` · ${snap.reference}` : ""}`]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground uppercase",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-medium capitalize",
								children: v
							})] }, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase",
									children: "Amount paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl font-bold text-primary",
									children: money(receipt.amount, snap.currency)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: ["Balance ", money(receipt.balance, snap.currency)]
								})
							] }), qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: qr,
								alt: "Receipt verification QR code",
								className: "size-28 rounded-xl bg-white p-2"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "rounded-full shadow-glow",
								onClick: () => downloadReceiptPdf(receipt).catch(() => toast.error("Could not build the PDF")),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download PDF"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "rounded-full",
								onClick: () => window.print(),
								children: "Print"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-xs text-muted-foreground",
							children: ["Issued by ", receipt.issued_by ?? snap.company ?? "Codevanta Ventures"]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { ReceiptPage as component };
