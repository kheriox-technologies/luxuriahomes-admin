(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/ui/src/hooks/use-mobile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsMobile",
    ()=>useIsMobile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "f655ed06400b59e5ef7b69fa1317c534527c06fe9d243dab4a89fa3fb8e34a28") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f655ed06400b59e5ef7b69fa1317c534527c06fe9d243dab4a89fa3fb8e34a28";
    }
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "useIsMobile[useEffect()]": ()=>{
                const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
                const onChange = {
                    "useIsMobile[useEffect() > onChange]": ()=>{
                        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
                    }
                }["useIsMobile[useEffect() > onChange]"];
                mql.addEventListener("change", onChange);
                setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
                return ()=>mql.removeEventListener("change", onChange);
            }
        })["useIsMobile[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    return !!isMobile;
}
_s(useIsMobile, "D6B2cPXNCaIbeOx+abFr1uxLRM0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/input/Input.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Input(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(26);
    if ($[0] !== "9fde28b78c0c065817ab6a3a854b20f09deeae1ba1ec9c30a089f163c4a38be6") {
        for(let $i = 0; $i < 26; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9fde28b78c0c065817ab6a3a854b20f09deeae1ba1ec9c30a089f163c4a38be6";
    }
    let className;
    let props;
    let style;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, size: t1, unstyled: t2, nativeInput: t3, style, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = style;
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        className = $[2];
        props = $[3];
        style = $[4];
        t1 = $[5];
        t2 = $[6];
        t3 = $[7];
    }
    const size = t1 === undefined ? "default" : t1;
    const unstyled = t2 === undefined ? false : t2;
    const nativeInput = t3 === undefined ? false : t3;
    const t4 = size === "sm" && "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5";
    const t5 = size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5";
    const t6 = props.type === "search" && "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none";
    const t7 = props.type === "file" && "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm";
    let t8;
    if ($[8] !== t4 || $[9] !== t5 || $[10] !== t6 || $[11] !== t7) {
        t8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5", t4, t5, t6, t7);
        $[8] = t4;
        $[9] = t5;
        $[10] = t6;
        $[11] = t7;
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    const inputClassName = t8;
    let t9;
    if ($[13] !== className || $[14] !== unstyled) {
        t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(!unstyled && "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]", className) || undefined;
        $[13] = className;
        $[14] = unstyled;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== inputClassName || $[17] !== nativeInput || $[18] !== props || $[19] !== size || $[20] !== style) {
        t10 = nativeInput ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: inputClassName,
            "data-slot": "input",
            size: typeof size === "number" ? size : undefined,
            style: typeof style === "function" ? undefined : style,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input.tsx",
            lineNumber: 80,
            columnNumber: 25
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$input$2f$Input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            className: inputClassName,
            "data-slot": "input",
            size: typeof size === "number" ? size : undefined,
            style: style,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input.tsx",
            lineNumber: 80,
            columnNumber: 200
        }, this);
        $[16] = inputClassName;
        $[17] = nativeInput;
        $[18] = props;
        $[19] = size;
        $[20] = style;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== size || $[23] !== t10 || $[24] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t9,
            "data-size": size,
            "data-slot": "input-control",
            children: t10
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/input.tsx",
            lineNumber: 92,
            columnNumber: 11
        }, this);
        $[22] = size;
        $[23] = t10;
        $[24] = t9;
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    return t11;
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$separator$2f$Separator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/separator/Separator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
function Separator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "b0b9a384d2a78994c334a95be5ecaaedc269f045186badb986346e8707abca8a") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b0b9a384d2a78994c334a95be5ecaaedc269f045186badb986346e8707abca8a";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, orientation: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const orientation = t1 === undefined ? "horizontal" : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== orientation || $[8] !== props || $[9] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$separator$2f$Separator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
            className: t2,
            "data-slot": "separator",
            orientation: orientation,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/separator.tsx",
            lineNumber: 41,
            columnNumber: 10
        }, this);
        $[7] = orientation;
        $[8] = props;
        $[9] = t2;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    return t3;
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/scroll-area.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/scroll-area/index.parts.js [app-client] (ecmascript) <export * as ScrollArea>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function ScrollArea(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(22);
    if ($[0] !== "8be25c48d09cc82194bd51c4c4d1b6f3a0188739fda8eba2e7a2ea2bb548a84b") {
        for(let $i = 0; $i < 22; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8be25c48d09cc82194bd51c4c4d1b6f3a0188739fda8eba2e7a2ea2bb548a84b";
    }
    let children;
    let className;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, children, scrollFade: t1, scrollbarGutter: t2, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = t1;
        $[6] = t2;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        t1 = $[5];
        t2 = $[6];
    }
    const scrollFade = t1 === undefined ? false : t1;
    const scrollbarGutter = t2 === undefined ? false : t2;
    let t3;
    if ($[7] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-full min-h-0", className);
        $[7] = className;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const t4 = scrollFade && "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]";
    const t5 = scrollbarGutter && "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5";
    let t6;
    if ($[9] !== t4 || $[10] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain", t4, t5);
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== children || $[13] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__["ScrollArea"].Viewport, {
            className: t6,
            "data-slot": "scroll-area-viewport",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, this);
        $[12] = children;
        $[13] = t6;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t10;
    let t8;
    let t9;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {
            orientation: "vertical"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 74,
            columnNumber: 10
        }, this);
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {
            orientation: "horizontal"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 75,
            columnNumber: 10
        }, this);
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__["ScrollArea"].Corner, {
            "data-slot": "scroll-area-corner"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 76,
            columnNumber: 11
        }, this);
        $[15] = t10;
        $[16] = t8;
        $[17] = t9;
    } else {
        t10 = $[15];
        t8 = $[16];
        t9 = $[17];
    }
    let t11;
    if ($[18] !== props || $[19] !== t3 || $[20] !== t7) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__["ScrollArea"].Root, {
            className: t3,
            ...props,
            children: [
                t7,
                t8,
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 87,
            columnNumber: 11
        }, this);
        $[18] = props;
        $[19] = t3;
        $[20] = t7;
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    return t11;
}
_c = ScrollArea;
function ScrollBar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "8be25c48d09cc82194bd51c4c4d1b6f3a0188739fda8eba2e7a2ea2bb548a84b") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8be25c48d09cc82194bd51c4c4d1b6f3a0188739fda8eba2e7a2ea2bb548a84b";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, orientation: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const orientation = t1 === undefined ? "vertical" : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("m-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__["ScrollArea"].Thumb, {
            className: "relative flex-1 rounded-full bg-foreground/20",
            "data-slot": "scroll-area-thumb"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 134,
            columnNumber: 10
        }, this);
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    let t4;
    if ($[8] !== orientation || $[9] !== props || $[10] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$scroll$2d$area$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ScrollArea$3e$__["ScrollArea"].Scrollbar, {
            className: t2,
            "data-slot": "scroll-area-scrollbar",
            orientation: orientation,
            ...props,
            children: t3
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/scroll-area.tsx",
            lineNumber: 141,
            columnNumber: 10
        }, this);
        $[8] = orientation;
        $[9] = props;
        $[10] = t2;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    return t4;
}
_c1 = ScrollBar;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScrollArea");
__turbopack_context__.k.register(_c1, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/sheet.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetBackdrop",
    ()=>SheetBackdrop,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetPopup,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetOverlay",
    ()=>SheetBackdrop,
    "SheetPanel",
    ()=>SheetPanel,
    "SheetPopup",
    ()=>SheetPopup,
    "SheetPortal",
    ()=>SheetPortal,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
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
function Sheet(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
    }
    let onOpenChange;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ onOpenChange, disablePointerDismissal: t1, ...props } = t0);
        $[1] = t0;
        $[2] = onOpenChange;
        $[3] = props;
        $[4] = t1;
    } else {
        onOpenChange = $[2];
        props = $[3];
        t1 = $[4];
    }
    const disablePointerDismissal = t1 === undefined ? true : t1;
    let t2;
    if ($[5] !== onOpenChange) {
        t2 = ({
            "Sheet[<SheetPrimitive.Root>.onOpenChange]": (open, eventDetails)=>{
                if (!open && eventDetails.reason === "escape-key") {
                    return;
                }
                onOpenChange?.(open, eventDetails);
            }
        })["Sheet[<SheetPrimitive.Root>.onOpenChange]"];
        $[5] = onOpenChange;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== disablePointerDismissal || $[8] !== props || $[9] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Root, {
            ...props,
            disablePointerDismissal: disablePointerDismissal,
            onOpenChange: t2
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 53,
            columnNumber: 10
        }, this);
        $[7] = disablePointerDismissal;
        $[8] = props;
        $[9] = t2;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    return t3;
}
_c = Sheet;
const SheetPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Portal;
function SheetTrigger(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Trigger, {
            "data-slot": "sheet-trigger",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 74,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c1 = SheetTrigger;
function SheetClose(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
            "data-slot": "sheet-close",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 92,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c2 = SheetClose;
function SheetBackdrop(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
            "data-slot": "sheet-backdrop",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 132,
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
_c3 = SheetBackdrop;
function SheetViewport(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
    }
    let props;
    let side;
    let t1;
    if ($[1] !== t0) {
        const { className, side: t2, variant: t3, ...t4 } = t0;
        side = t2;
        t1 = t3;
        props = t4;
        $[1] = t0;
        $[2] = props;
        $[3] = side;
        $[4] = t1;
    } else {
        props = $[2];
        side = $[3];
        t1 = $[4];
    }
    const variant = t1 === undefined ? "default" : t1;
    const t2 = side === "bottom" && "grid grid-rows-[1fr_auto] pt-12";
    const t3 = side === "top" && "grid grid-rows-[auto_1fr] pb-12";
    const t4 = side === "left" && "flex justify-start";
    const t5 = side === "right" && "flex justify-end";
    const t6 = variant === "inset" && "sm:p-4";
    let t7;
    if ($[5] !== t2 || $[6] !== t3 || $[7] !== t4 || $[8] !== t5 || $[9] !== t6) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 grid", t2, t3, t4, t5, t6);
        $[5] = t2;
        $[6] = t3;
        $[7] = t4;
        $[8] = t5;
        $[9] = t6;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== props || $[12] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Viewport, {
            className: t7,
            "data-slot": "sheet-viewport",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 191,
            columnNumber: 10
        }, this);
        $[11] = props;
        $[12] = t7;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    return t8;
}
_c4 = SheetViewport;
function SheetPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(29);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 29; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
    }
    let children;
    let className;
    let closeProps;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, children, showCloseButton: t1, side: t2, variant: t3, closeProps, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = closeProps;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
    } else {
        children = $[2];
        className = $[3];
        closeProps = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
        t3 = $[8];
    }
    const showCloseButton = t1 === undefined ? true : t1;
    const side = t2 === undefined ? "right" : t2;
    const variant = t3 === undefined ? "default" : t3;
    let t4;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetBackdrop, {}, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 247,
            columnNumber: 10
        }, this);
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const t5 = side === "bottom" && "row-start-2 border-t data-ending-style:translate-y-8 data-starting-style:translate-y-8";
    const t6 = side === "top" && "data-ending-style:-translate-y-8 data-starting-style:-translate-y-8 border-b";
    const t7 = side === "left" && "data-ending-style:-translate-x-8 data-starting-style:-translate-x-8 w-[calc(100%-(--spacing(12)))] max-w-md border-e";
    const t8 = side === "right" && "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-ending-style:translate-x-8 data-starting-style:translate-x-8";
    const t9 = variant === "inset" && "before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]";
    let t10;
    if ($[10] !== className || $[11] !== t5 || $[12] !== t6 || $[13] !== t7 || $[14] !== t8 || $[15] !== t9) {
        t10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 transition-[opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", t5, t6, t7, t8, t9, className);
        $[10] = className;
        $[11] = t5;
        $[12] = t6;
        $[13] = t7;
        $[14] = t8;
        $[15] = t9;
        $[16] = t10;
    } else {
        t10 = $[16];
    }
    let t11;
    if ($[17] !== closeProps || $[18] !== showCloseButton) {
        t11 = showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
            "aria-label": "Close",
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "icon",
                variant: "ghost"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/sheet.tsx",
                lineNumber: 272,
                columnNumber: 79
            }, void 0),
            ...closeProps,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute end-2 top-2", closeProps?.className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                fileName: "[project]/packages/ui/src/components/sheet.tsx",
                lineNumber: 272,
                columnNumber: 197
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 272,
            columnNumber: 30
        }, this);
        $[17] = closeProps;
        $[18] = showCloseButton;
        $[19] = t11;
    } else {
        t11 = $[19];
    }
    let t12;
    if ($[20] !== children || $[21] !== props || $[22] !== t10 || $[23] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Popup, {
            className: t10,
            "data-slot": "sheet-popup",
            ...props,
            children: [
                children,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 281,
            columnNumber: 11
        }, this);
        $[20] = children;
        $[21] = props;
        $[22] = t10;
        $[23] = t11;
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] !== side || $[26] !== t12 || $[27] !== variant) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetViewport, {
                    side: side,
                    variant: variant,
                    children: t12
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/sheet.tsx",
                    lineNumber: 292,
                    columnNumber: 28
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 292,
            columnNumber: 11
        }, this);
        $[25] = side;
        $[26] = t12;
        $[27] = variant;
        $[28] = t13;
    } else {
        t13 = $[28];
    }
    return t13;
}
_c5 = SheetPopup;
function SheetHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "sheet-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 334,
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
_c6 = SheetHeader;
function SheetFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
    const t3 = variant === "bare" && "in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3 pt-4 pb-6";
    let t4;
    if ($[5] !== className || $[6] !== t2 || $[7] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end", t2, t3, className);
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
            "data-slot": "sheet-footer",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 384,
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
_c7 = SheetFooter;
function SheetTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-heading font-semibold text-xl capitalize leading-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Title, {
            className: t1,
            "data-slot": "sheet-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 425,
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
_c8 = SheetTitle;
function SheetDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
            "data-slot": "sheet-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 466,
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
_c9 = SheetDescription;
function SheetPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8f9b51ee4c9f3b15c0955946afa008383674508a107a532c86fa026463829be4";
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
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            "data-slot": "sheet-panel",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 512,
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
            fileName: "[project]/packages/ui/src/components/sheet.tsx",
            lineNumber: 521,
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
_c10 = SheetPanel;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "Sheet");
__turbopack_context__.k.register(_c1, "SheetTrigger");
__turbopack_context__.k.register(_c2, "SheetClose");
__turbopack_context__.k.register(_c3, "SheetBackdrop");
__turbopack_context__.k.register(_c4, "SheetViewport");
__turbopack_context__.k.register(_c5, "SheetPopup");
__turbopack_context__.k.register(_c6, "SheetHeader");
__turbopack_context__.k.register(_c7, "SheetFooter");
__turbopack_context__.k.register(_c8, "SheetTitle");
__turbopack_context__.k.register(_c9, "SheetDescription");
__turbopack_context__.k.register(_c10, "SheetPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Skeleton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "555e94e239182713a4baad154ea45a7939940c4e457344a94c800b5c238454e2") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "555e94e239182713a4baad154ea45a7939940c4e457344a94c800b5c238454e2";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "skeleton",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/skeleton.tsx",
            lineNumber: 35,
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
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/tooltip.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipPopup,
    "TooltipCreateHandle",
    ()=>TooltipCreateHandle,
    "TooltipPopup",
    ()=>TooltipPopup,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/tooltip/index.parts.js [app-client] (ecmascript) <export * as Tooltip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const TooltipCreateHandle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].createHandle;
const TooltipProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Provider;
const Tooltip = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Root;
function TooltipTrigger(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "e39343c565c7837e0f130cc63be658269b8736313a28cae11c0dc40e58b47d59") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e39343c565c7837e0f130cc63be658269b8736313a28cae11c0dc40e58b47d59";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Trigger, {
            "data-slot": "tooltip-trigger",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tooltip.tsx",
            lineNumber: 19,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c = TooltipTrigger;
function TooltipPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "e39343c565c7837e0f130cc63be658269b8736313a28cae11c0dc40e58b47d59") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e39343c565c7837e0f130cc63be658269b8736313a28cae11c0dc40e58b47d59";
    }
    let anchor;
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, align: t1, sideOffset: t2, side: t3, anchor, children, ...props } = t0);
        $[1] = t0;
        $[2] = anchor;
        $[3] = children;
        $[4] = className;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
    } else {
        anchor = $[2];
        children = $[3];
        className = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
        t3 = $[8];
    }
    const align = t1 === undefined ? "center" : t1;
    const sideOffset = t2 === undefined ? 4 : t2;
    const side = t3 === undefined ? "top" : t3;
    let t4;
    if ($[9] !== className) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) text-balance rounded-md border bg-popover not-dark:bg-clip-padding text-popover-foreground text-xs shadow-md/5 transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 data-instant:duration-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className);
        $[9] = className;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== children) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Viewport, {
            className: "relative size-full overflow-clip px-(--viewport-inline-padding) py-1 [--viewport-inline-padding:--spacing(2)] data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:truncate **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity",
            "data-slot": "tooltip-viewport",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tooltip.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[11] = children;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== props || $[14] !== t4 || $[15] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Popup, {
            className: t4,
            "data-slot": "tooltip-popup",
            ...props,
            children: t5
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tooltip.tsx",
            lineNumber: 90,
            columnNumber: 10
        }, this);
        $[13] = props;
        $[14] = t4;
        $[15] = t5;
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    let t7;
    if ($[17] !== align || $[18] !== anchor || $[19] !== side || $[20] !== sideOffset || $[21] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$tooltip$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Positioner, {
                align: align,
                anchor: anchor,
                className: "z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none",
                "data-slot": "tooltip-positioner",
                side: side,
                sideOffset: sideOffset,
                children: t6
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/tooltip.tsx",
                lineNumber: 100,
                columnNumber: 35
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/tooltip.tsx",
            lineNumber: 100,
            columnNumber: 10
        }, this);
        $[17] = align;
        $[18] = anchor;
        $[19] = side;
        $[20] = sideOffset;
        $[21] = t6;
        $[22] = t7;
    } else {
        t7 = $[22];
    }
    return t7;
}
_c1 = TooltipPopup;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "TooltipTrigger");
__turbopack_context__.k.register(_c1, "TooltipPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar,
    "SidebarContent",
    ()=>SidebarContent,
    "SidebarFooter",
    ()=>SidebarFooter,
    "SidebarGroup",
    ()=>SidebarGroup,
    "SidebarGroupAction",
    ()=>SidebarGroupAction,
    "SidebarGroupContent",
    ()=>SidebarGroupContent,
    "SidebarGroupLabel",
    ()=>SidebarGroupLabel,
    "SidebarHeader",
    ()=>SidebarHeader,
    "SidebarInput",
    ()=>SidebarInput,
    "SidebarInset",
    ()=>SidebarInset,
    "SidebarMenu",
    ()=>SidebarMenu,
    "SidebarMenuAction",
    ()=>SidebarMenuAction,
    "SidebarMenuBadge",
    ()=>SidebarMenuBadge,
    "SidebarMenuButton",
    ()=>SidebarMenuButton,
    "SidebarMenuItem",
    ()=>SidebarMenuItem,
    "SidebarMenuSkeleton",
    ()=>SidebarMenuSkeleton,
    "SidebarMenuSub",
    ()=>SidebarMenuSub,
    "SidebarMenuSubButton",
    ()=>SidebarMenuSubButton,
    "SidebarMenuSubItem",
    ()=>SidebarMenuSubItem,
    "SidebarProvider",
    ()=>SidebarProvider,
    "SidebarRail",
    ()=>SidebarRail,
    "SidebarSeparator",
    ()=>SidebarSeparator,
    "SidebarTrigger",
    ()=>SidebarTrigger,
    "useSidebar",
    ()=>useSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/merge-props/mergeProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/use-render/useRender.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/hooks/use-mobile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/sheet.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/tooltip.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left.js [app-client] (ecmascript) <export default as PanelLeftIcon>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
"use client";
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
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
function useSidebar() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
}
_s(useSidebar, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function SidebarProvider(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(37);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let children;
    let className;
    let openProp;
    let props;
    let setOpenProp;
    let style;
    let t1;
    if ($[1] !== t0) {
        ({ defaultOpen: t1, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = openProp;
        $[5] = props;
        $[6] = setOpenProp;
        $[7] = style;
        $[8] = t1;
    } else {
        children = $[2];
        className = $[3];
        openProp = $[4];
        props = $[5];
        setOpenProp = $[6];
        style = $[7];
        t1 = $[8];
    }
    const defaultOpen = t1 === undefined ? true : t1;
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsMobile"])();
    const [openMobile, setOpenMobile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [_open, _setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultOpen);
    const open = openProp ?? _open;
    let t2;
    if ($[9] !== open || $[10] !== setOpenProp) {
        t2 = ({
            "SidebarProvider[setOpen]": (value)=>{
                const openState = typeof value === "function" ? value(open) : value;
                if (setOpenProp) {
                    setOpenProp(openState);
                } else {
                    _setOpen(openState);
                }
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
            }
        })["SidebarProvider[setOpen]"];
        $[9] = open;
        $[10] = setOpenProp;
        $[11] = t2;
    } else {
        t2 = $[11];
    }
    const setOpen = t2;
    let t3;
    if ($[12] !== isMobile || $[13] !== setOpen) {
        t3 = ({
            "SidebarProvider[toggleSidebar]": ()=>isMobile ? setOpenMobile(_SidebarProviderToggleSidebarSetOpenMobile) : setOpen(_SidebarProviderToggleSidebarSetOpen)
        })["SidebarProvider[toggleSidebar]"];
        $[12] = isMobile;
        $[13] = setOpen;
        $[14] = t3;
    } else {
        t3 = $[14];
    }
    const toggleSidebar = t3;
    let t4;
    let t5;
    if ($[15] !== toggleSidebar) {
        t4 = ({
            "SidebarProvider[useEffect()]": ()=>{
                const handleKeyDown = {
                    "SidebarProvider[useEffect() > handleKeyDown]": (event)=>{
                        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                            event.preventDefault();
                            toggleSidebar();
                        }
                    }
                }["SidebarProvider[useEffect() > handleKeyDown]"];
                window.addEventListener("keydown", handleKeyDown);
                return ()=>window.removeEventListener("keydown", handleKeyDown);
            }
        })["SidebarProvider[useEffect()]"];
        t5 = [
            toggleSidebar
        ];
        $[15] = toggleSidebar;
        $[16] = t4;
        $[17] = t5;
    } else {
        t4 = $[16];
        t5 = $[17];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](t4, t5);
    const state = open ? "expanded" : "collapsed";
    let t6;
    if ($[18] !== isMobile || $[19] !== open || $[20] !== openMobile || $[21] !== setOpen || $[22] !== state || $[23] !== toggleSidebar) {
        t6 = {
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar
        };
        $[18] = isMobile;
        $[19] = open;
        $[20] = openMobile;
        $[21] = setOpen;
        $[22] = state;
        $[23] = toggleSidebar;
        $[24] = t6;
    } else {
        t6 = $[24];
    }
    const contextValue = t6;
    let t7;
    if ($[25] !== style) {
        t7 = {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style
        };
        $[25] = style;
        $[26] = t7;
    } else {
        t7 = $[26];
    }
    const t8 = t7;
    let t9;
    if ($[27] !== className) {
        t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className);
        $[27] = className;
        $[28] = t9;
    } else {
        t9 = $[28];
    }
    let t10;
    if ($[29] !== children || $[30] !== props || $[31] !== t8 || $[32] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-wrapper",
            style: t8,
            className: t9,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 198,
            columnNumber: 11
        }, this);
        $[29] = children;
        $[30] = props;
        $[31] = t8;
        $[32] = t9;
        $[33] = t10;
    } else {
        t10 = $[33];
    }
    let t11;
    if ($[34] !== contextValue || $[35] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarContext.Provider, {
            value: contextValue,
            children: t10
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 209,
            columnNumber: 11
        }, this);
        $[34] = contextValue;
        $[35] = t10;
        $[36] = t11;
    } else {
        t11 = $[36];
    }
    return t11;
}
_s1(SidebarProvider, "0ZAYiinPhOCwukUFa7Y6HGjpAMM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsMobile"]
    ];
});
_c = SidebarProvider;
function _SidebarProviderToggleSidebarSetOpen(open_1) {
    return !open_1;
}
function _SidebarProviderToggleSidebarSetOpenMobile(open_0) {
    return !open_0;
}
function Sidebar(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(49);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 49; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let children;
    let className;
    let dir;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ side: t1, variant: t2, collapsible: t3, className, children, dir, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = dir;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
    } else {
        children = $[2];
        className = $[3];
        dir = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
        t3 = $[8];
    }
    const side = t1 === undefined ? "left" : t1;
    const variant = t2 === undefined ? "sidebar" : t2;
    const collapsible = t3 === undefined ? "offcanvas" : t3;
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
        let t4;
        if ($[9] !== className) {
            t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className);
            $[9] = className;
            $[10] = t4;
        } else {
            t4 = $[10];
        }
        let t5;
        if ($[11] !== children || $[12] !== props || $[13] !== t4) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-slot": "sidebar",
                className: t4,
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                lineNumber: 286,
                columnNumber: 12
            }, this);
            $[11] = children;
            $[12] = props;
            $[13] = t4;
            $[14] = t5;
        } else {
            t5 = $[14];
        }
        return t5;
    }
    if (isMobile) {
        let t4;
        if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            };
            $[15] = t4;
        } else {
            t4 = $[15];
        }
        let t5;
        if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetHeader"], {
                className: "sr-only",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetTitle"], {
                        children: "Sidebar"
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                        lineNumber: 308,
                        columnNumber: 45
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetDescription"], {
                        children: "Displays the mobile sidebar."
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                        lineNumber: 308,
                        columnNumber: 77
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                lineNumber: 308,
                columnNumber: 12
            }, this);
            $[16] = t5;
        } else {
            t5 = $[16];
        }
        let t6;
        if ($[17] !== children) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full w-full flex-col",
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                lineNumber: 315,
                columnNumber: 12
            }, this);
            $[17] = children;
            $[18] = t6;
        } else {
            t6 = $[18];
        }
        let t7;
        if ($[19] !== dir || $[20] !== side || $[21] !== t6) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetContent"], {
                dir: dir,
                "data-sidebar": "sidebar",
                "data-slot": "sidebar",
                "data-mobile": "true",
                className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
                style: t4,
                side: side,
                children: [
                    t5,
                    t6
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                lineNumber: 323,
                columnNumber: 12
            }, this);
            $[19] = dir;
            $[20] = side;
            $[21] = t6;
            $[22] = t7;
        } else {
            t7 = $[22];
        }
        let t8;
        if ($[23] !== openMobile || $[24] !== props || $[25] !== setOpenMobile || $[26] !== t7) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Sheet"], {
                disablePointerDismissal: false,
                onOpenChange: setOpenMobile,
                open: openMobile,
                ...props,
                children: t7
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/sidebar.tsx",
                lineNumber: 333,
                columnNumber: 12
            }, this);
            $[23] = openMobile;
            $[24] = props;
            $[25] = setOpenMobile;
            $[26] = t7;
            $[27] = t8;
        } else {
            t8 = $[27];
        }
        return t8;
    }
    const t4 = state === "collapsed" ? collapsible : "";
    const t5 = variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)";
    let t6;
    if ($[28] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", t5);
        $[28] = t5;
        $[29] = t6;
    } else {
        t6 = $[29];
    }
    let t7;
    if ($[30] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-gap",
            className: t6
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 356,
            columnNumber: 10
        }, this);
        $[30] = t6;
        $[31] = t7;
    } else {
        t7 = $[31];
    }
    const t8 = variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l";
    let t9;
    if ($[32] !== className || $[33] !== t8) {
        t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex", t8, className);
        $[32] = className;
        $[33] = t8;
        $[34] = t9;
    } else {
        t9 = $[34];
    }
    let t10;
    if ($[35] !== children) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-sidebar": "sidebar",
            "data-slot": "sidebar-inner",
            className: "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 374,
            columnNumber: 11
        }, this);
        $[35] = children;
        $[36] = t10;
    } else {
        t10 = $[36];
    }
    let t11;
    if ($[37] !== props || $[38] !== side || $[39] !== t10 || $[40] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-container",
            "data-side": side,
            className: t9,
            ...props,
            children: t10
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 382,
            columnNumber: 11
        }, this);
        $[37] = props;
        $[38] = side;
        $[39] = t10;
        $[40] = t9;
        $[41] = t11;
    } else {
        t11 = $[41];
    }
    let t12;
    if ($[42] !== side || $[43] !== state || $[44] !== t11 || $[45] !== t4 || $[46] !== t7 || $[47] !== variant) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "group peer hidden text-sidebar-foreground md:block",
            "data-state": state,
            "data-collapsible": t4,
            "data-variant": variant,
            "data-side": side,
            "data-slot": "sidebar",
            children: [
                t7,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 393,
            columnNumber: 11
        }, this);
        $[42] = side;
        $[43] = state;
        $[44] = t11;
        $[45] = t4;
        $[46] = t7;
        $[47] = variant;
        $[48] = t12;
    } else {
        t12 = $[48];
    }
    return t12;
}
_s2(Sidebar, "R9OgxJJZLEOvG+D620KHwrsfiWo=", false, function() {
    return [
        useSidebar
    ];
});
_c1 = Sidebar;
function SidebarTrigger(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let className;
    let onClick;
    let props;
    if ($[1] !== t0) {
        ({ className, onClick, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = onClick;
        $[4] = props;
    } else {
        className = $[2];
        onClick = $[3];
        props = $[4];
    }
    const { toggleSidebar } = useSidebar();
    let t1;
    if ($[5] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(className);
        $[5] = className;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] !== onClick || $[8] !== toggleSidebar) {
        t2 = ({
            "SidebarTrigger[<Button>.onClick]": (event)=>{
                onClick?.(event);
                toggleSidebar();
            }
        })["SidebarTrigger[<Button>.onClick]"];
        $[7] = onClick;
        $[8] = toggleSidebar;
        $[9] = t2;
    } else {
        t2 = $[9];
    }
    let t3;
    let t4;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__["PanelLeftIcon"], {}, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 460,
            columnNumber: 10
        }, this);
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "sr-only",
            children: "Toggle Sidebar"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 461,
            columnNumber: 10
        }, this);
        $[10] = t3;
        $[11] = t4;
    } else {
        t3 = $[10];
        t4 = $[11];
    }
    let t5;
    if ($[12] !== props || $[13] !== t1 || $[14] !== t2) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "data-sidebar": "trigger",
            "data-slot": "sidebar-trigger",
            variant: "ghost",
            size: "icon-sm",
            className: t1,
            onClick: t2,
            ...props,
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 470,
            columnNumber: 10
        }, this);
        $[12] = props;
        $[13] = t1;
        $[14] = t2;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    return t5;
}
_s3(SidebarTrigger, "iTa3amfp2FIH/7ALC+xy8tU1+Z0=", false, function() {
    return [
        useSidebar
    ];
});
_c2 = SidebarTrigger;
function SidebarRail(t0) {
    _s4();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
    const { toggleSidebar } = useSidebar();
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1 || $[8] !== toggleSidebar) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            "data-sidebar": "rail",
            "data-slot": "sidebar-rail",
            "aria-label": "Toggle Sidebar",
            tabIndex: -1,
            onClick: toggleSidebar,
            title: "Toggle Sidebar",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 515,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = toggleSidebar;
        $[9] = t2;
    } else {
        t2 = $[9];
    }
    return t2;
}
_s4(SidebarRail, "iTa3amfp2FIH/7ALC+xy8tU1+Z0=", false, function() {
    return [
        useSidebar
    ];
});
_c3 = SidebarRail;
function SidebarInset(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            "data-slot": "sidebar-inset",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 557,
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
_c4 = SidebarInset;
function SidebarInput(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-full bg-background shadow-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
            "data-slot": "sidebar-input",
            "data-sidebar": "input",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 598,
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
_c5 = SidebarInput;
function SidebarHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 p-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-header",
            "data-sidebar": "header",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 639,
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
_c6 = SidebarHeader;
function SidebarFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 p-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-footer",
            "data-sidebar": "footer",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 680,
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
_c7 = SidebarFooter;
function SidebarSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mx-2 w-auto bg-sidebar-border", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Separator"], {
            "data-slot": "sidebar-separator",
            "data-sidebar": "separator",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 721,
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
_c8 = SidebarSeparator;
function SidebarContent(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-content",
            "data-sidebar": "content",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 762,
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
_c9 = SidebarContent;
function SidebarGroup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full min-w-0 flex-col p-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-group",
            "data-sidebar": "group",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 803,
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
_c10 = SidebarGroup;
function SidebarGroupLabel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, render: t4, ...props } = t0;
        render = t4;
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "div";
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])({
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", className)
        }, props);
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
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            slot: "sidebar-group-label",
            sidebar: "group-label"
        };
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== render || $[8] !== t1 || $[9] !== t2) {
        t5 = {
            defaultTagName: t1,
            props: t2,
            render,
            state: t4
        };
        $[7] = render;
        $[8] = t1;
        $[9] = t2;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t3(t5);
}
_c11 = SidebarGroupLabel;
function SidebarGroupAction(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, render: t4, ...props } = t0;
        render = t4;
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "button";
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])({
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0", className)
        }, props);
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
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            slot: "sidebar-group-action",
            sidebar: "group-action"
        };
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== render || $[8] !== t1 || $[9] !== t2) {
        t5 = {
            defaultTagName: t1,
            props: t2,
            render,
            state: t4
        };
        $[7] = render;
        $[8] = t1;
        $[9] = t2;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t3(t5);
}
_c12 = SidebarGroupAction;
function SidebarGroupContent(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-group-content",
            "data-sidebar": "group-content",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 968,
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
_c13 = SidebarGroupContent;
function SidebarMenu(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full min-w-0 flex-col gap-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            "data-slot": "sidebar-menu",
            "data-sidebar": "menu",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1009,
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
_c14 = SidebarMenu;
function SidebarMenuItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/menu-item relative", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            "data-slot": "sidebar-menu-item",
            "data-sidebar": "menu-item",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1050,
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
_c15 = SidebarMenuItem;
const sidebarMenuButtonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate", {
    variants: {
        variant: {
            default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
        },
        size: {
            default: "h-8 text-sm",
            sm: "h-7 text-xs",
            lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function SidebarMenuButton(t0) {
    _s5();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let { render, isActive: t1, variant: t2, size: t3, tooltip, className, ...props } = t0;
    const isActive = t1 === undefined ? false : t1;
    const variant = t2 === undefined ? "default" : t2;
    const size = t3 === undefined ? "default" : t3;
    const { isMobile, state } = useSidebar();
    const t4 = "button";
    const t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])({
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sidebarMenuButtonVariants({
            variant,
            size
        }), className)
    }, props);
    let t6;
    if ($[1] !== render || $[2] !== tooltip) {
        t6 = !tooltip ? render : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TooltipTrigger"], {
            render: render
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1109,
            columnNumber: 30
        }, this);
        $[1] = render;
        $[2] = tooltip;
        $[3] = t6;
    } else {
        t6 = $[3];
    }
    let t7;
    if ($[4] !== isActive || $[5] !== size) {
        t7 = {
            slot: "sidebar-menu-button",
            sidebar: "menu-button",
            size,
            active: isActive
        };
        $[4] = isActive;
        $[5] = size;
        $[6] = t7;
    } else {
        t7 = $[6];
    }
    let t8;
    if ($[7] !== t5 || $[8] !== t6 || $[9] !== t7) {
        t8 = {
            defaultTagName: t4,
            props: t5,
            render: t6,
            state: t7
        };
        $[7] = t5;
        $[8] = t6;
        $[9] = t7;
        $[10] = t8;
    } else {
        t8 = $[10];
    }
    const comp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"])(t8);
    if (!tooltip) {
        return comp;
    }
    if (typeof tooltip === "string") {
        let t9;
        if ($[11] !== tooltip) {
            t9 = {
                children: tooltip
            };
            $[11] = tooltip;
            $[12] = t9;
        } else {
            t9 = $[12];
        }
        tooltip = t9;
    }
    const t9 = state !== "collapsed" || isMobile;
    let t10;
    if ($[13] !== t9 || $[14] !== tooltip) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TooltipContent"], {
            side: "right",
            align: "center",
            hidden: t9,
            ...tooltip
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1165,
            columnNumber: 11
        }, this);
        $[13] = t9;
        $[14] = tooltip;
        $[15] = t10;
    } else {
        t10 = $[15];
    }
    let t11;
    if ($[16] !== comp || $[17] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], {
            children: [
                comp,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1174,
            columnNumber: 11
        }, this);
        $[16] = comp;
        $[17] = t10;
        $[18] = t11;
    } else {
        t11 = $[18];
    }
    return t11;
}
_s5(SidebarMenuButton, "AM8asGVfTp5OK7Z3pF6ek4oMPPA=", false, function() {
    return [
        useSidebar,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"]
    ];
});
_c16 = SidebarMenuButton;
function SidebarMenuAction(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, render: t4, showOnHover: t5, ...props } = t0;
        render = t4;
        const showOnHover = t5 === undefined ? false : t5;
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "button";
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])({
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0", className)
        }, props);
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
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            slot: "sidebar-menu-action",
            sidebar: "menu-action"
        };
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== render || $[8] !== t1 || $[9] !== t2) {
        t5 = {
            defaultTagName: t1,
            props: t2,
            render,
            state: t4
        };
        $[7] = render;
        $[8] = t1;
        $[9] = t2;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t3(t5);
}
_c17 = SidebarMenuAction;
function SidebarMenuBadge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-menu-badge",
            "data-sidebar": "menu-badge",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1279,
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
_c18 = SidebarMenuBadge;
function SidebarMenuSkeleton(t0) {
    _s6();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, showIcon: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const showIcon = t1 === undefined ? false : t1;
    const [width] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](_SidebarMenuSkeletonUseState);
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-8 items-center gap-2 rounded-md px-2", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== showIcon) {
        t3 = showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1326,
            columnNumber: 22
        }, this);
        $[7] = showIcon;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== width) {
        t4 = {
            "--skeleton-width": width
        };
        $[9] = width;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const t5 = t4;
    let t6;
    if ($[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
            className: "h-4 max-w-(--skeleton-width) flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: t5
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1345,
            columnNumber: 10
        }, this);
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== props || $[14] !== t2 || $[15] !== t3 || $[16] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar-menu-skeleton",
            "data-sidebar": "menu-skeleton",
            className: t2,
            ...props,
            children: [
                t3,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1353,
            columnNumber: 10
        }, this);
        $[13] = props;
        $[14] = t2;
        $[15] = t3;
        $[16] = t6;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    return t7;
}
_s6(SidebarMenuSkeleton, "eqwPQnf3qk/HxlRGim7GtSBP3EY=");
_c19 = SidebarMenuSkeleton;
function _SidebarMenuSkeletonUseState() {
    return `${Math.floor(Math.random() * 40) + 50}%`;
}
function SidebarMenuSub(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            "data-slot": "sidebar-menu-sub",
            "data-sidebar": "menu-sub",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1399,
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
_c20 = SidebarMenuSub;
function SidebarMenuSubItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/menu-sub-item relative", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            "data-slot": "sidebar-menu-sub-item",
            "data-sidebar": "menu-sub-item",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/sidebar.tsx",
            lineNumber: 1440,
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
_c21 = SidebarMenuSubItem;
function SidebarMenuSubButton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "550f8b227077bfe50ce7421c24842ce305124df21e64e2c9bd98a853230783ac";
    }
    let isActive;
    let render;
    let size;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { render: t4, size: t5, isActive: t6, className, ...props } = t0;
        render = t4;
        size = t5 === undefined ? "md" : t5;
        isActive = t6 === undefined ? false : t6;
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "a";
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])({
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", className)
        }, props);
        $[1] = t0;
        $[2] = isActive;
        $[3] = render;
        $[4] = size;
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        isActive = $[2];
        render = $[3];
        size = $[4];
        t1 = $[5];
        t2 = $[6];
        t3 = $[7];
    }
    let t4;
    if ($[8] !== isActive || $[9] !== size) {
        t4 = {
            slot: "sidebar-menu-sub-button",
            sidebar: "menu-sub-button",
            size,
            active: isActive
        };
        $[8] = isActive;
        $[9] = size;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== render || $[12] !== t1 || $[13] !== t2 || $[14] !== t4) {
        t5 = {
            defaultTagName: t1,
            props: t2,
            render,
            state: t4
        };
        $[11] = render;
        $[12] = t1;
        $[13] = t2;
        $[14] = t4;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    return t3(t5);
}
_c22 = SidebarMenuSubButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22;
__turbopack_context__.k.register(_c, "SidebarProvider");
__turbopack_context__.k.register(_c1, "Sidebar");
__turbopack_context__.k.register(_c2, "SidebarTrigger");
__turbopack_context__.k.register(_c3, "SidebarRail");
__turbopack_context__.k.register(_c4, "SidebarInset");
__turbopack_context__.k.register(_c5, "SidebarInput");
__turbopack_context__.k.register(_c6, "SidebarHeader");
__turbopack_context__.k.register(_c7, "SidebarFooter");
__turbopack_context__.k.register(_c8, "SidebarSeparator");
__turbopack_context__.k.register(_c9, "SidebarContent");
__turbopack_context__.k.register(_c10, "SidebarGroup");
__turbopack_context__.k.register(_c11, "SidebarGroupLabel");
__turbopack_context__.k.register(_c12, "SidebarGroupAction");
__turbopack_context__.k.register(_c13, "SidebarGroupContent");
__turbopack_context__.k.register(_c14, "SidebarMenu");
__turbopack_context__.k.register(_c15, "SidebarMenuItem");
__turbopack_context__.k.register(_c16, "SidebarMenuButton");
__turbopack_context__.k.register(_c17, "SidebarMenuAction");
__turbopack_context__.k.register(_c18, "SidebarMenuBadge");
__turbopack_context__.k.register(_c19, "SidebarMenuSkeleton");
__turbopack_context__.k.register(_c20, "SidebarMenuSub");
__turbopack_context__.k.register(_c21, "SidebarMenuSubItem");
__turbopack_context__.k.register(_c22, "SidebarMenuSubButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/alert-dialog.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogBackdrop",
    ()=>AlertDialogBackdrop,
    "AlertDialogClose",
    ()=>AlertDialogClose,
    "AlertDialogContent",
    ()=>AlertDialogPopup,
    "AlertDialogCreateHandle",
    ()=>AlertDialogCreateHandle,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogBackdrop,
    "AlertDialogPopup",
    ()=>AlertDialogPopup,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger,
    "AlertDialogViewport",
    ()=>AlertDialogViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/alert-dialog/index.parts.js [app-client] (ecmascript) <export * as AlertDialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const AlertDialogCreateHandle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].createHandle;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Root;
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Portal;
function AlertDialogTrigger(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Trigger, {
            "data-slot": "alert-dialog-trigger",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 19,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c = AlertDialogTrigger;
function AlertDialogBackdrop(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Backdrop, {
            className: t1,
            "data-slot": "alert-dialog-backdrop",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 59,
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
_c1 = AlertDialogBackdrop;
function AlertDialogViewport(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Viewport, {
            className: t1,
            "data-slot": "alert-dialog-viewport",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 100,
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
_c2 = AlertDialogViewport;
function AlertDialogPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, bottomStickOnMobile: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const bottomStickOnMobile = t1 === undefined ? true : t1;
    let t2;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogBackdrop, {}, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 138,
            columnNumber: 10
        }, this);
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    const t3 = bottomStickOnMobile && "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12";
    let t4;
    if ($[6] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(t3);
        $[6] = t3;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const t5 = bottomStickOnMobile && "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4 max-sm:before:hidden max-sm:before:rounded-none";
    let t6;
    if ($[8] !== className || $[9] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg origin-center flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-var(--nested-dialogs))] shadow-lg/5 transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", t5, className);
        $[8] = className;
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== props || $[12] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Popup, {
            className: t6,
            "data-slot": "alert-dialog-popup",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 164,
            columnNumber: 10
        }, this);
        $[11] = props;
        $[12] = t6;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== t4 || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogViewport, {
                    className: t4,
                    children: t7
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
                    lineNumber: 173,
                    columnNumber: 33
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 173,
            columnNumber: 10
        }, this);
        $[14] = t4;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    return t8;
}
_c3 = AlertDialogPopup;
function AlertDialogHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 p-6 text-center max-sm:pb-4 sm:text-left", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-slot": "alert-dialog-header",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
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
_c4 = AlertDialogHeader;
function AlertDialogFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
    const t3 = variant === "bare" && "pb-6";
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
            "data-slot": "alert-dialog-footer",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 264,
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
_c5 = AlertDialogFooter;
function AlertDialogTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Title, {
            className: t1,
            "data-slot": "alert-dialog-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 305,
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
_c6 = AlertDialogTitle;
function AlertDialogDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Description, {
            className: t1,
            "data-slot": "alert-dialog-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 346,
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
_c7 = AlertDialogDescription;
function AlertDialogClose(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9a6c6638a2ac7e9c0ce8b8be50fbefab3219ee02ff330383534d9590b344e775";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$alert$2d$dialog$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__AlertDialog$3e$__["AlertDialog"].Close, {
            "data-slot": "alert-dialog-close",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/alert-dialog.tsx",
            lineNumber: 365,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c8 = AlertDialogClose;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "AlertDialogTrigger");
__turbopack_context__.k.register(_c1, "AlertDialogBackdrop");
__turbopack_context__.k.register(_c2, "AlertDialogViewport");
__turbopack_context__.k.register(_c3, "AlertDialogPopup");
__turbopack_context__.k.register(_c4, "AlertDialogHeader");
__turbopack_context__.k.register(_c5, "AlertDialogFooter");
__turbopack_context__.k.register(_c6, "AlertDialogTitle");
__turbopack_context__.k.register(_c7, "AlertDialogDescription");
__turbopack_context__.k.register(_c8, "AlertDialogClose");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/toggle.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toggle",
    ()=>Toggle,
    "toggleVariants",
    ()=>toggleVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$toggle$2f$Toggle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/toggle/Toggle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const toggleVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base text-foreground outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 data-pressed:bg-input/64 data-pressed:text-accent-foreground sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    defaultVariants: {
        size: "default",
        variant: "default"
    },
    variants: {
        size: {
            default: "h-9 min-w-9 px-[calc(--spacing(2)-1px)] sm:h-8 sm:min-w-8",
            lg: "h-10 min-w-10 px-[calc(--spacing(2.5)-1px)] sm:h-9 sm:min-w-9",
            sm: "h-8 min-w-8 px-[calc(--spacing(1.5)-1px)] sm:h-7 sm:min-w-7"
        },
        variant: {
            default: "border-transparent",
            outline: "border-input bg-background not-dark:bg-clip-padding shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-input/32 dark:data-pressed:bg-input dark:hover:bg-input/64 dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] dark:not-disabled:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/2%)] [:disabled,:active,[data-pressed]]:shadow-none"
        }
    }
});
function Toggle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "4b4fcddb4777a0cabf088eb016e979a3f0c74496d8cdf3e983d3645afaecdbb7") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4b4fcddb4777a0cabf088eb016e979a3f0c74496d8cdf3e983d3645afaecdbb7";
    }
    let className;
    let props;
    let size;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, size, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = size;
        $[5] = variant;
    } else {
        className = $[2];
        props = $[3];
        size = $[4];
        variant = $[5];
    }
    let t1;
    if ($[6] !== className || $[7] !== size || $[8] !== variant) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toggleVariants({
            className,
            size,
            variant
        }));
        $[6] = className;
        $[7] = size;
        $[8] = variant;
        $[9] = t1;
    } else {
        t1 = $[9];
    }
    let t2;
    if ($[10] !== props || $[11] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$toggle$2f$Toggle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
            className: t1,
            "data-slot": "toggle",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/toggle.tsx",
            lineNumber: 70,
            columnNumber: 10
        }, this);
        $[10] = props;
        $[11] = t1;
        $[12] = t2;
    } else {
        t2 = $[12];
    }
    return t2;
}
_c = Toggle;
;
var _c;
__turbopack_context__.k.register(_c, "Toggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/toggle-group.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toggle",
    ()=>Toggle,
    "ToggleGroup",
    ()=>ToggleGroup,
    "ToggleGroupItem",
    ()=>Toggle,
    "ToggleGroupSeparator",
    ()=>ToggleGroupSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/toggle-group/ToggleGroup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toggle.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const ToggleGroupContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]({
    size: "default",
    variant: "default"
});
function ToggleGroup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833";
    }
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, variant: t1, size: t2, orientation: t3, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        t1 = $[5];
        t2 = $[6];
        t3 = $[7];
    }
    const variant = t1 === undefined ? "default" : t1;
    const size = t2 === undefined ? "default" : t2;
    const orientation = t3 === undefined ? "horizontal" : t3;
    const t4 = orientation === "horizontal" ? "*:pointer-coarse:after:min-w-auto" : "*:pointer-coarse:after:min-h-auto";
    const t5 = variant === "default" ? "gap-0.5" : orientation === "horizontal" ? "*:not-first:not-data-[slot=separator]:before:-start-[0.5px] *:not-last:not-data-[slot=separator]:before:-end-[0.5px] *:not-first:rounded-s-none *:not-last:rounded-e-none *:not-first:border-s-0 *:not-last:border-e-0 *:not-first:before:rounded-s-none *:not-last:before:rounded-e-none" : "*:not-first:not-data-[slot=separator]:before:-top-[0.5px] *:not-last:not-data-[slot=separator]:before:-bottom-[0.5px] flex-col *:not-first:rounded-t-none *:not-last:rounded-b-none *:not-first:border-t-0 *:not-last:border-b-0 *:not-first:before:rounded-t-none *:not-last:before:rounded-b-none *:data-[slot=toggle]:not-last:before:hidden dark:*:last:before:hidden dark:*:first:before:block";
    let t6;
    if ($[8] !== className || $[9] !== t4 || $[10] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-fit *:focus-visible:z-10 dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input", t4, t5, className);
        $[8] = className;
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== size || $[13] !== variant) {
        t7 = {
            size,
            variant
        };
        $[12] = size;
        $[13] = variant;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== children || $[16] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroupContext.Provider, {
            value: t7,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/toggle-group.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[15] = children;
        $[16] = t7;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== orientation || $[19] !== props || $[20] !== size || $[21] !== t6 || $[22] !== t8 || $[23] !== variant) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToggleGroup"], {
            className: t6,
            "data-size": size,
            "data-slot": "toggle-group",
            "data-variant": variant,
            orientation: orientation,
            ...props,
            children: t8
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/toggle-group.tsx",
            lineNumber: 91,
            columnNumber: 10
        }, this);
        $[18] = orientation;
        $[19] = props;
        $[20] = size;
        $[21] = t6;
        $[22] = t8;
        $[23] = variant;
        $[24] = t9;
    } else {
        t9 = $[24];
    }
    return t9;
}
_c = ToggleGroup;
function Toggle(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833";
    }
    let children;
    let className;
    let props;
    let size;
    let variant;
    if ($[1] !== t0) {
        ({ className, children, variant, size, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = size;
        $[6] = variant;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        size = $[5];
        variant = $[6];
    }
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ToggleGroupContext);
    const resolvedVariant = context.variant || variant;
    const resolvedSize = context.size || size;
    let t1;
    if ($[7] !== children || $[8] !== className || $[9] !== props || $[10] !== resolvedSize || $[11] !== resolvedVariant) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Toggle"], {
            className: className,
            "data-size": resolvedSize,
            "data-variant": resolvedVariant,
            size: resolvedSize,
            variant: resolvedVariant,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/toggle-group.tsx",
            lineNumber: 143,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = className;
        $[9] = props;
        $[10] = resolvedSize;
        $[11] = resolvedVariant;
        $[12] = t1;
    } else {
        t1 = $[12];
    }
    return t1;
}
_s(Toggle, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
_c1 = Toggle;
function ToggleGroupSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1123a34d6f12af480f3ddfd9eaacc581529af0d1ac0443e54d13359173713833";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, orientation: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const orientation = t1 === undefined ? "vertical" : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none relative bg-input before:absolute before:inset-0 dark:before:bg-input/32", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== orientation || $[8] !== props || $[9] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Separator"], {
            className: t2,
            orientation: orientation,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/toggle-group.tsx",
            lineNumber: 192,
            columnNumber: 10
        }, this);
        $[7] = orientation;
        $[8] = props;
        $[9] = t2;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    return t3;
}
_c2 = ToggleGroupSeparator;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ToggleGroup");
__turbopack_context__.k.register(_c1, "Toggle");
__turbopack_context__.k.register(_c2, "ToggleGroupSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/stores/app-mode-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppModeStore",
    ()=>useAppModeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useAppModeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        mode: 'builder',
        setMode: (mode)=>{
            set({
                mode
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/app-mode-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppModeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/alert-dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toggle-group.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$stores$2f$app$2d$mode$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/stores/app-mode-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function AppModeToggle() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "d8120cf301a48f4737eb8c5c8c04e6ffe51b2f5d6fc8c5ab4a3c50f44faafa10") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d8120cf301a48f4737eb8c5c8c04e6ffe51b2f5d6fc8c5ab4a3c50f44faafa10";
    }
    const mode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$stores$2f$app$2d$mode$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppModeStore"])(_AppModeToggleUseAppModeStore);
    const setMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$stores$2f$app$2d$mode$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppModeStore"])(_AppModeToggleUseAppModeStore2);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingMode, setPendingMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t0;
    if ($[1] !== mode || $[2] !== setMode) {
        t0 = ({
            "AppModeToggle[onModeChange]": (nextModeValues)=>{
                const nextModeValue = nextModeValues.at(-1);
                if (!nextModeValue) {
                    return;
                }
                if (nextModeValue !== "builder" && nextModeValue !== "client") {
                    return;
                }
                const nextMode = nextModeValue;
                if (nextMode === mode) {
                    return;
                }
                if (mode === "client" && nextMode === "builder") {
                    setPendingMode(nextMode);
                    setOpen(true);
                    return;
                }
                setMode(nextMode);
            }
        })["AppModeToggle[onModeChange]"];
        $[1] = mode;
        $[2] = setMode;
        $[3] = t0;
    } else {
        t0 = $[3];
    }
    const onModeChange = t0;
    let t1;
    if ($[4] !== pendingMode || $[5] !== setMode) {
        t1 = ({
            "AppModeToggle[onConfirmBuilderMode]": ()=>{
                if (pendingMode) {
                    setMode(pendingMode);
                }
                setPendingMode(null);
                setOpen(false);
            }
        })["AppModeToggle[onConfirmBuilderMode]"];
        $[4] = pendingMode;
        $[5] = setMode;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    const onConfirmBuilderMode = t1;
    let t2;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "AppModeToggle[onCancelBuilderMode]": ()=>{
                setPendingMode(null);
                setOpen(false);
            }
        })["AppModeToggle[onCancelBuilderMode]"];
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    const onCancelBuilderMode = t2;
    let t3;
    if ($[8] !== mode) {
        t3 = [
            mode
        ];
        $[8] = mode;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    let t5;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ToggleGroupItem"], {
            className: "data-pressed:cursor-default data-pressed:hover:bg-input",
            value: "builder",
            children: "Builder"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ToggleGroupItem"], {
            className: "data-pressed:cursor-default data-pressed:hover:bg-input",
            value: "client",
            children: "Client"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[10] = t4;
        $[11] = t5;
    } else {
        t4 = $[10];
        t5 = $[11];
    }
    let t6;
    if ($[12] !== onModeChange || $[13] !== t3) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toggle$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ToggleGroup"], {
            "aria-label": "Application mode",
            onValueChange: onModeChange,
            value: t3,
            variant: "outline",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 103,
            columnNumber: 10
        }, this);
        $[12] = onModeChange;
        $[13] = t3;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogHeader"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogTitle"], {
                    children: "Switch to Builder mode?"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
                    lineNumber: 112,
                    columnNumber: 29
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogDescription"], {
                    children: "You are switching from Client to Builder mode. Continue?"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
                    lineNumber: 112,
                    columnNumber: 89
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 112,
            columnNumber: 10
        }, this);
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogClose"], {
            onClick: onCancelBuilderMode,
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
                lineNumber: 119,
                columnNumber: 66
            }, void 0),
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== onConfirmBuilderMode) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogContent"], {
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogFooter"], {
                    children: [
                        t8,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onConfirmBuilderMode,
                            type: "button",
                            children: "Switch to Builder"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
                            lineNumber: 126,
                            columnNumber: 57
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
                    lineNumber: 126,
                    columnNumber: 34
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 126,
            columnNumber: 10
        }, this);
        $[17] = onConfirmBuilderMode;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== open || $[20] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialog"], {
            onOpenChange: setOpen,
            open: open,
            children: t9
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-mode-toggle.tsx",
            lineNumber: 134,
            columnNumber: 11
        }, this);
        $[19] = open;
        $[20] = t9;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== t10 || $[23] !== t6) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t6,
                t10
            ]
        }, void 0, true);
        $[22] = t10;
        $[23] = t6;
        $[24] = t11;
    } else {
        t11 = $[24];
    }
    return t11;
}
_s(AppModeToggle, "JVWhO+2nx+6d9ETGXdw1DnKf1uo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$stores$2f$app$2d$mode$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppModeStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$stores$2f$app$2d$mode$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppModeStore"]
    ];
});
_c = AppModeToggle;
function _AppModeToggleUseAppModeStore2(state_0) {
    return state_0.setMode;
}
function _AppModeToggleUseAppModeStore(state) {
    return state.mode;
}
var _c;
__turbopack_context__.k.register(_c, "AppModeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/packages/ui/src/components/collapsible.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Collapsible",
    ()=>Collapsible,
    "CollapsibleContent",
    ()=>CollapsiblePanel,
    "CollapsiblePanel",
    ()=>CollapsiblePanel,
    "CollapsibleTrigger",
    ()=>CollapsibleTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$collapsible$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Collapsible$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/collapsible/index.parts.js [app-client] (ecmascript) <export * as Collapsible>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Collapsible(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4";
    }
    let props;
    if ($[1] !== t0) {
        ({ ...props } = t0);
        $[1] = t0;
        $[2] = props;
    } else {
        props = $[2];
    }
    let t1;
    if ($[3] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$collapsible$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Collapsible$3e$__["Collapsible"].Root, {
            "data-slot": "collapsible",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/collapsible.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, this);
        $[3] = props;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    return t1;
}
_c = Collapsible;
function CollapsibleTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("cursor-pointer", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$collapsible$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Collapsible$3e$__["Collapsible"].Trigger, {
            className: t1,
            "data-slot": "collapsible-trigger",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/collapsible.tsx",
            lineNumber: 66,
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
_c1 = CollapsibleTrigger;
function CollapsiblePanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cd206976f8200a6f246360cd2db50073de4801508ad75295f1b71be0d303b2d4";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$collapsible$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Collapsible$3e$__["Collapsible"].Panel, {
            className: t1,
            "data-slot": "collapsible-panel",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/collapsible.tsx",
            lineNumber: 107,
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
_c2 = CollapsiblePanel;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Collapsible");
__turbopack_context__.k.register(_c1, "CollapsibleTrigger");
__turbopack_context__.k.register(_c2, "CollapsiblePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/app-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/collapsible.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$todo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListTodo$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list-todo.js [app-client] (ecmascript) <export default as ListTodo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/squares-intersect.js [app-client] (ecmascript) <export default as SquaresIntersect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
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
function isItemWithSub(item) {
    return 'items' in item && item.items && item.items.length > 0;
}
// Menu items with path for role-based filtering.
const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        path: '/dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        title: 'Projects',
        url: '/projects',
        path: '/projects',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
    },
    {
        title: 'Inclusions',
        url: '/inclusions',
        path: '/inclusions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$squares$2d$intersect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquaresIntersect$3e$__["SquaresIntersect"]
    },
    {
        title: 'Materials',
        url: '/materials',
        path: '/materials',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    {
        title: 'Schedules',
        url: '/schedules',
        path: '/schedules',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"]
    },
    {
        title: 'Tasks',
        url: '/tasks',
        path: '/tasks',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$todo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListTodo$3e$__["ListTodo"]
    },
    {
        title: 'Budgets',
        url: '/budgets',
        path: '/budgets',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"]
    },
    {
        title: 'Documents',
        url: '/documents',
        path: '/documents',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        title: 'Notifications',
        url: '/notifications',
        path: '/notifications',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        title: 'Users',
        url: '/users',
        path: '/users',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        superAdminOnly: true
    },
    {
        title: 'Lists',
        url: '#',
        path: '#',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"],
        items: [
            {
                title: 'Locations',
                url: '/locations',
                path: '/locations'
            },
            {
                title: 'Trades',
                url: '/trades',
                path: '/trades'
            },
            {
                title: 'Vendors',
                url: '/vendors',
                path: '/vendors'
            },
            {
                title: 'Material Colors',
                url: '/material-colors',
                path: '/material-colors'
            },
            {
                title: 'Document Folders',
                url: '/document-folders',
                path: '/document-folders'
            },
            {
                title: 'Service Providers',
                url: '/service-providers',
                path: '/service-providers'
            },
            {
                title: 'Take Offs Categories',
                url: '/takeoff-categories',
                path: '/takeoff-categories'
            }
        ]
    },
    {
        title: 'Website',
        url: '#',
        path: '#',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        items: [
            {
                title: 'Projects',
                url: '/website',
                path: '/website'
            },
            {
                title: 'Banners',
                url: '/website/banners',
                path: '/website/banners'
            },
            {
                title: 'Leads',
                url: '/leads',
                path: '/leads'
            }
        ]
    },
    {
        title: 'Settings',
        url: '#',
        path: '#',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        items: [
            {
                title: 'Email Templates',
                url: '/settings/email-templates',
                path: '/settings/email-templates'
            },
            {
                title: 'Email Signatures',
                url: '/settings/signatures',
                path: '/settings/signatures'
            }
        ]
    }
];
function hasPathMatch(pathname, allowedPath) {
    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
}
const AppSidebar = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "4a91f75363c97f13e236bbc00ef52233499025f3bc79b519bfc95cfae9f06151") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4a91f75363c97f13e236bbc00ef52233499025f3bc79b519bfc95cfae9f06151";
    }
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const permissionsByRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].permissions.list.list, {}) ?? {};
    const userRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])().user?.publicMetadata?.roles ?? [];
    const isAdmin = userRoles.includes("admin");
    const isSuperAdmin = userRoles.includes("super-admin");
    const allowedPaths = new Set();
    for (const role of userRoles){
        if (role === "admin" || role === "member") {
            continue;
        }
        const permission = permissionsByRole[role];
        if (!permission) {
            continue;
        }
        for (const path of permission.paths){
            allowedPaths.add(path);
        }
    }
    const hasAccessToPath = (path_0)=>{
        if (path_0 === "#") {
            return false;
        }
        if (isAdmin) {
            return true;
        }
        return [
            ...allowedPaths
        ].some((allowedPath)=>hasPathMatch(path_0, allowedPath));
    };
    const filteredItems = items.filter((item)=>{
        if (item.superAdminOnly) {
            return isSuperAdmin;
        }
        if (isItemWithSub(item)) {
            const visibleSubItems = item.items.filter((sub)=>hasAccessToPath(sub.path));
            return visibleSubItems.length > 0;
        }
        return hasAccessToPath(item.path);
    });
    let t0;
    if ($[1] !== pathname) {
        t0 = (url)=>pathname?.startsWith(url);
        $[1] = pathname;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const isActive = t0;
    let t1;
    if ($[3] !== pathname) {
        t1 = (subUrl, siblings)=>{
            if (!(pathname && hasPathMatch(pathname, subUrl))) {
                return false;
            }
            return !siblings.some((sibling)=>sibling.url !== subUrl && sibling.url.startsWith(`${subUrl}/`) && hasPathMatch(pathname, sibling.url));
        };
        $[3] = pathname;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const isSubItemActive = t1;
    let t2;
    if ($[5] !== isActive) {
        t2 = (subItems)=>{
            if (!subItems) {
                return false;
            }
            return subItems.some((subItem)=>isActive(subItem.url));
        };
        $[5] = isActive;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const hasActiveSubItem = t2;
    const T0 = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"];
    let t3;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 mb-2 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        alt: "Logo",
                        height: 32,
                        priority: true,
                        src: "/lh-admin-logo-no-bg.png",
                        width: 150
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                        lineNumber: 240,
                        columnNumber: 87
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/app-sidebar.tsx",
                    lineNumber: 240,
                    columnNumber: 72
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                lineNumber: 240,
                columnNumber: 25
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 240,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const T1 = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarContent"];
    const T2 = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"];
    const T3 = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupContent"];
    const T4 = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"];
    const t4 = "gap-2";
    const t5 = filteredItems.map((item_0)=>{
        if (isItemWithSub(item_0)) {
            const visibleSubItems_0 = item_0.items.filter((sub_0)=>hasAccessToPath(sub_0.path));
            const isOpen = hasActiveSubItem(visibleSubItems_0);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Collapsible"], {
                defaultOpen: isOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CollapsibleTrigger"], {
                            nativeButton: false,
                            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                lineNumber: 254,
                                columnNumber: 133
                            }, void 0),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                isActive: isOpen,
                                tooltip: item_0.title,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item_0.icon, {}, void 0, false, {
                                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                        lineNumber: 254,
                                        columnNumber: 202
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item_0.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                        lineNumber: 254,
                                        columnNumber: 217
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "ml-auto transition-transform duration-200 group-data-[state=open]/menu-item:rotate-180"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                        lineNumber: 254,
                                        columnNumber: 244
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                lineNumber: 254,
                                columnNumber: 142
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/app-sidebar.tsx",
                            lineNumber: 254,
                            columnNumber: 84
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CollapsibleContent"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSub"], {
                                children: visibleSubItems_0.map((subItem_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubItem"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubButton"], {
                                            isActive: isSubItemActive(subItem_0.url, visibleSubItems_0),
                                            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: subItem_0.url
                                            }, void 0, false, {
                                                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                                lineNumber: 254,
                                                columnNumber: 604
                                            }, void 0),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: subItem_0.title
                                            }, void 0, false, {
                                                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                                lineNumber: 254,
                                                columnNumber: 664
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                            lineNumber: 254,
                                            columnNumber: 513
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, subItem_0.title, false, {
                                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                        lineNumber: 254,
                                        columnNumber: 471
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                                lineNumber: 254,
                                columnNumber: 419
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/app-sidebar.tsx",
                            lineNumber: 254,
                            columnNumber: 399
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/app-sidebar.tsx",
                    lineNumber: 254,
                    columnNumber: 67
                }, ("TURBOPACK compile-time value", void 0))
            }, item_0.title, false, {
                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                lineNumber: 254,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                isActive: isActive(item_0.url),
                render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: item_0.url
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/app-sidebar.tsx",
                    lineNumber: 256,
                    columnNumber: 107
                }, void 0),
                tooltip: item_0.title,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item_0.icon, {}, void 0, false, {
                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                        lineNumber: 256,
                        columnNumber: 187
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: item_0.title
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/app-sidebar.tsx",
                        lineNumber: 256,
                        columnNumber: 202
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/app-sidebar.tsx",
                lineNumber: 256,
                columnNumber: 48
            }, ("TURBOPACK compile-time value", void 0))
        }, item_0.title, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 256,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    });
    let t6;
    if ($[8] !== T4 || $[9] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T4, {
            className: t4,
            children: t5
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 260,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = T4;
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== T3 || $[12] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T3, {
            children: t6
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 269,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[11] = T3;
        $[12] = t6;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== T2 || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T2, {
            children: t7
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 278,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[14] = T2;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== T1 || $[18] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T1, {
            children: t8
        }, void 0, false, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 287,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = T1;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] !== T0 || $[21] !== t3 || $[22] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            children: [
                t3,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/app-sidebar.tsx",
            lineNumber: 296,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = T0;
        $[21] = t3;
        $[22] = t9;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    return t10;
};
_s(AppSidebar, "uwq+nGsGwIZKy+rMqSPmPj7ibxQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = AppSidebar;
const __TURBOPACK__default__export__ = AppSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppSidebar");
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
"[project]/apps/app/components/notifications/format-notification-time.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatNotificationTime",
    ()=>formatNotificationTime
]);
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
});
function formatNotificationTime(timestamp) {
    const diff = Date.now() - timestamp;
    if (diff < MS_PER_MINUTE) {
        return 'Just now';
    }
    if (diff < MS_PER_HOUR) {
        const minutes = Math.floor(diff / MS_PER_MINUTE);
        return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    }
    if (diff < MS_PER_DAY) {
        const hours = Math.floor(diff / MS_PER_HOUR);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    return dateTimeFormatter.format(new Date(timestamp));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/notifications/notification-bell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotificationBell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/menu.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/convex-errors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$notifications$2f$format$2d$notification$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/notifications/format-notification-time.ts [app-client] (ecmascript)");
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
const UNREAD_BADGE_CAP = 9;
function NotificationBell() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "41729198fc95ef8887adfff7fb298d6725460c9e143cfee88a5f3489a89ff81a") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "41729198fc95ef8887adfff7fb298d6725460c9e143cfee88a5f3489a89ff81a";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {};
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].notifications.unreadCount.unreadCount, t0);
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {};
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const unread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].notifications.listUnread.listUnread, t1);
    const markRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].notifications.markRead.markRead);
    const markAllRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].notifications.markAllRead.markAllRead);
    const count = unreadCount ?? 0;
    const hasUnread = count > 0;
    const badgeLabel = count > UNREAD_BADGE_CAP ? `${UNREAD_BADGE_CAP}+` : count;
    let t2;
    if ($[3] !== markRead) {
        t2 = ({
            "NotificationBell[onNotificationClick]": async (notification)=>{
                ;
                try {
                    await markRead({
                        notificationId: notification._id
                    });
                } catch (t3) {
                    const error = t3;
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, "Could not update the notification. Please try again in a moment."),
                        title: "Could not mark as read",
                        type: "error"
                    });
                }
                if (notification.link) {
                    window.open(notification.link, "_blank", "noopener");
                }
            }
        })["NotificationBell[onNotificationClick]"];
        $[3] = markRead;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const onNotificationClick = t2;
    let t3;
    if ($[5] !== markAllRead) {
        t3 = ({
            "NotificationBell[onMarkAllRead]": async ()=>{
                ;
                try {
                    await markAllRead({});
                } catch (t4) {
                    const error_0 = t4;
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error_0, "Could not update notifications. Please try again in a moment."),
                        title: "Could not mark all as read",
                        type: "error"
                    });
                }
            }
        })["NotificationBell[onMarkAllRead]"];
        $[5] = markAllRead;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const onMarkAllRead = t3;
    let t4;
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "aria-label": "Notifications",
            className: "relative",
            size: "icon",
            type: "button",
            variant: "ghost"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 100,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 101,
            columnNumber: 10
        }, this);
        $[7] = t4;
        $[8] = t5;
    } else {
        t4 = $[7];
        t5 = $[8];
    }
    let t6;
    if ($[9] !== badgeLabel || $[10] !== hasUnread) {
        t6 = hasUnread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            className: "absolute -top-1 -right-1 px-1",
            size: "sm",
            variant: "destructive",
            children: badgeLabel
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 110,
            columnNumber: 22
        }, this) : null;
        $[9] = badgeLabel;
        $[10] = hasUnread;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuTrigger"], {
            render: t4,
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[12] = t6;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "font-medium text-sm",
            children: "Notifications"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 127,
            columnNumber: 10
        }, this);
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== hasUnread || $[16] !== onMarkAllRead) {
        t9 = hasUnread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            onClick: onMarkAllRead,
            size: "sm",
            type: "button",
            variant: "ghost",
            children: "Mark all as read"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 134,
            columnNumber: 22
        }, this) : null;
        $[15] = hasUnread;
        $[16] = onMarkAllRead;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between gap-2 px-2 py-1.5",
            children: [
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 143,
            columnNumber: 11
        }, this);
        $[18] = t9;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    let t11;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "my-1 h-px bg-border"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 151,
            columnNumber: 11
        }, this);
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== unread) {
        t12 = unread === undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-2 py-6 text-center text-muted-foreground text-sm",
            children: "Loading…"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 158,
            columnNumber: 35
        }, this);
        $[21] = unread;
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== unread) {
        t13 = unread !== undefined && unread.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-2 py-6 text-center text-muted-foreground text-sm",
            children: "You're all caught up."
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 166,
            columnNumber: 58
        }, this);
        $[23] = unread;
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    if ($[25] !== onNotificationClick || $[26] !== unread) {
        t14 = unread?.map({
            "NotificationBell[(anonymous)()]": (notification_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "flex w-full flex-col gap-1 rounded-sm px-2 py-2 text-left hover:bg-accent",
                    onClick: {
                        "NotificationBell[(anonymous)() > <button>.onClick]": ()=>onNotificationClick(notification_0)
                    }["NotificationBell[(anonymous)() > <button>.onClick]"],
                    type: "button",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm",
                            children: notification_0.message
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
                            lineNumber: 177,
                            columnNumber: 78
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground text-xs",
                            children: [
                                notification_0.fromName,
                                notification_0.fromEmail ? ` · ${notification_0.fromEmail}` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
                            lineNumber: 177,
                            columnNumber: 135
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground text-xs",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$notifications$2f$format$2d$notification$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNotificationTime"])(notification_0._creationTime)
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
                            lineNumber: 177,
                            columnNumber: 281
                        }, this)
                    ]
                }, notification_0._id, true, {
                    fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
                    lineNumber: 175,
                    columnNumber: 60
                }, this)
        }["NotificationBell[(anonymous)()]"]);
        $[25] = onNotificationClick;
        $[26] = unread;
        $[27] = t14;
    } else {
        t14 = $[27];
    }
    let t15;
    if ($[28] !== t12 || $[29] !== t13 || $[30] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-h-96 overflow-y-auto",
            children: [
                t12,
                t13,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 187,
            columnNumber: 11
        }, this);
        $[28] = t12;
        $[29] = t13;
        $[30] = t14;
        $[31] = t15;
    } else {
        t15 = $[31];
    }
    let t16;
    let t17;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "my-1 h-px bg-border"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 198,
            columnNumber: 11
        }, this);
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "flex justify-center rounded-sm px-2 py-2 text-primary text-sm hover:bg-accent",
            href: "/notifications",
            children: "View All Notifications"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 199,
            columnNumber: 11
        }, this);
        $[32] = t16;
        $[33] = t17;
    } else {
        t16 = $[32];
        t17 = $[33];
    }
    let t18;
    if ($[34] !== t10 || $[35] !== t15) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuPopup"], {
            align: "end",
            className: "w-96 max-w-[calc(100vw-2rem)]",
            children: [
                t10,
                t11,
                t15,
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 208,
            columnNumber: 11
        }, this);
        $[34] = t10;
        $[35] = t15;
        $[36] = t18;
    } else {
        t18 = $[36];
    }
    let t19;
    if ($[37] !== t18 || $[38] !== t7) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Menu"], {
            children: [
                t7,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/notifications/notification-bell.tsx",
            lineNumber: 217,
            columnNumber: 11
        }, this);
        $[37] = t18;
        $[38] = t7;
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    return t19;
}
_s(NotificationBell, "Di3eU5z7egScYiL3X40PvQSq8EU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = NotificationBell;
var _c;
__turbopack_context__.k.register(_c, "NotificationBell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/layouts/centered-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CenteredLayout",
    ()=>CenteredLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
;
;
const CenteredLayout = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "d41eea57b306c047b5cee51219c44a5873c2beea2f430472b21208e1267931b1") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d41eea57b306c047b5cee51219c44a5873c2beea2f430472b21208e1267931b1";
    }
    const { children } = t0;
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center bg-[#1F1F23]",
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/app/layouts/centered-layout.tsx",
            lineNumber: 15,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
};
_c = CenteredLayout;
var _c;
__turbopack_context__.k.register(_c, "CenteredLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/guards/auth-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/client-boundary/uiComponents.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/auth_helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$layouts$2f$centered$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/layouts/centered-layout.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
const AuthGuard = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "fe43765c97d67f548aa1d7ca4cf97749b53c5af6d9aa4cfd5b2058f097abc84b") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fe43765c97d67f548aa1d7ca4cf97749b53c5af6d9aa4cfd5b2058f097abc84b";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthLoading"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$layouts$2f$centered$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CenteredLayout"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-6 w-6 animate-spin text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/apps/app/guards/auth-guard.tsx",
                    lineNumber: 21,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/app/guards/auth-guard.tsx",
                lineNumber: 21,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/app/guards/auth-guard.tsx",
            lineNumber: 21,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Authenticated"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/app/guards/auth-guard.tsx",
            lineNumber: 28,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Unauthenticated"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$layouts$2f$centered$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CenteredLayout"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignIn"], {
                    appearance: {
                        elements: {
                            logoBox: "!h-16",
                            logoImage: "!h-16 !w-auto"
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/app/guards/auth-guard.tsx",
                    lineNumber: 36,
                    columnNumber: 43
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/app/guards/auth-guard.tsx",
                lineNumber: 36,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/app/guards/auth-guard.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t1,
                t2,
                t3
            ]
        }, void 0, true);
        $[5] = t2;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    return t4;
};
_c = AuthGuard;
const __TURBOPACK__default__export__ = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_97f6c441._.js.map