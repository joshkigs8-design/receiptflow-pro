import { n as createServerFn } from "./server-CZPGvZrI.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D5zHNI9_.mjs";
import { c as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CffXAEMm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/affiliate.functions-D1qsWKKB.js
var recordReferral = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ referralCode: stringType().min(4).max(20) }).parse(d)).handler(createSsrRpc("c14e2e8cdb23e7f9b461739c62d5cbc890bdd97f20d72f7d8bedb56da32a539d"));
var enrollAffiliate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("154a80bed248c6ba5fbe89a708f2f5bab1b0c3f29ed1947c160bf33a2a6b9adb"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c07f833942f7a5e1c619d50bf68defbcd2bb5c0b671ad20c0139c74caeab94e3"));
var getAffiliateDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("988f62272a7e3d03030f08da325dfca0bd5d6751ec70e734233372553ba0564b"));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	amount: numberType().min(300),
	mpesaPhone: stringType().min(10).max(15),
	note: stringType().max(500).optional().nullable()
}).parse(d)).handler(createSsrRpc("8297b541ac6712582b97779069d8f14b9e40158c17fd18bbcf33adda84541eb6"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("67f6129a73c9ca51944ec2e37850d22c890d739632e5cd9670a4a8efa2d1d463"));
//#endregion
export { requestWithdrawal as i, getAffiliateDashboard as n, recordReferral as r, enrollAffiliate as t };
