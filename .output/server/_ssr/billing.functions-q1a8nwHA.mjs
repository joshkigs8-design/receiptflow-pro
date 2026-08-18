import { n as createServerFn } from "./server-DsGdTo1N.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DGtjvBYq.mjs";
import { i as paystackKey, n as accessState, r as nextPeriodEnd, t as PLANS } from "./billing.server-D8lRBSqW.mjs";
import { c as stringType, i as enumType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-PhZfBraw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.functions-q1a8nwHA.js
var getSubscription_createServerFn_handler = createServerRpc({
	id: "1f90e7e423cd1b478c90cbd4d80049ba204470112ca1bc61aff404b7357133cf",
	name: "getSubscription",
	filename: "src/lib/billing.functions.ts"
}, (opts) => getSubscription.__executeServer(opts));
var getSubscription = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getSubscription_createServerFn_handler, async ({ context }) => {
	let { data } = await context.supabase.from("subscriptions").select("*").eq("user_id", context.userId).maybeSingle();
	if (!data) data = (await context.supabase.from("subscriptions").insert({ user_id: context.userId }).select("*").maybeSingle()).data;
	if (!data) throw new Error("Could not load subscription");
	const { data: history } = await context.supabase.from("subscription_payments").select("id,reference,plan,amount,currency,status,paid_at,created_at").order("created_at", { ascending: false }).limit(20);
	return {
		subscription: data,
		...accessState(data),
		history: history ?? []
	};
});
var startCheckout_createServerFn_handler = createServerRpc({
	id: "01e996661c3848d9bb13e2aa645239bfbf1a89febf5bd5d8b2241ab08624051e",
	name: "startCheckout",
	filename: "src/lib/billing.functions.ts"
}, (opts) => startCheckout.__executeServer(opts));
var startCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	plan: enumType(["monthly", "yearly"]),
	origin: stringType().url()
}).parse(d)).handler(startCheckout_createServerFn_handler, async ({ data, context }) => {
	const plan = PLANS[data.plan];
	const email = context.claims.email;
	if (!email) throw new Error("No email on account");
	const reference = `rrp_${data.plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	const res = await fetch("https://api.paystack.co/transaction/initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${paystackKey()}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			amount: plan.amount * 100,
			currency: "KES",
			reference,
			callback_url: `${data.origin}/billing?reference=${reference}`,
			metadata: {
				user_id: context.userId,
				plan: data.plan
			}
		})
	});
	const json = await res.json();
	if (!res.ok || !json.status || !json.data?.authorization_url) {
		console.error("Paystack initialize failed", json.message);
		throw new Error(json.message ?? "Could not start payment");
	}
	await context.supabase.from("subscription_payments").insert({
		user_id: context.userId,
		reference,
		plan: data.plan,
		amount: plan.amount,
		currency: "KES",
		status: "pending"
	});
	return {
		authorization_url: json.data.authorization_url,
		reference
	};
});
var verifyCheckout_createServerFn_handler = createServerRpc({
	id: "f0b9df10baeca915f1693d3b226975f2c9c3f4178bcb64a0e41b1524364ad743",
	name: "verifyCheckout",
	filename: "src/lib/billing.functions.ts"
}, (opts) => verifyCheckout.__executeServer(opts));
var verifyCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ reference: stringType().min(6).max(120) }).parse(d)).handler(verifyCheckout_createServerFn_handler, async ({ data, context }) => {
	const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`, { headers: { Authorization: `Bearer ${paystackKey()}` } });
	const json = await res.json();
	const tx = json.data;
	if (!res.ok || !json.status || !tx) throw new Error("Could not verify payment");
	if (tx.status !== "success") return { paid: false };
	if (tx.metadata?.user_id && tx.metadata.user_id !== context.userId) throw new Error("This payment belongs to another account");
	const planKey = tx.metadata?.plan === "yearly" ? "yearly" : "monthly";
	const plan = PLANS[planKey];
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: existing } = await supabaseAdmin.from("subscription_payments").select("status").eq("reference", data.reference).maybeSingle();
	if (existing?.status !== "success") {
		const { data: sub } = await supabaseAdmin.from("subscriptions").select("current_period_end").eq("user_id", context.userId).maybeSingle();
		const next = nextPeriodEnd(sub?.current_period_end ?? null, planKey);
		await supabaseAdmin.from("subscriptions").update({
			plan: planKey,
			status: "active",
			current_period_end: next,
			last_reference: data.reference,
			last_amount: plan.amount
		}).eq("user_id", context.userId);
		await supabaseAdmin.from("subscription_payments").upsert({
			user_id: context.userId,
			reference: data.reference,
			plan: planKey,
			amount: plan.amount,
			currency: "KES",
			status: "success",
			paid_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "reference" });
	}
	return {
		paid: true,
		plan: planKey
	};
});
//#endregion
export { getSubscription_createServerFn_handler, startCheckout_createServerFn_handler, verifyCheckout_createServerFn_handler };
