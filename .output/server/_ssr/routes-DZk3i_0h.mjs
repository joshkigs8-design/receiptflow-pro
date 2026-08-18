import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as PLANS } from "./billing.server-D8lRBSqW.mjs";
import { L as Check, O as FileText, P as CirclePlay, V as Building2, W as ArrowRight, g as QrCode, i as Users, k as FileCheckCorner, l as Sparkles, r as Wallet, z as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as money } from "./format-DGi3p9Yo.mjs";
import { n as SiteNav, t as SiteFooter } from "./SiteFooter-DIhZhlu1.mjs";
import { n as animate, t as useInView } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DZk3i_0h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Counter({ to, prefix = "", suffix = "", duration = 1.8 }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		amount: .4
	});
	const [value, setValue] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		const controls = animate(0, to, {
			duration,
			ease: "easeOut",
			onUpdate: (v) => setValue(v)
		});
		return () => controls.stop();
	}, [
		inView,
		to,
		duration
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		"data-tsd-source": "/src/components/site/Counter.tsx:30:5",
		children: [
			prefix,
			Math.round(value).toLocaleString(),
			suffix
		]
	});
}
var hero_poster_default = "/assets/hero-poster-CIM8cEqS.jpg";
var floatingCards = [
	{
		label: "Properties managed",
		value: 1240,
		suffix: "+",
		className: "left-[4%] top-[24%]"
	},
	{
		label: "Receipts generated",
		value: 98500,
		suffix: "+",
		className: "right-[5%] top-[18%]"
	},
	{
		label: "Monthly income",
		value: 42,
		prefix: "KSh ",
		suffix: "M",
		className: "left-[8%] bottom-[16%]"
	},
	{
		label: "Happy tenants",
		value: 15600,
		suffix: "+",
		className: "right-[7%] bottom-[22%]"
	}
];
function Hero() {
	const [pointer, setPointer] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const onMove = (e) => {
			setPointer({
				x: (e.clientX / window.innerWidth - .5) * 2,
				y: (e.clientY / window.innerHeight - .5) * 2
			});
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-[100svh] items-center overflow-hidden",
		"data-tsd-source": "/src/components/site/Hero.tsx:37:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
				className: "absolute inset-0 size-full object-cover",
				autoPlay: true,
				loop: true,
				muted: true,
				playsInline: true,
				preload: "metadata",
				poster: hero_poster_default,
				"data-tsd-source": "/src/components/site/Hero.tsx:38:7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: "https://videos.pexels.com/video-files/2792370/2792370-hd_1920_1080_30fps.mp4",
					type: "video/mp4",
					"data-tsd-source": "/src/components/site/Hero.tsx:47:9"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: "https://videos.pexels.com/video-files/3254006/3254006-hd_1920_1080_25fps.mp4",
					type: "video/mp4",
					"data-tsd-source": "/src/components/site/Hero.tsx:51:9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-[oklch(0.14_0.02_50_/_0.78)]",
				"data-tsd-source": "/src/components/site/Hero.tsx:57:7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.72_0.2_47_/_0.35),transparent_55%),radial-gradient(circle_at_80%_70%,oklch(0.52_0.18_38_/_0.4),transparent_60%)] animate-aurora",
				"data-tsd-source": "/src/components/site/Hero.tsx:58:7"
			}),
			floatingCards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 30,
					scale: .9
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				transition: {
					delay: .5 + i * .15,
					duration: .8,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				style: { transform: `translate3d(${pointer.x * (10 + i * 5)}px, ${pointer.y * (8 + i * 4)}px, 0)` },
				className: `glass-strong absolute hidden w-44 rounded-3xl p-4 text-white lg:block ${card.className} ${i % 2 === 0 ? "animate-float" : "animate-float-slow"}`,
				"data-tsd-source": "/src/components/site/Hero.tsx:61:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-bold",
					"data-tsd-source": "/src/components/site/Hero.tsx:73:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
						to: card.value,
						prefix: card.prefix ?? "",
						suffix: card.suffix ?? "",
						"data-tsd-source": "/src/components/site/Hero.tsx:74:13"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-white/70",
					"data-tsd-source": "/src/components/site/Hero.tsx:76:11",
					children: card.label
				})]
			}, card.label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto w-full max-w-4xl px-6 py-32 text-center",
				"data-tsd-source": "/src/components/site/Hero.tsx:80:7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .6 },
						className: "glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white",
						"data-tsd-source": "/src/components/site/Hero.tsx:81:9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, {
							className: "size-3.5",
							"data-tsd-source": "/src/components/site/Hero.tsx:87:11"
						}), " QR-verified digital receipts by Codevanta Ventures"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						initial: {
							opacity: 0,
							y: 28
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .9,
							delay: .1,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: "mt-6 font-display text-4xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl",
						"data-tsd-source": "/src/components/site/Hero.tsx:90:9",
						children: "RentReceiptPro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .9,
							delay: .25
						},
						className: "mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg",
						"data-tsd-source": "/src/components/site/Hero.tsx:99:9",
						children: "Professional Rent Receipts. Simplified Property Management."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .9,
							delay: .35
						},
						className: "mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg",
						"data-tsd-source": "/src/components/site/Hero.tsx:108:9",
						children: "RentReceiptPro helps landlords and property managers manage tenants, properties, rent payments, leases and professional rent receipts — all from one simple platform."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .9,
							delay: .4
						},
						className: "mt-10 flex flex-wrap items-center justify-center gap-3",
						"data-tsd-source": "/src/components/site/Hero.tsx:117:9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "rounded-full shadow-glow",
								"data-tsd-source": "/src/components/site/Hero.tsx:123:11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									"data-tsd-source": "/src/components/site/Hero.tsx:124:13",
									children: ["Get Started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "ml-1 size-4",
										"data-tsd-source": "/src/components/site/Hero.tsx:125:27"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								className: "rounded-full",
								"data-tsd-source": "/src/components/site/Hero.tsx:128:11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									"data-tsd-source": "/src/components/site/Hero.tsx:129:13",
									children: "Login"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								className: "glass rounded-full text-white",
								"data-tsd-source": "/src/components/site/Hero.tsx:131:11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/tenant",
									"data-tsd-source": "/src/components/site/Hero.tsx:132:13",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
										className: "mr-1 size-4",
										"data-tsd-source": "/src/components/site/Hero.tsx:133:15"
									}), " Tenant Portal"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#preview",
								className: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white",
								"data-tsd-source": "/src/components/site/Hero.tsx:136:11",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, {
									className: "size-5",
									"data-tsd-source": "/src/components/site/Hero.tsx:140:13"
								}), " Watch demo"]
							})
						]
					})
				]
			})
		]
	});
}
var features = [
	{
		icon: Building2,
		title: "Property & Unit Management",
		text: "Unlimited properties with photos, GPS, amenities and notes."
	},
	{
		icon: Users,
		title: "Tenant Management",
		text: "Full tenant profiles, IDs, documents and lease dates."
	},
	{
		icon: FileText,
		title: "Professional Rent Receipts",
		text: "Branded PDF receipts generated the moment rent is paid."
	},
	{
		icon: QrCode,
		title: "QR Verification",
		text: "Every receipt carries a QR code that proves it is genuine."
	},
	{
		icon: Wallet,
		title: "Rent Payment Tracking",
		text: "Cash, M-Pesa, bank, card and cheque with balances."
	},
	{
		icon: ChartColumn,
		title: "Rental Business Dashboard",
		text: "Income, occupancy, arrears and revenue exports."
	},
	{
		icon: Building2,
		title: "Lease Management",
		text: "Manage lease agreements, terms, and renewal dates for all properties."
	}
];
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "features",
		className: "relative py-20",
		"data-tsd-source": "/src/components/site/Features.tsx:44:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6",
			"data-tsd-source": "/src/components/site/Features.tsx:45:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				"data-tsd-source": "/src/components/site/Features.tsx:46:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-[0.2em] text-primary uppercase",
					"data-tsd-source": "/src/components/site/Features.tsx:47:11",
					children: "Platform"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-3xl font-bold sm:text-4xl",
					"data-tsd-source": "/src/components/site/Features.tsx:48:11",
					children: "Everything a modern landlord needs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				"data-tsd-source": "/src/components/site/Features.tsx:53:9",
				children: features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
					initial: {
						opacity: 0,
						y: 26
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: {
						once: true,
						amount: .2
					},
					transition: {
						duration: .5,
						delay: i % 3 * .08
					},
					className: "group surface-card relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow",
					"data-tsd-source": "/src/components/site/Features.tsx:55:13",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
							"data-tsd-source": "/src/components/site/Features.tsx:63:15"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex size-11 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
							"data-tsd-source": "/src/components/site/Features.tsx:64:15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, {
								className: "size-5",
								"data-tsd-source": "/src/components/site/Features.tsx:65:17"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-semibold",
							"data-tsd-source": "/src/components/site/Features.tsx:67:15",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							"data-tsd-source": "/src/components/site/Features.tsx:68:15",
							children: f.text
						})
					]
				}, f.title))
			})]
		})
	});
}
var perks = [
	"Unlimited properties, units & tenants",
	"QR-verified PDF rent receipts",
	"Tenant portal & maintenance requests",
	"Income reports & analytics",
	"Custom receipt branding",
	"M-Pesa, card and bank payments via Paystack"
];
function Pricing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pricing",
		className: "px-6 py-24",
		"data-tsd-source": "/src/components/site/Pricing.tsx:19:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl",
			"data-tsd-source": "/src/components/site/Pricing.tsx:20:7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .3
				},
				transition: {
					duration: .7,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "text-center",
				"data-tsd-source": "/src/components/site/Pricing.tsx:21:9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
						"data-tsd-source": "/src/components/site/Pricing.tsx:28:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-3.5 text-primary",
							"data-tsd-source": "/src/components/site/Pricing.tsx:29:13"
						}), " 1 month free on signup"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-3xl font-bold sm:text-4xl",
						"data-tsd-source": "/src/components/site/Pricing.tsx:31:11",
						children: "Simple, honest pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-muted-foreground",
						"data-tsd-source": "/src/components/site/Pricing.tsx:34:11",
						children: "Try everything free for one month. Keep going from KSh 300 a month — cancel anytime."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-6 md:grid-cols-2",
				"data-tsd-source": "/src/components/site/Pricing.tsx:39:9",
				children: Object.keys(PLANS).map((key, i) => {
					const plan = PLANS[key];
					const best = key === "yearly";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 28
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							amount: .3
						},
						transition: {
							duration: .7,
							delay: i * .1,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: `surface-card relative p-8 ${best ? "ring-2 ring-primary shadow-glow" : ""}`,
						"data-tsd-source": "/src/components/site/Pricing.tsx:44:15",
						children: [
							best ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gradient-primary absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-bold text-primary-foreground",
								"data-tsd-source": "/src/components/site/Pricing.tsx:53:19",
								children: "Save 2 months"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold",
								"data-tsd-source": "/src/components/site/Pricing.tsx:57:17",
								children: plan.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-4xl font-bold",
								"data-tsd-source": "/src/components/site/Pricing.tsx:58:17",
								children: [money(plan.amount), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-sm font-medium text-muted-foreground",
									"data-tsd-source": "/src/components/site/Pricing.tsx:60:19",
									children: ["/", key === "yearly" ? "year" : "month"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								"data-tsd-source": "/src/components/site/Pricing.tsx:64:17",
								children: plan.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-2.5 text-sm",
								"data-tsd-source": "/src/components/site/Pricing.tsx:65:17",
								children: perks.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									"data-tsd-source": "/src/components/site/Pricing.tsx:67:21",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "mt-0.5 size-4 shrink-0 text-primary",
										"data-tsd-source": "/src/components/site/Pricing.tsx:68:23"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										"data-tsd-source": "/src/components/site/Pricing.tsx:69:23",
										children: p
									})]
								}, p))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: best ? "default" : "outline",
								className: "mt-8 w-full rounded-full",
								"data-tsd-source": "/src/components/site/Pricing.tsx:73:17",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									"data-tsd-source": "/src/components/site/Pricing.tsx:79:19",
									children: "Start 1 month free"
								})
							})
						]
					}, key);
				})
			})]
		})
	});
}
function CtaBand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-6 py-20",
		"data-tsd-source": "/src/components/site/CtaBand.tsx:8:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .96
			},
			whileInView: {
				opacity: 1,
				scale: 1
			},
			viewport: {
				once: true,
				amount: .4
			},
			transition: {
				duration: .8,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			className: "gradient-primary relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-8 py-16 text-center shadow-glow",
			"data-tsd-source": "/src/components/site/CtaBand.tsx:9:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,oklch(1_0_0_/_0.25),transparent)] bg-[length:200%_100%]",
					"data-tsd-source": "/src/components/site/CtaBand.tsx:16:9"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "relative font-display text-3xl font-bold text-primary-foreground sm:text-4xl",
					"data-tsd-source": "/src/components/site/CtaBand.tsx:17:9",
					children: "Start issuing digital receipts today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative mx-auto mt-4 max-w-xl text-primary-foreground/80",
					"data-tsd-source": "/src/components/site/CtaBand.tsx:20:9",
					children: "Set up your first property in under five minutes. No paperwork, no lost receipt books."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-8 flex flex-wrap justify-center gap-3",
					"data-tsd-source": "/src/components/site/CtaBand.tsx:23:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "secondary",
						className: "rounded-full",
						"data-tsd-source": "/src/components/site/CtaBand.tsx:24:11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							"data-tsd-source": "/src/components/site/CtaBand.tsx:25:13",
							children: ["Create free account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "ml-1 size-4",
								"data-tsd-source": "/src/components/site/CtaBand.tsx:26:35"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						className: "glass rounded-full text-primary-foreground",
						"data-tsd-source": "/src/components/site/CtaBand.tsx:29:11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenant",
							"data-tsd-source": "/src/components/site/CtaBand.tsx:35:13",
							children: "I'm a tenant"
						})
					})]
				})
			]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		"data-tsd-source": "/src/routes/index.tsx:34:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, { "data-tsd-source": "/src/routes/index.tsx:35:7" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				"data-tsd-source": "/src/routes/index.tsx:36:7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { "data-tsd-source": "/src/routes/index.tsx:37:9" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, { "data-tsd-source": "/src/routes/index.tsx:38:9" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, { "data-tsd-source": "/src/routes/index.tsx:39:9" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, { "data-tsd-source": "/src/routes/index.tsx:40:9" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, { "data-tsd-source": "/src/routes/index.tsx:42:7" })
		]
	});
}
//#endregion
export { Index as component };
