import { n as createServerFn } from "./server-DQauuc8a.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DkoqJTkl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CY7VG7vy.mjs";
import { c as stringType, i as enumType, r as coerce, s as objectType } from "../_libs/zod.mjs";
import { a as propertySchema, c as unitSchema, n as paymentSchema, o as settingsSchema, s as tenantSchema, t as announcementSchema } from "./schemas-DUPaCA9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.functions-BqNkZC1I.js
var getSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c451e54a9d2ab97753c2c74f857230c04311a69b1d08e273506d09d1891833f5"));
var saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => settingsSchema.parse(data)).handler(createSsrRpc("5487d7ed4fa27016c4a5375b56a35f0724412287133d6cf4a9b6c7b47cfef4de"));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d1b118821565a072a8272f3ff225b6ed85fb49c5888b71420f125d78a5e3e1e2"));
var listProperties = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5b8a25bae5676e90b8cd8a48918ab2013bfc20b84d1953fc7e200cab835c57c8"));
var saveProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => propertySchema.parse(data)).handler(createSsrRpc("759d823327e0d1379330ea78c0aa0ecbc4b4a623e2cd308ba6660e730ff9b4c4"));
var deleteProperty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("2f6b0943266923933b1a56abfae9fc738b87e99cf1fcf119029f7e7c65ab9790"));
var listUnits = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ propertyId: stringType().uuid().optional() }).parse(data ?? {})).handler(createSsrRpc("290ba7a69eb68e1b2e3bf73ccdb9452a534c177c98821eead0dc923f7a9e7080"));
var saveUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => unitSchema.parse(data)).handler(createSsrRpc("fe23efd2522d389f72aeb49c1a78a584c847a7921764ba4c45506bb2ade95a31"));
var deleteUnit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("241b3d16261a8d77f387f8e5b4a961f3463f871c29c6a56a3384afb66d5c52ab"));
var listTenants = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ecb6539f444664f98a1e97dcf6c7a71945f57b545701f90a18a47097aff00677"));
var saveTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => tenantSchema.parse(data)).handler(createSsrRpc("669402d1503873ad5760e13f8cf6e942466a7cf0bb682c0aff70fd5970411697"));
var deleteTenant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("234d49972d75ebb9a80c704625a1cd82be249f8d02ac5dbaa38e61fcc5c731d9"));
var listPayments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8237a64b6fb844fc7443ae575d9ce00c365c3651a5cb3bc54224c0a5f304e638"));
var recordPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => paymentSchema.parse(data)).handler(createSsrRpc("495504ec31c4f24cb7a01f41486baa51be718df0cf7567a25269b4267cdc2039"));
var listReceipts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("239a0a15e853d3ec484d8688d348a657842d9599f5e2cbb97583770e0346caa0"));
var updatePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	amount: coerce.number().positive(),
	method: stringType().min(1).max(40),
	reference: stringType().max(80).optional().nullable(),
	paid_at: stringType().min(4),
	period_label: stringType().max(40).optional().nullable(),
	notes: stringType().max(1e3).optional().nullable()
}).parse(data)).handler(createSsrRpc("b28c39fd8891c05a268c7759789c7cdd3f624cf4b859399dcf5190d823450171"));
var deletePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("b582cc06f0c046ad78eb457809370783ed49186ddfe833feb42daeeb5e557200"));
var listRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4c23af5cdc6874ce7e29fcb8c436c2ec37a90de1cbee1278d1985ee2cf6081c0"));
var updateRequestStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"open",
		"in_progress",
		"resolved"
	])
}).parse(data)).handler(createSsrRpc("15b806b7cf6f4bcf86632629ead957c274b475e57ae2dddac283da9e97ff5ea5"));
var listAnnouncements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("998b28c735c1d642c5d5b92637b4d6877a15677f8331e8cfbc97b5c6ddb763be"));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => announcementSchema.parse(data)).handler(createSsrRpc("bba92786a66d46f9d0c56b08716b67808e96b95733cc15001a237faeb62b18e5"));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("406e9770249dd0c75efac7d8d13c2918bdb7fa83d159d1784b17db16bf44edbe"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ term: stringType().trim().min(2).max(80) }).parse(data)).handler(createSsrRpc("b244f16c083ff9d8806db70383fc4204d412eb557928b3eafddebc2eab6a75be"));
var getReports = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a4692c1846b6bceaea30624edbf2d560f8793ad6c4d2fa3b0a67e89e83e83b20"));
//#endregion
export { updateRequestStatus as C, updatePayment as S, saveAnnouncement as _, deleteUnit as a, saveTenant as b, getSettings as c, listProperties as d, listReceipts as f, recordPayment as g, listUnits as h, deleteTenant as i, listAnnouncements as l, listTenants as m, deletePayment as n, getDashboard as o, listRequests as p, deleteProperty as r, getReports as s, deleteAnnouncement as t, listPayments as u, saveProperty as v, saveUnit as x, saveSettings as y };
