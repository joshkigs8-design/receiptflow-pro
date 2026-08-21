import { n as createServerFn } from "./server-C59uwSUn.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BsT40ITu.mjs";
import { c as stringType, i as enumType, r as coerce, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-EZ_mDzyQ.mjs";
import { a as propertySchema, c as unitSchema, n as paymentSchema, o as settingsSchema, s as tenantSchema, t as announcementSchema } from "./schemas-DUPaCA9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.functions-D3SMLf40.js
/** Replaces undefined values with null so Postgres payloads stay well typed. */
function clean(obj) {
	const out = {};
	for (const [key, value] of Object.entries(obj)) out[key] = value === void 0 ? null : value;
	return out;
}
var getSettings_createServerFn_handler = createServerRpc({
	id: "c451e54a9d2ab97753c2c74f857230c04311a69b1d08e273506d09d1891833f5",
	name: "getSettings",
	filename: "src/lib/app.functions.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getSettings_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle();
	if (error) throw error;
	return data;
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "5487d7ed4fa27016c4a5375b56a35f0724412287133d6cf4a9b6c7b47cfef4de",
	name: "saveSettings",
	filename: "src/lib/app.functions.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => settingsSchema.parse(data)).handler(saveSettings_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("profiles").update(clean(data)).eq("id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "d1b118821565a072a8272f3ff225b6ed85fb49c5888b71420f125d78a5e3e1e2",
	name: "getDashboard",
	filename: "src/lib/app.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sb = context.supabase;
	const mine = context.userId;
	const [properties, units, tenants, payments, receipts, requests, notifications] = await Promise.all([
		sb.from("properties").select("id,name,code,status,units_count,image_url,property_type").eq("landlord_id", mine),
		sb.from("units").select("id,status,rent,property_id").eq("landlord_id", mine),
		sb.from("tenants").select("id,full_name,rent_amount,status,lease_end,unit_id,property_id").eq("landlord_id", mine),
		sb.from("payments").select("id,amount,paid_at,method,status,tenant_id").eq("landlord_id", mine).order("paid_at", { ascending: false }),
		sb.from("receipts").select("id,receipt_number,public_id,amount,issued_at,tenant_id").eq("landlord_id", mine).order("issued_at", { ascending: false }).limit(6),
		sb.from("maintenance_requests").select("id,status,category,priority,created_at,description").eq("landlord_id", mine),
		sb.from("notifications").select("*").eq("landlord_id", mine).order("created_at", { ascending: false }).limit(8)
	]);
	const unitRows = units.data ?? [];
	const tenantRows = tenants.data ?? [];
	const paymentRows = payments.data ?? [];
	const now = /* @__PURE__ */ new Date();
	const monthKey = now.toISOString().slice(0, 7);
	const monthlyIncome = paymentRows.filter((p) => (p.paid_at ?? "").startsWith(monthKey)).reduce((s, p) => s + Number(p.amount), 0);
	const expectedMonthly = tenantRows.filter((t) => t.status === "active").reduce((s, t) => s + Number(t.rent_amount), 0);
	const revenueByMonth = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = d.toISOString().slice(0, 7);
		revenueByMonth.push({
			month: d.toLocaleDateString("en-GB", { month: "short" }),
			income: paymentRows.filter((p) => (p.paid_at ?? "").startsWith(key)).reduce((s, p) => s + Number(p.amount), 0)
		});
	}
	const soon = new Date(now.getTime() + 5184e6).toISOString().slice(0, 10);
	return {
		properties: properties.data ?? [],
		totals: {
			properties: (properties.data ?? []).length,
			units: unitRows.length,
			occupied: unitRows.filter((u) => u.status === "occupied").length,
			vacant: unitRows.filter((u) => u.status !== "occupied").length,
			tenants: tenantRows.length,
			monthlyIncome,
			expectedMonthly,
			outstanding: Math.max(expectedMonthly - monthlyIncome, 0),
			receipts: (receipts.data ?? []).length,
			openRequests: (requests.data ?? []).filter((r) => r.status !== "resolved").length
		},
		revenueByMonth,
		recentPayments: paymentRows.slice(0, 6),
		recentReceipts: receipts.data ?? [],
		requests: requests.data ?? [],
		notifications: notifications.data ?? [],
		expiringLeases: tenantRows.filter((t) => t.lease_end && t.lease_end <= soon),
		tenants: tenantRows
	};
});
var listProperties_createServerFn_handler = createServerRpc({
	id: "5b8a25bae5676e90b8cd8a48918ab2013bfc20b84d1953fc7e200cab835c57c8",
	name: "listProperties",
	filename: "src/lib/app.functions.ts"
}, (opts) => listProperties.__executeServer(opts));
var listProperties = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listProperties_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("properties").select("*, units(id,status,rent)").eq("landlord_id", context.userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data;
});
var saveProperty_createServerFn_handler = createServerRpc({
	id: "759d823327e0d1379330ea78c0aa0ecbc4b4a623e2cd308ba6660e730ff9b4c4",
	name: "saveProperty",
	filename: "src/lib/app.functions.ts"
}, (opts) => saveProperty.__executeServer(opts));
var saveProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => propertySchema.parse(data)).handler(saveProperty_createServerFn_handler, async ({ data, context }) => {
	const { id, ...rest } = data;
	const payload = clean({
		...rest,
		code: rest.code.toUpperCase(),
		landlord_id: context.userId
	});
	const { error } = await (id ? context.supabase.from("properties").update(payload).eq("id", id).eq("landlord_id", context.userId) : context.supabase.from("properties").insert(payload));
	if (error) throw error;
	return { ok: true };
});
var deleteProperty_createServerFn_handler = createServerRpc({
	id: "2f6b0943266923933b1a56abfae9fc738b87e99cf1fcf119029f7e7c65ab9790",
	name: "deleteProperty",
	filename: "src/lib/app.functions.ts"
}, (opts) => deleteProperty.__executeServer(opts));
var deleteProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteProperty_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("properties").delete().eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var listUnits_createServerFn_handler = createServerRpc({
	id: "290ba7a69eb68e1b2e3bf73ccdb9452a534c177c98821eead0dc923f7a9e7080",
	name: "listUnits",
	filename: "src/lib/app.functions.ts"
}, (opts) => listUnits.__executeServer(opts));
var listUnits = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ propertyId: stringType().uuid().optional() }).parse(data ?? {})).handler(listUnits_createServerFn_handler, async ({ data, context }) => {
	let query = context.supabase.from("units").select("*, tenants(id,full_name,phone)").eq("landlord_id", context.userId).order("unit_number");
	if (data.propertyId) query = query.eq("property_id", data.propertyId);
	const { data: rows, error } = await query;
	if (error) throw error;
	return rows;
});
var saveUnit_createServerFn_handler = createServerRpc({
	id: "fe23efd2522d389f72aeb49c1a78a584c847a7921764ba4c45506bb2ade95a31",
	name: "saveUnit",
	filename: "src/lib/app.functions.ts"
}, (opts) => saveUnit.__executeServer(opts));
var saveUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => unitSchema.parse(data)).handler(saveUnit_createServerFn_handler, async ({ data, context }) => {
	const { id, ...rest } = data;
	const payload = clean({
		...rest,
		landlord_id: context.userId
	});
	const { error } = id ? await context.supabase.from("units").update(payload).eq("id", id).eq("landlord_id", context.userId) : await context.supabase.from("units").insert(payload);
	if (error) throw error;
	return { ok: true };
});
var deleteUnit_createServerFn_handler = createServerRpc({
	id: "241b3d16261a8d77f387f8e5b4a961f3463f871c29c6a56a3384afb66d5c52ab",
	name: "deleteUnit",
	filename: "src/lib/app.functions.ts"
}, (opts) => deleteUnit.__executeServer(opts));
var deleteUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteUnit_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("units").delete().eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var listTenants_createServerFn_handler = createServerRpc({
	id: "ecb6539f444664f98a1e97dcf6c7a71945f57b545701f90a18a47097aff00677",
	name: "listTenants",
	filename: "src/lib/app.functions.ts"
}, (opts) => listTenants.__executeServer(opts));
var listTenants = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listTenants_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("tenants").select("*, properties(name,code), units(unit_number,room_number)").eq("landlord_id", context.userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data;
});
var saveTenant_createServerFn_handler = createServerRpc({
	id: "669402d1503873ad5760e13f8cf6e942466a7cf0bb682c0aff70fd5970411697",
	name: "saveTenant",
	filename: "src/lib/app.functions.ts"
}, (opts) => saveTenant.__executeServer(opts));
var saveTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => tenantSchema.parse(data)).handler(saveTenant_createServerFn_handler, async ({ data, context }) => {
	const { id, ...rest } = data;
	const payload = clean({
		...rest,
		email: rest.email || null,
		lease_start: rest.lease_start || null,
		lease_end: rest.lease_end || null,
		landlord_id: context.userId
	});
	const { error } = id ? await context.supabase.from("tenants").update(payload).eq("id", id).eq("landlord_id", context.userId) : await context.supabase.from("tenants").insert(payload);
	if (error) throw error;
	if (rest.unit_id) await context.supabase.from("units").update({ status: "occupied" }).eq("id", rest.unit_id).eq("landlord_id", context.userId);
	return { ok: true };
});
var deleteTenant_createServerFn_handler = createServerRpc({
	id: "234d49972d75ebb9a80c704625a1cd82be249f8d02ac5dbaa38e61fcc5c731d9",
	name: "deleteTenant",
	filename: "src/lib/app.functions.ts"
}, (opts) => deleteTenant.__executeServer(opts));
var deleteTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteTenant_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("tenants").delete().eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var listPayments_createServerFn_handler = createServerRpc({
	id: "8237a64b6fb844fc7443ae575d9ce00c365c3651a5cb3bc54224c0a5f304e638",
	name: "listPayments",
	filename: "src/lib/app.functions.ts"
}, (opts) => listPayments.__executeServer(opts));
var listPayments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listPayments_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("payments").select("*, tenants(full_name,phone,rent_amount), properties(name), units(unit_number,room_number), receipts(id,receipt_number,public_id)").eq("landlord_id", context.userId).order("paid_at", { ascending: false });
	if (error) throw error;
	return data;
});
var recordPayment_createServerFn_handler = createServerRpc({
	id: "495504ec31c4f24cb7a01f41486baa51be718df0cf7567a25269b4267cdc2039",
	name: "recordPayment",
	filename: "src/lib/app.functions.ts"
}, (opts) => recordPayment.__executeServer(opts));
var recordPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => paymentSchema.parse(data)).handler(recordPayment_createServerFn_handler, async ({ data, context }) => {
	const sb = context.supabase;
	const { data: tenant, error: tenantError } = await sb.from("tenants").select("*, properties(name,code), units(unit_number,room_number)").eq("id", data.tenant_id).eq("landlord_id", context.userId).single();
	if (tenantError) throw tenantError;
	const period = data.period_label || data.paid_at.slice(0, 7);
	const { data: existing } = await sb.from("payments").select("amount").eq("tenant_id", tenant.id).eq("landlord_id", context.userId).eq("period_label", period);
	const paidBefore = (existing ?? []).reduce((s, p) => s + Number(p.amount), 0);
	const balance = Number(tenant.rent_amount) - (paidBefore + data.amount);
	const { data: payment, error } = await sb.from("payments").insert({
		landlord_id: context.userId,
		tenant_id: tenant.id,
		property_id: tenant.property_id,
		unit_id: tenant.unit_id,
		amount: data.amount,
		method: data.method,
		reference: data.reference || null,
		paid_at: data.paid_at,
		period_label: period,
		status: balance > 0 ? "partial" : "paid",
		notes: data.notes || null
	}).select().single();
	if (error) throw error;
	const { data: profile } = await sb.from("profiles").select("company_name,currency,logo_url,phone").eq("id", context.userId).maybeSingle();
	const receiptNumber = `RCP-${data.paid_at.replaceAll("-", "").slice(0, 6)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
	const { data: receipt, error: receiptError } = await sb.from("receipts").insert({
		landlord_id: context.userId,
		payment_id: payment.id,
		tenant_id: tenant.id,
		receipt_number: receiptNumber,
		amount: data.amount,
		balance,
		issued_by: data.issued_by || profile?.company_name || "Codevanta Ventures",
		snapshot: {
			company: profile?.company_name ?? "Codevanta Ventures",
			currency: profile?.currency ?? "KSh",
			logo_url: profile?.logo_url ?? null,
			company_phone: profile?.phone ?? null,
			tenant_name: tenant.full_name,
			tenant_phone: tenant.phone,
			property: tenant.properties?.name ?? null,
			property_code: tenant.properties?.code ?? null,
			unit: tenant.units?.unit_number ?? null,
			room: tenant.units?.room_number ?? null,
			method: data.method,
			reference: data.reference ?? null,
			period,
			paid_at: data.paid_at,
			rent_amount: Number(tenant.rent_amount)
		}
	}).select("id,public_id,receipt_number").single();
	if (receiptError) throw receiptError;
	await sb.from("notifications").insert({
		landlord_id: context.userId,
		title: "Receipt generated",
		body: `${receiptNumber} for ${tenant.full_name}`,
		type: "receipt"
	});
	return {
		publicId: receipt.public_id,
		receiptNumber: receipt.receipt_number,
		balance
	};
});
var listReceipts_createServerFn_handler = createServerRpc({
	id: "239a0a15e853d3ec484d8688d348a657842d9599f5e2cbb97583770e0346caa0",
	name: "listReceipts",
	filename: "src/lib/app.functions.ts"
}, (opts) => listReceipts.__executeServer(opts));
var listReceipts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listReceipts_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("receipts").select("*, tenants(full_name,phone)").eq("landlord_id", context.userId).order("issued_at", { ascending: false });
	if (error) throw error;
	return data;
});
var updatePayment_createServerFn_handler = createServerRpc({
	id: "b28c39fd8891c05a268c7759789c7cdd3f624cf4b859399dcf5190d823450171",
	name: "updatePayment",
	filename: "src/lib/app.functions.ts"
}, (opts) => updatePayment.__executeServer(opts));
var updatePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	amount: coerce.number().positive(),
	method: stringType().min(1).max(40),
	reference: stringType().max(80).optional().nullable(),
	paid_at: stringType().min(4),
	period_label: stringType().max(40).optional().nullable(),
	notes: stringType().max(1e3).optional().nullable()
}).parse(data)).handler(updatePayment_createServerFn_handler, async ({ data, context }) => {
	const sb = context.supabase;
	const { data: payment, error } = await sb.from("payments").update({
		amount: data.amount,
		method: data.method,
		reference: data.reference || null,
		paid_at: data.paid_at,
		period_label: data.period_label || data.paid_at.slice(0, 7),
		notes: data.notes || null
	}).eq("id", data.id).eq("landlord_id", context.userId).select("*, tenants(rent_amount)").single();
	if (error) throw error;
	const { data: receipts } = await sb.from("receipts").select("id,snapshot").eq("payment_id", data.id).eq("landlord_id", context.userId);
	const balance = Number(payment.tenants?.rent_amount ?? 0) - Number(data.amount);
	for (const r of receipts ?? []) {
		const snapshot = {
			...r.snapshot ?? {},
			method: data.method,
			reference: data.reference ?? null,
			period: data.period_label || data.paid_at.slice(0, 7),
			paid_at: data.paid_at
		};
		await sb.from("receipts").update({
			amount: data.amount,
			balance,
			snapshot
		}).eq("id", r.id).eq("landlord_id", context.userId);
	}
	return { ok: true };
});
var deletePayment_createServerFn_handler = createServerRpc({
	id: "b582cc06f0c046ad78eb457809370783ed49186ddfe833feb42daeeb5e557200",
	name: "deletePayment",
	filename: "src/lib/app.functions.ts"
}, (opts) => deletePayment.__executeServer(opts));
var deletePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deletePayment_createServerFn_handler, async ({ data, context }) => {
	await context.supabase.from("receipts").delete().eq("payment_id", data.id).eq("landlord_id", context.userId);
	const { error } = await context.supabase.from("payments").delete().eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var listRequests_createServerFn_handler = createServerRpc({
	id: "4c23af5cdc6874ce7e29fcb8c436c2ec37a90de1cbee1278d1985ee2cf6081c0",
	name: "listRequests",
	filename: "src/lib/app.functions.ts"
}, (opts) => listRequests.__executeServer(opts));
var listRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listRequests_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("maintenance_requests").select("*, tenants(full_name,phone), properties(name), units(unit_number,room_number)").eq("landlord_id", context.userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data;
});
var updateRequestStatus_createServerFn_handler = createServerRpc({
	id: "15b806b7cf6f4bcf86632629ead957c274b475e57ae2dddac283da9e97ff5ea5",
	name: "updateRequestStatus",
	filename: "src/lib/app.functions.ts"
}, (opts) => updateRequestStatus.__executeServer(opts));
var updateRequestStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"open",
		"in_progress",
		"resolved"
	])
}).parse(data)).handler(updateRequestStatus_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("maintenance_requests").update({ status: data.status }).eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var listAnnouncements_createServerFn_handler = createServerRpc({
	id: "998b28c735c1d642c5d5b92637b4d6877a15677f8331e8cfbc97b5c6ddb763be",
	name: "listAnnouncements",
	filename: "src/lib/app.functions.ts"
}, (opts) => listAnnouncements.__executeServer(opts));
var listAnnouncements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAnnouncements_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("announcements").select("*, properties(name)").eq("landlord_id", context.userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data;
});
var saveAnnouncement_createServerFn_handler = createServerRpc({
	id: "bba92786a66d46f9d0c56b08716b67808e96b95733cc15001a237faeb62b18e5",
	name: "saveAnnouncement",
	filename: "src/lib/app.functions.ts"
}, (opts) => saveAnnouncement.__executeServer(opts));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => announcementSchema.parse(data)).handler(saveAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("announcements").insert(clean({
		...data,
		property_id: data.property_id || null,
		landlord_id: context.userId
	}));
	if (error) throw error;
	return { ok: true };
});
var deleteAnnouncement_createServerFn_handler = createServerRpc({
	id: "406e9770249dd0c75efac7d8d13c2918bdb7fa83d159d1784b17db16bf44edbe",
	name: "deleteAnnouncement",
	filename: "src/lib/app.functions.ts"
}, (opts) => deleteAnnouncement.__executeServer(opts));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("announcements").delete().eq("id", data.id).eq("landlord_id", context.userId);
	if (error) throw error;
	return { ok: true };
});
var globalSearch_createServerFn_handler = createServerRpc({
	id: "b244f16c083ff9d8806db70383fc4204d412eb557928b3eafddebc2eab6a75be",
	name: "globalSearch",
	filename: "src/lib/app.functions.ts"
}, (opts) => globalSearch.__executeServer(opts));
var globalSearch = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ term: stringType().trim().min(2).max(80) }).parse(data)).handler(globalSearch_createServerFn_handler, async ({ data, context }) => {
	const sb = context.supabase;
	const like = `%${data.term}%`;
	const mine = context.userId;
	const [tenants, properties, receipts] = await Promise.all([
		sb.from("tenants").select("id,full_name,phone,status").eq("landlord_id", mine).or(`full_name.ilike.${like},phone.ilike.${like},national_id.ilike.${like}`).limit(6),
		sb.from("properties").select("id,name,code").eq("landlord_id", mine).or(`name.ilike.${like},code.ilike.${like}`).limit(6),
		sb.from("receipts").select("id,receipt_number,public_id,amount").eq("landlord_id", mine).ilike("receipt_number", like).limit(6)
	]);
	return {
		tenants: tenants.data ?? [],
		properties: properties.data ?? [],
		receipts: receipts.data ?? []
	};
});
var getReports_createServerFn_handler = createServerRpc({
	id: "a4692c1846b6bceaea30624edbf2d560f8793ad6c4d2fa3b0a67e89e83e83b20",
	name: "getReports",
	filename: "src/lib/app.functions.ts"
}, (opts) => getReports.__executeServer(opts));
var getReports = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getReports_createServerFn_handler, async ({ context }) => {
	const sb = context.supabase;
	const mine = context.userId;
	const [payments, tenants, units] = await Promise.all([
		sb.from("payments").select("amount,paid_at,method,status,tenant_id").eq("landlord_id", mine),
		sb.from("tenants").select("id,full_name,rent_amount,status").eq("landlord_id", mine),
		sb.from("units").select("id,status,rent").eq("landlord_id", mine)
	]);
	return {
		payments: payments.data ?? [],
		tenants: tenants.data ?? [],
		units: units.data ?? []
	};
});
//#endregion
export { deleteAnnouncement_createServerFn_handler, deletePayment_createServerFn_handler, deleteProperty_createServerFn_handler, deleteTenant_createServerFn_handler, deleteUnit_createServerFn_handler, getDashboard_createServerFn_handler, getReports_createServerFn_handler, getSettings_createServerFn_handler, globalSearch_createServerFn_handler, listAnnouncements_createServerFn_handler, listPayments_createServerFn_handler, listProperties_createServerFn_handler, listReceipts_createServerFn_handler, listRequests_createServerFn_handler, listTenants_createServerFn_handler, listUnits_createServerFn_handler, recordPayment_createServerFn_handler, saveAnnouncement_createServerFn_handler, saveProperty_createServerFn_handler, saveSettings_createServerFn_handler, saveTenant_createServerFn_handler, saveUnit_createServerFn_handler, updatePayment_createServerFn_handler, updateRequestStatus_createServerFn_handler };
