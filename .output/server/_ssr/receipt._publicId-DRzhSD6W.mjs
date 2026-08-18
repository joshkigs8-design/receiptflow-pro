import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Download, U as BadgeCheck, V as Building2, f as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as Route$1 } from "./router-Dv0RVfoo.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as qrDataUrl, r as receiptUrl, t as downloadReceiptPdf } from "./receipt-pdf-BOomGyU_.mjs";
import { t as getPublicReceipt } from "./portal.functions-BWJ2r8Mg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt._publicId-DRzhSD6W.js
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
		"data-tsd-source": "/src/routes/receipt.$publicId.tsx:48:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			"data-tsd-source": "/src/routes/receipt.$publicId.tsx:49:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-6 inline-flex items-center gap-2.5",
				"data-tsd-source": "/src/routes/receipt.$publicId.tsx:50:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					"data-tsd-source": "/src/routes/receipt.$publicId.tsx:51:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
						className: "size-5 text-primary-foreground",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:52:13"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display font-bold",
					"data-tsd-source": "/src/routes/receipt.$publicId.tsx:54:11",
					children: "Rent Receipt Pro"
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				"data-tsd-source": "/src/routes/receipt.$publicId.tsx:58:11",
				children: "Verifying receipt…"
			}) : !receipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-8 text-center",
				"data-tsd-source": "/src/routes/receipt.$publicId.tsx:60:11",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
						className: "mx-auto size-8 text-destructive",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:61:13"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-xl font-bold",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:62:13",
						children: "Receipt not found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:63:13",
						children: "This code does not match any receipt in our records."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-6 rounded-full",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:66:13",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/verify",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:67:15",
							children: "Try another code"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card overflow-hidden",
				"data-tsd-source": "/src/routes/receipt.$publicId.tsx:71:11",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gradient-primary flex items-center justify-between p-6",
					"data-tsd-source": "/src/routes/receipt.$publicId.tsx:72:13",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:73:15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-bold text-primary-foreground",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:74:17",
							children: snap.company ?? "Codevanta Ventures"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-primary-foreground/80",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:77:17",
							children: "Official rent receipt"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-primary-foreground",
						"data-tsd-source": "/src/routes/receipt.$publicId.tsx:79:15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:80:17",
							children: receipt.receipt_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:81:17",
							children: shortDate(receipt.issued_at)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					"data-tsd-source": "/src/routes/receipt.$publicId.tsx:85:13",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:86:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
								className: "size-3.5",
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:87:17"
							}), " Verified authentic"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 grid gap-4 sm:grid-cols-2",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:90:15",
							children: [
								["Tenant", snap.tenant_name ?? "—"],
								["Phone", snap.tenant_phone ?? "—"],
								["Property", snap.property ?? "—"],
								["Unit / room", `${snap.unit ?? "—"}${snap.room ? ` · ${snap.room}` : ""}`],
								["Period", snap.period ?? "—"],
								["Method", `${snap.method ?? "—"}${snap.reference ? ` · ${snap.reference}` : ""}`]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:102:19",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground uppercase",
									"data-tsd-source": "/src/routes/receipt.$publicId.tsx:103:21",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-sm font-medium capitalize",
									"data-tsd-source": "/src/routes/receipt.$publicId.tsx:104:21",
									children: v
								})]
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:109:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:110:17",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground uppercase",
										"data-tsd-source": "/src/routes/receipt.$publicId.tsx:111:19",
										children: "Amount paid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-3xl font-bold text-primary",
										"data-tsd-source": "/src/routes/receipt.$publicId.tsx:112:19",
										children: money(receipt.amount, snap.currency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										"data-tsd-source": "/src/routes/receipt.$publicId.tsx:115:19",
										children: ["Balance ", money(receipt.balance, snap.currency)]
									})
								]
							}), qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: qr,
								alt: "Receipt verification QR code",
								className: "size-28 rounded-xl bg-white p-2",
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:120:19"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-2",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:128:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "rounded-full shadow-glow",
								onClick: () => downloadReceiptPdf(receipt).catch(() => toast.error("Could not build the PDF")),
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:129:17",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									"data-tsd-source": "/src/routes/receipt.$publicId.tsx:135:19"
								}), " Download PDF"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "rounded-full",
								onClick: () => window.print(),
								"data-tsd-source": "/src/routes/receipt.$publicId.tsx:137:17",
								children: "Print"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-xs text-muted-foreground",
							"data-tsd-source": "/src/routes/receipt.$publicId.tsx:141:15",
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
