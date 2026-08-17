//#region node_modules/.nitro/vite/services/ssr/assets/format-DGi3p9Yo.js
function money(value, currency = "KSh") {
	return `${currency} ${Number(value ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
}
function shortDate(value) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
var PAYMENT_METHODS = [
	"cash",
	"mpesa",
	"bank",
	"card",
	"cheque"
];
var PROPERTY_TYPES = [
	"apartment",
	"hostel",
	"bedsitter",
	"house",
	"commercial"
];
var PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var REQUEST_CATEGORIES = [
	"plumbing",
	"electrical",
	"security",
	"cleaning",
	"appliance",
	"general"
];
//#endregion
export { money as a, REQUEST_CATEGORIES as i, PRIORITIES as n, shortDate as o, PROPERTY_TYPES as r, PAYMENT_METHODS as t };
