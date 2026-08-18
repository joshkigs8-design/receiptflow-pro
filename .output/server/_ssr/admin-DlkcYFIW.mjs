import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as createServerFn } from "./server-DsGdTo1N.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc--FJINHQa.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DGtjvBYq.mjs";
import { t as supabase } from "./client-C8qgcHBz.mjs";
import { c as stringType, n as booleanType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as CalendarClock, C as LogOut, D as Gift, N as Copy, T as LoaderCircle, U as BadgeCheck, V as Building2, _ as Power, a as TrendingUp, d as ShieldCheck, f as ShieldAlert, i as Users, o as Trash2, s as Ticket, v as Plus } from "../_libs/lucide-react.mjs";
import { r as ThemeToggle } from "./router-Dv0RVfoo.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { a as money, o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as Field, t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DlkcYFIW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var voucherInput = objectType({
	code: stringType().trim().min(4).max(40),
	months: numberType().int().min(1).max(60),
	max_uses: numberType().int().min(1).max(1e4),
	expires_at: stringType().optional().nullable(),
	note: stringType().max(200).optional().nullable()
});
var getIsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8ec3a24cdfc816c6a99237bbadf5c75ae0affc14e8a68ec0663a4f7dc5edbfa9"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("98193c088815d6bbdd4155ffbad4b125116e51df7ef81d3d6aef43156e028e01"));
var listVouchers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0d9d41873cdb9cb77864a504e2480b1077b0809623ecc3cce7921d31fb33251f"));
var createVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => voucherInput.parse(d)).handler(createSsrRpc("08f4958d20db10bd41b2c5f20446ce43d86dde22b94b4a146a05057b239a871b"));
var setVoucherActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	active: booleanType()
}).parse(d)).handler(createSsrRpc("b98b4156ff19758fc838b6cff18a0372feda9e5dd73de3d2f813fd7c8145e2eb"));
var deleteVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ee89dd767c08fa82b56745e5421817bcaa0ac7056f98de734615535e1405e6cf"));
var grantAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().uuid(),
	months: numberType().int().min(1).max(60)
}).parse(d)).handler(createSsrRpc("7315e64b7b705826508942d72c2c637e2806b87b499a8ee29a491c3bfed2450b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().min(4).max(40) }).parse(d)).handler(createSsrRpc("b9baa550ffbd6640840715c8f50cdac54633c900de41356c04906e4f64e10d36"));
function randomCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "RRP-";
	for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
var stateStyles = {
	paid: "gradient-primary text-primary-foreground shadow-glow",
	trial: "bg-primary/15 text-primary",
	expired: "bg-muted text-muted-foreground"
};
function AdminFrame({ children, onSignOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		"data-tsd-source": "/src/routes/admin.tsx:76:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6",
			"data-tsd-source": "/src/routes/admin.tsx:77:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-9 items-center justify-center rounded-xl shadow-glow",
					"data-tsd-source": "/src/routes/admin.tsx:78:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "size-5 text-primary-foreground",
						"data-tsd-source": "/src/routes/admin.tsx:79:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					"data-tsd-source": "/src/routes/admin.tsx:81:9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-base font-bold",
						"data-tsd-source": "/src/routes/admin.tsx:82:11",
						children: "Owner Admin Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						"data-tsd-source": "/src/routes/admin.tsx:83:11",
						children: "Codevanta Ventures · Rent Receipt Pro"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { "data-tsd-source": "/src/routes/admin.tsx:87:9" }),
				onSignOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "rounded-full",
					onClick: onSignOut,
					"data-tsd-source": "/src/routes/admin.tsx:89:11",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
						className: "size-4",
						"data-tsd-source": "/src/routes/admin.tsx:90:13"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						"data-tsd-source": "/src/routes/admin.tsx:91:13",
						children: "Sign out"
					})]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
			"data-tsd-source": "/src/routes/admin.tsx:95:7",
			children
		})]
	});
}
function AdminSignIn({ onSignedIn }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			onSignedIn();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sign-in failed");
		} finally {
			setBusy(false);
		}
	}
	async function createOwner() {
		setBusy(true);
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/admin`,
					data: {
						full_name: "Owner",
						company_name: "Codevanta Ventures"
					}
				}
			});
			if (error) throw error;
			if (!data.session) {
				toast.success("Confirm the link we emailed you, then sign in here.");
				return;
			}
			onSignedIn();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create the owner account");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16",
		"data-tsd-source": "/src/routes/admin.tsx:144:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-4 top-4",
			"data-tsd-source": "/src/routes/admin.tsx:145:7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { "data-tsd-source": "/src/routes/admin.tsx:146:9" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card relative w-full max-w-md p-8",
			"data-tsd-source": "/src/routes/admin.tsx:148:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-primary flex size-11 items-center justify-center rounded-xl shadow-glow",
					"data-tsd-source": "/src/routes/admin.tsx:149:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "size-5 text-primary-foreground",
						"data-tsd-source": "/src/routes/admin.tsx:150:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-2xl font-bold",
					"data-tsd-source": "/src/routes/admin.tsx:152:9",
					children: "Owner admin sign-in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					"data-tsd-source": "/src/routes/admin.tsx:153:9",
					children: "Private entrance to the Codevanta Ventures admin portal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-4",
					"data-tsd-source": "/src/routes/admin.tsx:157:9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							"data-tsd-source": "/src/routes/admin.tsx:158:11",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-email",
								"data-tsd-source": "/src/routes/admin.tsx:159:13",
								children: "Owner email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								maxLength: 200,
								autoComplete: "email",
								"data-tsd-source": "/src/routes/admin.tsx:160:13"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							"data-tsd-source": "/src/routes/admin.tsx:170:11",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-password",
								"data-tsd-source": "/src/routes/admin.tsx:171:13",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								maxLength: 72,
								autoComplete: "current-password",
								"data-tsd-source": "/src/routes/admin.tsx:172:13"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full rounded-full shadow-glow",
							disabled: busy,
							"data-tsd-source": "/src/routes/admin.tsx:183:11",
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "size-4 animate-spin",
								"data-tsd-source": "/src/routes/admin.tsx:184:21"
							}) : "Enter admin portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full rounded-full",
							disabled: busy,
							onClick: createOwner,
							"data-tsd-source": "/src/routes/admin.tsx:186:11",
							children: "First time? Create the owner account"
						})
					]
				})
			]
		})]
	});
}
function AdminRoute() {
	const qc = useQueryClient();
	const checkAdmin = useServerFn(getIsAdmin);
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	useQuery({
		queryKey: ["admin-session"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			setSignedIn(Boolean(data.user));
			return { user: Boolean(data.user) };
		}
	});
	const { data: role, isLoading: roleLoading } = useQuery({
		queryKey: ["is-admin"],
		queryFn: () => checkAdmin(),
		enabled: signedIn === true,
		retry: false
	});
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		setSignedIn(false);
	}
	if (signedIn === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		"data-tsd-source": "/src/routes/admin.tsx:231:7",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-24",
			"data-tsd-source": "/src/routes/admin.tsx:232:9",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "size-6 animate-spin text-primary",
				"data-tsd-source": "/src/routes/admin.tsx:233:11"
			})
		})
	});
	if (signedIn === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSignIn, {
		onSignedIn: async () => {
			setSignedIn(true);
			await qc.invalidateQueries();
		},
		"data-tsd-source": "/src/routes/admin.tsx:241:7"
	});
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		"data-tsd-source": "/src/routes/admin.tsx:252:7",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-24",
			"data-tsd-source": "/src/routes/admin.tsx:253:9",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "size-6 animate-spin text-primary",
				"data-tsd-source": "/src/routes/admin.tsx:254:11"
			})
		})
	});
	if (!role?.admin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		"data-tsd-source": "/src/routes/admin.tsx:262:7",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mx-auto max-w-md p-10 text-center",
			"data-tsd-source": "/src/routes/admin.tsx:263:9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted",
					"data-tsd-source": "/src/routes/admin.tsx:264:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
						className: "size-6 text-muted-foreground",
						"data-tsd-source": "/src/routes/admin.tsx:265:13"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 font-display text-xl font-bold",
					"data-tsd-source": "/src/routes/admin.tsx:267:11",
					children: "Owner access only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					"data-tsd-source": "/src/routes/admin.tsx:268:11",
					children: "This portal is limited to Codevanta Ventures administrators. Sign out and use the owner account."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {
		onSignOut: signOut,
		"data-tsd-source": "/src/routes/admin.tsx:278:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, { "data-tsd-source": "/src/routes/admin.tsx:279:7" })
	});
}
function AdminDashboard() {
	const qc = useQueryClient();
	const fetchOverview = useServerFn(getAdminOverview);
	const fetchVouchers = useServerFn(listVouchers);
	const addVoucher = useServerFn(createVoucher);
	const toggleVoucher = useServerFn(setVoucherActive);
	const removeVoucher = useServerFn(deleteVoucher);
	const extend = useServerFn(grantAccess);
	const [code, setCode] = (0, import_react.useState)(randomCode);
	const [months, setMonths] = (0, import_react.useState)("1");
	const [maxUses, setMaxUses] = (0, import_react.useState)("1");
	const [expires, setExpires] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: ["admin-overview"],
		queryFn: () => fetchOverview()
	});
	const { data: vouchers } = useQuery({
		queryKey: ["admin-vouchers"],
		queryFn: () => fetchVouchers()
	});
	const create = useMutation({
		mutationFn: () => addVoucher({ data: {
			code,
			months: Number(months) || 1,
			max_uses: Number(maxUses) || 1,
			expires_at: expires || null,
			note: note || null
		} }),
		onSuccess: async () => {
			toast.success(`Voucher ${code.toUpperCase()} created`);
			setCode(randomCode());
			setNote("");
			setExpires("");
			await qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create voucher")
	});
	const toggle = useMutation({
		mutationFn: (v) => toggleVoucher({ data: v }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vouchers"] })
	});
	const del = useMutation({
		mutationFn: (id) => removeVoucher({ data: { id } }),
		onSuccess: () => {
			toast.success("Voucher deleted");
			qc.invalidateQueries({ queryKey: ["admin-vouchers"] });
		}
	});
	const grant = useMutation({
		mutationFn: (v) => extend({ data: v }),
		onSuccess: (res) => {
			toast.success(`Access extended to ${shortDate(res.endsAt)}`);
			qc.invalidateQueries({ queryKey: ["admin-overview"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not extend access")
	});
	const stats = data?.stats;
	const cards = [
		{
			label: "Landlords",
			value: stats?.landlords ?? 0,
			icon: Users
		},
		{
			label: "Paying",
			value: stats?.paying ?? 0,
			icon: BadgeCheck
		},
		{
			label: "On trial",
			value: stats?.onTrial ?? 0,
			icon: CalendarClock
		},
		{
			label: "Expired",
			value: stats?.expired ?? 0,
			icon: ShieldAlert
		},
		{
			label: "Subscription revenue",
			value: money(stats?.revenue ?? 0),
			icon: TrendingUp
		},
		{
			label: "Properties",
			value: stats?.properties ?? 0,
			icon: Building2
		},
		{
			label: "Tenants",
			value: stats?.tenants ?? 0,
			icon: Users
		},
		{
			label: "Rent tracked",
			value: money(stats?.rentTracked ?? 0),
			icon: TrendingUp
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		"data-tsd-source": "/src/routes/admin.tsx:359:5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			"data-tsd-source": "/src/routes/admin.tsx:360:7",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				"data-tsd-source": "/src/routes/admin.tsx:362:11",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					"data-tsd-source": "/src/routes/admin.tsx:363:13",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						"data-tsd-source": "/src/routes/admin.tsx:364:15",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
						className: "size-4 text-primary",
						"data-tsd-source": "/src/routes/admin.tsx:365:15"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-bold",
					"data-tsd-source": "/src/routes/admin.tsx:367:13",
					children: c.value
				})]
			}, c.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "landlords",
			"data-tsd-source": "/src/routes/admin.tsx:372:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					"data-tsd-source": "/src/routes/admin.tsx:373:9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "landlords",
							"data-tsd-source": "/src/routes/admin.tsx:374:11",
							children: "Landlords"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "vouchers",
							"data-tsd-source": "/src/routes/admin.tsx:375:11",
							children: "Voucher codes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "payments",
							"data-tsd-source": "/src/routes/admin.tsx:376:11",
							children: "Payments"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "landlords",
					className: "mt-5",
					"data-tsd-source": "/src/routes/admin.tsx:379:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card overflow-x-auto p-5",
						"data-tsd-source": "/src/routes/admin.tsx:380:11",
						children: data?.landlords.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[900px] text-sm",
							"data-tsd-source": "/src/routes/admin.tsx:382:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs uppercase text-muted-foreground",
								"data-tsd-source": "/src/routes/admin.tsx:383:17",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									"data-tsd-source": "/src/routes/admin.tsx:384:19",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:385:21",
											children: "Account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:386:21",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:387:21",
											children: "Plan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:388:21",
											children: "Access until"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:389:21",
											children: "Portfolio"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:390:21",
											children: "Rent tracked"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3 text-right",
											"data-tsd-source": "/src/routes/admin.tsx:391:21",
											children: "Grant"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								"data-tsd-source": "/src/routes/admin.tsx:394:17",
								children: data.landlords.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									"data-tsd-source": "/src/routes/admin.tsx:396:21",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:397:23",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium",
													"data-tsd-source": "/src/routes/admin.tsx:398:25",
													children: l.full_name ?? l.email
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													"data-tsd-source": "/src/routes/admin.tsx:399:25",
													children: l.email
												}),
												l.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													"data-tsd-source": "/src/routes/admin.tsx:401:27",
													children: l.phone
												}) : null
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:404:23",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${stateStyles[l.state]}`,
												"data-tsd-source": "/src/routes/admin.tsx:405:25",
												children: l.state
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 capitalize",
											"data-tsd-source": "/src/routes/admin.tsx:411:23",
											children: l.plan
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:412:23",
											children: shortDate(l.endsAt)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 text-muted-foreground",
											"data-tsd-source": "/src/routes/admin.tsx:413:23",
											children: [
												l.properties,
												" props · ",
												l.tenants,
												" tenants"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:416:23",
											children: money(l.rentCollected)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 text-right",
											"data-tsd-source": "/src/routes/admin.tsx:417:23",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "inline-flex gap-1.5",
												"data-tsd-source": "/src/routes/admin.tsx:418:25",
												children: [1, 12].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "rounded-full",
													disabled: grant.isPending,
													onClick: () => grant.mutate({
														userId: l.id,
														months: m
													}),
													"data-tsd-source": "/src/routes/admin.tsx:420:29",
													children: [
														"+",
														m,
														"m"
													]
												}, m))
											})
										})
									]
								}, l.id))
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No landlord accounts yet",
							"data-tsd-source": "/src/routes/admin.tsx:438:15"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "vouchers",
					className: "mt-5",
					"data-tsd-source": "/src/routes/admin.tsx:443:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]",
						"data-tsd-source": "/src/routes/admin.tsx:444:11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-6",
							"data-tsd-source": "/src/routes/admin.tsx:445:13",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-2 font-display text-base font-bold",
								"data-tsd-source": "/src/routes/admin.tsx:446:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
									className: "size-4 text-primary",
									"data-tsd-source": "/src/routes/admin.tsx:447:17"
								}), " Create a voucher"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 space-y-4",
								"data-tsd-source": "/src/routes/admin.tsx:449:15",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Code",
										htmlFor: "code",
										"data-tsd-source": "/src/routes/admin.tsx:450:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											"data-tsd-source": "/src/routes/admin.tsx:451:19",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "code",
												value: code,
												onChange: (e) => setCode(e.target.value.toUpperCase()),
												className: "font-mono",
												"data-tsd-source": "/src/routes/admin.tsx:452:21"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												onClick: () => setCode(randomCode()),
												"data-tsd-source": "/src/routes/admin.tsx:458:21",
												children: "New"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										"data-tsd-source": "/src/routes/admin.tsx:463:17",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Free months",
											htmlFor: "months",
											"data-tsd-source": "/src/routes/admin.tsx:464:19",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "months",
												type: "number",
												min: 1,
												value: months,
												onChange: (e) => setMonths(e.target.value),
												"data-tsd-source": "/src/routes/admin.tsx:465:21"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Max uses",
											htmlFor: "uses",
											"data-tsd-source": "/src/routes/admin.tsx:473:19",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "uses",
												type: "number",
												min: 1,
												value: maxUses,
												onChange: (e) => setMaxUses(e.target.value),
												"data-tsd-source": "/src/routes/admin.tsx:474:21"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Expires (optional)",
										htmlFor: "expires",
										"data-tsd-source": "/src/routes/admin.tsx:483:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "expires",
											type: "date",
											value: expires,
											onChange: (e) => setExpires(e.target.value),
											"data-tsd-source": "/src/routes/admin.tsx:484:19"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Note (optional)",
										htmlFor: "note",
										"data-tsd-source": "/src/routes/admin.tsx:491:17",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "note",
											value: note,
											onChange: (e) => setNote(e.target.value),
											placeholder: "Promo for Nakuru landlords",
											"data-tsd-source": "/src/routes/admin.tsx:492:19"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full rounded-full shadow-glow",
										disabled: create.isPending,
										onClick: () => create.mutate(),
										"data-tsd-source": "/src/routes/admin.tsx:499:17",
										children: create.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											className: "size-4 animate-spin",
											"data-tsd-source": "/src/routes/admin.tsx:505:21"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
											className: "size-4",
											"data-tsd-source": "/src/routes/admin.tsx:508:23"
										}), " Create voucher"] })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card overflow-x-auto p-5",
							"data-tsd-source": "/src/routes/admin.tsx:515:13",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 font-display text-base font-bold",
									"data-tsd-source": "/src/routes/admin.tsx:516:15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
										className: "size-4 text-primary",
										"data-tsd-source": "/src/routes/admin.tsx:517:17"
									}), " Vouchers"]
								}),
								vouchers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "mt-4 w-full min-w-[620px] text-sm",
									"data-tsd-source": "/src/routes/admin.tsx:520:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-left text-xs uppercase text-muted-foreground",
										"data-tsd-source": "/src/routes/admin.tsx:521:19",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											"data-tsd-source": "/src/routes/admin.tsx:522:21",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3",
													"data-tsd-source": "/src/routes/admin.tsx:523:23",
													children: "Code"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3",
													"data-tsd-source": "/src/routes/admin.tsx:524:23",
													children: "Months"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3",
													"data-tsd-source": "/src/routes/admin.tsx:525:23",
													children: "Used"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3",
													"data-tsd-source": "/src/routes/admin.tsx:526:23",
													children: "Expires"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3",
													"data-tsd-source": "/src/routes/admin.tsx:527:23",
													children: "Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "pb-3 text-right",
													"data-tsd-source": "/src/routes/admin.tsx:528:23",
													children: "Actions"
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										"data-tsd-source": "/src/routes/admin.tsx:531:19",
										children: vouchers.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-t border-border",
											"data-tsd-source": "/src/routes/admin.tsx:533:23",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3",
													"data-tsd-source": "/src/routes/admin.tsx:534:25",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														className: "inline-flex items-center gap-1.5 font-mono font-semibold hover:text-primary",
														onClick: () => {
															navigator.clipboard.writeText(v.code);
															toast.success("Code copied");
														},
														"data-tsd-source": "/src/routes/admin.tsx:535:27",
														children: [
															v.code,
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
																className: "size-3.5",
																"data-tsd-source": "/src/routes/admin.tsx:542:38"
															})
														]
													}), v.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														"data-tsd-source": "/src/routes/admin.tsx:545:29",
														children: v.note
													}) : null]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3",
													"data-tsd-source": "/src/routes/admin.tsx:548:25",
													children: v.months
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3",
													"data-tsd-source": "/src/routes/admin.tsx:549:25",
													children: [
														v.used_count,
														"/",
														v.max_uses
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3",
													"data-tsd-source": "/src/routes/admin.tsx:552:25",
													children: v.expires_at ? shortDate(v.expires_at) : "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3",
													"data-tsd-source": "/src/routes/admin.tsx:553:25",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${v.active && v.used_count < v.max_uses ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
														"data-tsd-source": "/src/routes/admin.tsx:554:27",
														children: v.active ? v.used_count < v.max_uses ? "Active" : "Used up" : "Paused"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 text-right",
													"data-tsd-source": "/src/routes/admin.tsx:568:25",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "inline-flex gap-1",
														"data-tsd-source": "/src/routes/admin.tsx:569:27",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															"aria-label": "Toggle voucher",
															onClick: () => toggle.mutate({
																id: v.id,
																active: !v.active
															}),
															"data-tsd-source": "/src/routes/admin.tsx:570:29",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, {
																className: "size-4",
																"data-tsd-source": "/src/routes/admin.tsx:576:31"
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															"aria-label": "Delete voucher",
															onClick: () => del.mutate(v.id),
															"data-tsd-source": "/src/routes/admin.tsx:578:29",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
																className: "size-4 text-destructive",
																"data-tsd-source": "/src/routes/admin.tsx:584:31"
															})
														})]
													})
												})
											]
										}, v.id))
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									"data-tsd-source": "/src/routes/admin.tsx:593:17",
									children: "No vouchers yet — create one to give a landlord free months."
								}),
								data?.redemptions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									"data-tsd-source": "/src/routes/admin.tsx:599:17",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-semibold uppercase text-muted-foreground",
										"data-tsd-source": "/src/routes/admin.tsx:600:19",
										children: "Recent redemptions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-2 text-sm",
										"data-tsd-source": "/src/routes/admin.tsx:603:19",
										children: data.redemptions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between border-t border-border pt-2",
											"data-tsd-source": "/src/routes/admin.tsx:605:23",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"data-tsd-source": "/src/routes/admin.tsx:606:25",
												children: r.email
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												"data-tsd-source": "/src/routes/admin.tsx:607:25",
												children: [
													r.months,
													" month",
													r.months === 1 ? "" : "s",
													" · ",
													shortDate(r.created_at)
												]
											})]
										}, r.id))
									})]
								}) : null
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "payments",
					className: "mt-5",
					"data-tsd-source": "/src/routes/admin.tsx:619:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card overflow-x-auto p-5",
						"data-tsd-source": "/src/routes/admin.tsx:620:11",
						children: data?.payments.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[700px] text-sm",
							"data-tsd-source": "/src/routes/admin.tsx:622:15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs uppercase text-muted-foreground",
								"data-tsd-source": "/src/routes/admin.tsx:623:17",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									"data-tsd-source": "/src/routes/admin.tsx:624:19",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:625:21",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:626:21",
											children: "Account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:627:21",
											children: "Plan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:628:21",
											children: "Amount"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:629:21",
											children: "Reference"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											"data-tsd-source": "/src/routes/admin.tsx:630:21",
											children: "Status"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								"data-tsd-source": "/src/routes/admin.tsx:633:17",
								children: data.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									"data-tsd-source": "/src/routes/admin.tsx:635:21",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:636:23",
											children: shortDate(p.paid_at ?? p.created_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:637:23",
											children: p.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 capitalize",
											"data-tsd-source": "/src/routes/admin.tsx:638:23",
											children: p.plan
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											"data-tsd-source": "/src/routes/admin.tsx:639:23",
											children: money(p.amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 font-mono text-xs text-muted-foreground",
											"data-tsd-source": "/src/routes/admin.tsx:640:23",
											children: p.reference
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 capitalize",
											"data-tsd-source": "/src/routes/admin.tsx:643:23",
											children: p.status
										})
									]
								}, p.id))
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No subscription payments yet",
							"data-tsd-source": "/src/routes/admin.tsx:649:15"
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { AdminRoute as component };
