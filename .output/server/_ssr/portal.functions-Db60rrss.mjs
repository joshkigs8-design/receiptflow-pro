import { n as createServerFn } from "./server-C59uwSUn.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DGf5PDQh.mjs";
import { c as stringType, s as objectType } from "../_libs/zod.mjs";
import { i as portalVerifySchema, r as portalRequestSchema } from "./schemas-DUPaCA9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.functions-Db60rrss.js
var verifyTenant = createServerFn({ method: "POST" }).inputValidator((data) => portalVerifySchema.parse(data)).handler(createSsrRpc("34b2823a7788c6e0663cd40d132c5925e890896eda041c87f8bae710cfb0f66d"));
var submitTenantRequest = createServerFn({ method: "POST" }).inputValidator((data) => portalRequestSchema.parse(data)).handler(createSsrRpc("e3f1dfb3eae53c515c697f83f59d0cc9f0f4c4a20ec3ef23565698487e13d139"));
var getPublicReceipt = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ publicId: stringType().trim().min(6).max(64) }).parse(data)).handler(createSsrRpc("78e0315fff7704c5140a10579a29ba2a282bb272049ced9768a89853c7188a38"));
//#endregion
export { submitTenantRequest as n, verifyTenant as r, getPublicReceipt as t };
