import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as Copy, M as Download, _ as QrCode } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as AppShell } from "./AppShell-PG6l2ot8.mjs";
import { f as listReceipts } from "./app.functions-Pj4e3HK0.mjs";
import { r as receiptUrl, t as downloadReceiptPdf } from "./receipt-pdf-BOomGyU_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts-BGUuiHqn.js
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
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading receipts…"
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No receipts yet",
			hint: "Record a payment to issue your first receipt."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-bold",
							children: r.receipt_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4 text-primary" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: shortDate(r.issued_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: r.tenants?.full_name ?? r.snapshot?.tenant_name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl font-bold text-primary",
						children: money(r.amount, r.snapshot?.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Balance ", money(r.balance, r.snapshot?.currency)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "rounded-full",
							onClick: () => downloadReceiptPdf(r).catch(() => toast.error("Could not build the PDF")),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " PDF"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "rounded-full",
							onClick: () => {
								navigator.clipboard.writeText(receiptUrl(r.public_id));
								toast.success("Verification link copied");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Link"]
						})]
					})
				]
			}, r.public_id))
		})
	});
}
//#endregion
export { ReceiptsPage as component };
