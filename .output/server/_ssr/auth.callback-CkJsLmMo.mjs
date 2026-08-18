import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-C8qgcHBz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-CkJsLmMo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallbackPage() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const processCallback = async () => {
			try {
				const { data, error: sessionError } = await supabase.auth.getSession();
				if (sessionError) {
					setError(`Session error: ${sessionError.message}`);
					toast.error("Authentication failed");
					setTimeout(() => {
						navigate({ to: "/auth" });
					}, 2e3);
					return;
				}
				if (data.session) {
					toast.success("Signed in successfully!");
					setTimeout(() => {
						navigate({ to: "/dashboard" });
					}, 500);
				} else {
					setError("No session found. Please try again.");
					toast.error("Authentication failed");
					setTimeout(() => {
						navigate({ to: "/auth" });
					}, 2e3);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unknown error occurred";
				setError(message);
				toast.error("Authentication error");
				setTimeout(() => {
					navigate({ to: "/auth" });
				}, 2e3);
			} finally {
				setIsProcessing(false);
			}
		};
		processCallback();
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16",
		"data-tsd-source": "/src/routes/auth.callback.tsx:63:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.25),transparent_60%)] animate-aurora",
			"data-tsd-source": "/src/routes/auth.callback.tsx:64:7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card relative w-full max-w-md p-8 text-center",
			"data-tsd-source": "/src/routes/auth.callback.tsx:66:7",
			children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "mx-auto size-8 animate-spin text-primary",
				"data-tsd-source": "/src/routes/auth.callback.tsx:69:13"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				"data-tsd-source": "/src/routes/auth.callback.tsx:70:13",
				children: "Signing you in..."
			})] }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold text-destructive",
					"data-tsd-source": "/src/routes/auth.callback.tsx:74:13",
					children: "Authentication Error"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					"data-tsd-source": "/src/routes/auth.callback.tsx:75:13",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					"data-tsd-source": "/src/routes/auth.callback.tsx:76:13",
					children: "Redirecting to login page..."
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "mx-auto size-8 animate-spin text-primary",
				"data-tsd-source": "/src/routes/auth.callback.tsx:80:13"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				"data-tsd-source": "/src/routes/auth.callback.tsx:81:13",
				children: "Redirecting..."
			})] })
		})]
	});
}
//#endregion
export { AuthCallbackPage as component };
