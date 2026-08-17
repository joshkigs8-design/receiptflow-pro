import { n as createServerFn } from "./server-if63K52G.mjs";
import { c as stringType, n as booleanType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C3-ZJCji.mjs";
import { t as createServerRpc } from "./createServerRpc-MI0T60PL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-BO310Vmm.js
var voucherInput = objectType({
	code: stringType().trim().min(4).max(40),
	months: numberType().int().min(1).max(60),
	max_uses: numberType().int().min(1).max(1e4),
	expires_at: stringType().optional().nullable(),
	note: stringType().max(200).optional().nullable()
});
async function assertAdmin(context) {
	const { data, error } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (error || !data) throw new Error("Forbidden");
}
var getIsAdmin_createServerFn_handler = createServerRpc({
	id: "8ec3a24cdfc816c6a99237bbadf5c75ae0affc14e8a68ec0663a4f7dc5edbfa9",
	name: "getIsAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getIsAdmin.__executeServer(opts));
var getIsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getIsAdmin_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	return { admin: Boolean(data) };
});
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "98193c088815d6bbdd4155ffbad4b125116e51df7ef81d3d6aef43156e028e01",
	name: "getAdminOverview",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const [users, profiles, subs, payments, subPayments, props, tenants, redemptions] = await Promise.all([
		supabaseAdmin.auth.admin.listUsers({
			page: 1,
			perPage: 500
		}),
		supabaseAdmin.from("profiles").select("id,full_name,company_name,phone,created_at"),
		supabaseAdmin.from("subscriptions").select("*"),
		supabaseAdmin.from("payments").select("id,landlord_id,amount,paid_at"),
		supabaseAdmin.from("subscription_payments").select("id,user_id,reference,plan,amount,status,paid_at,created_at").order("created_at", { ascending: false }).limit(50),
		supabaseAdmin.from("properties").select("id,landlord_id"),
		supabaseAdmin.from("tenants").select("id,landlord_id,status"),
		supabaseAdmin.from("voucher_redemptions").select("id,voucher_id,user_id,months,created_at").order("created_at", { ascending: false }).limit(50)
	]);
	const now = Date.now();
	const profileById = new Map((profiles.data ?? []).map((p) => [p.id, p]));
	const subByUser = new Map((subs.data ?? []).map((s) => [s.user_id, s]));
	const landlords = (users.data?.users ?? []).map((u) => {
		const sub = subByUser.get(u.id);
		const trialEnds = sub ? new Date(sub.trial_ends_at).getTime() : 0;
		const paidActive = (sub?.current_period_end ? new Date(sub.current_period_end).getTime() : 0) > now;
		const trialActive = !paidActive && trialEnds > now;
		return {
			id: u.id,
			email: u.email ?? "—",
			created_at: u.created_at,
			last_sign_in_at: u.last_sign_in_at ?? null,
			full_name: profileById.get(u.id)?.full_name ?? null,
			company_name: profileById.get(u.id)?.company_name ?? null,
			phone: profileById.get(u.id)?.phone ?? null,
			plan: sub?.plan ?? "—",
			state: paidActive ? "paid" : trialActive ? "trial" : "expired",
			endsAt: paidActive ? sub?.current_period_end : sub?.trial_ends_at ?? null,
			properties: (props.data ?? []).filter((p) => p.landlord_id === u.id).length,
			tenants: (tenants.data ?? []).filter((t) => t.landlord_id === u.id).length,
			rentCollected: (payments.data ?? []).filter((p) => p.landlord_id === u.id).reduce((s, p) => s + Number(p.amount ?? 0), 0)
		};
	});
	const successful = (subPayments.data ?? []).filter((p) => p.status === "success");
	const emailById = new Map(landlords.map((l) => [l.id, l.email]));
	return {
		stats: {
			landlords: landlords.length,
			paying: landlords.filter((l) => l.state === "paid").length,
			onTrial: landlords.filter((l) => l.state === "trial").length,
			expired: landlords.filter((l) => l.state === "expired").length,
			mrr: successful.filter((p) => p.plan === "monthly").reduce((s, p) => s + Number(p.amount ?? 0), 0),
			revenue: successful.reduce((s, p) => s + Number(p.amount ?? 0), 0),
			properties: (props.data ?? []).length,
			tenants: (tenants.data ?? []).length,
			rentTracked: (payments.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0)
		},
		landlords: landlords.sort((a, b) => a.created_at < b.created_at ? 1 : -1),
		payments: (subPayments.data ?? []).map((p) => ({
			...p,
			email: emailById.get(p.user_id) ?? "—"
		})),
		redemptions: (redemptions.data ?? []).map((r) => ({
			...r,
			email: emailById.get(r.user_id) ?? "—"
		}))
	};
});
var listVouchers_createServerFn_handler = createServerRpc({
	id: "0d9d41873cdb9cb77864a504e2480b1077b0809623ecc3cce7921d31fb33251f",
	name: "listVouchers",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listVouchers.__executeServer(opts));
var listVouchers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listVouchers_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { data, error } = await context.supabase.from("vouchers").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var createVoucher_createServerFn_handler = createServerRpc({
	id: "08f4958d20db10bd41b2c5f20446ce43d86dde22b94b4a146a05057b239a871b",
	name: "createVoucher",
	filename: "src/lib/admin.functions.ts"
}, (opts) => createVoucher.__executeServer(opts));
var createVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => voucherInput.parse(d)).handler(createVoucher_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { error } = await context.supabase.from("vouchers").insert({
		code: data.code.toUpperCase(),
		months: data.months,
		max_uses: data.max_uses,
		expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
		note: data.note ?? null,
		created_by: context.userId
	});
	if (error) throw new Error(error.message.includes("duplicate") ? "That code already exists" : error.message);
	return { ok: true };
});
var setVoucherActive_createServerFn_handler = createServerRpc({
	id: "b98b4156ff19758fc838b6cff18a0372feda9e5dd73de3d2f813fd7c8145e2eb",
	name: "setVoucherActive",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setVoucherActive.__executeServer(opts));
var setVoucherActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	active: booleanType()
}).parse(d)).handler(setVoucherActive_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { error } = await context.supabase.from("vouchers").update({ active: data.active }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteVoucher_createServerFn_handler = createServerRpc({
	id: "ee89dd767c08fa82b56745e5421817bcaa0ac7056f98de734615535e1405e6cf",
	name: "deleteVoucher",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteVoucher.__executeServer(opts));
var deleteVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteVoucher_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { error } = await context.supabase.from("vouchers").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var grantAccess_createServerFn_handler = createServerRpc({
	id: "7315e64b7b705826508942d72c2c637e2806b87b499a8ee29a491c3bfed2450b",
	name: "grantAccess",
	filename: "src/lib/admin.functions.ts"
}, (opts) => grantAccess.__executeServer(opts));
var grantAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().uuid(),
	months: numberType().int().min(1).max(60)
}).parse(d)).handler(grantAccess_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: sub } = await supabaseAdmin.from("subscriptions").select("current_period_end,trial_ends_at").eq("user_id", data.userId).maybeSingle();
	const candidates = [Date.now()];
	if (sub?.current_period_end) candidates.push(new Date(sub.current_period_end).getTime());
	if (sub?.trial_ends_at) candidates.push(new Date(sub.trial_ends_at).getTime());
	const base = new Date(Math.max(...candidates));
	base.setMonth(base.getMonth() + data.months);
	const { error } = await supabaseAdmin.from("subscriptions").update({
		status: "active",
		current_period_end: base.toISOString()
	}).eq("user_id", data.userId);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		endsAt: base.toISOString()
	};
});
var redeemVoucher_createServerFn_handler = createServerRpc({
	id: "b9baa550ffbd6640840715c8f50cdac54633c900de41356c04906e4f64e10d36",
	name: "redeemVoucher",
	filename: "src/lib/admin.functions.ts"
}, (opts) => redeemVoucher.__executeServer(opts));
var redeemVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().min(4).max(40) }).parse(d)).handler(redeemVoucher_createServerFn_handler, async ({ data, context }) => {
	const { data: res, error } = await context.supabase.rpc("redeem_voucher", { _code: data.code });
	if (error) throw new Error(error.message);
	return res;
});
//#endregion
export { createVoucher_createServerFn_handler, deleteVoucher_createServerFn_handler, getAdminOverview_createServerFn_handler, getIsAdmin_createServerFn_handler, grantAccess_createServerFn_handler, listVouchers_createServerFn_handler, redeemVoucher_createServerFn_handler, setVoucherActive_createServerFn_handler };
