import { t as TSS_SERVER_FUNCTION } from "./server-fdR9y1Zw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-lrGlHJAh.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
