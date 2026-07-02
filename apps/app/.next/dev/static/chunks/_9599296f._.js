(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "components",
    ()=>components,
    "internal",
    ()=>internal
]);
/* eslint-disable */ /**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/components/index.js [app-client] (ecmascript) <locals>");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const internal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["componentsGeneric"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/page-heading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const PageHeading = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(35);
    if ($[0] !== "9e9a228528bd92798f0aefa317527336eeec6fb0edb56b9798e2d2bc2b4ed9b3") {
        for(let $i = 0; $i < 35; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9e9a228528bd92798f0aefa317527336eeec6fb0edb56b9798e2d2bc2b4ed9b3";
    }
    const { heading, headingActions, icon: Icon, description, backLink, className, metaSlot, rightSlot, titleTrailing } = t0;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-4 space-y-4", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== backLink) {
        t2 = backLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: backLink,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__["ChevronLeftIcon"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/page-heading.tsx",
                lineNumber: 49,
                columnNumber: 73
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 49,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = backLink;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== Icon) {
        t3 = Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 57,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = Icon;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== heading || $[8] !== titleTrailing) {
        t4 = titleTrailing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 items-center gap-2 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "min-w-0 shrink truncate font-semibold sm:tracking-tight",
                    children: heading
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/page-heading.tsx",
                    lineNumber: 65,
                    columnNumber: 98
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex shrink-0 items-center",
                    children: titleTrailing
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/page-heading.tsx",
                    lineNumber: 65,
                    columnNumber: 184
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 65,
            columnNumber: 26
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "min-w-0 flex-1 font-semibold sm:truncate sm:tracking-tight",
            children: heading
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 65,
            columnNumber: 267
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = heading;
        $[8] = titleTrailing;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== headingActions) {
        t5 = headingActions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex shrink-0 items-center gap-2",
            children: headingActions
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 74,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0)) : null;
        $[10] = headingActions;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] !== t4 || $[13] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 items-center gap-2",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = t4;
        $[13] = t5;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] !== metaSlot) {
        t7 = metaSlot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-wrap items-center gap-2",
            children: metaSlot
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 91,
            columnNumber: 21
        }, ("TURBOPACK compile-time value", void 0)) : null;
        $[15] = metaSlot;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    let t8;
    if ($[17] !== description) {
        t8 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-500 text-sm",
            children: description
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 99,
            columnNumber: 25
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = description;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== t6 || $[20] !== t7 || $[21] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 flex-col gap-1",
            children: [
                t6,
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 107,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[19] = t6;
        $[20] = t7;
        $[21] = t8;
        $[22] = t9;
    } else {
        t9 = $[22];
    }
    let t10;
    if ($[23] !== t2 || $[24] !== t3 || $[25] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 items-center gap-2",
            children: [
                t2,
                t3,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 117,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[23] = t2;
        $[24] = t3;
        $[25] = t9;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== rightSlot) {
        t11 = rightSlot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex shrink-0 justify-end pt-0.5",
            children: rightSlot
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 127,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0)) : null;
        $[27] = rightSlot;
        $[28] = t11;
    } else {
        t11 = $[28];
    }
    let t12;
    if ($[29] !== t10 || $[30] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 items-start justify-between gap-3",
            children: [
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 135,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[29] = t10;
        $[30] = t11;
        $[31] = t12;
    } else {
        t12 = $[31];
    }
    let t13;
    if ($[32] !== t1 || $[33] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t12
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/page-heading.tsx",
            lineNumber: 144,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = t1;
        $[33] = t12;
        $[34] = t13;
    } else {
        t13 = $[34];
    }
    return t13;
};
_c = PageHeading;
const __TURBOPACK__default__export__ = PageHeading;
var _c;
__turbopack_context__.k.register(_c, "PageHeading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/tabs.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsPanel,
    "TabsList",
    ()=>TabsList,
    "TabsPanel",
    ()=>TabsPanel,
    "TabsTab",
    ()=>TabsTab,
    "TabsTrigger",
    ()=>TabsTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/tabs/index.parts.js [app-client] (ecmascript) <export * as Tabs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Tabs(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__["Tabs"].Root, {
            className: t1,
            "data-slot": "tabs",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tabs.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Tabs;
function TabsList(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921";
    }
    let children;
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ variant: t1, className, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = t1;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        t1 = $[5];
    }
    const variant = t1 === undefined ? "default" : t1;
    const t2 = variant === "default" ? "rounded-lg bg-muted p-0.5 text-muted-foreground/72" : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1 *:data-[slot=tabs-tab]:hover:bg-accent";
    let t3;
    if ($[6] !== className || $[7] !== t2) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground", "data-[orientation=vertical]:flex-col", t2, className);
        $[6] = className;
        $[7] = t2;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const t4 = variant === "underline" ? "data-[orientation=vertical]:-translate-x-px z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=horizontal]:translate-y-px" : "-z-1 rounded-md bg-background shadow-sm/5 dark:bg-input";
    let t5;
    if ($[9] !== t4) {
        t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-translate-y-(--active-tab-bottom) absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) transition-[width,translate] duration-200 ease-in-out", t4);
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    let t6;
    if ($[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__["Tabs"].Indicator, {
            className: t5,
            "data-slot": "tab-indicator"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tabs.tsx",
            lineNumber: 100,
            columnNumber: 10
        }, this);
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== children || $[14] !== props || $[15] !== t3 || $[16] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__["Tabs"].List, {
            className: t3,
            "data-slot": "tabs-list",
            ...props,
            children: [
                children,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/tabs.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[13] = children;
        $[14] = props;
        $[15] = t3;
        $[16] = t6;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    return t7;
}
_c1 = TabsList;
function TabsTab(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_svg]:-mx-0.5 relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] font-medium text-base outline-none transition-[color,background-color,box-shadow] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-active:text-foreground data-disabled:opacity-64 sm:h-8 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__["Tabs"].Tab, {
            className: t1,
            "data-slot": "tabs-tab",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tabs.tsx",
            lineNumber: 151,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = TabsTab;
function TabsPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c75cc18d69135537da78365963414c58a8afb45cfb724272e5e43de0a7bab921";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 outline-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tabs$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tabs$3e$__["Tabs"].Panel, {
            className: t1,
            "data-slot": "tabs-content",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tabs.tsx",
            lineNumber: 192,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = TabsPanel;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Tabs");
__turbopack_context__.k.register(_c1, "TabsList");
__turbopack_context__.k.register(_c2, "TabsTab");
__turbopack_context__.k.register(_c3, "TabsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/dialog.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogBackdrop",
    ()=>DialogBackdrop,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogPopup,
    "DialogCreateHandle",
    ()=>DialogCreateHandle,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogBackdrop,
    "DialogPanel",
    ()=>DialogPanel,
    "DialogPopup",
    ()=>DialogPopup,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger,
    "DialogViewport",
    ()=>DialogViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/dialog/index.parts.js [app-client] (ecmascript) <export * as Dialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/scroll-area.tsx [app-client] (ecmascript) <locals>");
"use client";
;
;
;
;
;
;
;
const DialogCreateHandle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].createHandle;
function Dialog(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let onOpenChange;
    let props;
    if ($[1] !== t0) {
        ({ onOpenChange, ...props } = t0);
        $[1] = t0;
        $[2] = onOpenChange;
        $[3] = props;
    } else {
        onOpenChange = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== onOpenChange) {
        t1 = ({
            "Dialog[<DialogPrimitive.Root>.onOpenChange]": (open, eventDetails)=>{
                if (!open && eventDetails.reason === "escape-key") {
                    return;
                }
                onOpenChange?.(open, eventDetails);
            }
        })["Dialog[<DialogPrimitive.Root>.onOpenChange]"];
        $[4] = onOpenChange;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Root, {
            ...props,
            disablePointerDismissal: true,
            onOpenChange: t1
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Dialog;
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Portal;
function DialogTrigger(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Trigger, {
            "data-slot": "dialog-trigger",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 69,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c1 = DialogTrigger;
function DialogClose(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
            "data-slot": "dialog-close",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c2 = DialogClose;
function DialogBackdrop(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Backdrop, {
            className: t1,
            "data-slot": "dialog-backdrop",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 127,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = DialogBackdrop;
function DialogViewport(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Viewport, {
            className: t1,
            "data-slot": "dialog-viewport",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 168,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c4 = DialogViewport;
function DialogPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let children;
    let className;
    let closeProps;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, children, showCloseButton: t1, bottomStickOnMobile: t2, closeProps, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = closeProps;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
    } else {
        children = $[2];
        className = $[3];
        closeProps = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
    }
    const showCloseButton = t1 === undefined ? true : t1;
    const bottomStickOnMobile = t2 === undefined ? true : t2;
    let t3;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogBackdrop, {}, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 219,
            columnNumber: 10
        }, this);
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const t4 = bottomStickOnMobile && "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12";
    let t5;
    if ($[9] !== t4) {
        t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(t4);
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    const t6 = bottomStickOnMobile && "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4 max-sm:before:hidden max-sm:before:rounded-none";
    let t7;
    if ($[11] !== className || $[12] !== t6) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg origin-center flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-var(--nested-dialogs))] shadow-lg/5 transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", t6, className);
        $[11] = className;
        $[12] = t6;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== closeProps || $[15] !== showCloseButton) {
        t8 = showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
            "aria-label": "Close",
            className: "absolute end-2 top-2",
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "icon",
                variant: "ghost"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/dialog.tsx",
                lineNumber: 245,
                columnNumber: 112
            }, void 0),
            ...closeProps,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                fileName: "[project]/packages/ui/src/components/dialog.tsx",
                lineNumber: 245,
                columnNumber: 168
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 245,
            columnNumber: 29
        }, this);
        $[14] = closeProps;
        $[15] = showCloseButton;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== children || $[18] !== props || $[19] !== t7 || $[20] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Popup, {
            className: t7,
            "data-slot": "dialog-popup",
            ...props,
            children: [
                children,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 254,
            columnNumber: 10
        }, this);
        $[17] = children;
        $[18] = props;
        $[19] = t7;
        $[20] = t8;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    let t10;
    if ($[22] !== t5 || $[23] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogViewport, {
                    className: t5,
                    children: t9
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/dialog.tsx",
                    lineNumber: 265,
                    columnNumber: 29
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 265,
            columnNumber: 11
        }, this);
        $[22] = t5;
        $[23] = t9;
        $[24] = t10;
    } else {
        t10 = $[24];
    }
    return t10;
}
_c5 = DialogPopup;
function DialogHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3 max-sm:pb-4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "dialog-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 306,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c6 = DialogHeader;
function DialogFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, variant: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const variant = t1 === undefined ? "default" : t1;
    const t2 = variant === "default" && "border-t bg-muted/72 py-4";
    const t3 = variant === "bare" && "in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pt-3 pt-4 pb-6";
    let t4;
    if ($[5] !== className || $[6] !== t2 || $[7] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]", t2, t3, className);
        $[5] = className;
        $[6] = t2;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== props || $[10] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            "data-slot": "dialog-footer",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 356,
            columnNumber: 10
        }, this);
        $[9] = props;
        $[10] = t4;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    return t5;
}
_c7 = DialogFooter;
function DialogTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-heading font-semibold text-xl leading-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Title, {
            className: t1,
            "data-slot": "dialog-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 397,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c8 = DialogTitle;
function DialogDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Description, {
            className: t1,
            "data-slot": "dialog-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 438,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c9 = DialogDescription;
function DialogPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d8cc3cf25edeb72de217a0e807fa35aa6b384436a56bc0ec219b690c0287929";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, scrollFade: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const scrollFade = t1 === undefined ? true : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            "data-slot": "dialog-panel",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 484,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== scrollFade || $[11] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ScrollArea"], {
            scrollFade: scrollFade,
            children: t3
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/dialog.tsx",
            lineNumber: 493,
            columnNumber: 10
        }, this);
        $[10] = scrollFade;
        $[11] = t3;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    return t4;
}
_c10 = DialogPanel;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogClose");
__turbopack_context__.k.register(_c3, "DialogBackdrop");
__turbopack_context__.k.register(_c4, "DialogViewport");
__turbopack_context__.k.register(_c5, "DialogPopup");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
__turbopack_context__.k.register(_c10, "DialogPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/empty.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Empty",
    ()=>Empty,
    "EmptyContent",
    ()=>EmptyContent,
    "EmptyDescription",
    ()=>EmptyDescription,
    "EmptyHeader",
    ()=>EmptyHeader,
    "EmptyMedia",
    ()=>EmptyMedia,
    "EmptyTitle",
    ()=>EmptyTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
function Empty(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance px-6 py-12 text-center md:py-20", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "empty",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Empty;
function EmptyHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex max-w-sm flex-col items-center text-center", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "empty-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c1 = EmptyHeader;
const emptyMediaVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    defaultVariants: {
        variant: "default"
    },
    variants: {
        variant: {
            default: "bg-transparent",
            icon: "relative flex size-9 shrink-0 items-center justify-center rounded-md border bg-card not-dark:bg-clip-padding text-foreground shadow-sm/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5"
        }
    }
});
function EmptyMedia(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(22);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 22; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, variant: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const variant = t1 === undefined ? "default" : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative mb-6", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== className || $[8] !== variant) {
        t3 = variant === "icon" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "aria-hidden": "true",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(emptyMediaVariants({
                        className,
                        variant
                    }), "-translate-x-0.5 -rotate-10 pointer-events-none absolute bottom-px origin-bottom-left scale-84 shadow-none")
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/empty.tsx",
                    lineNumber: 134,
                    columnNumber: 34
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "aria-hidden": "true",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(emptyMediaVariants({
                        className,
                        variant
                    }), "pointer-events-none absolute bottom-px origin-bottom-right translate-x-0.5 rotate-10 scale-84 shadow-none")
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/empty.tsx",
                    lineNumber: 137,
                    columnNumber: 124
                }, this)
            ]
        }, void 0, true);
        $[7] = className;
        $[8] = variant;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== className || $[11] !== variant) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(emptyMediaVariants({
            className,
            variant
        }));
        $[10] = className;
        $[11] = variant;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    let t5;
    if ($[13] !== props || $[14] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 161,
            columnNumber: 10
        }, this);
        $[13] = props;
        $[14] = t4;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    let t6;
    if ($[16] !== props || $[17] !== t2 || $[18] !== t3 || $[19] !== t5 || $[20] !== variant) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            "data-slot": "empty-media",
            "data-variant": variant,
            ...props,
            children: [
                t3,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 170,
            columnNumber: 10
        }, this);
        $[16] = props;
        $[17] = t2;
        $[18] = t3;
        $[19] = t5;
        $[20] = variant;
        $[21] = t6;
    } else {
        t6 = $[21];
    }
    return t6;
}
_c2 = EmptyMedia;
function EmptyTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-heading font-semibold text-xl", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "empty-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 214,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = EmptyTitle;
function EmptyDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "empty-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 255,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c4 = EmptyDescription;
function EmptyContent(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97e8957eea049307524b1e1088bf5be78b078d6802c0f07a5bf7592298f229de";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "empty-content",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/empty.tsx",
            lineNumber: 296,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c5 = EmptyContent;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Empty");
__turbopack_context__.k.register(_c1, "EmptyHeader");
__turbopack_context__.k.register(_c2, "EmptyMedia");
__turbopack_context__.k.register(_c3, "EmptyTitle");
__turbopack_context__.k.register(_c4, "EmptyDescription");
__turbopack_context__.k.register(_c5, "EmptyContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/menu.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>Menu,
    "DropdownMenuCheckboxItem",
    ()=>MenuCheckboxItem,
    "DropdownMenuContent",
    ()=>MenuPopup,
    "DropdownMenuCreateHandle",
    ()=>MenuCreateHandle,
    "DropdownMenuGroup",
    ()=>MenuGroup,
    "DropdownMenuItem",
    ()=>MenuItem,
    "DropdownMenuLabel",
    ()=>MenuGroupLabel,
    "DropdownMenuPortal",
    ()=>MenuPortal,
    "DropdownMenuRadioGroup",
    ()=>MenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>MenuRadioItem,
    "DropdownMenuSeparator",
    ()=>MenuSeparator,
    "DropdownMenuShortcut",
    ()=>MenuShortcut,
    "DropdownMenuSub",
    ()=>MenuSub,
    "DropdownMenuSubContent",
    ()=>MenuSubPopup,
    "DropdownMenuSubTrigger",
    ()=>MenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>MenuTrigger,
    "Menu",
    ()=>Menu,
    "MenuCheckboxItem",
    ()=>MenuCheckboxItem,
    "MenuCreateHandle",
    ()=>MenuCreateHandle,
    "MenuGroup",
    ()=>MenuGroup,
    "MenuGroupLabel",
    ()=>MenuGroupLabel,
    "MenuItem",
    ()=>MenuItem,
    "MenuPopup",
    ()=>MenuPopup,
    "MenuPortal",
    ()=>MenuPortal,
    "MenuRadioGroup",
    ()=>MenuRadioGroup,
    "MenuRadioItem",
    ()=>MenuRadioItem,
    "MenuSeparator",
    ()=>MenuSeparator,
    "MenuShortcut",
    ()=>MenuShortcut,
    "MenuSub",
    ()=>MenuSub,
    "MenuSubPopup",
    ()=>MenuSubPopup,
    "MenuSubTrigger",
    ()=>MenuSubTrigger,
    "MenuTrigger",
    ()=>MenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/menu/index.parts.js [app-client] (ecmascript) <export * as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const MenuCreateHandle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].createHandle;
const Menu = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Root;
const MenuPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Portal;
function MenuTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let children;
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
    }
    let t1;
    if ($[5] !== children || $[6] !== className || $[7] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Trigger, {
            className: className,
            "data-slot": "menu-trigger",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[5] = children;
        $[6] = className;
        $[7] = props;
        $[8] = t1;
    } else {
        t1 = $[8];
    }
    return t1;
}
_c = MenuTrigger;
function MenuPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let alignOffset;
    let anchor;
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ children, className, sideOffset: t1, align: t2, alignOffset, side: t3, anchor, ...props } = t0);
        $[1] = t0;
        $[2] = alignOffset;
        $[3] = anchor;
        $[4] = children;
        $[5] = className;
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
    } else {
        alignOffset = $[2];
        anchor = $[3];
        children = $[4];
        className = $[5];
        props = $[6];
        t1 = $[7];
        t2 = $[8];
        t3 = $[9];
    }
    const sideOffset = t1 === undefined ? 4 : t1;
    const align = t2 === undefined ? "center" : t2;
    const side = t3 === undefined ? "bottom" : t3;
    let t4;
    if ($[10] !== className) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className);
        $[10] = className;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== children) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-h-(--available-height) w-full overflow-y-auto p-1",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[12] = children;
        $[13] = t5;
    } else {
        t5 = $[13];
    }
    let t6;
    if ($[14] !== props || $[15] !== t4 || $[16] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Popup, {
            className: t4,
            "data-slot": "menu-popup",
            ...props,
            children: t5
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 116,
            columnNumber: 10
        }, this);
        $[14] = props;
        $[15] = t4;
        $[16] = t5;
        $[17] = t6;
    } else {
        t6 = $[17];
    }
    let t7;
    if ($[18] !== align || $[19] !== alignOffset || $[20] !== anchor || $[21] !== side || $[22] !== sideOffset || $[23] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Positioner, {
                align: align,
                alignOffset: alignOffset,
                anchor: anchor,
                className: "z-50",
                "data-slot": "menu-positioner",
                side: side,
                sideOffset: sideOffset,
                children: t6
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/menu.tsx",
                lineNumber: 126,
                columnNumber: 32
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 126,
            columnNumber: 10
        }, this);
        $[18] = align;
        $[19] = alignOffset;
        $[20] = anchor;
        $[21] = side;
        $[22] = sideOffset;
        $[23] = t6;
        $[24] = t7;
    } else {
        t7 = $[24];
    }
    return t7;
}
_c1 = MenuPopup;
function MenuGroup(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Group, {
            "data-slot": "menu-group",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 149,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c2 = MenuGroup;
function MenuItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let className;
    let inset;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, inset, variant: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = inset;
        $[4] = props;
        $[5] = t1;
    } else {
        className = $[2];
        inset = $[3];
        props = $[4];
        t1 = $[5];
    }
    const variant = t1 === undefined ? "default" : t1;
    let t2;
    if ($[6] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&>svg]:-mx-0.5 flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:shrink-0", className);
        $[6] = className;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== inset || $[9] !== props || $[10] !== t2 || $[11] !== variant) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Item, {
            className: t2,
            "data-inset": inset,
            "data-slot": "menu-item",
            "data-variant": variant,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 198,
            columnNumber: 10
        }, this);
        $[8] = inset;
        $[9] = props;
        $[10] = t2;
        $[11] = variant;
        $[12] = t3;
    } else {
        t3 = $[12];
    }
    return t3;
}
_c3 = MenuItem;
function MenuCheckboxItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let checked;
    let children;
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, children, checked, variant: t1, ...props } = t0);
        $[1] = t0;
        $[2] = checked;
        $[3] = children;
        $[4] = className;
        $[5] = props;
        $[6] = t1;
    } else {
        checked = $[2];
        children = $[3];
        className = $[4];
        props = $[5];
        t1 = $[6];
    }
    const variant = t1 === undefined ? "default" : t1;
    const t2 = variant === "switch" ? "grid-cols-[1fr_auto] gap-4 pe-1.5" : "grid-cols-[.75rem_1fr] pe-4";
    let t3;
    if ($[7] !== className || $[8] !== t2) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default items-center gap-2 rounded-sm py-1 ps-2 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", t2, className);
        $[7] = className;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== children || $[11] !== variant) {
        t4 = variant === "switch" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "col-start-1",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/menu.tsx",
                    lineNumber: 256,
                    columnNumber: 35
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].CheckboxItemIndicator, {
                    className: "inset-shadow-[0_1px_--theme(--color-black/4%)] inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:--spacing(4)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:[--thumb-size:--spacing(3)]",
                    keepMounted: true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "pointer-events-none block aspect-square h-full in-[[data-slot=menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] origin-left in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)] in-[[data-slot=menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)] rounded-(--thumb-size) bg-background shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]"
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/menu.tsx",
                        lineNumber: 256,
                        columnNumber: 624
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/menu.tsx",
                    lineNumber: 256,
                    columnNumber: 82
                }, this)
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].CheckboxItemIndicator, {
                    className: "-ms-0.5 col-start-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        fill: "none",
                        height: "24",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        viewBox: "0 0 24 24",
                        width: "24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M5.252 12.7 10.2 18.63 18.748 5.37"
                        }, void 0, false, {
                            fileName: "[project]/packages/ui/src/components/menu.tsx",
                            lineNumber: 256,
                            columnNumber: 1496
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/menu.tsx",
                        lineNumber: 256,
                        columnNumber: 1318
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/menu.tsx",
                    lineNumber: 256,
                    columnNumber: 1249
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "col-start-2",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/menu.tsx",
                    lineNumber: 256,
                    columnNumber: 1587
                }, this)
            ]
        }, void 0, true);
        $[10] = children;
        $[11] = variant;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    let t5;
    if ($[13] !== checked || $[14] !== props || $[15] !== t3 || $[16] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].CheckboxItem, {
            checked: checked,
            className: t3,
            "data-slot": "menu-checkbox-item",
            ...props,
            children: t4
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 265,
            columnNumber: 10
        }, this);
        $[13] = checked;
        $[14] = props;
        $[15] = t3;
        $[16] = t4;
        $[17] = t5;
    } else {
        t5 = $[17];
    }
    return t5;
}
_c4 = MenuCheckboxItem;
function MenuRadioGroup(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].RadioGroup, {
            "data-slot": "menu-radio-group",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 286,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c5 = MenuRadioGroup;
function MenuRadioItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let children;
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
    }
    let t1;
    if ($[5] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className);
        $[5] = className;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].RadioItemIndicator, {
            className: "-ms-0.5 col-start-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                fill: "none",
                height: "24",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                width: "24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5.252 12.7 10.2 18.63 18.748 5.37"
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/menu.tsx",
                    lineNumber: 330,
                    columnNumber: 254
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/menu.tsx",
                lineNumber: 330,
                columnNumber: 76
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 330,
            columnNumber: 10
        }, this);
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== children) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "col-start-2",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 337,
            columnNumber: 10
        }, this);
        $[8] = children;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== props || $[11] !== t1 || $[12] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].RadioItem, {
            className: t1,
            "data-slot": "menu-radio-item",
            ...props,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 345,
            columnNumber: 10
        }, this);
        $[10] = props;
        $[11] = t1;
        $[12] = t3;
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    return t4;
}
_c6 = MenuRadioItem;
function MenuGroupLabel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let className;
    let inset;
    let props;
    if ($[1] !== t0) {
        ({ className, inset, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = inset;
        $[4] = props;
    } else {
        className = $[2];
        inset = $[3];
        props = $[4];
    }
    let t1;
    if ($[5] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:ps-9 sm:data-inset:ps-8", className);
        $[5] = className;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] !== inset || $[8] !== props || $[9] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].GroupLabel, {
            className: t1,
            "data-inset": inset,
            "data-slot": "menu-label",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 391,
            columnNumber: 10
        }, this);
        $[7] = inset;
        $[8] = props;
        $[9] = t1;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    return t2;
}
_c7 = MenuGroupLabel;
function MenuSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mx-2 my-1 h-px bg-border", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].Separator, {
            className: t1,
            "data-slot": "menu-separator",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 433,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c8 = MenuSeparator;
function MenuShortcut(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
            className: t1,
            "data-slot": "menu-shortcut",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 474,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c9 = MenuShortcut;
function MenuSub(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].SubmenuRoot, {
            "data-slot": "menu-sub",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 493,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c10 = MenuSub;
function MenuSubTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let children;
    let className;
    let inset;
    let props;
    if ($[1] !== t0) {
        ({ className, inset, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = inset;
        $[5] = props;
    } else {
        children = $[2];
        className = $[3];
        inset = $[4];
        props = $[5];
    }
    let t1;
    if ($[6] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&>svg:not(:last-child)]:-mx-0.5 flex min-h-8 items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-popup-open:bg-accent data-inset:ps-8 data-highlighted:text-accent-foreground data-popup-open:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none", className);
        $[6] = className;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    let t2;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
            className: "-me-0.5 ms-auto opacity-80"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 541,
            columnNumber: 10
        }, this);
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] !== children || $[10] !== inset || $[11] !== props || $[12] !== t1) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$menu$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Menu$3e$__["Menu"].SubmenuTrigger, {
            className: t1,
            "data-inset": inset,
            "data-slot": "menu-sub-trigger",
            ...props,
            children: [
                children,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 548,
            columnNumber: 10
        }, this);
        $[9] = children;
        $[10] = inset;
        $[11] = props;
        $[12] = t1;
        $[13] = t3;
    } else {
        t3 = $[13];
    }
    return t3;
}
_c11 = MenuSubTrigger;
function MenuSubPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97a31e79b4b2470fd1daecee1a2fcdbdb8846b045ba73c1b737f9b61a50d2921";
    }
    let alignOffset;
    let className;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, sideOffset: t1, alignOffset, align: t2, ...props } = t0);
        $[1] = t0;
        $[2] = alignOffset;
        $[3] = className;
        $[4] = props;
        $[5] = t1;
        $[6] = t2;
    } else {
        alignOffset = $[2];
        className = $[3];
        props = $[4];
        t1 = $[5];
        t2 = $[6];
    }
    const sideOffset = t1 === undefined ? 0 : t1;
    const align = t2 === undefined ? "start" : t2;
    const defaultAlignOffset = align !== "center" ? -5 : undefined;
    const t3 = alignOffset ?? defaultAlignOffset;
    let t4;
    if ($[7] !== align || $[8] !== className || $[9] !== props || $[10] !== sideOffset || $[11] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuPopup, {
            align: align,
            alignOffset: t3,
            className: className,
            "data-slot": "menu-sub-content",
            side: "inline-end",
            sideOffset: sideOffset,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/menu.tsx",
            lineNumber: 599,
            columnNumber: 10
        }, this);
        $[7] = align;
        $[8] = className;
        $[9] = props;
        $[10] = sideOffset;
        $[11] = t3;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    return t4;
}
_c12 = MenuSubPopup;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "MenuTrigger");
__turbopack_context__.k.register(_c1, "MenuPopup");
__turbopack_context__.k.register(_c2, "MenuGroup");
__turbopack_context__.k.register(_c3, "MenuItem");
__turbopack_context__.k.register(_c4, "MenuCheckboxItem");
__turbopack_context__.k.register(_c5, "MenuRadioGroup");
__turbopack_context__.k.register(_c6, "MenuRadioItem");
__turbopack_context__.k.register(_c7, "MenuGroupLabel");
__turbopack_context__.k.register(_c8, "MenuSeparator");
__turbopack_context__.k.register(_c9, "MenuShortcut");
__turbopack_context__.k.register(_c10, "MenuSub");
__turbopack_context__.k.register(_c11, "MenuSubTrigger");
__turbopack_context__.k.register(_c12, "MenuSubPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Table(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let containerClassName;
    let props;
    if ($[1] !== t0) {
        ({ className, containerClassName, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = containerClassName;
        $[4] = props;
    } else {
        className = $[2];
        containerClassName = $[3];
        props = $[4];
    }
    let t1;
    if ($[5] !== containerClassName) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full overflow-x-auto", containerClassName);
        $[5] = containerClassName;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom in-data-[slot=frame]:border-separate in-data-[slot=frame]:border-spacing-0 text-sm", className);
        $[7] = className;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] !== props || $[10] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: t2,
            "data-slot": "table",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, this);
        $[9] = props;
        $[10] = t2;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== t1 || $[13] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "table-container",
            children: t3
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[12] = t1;
        $[13] = t3;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    return t4;
}
_c = Table;
function TableHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b in-data-[slot=frame]:**:[th]:h-9 in-data-[slot=frame]:*:[tr]:border-none in-data-[slot=frame]:*:[tr]:hover:bg-transparent", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            className: t1,
            "data-slot": "table-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 98,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c1 = TableHeader;
function TableBody(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative in-data-[slot=frame]:rounded-xl in-data-[slot=frame]:shadow-xs/5 before:pointer-events-none before:absolute before:inset-px not-in-data-[slot=frame]:before:hidden before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/8%)] [&_tr:last-child]:border-0 in-data-[slot=frame]:*:[tr]:border-0 in-data-[slot=frame]:*:[tr]:*:[td]:border-b in-data-[slot=frame]:*:[tr]:*:[td]:bg-background in-data-[slot=frame]:*:[tr]:*:[td]:bg-clip-padding in-data-[slot=frame]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[slot=frame]:*:[tr]:*:[td]:first:border-s in-data-[slot=frame]:*:[tr]:first:*:[td]:border-t in-data-[slot=frame]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[slot=frame]:*:[tr]:*:[td]:last:border-e in-data-[slot=frame]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[slot=frame]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[slot=frame]:*:[tr]:hover:*:[td]:bg-transparent in-data-[slot=frame]:*:[tr]:data-[state=selected]:*:[td]:bg-muted/72", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
            className: t1,
            "data-slot": "table-body",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 139,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = TableBody;
function TableFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t in-data-[slot=frame]:border-none bg-muted/72 in-data-[slot=frame]:bg-transparent font-medium [&>tr]:last:border-b-0 in-data-[slot=frame]:*:[tr]:hover:bg-transparent", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
            className: t1,
            "data-slot": "table-footer",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 180,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = TableFooter;
function TableRow(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors hover:bg-muted/72 in-data-[slot=frame]:hover:bg-transparent data-[state=selected]:bg-muted/72 in-data-[slot=frame]:data-[state=selected]:bg-transparent", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
            className: t1,
            "data-slot": "table-row",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 221,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c4 = TableRow;
function TableHead(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
            className: t1,
            "data-slot": "table-head",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 262,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c5 = TableHead;
function TableCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("whitespace-nowrap p-2.5 align-middle leading-none in-data-[slot=frame]:first:p-[calc(--spacing(2.5)-1px)] in-data-[slot=frame]:last:p-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:pe-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
            className: t1,
            "data-slot": "table-cell",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 303,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c6 = TableCell;
function TableCaption(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f1a0af350848ff7ff1448f13c292f79af4c04c517588f6716a397bfa2e8d1e9d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("in-data-[slot=frame]:my-4 mt-4 text-muted-foreground text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
            className: t1,
            "data-slot": "table-caption",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/table.tsx",
            lineNumber: 344,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c7 = TableCaption;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Table");
__turbopack_context__.k.register(_c1, "TableHeader");
__turbopack_context__.k.register(_c2, "TableBody");
__turbopack_context__.k.register(_c3, "TableFooter");
__turbopack_context__.k.register(_c4, "TableRow");
__turbopack_context__.k.register(_c5, "TableHead");
__turbopack_context__.k.register(_c6, "TableCell");
__turbopack_context__.k.register(_c7, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/actions/data:17875c [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signCdnUrl",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40438929adcb230af27d8f2e649fe94f2f2c457659":"signCdnUrl"},"apps/app/actions/cdn.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40438929adcb230af27d8f2e649fe94f2f2c457659", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "signCdnUrl");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vY2RuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2lnbmVkVXJsIH0gZnJvbSAnQGF3cy1zZGsvY2xvdWRmcm9udC1zaWduZXInO1xuaW1wb3J0IHsgYXV0aCB9IGZyb20gJ0BjbGVyay9uZXh0anMvc2VydmVyJztcblxuY29uc3QgdHJhaWxpbmdTbGFzaCA9IC9cXC8kLztcblxuZnVuY3Rpb24gYnVpbGRTaWduZWRVcmwoczNLZXk6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19DRE5fVVJMO1xuXHRjb25zdCBrZXlQYWlySWQgPSBwcm9jZXNzLmVudi5DRE5fS0VZX1BBSVJfSUQ7XG5cdGNvbnN0IHByaXZhdGVLZXkgPSBwcm9jZXNzLmVudi5DRE5fUFJJVkFURV9LRVk/LnJlcGxhY2UoL1xcXFxuL2csICdcXG4nKTtcblxuXHRpZiAoIShiYXNlVXJsICYmIGtleVBhaXJJZCAmJiBwcml2YXRlS2V5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyBDRE4gY29uZmlndXJhdGlvbicpO1xuXHR9XG5cblx0Y29uc3QgdXJsID0gYCR7YmFzZVVybC5yZXBsYWNlKHRyYWlsaW5nU2xhc2gsICcnKX0vJHtzM0tleX1gO1xuXHRyZXR1cm4gZ2V0U2lnbmVkVXJsKHtcblx0XHR1cmwsXG5cdFx0a2V5UGFpcklkLFxuXHRcdHByaXZhdGVLZXksXG5cdFx0ZGF0ZUxlc3NUaGFuOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgM182MDBfMDAwKS50b0lTT1N0cmluZygpLFxuXHR9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25DZG5VcmwoczNLZXk6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG5cdGNvbnN0IHsgdXNlcklkIH0gPSBhd2FpdCBhdXRoKCk7XG5cdGlmICghdXNlcklkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdVbmF1dGhvcml6ZWQnKTtcblx0fVxuXHRyZXR1cm4gYnVpbGRTaWduZWRVcmwoczNLZXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbkNkblVybHMoXG5cdHMzS2V5czogc3RyaW5nW11cbik6IFByb21pc2U8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4ge1xuXHRjb25zdCB7IHVzZXJJZCB9ID0gYXdhaXQgYXV0aCgpO1xuXHRpZiAoIXVzZXJJZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignVW5hdXRob3JpemVkJyk7XG5cdH1cblx0Y29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cdGZvciAoY29uc3Qga2V5IG9mIHMzS2V5cykge1xuXHRcdHJlc3VsdFtrZXldID0gYnVpbGRTaWduZWRVcmwoa2V5KTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDZG5JbWFnZXNBc0RhdGFVcmxzKFxuXHRzM0tleXM6IHN0cmluZ1tdXG4pOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIHN0cmluZz4+IHtcblx0Y29uc3QgeyB1c2VySWQgfSA9IGF3YWl0IGF1dGgoKTtcblx0aWYgKCF1c2VySWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VuYXV0aG9yaXplZCcpO1xuXHR9XG5cdGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRzM0tleXMubWFwKGFzeW5jIChrZXkpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHVybCA9IGJ1aWxkU2lnbmVkVXJsKGtleSk7XG5cdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcblx0XHRcdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuXHRcdFx0XHRpZiAoIWJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID1cblx0XHRcdFx0XHRyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgPz8gJ2ltYWdlL2pwZWcnO1xuXHRcdFx0XHRjb25zdCBiYXNlNjQgPSBCdWZmZXIuZnJvbShidWZmZXIpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBgZGF0YToke2NvbnRlbnRUeXBlfTtiYXNlNjQsJHtiYXNlNjR9YDtcblx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHQvLyBza2lwIGltYWdlcyB0aGF0IGZhaWwgdG8gZmV0Y2hcblx0XHRcdH1cblx0XHR9KVxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJzUkF5QnNCLHVMQUFBIn0=
}),
"[project]/apps/app/lib/client/files.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileIcon",
    ()=>FileIcon,
    "formatDate",
    ()=>formatDate,
    "formatFileSize",
    ()=>formatFileSize,
    "getOpenUrl",
    ()=>getOpenUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
;
;
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(timestamp) {
    return new Intl.DateTimeFormat('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(timestamp));
}
function iconFor(mimeType) {
    if (!mimeType) {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
            className: 'text-muted-foreground'
        };
    }
    if (mimeType.includes('pdf')) {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            className: 'text-red-500'
        };
    }
    if (mimeType.startsWith('image/')) {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
            className: 'text-blue-500'
        };
    }
    if (mimeType.includes('wordprocessingml') || mimeType === 'application/msword') {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            className: 'text-blue-600'
        };
    }
    if (mimeType.includes('spreadsheetml') || mimeType === 'application/vnd.ms-excel') {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
            className: 'text-green-600'
        };
    }
    if (mimeType.includes('presentationml') || mimeType === 'application/vnd.ms-powerpoint') {
        return {
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
            className: 'text-orange-500'
        };
    }
    return {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
        className: 'text-muted-foreground'
    };
}
function FileIcon(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "73c44dd08b38207eeb4b044b959413f10ed5fd58dc4dc68ac44eb1adfb5d8c92") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "73c44dd08b38207eeb4b044b959413f10ed5fd58dc4dc68ac44eb1adfb5d8c92";
    }
    const { mimeType } = t0;
    let t1;
    if ($[1] !== mimeType) {
        t1 = iconFor(mimeType);
        $[1] = mimeType;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const { Icon, className } = t1;
    const t2 = `size-4 ${className}`;
    let t3;
    if ($[3] !== Icon || $[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: t2
        }, void 0, false, {
            fileName: "[project]/apps/app/lib/client/files.tsx",
            lineNumber: 90,
            columnNumber: 10
        }, this);
        $[3] = Icon;
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = FileIcon;
const OFFICE_MIME_TYPES = new Set([
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint'
]);
function getOpenUrl(mimeType, signedUrl) {
    if (mimeType && OFFICE_MIME_TYPES.has(mimeType)) {
        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(signedUrl)}`;
    }
    return signedUrl;
}
var _c;
__turbopack_context__.k.register(_c, "FileIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getConvexErrorCode",
    ()=>getConvexErrorCode,
    "getConvexErrorMessage",
    ()=>getConvexErrorMessage
]);
const EMBEDDED_JSON_PATTERN = /\{[\s\S]*?\}/;
function messageFromParsedConvexError(value) {
    if (!value || typeof value !== 'object') {
        return null;
    }
    const parsed = value;
    if (typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message.trim();
    }
    if (parsed.code === 'CATEGORY_NAME_EXISTS') {
        return 'A category with this name already exists';
    }
    if (parsed.code === 'CATEGORY_CODE_EXISTS') {
        return 'A category with this code already exists';
    }
    return null;
}
function codeFromParsedConvexError(value) {
    if (!value || typeof value !== 'object') {
        return null;
    }
    const parsed = value;
    return typeof parsed.code === 'string' && parsed.code.trim() ? parsed.code : null;
}
function parseEmbeddedConvexErrorMessage(text) {
    const jsonMatch = text.match(EMBEDDED_JSON_PATTERN);
    if (!jsonMatch) {
        return null;
    }
    try {
        const parsed = JSON.parse(jsonMatch[0]);
        return messageFromParsedConvexError(parsed);
    } catch  {
        return null;
    }
}
function parseEmbeddedConvexErrorCode(text) {
    const jsonMatch = text.match(EMBEDDED_JSON_PATTERN);
    if (!jsonMatch) {
        return null;
    }
    try {
        const parsed = JSON.parse(jsonMatch[0]);
        return codeFromParsedConvexError(parsed);
    } catch  {
        return null;
    }
}
function extractConvexErrorMessage(error) {
    if (error instanceof Error && error.message) {
        const message = error.message.trim();
        const parsedMessage = parseEmbeddedConvexErrorMessage(message);
        if (parsedMessage) {
            return parsedMessage;
        }
        return message;
    }
    if (typeof error === 'string' && error.trim()) {
        return error.trim();
    }
    if (error && typeof error === 'object' && 'message' in error) {
        const objectMessage = error.message;
        const parsedMessage = messageFromParsedConvexError(error);
        if (parsedMessage) {
            return parsedMessage;
        }
        if (typeof objectMessage === 'string') {
            const jsonMessage = parseEmbeddedConvexErrorMessage(objectMessage);
            if (jsonMessage) {
                return jsonMessage;
            }
            if (objectMessage.trim()) {
                return objectMessage.trim();
            }
        }
    }
    return null;
}
function getConvexErrorCode(error) {
    if (error instanceof Error && error.message) {
        return parseEmbeddedConvexErrorCode(error.message.trim());
    }
    if (error && typeof error === 'object') {
        return codeFromParsedConvexError(error);
    }
    return null;
}
function getConvexErrorMessage(error, fallback) {
    return extractConvexErrorMessage(error) ?? fallback;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/projects/project-documents-tab-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectDocumentsTabContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/empty.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/menu.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as EllipsisVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$17875c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/app/actions/data:17875c [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/client/files.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
async function downloadDocument(doc) {
    try {
        const signedUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$17875c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signCdnUrl"])(doc.s3Key);
        window.open((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOpenUrl"])(doc.mimeType, signedUrl), '_blank', 'noopener');
    } catch  {
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
            title: 'Could not generate download link',
            description: 'Please try again.',
            type: 'error'
        });
    }
}
function DocumentRowActions(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "12971341c1c53aca270f968476fd6f4f792b854eb01e137312118606ab71803f") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "12971341c1c53aca270f968476fd6f4f792b854eb01e137312118606ab71803f";
    }
    const { doc } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuTrigger"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                "aria-label": "Document actions",
                size: "icon-sm",
                type: "button",
                variant: "ghost"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 50,
                columnNumber: 31
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__["EllipsisVertical"], {
                className: "size-4"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 50,
                columnNumber: 118
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 50,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== doc) {
        t2 = ({
            "DocumentRowActions[<MenuItem>.onClick]": ()=>downloadDocument(doc).catch(_DocumentRowActionsMenuItemOnClickAnonymous)
        })["DocumentRowActions[<MenuItem>.onClick]"];
        $[2] = doc;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Menu"], {
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuPopup"], {
                    align: "end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuItem"], {
                        onClick: t2,
                        children: [
                            t3,
                            "Download"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 74,
                        columnNumber: 43
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 74,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 74,
            columnNumber: 10
        }, this);
        $[5] = t2;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    return t4;
}
_c = DocumentRowActions;
function _DocumentRowActionsMenuItemOnClickAnonymous() {}
function UploadDialog({ open, onOpenChange, projectId }) {
    _s();
    const generateUploadUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.documents.generateUploadUrl.generateUploadUrl);
    const createDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.documents.create.create);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const onInputChange = (e)=>{
        const files = Array.from(e.target.files ?? []);
        setPending((prev)=>[
                ...prev,
                ...files.map((file)=>({
                        file,
                        status: 'pending'
                    }))
            ]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const removeFile = (index)=>{
        setPending((prev_0)=>prev_0.filter((_, i)=>i !== index));
    };
    const onUpload = async ()=>{
        setUploading(true);
        let hasError = false;
        for(let i_0 = 0; i_0 < pending.length; i_0++){
            const entry = pending[i_0];
            if (entry.status === 'done') {
                continue;
            }
            setPending((prev_1)=>prev_1.map((e_0, idx)=>idx === i_0 ? {
                        ...e_0,
                        status: 'uploading'
                    } : e_0));
            try {
                const contentType = entry.file.type || 'application/octet-stream';
                const { uploadUrl, s3Key, kebabName } = await generateUploadUrl({
                    projectId,
                    fileName: entry.file.name,
                    contentType
                });
                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: entry.file,
                    headers: {
                        'Content-Type': contentType
                    }
                });
                await createDocument({
                    projectId,
                    name: entry.file.name,
                    kebabName,
                    s3Key,
                    size: entry.file.size,
                    mimeType: entry.file.type || undefined
                });
                setPending((prev_3)=>prev_3.map((e_2, idx_1)=>idx_1 === i_0 ? {
                            ...e_2,
                            status: 'done'
                        } : e_2));
            } catch (error) {
                hasError = true;
                setPending((prev_2)=>prev_2.map((e_1, idx_0)=>idx_0 === i_0 ? {
                            ...e_1,
                            status: 'error',
                            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, 'Upload failed')
                        } : e_1));
            }
        }
        setUploading(false);
        if (!hasError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Upload complete',
                type: 'success'
            });
            setPending([]);
            onOpenChange(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Dialog"], {
        onOpenChange: (next)=>{
            if (!uploading) {
                onOpenChange(next);
                if (!next) {
                    setPending([]);
                }
            }
        },
        open: open,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogContent"], {
            className: "sm:max-w-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTitle"], {
                            children: "Upload documents"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 181,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogDescription"], {
                            children: "Files are added to your project and shared with the builder."
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 182,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 180,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center",
                            onClick: ()=>inputRef.current?.click(),
                            type: "button",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    className: "size-5 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                    lineNumber: 188,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-primary",
                                            children: "Click to upload"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 190,
                                            columnNumber: 8
                                        }, this),
                                        " or drag and drop"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                    lineNumber: 189,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 187,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "sr-only",
                            multiple: true,
                            onChange: onInputChange,
                            ref: inputRef,
                            type: "file"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 194,
                            columnNumber: 6
                        }, this),
                        pending.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-2",
                            children: pending.map((entry_0, i_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileIcon"], {
                                            mimeType: entry_0.file.type
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 197,
                                            columnNumber: 10
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "truncate font-medium text-sm",
                                                    children: entry_0.file.name
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-muted-foreground text-xs",
                                                    children: [
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFileSize"])(entry_0.file.size),
                                                        entry_0.status === 'uploading' && ' · Uploading…',
                                                        entry_0.status === 'done' && ' · Done',
                                                        entry_0.status === 'error' && ` · ${entry_0.error}`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 198,
                                            columnNumber: 10
                                        }, this),
                                        entry_0.status === 'pending' && !uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "aria-label": "Remove file",
                                            onClick: ()=>removeFile(i_1),
                                            type: "button",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "size-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                                lineNumber: 210,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 209,
                                            columnNumber: 56
                                        }, this) : null
                                    ]
                                }, `${entry_0.file.name}-${i_1}`, true, {
                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                    lineNumber: 196,
                                    columnNumber: 39
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 195,
                            columnNumber: 28
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 186,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogClose"], {
                            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                disabled: uploading,
                                type: "button",
                                variant: "outline",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                lineNumber: 216,
                                columnNumber: 27
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 216,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            disabled: uploading || pending.length === 0,
                            onClick: ()=>onUpload().catch(()=>undefined),
                            type: "button",
                            children: "Upload"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 219,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 215,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 179,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
        lineNumber: 171,
        columnNumber: 10
    }, this);
}
_s(UploadDialog, "nGs+tfXXjHbEOGbhvWIroRAi+vY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c1 = UploadDialog;
function ProjectDocumentsTabContent(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "12971341c1c53aca270f968476fd6f4f792b854eb01e137312118606ab71803f") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "12971341c1c53aca270f968476fd6f4f792b854eb01e137312118606ab71803f";
    }
    const { projectId } = t0;
    let t1;
    if ($[1] !== projectId) {
        t1 = {
            projectId
        };
        $[1] = projectId;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const documents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.documents.list.list, t1);
    const [uploadOpen, setUploadOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "font-medium text-lg",
            children: "Documents"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 251,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "ProjectDocumentsTabContent[<Button>.onClick]": ()=>setUploadOpen(true)
        })["ProjectDocumentsTabContent[<Button>.onClick]"];
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between gap-3",
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: t3,
                    type: "button",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {}, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 267,
                            columnNumber: 106
                        }, this),
                        "Upload"
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 267,
                    columnNumber: 71
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 267,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== documents) {
        t5 = documents === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-muted-foreground text-sm",
            children: "Loading documents…"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 274,
            columnNumber: 36
        }, this) : null;
        $[6] = documents;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] !== documents) {
        t6 = documents && documents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Empty"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyMedia"], {
                        variant: "icon",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 282,
                            columnNumber: 95
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 282,
                        columnNumber: 68
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyTitle"], {
                        children: "No documents yet"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 282,
                        columnNumber: 139
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyDescription"], {
                        children: "Documents shared with you will appear here. You can also upload your own."
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 282,
                        columnNumber: 180
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 282,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 282,
            columnNumber: 48
        }, this) : null;
        $[8] = documents;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== documents) {
        t7 = documents && documents.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3 md:hidden",
                    children: documents.map(_ProjectDocumentsTabContentDocumentsMap)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 290,
                    columnNumber: 48
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:block",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            className: "min-w-[16rem]",
                                            children: "Name"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 290,
                                            columnNumber: 239
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            children: "Size"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 290,
                                            columnNumber: 292
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            children: "Uploaded"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 290,
                                            columnNumber: 319
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            className: "w-12 min-w-12 max-w-12",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                                lineNumber: 290,
                                                columnNumber: 396
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                            lineNumber: 290,
                                            columnNumber: 350
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                    lineNumber: 290,
                                    columnNumber: 229
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                lineNumber: 290,
                                columnNumber: 216
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                children: documents.map(_ProjectDocumentsTabContentDocumentsMap2)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                lineNumber: 290,
                                columnNumber: 473
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 290,
                        columnNumber: 190
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 290,
                    columnNumber: 157
                }, this)
            ]
        }, void 0, true) : null;
        $[10] = documents;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== projectId || $[13] !== uploadOpen) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadDialog, {
            onOpenChange: setUploadOpen,
            open: uploadOpen,
            projectId: projectId
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 298,
            columnNumber: 10
        }, this);
        $[12] = projectId;
        $[13] = uploadOpen;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t5 || $[16] !== t6 || $[17] !== t7 || $[18] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-0 flex-1 flex-col gap-4",
            children: [
                t4,
                t5,
                t6,
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
            lineNumber: 307,
            columnNumber: 10
        }, this);
        $[15] = t5;
        $[16] = t6;
        $[17] = t7;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    return t9;
}
_s1(ProjectDocumentsTabContent, "bhPSd2+Jp2xounVmM703KA8zbQY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c2 = ProjectDocumentsTabContent;
function _ProjectDocumentsTabContentDocumentsMap2(doc_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
        className: "cursor-pointer",
        onClick: {
            "ProjectDocumentsTabContent[documents.map() > <TableRow>.onClick]": ()=>downloadDocument(doc_0).catch(_ProjectDocumentsTabContentDocumentsMapTableRowOnClickAnonymous)
        }["ProjectDocumentsTabContent[documents.map() > <TableRow>.onClick]"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "font-medium",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileIcon"], {
                            mimeType: doc_0.mimeType
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 321,
                            columnNumber: 150
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: doc_0.name
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                            lineNumber: 321,
                            columnNumber: 188
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 321,
                    columnNumber: 109
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 321,
                columnNumber: 74
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "text-muted-foreground text-sm",
                children: doc_0.size != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFileSize"])(doc_0.size) : "\u2014"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 321,
                columnNumber: 231
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "text-muted-foreground text-sm",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(doc_0.uploadedAt)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 321,
                columnNumber: 356
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "w-12",
                onClick: _ProjectDocumentsTabContentDocumentsMapTableCellOnClick,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentRowActions, {
                        doc: doc_0
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 321,
                        columnNumber: 579
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                    lineNumber: 321,
                    columnNumber: 545
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 321,
                columnNumber: 451
            }, this)
        ]
    }, doc_0._id, true, {
        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
        lineNumber: 319,
        columnNumber: 10
    }, this);
}
function _ProjectDocumentsTabContentDocumentsMapTableCellOnClick(e) {
    return e.stopPropagation();
}
function _ProjectDocumentsTabContentDocumentsMapTableRowOnClickAnonymous() {}
function _ProjectDocumentsTabContentDocumentsMap(doc) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start justify-between gap-3 rounded-lg border bg-card p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "flex min-w-0 items-start gap-2 text-left",
                onClick: {
                    "ProjectDocumentsTabContent[documents.map() > <button>.onClick]": ()=>downloadDocument(doc).catch(_ProjectDocumentsTabContentDocumentsMapButtonOnClickAnonymous)
                }["ProjectDocumentsTabContent[documents.map() > <button>.onClick]"],
                type: "button",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileIcon"], {
                        mimeType: doc.mimeType
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 330,
                        columnNumber: 88
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate font-medium",
                                children: doc.name
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                lineNumber: 330,
                                columnNumber: 149
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground text-xs",
                                children: [
                                    doc.size != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFileSize"])(doc.size) : "\u2014",
                                    " ·",
                                    " ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(doc.uploadedAt)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                                lineNumber: 330,
                                columnNumber: 199
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                        lineNumber: 330,
                        columnNumber: 124
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 328,
                columnNumber: 110
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentRowActions, {
                doc: doc
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
                lineNumber: 330,
                columnNumber: 354
            }, this)
        ]
    }, doc._id, true, {
        fileName: "[project]/apps/app/components/client/projects/project-documents-tab-content.tsx",
        lineNumber: 328,
        columnNumber: 10
    }, this);
}
function _ProjectDocumentsTabContentDocumentsMapButtonOnClickAnonymous() {}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DocumentRowActions");
__turbopack_context__.k.register(_c1, "UploadDialog");
__turbopack_context__.k.register(_c2, "ProjectDocumentsTabContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertAction",
    ()=>AlertAction,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-card-foreground text-sm has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>svg]:gap-x-2 [&>svg]:h-lh [&>svg]:w-4", {
    defaultVariants: {
        variant: "default"
    },
    variants: {
        variant: {
            default: "bg-transparent dark:bg-input/32 [&>svg]:text-muted-foreground",
            error: "border-destructive/32 bg-destructive/4 [&>svg]:text-destructive",
            info: "border-info/32 bg-info/4 [&>svg]:text-info",
            success: "border-success/32 bg-success/4 [&>svg]:text-success",
            warning: "border-warning/32 bg-warning/4 [&>svg]:text-warning"
        }
    }
});
function Alert(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d";
    }
    let className;
    let props;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = variant;
    } else {
        className = $[2];
        props = $[3];
        variant = $[4];
    }
    let t1;
    if ($[5] !== className || $[6] !== variant) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className);
        $[5] = className;
        $[6] = variant;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    let t2;
    if ($[8] !== props || $[9] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "alert",
            role: "alert",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        $[8] = props;
        $[9] = t1;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    return t2;
}
_c = Alert;
function AlertTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-medium [svg~&]:col-start-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "alert-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert.tsx",
            lineNumber: 99,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c1 = AlertTitle;
function AlertDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2.5 text-muted-foreground [svg~&]:col-start-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "alert-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert.tsx",
            lineNumber: 140,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = AlertDescription;
function AlertAction(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "77fd674498138353b238fad3f592ea7eb127c4e36d95daa1014fa11d00c7db2d";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-slot=alert-description]~&]:col-start-2 sm:[[data-slot=alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-slot=alert-description]~&]:col-start-3 sm:[svg~[data-slot=alert-title]~&]:col-start-3", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "alert-action",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert.tsx",
            lineNumber: 181,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = AlertAction;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Alert");
__turbopack_context__.k.register(_c1, "AlertTitle");
__turbopack_context__.k.register(_c2, "AlertDescription");
__turbopack_context__.k.register(_c3, "AlertAction");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/merge-props/mergeProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/use-render/useRender.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11", {
    defaultVariants: {
        size: "default",
        variant: "default"
    },
    variants: {
        size: {
            default: "h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs",
            lg: "h-6.5 min-w-6.5 px-[calc(--spacing(1.5)-1px)] text-base sm:h-5.5 sm:min-w-5.5 sm:text-sm",
            sm: "h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]"
        },
        variant: {
            default: "bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90",
            destructive: "bg-destructive text-white [button&,a&]:hover:bg-destructive/90",
            "destructive-outline": "border-destructive/32 bg-background text-destructive-foreground dark:bg-input/32",
            error: "bg-destructive/8 text-destructive-foreground dark:bg-destructive/16",
            info: "bg-info/8 text-info-foreground dark:bg-info/16",
            outline: "border-input bg-background text-foreground dark:bg-input/32 [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48",
            secondary: "bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90",
            success: "bg-success/8 text-success-foreground dark:bg-success/16",
            "success-outline": "border-success/32 bg-background text-success-foreground dark:bg-input/32",
            teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
            purple: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
            yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
            warning: "bg-warning/8 text-warning-foreground dark:bg-warning/16"
        }
    }
});
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "9ca717744d4a3c7b1935450ae80e5d533a2a162e39727964b01e4e174ae161eb") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9ca717744d4a3c7b1935450ae80e5d533a2a162e39727964b01e4e174ae161eb";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, variant, size, render: t4, ...props } = t0;
        render = t4;
        const defaultProps = {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
                className,
                size,
                variant
            })),
            "data-slot": "badge"
        };
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "span";
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])(defaultProps, props);
        $[1] = t0;
        $[2] = render;
        $[3] = t1;
        $[4] = t2;
        $[5] = t3;
    } else {
        render = $[2];
        t1 = $[3];
        t2 = $[4];
        t3 = $[5];
    }
    let t4;
    if ($[6] !== render || $[7] !== t1 || $[8] !== t2) {
        t4 = {
            defaultTagName: t1,
            props: t2,
            render
        };
        $[6] = render;
        $[7] = t1;
        $[8] = t2;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    return t3(t4);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Frame",
    ()=>Frame,
    "FrameDescription",
    ()=>FrameDescription,
    "FrameFooter",
    ()=>FrameFooter,
    "FrameHeader",
    ()=>FrameHeader,
    "FramePanel",
    ()=>FramePanel,
    "FrameTitle",
    ()=>FrameTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Frame(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex flex-col rounded-2xl bg-muted/72 p-1", "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "frame",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Frame;
function FramePanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative rounded-xl border bg-background bg-clip-padding p-5 shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "frame-panel",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c1 = FramePanel;
function FrameHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col px-5 py-4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: t1,
            "data-slot": "frame-panel-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 118,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = FrameHeader;
function FrameTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "frame-panel-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 159,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = FrameTitle;
function FrameDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "frame-panel-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 200,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c4 = FrameDescription;
function FrameFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7d1951a27a7f3358b0684f85e3811b8149e644d24a2d6c3a04e68e296a78bd78";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-5 py-4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
            className: t1,
            "data-slot": "frame-panel-footer",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/frame.tsx",
            lineNumber: 241,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c5 = FrameFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Frame");
__turbopack_context__.k.register(_c1, "FramePanel");
__turbopack_context__.k.register(_c2, "FrameHeader");
__turbopack_context__.k.register(_c3, "FrameTitle");
__turbopack_context__.k.register(_c4, "FrameDescription");
__turbopack_context__.k.register(_c5, "FrameFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/textarea.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/field/index.parts.js [app-client] (ecmascript) <export * as Field>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/merge-props/mergeProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function Textarea(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "56caf789991ddcd21606e18eb413deae6488405a4ec3944bfaf0085d68ceee67") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56caf789991ddcd21606e18eb413deae6488405a4ec3944bfaf0085d68ceee67";
    }
    let className;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, size: t1, unstyled: t2, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
        $[5] = t2;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
        t2 = $[5];
    }
    const size = t1 === undefined ? "default" : t1;
    const unstyled = t2 === undefined ? false : t2;
    let t3;
    if ($[6] !== className || $[7] !== unstyled) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(!unstyled && "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]", className) || undefined;
        $[6] = className;
        $[7] = unstyled;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== props || $[10] !== size) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Control, {
            render: {
                "Textarea[<FieldPrimitive.Control>.render]": (defaultProps)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] outline-none max-sm:min-h-20.5", size === "sm" && "min-h-16.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] max-sm:min-h-19.5", size === "lg" && "min-h-18.5 py-[calc(--spacing(2)-1px)] max-sm:min-h-21.5"),
                        "data-slot": "textarea",
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])(defaultProps, props)
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/textarea.tsx",
                        lineNumber: 56,
                        columnNumber: 68
                    }, void 0)
            }["Textarea[<FieldPrimitive.Control>.render]"]
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/textarea.tsx",
            lineNumber: 55,
            columnNumber: 10
        }, this);
        $[9] = props;
        $[10] = size;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== size || $[13] !== t3 || $[14] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t3,
            "data-size": size,
            "data-slot": "textarea-control",
            children: t4
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/textarea.tsx",
            lineNumber: 66,
            columnNumber: 10
        }, this);
        $[12] = size;
        $[13] = t3;
        $[14] = t4;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    return t5;
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/input-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputGroup",
    ()=>InputGroup,
    "InputGroupAddon",
    ()=>InputGroupAddon,
    "InputGroupInput",
    ()=>InputGroupInput,
    "InputGroupText",
    ()=>InputGroupText,
    "InputGroupTextarea",
    ()=>InputGroupTextarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/textarea.tsx [app-client] (ecmascript) <locals>");
"use client";
;
;
;
;
;
;
function InputGroup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex w-full min-w-0 items-center rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-[input:disabled,textarea:disabled]:not-has-[input:focus-visible,textarea:focus-visible]:not-has-[input[aria-invalid],textarea[aria-invalid]]:before:shadow-[0_1px_--theme(--color-black/4%)] has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:border-destructive/64 has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/16 has-[textarea]:h-auto has-data-[align=block-end]:h-auto has-data-[align=block-start]:h-auto has-data-[align=block-end]:flex-col has-data-[align=block-start]:flex-col has-[input:focus-visible,textarea:focus-visible]:border-ring has-[input[aria-invalid],textarea[aria-invalid]]:border-destructive/36 has-autofill:bg-foreground/4 has-[input:disabled,textarea:disabled]:opacity-64 has-[input:disabled,textarea:disabled,input:focus-visible,textarea:focus-visible,input[aria-invalid],textarea[aria-invalid]]:shadow-none has-[input:focus-visible,textarea:focus-visible]:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/24 dark:not-has-[input:disabled,textarea:disabled]:not-has-[input:focus-visible,textarea:focus-visible]:not-has-[input[aria-invalid],textarea[aria-invalid]]:before:shadow-[0_-1px_--theme(--color-white/6%)] has-data-[align=inline-start]:**:[[data-size=sm]_input]:ps-1.5 has-data-[align=inline-end]:**:[[data-size=sm]_input]:pe-1.5 *:[[data-slot=input-control],[data-slot=textarea-control]]:contents *:[[data-slot=input-control],[data-slot=textarea-control]]:before:hidden has-[[data-align=block-start],[data-align=block-end]]:**:[input]:h-auto has-data-[align=inline-start]:**:[input]:ps-2 has-data-[align=inline-end]:**:[input]:pe-2 has-data-[align=block-end]:**:[input]:pt-1.5 has-data-[align=block-start]:**:[input]:pb-1.5 **:[textarea]:min-h-20.5 **:[textarea]:resize-none **:[textarea]:py-[calc(--spacing(3)-1px)] **:[textarea]:max-sm:min-h-23.5 **:[textarea_button]:rounded-[calc(var(--radius-md)-1px)]", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "input-group",
            role: "group",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input-group.tsx",
            lineNumber: 41,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = InputGroup;
const inputGroupAddonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("[&_svg]:-mx-0.5 flex h-auto cursor-text select-none items-center justify-center gap-2 leading-none [&>kbd]:rounded-[calc(var(--radius)-5px)] in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4 not-has-[button]:**:[svg:not([class*='opacity-'])]:opacity-80", {
    defaultVariants: {
        align: "inline-start"
    },
    variants: {
        align: {
            "block-end": "order-last w-full justify-start px-[calc(--spacing(3)-1px)] pb-[calc(--spacing(3)-1px)] [.border-t]:pt-[calc(--spacing(3)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
            "block-start": "order-first w-full justify-start px-[calc(--spacing(3)-1px)] pt-[calc(--spacing(3)-1px)] [.border-b]:pb-[calc(--spacing(3)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
            "inline-end": "has-[>:last-child[data-slot=badge]]:-me-1.5 has-[>button]:-me-2 order-last pe-[calc(--spacing(3)-1px)] has-[>kbd:last-child]:me-[-0.35rem] [[data-size=sm]+&]:pe-[calc(--spacing(2.5)-1px)]",
            "inline-start": "has-[>:last-child[data-slot=badge]]:-ms-1.5 has-[>button]:-ms-2 order-first ps-[calc(--spacing(3)-1px)] has-[>kbd:last-child]:ms-[-0.35rem] [[data-size=sm]+&]:ps-[calc(--spacing(2.5)-1px)]"
        }
    }
});
function InputGroupAddon(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, align: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const align = t1 === undefined ? "inline-start" : t1;
    let t2;
    if ($[5] !== align || $[6] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(inputGroupAddonVariants({
            align
        }), className);
        $[5] = align;
        $[6] = className;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== align || $[9] !== props || $[10] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            "data-align": align,
            "data-slot": "input-group-addon",
            onMouseDown: _InputGroupAddonDivOnMouseDown,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input-group.tsx",
            lineNumber: 103,
            columnNumber: 10
        }, this);
        $[8] = align;
        $[9] = props;
        $[10] = t2;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    return t3;
}
_c1 = InputGroupAddon;
function _InputGroupAddonDivOnMouseDown(e) {
    const target = e.target;
    const isInteractive = target.closest("button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']");
    if (isInteractive) {
        return;
    }
    e.preventDefault();
    const parent = e.currentTarget.parentElement;
    const input = parent?.querySelector("input, textarea");
    if (input && !parent?.querySelector("input:focus, textarea:focus")) {
        input.focus();
    }
}
function InputGroupText(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_svg]:-mx-0.5 line-clamp-1 flex items-center gap-2 text-muted-foreground leading-none in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input-group.tsx",
            lineNumber: 158,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = InputGroupText;
function InputGroupInput(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className || $[5] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
            className: className,
            unstyled: true,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input-group.tsx",
            lineNumber: 191,
            columnNumber: 10
        }, this);
        $[4] = className;
        $[5] = props;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    return t1;
}
_c3 = InputGroupInput;
function InputGroupTextarea(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ff7ba55b90eed0f3e9220917b2755c2ab93378859a92baf7bb6d142acaaa884a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className || $[5] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Textarea"], {
            className: className,
            unstyled: true,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input-group.tsx",
            lineNumber: 224,
            columnNumber: 10
        }, this);
        $[4] = className;
        $[5] = props;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    return t1;
}
_c4 = InputGroupTextarea;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "InputGroup");
__turbopack_context__.k.register(_c1, "InputGroupAddon");
__turbopack_context__.k.register(_c2, "InputGroupText");
__turbopack_context__.k.register(_c3, "InputGroupInput");
__turbopack_context__.k.register(_c4, "InputGroupTextarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/actions/data:2ce5ae [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signCdnUrls",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40df5fb9d13ca3f0e3e141515702d444c990b39ea7":"signCdnUrls"},"apps/app/actions/cdn.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40df5fb9d13ca3f0e3e141515702d444c990b39ea7", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "signCdnUrls");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vY2RuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2lnbmVkVXJsIH0gZnJvbSAnQGF3cy1zZGsvY2xvdWRmcm9udC1zaWduZXInO1xuaW1wb3J0IHsgYXV0aCB9IGZyb20gJ0BjbGVyay9uZXh0anMvc2VydmVyJztcblxuY29uc3QgdHJhaWxpbmdTbGFzaCA9IC9cXC8kLztcblxuZnVuY3Rpb24gYnVpbGRTaWduZWRVcmwoczNLZXk6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19DRE5fVVJMO1xuXHRjb25zdCBrZXlQYWlySWQgPSBwcm9jZXNzLmVudi5DRE5fS0VZX1BBSVJfSUQ7XG5cdGNvbnN0IHByaXZhdGVLZXkgPSBwcm9jZXNzLmVudi5DRE5fUFJJVkFURV9LRVk/LnJlcGxhY2UoL1xcXFxuL2csICdcXG4nKTtcblxuXHRpZiAoIShiYXNlVXJsICYmIGtleVBhaXJJZCAmJiBwcml2YXRlS2V5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyBDRE4gY29uZmlndXJhdGlvbicpO1xuXHR9XG5cblx0Y29uc3QgdXJsID0gYCR7YmFzZVVybC5yZXBsYWNlKHRyYWlsaW5nU2xhc2gsICcnKX0vJHtzM0tleX1gO1xuXHRyZXR1cm4gZ2V0U2lnbmVkVXJsKHtcblx0XHR1cmwsXG5cdFx0a2V5UGFpcklkLFxuXHRcdHByaXZhdGVLZXksXG5cdFx0ZGF0ZUxlc3NUaGFuOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgM182MDBfMDAwKS50b0lTT1N0cmluZygpLFxuXHR9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25DZG5VcmwoczNLZXk6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG5cdGNvbnN0IHsgdXNlcklkIH0gPSBhd2FpdCBhdXRoKCk7XG5cdGlmICghdXNlcklkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdVbmF1dGhvcml6ZWQnKTtcblx0fVxuXHRyZXR1cm4gYnVpbGRTaWduZWRVcmwoczNLZXkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbkNkblVybHMoXG5cdHMzS2V5czogc3RyaW5nW11cbik6IFByb21pc2U8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4ge1xuXHRjb25zdCB7IHVzZXJJZCB9ID0gYXdhaXQgYXV0aCgpO1xuXHRpZiAoIXVzZXJJZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignVW5hdXRob3JpemVkJyk7XG5cdH1cblx0Y29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cdGZvciAoY29uc3Qga2V5IG9mIHMzS2V5cykge1xuXHRcdHJlc3VsdFtrZXldID0gYnVpbGRTaWduZWRVcmwoa2V5KTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hDZG5JbWFnZXNBc0RhdGFVcmxzKFxuXHRzM0tleXM6IHN0cmluZ1tdXG4pOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIHN0cmluZz4+IHtcblx0Y29uc3QgeyB1c2VySWQgfSA9IGF3YWl0IGF1dGgoKTtcblx0aWYgKCF1c2VySWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VuYXV0aG9yaXplZCcpO1xuXHR9XG5cdGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRzM0tleXMubWFwKGFzeW5jIChrZXkpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHVybCA9IGJ1aWxkU2lnbmVkVXJsKGtleSk7XG5cdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcblx0XHRcdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuXHRcdFx0XHRpZiAoIWJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID1cblx0XHRcdFx0XHRyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgPz8gJ2ltYWdlL2pwZWcnO1xuXHRcdFx0XHRjb25zdCBiYXNlNjQgPSBCdWZmZXIuZnJvbShidWZmZXIpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBgZGF0YToke2NvbnRlbnRUeXBlfTtiYXNlNjQsJHtiYXNlNjR9YDtcblx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHQvLyBza2lwIGltYWdlcyB0aGF0IGZhaWwgdG8gZmV0Y2hcblx0XHRcdH1cblx0XHR9KVxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1UkFpQ3NCLHdMQUFBIn0=
}),
"[project]/apps/app/components/client/notes/note-image-uploader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoteImageUploader",
    ()=>NoteImageUploader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const THUMB_SIZE = 64;
function NoteImageUploader({ ref, projectId, onChange, onUploadingChange, disabled }) {
    _s();
    const generateUploadUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.generateNoteImageUploadUrl.generateNoteImageUploadUrl);
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadingCount, setUploadingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "NoteImageUploader.useImperativeHandle": ()=>({
                open: ({
                    "NoteImageUploader.useImperativeHandle": ()=>inputRef.current?.click()
                })["NoteImageUploader.useImperativeHandle"]
            })
    }["NoteImageUploader.useImperativeHandle"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NoteImageUploader.useEffect": ()=>{
            onUploadingChange?.(uploadingCount > 0);
        }
    }["NoteImageUploader.useEffect"], [
        uploadingCount,
        onUploadingChange
    ]);
    const imagesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    imagesRef.current = images;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NoteImageUploader.useEffect": ()=>({
                "NoteImageUploader.useEffect": ()=>{
                    for (const img of imagesRef.current){
                        URL.revokeObjectURL(img.previewUrl);
                    }
                }
            })["NoteImageUploader.useEffect"]
    }["NoteImageUploader.useEffect"], []);
    const uploadOne = async (file)=>{
        const previewUrl = URL.createObjectURL(file);
        try {
            const ext = file.name.split('.').pop() ?? 'jpg';
            const { uploadUrl, s3Key } = await generateUploadUrl({
                projectId,
                contentType: file.type || 'application/octet-stream',
                ext
            });
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type || 'application/octet-stream'
                },
                body: file
            });
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            return {
                key: s3Key,
                previewUrl
            };
        } catch (error) {
            URL.revokeObjectURL(previewUrl);
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, 'Could not upload image. Please try again in a moment.'),
                title: 'Image upload failed',
                type: 'error'
            });
            return null;
        }
    };
    const onFilesSelected = async (files)=>{
        const picked = Array.from(files).filter((file_0)=>file_0.type.startsWith('image/'));
        if (picked.length === 0) {
            return;
        }
        setUploadingCount((count)=>count + picked.length);
        try {
            const results = await Promise.all(picked.map((file)=>uploadOne(file)));
            const uploaded = results.filter((item)=>Boolean(item));
            if (uploaded.length > 0) {
                setImages((prev)=>{
                    const next = [
                        ...prev,
                        ...uploaded
                    ];
                    onChange(next.map((img)=>img.key));
                    return next;
                });
            }
        } finally{
            setUploadingCount((count)=>Math.max(0, count - picked.length));
        }
    };
    const onRemove = (key)=>{
        setImages((prev)=>{
            const target = prev.find((img_0)=>img_0.key === key);
            if (target) {
                URL.revokeObjectURL(target.previewUrl);
            }
            const next = prev.filter((img_1)=>img_1.key !== key);
            onChange(next.map((img_2)=>img_2.key));
            return next;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                accept: "image/*",
                className: "hidden",
                disabled: disabled,
                multiple: true,
                onChange: (e)=>{
                    if (e.target.files) {
                        onFilesSelected(e.target.files).catch(()=>{
                        /* errors are surfaced per-file via toast */ });
                    }
                    e.target.value = '';
                },
                ref: inputRef,
                type: "file"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                lineNumber: 124,
                columnNumber: 4
            }, this),
            images.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: images.map((img_3)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative overflow-hidden rounded-md border bg-card",
                        style: {
                            height: THUMB_SIZE,
                            width: THUMB_SIZE
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                alt: "Note attachment",
                                className: "size-full object-contain",
                                height: THUMB_SIZE,
                                src: img_3.previewUrl,
                                unoptimized: true,
                                width: THUMB_SIZE
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                                lineNumber: 137,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-label": "Remove image",
                                className: "absolute end-0.5 top-0.5 rounded-full bg-background/80 p-0.5 text-foreground opacity-80 hover:opacity-100",
                                onClick: ()=>onRemove(img_3.key),
                                type: "button",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "size-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                                    lineNumber: 139,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                                lineNumber: 138,
                                columnNumber: 8
                            }, this)
                        ]
                    }, img_3.key, true, {
                        fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                        lineNumber: 133,
                        columnNumber: 27
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/notes/note-image-uploader.tsx",
                lineNumber: 132,
                columnNumber: 25
            }, this) : null
        ]
    }, void 0, true);
}
_s(NoteImageUploader, "EEEs+oSwnmPV34Xd+pixdWhVX4A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"]
    ];
});
_c = NoteImageUploader;
var _c;
__turbopack_context__.k.register(_c, "NoteImageUploader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/image-preview-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImagePreviewThumbnail",
    ()=>ImagePreviewThumbnail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/dialog.tsx [app-client] (ecmascript) <locals>");
"use client";
;
;
;
function ImagePreviewThumbnail(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "94550b6de01c27b439f6d6a4e7b81ccff331cdc0e3141865714f3b03ab529959") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "94550b6de01c27b439f6d6a4e7b81ccff331cdc0e3141865714f3b03ab529959";
    }
    const { signedUrl, alt, title, size: t1 } = t0;
    const size = t1 === undefined ? 60 : t1;
    const t2 = `Open image preview for ${title}`;
    let t3;
    if ($[1] !== size) {
        t3 = {
            height: size,
            width: size
        };
        $[1] = size;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    let t4;
    if ($[3] !== t2 || $[4] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            "aria-label": t2,
            className: "flex cursor-zoom-in items-center justify-center rounded-md border bg-card p-1",
            style: t3,
            type: "button"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[3] = t2;
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== alt || $[7] !== signedUrl) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            alt: alt,
            className: "size-full object-contain",
            src: signedUrl
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        $[6] = alt;
        $[7] = signedUrl;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t4 || $[10] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTrigger"], {
            render: t4,
            children: t5
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, this);
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== title) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTitle"], {
                children: title
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
                lineNumber: 76,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 76,
            columnNumber: 10
        }, this);
        $[12] = title;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== alt || $[15] !== signedUrl) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                alt: alt,
                className: "h-auto max-h-[70vh] w-auto max-w-full object-contain",
                src: signedUrl
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
                lineNumber: 84,
                columnNumber: 112
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[14] = alt;
        $[15] = signedUrl;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== t7 || $[18] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogContent"], {
            className: "sm:max-w-3xl",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        $[17] = t7;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] !== t6 || $[21] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Dialog"], {
            children: [
                t6,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/image-preview-dialog.tsx",
            lineNumber: 102,
            columnNumber: 11
        }, this);
        $[20] = t6;
        $[21] = t9;
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    return t10;
}
_c = ImagePreviewThumbnail;
var _c;
__turbopack_context__.k.register(_c, "ImagePreviewThumbnail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/notes/note-images-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoteImagesRow",
    ()=>NoteImagesRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$image$2d$preview$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/image-preview-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$2ce5ae__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/app/actions/data:2ce5ae [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function NoteImagesRow(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "e67f9a0127809c851a1d34e5da622146b80e13df855a295b6746cd54f83c083e") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e67f9a0127809c851a1d34e5da622146b80e13df855a295b6746cd54f83c083e";
    }
    const { imageKeys, title } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {};
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [signedUrls, setSignedUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    let t3;
    if ($[2] !== imageKeys) {
        t2 = ({
            "NoteImagesRow[useEffect()]": ()=>{
                if (imageKeys.length === 0) {
                    return;
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$2ce5ae__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signCdnUrls"])(imageKeys).then(setSignedUrls).catch(_NoteImagesRowUseEffectAnonymous);
            }
        })["NoteImagesRow[useEffect()]"];
        t3 = [
            imageKeys
        ];
        $[2] = imageKeys;
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    if (imageKeys.length === 0) {
        return null;
    }
    let t4;
    if ($[5] !== imageKeys || $[6] !== signedUrls || $[7] !== title) {
        let t5;
        if ($[9] !== signedUrls || $[10] !== title) {
            t5 = ({
                "NoteImagesRow[imageKeys.map()]": (key)=>{
                    const signedUrl = signedUrls[key];
                    if (!signedUrl) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex size-[60px] items-center justify-center rounded-md border bg-card text-muted-foreground text-xs",
                            children: "…"
                        }, key, false, {
                            fileName: "[project]/apps/app/components/client/notes/note-images-row.tsx",
                            lineNumber: 63,
                            columnNumber: 20
                        }, this);
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$image$2d$preview$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImagePreviewThumbnail"], {
                        alt: title,
                        signedUrl: signedUrl,
                        title: title
                    }, key, false, {
                        fileName: "[project]/apps/app/components/client/notes/note-images-row.tsx",
                        lineNumber: 65,
                        columnNumber: 18
                    }, this);
                }
            })["NoteImagesRow[imageKeys.map()]"];
            $[9] = signedUrls;
            $[10] = title;
            $[11] = t5;
        } else {
            t5 = $[11];
        }
        t4 = imageKeys.map(t5);
        $[5] = imageKeys;
        $[6] = signedUrls;
        $[7] = title;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[12] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-2",
            children: t4
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/notes/note-images-row.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[12] = t4;
        $[13] = t5;
    } else {
        t5 = $[13];
    }
    return t5;
}
_s(NoteImagesRow, "WanD85Sjxsg8ETtiaZb4nFFaMNU=");
_c = NoteImagesRow;
function _NoteImagesRowUseEffectAnonymous() {}
var _c;
__turbopack_context__.k.register(_c, "NoteImagesRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectInclusionNotesDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-client] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$notes$2f$note$2d$image$2d$uploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/notes/note-image-uploader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$notes$2f$note$2d$images$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/notes/note-images-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function formatNoteDate(timestamp) {
    return new Intl.DateTimeFormat('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    }).format(new Date(timestamp));
}
function ProjectInclusionNotesDialog({ projectId, inclusionId, inclusionTitle, open, onOpenChange }) {
    _s();
    const notes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.listNotes.listNotes, open ? {
        projectInclusionId: inclusionId
    } : 'skip');
    const appendNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.appendNote.appendNote);
    const deleteNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.deleteNote.deleteNote);
    const [noteText, setNoteText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [imagesUploading, setImagesUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploaderKey, setUploaderKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const uploaderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onAdd = async ()=>{
        const trimmed = noteText.trim();
        if (trimmed === '') {
            return;
        }
        setSaving(true);
        try {
            await appendNote({
                projectInclusionId: inclusionId,
                note: trimmed,
                images
            });
            setNoteText('');
            setImages([]);
            setImagesUploading(false);
            setUploaderKey((key)=>key + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Could not add note',
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, 'Please try again.'),
                type: 'error'
            });
        } finally{
            setSaving(false);
        }
    };
    const onDelete = async (noteId)=>{
        try {
            await deleteNote({
                noteId
            });
        } catch (error_0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Could not delete note',
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error_0, 'Please try again.'),
                type: 'error'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Dialog"], {
        onOpenChange: (next)=>{
            onOpenChange(next);
            if (!next) {
                setNoteText('');
                setImages([]);
                setImagesUploading(false);
                setUploaderKey((key_0)=>key_0 + 1);
            }
        },
        open: open,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogContent"], {
            className: "sm:max-w-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTitle"], {
                            children: "Notes"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                            lineNumber: 97,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogDescription"], {
                            children: inclusionTitle
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                            lineNumber: 98,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                    lineNumber: 96,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "min-h-20 w-full rounded-md border bg-background p-2 text-sm",
                                    onChange: (e)=>setNoteText(e.target.value),
                                    placeholder: "Type your note…",
                                    value: noteText
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                    lineNumber: 102,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$notes$2f$note$2d$image$2d$uploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoteImageUploader"], {
                                    onChange: setImages,
                                    onUploadingChange: setImagesUploading,
                                    projectId: projectId,
                                    ref: uploaderRef
                                }, uploaderKey, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                    lineNumber: 103,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            disabled: imagesUploading,
                                            loading: imagesUploading,
                                            onClick: ()=>uploaderRef.current?.open(),
                                            type: "button",
                                            variant: "outline",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {}, void 0, false, {
                                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 9
                                                }, this),
                                                "Add image"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                            lineNumber: 105,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            disabled: saving || imagesUploading || noteText.trim() === '',
                                            onClick: ()=>onAdd().catch(()=>undefined),
                                            type: "button",
                                            children: "Add note"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                            lineNumber: 109,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                    lineNumber: 104,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                            lineNumber: 101,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex max-h-72 flex-col gap-2 overflow-y-auto",
                            children: [
                                notes === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-sm",
                                    children: "Loading notes…"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                    lineNumber: 115,
                                    columnNumber: 30
                                }, this) : null,
                                notes && notes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-sm",
                                    children: "No notes yet."
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                    lineNumber: 116,
                                    columnNumber: 38
                                }, this) : null,
                                notes?.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-2 rounded-md border p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm",
                                                        children: note.addedBy
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 10
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: formatNoteDate(note.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 10
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 whitespace-pre-wrap text-sm",
                                                        children: note.note
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 10
                                                    }, this),
                                                    note.images && note.images.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$notes$2f$note$2d$images$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoteImagesRow"], {
                                                            imageKeys: note.images,
                                                            title: `Note by ${note.addedBy}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 12
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 51
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                lineNumber: 118,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                "aria-label": "Delete note",
                                                onClick: ()=>onDelete(note._id).catch(()=>undefined),
                                                size: "icon-sm",
                                                type: "button",
                                                variant: "ghost",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "size-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 10
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                                lineNumber: 130,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, note._id, true, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                                        lineNumber: 117,
                                        columnNumber: 27
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                            lineNumber: 114,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                    lineNumber: 100,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogFooter"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogClose"], {
                        render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                            lineNumber: 137,
                            columnNumber: 27
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                        lineNumber: 137,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
                    lineNumber: 136,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
            lineNumber: 95,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx",
        lineNumber: 86,
        columnNumber: 10
    }, this);
}
_s(ProjectInclusionNotesDialog, "ehNB+dgN/BkRNv37MryIRBQgaqo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = ProjectInclusionNotesDialog;
var _c;
__turbopack_context__.k.register(_c, "ProjectInclusionNotesDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/lib/client/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatAddressLine",
    ()=>formatAddressLine,
    "formatAud",
    ()=>formatAud,
    "formatDuration",
    ()=>formatDuration,
    "formatSignedAud",
    ()=>formatSignedAud,
    "formatStartDateRelative",
    ()=>formatStartDateRelative,
    "statusBadgeProps",
    ()=>statusBadgeProps
]);
function statusBadgeProps(status) {
    switch(status){
        case 'not_started':
            return {
                label: 'Not started',
                variant: 'info'
            };
        case 'in_progress':
            return {
                label: 'In progress',
                variant: 'warning'
            };
        case 'completed':
            return {
                label: 'Completed',
                variant: 'success'
            };
        default:
            {
                const _exhaustive = status;
                return _exhaustive;
            }
    }
}
function formatAddressLine(address) {
    return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}
function formatDuration(startDate) {
    const start = new Date(startDate);
    const end = new Date();
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let days = end.getDate() - start.getDate();
    if (days < 0) {
        months -= 1;
        const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        days += daysInPrevMonth;
    }
    const parts = [];
    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    }
    if (days > 0) {
        parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Today';
}
function computeStartRelative(isFuture, target, today) {
    const dayMs = 1000 * 60 * 60 * 24;
    if (isFuture) {
        const months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
        const afterMonths = new Date(today);
        afterMonths.setMonth(afterMonths.getMonth() + months);
        return {
            months,
            remainingDays: Math.round((target.getTime() - afterMonths.getTime()) / dayMs)
        };
    }
    const months = (today.getFullYear() - target.getFullYear()) * 12 + (today.getMonth() - target.getMonth());
    const afterMonths = new Date(target);
    afterMonths.setMonth(afterMonths.getMonth() + months);
    return {
        months,
        remainingDays: Math.round((today.getTime() - afterMonths.getTime()) / dayMs)
    };
}
function formatStartDateRelative(startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(startDate);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return 'Starts today';
    }
    const isFuture = diffDays > 0;
    const absDays = Math.abs(diffDays);
    const { months, remainingDays } = computeStartRelative(isFuture, target, today);
    if (months === 0) {
        const label = absDays === 1 ? 'day' : 'days';
        return isFuture ? `Starts in ${absDays} ${label}` : `Started ${absDays} Days ago`;
    }
    const monthLabel = months === 1 ? 'Month' : 'Months';
    const dayPart = remainingDays > 0 ? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}` : '';
    return isFuture ? `Starts in ${months} ${monthLabel}${dayPart}` : `Started ${months} ${monthLabel}${dayPart} ago`;
}
const audFormatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
});
function formatAud(amount) {
    return audFormatter.format(amount);
}
function formatSignedAud(amount) {
    if (amount === 0) {
        return '$0.00';
    }
    return `${amount > 0 ? '+' : '-'} ${formatAud(Math.abs(amount))}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/lib/pdf/pdf-assets.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blobToDataUrl",
    ()=>blobToDataUrl,
    "fetchUrlAsDataUrl",
    ()=>fetchUrlAsDataUrl,
    "fetchUrlAsJpegDataUrl",
    ()=>fetchUrlAsJpegDataUrl,
    "getProjectInclusionsPdfLogoDataUrl",
    ()=>getProjectInclusionsPdfLogoDataUrl
]);
let logoDataUrlPromise = null;
function blobToDataUrl(blob) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>{
            const result = reader.result;
            if (typeof result === 'string') {
                resolve(result);
                return;
            }
            reject(new Error('Could not convert logo file to data URL.'));
        };
        reader.onerror = ()=>{
            reject(new Error('Could not read logo file.'));
        };
        reader.readAsDataURL(blob);
    });
}
function getProjectInclusionsPdfLogoDataUrl() {
    if (logoDataUrlPromise) {
        return logoDataUrlPromise;
    }
    logoDataUrlPromise = (async ()=>{
        const response = await fetch('/lh-admin-logo-pdf.png');
        if (!response.ok) {
            throw new Error('Could not load PDF logo from public assets.');
        }
        const blob = await response.blob();
        return blobToDataUrl(blob);
    })();
    return logoDataUrlPromise;
}
async function fetchUrlAsDataUrl(url) {
    const trimmed = url.trim();
    if (!trimmed) {
        return null;
    }
    try {
        const response = await fetch(trimmed);
        if (!response.ok) {
            return null;
        }
        const blob = await response.blob();
        if (!blob.size) {
            return null;
        }
        return blobToDataUrl(blob);
    } catch  {
        return null;
    }
}
async function fetchUrlAsJpegDataUrl(url) {
    const dataUrl = await fetchUrlAsDataUrl(url);
    if (!dataUrl) {
        return null;
    }
    return new Promise((resolve)=>{
        const img = new Image();
        img.onload = ()=>{
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            } catch  {
                resolve(null);
            }
        };
        img.onerror = ()=>resolve(null);
        img.src = dataUrl;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/lib/client/pdf/project-inclusions-pdf.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateGroupInclusionsPdfBase64",
    ()=>generateGroupInclusionsPdfBase64,
    "generateProjectInclusionsPdfBase64",
    ()=>generateProjectInclusionsPdfBase64,
    "openGroupInclusionsPdfInNewTab",
    ()=>openGroupInclusionsPdfInNewTab,
    "openProjectInclusionsPdfInNewTab",
    ()=>openProjectInclusionsPdfInNewTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/env/src/app.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$pdf$2f$pdf$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/pdf/pdf-assets.ts [app-client] (ecmascript)");
;
;
function formatAddressLine(address) {
    return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}
function formatClientName(client) {
    return `${client.firstName} ${client.lastName}`.trim();
}
function resolveInclusionImageDataUrls(sections) {
    const out = new Map();
    for (const section of sections){
        for (const inclusion of section.inclusions){
            const dataUrl = inclusion.image?.trim();
            if (dataUrl) {
                out.set(inclusion._id, dataUrl);
            }
        }
    }
    return out;
}
function inclusionImageTableCell(imageDataUrl) {
    if (!imageDataUrl) {
        return '—';
    }
    return {
        stack: [
            {
                image: imageDataUrl,
                width: 104,
                alignment: 'center'
            }
        ],
        alignment: 'center',
        margin: [
            2,
            4,
            2,
            4
        ]
    };
}
function inclusionQuantityCell(inclusion) {
    const locations = inclusion.locations ?? [];
    if (locations.length === 0) {
        return '—';
    }
    const totalQty = locations.reduce((sum, l)=>sum + (l.quantity ?? 0), 0);
    if (totalQty === 0) {
        return '—';
    }
    const unit = locations.find((l)=>l.unit?.trim())?.unit?.trim();
    return unit ? `${totalQty} ${unit}` : String(totalQty);
}
function inclusionLinkTableCell(link) {
    const trimmed = link?.trim();
    if (!trimmed) {
        return '-';
    }
    return {
        text: 'View Online',
        link: trimmed,
        color: '#2563eb',
        decoration: 'underline'
    };
}
function buildDocDefinition(logoDataUrl, options, inclusionImageDataUrls, groupOptions) {
    const projectAddressLine = formatAddressLine(options.projectAddress);
    const groupedByVendor = options.groupedByVendor === true;
    const sectionsContent = [];
    for (const section of options.sections){
        const body = [
            [
                {
                    text: 'Title',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: 'Vendor & details',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: 'Color',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: groupedByVendor ? 'Quantity' : 'Location',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: 'Status',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: 'Web link',
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                {
                    text: 'Image',
                    bold: true,
                    fillColor: '#f3f4f6'
                }
            ]
        ];
        for (const inclusion of section.inclusions){
            const vendorDetails = [
                inclusion.vendor,
                inclusion.models.join(', '),
                inclusion.details ?? ''
            ].filter((part)=>part.trim() !== '').join('\n');
            body.push([
                `${inclusion.title}\n${inclusion.code}`,
                vendorDetails || '—',
                inclusion.color ?? '—',
                groupedByVendor ? inclusionQuantityCell(inclusion) : inclusion.locations?.map((l)=>l.name).join(', ') || '—',
                inclusion.status ?? 'Under Review',
                inclusionLinkTableCell(inclusion.link),
                inclusionImageTableCell(inclusionImageDataUrls.get(inclusion._id))
            ]);
        }
        if (!groupOptions?.hideSectionHeadings) {
            sectionsContent.push({
                text: section.sectionName,
                fontSize: 14,
                bold: true,
                margin: [
                    0,
                    0,
                    0,
                    8
                ]
            });
        }
        sectionsContent.push({
            table: {
                headerRows: 1,
                dontBreakRows: true,
                widths: [
                    '18%',
                    '22%',
                    '8%',
                    '12%',
                    '10%',
                    '9%',
                    '21%'
                ],
                body
            },
            fontSize: 9,
            layout: 'lightHorizontalLines',
            margin: [
                0,
                0,
                0,
                16
            ]
        });
    }
    if (!groupOptions?.hideClientSection) {
        sectionsContent.push({
            unbreakable: true,
            stack: [
                {
                    text: 'Client signatures',
                    fontSize: 13,
                    bold: true,
                    margin: [
                        0,
                        2,
                        0,
                        12
                    ]
                },
                options.clients.length === 0 ? {
                    text: 'No clients',
                    color: '#6b7280',
                    italics: true
                } : {
                    columnGap: 28,
                    columns: options.clients.map((client)=>({
                            width: '*',
                            unbreakable: true,
                            stack: [
                                {
                                    text: formatClientName(client) || 'Client',
                                    bold: true,
                                    margin: [
                                        0,
                                        0,
                                        0,
                                        22
                                    ]
                                },
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 220,
                                            y2: 0,
                                            lineWidth: 1
                                        }
                                    ]
                                },
                                {
                                    text: 'Signature',
                                    fontSize: 9,
                                    color: '#6b7280',
                                    margin: [
                                        0,
                                        6,
                                        0,
                                        0
                                    ]
                                }
                            ]
                        }))
                }
            ]
        });
    }
    // pdfmake header height equals `pageMargins.top`; keep it large enough for logo + address.
    const pageMarginTop = 100;
    return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [
            36,
            pageMarginTop,
            36,
            44
        ],
        header: (currentPage, pageCount)=>{
            if (currentPage === 1 || currentPage === pageCount) {
                return null;
            }
            return {
                margin: [
                    36,
                    10,
                    36,
                    12
                ],
                columns: [
                    {
                        image: logoDataUrl,
                        width: 90
                    },
                    {
                        text: projectAddressLine,
                        alignment: 'right',
                        fontSize: 10,
                        margin: [
                            0,
                            10,
                            0,
                            0
                        ]
                    }
                ]
            };
        },
        footer: (currentPage, pageCount)=>{
            if (currentPage === 1 || currentPage === pageCount) {
                return null;
            }
            return {
                margin: [
                    36,
                    0,
                    36,
                    14
                ],
                columns: [
                    {
                        text: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONTACT_EMAIL,
                        fontSize: 9
                    },
                    {
                        text: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONTACT_PHONE,
                        fontSize: 9,
                        alignment: 'right'
                    }
                ]
            };
        },
        content: [
            {
                alignment: 'center',
                // Keep vertical position similar to before (was 48 + 110); larger `pageMarginTop` reduces this.
                margin: [
                    0,
                    58,
                    0,
                    0
                ],
                stack: [
                    {
                        image: logoDataUrl,
                        width: 180,
                        margin: [
                            0,
                            0,
                            0,
                            28
                        ]
                    },
                    {
                        text: groupOptions?.titleOverride ?? 'Schedule Of Finishes',
                        fontSize: 24,
                        bold: true,
                        margin: [
                            0,
                            0,
                            0,
                            12
                        ]
                    },
                    {
                        text: projectAddressLine,
                        fontSize: 11,
                        margin: [
                            0,
                            0,
                            0,
                            groupOptions?.hideClientSection ? 0 : 28
                        ]
                    },
                    ...groupOptions?.hideClientSection ? [] : [
                        options.clients.length === 0 ? {
                            text: 'No client details available',
                            italics: true,
                            color: '#6b7280',
                            fontSize: 11
                        } : {
                            columns: options.clients.map((client)=>({
                                    width: '*',
                                    stack: [
                                        {
                                            text: formatClientName(client),
                                            bold: true,
                                            fontSize: 12
                                        },
                                        {
                                            text: client.email || 'Email: -',
                                            fontSize: 10,
                                            margin: [
                                                0,
                                                4,
                                                0,
                                                0
                                            ]
                                        },
                                        {
                                            text: client.phone || 'Phone: -',
                                            fontSize: 10,
                                            margin: [
                                                0,
                                                2,
                                                0,
                                                0
                                            ]
                                        }
                                    ]
                                })),
                            columnGap: 24
                        }
                    ]
                ]
            },
            {
                text: '',
                pageBreak: 'after'
            },
            ...sectionsContent,
            {
                text: '',
                pageBreak: 'before'
            },
            {
                alignment: 'center',
                margin: [
                    0,
                    88,
                    0,
                    0
                ],
                stack: [
                    {
                        image: logoDataUrl,
                        width: 180,
                        margin: [
                            0,
                            0,
                            0,
                            32
                        ]
                    },
                    {
                        text: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONTACT_ADDRESS.replace(/\\n/g, '\n'),
                        fontSize: 14,
                        margin: [
                            0,
                            0,
                            0,
                            18
                        ]
                    },
                    {
                        text: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONTACT_EMAIL,
                        fontSize: 12
                    },
                    {
                        text: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$env$2f$src$2f$app$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONTACT_PHONE,
                        fontSize: 12,
                        margin: [
                            0,
                            8,
                            0,
                            0
                        ]
                    }
                ]
            }
        ]
    };
}
const ROBOTO_VFS_FILES = {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
};
/**
 * pdfmake ships `vfs_fonts` as CJS `module.exports = { "Roboto-….ttf": "<base64>" }`.
 * Bundlers may expose that map on `import().default`, on the module namespace, or split
 * across both — taking the first object with any `.ttf` can yield a partial vfs and then
 * `Roboto-Medium.ttf` is missing at runtime. Merge every `.ttf` entry we can find.
 */ function mergeVirtualFontFilesFromModule(vfsModule) {
    const merged = {};
    function mergeFromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        }
        for (const [key, val] of Object.entries(obj)){
            if (!key.endsWith('.ttf') || typeof val !== 'string' || val.length === 0) {
                continue;
            }
            merged[key] = val;
        }
    }
    const mod = vfsModule;
    mergeFromObject(mod);
    mergeFromObject(mod.default);
    const defaultNested = mod.default;
    mergeFromObject(defaultNested?.pdfMake?.vfs);
    const modNested = mod.pdfMake?.vfs;
    mergeFromObject(modNested);
    return merged;
}
/**
 * Browser `pdfmake` is a singleton that loads fonts from an internal virtual FS.
 * Assigning `pdfMake.vfs = …` does not register files — you must call
 * `addVirtualFileSystem` so `Roboto-Medium.ttf` etc. exist for the default font map.
 */ function configurePdfMakeFonts(pdfMake, vfs) {
    pdfMake.addVirtualFileSystem(vfs);
    const pick = (file, fallback)=>vfs[file] !== undefined && vfs[file] !== '' ? file : fallback;
    pdfMake.setFonts({
        Roboto: {
            normal: pick(ROBOTO_VFS_FILES.normal, ROBOTO_VFS_FILES.normal),
            bold: pick(ROBOTO_VFS_FILES.bold, ROBOTO_VFS_FILES.normal),
            italics: pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal),
            bolditalics: pick(ROBOTO_VFS_FILES.bolditalics, pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal))
        }
    });
}
async function createInclusionsPdf(options, groupOptions) {
    const [{ default: pdfMake }, vfsModule, logoDataUrl] = await Promise.all([
        __turbopack_context__.A("[project]/node_modules/pdfmake/build/pdfmake.js [app-client] (ecmascript, async loader)"),
        __turbopack_context__.A("[project]/node_modules/pdfmake/build/vfs_fonts.js [app-client] (ecmascript, async loader)"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$pdf$2f$pdf$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectInclusionsPdfLogoDataUrl"])()
    ]);
    const vfs = mergeVirtualFontFilesFromModule(vfsModule);
    if (Object.keys(vfs).length === 0 || typeof vfs[ROBOTO_VFS_FILES.normal] !== 'string' || vfs[ROBOTO_VFS_FILES.normal] === '') {
        throw new Error('Could not initialize PDF fonts.');
    }
    configurePdfMakeFonts(pdfMake, vfs);
    const inclusionImageDataUrls = resolveInclusionImageDataUrls(options.sections);
    const docDefinition = buildDocDefinition(logoDataUrl, options, inclusionImageDataUrls, groupOptions);
    return pdfMake.createPdf(docDefinition);
}
async function openPdfInNewTab(pdf) {
    // Use getBlob() instead of open() so errors thrown during PDF generation
    // propagate to the caller rather than silently leaving a blank tab open.
    const blob = await pdf.getBlob();
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    // Revoke after 60 s — enough time for the browser to load the PDF.
    setTimeout(()=>URL.revokeObjectURL(blobUrl), 60_000);
    if (!win) {
        throw new Error('Could not open PDF — please allow popups for this site.');
    }
}
async function openProjectInclusionsPdfInNewTab(options) {
    const pdf = await createInclusionsPdf(options);
    await openPdfInNewTab(pdf);
}
async function generateProjectInclusionsPdfBase64(options) {
    const pdf = await createInclusionsPdf(options);
    return await pdf.getBase64();
}
function buildGroupPdfArgs(options) {
    const section = {
        sectionId: options.groupName,
        sectionName: options.groupName,
        inclusions: options.inclusions,
        totalVariationSalePrice: 0
    };
    return [
        {
            clients: [],
            groupedByVendor: options.groupedByVendor,
            projectAddress: options.projectAddress,
            projectName: options.groupName,
            sections: [
                section
            ]
        },
        {
            titleOverride: options.groupName,
            hideClientSection: true,
            hideSectionHeadings: true
        }
    ];
}
async function openGroupInclusionsPdfInNewTab(options) {
    const pdf = await createInclusionsPdf(...buildGroupPdfArgs(options));
    await openPdfInNewTab(pdf);
}
async function generateGroupInclusionsPdfBase64(options) {
    const pdf = await createInclusionsPdf(...buildGroupPdfArgs(options));
    return await pdf.getBase64();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectInclusionsTabContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/empty.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/menu.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as EllipsisVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/notebook-pen.js [app-client] (ecmascript) <export default as NotebookPen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/squares-intersect.js [app-client] (ecmascript) <export default as SquaresIntersect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TriangleAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as TriangleAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$2ce5ae__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/app/actions/data:2ce5ae [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$inclusions$2d$notes$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/projects/project-inclusions-notes-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/client/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$pdf$2f$project$2d$inclusions$2d$pdf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/client/pdf/project-inclusions-pdf.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$pdf$2f$pdf$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/pdf/pdf-assets.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function classBadgeVariant(className) {
    if (className === 'Standard') {
        return 'info';
    }
    if (className === 'Gold') {
        return 'yellow';
    }
    if (className === 'Platinum') {
        return 'purple';
    }
    return 'outline';
}
function statusBadgeVariant(status) {
    return status === 'Approved' ? 'success' : 'warning';
}
function matchesSearch(inclusion, search) {
    if (search === '') {
        return true;
    }
    const haystack = [
        inclusion.title,
        inclusion.code,
        inclusion.vendor,
        inclusion.color ?? '',
        ...inclusion.models
    ].join(' ').toLowerCase();
    return haystack.includes(search.toLowerCase());
}
function buildSections(inclusions) {
    const grouped = new Map();
    for (const inclusion of inclusions){
        const key = inclusion.categoryName;
        const list = grouped.get(key) ?? [];
        list.push(inclusion);
        grouped.set(key, list);
    }
    return [
        ...grouped.entries()
    ].map(([groupName, items])=>({
            groupKey: groupName,
            groupName,
            inclusions: items,
            totalVariationPrice: items.reduce((sum, inc)=>inc.class === 'Standard' ? sum : sum + (inc.variationPrice ?? 0), 0)
        })).sort((a, b)=>a.groupName.localeCompare(b.groupName));
}
function InclusionImageCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(22);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 22; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { inclusion, signedImageUrl } = t0;
    if (!signedImageUrl) {
        if (!inclusion.image) {
            let t1;
            if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
                t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-xs",
                    children: "No image"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                    lineNumber: 89,
                    columnNumber: 14
                }, this);
                $[1] = t1;
            } else {
                t1 = $[1];
            }
            return t1;
        }
        let t1;
        if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground text-xs",
                children: "Loading…"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 98,
                columnNumber: 12
            }, this);
            $[2] = t1;
        } else {
            t1 = $[2];
        }
        return t1;
    }
    const t1 = `Open image preview for ${inclusion.title}`;
    let t2;
    if ($[3] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            "aria-label": t1,
            className: "flex size-[60px] cursor-zoom-in items-center justify-center rounded-md border bg-card p-1",
            type: "button"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[3] = t1;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== inclusion.title || $[6] !== signedImageUrl) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            alt: inclusion.title,
            className: "size-full object-contain",
            height: 60,
            src: signedImageUrl,
            unoptimized: true,
            width: 60
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 116,
            columnNumber: 10
        }, this);
        $[5] = inclusion.title;
        $[6] = signedImageUrl;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    let t4;
    if ($[8] !== t2 || $[9] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTrigger"], {
            render: t2,
            children: t3
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 125,
            columnNumber: 10
        }, this);
        $[8] = t2;
        $[9] = t3;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const t5 = `${inclusion.title} ${inclusion.code}`;
    let t6;
    if ($[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogTitle"], {
                children: t5
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 135,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 135,
            columnNumber: 10
        }, this);
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== inclusion.title || $[14] !== signedImageUrl) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                alt: inclusion.title,
                className: "h-auto max-h-[70vh] w-auto max-w-full object-contain",
                height: 1200,
                src: signedImageUrl,
                unoptimized: true,
                width: 1200
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 143,
                columnNumber: 112
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 143,
            columnNumber: 10
        }, this);
        $[13] = inclusion.title;
        $[14] = signedImageUrl;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== t6 || $[17] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DialogContent"], {
            className: "sm:max-w-3xl",
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 152,
            columnNumber: 10
        }, this);
        $[16] = t6;
        $[17] = t7;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== t4 || $[20] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Dialog"], {
            children: [
                t4,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 161,
            columnNumber: 10
        }, this);
        $[19] = t4;
        $[20] = t8;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    return t9;
}
_c = InclusionImageCell;
function InclusionRowActions(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { inclusion, onToggleStatus, onOpenNotes } = t0;
    const isApproved = inclusion.status === "Approved";
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuTrigger"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                "aria-label": "Inclusion actions",
                size: "icon-sm",
                type: "button",
                variant: "ghost"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 186,
                columnNumber: 31
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__["EllipsisVertical"], {
                className: "size-4"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 186,
                columnNumber: 119
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 186,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 193,
            columnNumber: 10
        }, this);
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const t3 = isApproved ? "Unapprove" : "Approve";
    let t4;
    if ($[3] !== onToggleStatus || $[4] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuItem"], {
            onClick: onToggleStatus,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 201,
            columnNumber: 10
        }, this);
        $[3] = onToggleStatus;
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__["NotebookPen"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 210,
            columnNumber: 10
        }, this);
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== onOpenNotes) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuItem"], {
            onClick: onOpenNotes,
            children: [
                t5,
                "View / edit notes"
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 217,
            columnNumber: 10
        }, this);
        $[7] = onOpenNotes;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] !== t4 || $[10] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Menu"], {
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuPopup"], {
                    align: "end",
                    children: [
                        t4,
                        t6
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                    lineNumber: 225,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 225,
            columnNumber: 10
        }, this);
        $[9] = t4;
        $[10] = t6;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    return t7;
}
_c1 = InclusionRowActions;
function InclusionTitleCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { inclusion } = t0;
    let t1;
    if ($[1] !== inclusion.title) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-medium",
            children: inclusion.title
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 247,
            columnNumber: 10
        }, this);
        $[1] = inclusion.title;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== inclusion.class) {
        t2 = classBadgeVariant(inclusion.class);
        $[3] = inclusion.class;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== inclusion.class || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            size: "lg",
            variant: t2,
            children: inclusion.class
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 263,
            columnNumber: 10
        }, this);
        $[5] = inclusion.class;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    let t4;
    if ($[8] !== inclusion.code) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            size: "lg",
            variant: "outline",
            children: inclusion.code
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 272,
            columnNumber: 10
        }, this);
        $[8] = inclusion.code;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== t3 || $[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-1",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 280,
            columnNumber: 10
        }, this);
        $[10] = t3;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== t1 || $[14] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-1",
            children: [
                t1,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 289,
            columnNumber: 10
        }, this);
        $[13] = t1;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    return t6;
}
_c2 = InclusionTitleCell;
function InclusionVendorCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { inclusion } = t0;
    let t1;
    if ($[1] !== inclusion.vendor) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: inclusion.vendor
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 311,
            columnNumber: 10
        }, this);
        $[1] = inclusion.vendor;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== inclusion.models) {
        t2 = inclusion.models.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: inclusion.models.join(", ")
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 319,
            columnNumber: 40
        }, this) : null;
        $[3] = inclusion.models;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== inclusion.details) {
        t3 = inclusion.details ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "whitespace-pre-wrap",
            children: inclusion.details
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 327,
            columnNumber: 30
        }, this) : null;
        $[5] = inclusion.details;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t1 || $[8] !== t2 || $[9] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-0.5 text-muted-foreground text-sm",
            children: [
                t1,
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 335,
            columnNumber: 10
        }, this);
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    return t4;
}
_c3 = InclusionVendorCell;
function InclusionVariationCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { inclusion } = t0;
    if (inclusion.class === "Standard" || inclusion.variationPrice == null) {
        let t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground",
                children: "—"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 359,
                columnNumber: 12
            }, this);
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        return t1;
    }
    let t1;
    if ($[2] !== inclusion.variationPrice) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatSignedAud"])(inclusion.variationPrice);
        $[2] = inclusion.variationPrice;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "tabular-nums",
            children: t1
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 376,
            columnNumber: 10
        }, this);
        $[4] = t1;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    return t2;
}
_c4 = InclusionVariationCell;
function VariationSummaryAlert(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { total } = t0;
    if (total === 0) {
        let t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                variant: "info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 398,
                        columnNumber: 34
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                        children: "No variations"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 398,
                        columnNumber: 61
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 398,
                columnNumber: 12
            }, this);
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        return t1;
    }
    let t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TriangleAlert$3e$__["TriangleAlert"], {
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 408,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
            children: "Variations"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 409,
            columnNumber: 10
        }, this);
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    let t3;
    if ($[4] !== total) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatSignedAud"])(total);
        $[4] = total;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
            variant: "warning",
            children: [
                t1,
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertAction"], {
                    className: "max-sm:col-start-3 max-sm:row-start-1 max-sm:mt-0 max-sm:self-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        size: "lg",
                        variant: "purple",
                        children: t3
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 426,
                        columnNumber: 137
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                    lineNumber: 426,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 426,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    return t4;
}
_c5 = VariationSummaryAlert;
function CategorySection(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(57);
    if ($[0] !== "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8") {
        for(let $i = 0; $i < 57; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9297593a48eb1065469cce2ad376b02d1857187aaf905ef0372980d3a81ae8";
    }
    const { section, signedImageUrls, onSetStatus, onBulkSetStatus, onOpenNotes } = t0;
    let t1;
    if ($[1] !== section.inclusions) {
        t1 = section.inclusions.every(_CategorySectionSectionInclusionsEvery);
        $[1] = section.inclusions;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const allApproved = t1;
    let t2;
    if ($[3] !== section.groupName) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
            children: section.groupName
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 460,
            columnNumber: 10
        }, this);
        $[3] = section.groupName;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const t3 = section.inclusions.length === 1 ? "inclusion" : "inclusions";
    let t4;
    if ($[5] !== section.inclusions.length || $[6] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameDescription"], {
            children: [
                section.inclusions.length,
                " ",
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 469,
            columnNumber: 10
        }, this);
        $[5] = section.inclusions.length;
        $[6] = t3;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== t2 || $[9] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0",
            children: [
                t2,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 478,
            columnNumber: 10
        }, this);
        $[8] = t2;
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    let t6;
    if ($[11] !== allApproved || $[12] !== onBulkSetStatus || $[13] !== section) {
        t6 = ({
            "CategorySection[<Button>.onClick]": ()=>onBulkSetStatus(section, !allApproved)
        })["CategorySection[<Button>.onClick]"];
        $[11] = allApproved;
        $[12] = onBulkSetStatus;
        $[13] = section;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    const t7 = allApproved ? "Unapprove all" : "Approve all";
    let t8;
    if ($[15] !== t6 || $[16] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            className: "shrink-0",
            onClick: t6,
            size: "sm",
            type: "button",
            variant: "outline",
            children: t7
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 500,
            columnNumber: 10
        }, this);
        $[15] = t6;
        $[16] = t7;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== t5 || $[19] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center justify-between gap-3",
            children: [
                t5,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 509,
            columnNumber: 10
        }, this);
        $[18] = t5;
        $[19] = t8;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== onOpenNotes || $[22] !== onSetStatus || $[23] !== section.inclusions || $[24] !== signedImageUrls) {
        let t11;
        if ($[26] !== onOpenNotes || $[27] !== onSetStatus || $[28] !== signedImageUrls) {
            t11 = ({
                "CategorySection[section.inclusions.map()]": (inclusion_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 rounded-lg border p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionTitleCell, {
                                        inclusion: inclusion_0
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 521,
                                        columnNumber: 206
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionRowActions, {
                                        inclusion: inclusion_0,
                                        onOpenNotes: {
                                            "CategorySection[section.inclusions.map() > <InclusionRowActions>.onOpenNotes]": ()=>onOpenNotes(inclusion_0)
                                        }["CategorySection[section.inclusions.map() > <InclusionRowActions>.onOpenNotes]"],
                                        onToggleStatus: {
                                            "CategorySection[section.inclusions.map() > <InclusionRowActions>.onToggleStatus]": ()=>onSetStatus(inclusion_0._id, inclusion_0.status !== "Approved")
                                        }["CategorySection[section.inclusions.map() > <InclusionRowActions>.onToggleStatus]"]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 521,
                                        columnNumber: 252
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 521,
                                columnNumber: 150
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionImageCell, {
                                        inclusion: inclusion_0,
                                        signedImageUrl: signedImageUrls[inclusion_0.image ?? ""] ?? ""
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 525,
                                        columnNumber: 149
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionVendorCell, {
                                            inclusion: inclusion_0
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                            lineNumber: 525,
                                            columnNumber: 291
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 525,
                                        columnNumber: 259
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 525,
                                columnNumber: 108
                            }, this),
                            inclusion_0.color ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground text-sm",
                                children: [
                                    "Colour: ",
                                    inclusion_0.color
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 525,
                                columnNumber: 371
                            }, this) : null,
                            inclusion_0.locations?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground text-sm",
                                children: [
                                    "Locations: ",
                                    inclusion_0.locations.map(_CategorySectionSectionInclusionsMapInclusion_0LocationsMap).join(", ")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 525,
                                columnNumber: 494
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        size: "lg",
                                        variant: statusBadgeVariant(inclusion_0.status ?? "Under Review"),
                                        children: inclusion_0.status ?? "Under Review"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 525,
                                        columnNumber: 726
                                    }, this),
                                    inclusion_0.class === "Standard" || inclusion_0.variationPrice == null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground tabular-nums",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 525,
                                        columnNumber: 930
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        size: "lg",
                                        variant: "purple",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatSignedAud"])(inclusion_0.variationPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 525,
                                        columnNumber: 994
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 525,
                                columnNumber: 667
                            }, this)
                        ]
                    }, inclusion_0._id, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 521,
                        columnNumber: 69
                    }, this)
            })["CategorySection[section.inclusions.map()]"];
            $[26] = onOpenNotes;
            $[27] = onSetStatus;
            $[28] = signedImageUrls;
            $[29] = t11;
        } else {
            t11 = $[29];
        }
        t10 = section.inclusions.map(t11);
        $[21] = onOpenNotes;
        $[22] = onSetStatus;
        $[23] = section.inclusions;
        $[24] = signedImageUrls;
        $[25] = t10;
    } else {
        t10 = $[25];
    }
    let t11;
    if ($[30] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3 p-3 md:hidden",
            children: t10
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 545,
            columnNumber: 11
        }, this);
        $[30] = t10;
        $[31] = t11;
    } else {
        t11 = $[31];
    }
    let t12;
    let t13;
    let t14;
    let t15;
    let t16;
    let t17;
    let t18;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "min-w-[11rem]",
            children: "Title"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 559,
            columnNumber: 11
        }, this);
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "min-w-[14rem]",
            children: "Vendor & details"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 560,
            columnNumber: 11
        }, this);
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "whitespace-nowrap",
            children: "Colour"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 561,
            columnNumber: 11
        }, this);
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "whitespace-nowrap",
            children: "Location"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 562,
            columnNumber: 11
        }, this);
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "whitespace-nowrap",
            children: "Status"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 563,
            columnNumber: 11
        }, this);
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "whitespace-nowrap text-end",
            children: "Variation"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 564,
            columnNumber: 11
        }, this);
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "w-[6rem] text-end",
            children: "Image"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 565,
            columnNumber: 11
        }, this);
        $[32] = t12;
        $[33] = t13;
        $[34] = t14;
        $[35] = t15;
        $[36] = t16;
        $[37] = t17;
        $[38] = t18;
    } else {
        t12 = $[32];
        t13 = $[33];
        t14 = $[34];
        t15 = $[35];
        t16 = $[36];
        t17 = $[37];
        t18 = $[38];
    }
    let t19;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                children: [
                    t12,
                    t13,
                    t14,
                    t15,
                    t16,
                    t17,
                    t18,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                        className: "w-[3rem]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "sr-only",
                            children: "Actions"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                            lineNumber: 584,
                            columnNumber: 101
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 584,
                        columnNumber: 69
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 584,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 584,
            columnNumber: 11
        }, this);
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    let t20;
    if ($[40] !== onOpenNotes || $[41] !== onSetStatus || $[42] !== section.inclusions || $[43] !== signedImageUrls) {
        let t21;
        if ($[45] !== onOpenNotes || $[46] !== onSetStatus || $[47] !== signedImageUrls) {
            t21 = ({
                "CategorySection[section.inclusions.map()]": (inclusion_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionTitleCell, {
                                    inclusion: inclusion_1
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 112
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 101
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionVendorCell, {
                                    inclusion: inclusion_1
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 181
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 170
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "text-sm",
                                children: inclusion_1.color ?? "\u2014"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 240
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "text-sm",
                                children: inclusion_1.locations?.length ? inclusion_1.locations.map(_CategorySectionSectionInclusionsMapInclusion_1LocationsMap).join(", ") : "\u2014"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 314
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    size: "lg",
                                    variant: statusBadgeVariant(inclusion_1.status ?? "Under Review"),
                                    children: inclusion_1.status ?? "Under Review"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 510
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 499
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "text-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionVariationCell, {
                                    inclusion: inclusion_1
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 684
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 652
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "text-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionImageCell, {
                                        inclusion: inclusion_1,
                                        signedImageUrl: signedImageUrls[inclusion_1.image ?? ""] ?? ""
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 594,
                                        columnNumber: 812
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 778
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 746
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InclusionRowActions, {
                                        inclusion: inclusion_1,
                                        onOpenNotes: {
                                            "CategorySection[section.inclusions.map() > <InclusionRowActions>.onOpenNotes]": ()=>onOpenNotes(inclusion_1)
                                        }["CategorySection[section.inclusions.map() > <InclusionRowActions>.onOpenNotes]"],
                                        onToggleStatus: {
                                            "CategorySection[section.inclusions.map() > <InclusionRowActions>.onToggleStatus]": ()=>onSetStatus(inclusion_1._id, inclusion_1.status !== "Approved")
                                        }["CategorySection[section.inclusions.map() > <InclusionRowActions>.onToggleStatus]"]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 594,
                                        columnNumber: 985
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 594,
                                    columnNumber: 951
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 594,
                                columnNumber: 940
                            }, this)
                        ]
                    }, inclusion_1._id, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 594,
                        columnNumber: 69
                    }, this)
            })["CategorySection[section.inclusions.map()]"];
            $[45] = onOpenNotes;
            $[46] = onSetStatus;
            $[47] = signedImageUrls;
            $[48] = t21;
        } else {
            t21 = $[48];
        }
        t20 = section.inclusions.map(t21);
        $[40] = onOpenNotes;
        $[41] = onSetStatus;
        $[42] = section.inclusions;
        $[43] = signedImageUrls;
        $[44] = t20;
    } else {
        t20 = $[44];
    }
    let t21;
    if ($[49] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden md:block",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                className: "w-full",
                children: [
                    t19,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                        children: t20
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 618,
                        columnNumber: 75
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 618,
                columnNumber: 44
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 618,
            columnNumber: 11
        }, this);
        $[49] = t20;
        $[50] = t21;
    } else {
        t21 = $[50];
    }
    let t22;
    if ($[51] !== t11 || $[52] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
            className: "p-0",
            children: [
                t11,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 626,
            columnNumber: 11
        }, this);
        $[51] = t11;
        $[52] = t21;
        $[53] = t22;
    } else {
        t22 = $[53];
    }
    let t23;
    if ($[54] !== t22 || $[55] !== t9) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            className: "w-full",
            children: [
                t9,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 635,
            columnNumber: 11
        }, this);
        $[54] = t22;
        $[55] = t9;
        $[56] = t23;
    } else {
        t23 = $[56];
    }
    return t23;
}
_c6 = CategorySection;
function _CategorySectionSectionInclusionsMapInclusion_1LocationsMap(l_0) {
    return l_0.name;
}
function _CategorySectionSectionInclusionsMapInclusion_0LocationsMap(l) {
    return l.name;
}
function _CategorySectionSectionInclusionsEvery(inclusion) {
    return inclusion.status === "Approved";
}
function ProjectInclusionsTabContent({ projectId }) {
    _s();
    const inclusions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.list.list, {
        projectId
    });
    const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.projects.get.get, {
        projectId
    });
    const setStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.inclusions.setStatus.setStatus);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [debouncedSearch, setDebouncedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [signedImageUrls, setSignedImageUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [notesFor, setNotesFor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectInclusionsTabContent.useEffect": ()=>{
            const id = window.setTimeout({
                "ProjectInclusionsTabContent.useEffect.id": ()=>setDebouncedSearch(search)
            }["ProjectInclusionsTabContent.useEffect.id"], 300);
            return ({
                "ProjectInclusionsTabContent.useEffect": ()=>window.clearTimeout(id)
            })["ProjectInclusionsTabContent.useEffect"];
        }
    }["ProjectInclusionsTabContent.useEffect"], [
        search
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectInclusionsTabContent.useEffect": ()=>{
            if (!inclusions) {
                return;
            }
            const keys = inclusions.map({
                "ProjectInclusionsTabContent.useEffect.keys": (inc)=>inc.image
            }["ProjectInclusionsTabContent.useEffect.keys"]).filter({
                "ProjectInclusionsTabContent.useEffect.keys": (img)=>Boolean(img)
            }["ProjectInclusionsTabContent.useEffect.keys"]);
            if (keys.length === 0) {
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$2ce5ae__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signCdnUrls"])(keys).then(setSignedImageUrls).catch({
                "ProjectInclusionsTabContent.useEffect": ()=>{
                /* images show as loading if signing fails */ }
            }["ProjectInclusionsTabContent.useEffect"]);
        }
    }["ProjectInclusionsTabContent.useEffect"], [
        inclusions
    ]);
    const sections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProjectInclusionsTabContent.useMemo[sections]": ()=>{
            if (!inclusions) {
                return [];
            }
            const filtered = inclusions.filter({
                "ProjectInclusionsTabContent.useMemo[sections].filtered": (inc_0)=>matchesSearch(inc_0, debouncedSearch.trim())
            }["ProjectInclusionsTabContent.useMemo[sections].filtered"]);
            return buildSections(filtered);
        }
    }["ProjectInclusionsTabContent.useMemo[sections]"], [
        inclusions,
        debouncedSearch
    ]);
    const totalVariationPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProjectInclusionsTabContent.useMemo[totalVariationPrice]": ()=>{
            if (!inclusions) {
                return 0;
            }
            return inclusions.reduce({
                "ProjectInclusionsTabContent.useMemo[totalVariationPrice]": (sum, inc_1)=>inc_1.class === 'Standard' ? sum : sum + (inc_1.variationPrice ?? 0)
            }["ProjectInclusionsTabContent.useMemo[totalVariationPrice]"], 0);
        }
    }["ProjectInclusionsTabContent.useMemo[totalVariationPrice]"], [
        inclusions
    ]);
    const onSetStatus = async (id_0, approved)=>{
        try {
            await setStatus({
                projectInclusionId: id_0,
                status: approved ? 'Approved' : 'Under Review'
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Could not update inclusion',
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, 'Please try again.'),
                type: 'error'
            });
        }
    };
    const onBulkSetStatus = async (section, approved_0)=>{
        const targetStatus = approved_0 ? 'Approved' : 'Under Review';
        try {
            await Promise.all(section.inclusions.filter((inc_2)=>(inc_2.status ?? 'Under Review') !== targetStatus).map((inc_3)=>setStatus({
                    projectInclusionId: inc_3._id,
                    status: targetStatus
                })));
        } catch (error_0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: `Could not update ${section.groupName} inclusions`,
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error_0, 'Please try again.'),
                type: 'error'
            });
        }
    };
    const onDownload = async ()=>{
        if (!project) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Could not generate PDF',
                description: 'Project details are still loading. Please try again.',
                type: 'error'
            });
            return;
        }
        setDownloading(true);
        try {
            const allInclusions = sections.flatMap((s)=>s.inclusions);
            const imageKeys = allInclusions.map((inc_4)=>inc_4.image).filter((img_0)=>Boolean(img_0));
            const pdfImageDataUrls = {};
            if (imageKeys.length > 0) {
                const signed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$data$3a$2ce5ae__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signCdnUrls"])(imageKeys);
                await Promise.all(Object.entries(signed).map(async ([key, url])=>{
                    const dataUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$pdf$2f$pdf$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchUrlAsJpegDataUrl"])(url);
                    if (dataUrl) {
                        pdfImageDataUrls[key] = dataUrl;
                    }
                }));
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$pdf$2f$project$2d$inclusions$2d$pdf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openProjectInclusionsPdfInNewTab"])({
                projectName: project.name,
                projectAddress: project.address,
                clients: project.clients.map((client)=>({
                        firstName: client.firstName,
                        lastName: client.lastName,
                        email: client.email,
                        phone: client.phone
                    })),
                sections: sections.map((section_0)=>({
                        sectionId: section_0.groupKey,
                        sectionName: section_0.groupName,
                        totalVariationSalePrice: section_0.totalVariationPrice,
                        inclusions: section_0.inclusions.map((inclusion)=>({
                                _id: String(inclusion._id),
                                title: inclusion.title,
                                code: inclusion.code,
                                vendor: inclusion.vendor,
                                models: inclusion.models,
                                color: inclusion.color,
                                locations: inclusion.locations,
                                details: inclusion.details,
                                status: inclusion.status,
                                class: inclusion.class,
                                variationPrice: inclusion.variationPrice,
                                link: inclusion.link,
                                image: pdfImageDataUrls[inclusion.image ?? '']
                            }))
                    }))
            });
        } catch (error_1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Could not generate PDF',
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error_1, 'Please try again.'),
                type: 'error'
            });
        } finally{
            setDownloading(false);
        }
    };
    if (inclusions === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-muted-foreground text-sm",
            children: "Loading inclusions…"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
            lineNumber: 792,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-row items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroup"], {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupAddon"], {
                                align: "inline-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupText"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"], {
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                        lineNumber: 799,
                                        columnNumber: 8
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                    lineNumber: 798,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 797,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupInput"], {
                                "aria-label": "Search inclusions",
                                onChange: (e)=>setSearch(e.target.value),
                                placeholder: "Search by title, vendor, code, colour…",
                                type: "search",
                                value: search
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 802,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 796,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        "aria-label": "Download",
                        className: "shrink-0",
                        disabled: downloading || sections.length === 0,
                        onClick: ()=>onDownload().catch(()=>undefined),
                        type: "button",
                        variant: "outline",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {}, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 805,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: "Download"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 806,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 804,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 795,
                columnNumber: 4
            }, this),
            inclusions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VariationSummaryAlert, {
                total: totalVariationPrice
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 810,
                columnNumber: 29
            }, this) : null,
            sections.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Empty"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyMedia"], {
                            variant: "icon",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__["SquaresIntersect"], {
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                                lineNumber: 815,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                            lineNumber: 814,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyTitle"], {
                            children: inclusions.length === 0 ? 'No inclusions yet' : 'No matching inclusions'
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                            lineNumber: 817,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                    lineNumber: 813,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 812,
                columnNumber: 29
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4",
                children: sections.map((section_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategorySection, {
                        onBulkSetStatus: (s_0, approved_1)=>onBulkSetStatus(s_0, approved_1).catch(()=>undefined),
                        onOpenNotes: setNotesFor,
                        onSetStatus: (id_1, approved_2)=>onSetStatus(id_1, approved_2).catch(()=>undefined),
                        section: section_1,
                        signedImageUrls: signedImageUrls
                    }, section_1.groupKey, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                        lineNumber: 822,
                        columnNumber: 33
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 821,
                columnNumber: 16
            }, this),
            notesFor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$inclusions$2d$notes$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                inclusionId: notesFor._id,
                inclusionTitle: notesFor.title,
                onOpenChange: (open)=>{
                    if (!open) {
                        setNotesFor(null);
                    }
                },
                open: notesFor !== null,
                projectId: projectId
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
                lineNumber: 825,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx",
        lineNumber: 794,
        columnNumber: 10
    }, this);
}
_s(ProjectInclusionsTabContent, "0ubUi9jsdtgwXKbaDraLg07zff0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c7 = ProjectInclusionsTabContent;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "InclusionImageCell");
__turbopack_context__.k.register(_c1, "InclusionRowActions");
__turbopack_context__.k.register(_c2, "InclusionTitleCell");
__turbopack_context__.k.register(_c3, "InclusionVendorCell");
__turbopack_context__.k.register(_c4, "InclusionVariationCell");
__turbopack_context__.k.register(_c5, "VariationSummaryAlert");
__turbopack_context__.k.register(_c6, "CategorySection");
__turbopack_context__.k.register(_c7, "ProjectInclusionsTabContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/projects/project-details-tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectDetailsTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/tabs.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/squares-intersect.js [app-client] (ecmascript) <export default as SquaresIntersect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$documents$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/projects/project-documents-tab-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$inclusions$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/projects/project-inclusions-tab-content.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function ProjectDetailsTabs(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "cf67c0c82a9d63ae4bb6ca46568fb83eef5972a6087e5a3c6279f423f6138377") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cf67c0c82a9d63ae4bb6ca46568fb83eef5972a6087e5a3c6279f423f6138377";
    }
    const { projectId } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    let t1;
    if ($[1] !== searchParams) {
        t1 = searchParams.get("tab") ?? "inclusions";
        $[1] = searchParams;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const activeTab = t1;
    let t2;
    if ($[3] !== router || $[4] !== searchParams) {
        t2 = ({
            "ProjectDetailsTabs[onTabChange]": (tab)=>{
                const params = new URLSearchParams(searchParams.toString());
                params.set("tab", tab);
                router.push(`?${params.toString()}`);
            }
        })["ProjectDetailsTabs[onTabChange]"];
        $[3] = router;
        $[4] = searchParams;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    const onTabChange = t2;
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TabsTab"], {
            className: "data-active:text-primary-foreground hover:data-active:text-primary-foreground",
            value: "inclusions",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__["SquaresIntersect"], {}, void 0, false, {
                    fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
                    lineNumber: 51,
                    columnNumber: 128
                }, this),
                "Inclusions"
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
            lineNumber: 51,
            columnNumber: 10
        }, this);
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TabsList"], {
            className: "w-full rounded-none border-b bg-muted/50 **:data-[slot=tab-indicator]:bg-primary",
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TabsTab"], {
                    className: "data-active:text-primary-foreground hover:data-active:text-primary-foreground",
                    value: "documents",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {}, void 0, false, {
                            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
                            lineNumber: 58,
                            columnNumber: 234
                        }, this),
                        "Documents"
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
                    lineNumber: 58,
                    columnNumber: 117
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== projectId) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TabsPanel"], {
            className: "min-h-0 flex-1 overflow-auto p-4",
            value: "inclusions",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$inclusions$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                projectId: projectId
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
                lineNumber: 65,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
            lineNumber: 65,
            columnNumber: 10
        }, this);
        $[8] = projectId;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== projectId) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TabsPanel"], {
            className: "min-h-0 flex-1 overflow-auto p-4",
            value: "documents",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$documents$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                projectId: projectId
            }, void 0, false, {
                fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
                lineNumber: 73,
                columnNumber: 84
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
            lineNumber: 73,
            columnNumber: 10
        }, this);
        $[10] = projectId;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== activeTab || $[13] !== onTabChange || $[14] !== t5 || $[15] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tabs"], {
            className: "flex-1 gap-0 overflow-hidden rounded-xl border",
            onValueChange: onTabChange,
            value: activeTab,
            children: [
                t4,
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-details-tabs.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, this);
        $[12] = activeTab;
        $[13] = onTabChange;
        $[14] = t5;
        $[15] = t6;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    return t7;
}
_s(ProjectDetailsTabs, "A57ZQKsSKoH4xi482IWIv7kTTfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ProjectDetailsTabs;
var _c;
__turbopack_context__.k.register(_c, "ProjectDetailsTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/client/projects/project-detail-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectDetailView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/page-heading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$details$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/client/projects/project-details-tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/client/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function ProjectDetailView(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "648ee46911067efc052b4dfdd6da0a3bf1e35874c96d593217749a661cdb19c4") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "648ee46911067efc052b4dfdd6da0a3bf1e35874c96d593217749a661cdb19c4";
    }
    const { projectId } = t0;
    let t1;
    if ($[1] !== projectId) {
        t1 = {
            projectId
        };
        $[1] = projectId;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].clientPortal.projects.get.get, t1);
    if (project === undefined) {
        let t2;
        if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        heading: "Project"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                        lineNumber: 36,
                        columnNumber: 63
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm",
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                        lineNumber: 36,
                        columnNumber: 96
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                lineNumber: 36,
                columnNumber: 12
            }, this);
            $[3] = t2;
        } else {
            t2 = $[3];
        }
        return t2;
    }
    if (project === null) {
        let t2;
        if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        heading: "Project"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                        lineNumber: 46,
                        columnNumber: 63
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm",
                        children: "Project not found."
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                        lineNumber: 46,
                        columnNumber: 96
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
                lineNumber: 46,
                columnNumber: 12
            }, this);
            $[4] = t2;
        } else {
            t2 = $[4];
        }
        return t2;
    }
    let t2;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col");
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    let t3;
    if ($[6] !== project.address) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$client$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAddressLine"])(project.address);
        $[6] = project.address;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    let t4;
    if ($[8] !== project.name || $[9] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            backLink: "/client/projects",
            description: t3,
            heading: project.name
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
            lineNumber: 70,
            columnNumber: 10
        }, this);
        $[8] = project.name;
        $[9] = t3;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== project._id) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$client$2f$projects$2f$project$2d$details$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            projectId: project._id
        }, void 0, false, {
            fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
            lineNumber: 79,
            columnNumber: 10
        }, this);
        $[11] = project._id;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== t4 || $[14] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/client/projects/project-detail-view.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    return t6;
}
_s(ProjectDetailView, "H8vTX7pKzCbu9MnHPNX6T7WFDOE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = ProjectDetailView;
var _c;
__turbopack_context__.k.register(_c, "ProjectDetailView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_9599296f._.js.map