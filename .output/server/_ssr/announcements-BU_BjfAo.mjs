import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useServerFn } from "./createSsrRpc--FJINHQa.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Megaphone, o as Trash2, v as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
import { n as Field, t as EmptyState } from "./Field-D_A5Yyq_.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { f as listProperties, n as deleteAnnouncement, t as AppShell, u as listAnnouncements, v as saveAnnouncement } from "./AppShell-BWAvuJ1R.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-BU_BjfAo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnnouncementsPage() {
	const qc = useQueryClient();
	const fetchAll = useServerFn(listAnnouncements);
	const fetchProperties = useServerFn(listProperties);
	const save = useServerFn(saveAnnouncement);
	const remove = useServerFn(deleteAnnouncement);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({
		title: "",
		body: "",
		category: "general",
		property_id: ""
	});
	const list = useQuery({
		queryKey: ["announcements"],
		queryFn: () => fetchAll()
	});
	const properties = useQuery({
		queryKey: ["properties"],
		queryFn: () => fetchProperties()
	});
	const mutation = useMutation({
		mutationFn: () => save({ data: {
			...draft,
			property_id: draft.property_id || null
		} }),
		onSuccess: () => {
			toast.success("Announcement published");
			setOpen(false);
			setDraft({
				title: "",
				body: "",
				category: "general",
				property_id: ""
			});
			qc.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: (e) => toast.error(e.message || "Could not publish")
	});
	const removal = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Announcement deleted");
			qc.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: (e) => toast.error(e.message || "Could not delete")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Announcements",
		description: "Notices your tenants see in the portal",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			className: "rounded-full shadow-glow",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New notice"]
		}),
		"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:79:5",
		children: [list.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:89:9",
			children: "Loading announcements…"
		}) : (list.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No announcements yet",
			hint: "Publish a notice and tenants will see it instantly.",
			"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:91:9"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:96:9",
			children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card p-5",
				"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:98:13",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:99:15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:100:17",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, {
								className: "size-4 text-primary",
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:101:19"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:102:19",
								children: a.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full text-muted-foreground hover:text-destructive",
							"aria-label": `Delete ${a.title}`,
							disabled: removal.isPending,
							onClick: () => removal.mutate(a.id),
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:104:17",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "size-4",
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:112:19"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:115:15",
						children: a.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:116:15",
						children: [
							a.properties?.name ?? "All properties",
							" · ",
							shortDate(a.created_at)
						]
					})
				]
			}, a.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:124:7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg",
				"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:125:9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:126:11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:127:13",
						children: "New announcement"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						mutation.mutate();
					},
					"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:129:11",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							htmlFor: "title",
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:136:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								required: true,
								maxLength: 140,
								value: draft.title,
								onChange: (e) => setDraft({
									...draft,
									title: e.target.value
								}),
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:137:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Message",
							htmlFor: "body",
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:145:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "body",
								required: true,
								maxLength: 3e3,
								rows: 5,
								value: draft.body,
								onChange: (e) => setDraft({
									...draft,
									body: e.target.value
								}),
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:146:15"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property (optional)",
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:155:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.property_id,
								onValueChange: (v) => setDraft({
									...draft,
									property_id: v
								}),
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:156:15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:160:17",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {
										placeholder: "All properties",
										"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:161:19"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:163:17",
									children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:165:21",
										children: p.name
									}, p.id))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:172:13",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: mutation.isPending,
								"data-tsd-source": "/src/routes/_authenticated/announcements.tsx:173:15",
								children: "Publish"
							})
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { AnnouncementsPage as component };
