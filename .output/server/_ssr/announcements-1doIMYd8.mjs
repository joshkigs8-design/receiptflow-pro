import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Megaphone, o as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { o as shortDate } from "./format-DGi3p9Yo.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as Field, t as EmptyState } from "./Field-Cw-xjAVe.mjs";
import { t as AppShell } from "./AppShell-PG6l2ot8.mjs";
import { _ as saveAnnouncement, d as listProperties, l as listAnnouncements, t as deleteAnnouncement } from "./app.functions-Pj4e3HK0.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-1doIMYd8.js
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
		children: [list.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading announcements…"
		}) : (list.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No announcements yet",
			hint: "Publish a notice and tenants will see it instantly."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: a.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full text-muted-foreground hover:text-destructive",
							"aria-label": `Delete ${a.title}`,
							disabled: removal.isPending,
							onClick: () => removal.mutate(a.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: a.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New announcement" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						mutation.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							htmlFor: "title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								required: true,
								maxLength: 140,
								value: draft.title,
								onChange: (e) => setDraft({
									...draft,
									title: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Message",
							htmlFor: "body",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "body",
								required: true,
								maxLength: 3e3,
								rows: 5,
								value: draft.body,
								onChange: (e) => setDraft({
									...draft,
									body: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Property (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.property_id,
								onValueChange: (v) => setDraft({
									...draft,
									property_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All properties" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: p.name
								}, p.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "rounded-full",
							disabled: mutation.isPending,
							children: "Publish"
						}) })
					]
				})]
			})
		})]
	});
}
//#endregion
export { AnnouncementsPage as component };
