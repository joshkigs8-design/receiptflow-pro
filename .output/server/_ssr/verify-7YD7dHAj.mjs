import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as QrCode } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as Field } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-7YD7dHAj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const navigate = useNavigate();
	const [id, setId] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		"data-tsd-source": "/src/routes/verify.tsx:29:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card w-full max-w-md p-8",
			"data-tsd-source": "/src/routes/verify.tsx:30:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary inline-flex size-11 items-center justify-center rounded-2xl shadow-glow",
					"data-tsd-source": "/src/routes/verify.tsx:31:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
						className: "size-5 text-primary-foreground",
						"data-tsd-source": "/src/routes/verify.tsx:32:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-2xl font-bold",
					"data-tsd-source": "/src/routes/verify.tsx:34:9",
					children: "Verify a receipt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					"data-tsd-source": "/src/routes/verify.tsx:35:9",
					children: "Scan the QR code on the receipt, or paste its verification code below."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						navigate({
							to: "/receipt/$publicId",
							params: { publicId: id.trim() }
						});
					},
					"data-tsd-source": "/src/routes/verify.tsx:38:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Verification code",
						htmlFor: "pid",
						"data-tsd-source": "/src/routes/verify.tsx:45:11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pid",
							required: true,
							minLength: 6,
							maxLength: 64,
							value: id,
							onChange: (e) => setId(e.target.value),
							"data-tsd-source": "/src/routes/verify.tsx:46:13"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full rounded-full shadow-glow",
						"data-tsd-source": "/src/routes/verify.tsx:55:11",
						children: "Verify"
					})]
				})
			]
		})
	});
}
//#endregion
export { VerifyPage as component };
