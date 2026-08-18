import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Field-D_A5Yyq_.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, htmlFor, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-2 ${className}`,
		"data-tsd-source": "/src/components/app/Field.tsx:16:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			"data-tsd-source": "/src/components/app/Field.tsx:17:7",
			children: label
		}), children]
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-10 text-center",
		"data-tsd-source": "/src/components/app/Field.tsx:25:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold",
			"data-tsd-source": "/src/components/app/Field.tsx:26:7",
			children: title
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			"data-tsd-source": "/src/components/app/Field.tsx:27:15",
			children: hint
		}) : null]
	});
}
//#endregion
export { Field as n, EmptyState as t };
