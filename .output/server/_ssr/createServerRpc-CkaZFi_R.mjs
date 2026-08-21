import { t as TSS_SERVER_FUNCTION } from "./server-nGs_oUjZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-CkaZFi_R.js
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
