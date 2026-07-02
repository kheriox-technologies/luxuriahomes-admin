module.exports = [
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"401b9c0a321abd95a2b8c77c475847c74b0d2dc3c3":"fetchCdnImagesAsDataUrls","40438929adcb230af27d8f2e649fe94f2f2c457659":"signCdnUrl","40df5fb9d13ca3f0e3e141515702d444c990b39ea7":"signCdnUrls"},"",""] */ __turbopack_context__.s([
    "fetchCdnImagesAsDataUrls",
    ()=>fetchCdnImagesAsDataUrls,
    "signCdnUrl",
    ()=>signCdnUrl,
    "signCdnUrls",
    ()=>signCdnUrls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$cloudfront$2d$signer$2f$dist$2d$es$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-sdk/cloudfront-signer/dist-es/sign.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const trailingSlash = /\/$/;
function buildSignedUrl(s3Key) {
    const baseUrl = ("TURBOPACK compile-time value", "https://cdn-dev.luxuriahomes.com.au");
    const keyPairId = process.env.CDN_KEY_PAIR_ID;
    const privateKey = process.env.CDN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!(baseUrl && keyPairId && privateKey)) {
        throw new Error('Missing CDN configuration');
    }
    const url = `${baseUrl.replace(trailingSlash, '')}/${s3Key}`;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$cloudfront$2d$signer$2f$dist$2d$es$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSignedUrl"])({
        url,
        keyPairId,
        privateKey,
        dateLessThan: new Date(Date.now() + 3_600_000).toISOString()
    });
}
async function signCdnUrl(s3Key) {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    return buildSignedUrl(s3Key);
}
async function signCdnUrls(s3Keys) {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const result = {};
    for (const key of s3Keys){
        result[key] = buildSignedUrl(key);
    }
    return result;
}
async function fetchCdnImagesAsDataUrls(s3Keys) {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const result = {};
    await Promise.all(s3Keys.map(async (key)=>{
        try {
            const url = buildSignedUrl(key);
            const response = await fetch(url);
            if (!response.ok) {
                return;
            }
            const buffer = await response.arrayBuffer();
            if (!buffer.byteLength) {
                return;
            }
            const contentType = response.headers.get('content-type') ?? 'image/jpeg';
            const base64 = Buffer.from(buffer).toString('base64');
            result[key] = `data:${contentType};base64,${base64}`;
        } catch  {
        // skip images that fail to fetch
        }
    }));
    return result;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signCdnUrl,
    signCdnUrls,
    fetchCdnImagesAsDataUrls
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signCdnUrl, "40438929adcb230af27d8f2e649fe94f2f2c457659", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signCdnUrls, "40df5fb9d13ca3f0e3e141515702d444c990b39ea7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchCdnImagesAsDataUrls, "401b9c0a321abd95a2b8c77c475847c74b0d2dc3c3", null);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__405419fa._.js.map