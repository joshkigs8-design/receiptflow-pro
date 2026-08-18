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
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"4b-eTTmraKVqPcGryM7CmVCXRT1x+c\"",
		"mtime": "2026-08-17T10:09:57.353Z",
		"size": 75,
		"path": "../public/robots.txt"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"1bf-fYVEYVqrBab7RWR1FcKzwbUBrYE\"",
		"mtime": "2026-08-17T10:09:57.360Z",
		"size": 447,
		"path": "../public/sitemap.xml"
	},
	"/assets/admin-CAkn7stK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"632a-lvssQ/jaMHq8SrqFLwUE5mZRJws\"",
		"mtime": "2026-08-18T06:20:31.252Z",
		"size": 25386,
		"path": "../public/assets/admin-CAkn7stK.js"
	},
	"/assets/announcements-DtbM5GoJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f49-5v9i6GY2wsNGVgYo6iAPY/Q61uc\"",
		"mtime": "2026-08-18T06:20:31.263Z",
		"size": 3913,
		"path": "../public/assets/announcements-DtbM5GoJ.js"
	},
	"/assets/AppShell-Dyplla4t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b49-kbHC2g8+dWfULOdDQCWyvn9xqYY\"",
		"mtime": "2026-08-18T06:20:31.247Z",
		"size": 11081,
		"path": "../public/assets/AppShell-Dyplla4t.js"
	},
	"/assets/auth-BgElCVzH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135d-O2U/IqO+znyutBnogNe5lWPCCXw\"",
		"mtime": "2026-08-18T06:20:31.264Z",
		"size": 4957,
		"path": "../public/assets/auth-BgElCVzH.js"
	},
	"/assets/auth-middleware-DoX3QhAl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c-S1+6kZhqc4IJAxh0XTSKcGMiXik\"",
		"mtime": "2026-08-18T06:20:31.267Z",
		"size": 300,
		"path": "../public/assets/auth-middleware-DoX3QhAl.js"
	},
	"/assets/auth.callback-DWhp_UVO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83b-6fmWsUaA+bYRapgjuxawJ/Vs2dI\"",
		"mtime": "2026-08-18T06:20:31.269Z",
		"size": 2107,
		"path": "../public/assets/auth.callback-DWhp_UVO.js"
	},
	"/assets/billing-ZDzF-udU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1-haYgDw5kaIWicOf9qHpzYnJ0l7k\"",
		"mtime": "2026-08-18T06:20:31.282Z",
		"size": 161,
		"path": "../public/assets/billing-ZDzF-udU.js"
	},
	"/assets/button-CTb-Nxej.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d35-9D3S+k/tci10XwptwEKl8eTw7yg\"",
		"mtime": "2026-08-18T06:20:31.285Z",
		"size": 32053,
		"path": "../public/assets/button-CTb-Nxej.js"
	},
	"/assets/building-2-g5iJaaxv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f-1CloGcrs4ICfKoTl0N2XrxuqmLY\"",
		"mtime": "2026-08-18T06:20:31.284Z",
		"size": 383,
		"path": "../public/assets/building-2-g5iJaaxv.js"
	},
	"/assets/check-C4ycwmEB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-EsbUGDst/Cgh+YJU3mGu/HrSuEc\"",
		"mtime": "2026-08-18T06:20:31.287Z",
		"size": 124,
		"path": "../public/assets/check-C4ycwmEB.js"
	},
	"/assets/badge-C3UqZkyX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"347-w0QevXMHaTMz2ki7XYBvZ2mJ/mg\"",
		"mtime": "2026-08-18T06:20:31.269Z",
		"size": 839,
		"path": "../public/assets/badge-C3UqZkyX.js"
	},
	"/assets/copy-BGvLrkNp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-98bxfYbtz/8RnAWRlZRRvRzzv1Q\"",
		"mtime": "2026-08-18T06:20:31.291Z",
		"size": 236,
		"path": "../public/assets/copy-BGvLrkNp.js"
	},
	"/assets/createLucideIcon-DEMXix07.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1274-8Jyo5RWPMPM8wxuEAucqQFHX1ts\"",
		"mtime": "2026-08-18T06:20:31.294Z",
		"size": 4724,
		"path": "../public/assets/createLucideIcon-DEMXix07.js"
	},
	"/assets/createServerFn-DwXByPm6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12b1-M81V+eTMqcx5elznSzLQFmnXEZ4\"",
		"mtime": "2026-08-18T06:20:31.296Z",
		"size": 4785,
		"path": "../public/assets/createServerFn-DwXByPm6.js"
	},
	"/assets/dashboard-CbY-S89a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"416f-VliLflxK0zWooMeKWLulcSx8kpU\"",
		"mtime": "2026-08-18T06:20:31.300Z",
		"size": 16751,
		"path": "../public/assets/dashboard-CbY-S89a.js"
	},
	"/assets/dialog-Cgii28NQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1935-AiFqfa/6OnOW1itYnafPBvkVzu4\"",
		"mtime": "2026-08-18T06:20:31.301Z",
		"size": 6453,
		"path": "../public/assets/dialog-Cgii28NQ.js"
	},
	"/assets/dist-BFgHc1nX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3994-g7S1LyCxWaheDRXYrp+/7cVtcn0\"",
		"mtime": "2026-08-18T06:20:31.306Z",
		"size": 14740,
		"path": "../public/assets/dist-BFgHc1nX.js"
	},
	"/assets/download-CDYvaVcW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c81-H9+nJ/7pe+DLBsTIC8u7ICXKH4w\"",
		"mtime": "2026-08-18T06:20:31.312Z",
		"size": 3201,
		"path": "../public/assets/download-CDYvaVcW.js"
	},
	"/assets/download-DFNnWmVx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-/JBBU0hsDXeuvp0/E3qf8vpbAmk\"",
		"mtime": "2026-08-18T06:20:31.314Z",
		"size": 232,
		"path": "../public/assets/download-DFNnWmVx.js"
	},
	"/assets/format-CBfSLYHp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d7-iFcz8FoOC+Gq3Ub1XW/hugsQMhM\"",
		"mtime": "2026-08-18T06:20:31.315Z",
		"size": 471,
		"path": "../public/assets/format-CBfSLYHp.js"
	},
	"/assets/Field-CH13pc5y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"205-PWS8eXG1TMntuXVJRPtNOIA3QM0\"",
		"mtime": "2026-08-18T06:20:31.250Z",
		"size": 517,
		"path": "../public/assets/Field-CH13pc5y.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"14e3bf-hax6DKXOwZ4YmARw6Xuynb0tZuM\"",
		"mtime": "2026-08-17T09:39:06.464Z",
		"size": 1369023,
		"path": "../public/favicon.ico"
	},
	"/assets/generateCategoricalChart-CaGlKTNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a446-6wjHxQHxy+hbuq7jHL2JFwClUe0\"",
		"mtime": "2026-08-18T06:20:31.316Z",
		"size": 369734,
		"path": "../public/assets/generateCategoricalChart-CaGlKTNK.js"
	},
	"/assets/html2canvas-XpPErLxs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b50-7WL2Cg/AA94dRjx+IqApgR2UelM\"",
		"mtime": "2026-08-18T06:20:31.428Z",
		"size": 199504,
		"path": "../public/assets/html2canvas-XpPErLxs.js"
	},
	"/assets/hero-poster-CIM8cEqS.jpg": {
		"type": "image/jpeg",
		"etag": "\"32412-RKF4LpwmA/LA+zUJLxcioPKrD0Q\"",
		"mtime": "2026-08-18T06:20:31.839Z",
		"size": 205842,
		"path": "../public/assets/hero-poster-CIM8cEqS.jpg"
	},
	"/assets/input-D4w99TaZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bf-hFc+V+olrm1Bc/nnat91JuAemRo\"",
		"mtime": "2026-08-18T06:20:31.451Z",
		"size": 703,
		"path": "../public/assets/input-D4w99TaZ.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-08-18T06:20:31.493Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/index.es-BTil029Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f96-lWVw8hYtWRws/F7OcFn/Ie/Z3LA\"",
		"mtime": "2026-08-18T06:20:31.446Z",
		"size": 151446,
		"path": "../public/assets/index.es-BTil029Z.js"
	},
	"/assets/jsx-runtime-B74pBk57.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b3-dR76ByMZGDPiD3cWx4orTzhF0Ag\"",
		"mtime": "2026-08-18T06:20:31.493Z",
		"size": 435,
		"path": "../public/assets/jsx-runtime-B74pBk57.js"
	},
	"/assets/label-C5pJqboC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"528-Y4bpxYcKrtrVSujrrljc8m/NDrQ\"",
		"mtime": "2026-08-18T06:20:31.495Z",
		"size": 1320,
		"path": "../public/assets/label-C5pJqboC.js"
	},
	"/assets/loader-circle-YcTkb_OO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-R9PVTG7sFeDdJOkMXYnvEpck3z0\"",
		"mtime": "2026-08-18T06:20:31.530Z",
		"size": 144,
		"path": "../public/assets/loader-circle-YcTkb_OO.js"
	},
	"/assets/link-kG7gU6oD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51ca-eEmsp5lGcbXgVRv+++0L45jdyhk\"",
		"mtime": "2026-08-18T06:20:31.528Z",
		"size": 20938,
		"path": "../public/assets/link-kG7gU6oD.js"
	},
	"/assets/matchContext-o6UrKsDN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-fior0uStOeOOIaIFxn1yl+wihW4\"",
		"mtime": "2026-08-18T06:20:31.530Z",
		"size": 184,
		"path": "../public/assets/matchContext-o6UrKsDN.js"
	},
	"/assets/not-found-DIgawKw1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37-RTB6YH5iXRKeXz1Sn6ZQ+vS0lnc\"",
		"mtime": "2026-08-18T06:20:31.534Z",
		"size": 55,
		"path": "../public/assets/not-found-DIgawKw1.js"
	},
	"/assets/payments-YwXkYi3S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2292-Vgd9uzKatFWlOEYoEmks0qc733M\"",
		"mtime": "2026-08-18T06:20:31.534Z",
		"size": 8850,
		"path": "../public/assets/payments-YwXkYi3S.js"
	},
	"/assets/pencil-BWjB5OQ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-2L75jx16F19n/nKz4sP0Xrl3bHo\"",
		"mtime": "2026-08-18T06:20:31.536Z",
		"size": 276,
		"path": "../public/assets/pencil-BWjB5OQ2.js"
	},
	"/assets/portal.functions-saQn-Z0M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5-l/DRhv1O3i7/YfvBWYpcQDGipkg\"",
		"mtime": "2026-08-18T06:20:31.538Z",
		"size": 421,
		"path": "../public/assets/portal.functions-saQn-Z0M.js"
	},
	"/assets/properties-DhF9EFd-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1791-Z4oC7CrYPvXB/fdw3kHrbqviHAc\"",
		"mtime": "2026-08-18T06:20:31.539Z",
		"size": 6033,
		"path": "../public/assets/properties-DhF9EFd-.js"
	},
	"/assets/purify.es-JEAr64Sr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69f8-etlEv+E9/p6xWqevXpz2URHq5DY\"",
		"mtime": "2026-08-18T06:20:31.540Z",
		"size": 27128,
		"path": "../public/assets/purify.es-JEAr64Sr.js"
	},
	"/assets/qr-code-20nEe2sP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-n5NzLSIuIXhxbxdeV5XL8tfMst4\"",
		"mtime": "2026-08-18T06:20:31.541Z",
		"size": 650,
		"path": "../public/assets/qr-code-20nEe2sP.js"
	},
	"/assets/receipt._publicId-DZBfMfFT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11b2-PllCN76j1RoOl8m1aflbMsefa/8\"",
		"mtime": "2026-08-18T06:20:31.544Z",
		"size": 4530,
		"path": "../public/assets/receipt._publicId-DZBfMfFT.js"
	},
	"/assets/redirect-Dhm19zUi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f4-ePZWCXP5uehkmkGMkMl5xDch+/Y\"",
		"mtime": "2026-08-18T06:20:31.566Z",
		"size": 500,
		"path": "../public/assets/redirect-Dhm19zUi.js"
	},
	"/assets/reports-Bfk7trSC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"733d-2rGeYadrwMjz5YVOaHou8WobNgY\"",
		"mtime": "2026-08-18T06:20:31.570Z",
		"size": 29501,
		"path": "../public/assets/reports-Bfk7trSC.js"
	},
	"/assets/receipt-pdf-DMstlTIs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67c82-d3mDFBVJ1j9v35R16cT+SrGvLR8\"",
		"mtime": "2026-08-18T06:20:31.542Z",
		"size": 425090,
		"path": "../public/assets/receipt-pdf-DMstlTIs.js"
	},
	"/assets/receipts-BDnfl_vj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"892-fK/biu6aO8txWhW2sNPDviS8pgU\"",
		"mtime": "2026-08-18T06:20:31.545Z",
		"size": 2194,
		"path": "../public/assets/receipts-BDnfl_vj.js"
	},
	"/assets/index-FOPpbRJq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98828-A0E1qwcAs0z8uieeq/x/4xtOXFM\"",
		"mtime": "2026-08-18T06:20:31.247Z",
		"size": 624680,
		"path": "../public/assets/index-FOPpbRJq.js"
	},
	"/assets/requests-CQGu0oJ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dc-KQh5Ak4nsw5fNefMRoyD1I3Y/uI\"",
		"mtime": "2026-08-18T06:20:31.572Z",
		"size": 2268,
		"path": "../public/assets/requests-CQGu0oJ9.js"
	},
	"/assets/rolldown-runtime-B0Z9INg1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385-vn6fLblvytQt1hv6CJ89eGYvXrc\"",
		"mtime": "2026-08-18T06:20:31.576Z",
		"size": 901,
		"path": "../public/assets/rolldown-runtime-B0Z9INg1.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-08-18T06:20:31.577Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/route-BDnDYmJ0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-i9bXQDO2nqBzZwXeKGoHvDS3anA\"",
		"mtime": "2026-08-18T06:20:31.579Z",
		"size": 141,
		"path": "../public/assets/route-BDnDYmJ0.js"
	},
	"/assets/select-_wUK1Hdr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1123e-uBtrRTVkGS1VHbMUr69RVNk62bw\"",
		"mtime": "2026-08-18T06:20:31.581Z",
		"size": 70206,
		"path": "../public/assets/select-_wUK1Hdr.js"
	},
	"/assets/routes-CG-4JcIj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2226e-3YArTfoZMWBPLgdoBnZvj92ZHI4\"",
		"mtime": "2026-08-18T06:20:31.579Z",
		"size": 139886,
		"path": "../public/assets/routes-CG-4JcIj.js"
	},
	"/assets/settings-DPTwjfv2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a72-N8UrvnQwI7o80Zyu0enNfOU0Uw4\"",
		"mtime": "2026-08-18T06:20:31.581Z",
		"size": 2674,
		"path": "../public/assets/settings-DPTwjfv2.js"
	},
	"/assets/shield-alert-DRk5kHFM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-vDOlPgtz9Gy+PVAga+1/eT7AsHQ\"",
		"mtime": "2026-08-18T06:20:31.583Z",
		"size": 616,
		"path": "../public/assets/shield-alert-DRk5kHFM.js"
	},
	"/assets/shield-check-BG3YlvUz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-oYMMeF6GRUIWJchRF+mcSub9hCo\"",
		"mtime": "2026-08-18T06:20:31.585Z",
		"size": 320,
		"path": "../public/assets/shield-check-BG3YlvUz.js"
	},
	"/assets/SiteFooter-B4oVNAFy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1612-tIpVwDdPhjmKUbrw2ZKLATx3XUs\"",
		"mtime": "2026-08-18T06:20:31.252Z",
		"size": 5650,
		"path": "../public/assets/SiteFooter-B4oVNAFy.js"
	},
	"/assets/sparkles-BwmYistA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33a-7BLwb2gjL7sdMtiJlXBMbO8fh2c\"",
		"mtime": "2026-08-18T06:20:31.585Z",
		"size": 826,
		"path": "../public/assets/sparkles-BwmYistA.js"
	},
	"/assets/tenant-DGKn8JWx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d3-b6Zr3AtENXy91EPZKvRTxgm1CSI\"",
		"mtime": "2026-08-18T06:20:31.587Z",
		"size": 8915,
		"path": "../public/assets/tenant-DGKn8JWx.js"
	},
	"/assets/tenants-DlFNsEd2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe2-khq7vyp/tZ/4ZKkUFJzA/5S1S/8\"",
		"mtime": "2026-08-18T06:20:31.587Z",
		"size": 8162,
		"path": "../public/assets/tenants-DlFNsEd2.js"
	},
	"/assets/styles-Dwp6QC7L.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17619-NoZyjlT0CO5X/dg1mEwQ2J5Lygo\"",
		"mtime": "2026-08-18T06:20:31.841Z",
		"size": 95769,
		"path": "../public/assets/styles-Dwp6QC7L.css"
	},
	"/assets/textarea-DRWrCxt3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259-oD8U/2eYUu+74tb3PXLFi7a/vF0\"",
		"mtime": "2026-08-18T06:20:31.602Z",
		"size": 601,
		"path": "../public/assets/textarea-DRWrCxt3.js"
	},
	"/assets/trash-2-DNkFSqmX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ac-9vCbbmBsW3yrTD1OFfjFglWKbP0\"",
		"mtime": "2026-08-18T06:20:31.604Z",
		"size": 428,
		"path": "../public/assets/trash-2-DNkFSqmX.js"
	},
	"/assets/trending-up-CksG9pXF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-bUT6ThAl72W3lCs5p2Awpl6AZag\"",
		"mtime": "2026-08-18T06:20:31.829Z",
		"size": 175,
		"path": "../public/assets/trending-up-CksG9pXF.js"
	},
	"/assets/units-CudKPyxV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"192f-PVjM2QyFHbLUUZr1AKOY+Gqoq7E\"",
		"mtime": "2026-08-18T06:20:31.829Z",
		"size": 6447,
		"path": "../public/assets/units-CudKPyxV.js"
	},
	"/assets/useMutation-VKZaifd2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ea-1mMumClrv2niHSodon0NlhWhxUo\"",
		"mtime": "2026-08-18T06:20:31.831Z",
		"size": 2282,
		"path": "../public/assets/useMutation-VKZaifd2.js"
	},
	"/assets/useQuery-VZjXb-et.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a7-GLVmnakWXV6IcUInx2q13rXFp+s\"",
		"mtime": "2026-08-18T06:20:31.833Z",
		"size": 8871,
		"path": "../public/assets/useQuery-VZjXb-et.js"
	},
	"/assets/useRouter-C6DlevoD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dbf-UgRr7fALr5CSTTK5a+KGyWChCf8\"",
		"mtime": "2026-08-18T06:20:31.833Z",
		"size": 7615,
		"path": "../public/assets/useRouter-C6DlevoD.js"
	},
	"/assets/users-CT2yQubo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-i/0PNq1PmqF6o6Dk/AU9DkcenVI\"",
		"mtime": "2026-08-18T06:20:31.835Z",
		"size": 306,
		"path": "../public/assets/users-CT2yQubo.js"
	},
	"/assets/useStore-BM43aDzz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"876-pSYvEhe55TqzD8mkh4Cm1QZQx0U\"",
		"mtime": "2026-08-18T06:20:31.833Z",
		"size": 2166,
		"path": "../public/assets/useStore-BM43aDzz.js"
	},
	"/assets/verify-C3n4cv6E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59e-Rn/V5u5XgAfV4slvcsjCT1JQ618\"",
		"mtime": "2026-08-18T06:20:31.835Z",
		"size": 1438,
		"path": "../public/assets/verify-C3n4cv6E.js"
	},
	"/assets/wallet-CYMZp5Ye.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e-VaZgnyn9irvMFmZ3zVdM4LODmso\"",
		"mtime": "2026-08-18T06:20:31.837Z",
		"size": 286,
		"path": "../public/assets/wallet-CYMZp5Ye.js"
	},
	"/assets/wrench-CPD-ecbK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-pMWhn5v3hw9kF6wB2O9GzgpEU5Q\"",
		"mtime": "2026-08-18T06:20:31.837Z",
		"size": 303,
		"path": "../public/assets/wrench-CPD-ecbK.js"
	},
	"/assets/x-BOhEsYiq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-1tiRX6OK0qjs1IcHVvbA4Dxh6K8\"",
		"mtime": "2026-08-18T06:20:31.839Z",
		"size": 290,
		"path": "../public/assets/x-BOhEsYiq.js"
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
