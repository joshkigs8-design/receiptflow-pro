import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Download, N as Copy, g as QrCode } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { p as listReceipts, t as AppShell } from "./AppShell-BWAvuJ1R.mjs";
import { r as receiptUrl, t as downloadReceiptPdf } from "./receipt-pdf-BOomGyU_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts-BB8RGTj8.js
var import_jsx_runtime = require_jsx_runtime();
function ReceiptsPage() {
	const fetchReceipts = useServerFn(listReceipts);
	const { data, isLoading } = useQuery({
		queryKey: ["receipts"],
		queryFn: () => fetchReceipts()
	});
	const rows = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Receipts",
		description: "Every receipt is QR-verifiable",
		"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:34:5",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:36:9",
			children: "Loading receipts…"
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No receipts yet",
			hint: "Record a payment to issue your first receipt.",
			"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:38:9"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:40:9",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card p-5",
				"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:42:13",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:43:15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-bold",
							"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:44:17",
							children: r.receipt_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
							className: "size-4 text-primary",
							"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:45:17"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:47:15",
						children: shortDate(r.issued_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:48:15",
						children: r.tenants?.full_name ?? r.snapshot?.tenant_name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl font-bold text-primary",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:51:15",
						children: money(r.amount, r.snapshot?.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:54:15",
						children: ["Balance ", money(r.balance, r.snapshot?.currency)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2",
						"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:57:15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "rounded-full",
							onClick: () => downloadReceiptPdf(r).catch(() => toast.error("Could not build the PDF")),
							"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:58:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-3.5",
								"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:65:19"
							}), " PDF"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "rounded-full",
							onClick: () => {
								navigator.clipboard.writeText(receiptUrl(r.public_id));
								toast.success("Verification link copied");
							},
							"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:67:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
								className: "size-3.5",
								"data-tsd-source": "/src/routes/_authenticated/receipts.tsx:76:19"
							}), " Link"]
						})]
					})
				]
			}, r.public_id))
		})
	});
}
//#endregion
export { ReceiptsPage as component };
