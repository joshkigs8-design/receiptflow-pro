import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-C8qgcHBz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as LoaderCircle, V as Building2 } from "../_libs/lucide-react.mjs";
import { n as Route$19, r as ThemeToggle } from "./router-Dv0RVfoo.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DiZ7-ML_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { mode } = Route$19.useSearch();
	const navigate = useNavigate();
	const [signup, setSignup] = (0, import_react.useState)(mode === "signup");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
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
							company_name: company || "Codevanta Ventures"
						}
					}
				});
				if (error) throw error;
				if (!data.session) {
					setSent(true);
					toast.success("Check your email to confirm your account.");
					return;
				}
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
		"data-tsd-source": "/src/routes/auth.tsx:101:5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.72_0.2_47_/_0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.52_0.18_38_/_0.25),transparent_60%)] animate-aurora",
				"data-tsd-source": "/src/routes/auth.tsx:102:7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-4 top-4",
				"data-tsd-source": "/src/routes/auth.tsx:103:7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { "data-tsd-source": "/src/routes/auth.tsx:104:9" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card relative w-full max-w-md p-8",
				"data-tsd-source": "/src/routes/auth.tsx:107:7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5",
						"data-tsd-source": "/src/routes/auth.tsx:108:9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
							"data-tsd-source": "/src/routes/auth.tsx:109:11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "size-5 text-primary-foreground",
								"data-tsd-source": "/src/routes/auth.tsx:110:13"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							"data-tsd-source": "/src/routes/auth.tsx:112:11",
							children: "Rent Receipt Pro"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 text-2xl font-bold",
						"data-tsd-source": "/src/routes/auth.tsx:115:9",
						children: signup ? "Create your landlord account" : "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/auth.tsx:118:9",
						children: signup ? "Start managing properties and issuing digital receipts." : "Sign in to your Codevanta Ventures dashboard."
					}),
					sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 rounded-2xl bg-accent p-4 text-sm",
						"data-tsd-source": "/src/routes/auth.tsx:125:11",
						children: [
							"We sent a confirmation link to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								"data-tsd-source": "/src/routes/auth.tsx:126:44",
								children: email
							}),
							". Confirm it, then sign in."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						"data-tsd-source": "/src/routes/auth.tsx:129:11",
						children: [
							signup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								"data-tsd-source": "/src/routes/auth.tsx:132:17",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									"data-tsd-source": "/src/routes/auth.tsx:133:19",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									maxLength: 120,
									"data-tsd-source": "/src/routes/auth.tsx:134:19"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								"data-tsd-source": "/src/routes/auth.tsx:142:17",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "company",
									"data-tsd-source": "/src/routes/auth.tsx:143:19",
									children: "Company / brand name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "company",
									value: company,
									onChange: (e) => setCompany(e.target.value),
									placeholder: "Codevanta Ventures",
									maxLength: 120,
									"data-tsd-source": "/src/routes/auth.tsx:144:19"
								})]
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								"data-tsd-source": "/src/routes/auth.tsx:154:13",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									"data-tsd-source": "/src/routes/auth.tsx:155:15",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									maxLength: 200,
									"data-tsd-source": "/src/routes/auth.tsx:156:15"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								"data-tsd-source": "/src/routes/auth.tsx:165:13",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									"data-tsd-source": "/src/routes/auth.tsx:166:15",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 6,
									maxLength: 72,
									"data-tsd-source": "/src/routes/auth.tsx:167:15"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full shadow-glow",
								disabled: busy,
								"data-tsd-source": "/src/routes/auth.tsx:177:13",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "size-4 animate-spin",
									"data-tsd-source": "/src/routes/auth.tsx:179:17"
								}) : signup ? "Create account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
						"data-tsd-source": "/src/routes/auth.tsx:189:9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-px flex-1 bg-border",
								"data-tsd-source": "/src/routes/auth.tsx:190:11"
							}),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-px flex-1 bg-border",
								"data-tsd-source": "/src/routes/auth.tsx:190:57"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full rounded-full",
						onClick: google,
						"data-tsd-source": "/src/routes/auth.tsx:193:9",
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/auth.tsx:197:9",
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
								"data-tsd-source": "/src/routes/auth.tsx:199:11",
								children: signup ? "Sign in" : "Create one"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-sm",
						"data-tsd-source": "/src/routes/auth.tsx:210:9",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenant",
							className: "text-muted-foreground hover:text-foreground",
							"data-tsd-source": "/src/routes/auth.tsx:211:11",
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
