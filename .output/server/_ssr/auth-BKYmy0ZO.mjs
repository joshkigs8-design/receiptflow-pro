import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-CFjc3-zE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as LoaderCircle, J as Building2 } from "../_libs/lucide-react.mjs";
import { a as ThemeToggle, r as Route$20 } from "./router-8Z92OHgn.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { recordReferral } from "./affiliate.functions-31yKCo8J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BKYmy0ZO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { mode, ref } = Route$20.useSearch();
	const navigate = useNavigate();
	const [signup, setSignup] = (0, import_react.useState)(mode === "signup");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [referralCode, setReferralCode] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("rrp_referral_code");
			if (stored) return stored;
			if (ref) {
				localStorage.setItem("rrp_referral_code", ref);
				return ref;
			}
		}
		return ref ?? null;
	});
	(0, import_react.useEffect)(() => {
		if (ref) {
			setReferralCode(ref);
			localStorage.setItem("rrp_referral_code", ref);
		}
	}, [ref]);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: "/dashboard",
				replace: true
			});
		});
	}, [navigate]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (signup) {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: {
							full_name: name,
							company_name: company || "Codevanta Ventures",
							referral_code: referralCode
						}
					}
				});
				if (error) throw error;
				if (!data.session) {
					setSent(true);
					toast.success("Check your email to confirm your account.");
					return;
				}
				if (referralCode) try {
					await recordReferral({ data: { referralCode } });
				} catch (err) {
					console.warn("Referral recording failed:", err);
				}
				localStorage.removeItem("rrp_referral_code");
				setReferralCode(null);
				navigate({ to: "/dashboard" });
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				navigate({ to: "/dashboard" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setBusy(false);
		}
	}
	async function google() {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/auth/callback` }
			});
			if (error) {
				toast.error(`Google sign-in failed: ${error.message}`);
				return;
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google sign-in failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.25),transparent_60%)] animate-aurora" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-4 top-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card relative w-full max-w-md p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: "Rent Receipt Pro"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 text-2xl font-bold",
						children: signup ? "Create your landlord account" : "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: signup ? "Start managing properties and issuing digital receipts." : "Sign in to your Codevanta Ventures dashboard."
					}),
					sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 rounded-2xl bg-accent p-4 text-sm",
						children: [
							"We sent a confirmation link to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email }),
							". Confirm it, then sign in."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							signup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									maxLength: 120
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "company",
									children: "Company / brand name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "company",
									value: company,
									onChange: (e) => setCompany(e.target.value),
									placeholder: "Codevanta Ventures",
									maxLength: 120
								})]
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									maxLength: 200
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 6,
									maxLength: 72
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full shadow-glow",
								disabled: busy,
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : signup ? "Create account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full rounded-full",
						onClick: google,
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							signup ? "Already have an account?" : "New to Rent Receipt Pro?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-primary hover:underline",
								onClick: () => {
									setSignup((v) => !v);
									setSent(false);
								},
								children: signup ? "Sign in" : "Create one"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenant",
							className: "text-muted-foreground hover:text-foreground",
							children: "I'm a tenant → open the portal"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
