import { n as createServerFn } from "./server-ClZFyajK.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BHLb4lCJ.mjs";
import { c as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-CGgpOZ0a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/affiliate.functions-DHxoW8Hl.js
var recordReferral_createServerFn_handler = createServerRpc({
	id: "c14e2e8cdb23e7f9b461739c62d5cbc890bdd97f20d72f7d8bedb56da32a539d",
	name: "recordReferral",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => recordReferral.__executeServer(opts));
var recordReferral = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ referralCode: stringType().min(4).max(20) }).parse(d)).handler(recordReferral_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: result, error } = await supabaseAdmin.rpc("record_referral", {
		_referred_id: context.userId,
		_referral_code: data.referralCode
	});
	if (error) throw new Error(error.message);
	return { affiliateId: result };
});
var enrollAffiliate_createServerFn_handler = createServerRpc({
	id: "154a80bed248c6ba5fbe89a708f2f5bab1b0c3f29ed1947c160bf33a2a6b9adb",
	name: "enrollAffiliate",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => enrollAffiliate.__executeServer(opts));
var enrollAffiliate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(enrollAffiliate_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.rpc("enroll_affiliate", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	return data;
});
var getAffiliate_createServerFn_handler = createServerRpc({
	id: "c07f833942f7a5e1c619d50bf68defbcd2bb5c0b671ad20c0139c74caeab94e3",
	name: "getAffiliate",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => getAffiliate.__executeServer(opts));
var getAffiliate = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAffiliate_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("affiliates").select("*").eq("user_id", context.userId).maybeSingle();
	if (error) throw new Error(error.message);
	return data;
});
var getAffiliateDashboard_createServerFn_handler = createServerRpc({
	id: "988f62272a7e3d03030f08da325dfca0bd5d6751ec70e734233372553ba0564b",
	name: "getAffiliateDashboard",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => getAffiliateDashboard.__executeServer(opts));
var getAffiliateDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAffiliateDashboard_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.rpc("get_affiliate_dashboard", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	return data;
});
var requestWithdrawal_createServerFn_handler = createServerRpc({
	id: "8297b541ac6712582b97779069d8f14b9e40158c17fd18bbcf33adda84541eb6",
	name: "requestWithdrawal",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	amount: numberType().min(300),
	mpesaPhone: stringType().min(10).max(15),
	note: stringType().max(500).optional().nullable()
}).parse(d)).handler(requestWithdrawal_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: result, error } = await supabaseAdmin.rpc("request_withdrawal", {
		_affiliate_id: context.userId,
		_amount: data.amount,
		_mpesa_phone: data.mpesaPhone
	});
	if (error) throw new Error(error.message);
	return result;
});
var getWithdrawals_createServerFn_handler = createServerRpc({
	id: "67f6129a73c9ca51944ec2e37850d22c890d739632e5cd9670a4a8efa2d1d463",
	name: "getWithdrawals",
	filename: "src/lib/affiliate.functions.ts"
}, (opts) => getWithdrawals.__executeServer(opts));
var getWithdrawals = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getWithdrawals_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("withdrawals").select("*").eq("affiliate_id", context.userId).order("requested_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { enrollAffiliate_createServerFn_handler, getAffiliateDashboard_createServerFn_handler, getAffiliate_createServerFn_handler, getWithdrawals_createServerFn_handler, recordReferral_createServerFn_handler, requestWithdrawal_createServerFn_handler };
