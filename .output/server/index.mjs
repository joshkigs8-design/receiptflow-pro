globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"b-cBdc0K/1FMJAW8diLI7MW6moSTg\"",
		"mtime": "2026-08-17T10:34:04.651Z",
		"size": 11,
		"path": "../public/favicon.png"
	},
	"/assets/admin-CeX6q1HV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"820b-xutp5y5FhTiAClq5VFMGUY1ptBc\"",
		"mtime": "2026-08-18T07:57:18.059Z",
		"size": 33291,
		"path": "../public/assets/admin-CeX6q1HV.js"
	},
	"/assets/announcements-HR32Quj6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"178d-konEasqChrW/h7xHT4AxDCPcBZ8\"",
		"mtime": "2026-08-18T07:57:18.059Z",
		"size": 6029,
		"path": "../public/assets/announcements-HR32Quj6.js"
	},
	"/assets/AppShell-CWcJdntu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3459-GoM9eISuOGh4qYYQuEj8j0z0TtI\"",
		"mtime": "2026-08-18T07:57:18.053Z",
		"size": 13401,
		"path": "../public/assets/AppShell-CWcJdntu.js"
	},
	"/assets/auth-2lq5fXUX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19eb-mXlHgmvORVjb4AB1/fs26CcNNeQ\"",
		"mtime": "2026-08-18T07:57:18.060Z",
		"size": 6635,
		"path": "../public/assets/auth-2lq5fXUX.js"
	},
	"/assets/auth-middleware-BhJ06elF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c-IF1sLnPfRwbcllUcCwnNWn0GeVw\"",
		"mtime": "2026-08-18T07:57:18.060Z",
		"size": 300,
		"path": "../public/assets/auth-middleware-BhJ06elF.js"
	},
	"/assets/auth.callback-DePMEF8N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a43-S8wt9HZ4fAU8nDJALGwIQHcThcA\"",
		"mtime": "2026-08-18T07:57:18.063Z",
		"size": 2627,
		"path": "../public/assets/auth.callback-DePMEF8N.js"
	},
	"/assets/badge-DD3wsVcp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"322-8oPUFcyKTnjH2YmkRvZxaJqH6IU\"",
		"mtime": "2026-08-18T07:57:18.072Z",
		"size": 802,
		"path": "../public/assets/badge-DD3wsVcp.js"
	},
	"/assets/billing-DNt__ucR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-KNnaViMS8pUmXkJjUrB63ZF+FRY\"",
		"mtime": "2026-08-18T07:57:18.072Z",
		"size": 225,
		"path": "../public/assets/billing-DNt__ucR.js"
	},
	"/assets/building-2-C4sPHrSP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f-jqLaJxX99Paob5Lk1GmTo8VGIEQ\"",
		"mtime": "2026-08-18T07:57:18.074Z",
		"size": 383,
		"path": "../public/assets/building-2-C4sPHrSP.js"
	},
	"/assets/button-CiOP04GY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d10-eoL2goIHHuWONmmJ88HcAuvsqyo\"",
		"mtime": "2026-08-18T07:57:18.074Z",
		"size": 32016,
		"path": "../public/assets/button-CiOP04GY.js"
	},
	"/assets/check-CcRoHh7B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-pzdJJf3MziY0qXu81WCCJlR7sSU\"",
		"mtime": "2026-08-18T07:57:18.076Z",
		"size": 124,
		"path": "../public/assets/check-CcRoHh7B.js"
	},
	"/assets/copy-cqXpEkM_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-zXn4xNH8+hA8rlfsh1PTDBtfaPQ\"",
		"mtime": "2026-08-18T07:57:18.076Z",
		"size": 236,
		"path": "../public/assets/copy-cqXpEkM_.js"
	},
	"/assets/createLucideIcon-CYdseuuw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28b5-r8QzZ1TpNEJ6xgAVh4mifrDlDxA\"",
		"mtime": "2026-08-18T07:57:18.076Z",
		"size": 10421,
		"path": "../public/assets/createLucideIcon-CYdseuuw.js"
	},
	"/assets/createServerFn-kNa9j4FZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12d3-pVa9K/Noo6ZY4esY4j2i5TmPMRk\"",
		"mtime": "2026-08-18T07:57:18.081Z",
		"size": 4819,
		"path": "../public/assets/createServerFn-kNa9j4FZ.js"
	},
	"/assets/dashboard-BkYo2OFF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5093-Yye2lEjsaS/K3bZnALV4vebXauY\"",
		"mtime": "2026-08-18T07:57:18.084Z",
		"size": 20627,
		"path": "../public/assets/dashboard-BkYo2OFF.js"
	},
	"/assets/dialog-CbtpHgH2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1910-6qu3G/aiU+xUEpUg/yp20Wg10sc\"",
		"mtime": "2026-08-18T07:57:18.088Z",
		"size": 6416,
		"path": "../public/assets/dialog-CbtpHgH2.js"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"1bf-fYVEYVqrBab7RWR1FcKzwbUBrYE\"",
		"mtime": "2026-08-17T10:09:57.360Z",
		"size": 447,
		"path": "../public/sitemap.xml"
	},
	"/assets/dist-DGA0ds-G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"396f-f1ddpsWUoDfVGTrZyA1MH/ZBHjE\"",
		"mtime": "2026-08-18T07:57:18.088Z",
		"size": 14703,
		"path": "../public/assets/dist-DGA0ds-G.js"
	},
	"/assets/download-CTeRI8QU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123c-KeOkXZpYG7tb+4IrMx4PWfuQ0No\"",
		"mtime": "2026-08-18T07:57:18.097Z",
		"size": 4668,
		"path": "../public/assets/download-CTeRI8QU.js"
	},
	"/assets/download-D8KHoSif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-DFEvq0JsxoBkFe7Wla3rklORZoI\"",
		"mtime": "2026-08-18T07:57:18.099Z",
		"size": 232,
		"path": "../public/assets/download-D8KHoSif.js"
	},
	"/assets/Field-BQONBOFA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"319-rO847EvhH4q1cMGlfmLIOJcoP3A\"",
		"mtime": "2026-08-18T07:57:18.056Z",
		"size": 793,
		"path": "../public/assets/Field-BQONBOFA.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"4b-eTTmraKVqPcGryM7CmVCXRT1x+c\"",
		"mtime": "2026-08-17T10:09:57.353Z",
		"size": 75,
		"path": "../public/robots.txt"
	},
	"/assets/format-CBfSLYHp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d7-iFcz8FoOC+Gq3Ub1XW/hugsQMhM\"",
		"mtime": "2026-08-18T07:57:18.108Z",
		"size": 471,
		"path": "../public/assets/format-CBfSLYHp.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"14e3bf-hax6DKXOwZ4YmARw6Xuynb0tZuM\"",
		"mtime": "2026-08-17T09:39:06.464Z",
		"size": 1369023,
		"path": "../public/favicon.ico"
	},
	"/assets/html2canvas-XpPErLxs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b50-7WL2Cg/AA94dRjx+IqApgR2UelM\"",
		"mtime": "2026-08-18T07:57:18.120Z",
		"size": 199504,
		"path": "../public/assets/html2canvas-XpPErLxs.js"
	},
	"/assets/generateCategoricalChart-CcQrMT4X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e25f-7xp7Px2e7tXYz/DoeV3YL94cRQQ\"",
		"mtime": "2026-08-18T07:57:18.114Z",
		"size": 385631,
		"path": "../public/assets/generateCategoricalChart-CcQrMT4X.js"
	},
	"/assets/input-Bm15wPAC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29a-lp2tylOPd6IMy6U3a4jzjFcYiyc\"",
		"mtime": "2026-08-18T07:57:18.124Z",
		"size": 666,
		"path": "../public/assets/input-Bm15wPAC.js"
	},
	"/assets/hero-poster-CIM8cEqS.jpg": {
		"type": "image/jpeg",
		"etag": "\"32412-RKF4LpwmA/LA+zUJLxcioPKrD0Q\"",
		"mtime": "2026-08-18T07:57:18.959Z",
		"size": 205842,
		"path": "../public/assets/hero-poster-CIM8cEqS.jpg"
	},
	"/assets/jsx-runtime-poNAMJNy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6382-8QrKn/GXQlkLGsZv8FQt0lhEjBU\"",
		"mtime": "2026-08-18T07:57:18.124Z",
		"size": 25474,
		"path": "../public/assets/jsx-runtime-poNAMJNy.js"
	},
	"/assets/label-DQOQQhFt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"508-aXD2P+VDDB4yArSHO2Zg3RRCpXQ\"",
		"mtime": "2026-08-18T07:57:18.124Z",
		"size": 1288,
		"path": "../public/assets/label-DQOQQhFt.js"
	},
	"/assets/index.es-DiQ_DPHe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f96-EX4wxMSgxF8O4iflDuv+f92qi5c\"",
		"mtime": "2026-08-18T07:57:18.122Z",
		"size": 151446,
		"path": "../public/assets/index.es-DiQ_DPHe.js"
	},
	"/assets/link-BTxdNyEa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52c4-JiM/oGg/B5B+fmkfoz9oHaWANo0\"",
		"mtime": "2026-08-18T07:57:18.127Z",
		"size": 21188,
		"path": "../public/assets/link-BTxdNyEa.js"
	},
	"/assets/loader-circle-CvC-nZ7c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-mlAvQPvkFeuy3tnhY20GR4p9XRk\"",
		"mtime": "2026-08-18T07:57:18.127Z",
		"size": 144,
		"path": "../public/assets/loader-circle-CvC-nZ7c.js"
	},
	"/assets/matchContext-4Pj0FcBQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-EOiVewNGpC+c+sFSu9l4HhjShCk\"",
		"mtime": "2026-08-18T07:57:18.433Z",
		"size": 186,
		"path": "../public/assets/matchContext-4Pj0FcBQ.js"
	},
	"/assets/not-found-DIgawKw1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37-RTB6YH5iXRKeXz1Sn6ZQ+vS0lnc\"",
		"mtime": "2026-08-18T07:57:18.438Z",
		"size": 55,
		"path": "../public/assets/not-found-DIgawKw1.js"
	},
	"/assets/payments-Brf4ipqD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38a7-rUQSc9q8Ua83SC1A7s5plEWkUsw\"",
		"mtime": "2026-08-18T07:57:18.439Z",
		"size": 14503,
		"path": "../public/assets/payments-Brf4ipqD.js"
	},
	"/assets/pencil-zDvI5l_8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-TpzGVjNKhJ8L/F3patlPn8dj7/U\"",
		"mtime": "2026-08-18T07:57:18.441Z",
		"size": 276,
		"path": "../public/assets/pencil-zDvI5l_8.js"
	},
	"/assets/portal.functions-CYk77wP9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5-aLmPi2zE7rVFtSLRfCbD4IufOCA\"",
		"mtime": "2026-08-18T07:57:18.442Z",
		"size": 421,
		"path": "../public/assets/portal.functions-CYk77wP9.js"
	},
	"/assets/privacy-policy-BErVNjFB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f3a-UviwpoyYg2UiJLocUoEbs43aZ7g\"",
		"mtime": "2026-08-18T07:57:18.449Z",
		"size": 28474,
		"path": "../public/assets/privacy-policy-BErVNjFB.js"
	},
	"/assets/properties-DioZ_SFP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25f6-B05uCK+fId9/z1kDJdz5X02od5g\"",
		"mtime": "2026-08-18T07:57:18.449Z",
		"size": 9718,
		"path": "../public/assets/properties-DioZ_SFP.js"
	},
	"/assets/purify.es-JEAr64Sr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69f8-etlEv+E9/p6xWqevXpz2URHq5DY\"",
		"mtime": "2026-08-18T07:57:18.451Z",
		"size": 27128,
		"path": "../public/assets/purify.es-JEAr64Sr.js"
	},
	"/assets/qr-code-CJiaII5-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-4bN8VN+IWo8rMDJcxBtigE84Ea0\"",
		"mtime": "2026-08-18T07:57:18.453Z",
		"size": 650,
		"path": "../public/assets/qr-code-CJiaII5-.js"
	},
	"/assets/receipt._publicId-RBSUKmyl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1abc-l2jjOT4Z0iRjfDNrplsQs3esB3g\"",
		"mtime": "2026-08-18T07:57:18.456Z",
		"size": 6844,
		"path": "../public/assets/receipt._publicId-RBSUKmyl.js"
	},
	"/assets/receipts-CHxnA42N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf5-tM8aMOkvhsqRnRN30E4qOQzlexo\"",
		"mtime": "2026-08-18T07:57:18.456Z",
		"size": 3317,
		"path": "../public/assets/receipts-CHxnA42N.js"
	},
	"/assets/receipt-pdf-7v6aZ22h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67c82-8cZo8kdxxCyw+CnpDjRw0i4BaoY\"",
		"mtime": "2026-08-18T07:57:18.454Z",
		"size": 425090,
		"path": "../public/assets/receipt-pdf-7v6aZ22h.js"
	},
	"/assets/redirect-Dhm19zUi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f4-ePZWCXP5uehkmkGMkMl5xDch+/Y\"",
		"mtime": "2026-08-18T07:57:18.497Z",
		"size": 500,
		"path": "../public/assets/redirect-Dhm19zUi.js"
	},
	"/assets/reports-C83JRggu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"797e-udpqCey+ELI9781uGskBQWd1GUE\"",
		"mtime": "2026-08-18T07:57:18.499Z",
		"size": 31102,
		"path": "../public/assets/reports-C83JRggu.js"
	},
	"/assets/index-CEBNRu-e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5434-mK79jcr0bYvZGDDEkEnIQGiDPps\"",
		"mtime": "2026-08-18T07:57:18.053Z",
		"size": 807988,
		"path": "../public/assets/index-CEBNRu-e.js"
	},
	"/assets/requests-DmDTnMPL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e04-h8+6+/lQL2N0NwHhzcE9ypN66Pc\"",
		"mtime": "2026-08-18T07:57:18.507Z",
		"size": 3588,
		"path": "../public/assets/requests-DmDTnMPL.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-08-18T07:57:18.510Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rolldown-runtime-B0Z9INg1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385-vn6fLblvytQt1hv6CJ89eGYvXrc\"",
		"mtime": "2026-08-18T07:57:18.509Z",
		"size": 901,
		"path": "../public/assets/rolldown-runtime-B0Z9INg1.js"
	},
	"/assets/route-C8GCf9pu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-lVUrnItHl7uhnXo7TbmNfw/ADhY\"",
		"mtime": "2026-08-18T07:57:18.510Z",
		"size": 203,
		"path": "../public/assets/route-C8GCf9pu.js"
	},
	"/assets/settings-DHLqtp5f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6f-yICFLAYNmxzfXJwXMXDh+s/3OWc\"",
		"mtime": "2026-08-18T07:57:18.558Z",
		"size": 3695,
		"path": "../public/assets/settings-DHLqtp5f.js"
	},
	"/assets/shield-alert-DKvYnRZ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-kuD4neuOwJ91Q0XhDNZ/CAEQCwo\"",
		"mtime": "2026-08-18T07:57:18.566Z",
		"size": 616,
		"path": "../public/assets/shield-alert-DKvYnRZ9.js"
	},
	"/assets/select-vv9Sp1kI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1121e-w4O2JtC2KmyIX2VGs97fsvv8ACM\"",
		"mtime": "2026-08-18T07:57:18.558Z",
		"size": 70174,
		"path": "../public/assets/select-vv9Sp1kI.js"
	},
	"/assets/routes-BqYwkDIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23ec2-81sg1U6y/rbo8+yfhCqZ8b6UuU0\"",
		"mtime": "2026-08-18T07:57:18.549Z",
		"size": 147138,
		"path": "../public/assets/routes-BqYwkDIr.js"
	},
	"/assets/shield-check-DtdVFkUx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-2enQgpFF5m+IjOqeWs4Hvfd1smc\"",
		"mtime": "2026-08-18T07:57:18.578Z",
		"size": 320,
		"path": "../public/assets/shield-check-DtdVFkUx.js"
	},
	"/assets/SiteFooter-tbRaXNkJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c0-hfMJqZE5/k9NnboxhnLrQQbYnlU\"",
		"mtime": "2026-08-18T07:57:18.057Z",
		"size": 9920,
		"path": "../public/assets/SiteFooter-tbRaXNkJ.js"
	},
	"/assets/sparkles-CSchjFC2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33a-Kpf1GasIKjhaIKiz1ngRyg83MD0\"",
		"mtime": "2026-08-18T07:57:18.578Z",
		"size": 826,
		"path": "../public/assets/sparkles-CSchjFC2.js"
	},
	"/assets/tenant-Bbk4l8PW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35be-nemKEvb0oDxgfJ4nx/rWIfVmJAw\"",
		"mtime": "2026-08-18T07:57:18.580Z",
		"size": 13758,
		"path": "../public/assets/tenant-Bbk4l8PW.js"
	},
	"/assets/styles-Cp86BtnS.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17810-W+MFLTk3hfw6ZtMZXgRxnKQxCUM\"",
		"mtime": "2026-08-18T07:57:18.962Z",
		"size": 96272,
		"path": "../public/assets/styles-Cp86BtnS.css"
	},
	"/assets/tenants-BHiwwCj4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"317e-KQLmhGQimchNRJUjN7A/1khzhfs\"",
		"mtime": "2026-08-18T07:57:18.580Z",
		"size": 12670,
		"path": "../public/assets/tenants-BHiwwCj4.js"
	},
	"/assets/terms-DjbAUmHi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78dc-7hlWgr/0BooDhJ1bAcx0TjXWRYg\"",
		"mtime": "2026-08-18T07:57:18.582Z",
		"size": 30940,
		"path": "../public/assets/terms-DjbAUmHi.js"
	},
	"/assets/textarea-B1iylGL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"234-sjTo6pNccrSR6EdlcnpC6n6JhFQ\"",
		"mtime": "2026-08-18T07:57:18.582Z",
		"size": 564,
		"path": "../public/assets/textarea-B1iylGL3.js"
	},
	"/assets/trash-2-CKp6YNY_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ac-jxRvUH8ZdoZFNywwR5D6qQbRVSM\"",
		"mtime": "2026-08-18T07:57:18.584Z",
		"size": 428,
		"path": "../public/assets/trash-2-CKp6YNY_.js"
	},
	"/assets/trending-up-C2Ve7ecx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-eEazHVi3ZDMto3gUAQst5PUn3cQ\"",
		"mtime": "2026-08-18T07:57:18.584Z",
		"size": 175,
		"path": "../public/assets/trending-up-C2Ve7ecx.js"
	},
	"/assets/units-BPYKroAE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c6-a48rwXIlMpqtO/fO8YMRX1uFxzQ\"",
		"mtime": "2026-08-18T07:57:18.602Z",
		"size": 10694,
		"path": "../public/assets/units-BPYKroAE.js"
	},
	"/assets/useMutation-Bh353GGg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ec-YlDUexx7h/w9CSo6VwiG1RbI5GI\"",
		"mtime": "2026-08-18T07:57:18.886Z",
		"size": 2284,
		"path": "../public/assets/useMutation-Bh353GGg.js"
	},
	"/assets/useQuery-CQMwiRza.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f8-XwtGEc0wRMMvDJkPZ0s6lfUXJuY\"",
		"mtime": "2026-08-18T07:57:18.887Z",
		"size": 9464,
		"path": "../public/assets/useQuery-CQMwiRza.js"
	},
	"/assets/useRouter-BudAmIvb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-lVFwPtxARUXTvt7X/VhMglvpb5s\"",
		"mtime": "2026-08-18T07:57:18.887Z",
		"size": 306,
		"path": "../public/assets/useRouter-BudAmIvb.js"
	},
	"/assets/users-DqX5386j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-SqeylJjUkDUeoVdlrXfdEpWjVnE\"",
		"mtime": "2026-08-18T07:57:18.890Z",
		"size": 306,
		"path": "../public/assets/users-DqX5386j.js"
	},
	"/assets/useStore-B3PgE-y1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cce-1ep2d4uEDuIeadm/pv3q9Wq0FJM\"",
		"mtime": "2026-08-18T07:57:18.889Z",
		"size": 3278,
		"path": "../public/assets/useStore-B3PgE-y1.js"
	},
	"/assets/verify-C8VmmJ_Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75d-DsryeHHEd3O95i9gYrUdtbpl0z0\"",
		"mtime": "2026-08-18T07:57:18.891Z",
		"size": 1885,
		"path": "../public/assets/verify-C8VmmJ_Y.js"
	},
	"/assets/wallet-JrU1lCli.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e-RMpbjhIp4rPvV/f8iIf1J7pEX0s\"",
		"mtime": "2026-08-18T07:57:18.942Z",
		"size": 286,
		"path": "../public/assets/wallet-JrU1lCli.js"
	},
	"/assets/wrench-DKO5GlF7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-A8QBegE9QR4iSTGRQ2YiBTfRJdk\"",
		"mtime": "2026-08-18T07:57:18.950Z",
		"size": 303,
		"path": "../public/assets/wrench-DKO5GlF7.js"
	},
	"/assets/x-gp0ZVDp_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-TqOmONeno7nHTkSOESc2dnuKeEQ\"",
		"mtime": "2026-08-18T07:57:18.950Z",
		"size": 290,
		"path": "../public/assets/x-gp0ZVDp_.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_fWm1yO = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_fWm1yO
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
