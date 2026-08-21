import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { R as redirect, _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-CFjc3-zE.mjs";
import { i as paystackKey, r as nextPeriodEnd, t as PLANS } from "./billing.server-D8lRBSqW.mjs";
import { c as stringType, i as enumType, s as objectType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { c as Sun, x as Moon } from "../_libs/lucide-react.mjs";
import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DzFls5Nq.js
var router_DzFls5Nq_exports = /* @__PURE__ */ __exportAll({
	a: () => Route$20,
	getRouter: () => getRouter,
	i: () => Route$13,
	n: () => Route$1,
	o: () => ThemeToggle,
	r: () => Route$3,
	t: () => router_exports
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BEdvgWRt.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var themeInitScript = `(function(){try{var t=localStorage.getItem('rrp-theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.remove('dark');}})();`;
function ThemeToggle({ className = "" }) {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDark(document.documentElement.classList.contains("dark"));
	}, []);
	function toggle() {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		try {
			localStorage.setItem("rrp-theme", next ? "dark" : "light");
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: toggle,
		"aria-label": "Toggle colour theme",
		className: `glass inline-flex size-10 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105 ${className}`,
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RentReceiptPro — Rent Receipts & Property Management" },
			{
				name: "description",
				content: "RentReceiptPro is a rental property management platform that helps landlords and property managers manage properties, tenants, rent payments, leases and professional rent receipts."
			},
			{
				name: "author",
				content: "Codevanta Ventures"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://rentreceipt.co.ke/"
			},
			{
				property: "og:title",
				content: "RentReceiptPro – Rent Receipts & Property Management"
			},
			{
				property: "og:description",
				content: "RentReceiptPro is a rental property management platform that helps landlords and property managers manage properties, tenants, rent payments, leases and professional rent receipts."
			},
			{
				property: "og:image",
				content: "https://rentreceipt.co.ke/favicon.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "RentReceiptPro – Rent Receipts & Property Management"
			},
			{
				name: "twitter:description",
				content: "RentReceiptPro is a rental property management platform that helps landlords and property managers manage properties, tenants, rent payments, leases and professional rent receipts."
			}
		],
		links: [
			{
				rel: "canonical",
				href: "https://rentreceipt.co.ke/"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "shortcut icon",
				href: "/favicon.png",
				type: "image/png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "RentReceiptPro",
					alternateName: "RentReceiptPro",
					url: "https://rentreceipt.co.ke/"
				}) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$23 = () => import("./routes-CybF1IHz.mjs");
var title$3 = "RentReceiptPro — Rent Receipts & Property Management";
var description$3 = "RentReceiptPro is a rental property management platform that helps landlords and property managers manage properties, tenants, rent payments, leases and professional rent receipts.";
var Route$24 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: title$3 },
			{
				name: "description",
				content: description$3
			},
			{
				property: "og:title",
				content: "RentReceiptPro – Rent Receipts & Property Management"
			},
			{
				property: "og:description",
				content: description$3
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://rentreceipt.co.ke/"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "RentReceiptPro – Rent Receipts & Property Management"
			},
			{
				name: "twitter:description",
				content: description$3
			},
			{
				property: "og:image",
				content: "https://rentreceipt.co.ke/favicon.png"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://rentreceipt.co.ke/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./route-Di7iQBCH.mjs");
var Route$23 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin-2lJRZdHl.mjs");
var title$2 = "Owner Admin Portal — Rent Receipt Pro";
var description$2 = "Private owner control centre for Rent Receipt Pro: landlord accounts, subscription revenue, voucher codes and manual access grants.";
var Route$22 = createFileRoute("/admin")({
	ssr: false,
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./affiliate-BK4E3QSj.mjs");
var Route$21 = createFileRoute("/affiliate")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/affiliate/auth" });
		return { user: data.user };
	},
	head: () => ({ meta: [
		{ title: "Affiliate Program — Rent Receipt Pro" },
		{
			name: "description",
			content: "Earn KSh 50 for every landlord you refer who becomes a paying customer."
		},
		{
			property: "og:title",
			content: "Affiliate Program — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Refer landlords and earn commissions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./auth-CaiOqZ8-.mjs");
var searchSchema$2 = objectType({
	mode: enumType(["login", "signup"]).optional(),
	ref: stringType().max(20).optional()
});
var Route$20 = createFileRoute("/auth")({
	ssr: false,
	validateSearch: (search) => searchSchema$2.parse(search),
	head: () => ({ meta: [
		{ title: "Landlord Login — Rent Receipt Pro" },
		{
			name: "description",
			content: "Sign in or create your Rent Receipt Pro landlord account to manage properties and receipts."
		},
		{
			property: "og:title",
			content: "Landlord Login — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Access your Rent Receipt Pro landlord dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./download-CWwIKbbq.mjs");
var Route$19 = createFileRoute("/download")({
	head: () => ({ meta: [
		{ title: "Download the Android App — Rent Receipt Pro" },
		{
			name: "description",
			content: "Install Rent Receipt Pro on Android: manage properties, record rent and issue QR-verified receipts from your phone."
		},
		{
			property: "og:title",
			content: "Download Rent Receipt Pro for Android"
		},
		{
			property: "og:description",
			content: "Get the Rent Receipt Pro Android app for landlords in Kenya."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./privacy-policy-BbE2AtHd.mjs");
var title$1 = "Privacy Policy — RentReceiptPro";
var description$1 = "Learn how RentReceiptPro collects, uses, and protects your personal and business information.";
var Route$18 = createFileRoute("/privacy-policy")({
	head: () => ({
		meta: [
			{ title: title$1 },
			{
				name: "description",
				content: description$1
			},
			{
				property: "og:title",
				content: title$1
			},
			{
				property: "og:description",
				content: description$1
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://rentreceipt.co.ke/privacy-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://rentreceipt.co.ke/privacy-policy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./tenant-CQyibPZo.mjs");
var Route$17 = createFileRoute("/tenant")({
	head: () => ({ meta: [
		{ title: "Tenant Portal — Rent Receipt Pro" },
		{
			name: "description",
			content: "Tenants: verify with your property code, room number and phone to view payments, download receipts and report maintenance issues."
		},
		{
			property: "og:title",
			content: "Tenant Portal — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "View your rent payments and download receipts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./terms-VwKc0yNb.mjs");
var title = "Terms of Service — RentReceiptPro";
var description = "Review the terms and conditions for using RentReceiptPro property management and receipt generation platform.";
var Route$16 = createFileRoute("/terms")({
	head: () => ({
		meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://rentreceipt.co.ke/terms"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://rentreceipt.co.ke/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./verify-DHtVkuI9.mjs");
var Route$15 = createFileRoute("/verify")({
	head: () => ({ meta: [
		{ title: "Verify a Receipt — Rent Receipt Pro" },
		{
			name: "description",
			content: "Check that a rent receipt is genuine by entering its verification code or scanning its QR code."
		},
		{
			property: "og:title",
			content: "Verify a Receipt — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Confirm a rent receipt is authentic."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./announcements-DOusIGGP.mjs");
var Route$14 = createFileRoute("/_authenticated/announcements")({
	head: () => ({ meta: [
		{ title: "Announcements — Rent Receipt Pro" },
		{
			name: "description",
			content: "Broadcast notices to tenants across your properties."
		},
		{
			property: "og:title",
			content: "Announcements — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Send notices to all your tenants."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./billing-mu4Wyw4k.mjs");
var searchSchema$1 = objectType({ reference: stringType().optional() });
var Route$13 = createFileRoute("/_authenticated/billing")({
	validateSearch: (search) => searchSchema$1.parse(search),
	head: () => ({ meta: [
		{ title: "Billing & Subscription — Rent Receipt Pro" },
		{
			name: "description",
			content: "Manage your Rent Receipt Pro subscription — KSh 300 per month or KSh 3,000 per year, with 2 months free on signup."
		},
		{
			property: "og:title",
			content: "Billing & Subscription — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Activate or renew your Rent Receipt Pro plan."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./dashboard-KiEq1yLA.mjs");
var Route$12 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Landlord Dashboard — Rent Receipt Pro" },
		{
			name: "description",
			content: "Track income, occupancy, tenants and receipts in real time."
		},
		{
			property: "og:title",
			content: "Landlord Dashboard — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Your live property performance overview."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./payments-ffs_F3ba.mjs");
var Route$11 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [
		{ title: "Payments — Rent Receipt Pro" },
		{
			name: "description",
			content: "Record rent payments and instantly issue digital receipts."
		},
		{
			property: "og:title",
			content: "Payments — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Record payments and generate receipts instantly."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./properties-_ix70RgO.mjs");
var Route$10 = createFileRoute("/_authenticated/properties")({
	head: () => ({ meta: [
		{ title: "Properties — Rent Receipt Pro" },
		{
			name: "description",
			content: "Add and manage all your rental properties in one place."
		},
		{
			property: "og:title",
			content: "Properties — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Manage your property portfolio."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./receipts-DMACWMLO.mjs");
var Route$9 = createFileRoute("/_authenticated/receipts")({
	head: () => ({ meta: [
		{ title: "Receipts — Rent Receipt Pro" },
		{
			name: "description",
			content: "Download, share and verify every digital rent receipt issued."
		},
		{
			property: "og:title",
			content: "Receipts — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "All your issued digital rent receipts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./reports-BZyCqFML.mjs");
var Route$8 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [
		{ title: "Reports & Analytics — Rent Receipt Pro" },
		{
			name: "description",
			content: "Income, occupancy and arrears analytics for your portfolio."
		},
		{
			property: "og:title",
			content: "Reports & Analytics — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Understand your rental income at a glance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./requests-D3RSIvds.mjs");
var Route$7 = createFileRoute("/_authenticated/requests")({
	head: () => ({ meta: [
		{ title: "Maintenance Requests — Rent Receipt Pro" },
		{
			name: "description",
			content: "Track tenant maintenance requests from report to resolution."
		},
		{
			property: "og:title",
			content: "Maintenance Requests — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Handle tenant maintenance issues quickly."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./settings-Ds4jSeUd.mjs");
var Route$6 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Rent Receipt Pro" },
		{
			name: "description",
			content: "Branding, currency and business details used on your receipts."
		},
		{
			property: "og:title",
			content: "Settings — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Customise your receipt branding."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./tenants-q-GI3fQx.mjs");
var Route$5 = createFileRoute("/_authenticated/tenants")({
	head: () => ({ meta: [
		{ title: "Tenants — Rent Receipt Pro" },
		{
			name: "description",
			content: "Tenant profiles, leases, rent amounts and contact details."
		},
		{
			property: "og:title",
			content: "Tenants — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Manage tenant profiles and leases."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./units-PEIHC8mA.mjs");
var Route$4 = createFileRoute("/_authenticated/units")({
	head: () => ({ meta: [
		{ title: "Units & Rooms — Rent Receipt Pro" },
		{
			name: "description",
			content: "Track every unit, room, rent amount and occupancy status."
		},
		{
			property: "og:title",
			content: "Units & Rooms — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Manage units, rooms and rent amounts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./affiliate.auth-CaNKPNC5.mjs");
var searchSchema = objectType({
	mode: enumType(["login", "signup"]).optional(),
	ref: stringType().max(20).optional()
});
var Route$3 = createFileRoute("/affiliate/auth")({
	ssr: false,
	validateSearch: (search) => searchSchema.parse(search),
	head: () => ({ meta: [
		{ title: "Affiliate Login — Rent Receipt Pro" },
		{
			name: "description",
			content: "Sign in or create your Rent Receipt Pro affiliate account to earn commissions."
		},
		{
			property: "og:title",
			content: "Affiliate Login — Rent Receipt Pro"
		},
		{
			property: "og:description",
			content: "Access your affiliate dashboard and start earning."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./auth.callback-DgF5KqWs.mjs");
var Route$2 = createFileRoute("/auth/callback")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./receipt._publicId-fNiHO65Q.mjs");
var Route$1 = createFileRoute("/receipt/$publicId")({
	head: () => ({ meta: [
		{ title: "Rent Receipt Verification — Rent Receipt Pro" },
		{
			name: "description",
			content: "View and download a verified digital rent receipt issued through Rent Receipt Pro."
		},
		{
			property: "og:title",
			content: "Rent Receipt Verification"
		},
		{
			property: "og:description",
			content: "This rent receipt is verified against our records."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/public/paystack/webhook")({ server: { handlers: { POST: async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get("x-paystack-signature") ?? "";
	const expected = createHmac("sha512", paystackKey()).update(body).digest("hex");
	const a = Buffer.from(signature);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });
	const event = JSON.parse(body);
	if (event.event !== "charge.success" || event.data?.status !== "success") return new Response("ignored");
	const userId = event.data.metadata?.user_id;
	const reference = event.data.reference;
	if (!userId || !reference) return new Response("ignored");
	const planKey = event.data.metadata?.plan === "yearly" ? "yearly" : "monthly";
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: existing } = await supabaseAdmin.from("subscription_payments").select("status").eq("reference", reference).maybeSingle();
	if (existing?.status === "success") return new Response("ok");
	const { data: sub } = await supabaseAdmin.from("subscriptions").select("current_period_end").eq("user_id", userId).maybeSingle();
	await supabaseAdmin.from("subscriptions").update({
		plan: planKey,
		status: "active",
		current_period_end: nextPeriodEnd(sub?.current_period_end ?? null, planKey),
		last_reference: reference,
		last_amount: PLANS[planKey].amount
	}).eq("user_id", userId);
	await supabaseAdmin.from("subscription_payments").upsert({
		user_id: userId,
		reference,
		plan: planKey,
		amount: PLANS[planKey].amount,
		currency: "KES",
		status: "success",
		paid_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "reference" });
	const { data: sp } = await supabaseAdmin.from("subscription_payments").select("id").eq("reference", reference).maybeSingle();
	if (sp?.id) try {
		await supabaseAdmin.rpc("create_commission", { _subscription_payment_id: sp.id });
	} catch (err) {
		console.warn("Affiliate commission creation skipped:", err);
	}
	return new Response("ok");
} } } });
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRoute = Route$23.update({
	id: "/_authenticated",
	getParentRoute: () => Route$25
});
var AdminRoute = Route$22.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$25
});
var AffiliateRoute = Route$21.update({
	id: "/affiliate",
	path: "/affiliate",
	getParentRoute: () => Route$25
});
var AuthRoute = Route$20.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$25
});
var DownloadRoute = Route$19.update({
	id: "/download",
	path: "/download",
	getParentRoute: () => Route$25
});
var PrivacyPolicyRoute = Route$18.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$25
});
var TenantRoute = Route$17.update({
	id: "/tenant",
	path: "/tenant",
	getParentRoute: () => Route$25
});
var TermsRoute = Route$16.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$25
});
var VerifyRoute = Route$15.update({
	id: "/verify",
	path: "/verify",
	getParentRoute: () => Route$25
});
var AuthenticatedAnnouncementsRoute = Route$14.update({
	id: "/announcements",
	path: "/announcements",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBillingRoute = Route$13.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$12.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPaymentsRoute = Route$11.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPropertiesRoute = Route$10.update({
	id: "/properties",
	path: "/properties",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReceiptsRoute = Route$9.update({
	id: "/receipts",
	path: "/receipts",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$8.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRequestsRoute = Route$7.update({
	id: "/requests",
	path: "/requests",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTenantsRoute = Route$5.update({
	id: "/tenants",
	path: "/tenants",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedUnitsRoute = Route$4.update({
	id: "/units",
	path: "/units",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AffiliateAuthRoute = Route$3.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => AffiliateRoute
});
var AuthCallbackRoute = Route$2.update({
	id: "/callback",
	path: "/callback",
	getParentRoute: () => AuthRoute
});
var ReceiptPublicIdRoute = Route$1.update({
	id: "/receipt/$publicId",
	path: "/receipt/$publicId",
	getParentRoute: () => Route$25
});
var ApiPublicPaystackWebhookRoute = Route.update({
	id: "/api/public/paystack/webhook",
	path: "/api/public/paystack/webhook",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAnnouncementsRoute,
	AuthenticatedBillingRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedPaymentsRoute,
	AuthenticatedPropertiesRoute,
	AuthenticatedReceiptsRoute,
	AuthenticatedReportsRoute,
	AuthenticatedRequestsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedTenantsRoute,
	AuthenticatedUnitsRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AffiliateRouteChildren = { AffiliateAuthRoute };
var AffiliateRouteWithChildren = AffiliateRoute._addFileChildren(AffiliateRouteChildren);
var AuthRouteChildren = { AuthCallbackRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AdminRoute,
	AffiliateRoute: AffiliateRouteWithChildren,
	AuthRoute: AuthRoute._addFileChildren(AuthRouteChildren),
	DownloadRoute,
	PrivacyPolicyRoute,
	TenantRoute,
	TermsRoute,
	VerifyRoute,
	ReceiptPublicIdRoute,
	ApiPublicPaystackWebhookRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { ThemeToggle as a, Route$3 as i, Route$13 as n, router_DzFls5Nq_exports as o, Route$20 as r, Route$1 as t };
