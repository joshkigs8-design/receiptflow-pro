import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.server-D8lRBSqW.js
var PLANS = {
	monthly: {
		label: "Monthly",
		amount: 300,
		months: 1,
		blurb: "Billed every month"
	},
	yearly: {
		label: "Yearly",
		amount: 3e3,
		months: 12,
		blurb: "2 months free vs monthly"
	}
};
function paystackKey() {
	const key = processModule.env["PAYSTACK_SECRET_KEY"] ?? processModule.env["STRIPE_LIVE_API_KEY"];
	if (!key) throw new Error("Paystack secret key is not configured");
	return key;
}
function accessState(row) {
	const now = Date.now();
	const trialEnds = new Date(row.trial_ends_at).getTime();
	const periodEnds = row.current_period_end ? new Date(row.current_period_end).getTime() : 0;
	const paidActive = periodEnds > now;
	const trialActive = !paidActive && trialEnds > now;
	return {
		active: paidActive || trialActive,
		onTrial: trialActive,
		endsAt: paidActive ? row.current_period_end : row.trial_ends_at,
		daysLeft: Math.max(0, Math.ceil(((paidActive ? periodEnds : trialEnds) - now) / 864e5))
	};
}
function nextPeriodEnd(current, plan) {
	const base = current && new Date(current).getTime() > Date.now() ? new Date(current) : /* @__PURE__ */ new Date();
	const next = new Date(base);
	next.setMonth(next.getMonth() + PLANS[plan].months);
	return next.toISOString();
}
//#endregion
export { paystackKey as i, accessState as n, nextPeriodEnd as r, PLANS as t };
