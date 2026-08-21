import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Apple, M as Download, d as ShieldCheck, u as Smartphone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as SiteNav, t as SiteFooter } from "./SiteFooter-DtchBuzU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/download-C6tV5qDr.js
var import_jsx_runtime = require_jsx_runtime();
var APK_URL = "https://github.com/joshkigs8-design/receiptflow-pro/releases/latest";
function DownloadPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-6 pb-20 pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gradient-primary inline-flex size-12 items-center justify-center rounded-2xl shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-6 text-primary-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-4xl font-bold sm:text-5xl",
						children: "Rent Receipt Pro for Android"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "The same dashboard, tenants, payments and QR receipts — in a native Android app. Sign in with the account you already use on the web."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "rounded-full shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: APK_URL,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download APK"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Use the web app"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-10 space-y-4 p-6 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold",
								children: "Installing the APK"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "list-decimal space-y-2 pl-5 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Tap ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Download APK" }),
										" and grab the newest release file."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"When Android warns about unknown sources, allow installs from your browser in",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: " Settings → Apps → Special access" }),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Open the downloaded file and tap ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Install" }),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Launch Rent Receipt Pro and sign in — your data syncs instantly." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), " Package: com.rentreceiptpro.app — published by Codevanta Ventures."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-6 flex items-start gap-3 p-6 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "mt-0.5 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "iPhone or iPad? Open Rent Receipt Pro in Safari and tap Share → Add to Home Screen for an app-like experience." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { DownloadPage as component };
