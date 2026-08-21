import { n as createServerFn } from "./server-nGs_oUjZ.mjs";
import { c as stringType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-CkaZFi_R.mjs";
import { i as portalVerifySchema, r as portalRequestSchema } from "./schemas-DUPaCA9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.functions-BumvHKNf.js
var verifyTenant_createServerFn_handler = createServerRpc({
	id: "34b2823a7788c6e0663cd40d132c5925e890896eda041c87f8bae710cfb0f66d",
	name: "verifyTenant",
	filename: "src/lib/portal.functions.ts"
}, (opts) => verifyTenant.__executeServer(opts));
var verifyTenant = createServerFn({ method: "POST" }).inputValidator((data) => portalVerifySchema.parse(data)).handler(verifyTenant_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: property } = await supabaseAdmin.from("properties").select("id,name,code,address,landlord_id").eq("code", data.code.toUpperCase()).maybeSingle();
	if (!property) return {
		ok: false,
		error: "No property found with that code."
	};
	const digits = data.phone.replace(/\D/g, "").slice(-9);
	const { data: tenants } = await supabaseAdmin.from("tenants").select("*, units(unit_number,room_number,floor,rent,deposit)").eq("property_id", property.id);
	const tenant = (tenants ?? []).find((t) => {
		const phoneMatch = t.phone.replace(/\D/g, "").endsWith(digits);
		const room = (t.units?.room_number ?? t.units?.unit_number ?? "").toLowerCase();
		return phoneMatch && room === data.room.trim().toLowerCase();
	});
	if (!tenant) return {
		ok: false,
		error: "We could not match that room number and phone number."
	};
	const [payments, receipts, announcements, requests, leases] = await Promise.all([
		supabaseAdmin.from("payments").select("id,amount,method,reference,paid_at,period_label,status").eq("tenant_id", tenant.id).order("paid_at", { ascending: false }),
		supabaseAdmin.from("receipts").select("id,receipt_number,public_id,amount,balance,issued_at").eq("tenant_id", tenant.id).order("issued_at", { ascending: false }),
		supabaseAdmin.from("announcements").select("id,title,body,category,created_at").eq("landlord_id", property.landlord_id).order("created_at", { ascending: false }).limit(10),
		supabaseAdmin.from("maintenance_requests").select("id,category,description,priority,status,created_at").eq("tenant_id", tenant.id).order("created_at", { ascending: false }),
		supabaseAdmin.from("leases").select("id,document_url,start_date,end_date,status").eq("tenant_id", tenant.id)
	]);
	const paid = (payments.data ?? []).reduce((s, p) => s + Number(p.amount), 0);
	return {
		ok: true,
		tenant: {
			id: tenant.id,
			full_name: tenant.full_name,
			phone: tenant.phone,
			email: tenant.email,
			photo_url: tenant.photo_url,
			occupation: tenant.occupation,
			lease_start: tenant.lease_start,
			lease_end: tenant.lease_end,
			rent_amount: Number(tenant.rent_amount),
			deposit_paid: Number(tenant.deposit_paid),
			status: tenant.status,
			unit: tenant.units?.unit_number ?? null,
			room: tenant.units?.room_number ?? null,
			floor: tenant.units?.floor ?? null
		},
		property: {
			name: property.name,
			code: property.code,
			address: property.address
		},
		payments: payments.data ?? [],
		receipts: receipts.data ?? [],
		announcements: announcements.data ?? [],
		requests: requests.data ?? [],
		leases: leases.data ?? [],
		totals: {
			paid,
			outstanding: Math.max(Number(tenant.rent_amount) - paid, 0)
		}
	};
});
var submitTenantRequest_createServerFn_handler = createServerRpc({
	id: "e3f1dfb3eae53c515c697f83f59d0cc9f0f4c4a20ec3ef23565698487e13d139",
	name: "submitTenantRequest",
	filename: "src/lib/portal.functions.ts"
}, (opts) => submitTenantRequest.__executeServer(opts));
var submitTenantRequest = createServerFn({ method: "POST" }).inputValidator((data) => portalRequestSchema.parse(data)).handler(submitTenantRequest_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: property } = await supabaseAdmin.from("properties").select("id,landlord_id").eq("code", data.code.toUpperCase()).maybeSingle();
	if (!property) return {
		ok: false,
		error: "Property not found."
	};
	const digits = data.phone.replace(/\D/g, "").slice(-9);
	const { data: tenants } = await supabaseAdmin.from("tenants").select("id,phone,unit_id,units(unit_number,room_number)").eq("property_id", property.id);
	const tenant = (tenants ?? []).find((t) => {
		const room = (t.units?.room_number ?? t.units?.unit_number ?? "").toLowerCase();
		return t.phone.replace(/\D/g, "").endsWith(digits) && room === data.room.trim().toLowerCase();
	});
	if (!tenant) return {
		ok: false,
		error: "Verification failed."
	};
	const { error } = await supabaseAdmin.from("maintenance_requests").insert({
		landlord_id: property.landlord_id,
		tenant_id: tenant.id,
		property_id: property.id,
		unit_id: tenant.unit_id,
		category: data.category,
		description: data.description,
		priority: data.priority
	});
	if (error) return {
		ok: false,
		error: "Could not submit request."
	};
	await supabaseAdmin.from("notifications").insert({
		landlord_id: property.landlord_id,
		title: "New maintenance request",
		body: data.description.slice(0, 140),
		type: "maintenance"
	});
	return { ok: true };
});
var getPublicReceipt_createServerFn_handler = createServerRpc({
	id: "78e0315fff7704c5140a10579a29ba2a282bb272049ced9768a89853c7188a38",
	name: "getPublicReceipt",
	filename: "src/lib/portal.functions.ts"
}, (opts) => getPublicReceipt.__executeServer(opts));
var getPublicReceipt = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ publicId: stringType().trim().min(6).max(64) }).parse(data)).handler(getPublicReceipt_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: receipt } = await supabaseAdmin.from("receipts").select("receipt_number,public_id,amount,balance,issued_by,issued_at,snapshot").eq("public_id", data.publicId).maybeSingle();
	if (!receipt) return { ok: false };
	return {
		ok: true,
		receipt
	};
});
//#endregion
export { getPublicReceipt_createServerFn_handler, submitTenantRequest_createServerFn_handler, verifyTenant_createServerFn_handler };
