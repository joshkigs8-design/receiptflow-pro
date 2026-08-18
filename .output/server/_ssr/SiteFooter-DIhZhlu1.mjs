import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { V as Building2, t as X, x as Menu } from "../_libs/lucide-react.mjs";
import { r as ThemeToggle } from "./router-Dv0RVfoo.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteFooter-DIhZhlu1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [{
	label: "Features",
	href: "/#features"
}, {
	label: "Pricing",
	href: "/#pricing"
}];
function SiteNav() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-5"}`,
		"data-tsd-source": "/src/components/site/SiteNav.tsx:24:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			"data-tsd-source": "/src/components/site/SiteNav.tsx:29:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: `flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${scrolled ? "glass-strong" : "border border-transparent"}`,
				"data-tsd-source": "/src/components/site/SiteNav.tsx:30:9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:35:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
							"data-tsd-source": "/src/components/site/SiteNav.tsx:36:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "size-5 text-primary-foreground",
								"data-tsd-source": "/src/components/site/SiteNav.tsx:37:15"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base font-bold tracking-tight",
							"data-tsd-source": "/src/components/site/SiteNav.tsx:39:13",
							children: "RentReceiptPro"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-1 md:flex",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:44:11",
						children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: l.href,
							className: "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
							"data-tsd-source": "/src/components/site/SiteNav.tsx:46:15",
							children: l.label
						}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenant",
							className: "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
							"data-tsd-source": "/src/components/site/SiteNav.tsx:54:13",
							children: "Tenant Portal"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:62:11",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {
								className: "hidden sm:inline-flex",
								"data-tsd-source": "/src/components/site/SiteNav.tsx:63:13"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "hidden rounded-full sm:inline-flex",
								"data-tsd-source": "/src/components/site/SiteNav.tsx:64:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									"data-tsd-source": "/src/components/site/SiteNav.tsx:70:15",
									children: "Login"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "rounded-full shadow-glow",
								"data-tsd-source": "/src/components/site/SiteNav.tsx:72:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									"data-tsd-source": "/src/components/site/SiteNav.tsx:73:15",
									children: "Get Started"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Toggle menu",
								onClick: () => setOpen((v) => !v),
								className: "glass inline-flex size-10 items-center justify-center rounded-full md:hidden",
								"data-tsd-source": "/src/components/site/SiteNav.tsx:77:13",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									className: "size-4",
									"data-tsd-source": "/src/components/site/SiteNav.tsx:83:23"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
									className: "size-4",
									"data-tsd-source": "/src/components/site/SiteNav.tsx:83:50"
								})
							})
						]
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong mt-2 flex flex-col gap-1 rounded-3xl p-3 md:hidden",
				"data-tsd-source": "/src/components/site/SiteNav.tsx:89:11",
				children: [
					links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						onClick: () => setOpen(false),
						className: "rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:91:15",
						children: l.label
					}, l.href)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tenant",
						className: "rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:100:13",
						children: "Tenant Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent",
						"data-tsd-source": "/src/components/site/SiteNav.tsx:106:13",
						children: "Login"
					})
				]
			}) : null]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-card/50",
		"data-tsd-source": "/src/components/site/SiteFooter.tsx:6:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5",
			"data-tsd-source": "/src/components/site/SiteFooter.tsx:7:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-tsd-source": "/src/components/site/SiteFooter.tsx:8:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:9:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-9 items-center justify-center rounded-xl",
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:10:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "size-5 text-primary-foreground",
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:11:15"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:13:13",
							children: "RentReceiptPro"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:15:11",
						children: "A Codevanta Ventures product. Premium property management and QR-verified digital rent receipts."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-tsd-source": "/src/components/site/SiteFooter.tsx:21:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:22:11",
						children: "Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:23:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:24:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#features",
								className: "hover:text-foreground",
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:25:15",
								children: "Features"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:29:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#pricing",
								className: "hover:text-foreground",
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:30:15",
								children: "Pricing"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-tsd-source": "/src/components/site/SiteFooter.tsx:37:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:38:11",
						children: "Access"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:39:11",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:40:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									className: "hover:text-foreground",
									"data-tsd-source": "/src/components/site/SiteFooter.tsx:41:15",
									children: "Landlord login"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:45:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tenant",
									className: "hover:text-foreground",
									"data-tsd-source": "/src/components/site/SiteFooter.tsx:46:15",
									children: "Tenant portal"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:50:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/verify",
									className: "hover:text-foreground",
									"data-tsd-source": "/src/components/site/SiteFooter.tsx:51:15",
									children: "Verify a receipt"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:55:13",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/download",
									className: "hover:text-foreground",
									"data-tsd-source": "/src/components/site/SiteFooter.tsx:56:15",
									children: "Android app"
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-tsd-source": "/src/components/site/SiteFooter.tsx:63:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:64:11",
						children: "Legal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:65:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:66:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy-policy",
								className: "hover:text-foreground",
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:67:15",
								children: "Privacy Policy"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:71:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:text-foreground",
								"data-tsd-source": "/src/components/site/SiteFooter.tsx:72:15",
								children: "Terms of Service"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-tsd-source": "/src/components/site/SiteFooter.tsx:79:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:80:11",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:81:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:82:13",
							children: "WhatsApp: 0742868209"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							"data-tsd-source": "/src/components/site/SiteFooter.tsx:83:13",
							children: "Nairobi, Kenya"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border px-6 py-6 text-center text-xs text-muted-foreground",
			"data-tsd-source": "/src/components/site/SiteFooter.tsx:87:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				"data-tsd-source": "/src/components/site/SiteFooter.tsx:88:9",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Codevanta Ventures. All rights reserved."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1",
				"data-tsd-source": "/src/components/site/SiteFooter.tsx:89:9",
				children: [
					"Designed by",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://codevanta.online",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "font-semibold text-primary hover:underline",
						"data-tsd-source": "/src/components/site/SiteFooter.tsx:91:11",
						children: "CodeVanta"
					})
				]
			})]
		})]
	});
}
//#endregion
export { SiteNav as n, SiteFooter as t };
