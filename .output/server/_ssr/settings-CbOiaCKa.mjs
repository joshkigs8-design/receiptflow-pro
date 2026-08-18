import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as Field } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { b as saveSettings, l as getSettings, t as AppShell } from "./AppShell-BWAvuJ1R.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CbOiaCKa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const qc = useQueryClient();
	const fetchSettings = useServerFn(getSettings);
	const save = useServerFn(saveSettings);
	const { data } = useQuery({
		queryKey: ["settings"],
		queryFn: () => fetchSettings()
	});
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		company_name: "Codevanta Ventures",
		logo_url: "",
		phone: "",
		currency: "KSh",
		business_details: ""
	});
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setForm({
			full_name: data.full_name ?? "",
			company_name: data.company_name ?? "Codevanta Ventures",
			logo_url: data.logo_url ?? "",
			phone: data.phone ?? "",
			currency: data.currency ?? "KSh",
			business_details: data.business_details ?? ""
		});
	}, [data]);
	const mutation = useMutation({
		mutationFn: () => save({ data: form }),
		onSuccess: () => {
			toast.success("Settings saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		},
		onError: (e) => toast.error(e.message || "Could not save settings")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Settings",
		description: "Branding shown on every receipt",
		"data-tsd-source": "/src/routes/_authenticated/settings.tsx:65:5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "surface-card grid max-w-3xl gap-4 p-6 sm:grid-cols-2",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			"data-tsd-source": "/src/routes/_authenticated/settings.tsx:66:7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Your name",
					htmlFor: "fn",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:73:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fn",
						maxLength: 120,
						value: form.full_name,
						onChange: (e) => setForm({
							...form,
							full_name: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:74:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company / brand",
					htmlFor: "cn",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:81:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cn",
						required: true,
						maxLength: 120,
						value: form.company_name,
						onChange: (e) => setForm({
							...form,
							company_name: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:82:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					htmlFor: "ph",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:90:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ph",
						maxLength: 24,
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:91:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Currency",
					htmlFor: "cur",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:98:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cur",
						required: true,
						maxLength: 8,
						value: form.currency,
						onChange: (e) => setForm({
							...form,
							currency: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:99:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Logo URL",
					htmlFor: "logo",
					className: "sm:col-span-2",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:107:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "logo",
						maxLength: 600,
						placeholder: "https://…",
						value: form.logo_url,
						onChange: (e) => setForm({
							...form,
							logo_url: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:108:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Business details (address, KRA PIN…)",
					className: "sm:col-span-2",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:116:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						maxLength: 1e3,
						rows: 4,
						value: form.business_details,
						onChange: (e) => setForm({
							...form,
							business_details: e.target.value
						}),
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:117:11"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					"data-tsd-source": "/src/routes/_authenticated/settings.tsx:124:9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "rounded-full shadow-glow",
						disabled: mutation.isPending,
						"data-tsd-source": "/src/routes/_authenticated/settings.tsx:125:11",
						children: "Save settings"
					})
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
