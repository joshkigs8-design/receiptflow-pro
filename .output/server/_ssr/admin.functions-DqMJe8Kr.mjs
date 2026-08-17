import { n as createServerFn } from "./server-if63K52G.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DQEmNje3.mjs";
import { c as stringType, n as booleanType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C3-ZJCji.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DqMJe8Kr.js
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
var redeemVoucher = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().min(4).max(40) }).parse(d)).handler(createSsrRpc("b9baa550ffbd6640840715c8f50cdac54633c900de41356c04906e4f64e10d36"));
//#endregion
export { grantAccess as a, setVoucherActive as c, getIsAdmin as i, deleteVoucher as n, listVouchers as o, getAdminOverview as r, redeemVoucher as s, createVoucher as t };
