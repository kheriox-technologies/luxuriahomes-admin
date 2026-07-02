(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/apps/app/components/page-heading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
const PageHeading = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(35);
    if ($[0] !== "aa3c6dc94d8157face51cdb3bce7ce734e3310d3f73e80a4b66e7f8c3e57cf07") {
        for(let $i = 0; $i < 35; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "aa3c6dc94d8157face51cdb3bce7ce734e3310d3f73e80a4b66e7f8c3e57cf07";
    }
    const { heading, headingActions, icon: Icon, description, backLink, className, metaSlot, rightSlot, titleTrailing } = t0;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("space-y-4", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== Icon) {
        t2 = Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 50,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = Icon;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== backLink) {
        t3 = backLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "aria-label": "Go back",
            className: "-ml-2 shrink-0",
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: backLink
            }, void 0, false, {
                fileName: "[project]/apps/app/components/page-heading.tsx",
                lineNumber: 58,
                columnNumber: 86
            }, void 0),
            size: "icon",
            type: "button",
            variant: "ghost",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__["ChevronLeftIcon"], {}, void 0, false, {
                fileName: "[project]/apps/app/components/page-heading.tsx",
                lineNumber: 58,
                columnNumber: 183
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 58,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = backLink;
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
                    fileName: "[project]/apps/app/components/page-heading.tsx",
                    lineNumber: 66,
                    columnNumber: 98
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex shrink-0 items-center",
                    children: titleTrailing
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/page-heading.tsx",
                    lineNumber: 66,
                    columnNumber: 184
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 66,
            columnNumber: 26
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "min-w-0 flex-1 font-semibold sm:truncate sm:tracking-tight",
            children: heading
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 66,
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
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 75,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0)) : null;
        $[10] = headingActions;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] !== t3 || $[13] !== t4 || $[14] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 items-center gap-2",
            children: [
                t3,
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = t3;
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== metaSlot) {
        t7 = metaSlot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-wrap items-center gap-2",
            children: metaSlot
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 93,
            columnNumber: 21
        }, ("TURBOPACK compile-time value", void 0)) : null;
        $[16] = metaSlot;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    let t8;
    if ($[18] !== description) {
        t8 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-500 text-sm",
            children: description
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 101,
            columnNumber: 25
        }, ("TURBOPACK compile-time value", void 0));
        $[18] = description;
        $[19] = t8;
    } else {
        t8 = $[19];
    }
    let t9;
    if ($[20] !== t6 || $[21] !== t7 || $[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 flex-col gap-1",
            children: [
                t6,
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 109,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = t6;
        $[21] = t7;
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== t2 || $[25] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 items-center gap-2",
            children: [
                t2,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 119,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[24] = t2;
        $[25] = t9;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== rightSlot) {
        t11 = rightSlot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end",
            children: rightSlot
        }, void 0, false, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 128,
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
            className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2",
            children: [
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 136,
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
            fileName: "[project]/apps/app/components/page-heading.tsx",
            lineNumber: 145,
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
"[project]/packages/ui/src/components/field.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Field",
    ()=>Field,
    "FieldControl",
    ()=>FieldControl,
    "FieldDescription",
    ()=>FieldDescription,
    "FieldError",
    ()=>FieldError,
    "FieldItem",
    ()=>FieldItem,
    "FieldLabel",
    ()=>FieldLabel,
    "FieldValidity",
    ()=>FieldValidity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/field/index.parts.js [app-client] (ecmascript) <export * as Field>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Field(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-start gap-2", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Root, {
            className: t1,
            "data-slot": "field",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/field.tsx",
            lineNumber: 38,
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
_c = Field;
function FieldLabel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Label, {
            className: t1,
            "data-slot": "field-label",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/field.tsx",
            lineNumber: 79,
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
_c1 = FieldLabel;
function FieldItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Item, {
            className: t1,
            "data-slot": "field-item",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/field.tsx",
            lineNumber: 120,
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
_c2 = FieldItem;
function FieldDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-xs", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Description, {
            className: t1,
            "data-slot": "field-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/field.tsx",
            lineNumber: 161,
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
_c3 = FieldDescription;
function FieldError(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1fd73d78d28f2ee794fc6bcd19b79897e68fa4868d6b7d63c14693974189f2aa";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-destructive-foreground text-xs", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Error, {
            className: t1,
            "data-slot": "field-error",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/field.tsx",
            lineNumber: 202,
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
_c4 = FieldError;
const FieldControl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Control;
const FieldValidity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$field$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Field$3e$__["Field"].Validity;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Field");
__turbopack_context__.k.register(_c1, "FieldLabel");
__turbopack_context__.k.register(_c2, "FieldItem");
__turbopack_context__.k.register(_c3, "FieldDescription");
__turbopack_context__.k.register(_c4, "FieldError");
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
"[project]/packages/ui/src/components/checkbox.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$checkbox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/checkbox/index.parts.js [app-client] (ecmascript) <export * as Checkbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Checkbox(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "bdae23f04b55d77ac58bb4568c779da4762bb03af6c66d39a9857735d1598c1f") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bdae23f04b55d77ac58bb4568c779da4762bb03af6c66d39a9857735d1598c1f";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[3px] not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$checkbox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__["Checkbox"].Indicator, {
            className: "-inset-px absolute flex items-center justify-center rounded-[.25rem] text-primary-foreground data-unchecked:hidden data-checked:bg-primary data-indeterminate:text-foreground",
            "data-slot": "checkbox-indicator",
            render: _CheckboxCheckboxPrimitiveIndicatorRender
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/checkbox.tsx",
            lineNumber: 38,
            columnNumber: 10
        }, this);
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t1) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$checkbox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__["Checkbox"].Root, {
            className: t1,
            "data-slot": "checkbox",
            ...props,
            children: t2
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/checkbox.tsx",
            lineNumber: 45,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = t1;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    return t3;
}
_c = Checkbox;
function _CheckboxCheckboxPrimitiveIndicatorRender(props_0, state) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ...props_0,
        children: state.indeterminate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "size-3.5 sm:size-3",
            fill: "none",
            height: "24",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "3",
            viewBox: "0 0 24 24",
            width: "24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.252 12h13.496"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/checkbox.tsx",
                lineNumber: 55,
                columnNumber: 261
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/checkbox.tsx",
            lineNumber: 55,
            columnNumber: 52
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "size-3.5 sm:size-3",
            fill: "none",
            height: "24",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "3",
            viewBox: "0 0 24 24",
            width: "24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.252 12.7 10.2 18.63 18.748 5.37"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/checkbox.tsx",
                lineNumber: 55,
                columnNumber: 508
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/checkbox.tsx",
            lineNumber: 55,
            columnNumber: 299
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/checkbox.tsx",
        lineNumber: 55,
        columnNumber: 10
    }, this);
}
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ButtonGroup",
    ()=>Group,
    "ButtonGroupSeparator",
    ()=>GroupSeparator,
    "ButtonGroupText",
    ()=>GroupText,
    "Group",
    ()=>Group,
    "GroupSeparator",
    ()=>GroupSeparator,
    "GroupText",
    ()=>GroupText,
    "groupVariants",
    ()=>groupVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/merge-props/mergeProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/use-render/useRender.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/separator.tsx [app-client] (ecmascript) <locals>");
"use client";
;
;
;
;
;
;
;
const groupVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex w-fit *:focus-visible:z-1 has-[>[data-slot=group]]:gap-2 *:has-focus-visible:z-1 dark:*:[[data-slot=separator]:has(~button:hover):not(:has(~[data-slot=separator]~[data-slot]:hover)),[data-slot=separator]:has(~[data-slot][data-pressed]):not(:has(~[data-slot=separator]~[data-slot][data-pressed]))]:before:bg-input/64 dark:*:[button:hover~[data-slot=separator]:not([data-slot]:hover~[data-slot=separator]~[data-slot=separator]),[data-slot][data-pressed]~[data-slot=separator]:not([data-slot][data-pressed]~[data-slot=separator]~[data-slot=separator])]:before:bg-input/64", {
    defaultVariants: {
        orientation: "horizontal"
    },
    variants: {
        orientation: {
            horizontal: "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-start-[0.5px] *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-end-[0.5px] *:pointer-coarse:after:min-w-auto *:data-slot:has-[~[data-slot]]:rounded-e-none *:data-slot:has-[~[data-slot]]:border-e-0 *:data-slot:has-[~[data-slot]]:before:rounded-e-none *:[[data-slot]~[data-slot]]:rounded-s-none *:[[data-slot]~[data-slot]]:border-s-0 *:[[data-slot]~[data-slot]]:before:rounded-s-none",
            vertical: "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-top-[0.5px] *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-bottom-[0.5px] flex-col *:pointer-coarse:after:min-h-auto *:data-slot:has-[~[data-slot]]:rounded-b-none *:data-slot:has-[~[data-slot]]:border-b-0 *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:hidden *:data-slot:has-[~[data-slot]]:before:rounded-b-none dark:*:last:before:hidden dark:*:first:before:block *:[[data-slot]~[data-slot]]:rounded-t-none *:[[data-slot]~[data-slot]]:border-t-0 *:[[data-slot]~[data-slot]]:before:rounded-t-none"
        }
    }
});
function Group(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0";
    }
    let children;
    let className;
    let orientation;
    let props;
    if ($[1] !== t0) {
        ({ className, orientation, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = orientation;
        $[5] = props;
    } else {
        children = $[2];
        className = $[3];
        orientation = $[4];
        props = $[5];
    }
    let t1;
    if ($[6] !== className || $[7] !== orientation) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(groupVariants({
            orientation
        }), className);
        $[6] = className;
        $[7] = orientation;
        $[8] = t1;
    } else {
        t1 = $[8];
    }
    let t2;
    if ($[9] !== children || $[10] !== orientation || $[11] !== props || $[12] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "data-orientation": orientation,
            "data-slot": "group",
            role: "group",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/group.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[9] = children;
        $[10] = orientation;
        $[11] = props;
        $[12] = t1;
        $[13] = t2;
    } else {
        t2 = $[13];
    }
    return t2;
}
_c = Group;
function GroupText(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, render: t4, ...props } = t0;
        render = t4;
        const defaultProps = {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex items-center whitespace-nowrap gap-2 rounded-lg border border-input bg-muted not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-muted-foreground text-base sm:text-sm shadow-xs/5 outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/64 dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&_svg]:-mx-0.5", className),
            "data-slot": "group-text"
        };
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "div";
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
_c1 = GroupText;
function GroupSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5554ff2704ba71b4f82cd529c99ddb905253cd92ac49699977db31d4af0e2fa0";
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
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px pointer-events-none relative z-2 bg-input before:absolute before:inset-0 has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:bg-ring dark:before:bg-input/32 [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+&,[data-slot=number-field]:focus-within+input+&]:bg-ring", className);
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
            fileName: "[project]/packages/ui/src/components/group.tsx",
            lineNumber: 165,
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
_c2 = GroupSeparator;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Group");
__turbopack_context__.k.register(_c1, "GroupText");
__turbopack_context__.k.register(_c2, "GroupSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/calendar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Calendar",
    ()=>Calendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$day$2d$picker$2f$dist$2f$esm$2f$DayPicker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-day-picker/dist/esm/DayPicker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonClassNames = "relative flex size-(--cell-size) text-base sm:text-sm items-center justify-center rounded-lg text-foreground not-in-data-selected:hover:bg-accent disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";
function Calendar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "32e52e17886c8d030d832930cbcbd9746737be8bebfc64142fa543adb7aed6fe") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "32e52e17886c8d030d832930cbcbd9746737be8bebfc64142fa543adb7aed6fe";
    }
    let className;
    let classNames;
    let props;
    let t1;
    let t2;
    let userComponents;
    if ($[1] !== t0) {
        ({ className, classNames, showOutsideDays: t1, components: userComponents, mode: t2, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = classNames;
        $[4] = props;
        $[5] = t1;
        $[6] = t2;
        $[7] = userComponents;
    } else {
        className = $[2];
        classNames = $[3];
        props = $[4];
        t1 = $[5];
        t2 = $[6];
        userComponents = $[7];
    }
    const showOutsideDays = t1 === undefined ? true : t1;
    const mode = t2 === undefined ? "single" : t2;
    let t3;
    if ($[8] !== classNames) {
        const defaultClassNames = {
            button_next: buttonClassNames,
            button_previous: buttonClassNames,
            caption_label: "text-base sm:text-sm font-medium flex items-center gap-2 h-full",
            day: "size-(--cell-size) text-sm py-px",
            day_button: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonClassNames, "in-[[data-selected]:not(.range-middle)]:transition-[color,background-color,border-radius,box-shadow] in-data-disabled:pointer-events-none focus-visible:z-1 in-data-selected:bg-primary in-data-selected:text-primary-foreground in-data-disabled:text-muted-foreground/70 in-data-disabled:line-through in-data-outside:text-muted-foreground/70 in-data-selected:in-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-middle]:rounded-none in-[.range-middle]:in-data-selected:bg-accent in-[.range-middle]:in-data-selected:text-foreground"),
            dropdown: "absolute bg-popover inset-0 opacity-0",
            dropdown_root: "relative has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px] border border-input shadow-xs/5 rounded-lg px-[calc(--spacing(3)-1px)] h-9 sm:h-8 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-me-1",
            dropdowns: "w-full flex items-center text-base sm:text-sm justify-center h-(--cell-size) gap-1.5 *:[span]:font-medium",
            hidden: "invisible",
            month: "w-full",
            month_caption: "relative mx-(--cell-size) px-1 mb-1 flex h-(--cell-size) items-center justify-center z-2",
            months: "relative flex flex-col sm:flex-row gap-2",
            nav: "absolute top-0 flex w-full justify-between z-1",
            outside: "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
            range_end: "range-end",
            range_middle: "range-middle",
            range_start: "range-start",
            today: "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
            week_number: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/70",
            weekday: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/70"
        };
        t3 = Object.keys(defaultClassNames).reduce({
            "Calendar[(anonymous)()]": (acc, key)=>{
                const userClass = classNames?.[key];
                const baseClass = defaultClassNames[key];
                acc[key] = userClass ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseClass, userClass) : baseClass;
                return acc;
            }
        }["Calendar[(anonymous)()]"], {
            ...defaultClassNames
        });
        $[8] = classNames;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    const mergedClassNames = t3;
    let t4;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            Chevron: _temp
        };
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const defaultComponents = t4;
    let t5;
    if ($[11] !== userComponents) {
        t5 = {
            ...defaultComponents,
            ...userComponents
        };
        $[11] = userComponents;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    const mergedComponents = t5;
    let t6;
    if ($[13] !== className) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-fit [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(9)]", className);
        $[13] = className;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            formatMonthDropdown: _temp2
        };
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== mergedClassNames || $[17] !== mergedComponents || $[18] !== mode || $[19] !== props || $[20] !== showOutsideDays || $[21] !== t6) {
        t8 = {
            className: t6,
            classNames: mergedClassNames,
            components: mergedComponents,
            "data-slot": "calendar",
            formatters: t7,
            mode,
            showOutsideDays,
            ...props
        };
        $[16] = mergedClassNames;
        $[17] = mergedComponents;
        $[18] = mode;
        $[19] = props;
        $[20] = showOutsideDays;
        $[21] = t6;
        $[22] = t8;
    } else {
        t8 = $[22];
    }
    const dayPickerProps = t8;
    const t9 = dayPickerProps;
    let t10;
    if ($[23] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$day$2d$picker$2f$dist$2f$esm$2f$DayPicker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DayPicker"], {
            ...t9
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/calendar.tsx",
            lineNumber: 154,
            columnNumber: 11
        }, this);
        $[23] = t9;
        $[24] = t10;
    } else {
        t10 = $[24];
    }
    return t10;
}
_c = Calendar;
function _temp2(date) {
    return date.toLocaleString("default", {
        month: "short"
    });
}
function _temp(t0) {
    const { className: className_0, orientation, ...props_0 } = t0;
    if (orientation === "left") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__["ChevronLeftIcon"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(className_0, "rtl:rotate-180"),
            ...props_0,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/calendar.tsx",
            lineNumber: 174,
            columnNumber: 12
        }, this);
    }
    if (orientation === "right") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(className_0, "rtl:rotate-180"),
            ...props_0,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/calendar.tsx",
            lineNumber: 177,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__["ChevronsUpDownIcon"], {
        className: className_0,
        ...props_0,
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/packages/ui/src/components/calendar.tsx",
        lineNumber: 179,
        columnNumber: 10
    }, this);
}
;
var _c;
__turbopack_context__.k.register(_c, "Calendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/combobox.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Combobox",
    ()=>Combobox,
    "ComboboxChip",
    ()=>ComboboxChip,
    "ComboboxChips",
    ()=>ComboboxChips,
    "ComboboxChipsInput",
    ()=>ComboboxChipsInput,
    "ComboboxClear",
    ()=>ComboboxClear,
    "ComboboxCollection",
    ()=>ComboboxCollection,
    "ComboboxEmpty",
    ()=>ComboboxEmpty,
    "ComboboxGroup",
    ()=>ComboboxGroup,
    "ComboboxGroupLabel",
    ()=>ComboboxGroupLabel,
    "ComboboxInput",
    ()=>ComboboxInput,
    "ComboboxItem",
    ()=>ComboboxItem,
    "ComboboxList",
    ()=>ComboboxList,
    "ComboboxPopup",
    ()=>ComboboxPopup,
    "ComboboxRow",
    ()=>ComboboxRow,
    "ComboboxSeparator",
    ()=>ComboboxSeparator,
    "ComboboxStatus",
    ()=>ComboboxStatus,
    "ComboboxTrigger",
    ()=>ComboboxTrigger,
    "ComboboxValue",
    ()=>ComboboxValue,
    "useComboboxFilter",
    ()=>useComboboxFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/combobox/index.parts.js [app-client] (ecmascript) <export * as Combobox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/scroll-area.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const ComboboxContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]({
    chipsRef: null,
    multiple: false
});
function Combobox(props) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    const chipsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const t0 = !!props.multiple;
    let t1;
    if ($[1] !== t0) {
        t1 = {
            chipsRef,
            multiple: t0
        };
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== props) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Root, {
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[3] = props;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t1 || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComboboxContext.Provider, {
            value: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, this);
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return t3;
}
_s(Combobox, "KMtpefWzKkx4guuYkveBEIu09H0=");
_c = Combobox;
function ComboboxChipsInput(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let className;
    let props;
    let size;
    if ($[1] !== t0) {
        ({ className, size, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = size;
    } else {
        className = $[2];
        props = $[3];
        size = $[4];
    }
    const sizeValue = size ?? "default";
    const t1 = sizeValue === "sm" ? "ps-1.5" : "ps-2";
    let t2;
    if ($[5] !== className || $[6] !== t1) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-12 flex-1 text-base outline-none sm:text-sm [[data-slot=combobox-chip]+&]:ps-0.5", t1, className);
        $[5] = className;
        $[6] = t1;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    const t3 = typeof sizeValue === "string" ? sizeValue : undefined;
    const t4 = typeof sizeValue === "number" ? sizeValue : undefined;
    let t5;
    if ($[8] !== props || $[9] !== t2 || $[10] !== t3 || $[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Input, {
            className: t2,
            "data-size": t3,
            "data-slot": "combobox-chips-input",
            size: t4,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 98,
            columnNumber: 10
        }, this);
        $[8] = props;
        $[9] = t2;
        $[10] = t3;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    return t5;
}
_c1 = ComboboxChipsInput;
function ComboboxInput(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(35);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 35; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let className;
    let clearProps;
    let props;
    let size;
    let startAddon;
    let t1;
    let t2;
    let triggerProps;
    if ($[1] !== t0) {
        ({ className, showTrigger: t1, showClear: t2, startAddon, size, triggerProps, clearProps, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = clearProps;
        $[4] = props;
        $[5] = size;
        $[6] = startAddon;
        $[7] = t1;
        $[8] = t2;
        $[9] = triggerProps;
    } else {
        className = $[2];
        clearProps = $[3];
        props = $[4];
        size = $[5];
        startAddon = $[6];
        t1 = $[7];
        t2 = $[8];
        triggerProps = $[9];
    }
    const showTrigger = t1 === undefined ? true : t1;
    const showClear = t2 === undefined ? false : t2;
    const sizeValue = size ?? "default";
    let t3;
    if ($[10] !== startAddon) {
        t3 = startAddon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "aria-hidden": "true",
            className: "[&_svg]:-mx-0.5 pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
            "data-slot": "combobox-start-addon",
            children: startAddon
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 160,
            columnNumber: 24
        }, this);
        $[10] = startAddon;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    const t4 = startAddon && "data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=combobox-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=combobox-input]:ps-[calc(--spacing(8)-1px)]";
    const t5 = sizeValue === "sm" ? "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-6.5" : "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-7";
    let t6;
    if ($[12] !== className || $[13] !== t4 || $[14] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(t4, t5, className);
        $[12] = className;
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== sizeValue) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
            className: "has-disabled:opacity-100",
            nativeInput: true,
            size: sizeValue
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 180,
            columnNumber: 10
        }, this);
        $[16] = sizeValue;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    let t8;
    if ($[18] !== props || $[19] !== t6 || $[20] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Input, {
            className: t6,
            "data-slot": "combobox-input",
            render: t7,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 188,
            columnNumber: 10
        }, this);
        $[18] = props;
        $[19] = t6;
        $[20] = t7;
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    let t9;
    if ($[22] !== showTrigger || $[23] !== sizeValue || $[24] !== triggerProps) {
        t9 = showTrigger && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComboboxTrigger, {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", sizeValue === "sm" ? "end-0" : "end-0.5"),
            ...triggerProps,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Icon, {
                "data-slot": "combobox-icon",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__["ChevronsUpDownIcon"], {}, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/combobox.tsx",
                    lineNumber: 198,
                    columnNumber: 638
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/combobox.tsx",
                lineNumber: 198,
                columnNumber: 588
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 198,
            columnNumber: 25
        }, this);
        $[22] = showTrigger;
        $[23] = sizeValue;
        $[24] = triggerProps;
        $[25] = t9;
    } else {
        t9 = $[25];
    }
    let t10;
    if ($[26] !== clearProps || $[27] !== showClear || $[28] !== sizeValue) {
        t10 = showClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComboboxClear, {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", sizeValue === "sm" ? "end-0" : "end-0.5"),
            ...clearProps,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                fileName: "[project]/packages/ui/src/components/combobox.tsx",
                lineNumber: 208,
                columnNumber: 583
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 208,
            columnNumber: 24
        }, this);
        $[26] = clearProps;
        $[27] = showClear;
        $[28] = sizeValue;
        $[29] = t10;
    } else {
        t10 = $[29];
    }
    let t11;
    if ($[30] !== t10 || $[31] !== t3 || $[32] !== t8 || $[33] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64",
            children: [
                t3,
                t8,
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 218,
            columnNumber: 11
        }, this);
        $[30] = t10;
        $[31] = t3;
        $[32] = t8;
        $[33] = t9;
        $[34] = t11;
    } else {
        t11 = $[34];
    }
    return t11;
}
_c2 = ComboboxInput;
function ComboboxTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Trigger, {
            className: className,
            "data-slot": "combobox-trigger",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 257,
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
_c3 = ComboboxTrigger;
function ComboboxPopup(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let alignOffset;
    let anchorProp;
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, children, side: t1, sideOffset: t2, alignOffset, align: t3, anchor: anchorProp, ...props } = t0);
        $[1] = t0;
        $[2] = alignOffset;
        $[3] = anchorProp;
        $[4] = children;
        $[5] = className;
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
    } else {
        alignOffset = $[2];
        anchorProp = $[3];
        children = $[4];
        className = $[5];
        props = $[6];
        t1 = $[7];
        t2 = $[8];
        t3 = $[9];
    }
    const side = t1 === undefined ? "bottom" : t1;
    const sideOffset = t2 === undefined ? 4 : t2;
    const align = t3 === undefined ? "start" : t3;
    const { chipsRef } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxContext);
    const anchor = anchorProp ?? chipsRef;
    let t4;
    if ($[10] !== className) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className);
        $[10] = className;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== children || $[13] !== props) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Popup, {
            className: "flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground",
            "data-slot": "combobox-popup",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 330,
            columnNumber: 10
        }, this);
        $[12] = children;
        $[13] = props;
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    let t6;
    if ($[15] !== t4 || $[16] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t4,
            children: t5
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 339,
            columnNumber: 10
        }, this);
        $[15] = t4;
        $[16] = t5;
        $[17] = t6;
    } else {
        t6 = $[17];
    }
    let t7;
    if ($[18] !== align || $[19] !== alignOffset || $[20] !== anchor || $[21] !== side || $[22] !== sideOffset || $[23] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Positioner, {
                align: align,
                alignOffset: alignOffset,
                anchor: anchor,
                className: "z-50 select-none",
                "data-slot": "combobox-positioner",
                side: side,
                sideOffset: sideOffset,
                children: t6
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/combobox.tsx",
                lineNumber: 348,
                columnNumber: 36
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 348,
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
_s1(ComboboxPopup, "tHfkWoD8m6EWTA8H2Ep0Spn1Gg0=");
_c4 = ComboboxPopup;
function ComboboxItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className);
        $[5] = className;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].ItemIndicator, {
            className: "col-start-1",
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
                    fileName: "[project]/packages/ui/src/components/combobox.tsx",
                    lineNumber: 397,
                    columnNumber: 245
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/combobox.tsx",
                lineNumber: 397,
                columnNumber: 67
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 397,
            columnNumber: 10
        }, this);
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== children) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col-start-2",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 404,
            columnNumber: 10
        }, this);
        $[8] = children;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== props || $[11] !== t1 || $[12] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Item, {
            className: t1,
            "data-slot": "combobox-item",
            ...props,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 412,
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
_c5 = ComboboxItem;
function ComboboxSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mx-2 my-1 h-px bg-border last:hidden", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Separator, {
            className: t1,
            "data-slot": "combobox-separator",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 454,
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
_c6 = ComboboxSeparator;
function ComboboxGroup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[[role=group]+&]:mt-1.5", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Group, {
            className: t1,
            "data-slot": "combobox-group",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 495,
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
_c7 = ComboboxGroup;
function ComboboxGroupLabel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 font-medium text-muted-foreground text-xs", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].GroupLabel, {
            className: t1,
            "data-slot": "combobox-group-label",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 536,
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
_c8 = ComboboxGroupLabel;
function ComboboxEmpty(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Empty, {
            className: t1,
            "data-slot": "combobox-empty",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 577,
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
_c9 = ComboboxEmpty;
function ComboboxRow(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Row, {
            className: className,
            "data-slot": "combobox-row",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 610,
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
_c10 = ComboboxRow;
function ComboboxValue(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Value, {
            "data-slot": "combobox-value",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 639,
            columnNumber: 10
        }, this);
        $[3] = props;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    return t1;
}
_c11 = ComboboxValue;
function ComboboxList(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ScrollArea"], {
            scrollbarGutter: true,
            scrollFade: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].List, {
                className: t1,
                "data-slot": "combobox-list",
                ...props
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/combobox.tsx",
                lineNumber: 679,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 679,
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
_c12 = ComboboxList;
function ComboboxClear(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Clear, {
            className: className,
            "data-slot": "combobox-clear",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 712,
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
_c13 = ComboboxClear;
function ComboboxStatus(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Status, {
            className: t1,
            "data-slot": "combobox-status",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 753,
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
_c14 = ComboboxStatus;
function ComboboxCollection(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Collection, {
            "data-slot": "combobox-collection",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 772,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c15 = ComboboxCollection;
function ComboboxChips(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let children;
    let className;
    let props;
    let startAddon;
    if ($[1] !== t0) {
        ({ className, children, startAddon, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = startAddon;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        startAddon = $[5];
    }
    const { chipsRef } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxContext);
    let t1;
    if ($[6] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex min-h-9 w-full flex-wrap gap-1 rounded-lg border border-input bg-background not-dark:bg-clip-padding p-[calc(--spacing(1)-1px)] text-base shadow-xs/5 outline-none ring-ring/24 transition-shadow *:min-h-7 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:border-ring focus-within:ring-[3px] has-disabled:pointer-events-none has-data-[size=lg]:min-h-10 has-data-[size=sm]:min-h-8 has-aria-invalid:border-destructive/36 has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none focus-within:has-aria-invalid:border-destructive/64 focus-within:has-aria-invalid:ring-destructive/16 has-data-[size=lg]:*:min-h-8 has-data-[size=sm]:*:min-h-6 sm:min-h-8 sm:text-sm sm:has-data-[size=lg]:min-h-9 sm:has-data-[size=sm]:min-h-7 sm:*:min-h-6 sm:has-data-[size=lg]:*:min-h-7 sm:has-data-[size=sm]:*:min-h-5 dark:not-has-disabled:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]", className);
        $[6] = className;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    const t2 = chipsRef;
    let t3;
    if ($[8] !== startAddon) {
        t3 = startAddon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "aria-hidden": "true",
            className: "[&_svg]:-ms-0.5 [&_svg]:-me-1.5 flex shrink-0 items-center ps-2 opacity-80 has-[~[data-size=sm]]:has-[+[data-slot=combobox-chip]]:pe-1.5 has-[~[data-size=sm]]:ps-1.5 has-[+[data-slot=combobox-chip]]:pe-2 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
            "data-slot": "combobox-start-addon",
            children: startAddon
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 824,
            columnNumber: 24
        }, this);
        $[8] = startAddon;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== children || $[11] !== props || $[12] !== t1 || $[13] !== t2 || $[14] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Chips, {
            className: t1,
            "data-slot": "combobox-chips",
            ref: t2,
            ...props,
            children: [
                t3,
                children
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 832,
            columnNumber: 10
        }, this);
        $[10] = children;
        $[11] = props;
        $[12] = t1;
        $[13] = t2;
        $[14] = t3;
        $[15] = t4;
    } else {
        t4 = $[15];
    }
    return t4;
}
_s2(ComboboxChips, "tHfkWoD8m6EWTA8H2Ep0Spn1Gg0=");
_c16 = ComboboxChips;
function ComboboxChip(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let children;
    let props;
    let removeProps;
    if ($[1] !== t0) {
        ({ children, removeProps, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = props;
        $[4] = removeProps;
    } else {
        children = $[2];
        props = $[3];
        removeProps = $[4];
    }
    let t1;
    if ($[5] !== removeProps) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComboboxChipRemove, {
            ...removeProps
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 872,
            columnNumber: 10
        }, this);
        $[5] = removeProps;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] !== children || $[8] !== props || $[9] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].Chip, {
            className: "flex items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none sm:text-xs/(--text-xs--line-height) [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
            "data-slot": "combobox-chip",
            ...props,
            children: [
                children,
                t1
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 880,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = props;
        $[9] = t1;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    return t2;
}
_c17 = ComboboxChip;
function ComboboxChipRemove(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adba960047ce0ce6692bfc65c79142babd012708b7e4bd9e9482d2c9900c5edd";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 900,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].ChipRemove, {
            "aria-label": "Remove",
            className: "h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
            "data-slot": "combobox-chip-remove",
            ...props,
            children: t0
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/combobox.tsx",
            lineNumber: 907,
            columnNumber: 10
        }, this);
        $[2] = props;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    return t1;
}
_c18 = ComboboxChipRemove;
const useComboboxFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$combobox$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Combobox$3e$__["Combobox"].useFilter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18;
__turbopack_context__.k.register(_c, "Combobox");
__turbopack_context__.k.register(_c1, "ComboboxChipsInput");
__turbopack_context__.k.register(_c2, "ComboboxInput");
__turbopack_context__.k.register(_c3, "ComboboxTrigger");
__turbopack_context__.k.register(_c4, "ComboboxPopup");
__turbopack_context__.k.register(_c5, "ComboboxItem");
__turbopack_context__.k.register(_c6, "ComboboxSeparator");
__turbopack_context__.k.register(_c7, "ComboboxGroup");
__turbopack_context__.k.register(_c8, "ComboboxGroupLabel");
__turbopack_context__.k.register(_c9, "ComboboxEmpty");
__turbopack_context__.k.register(_c10, "ComboboxRow");
__turbopack_context__.k.register(_c11, "ComboboxValue");
__turbopack_context__.k.register(_c12, "ComboboxList");
__turbopack_context__.k.register(_c13, "ComboboxClear");
__turbopack_context__.k.register(_c14, "ComboboxStatus");
__turbopack_context__.k.register(_c15, "ComboboxCollection");
__turbopack_context__.k.register(_c16, "ComboboxChips");
__turbopack_context__.k.register(_c17, "ComboboxChip");
__turbopack_context__.k.register(_c18, "ComboboxChipRemove");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/popover.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverClose",
    ()=>PopoverClose,
    "PopoverContent",
    ()=>PopoverPopup,
    "PopoverCreateHandle",
    ()=>PopoverCreateHandle,
    "PopoverDescription",
    ()=>PopoverDescription,
    "PopoverPopup",
    ()=>PopoverPopup,
    "PopoverTitle",
    ()=>PopoverTitle,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/popover/index.parts.js [app-client] (ecmascript) <export * as Popover>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const PopoverCreateHandle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].createHandle;
const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Root;
function PopoverTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Trigger, {
            className: className,
            "data-slot": "popover-trigger",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 36,
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
_c = PopoverTrigger;
function PopoverPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(34);
    if ($[0] !== "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4") {
        for(let $i = 0; $i < 34; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4";
    }
    let anchor;
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    if ($[1] !== t0) {
        ({ children, className, side: t1, align: t2, sideOffset: t3, alignOffset: t4, tooltipStyle: t5, anchor, arrow: t6, ...props } = t0);
        $[1] = t0;
        $[2] = anchor;
        $[3] = children;
        $[4] = className;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
    } else {
        anchor = $[2];
        children = $[3];
        className = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
        t3 = $[8];
        t4 = $[9];
        t5 = $[10];
        t6 = $[11];
    }
    const side = t1 === undefined ? "bottom" : t1;
    const align = t2 === undefined ? "center" : t2;
    const sideOffset = t3 === undefined ? 4 : t3;
    const alignOffset = t4 === undefined ? 0 : t4;
    const tooltipStyle = t5 === undefined ? false : t5;
    const arrow = t6 === undefined ? false : t6;
    const t7 = tooltipStyle && "w-fit text-balance rounded-md text-xs shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]";
    let t8;
    if ($[12] !== className || $[13] !== t7) {
        t8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-[slot=calendar]:rounded-xl has-data-[slot=calendar]:before:rounded-[calc(var(--radius-xl)-1px)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", t7, className);
        $[12] = className;
        $[13] = t7;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    const t9 = tooltipStyle ? "py-1 [--viewport-inline-padding:--spacing(2)]" : "not-data-transitioning:overflow-y-auto";
    let t10;
    if ($[15] !== t9) {
        t10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] has-data-[slot=calendar]:p-2 data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity", t9);
        $[15] = t9;
        $[16] = t10;
    } else {
        t10 = $[16];
    }
    let t11;
    if ($[17] !== children || $[18] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Viewport, {
            className: t10,
            "data-slot": "popover-viewport",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 127,
            columnNumber: 11
        }, this);
        $[17] = children;
        $[18] = t10;
        $[19] = t11;
    } else {
        t11 = $[19];
    }
    let t12;
    if ($[20] !== arrow) {
        t12 = arrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Arrow, {
            className: "group absolute data-[side=top]:-bottom-1.5 data-[side=bottom]:-top-1.5 data-[side=left]:-right-1.5 data-[side=right]:-left-1.5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "group-data-[side=bottom]:rotate-180 group-data-[side=left]:rotate-90 group-data-[side=right]:-rotate-90",
                fill: "none",
                height: "6",
                viewBox: "0 0 12 6",
                width: "12",
                xmlns: "http://www.w3.org/2000/svg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    className: "fill-popover stroke-border",
                    d: "M0 0L6 6L12 0",
                    strokeLinejoin: "round",
                    strokeWidth: "1"
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/popover.tsx",
                    lineNumber: 136,
                    columnNumber: 392
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/popover.tsx",
                lineNumber: 136,
                columnNumber: 183
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 136,
            columnNumber: 20
        }, this);
        $[20] = arrow;
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[22] !== props || $[23] !== t11 || $[24] !== t12 || $[25] !== t8) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Popup, {
            className: t8,
            "data-slot": "popover-popup",
            ...props,
            children: [
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 144,
            columnNumber: 11
        }, this);
        $[22] = props;
        $[23] = t11;
        $[24] = t12;
        $[25] = t8;
        $[26] = t13;
    } else {
        t13 = $[26];
    }
    let t14;
    if ($[27] !== align || $[28] !== alignOffset || $[29] !== anchor || $[30] !== side || $[31] !== sideOffset || $[32] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Positioner, {
                align: align,
                alignOffset: alignOffset,
                anchor: anchor,
                className: "z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none",
                "data-slot": "popover-positioner",
                side: side,
                sideOffset: sideOffset,
                children: t13
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/popover.tsx",
                lineNumber: 155,
                columnNumber: 36
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[27] = align;
        $[28] = alignOffset;
        $[29] = anchor;
        $[30] = side;
        $[31] = sideOffset;
        $[32] = t13;
        $[33] = t14;
    } else {
        t14 = $[33];
    }
    return t14;
}
_c1 = PopoverPopup;
function PopoverClose(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4";
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
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Close, {
            "data-slot": "popover-close",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 188,
            columnNumber: 10
        }, this);
        $[3] = props;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    return t1;
}
_c2 = PopoverClose;
function PopoverTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold text-sm leading-none", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Title, {
            className: t1,
            "data-slot": "popover-title",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 228,
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
_c3 = PopoverTitle;
function PopoverDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6e3e8e6a890164325b98fbad60b93ad9d57c69339ac47da5e1cca6b21f7cbae4";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$popover$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Popover$3e$__["Popover"].Description, {
            className: t1,
            "data-slot": "popover-description",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/popover.tsx",
            lineNumber: 269,
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
_c4 = PopoverDescription;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "PopoverTrigger");
__turbopack_context__.k.register(_c1, "PopoverPopup");
__turbopack_context__.k.register(_c2, "PopoverClose");
__turbopack_context__.k.register(_c3, "PopoverTitle");
__turbopack_context__.k.register(_c4, "PopoverDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/project-form-shared.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUSTRALIAN_STATES",
    ()=>AUSTRALIAN_STATES,
    "AustralianStateCombobox",
    ()=>AustralianStateCombobox,
    "PROJECT_STATUSES",
    ()=>PROJECT_STATUSES,
    "PROJECT_STATUS_LABELS",
    ()=>PROJECT_STATUS_LABELS,
    "ProjectStartDatePicker",
    ()=>ProjectStartDatePicker,
    "ProjectStatusCombobox",
    ()=>ProjectStatusCombobox,
    "STATE_LABELS",
    ()=>STATE_LABELS,
    "clientDraftFromStored",
    ()=>clientDraftFromStored,
    "clientDraftSchema",
    ()=>clientDraftSchema,
    "cloneProjectClientAddress",
    ()=>cloneProjectClientAddress,
    "editProjectFormSchema",
    ()=>editProjectFormSchema,
    "emptyClientDraft",
    ()=>emptyClientDraft,
    "emptyEditProjectFormValues",
    ()=>emptyEditProjectFormValues,
    "emptyProjectCoreFormValues",
    ()=>emptyProjectCoreFormValues,
    "formatFieldErrors",
    ()=>formatFieldErrors,
    "formatStartDateRelative",
    ()=>formatStartDateRelative,
    "isAustralianState",
    ()=>isAustralianState,
    "projectClientAddressLine",
    ()=>projectClientAddressLine,
    "projectClientAddressesEqual",
    ()=>projectClientAddressesEqual,
    "projectClientDisplayName",
    ()=>projectClientDisplayName,
    "projectClientEmailPhoneLine",
    ()=>projectClientEmailPhoneLine,
    "projectClientFromDraft",
    ()=>projectClientFromDraft,
    "projectCoreFormSchema",
    ()=>projectCoreFormSchema,
    "toConvexCreatePayload",
    ()=>toConvexCreatePayload,
    "toConvexUpdatePayload",
    ()=>toConvexUpdatePayload,
    "trim",
    ()=>trim
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/calendar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/combobox.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/popover.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
'use client';
;
;
;
;
;
;
;
;
const AUSTRALIAN_STATES = [
    'ACT',
    'NSW',
    'NT',
    'QLD',
    'SA',
    'TAS',
    'VIC',
    'WA'
];
const STATE_LABELS = {
    ACT: 'ACT — Australian Capital Territory',
    NSW: 'NSW — New South Wales',
    NT: 'NT — Northern Territory',
    QLD: 'QLD — Queensland',
    SA: 'SA — South Australia',
    TAS: 'TAS — Tasmania',
    VIC: 'VIC — Victoria',
    WA: 'WA — Western Australia'
};
const STATE_ITEMS = AUSTRALIAN_STATES;
const postcodeRegex = /^\d{4}$/;
const trim = (s)=>s.trim();
function isAustralianState(s) {
    return AUSTRALIAN_STATES.includes(s);
}
const optionalClientAddressSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    street: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    suburb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    postcode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}).superRefine((a, ctx)=>{
    const street = trim(a.street);
    const suburb = trim(a.suburb);
    const state = trim(a.state);
    const postcode = trim(a.postcode);
    const anyFilled = Boolean(street || suburb || state || postcode);
    if (!anyFilled) {
        return;
    }
    if (!street) {
        ctx.addIssue({
            code: 'custom',
            message: 'Street is required when client address is provided',
            path: [
                'street'
            ]
        });
    }
    if (!suburb) {
        ctx.addIssue({
            code: 'custom',
            message: 'Suburb is required when client address is provided',
            path: [
                'suburb'
            ]
        });
    }
    if (!state) {
        ctx.addIssue({
            code: 'custom',
            message: 'State is required when client address is provided',
            path: [
                'state'
            ]
        });
    } else if (!isAustralianState(state)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Select a valid Australian state',
            path: [
                'state'
            ]
        });
    }
    if (!postcode) {
        ctx.addIssue({
            code: 'custom',
            message: 'Postcode is required when client address is provided',
            path: [
                'postcode'
            ]
        });
    } else if (!postcodeRegex.test(postcode)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Postcode must be exactly 4 digits',
            path: [
                'postcode'
            ]
        });
    }
});
const clientDraftSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'First name is required'),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Last name is required'),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email('Enter a valid email'),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Phone is required'),
    company: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    address: optionalClientAddressSchema
});
const emptyClientDraft = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: {
        street: '',
        suburb: '',
        state: '',
        postcode: ''
    }
};
const projectCoreFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Name is required'),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        street: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Street is required'),
        suburb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Suburb is required'),
        state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'State is required').refine(isAustralianState, 'Select a valid Australian state'),
        postcode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(postcodeRegex, 'Postcode must be exactly 4 digits')
    }),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional(),
    quotePrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative('Quote price must be 0 or more').optional(),
    expenses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative('Expenses must be 0 or more').optional(),
    received: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative('Received must be 0 or more').optional()
});
const PROJECT_STATUSES = [
    'not_started',
    'in_progress',
    'completed'
];
const PROJECT_STATUS_LABELS = {
    not_started: 'Not started',
    in_progress: 'In progress',
    completed: 'Completed'
};
const editProjectFormSchema = projectCoreFormSchema.extend({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(PROJECT_STATUSES)
});
const emptyProjectCoreFormValues = {
    name: '',
    address: {
        street: '',
        suburb: '',
        state: '',
        postcode: ''
    },
    startDate: undefined,
    quotePrice: undefined,
    expenses: undefined,
    received: undefined
};
const emptyEditProjectFormValues = {
    ...emptyProjectCoreFormValues,
    status: 'not_started'
};
function formatFieldErrors(errors) {
    return errors.map((e)=>{
        if (typeof e === 'string') {
            return e;
        }
        if (e && typeof e === 'object' && 'message' in e) {
            const m = e.message;
            return typeof m === 'string' ? m : String(e);
        }
        return String(e);
    }).filter(Boolean).join(' ');
}
function projectClientDisplayName(c) {
    return `${trim(c.firstName)} ${trim(c.lastName)}`.trim();
}
function projectClientEmailPhoneLine(c) {
    return `${trim(c.email)} | ${trim(c.phone)}`;
}
function projectClientAddressLine(c) {
    if (!c.address) {
        return '';
    }
    const a = c.address;
    return `${a.street}, ${a.suburb}, ${a.state} ${a.postcode}`;
}
function projectClientFromDraft(value) {
    const companyTrimmed = trim(value.company);
    const ca = value.address;
    const clientAddressAny = trim(ca.street) || trim(ca.suburb) || trim(ca.state) || trim(ca.postcode);
    const clientAddress = clientAddressAny ? {
        street: trim(ca.street),
        suburb: trim(ca.suburb),
        state: trim(ca.state),
        postcode: trim(ca.postcode)
    } : undefined;
    return {
        firstName: trim(value.firstName),
        lastName: trim(value.lastName),
        email: trim(value.email),
        phone: trim(value.phone),
        ...companyTrimmed ? {
            company: companyTrimmed
        } : {},
        ...clientAddress ? {
            address: clientAddress
        } : {}
    };
}
function cloneProjectClientAddress(address) {
    return {
        street: address.street,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode
    };
}
function projectClientAddressesEqual(a, b) {
    if (!(a || b)) {
        return true;
    }
    if (!(a && b)) {
        return false;
    }
    return a.street === b.street && a.suburb === b.suburb && a.state === b.state && a.postcode === b.postcode;
}
function clientDraftFromStored(c) {
    return {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        company: c.company ?? '',
        address: {
            street: c.address?.street ?? '',
            suburb: c.address?.suburb ?? '',
            state: c.address?.state ?? '',
            postcode: c.address?.postcode ?? ''
        }
    };
}
function sanitizeProjectClient(c) {
    const companyTrimmed = c.company !== undefined ? trim(c.company) : '';
    const base = {
        firstName: trim(c.firstName),
        lastName: trim(c.lastName),
        email: trim(c.email),
        phone: trim(c.phone),
        ...companyTrimmed ? {
            company: companyTrimmed
        } : {}
    };
    if (!c.address) {
        return base;
    }
    return {
        ...base,
        address: {
            street: trim(c.address.street),
            suburb: trim(c.address.suburb),
            state: c.address.state,
            postcode: trim(c.address.postcode)
        }
    };
}
function toConvexCreatePayload(value, clients) {
    return {
        name: trim(value.name),
        address: {
            street: trim(value.address.street),
            suburb: trim(value.address.suburb),
            state: value.address.state,
            postcode: trim(value.address.postcode)
        },
        status: value.status,
        clients: clients.map(sanitizeProjectClient),
        startDate: value.startDate ? value.startDate.getTime() : undefined,
        quotePrice: value.quotePrice,
        expenses: value.expenses,
        received: value.received
    };
}
function toConvexUpdatePayload(value, clients) {
    return {
        name: trim(value.name),
        address: {
            street: trim(value.address.street),
            suburb: trim(value.address.suburb),
            state: value.address.state,
            postcode: trim(value.address.postcode)
        },
        status: value.status,
        clients: clients.map(sanitizeProjectClient),
        startDate: value.startDate ? value.startDate.getTime() : null,
        quotePrice: value.quotePrice ?? null,
        expenses: value.expenses ?? null,
        received: value.received ?? null
    };
}
function formatStartDateRelative(startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(startDate);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return 'Starts today';
    }
    const isFuture = diffDays > 0;
    const absDays = Math.abs(diffDays);
    const futureBase = new Date(today);
    const pastBase = new Date(today);
    let months;
    let remainingDays;
    if (isFuture) {
        months = (target.getFullYear() - futureBase.getFullYear()) * 12 + (target.getMonth() - futureBase.getMonth());
        const afterMonths = new Date(futureBase);
        afterMonths.setMonth(afterMonths.getMonth() + months);
        remainingDays = Math.round((target.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24));
    } else {
        months = (pastBase.getFullYear() - target.getFullYear()) * 12 + (pastBase.getMonth() - target.getMonth());
        const afterMonths = new Date(target);
        afterMonths.setMonth(afterMonths.getMonth() + months);
        remainingDays = Math.round((pastBase.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24));
    }
    if (months === 0) {
        const label = absDays === 1 ? 'day' : 'days';
        return isFuture ? `Starts in ${absDays} ${label}` : `Started ${absDays} Days ago`;
    }
    const monthLabel = months === 1 ? 'Month' : 'Months';
    const dayPart = remainingDays > 0 ? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}` : '';
    return isFuture ? `Starts in ${months} ${monthLabel}${dayPart}` : `Started ${months} ${monthLabel}${dayPart} ago`;
}
function ProjectStartDatePicker(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226";
    }
    const { value, onChange, onBlur, placeholder: t1 } = t0;
    const placeholder = t1 === undefined ? "Select start date" : t1;
    let t2;
    if ($[1] !== placeholder || $[2] !== value) {
        t2 = value ? value.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }) : placeholder;
        $[1] = placeholder;
        $[2] = value;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const label = t2;
    let t3;
    if ($[4] !== onBlur) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            className: "w-full justify-start pr-9 font-normal",
            onBlur: onBlur,
            type: "button",
            variant: "outline"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 357,
            columnNumber: 10
        }, this);
        $[4] = onBlur;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
            "aria-hidden": true,
            className: "mr-2 size-4 opacity-60"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 365,
            columnNumber: 10
        }, this);
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const t5 = value ? "" : "text-muted-foreground";
    let t6;
    if ($[7] !== label || $[8] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t5,
            children: label
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 373,
            columnNumber: 10
        }, this);
        $[7] = label;
        $[8] = t5;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== t3 || $[11] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PopoverTrigger"], {
            render: t3,
            children: [
                t4,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 382,
            columnNumber: 10
        }, this);
        $[10] = t3;
        $[11] = t6;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== onChange || $[14] !== value) {
        t8 = value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            "aria-label": "Clear date",
            className: "absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded-sm",
            onClick: {
                "ProjectStartDatePicker[<button>.onClick]": (e)=>{
                    e.stopPropagation();
                    onChange(undefined);
                }
            }["ProjectStartDatePicker[<button>.onClick]"],
            onMouseDown: _ProjectStartDatePickerButtonOnMouseDown,
            type: "button",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                className: "size-4 opacity-60 hover:opacity-100"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                lineNumber: 396,
                columnNumber: 121
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 391,
            columnNumber: 18
        }, this) : null;
        $[13] = onChange;
        $[14] = value;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t7 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 405,
            columnNumber: 10
        }, this);
        $[16] = t7;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== onChange) {
        t10 = ({
            "ProjectStartDatePicker[<Calendar>.onSelect]": (date)=>{
                onChange(date ?? undefined);
            }
        })["ProjectStartDatePicker[<Calendar>.onSelect]"];
        $[19] = onChange;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== t10 || $[22] !== value) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PopoverPopup"], {
            align: "start",
            side: "bottom",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"], {
                captionLayout: "dropdown",
                mode: "single",
                onSelect: t10,
                selected: value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                lineNumber: 426,
                columnNumber: 53
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 426,
            columnNumber: 11
        }, this);
        $[21] = t10;
        $[22] = value;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    let t12;
    if ($[24] !== t11 || $[25] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Popover"], {
            children: [
                t9,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 435,
            columnNumber: 11
        }, this);
        $[24] = t11;
        $[25] = t9;
        $[26] = t12;
    } else {
        t12 = $[26];
    }
    return t12;
}
_c = ProjectStartDatePicker;
function _ProjectStartDatePickerButtonOnMouseDown(e_0) {
    return e_0.preventDefault();
}
function AustralianStateCombobox(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226";
    }
    const { id, disabled, value, onChange, onBlur, placeholder, invalid } = t0;
    const selected = value && isAustralianState(value) ? value : null;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [
            ...STATE_ITEMS
        ];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== onChange) {
        t2 = ({
            "AustralianStateCombobox[<Combobox>.onValueChange]": (next)=>{
                onChange(next ?? "");
            }
        })["AustralianStateCombobox[<Combobox>.onValueChange]"];
        $[2] = onChange;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== id || $[5] !== invalid || $[6] !== onBlur || $[7] !== placeholder) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxInput"], {
            "aria-invalid": invalid,
            id: id,
            onBlur: onBlur,
            placeholder: placeholder
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 486,
            columnNumber: 10
        }, this);
        $[4] = id;
        $[5] = invalid;
        $[6] = onBlur;
        $[7] = placeholder;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxPopup"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxEmpty"], {
                    children: "No state found."
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                    lineNumber: 497,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxList"], {
                    children: _temp
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                    lineNumber: 497,
                    columnNumber: 71
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 497,
            columnNumber: 10
        }, this);
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== disabled || $[11] !== selected || $[12] !== t2 || $[13] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Combobox"], {
            disabled: disabled,
            items: t1,
            itemToStringLabel: _AustralianStateComboboxComboboxItemToStringLabel,
            onValueChange: t2,
            value: selected,
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 504,
            columnNumber: 10
        }, this);
        $[10] = disabled;
        $[11] = selected;
        $[12] = t2;
        $[13] = t3;
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    return t5;
}
_c1 = AustralianStateCombobox;
function _temp(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxItem"], {
        value: item,
        children: STATE_LABELS[item]
    }, item, false, {
        fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
        lineNumber: 516,
        columnNumber: 10
    }, this);
}
function _AustralianStateComboboxComboboxItemToStringLabel(code) {
    return STATE_LABELS[code];
}
function ProjectStatusCombobox(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "610ef51968e0fd5138f91e12b02dda475c596eb8aae32d0f76e91e968120f226";
    }
    const { id, disabled, value, onChange, onBlur, placeholder, invalid } = t0;
    const selected = PROJECT_STATUSES.includes(value) ? value : null;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [
            ...PROJECT_STATUSES
        ];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== onChange) {
        t2 = ({
            "ProjectStatusCombobox[<Combobox>.onValueChange]": (next)=>{
                if (next) {
                    onChange(next);
                }
            }
        })["ProjectStatusCombobox[<Combobox>.onValueChange]"];
        $[2] = onChange;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== id || $[5] !== invalid || $[6] !== onBlur || $[7] !== placeholder) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxInput"], {
            "aria-invalid": invalid,
            id: id,
            onBlur: onBlur,
            placeholder: placeholder
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 562,
            columnNumber: 10
        }, this);
        $[4] = id;
        $[5] = invalid;
        $[6] = onBlur;
        $[7] = placeholder;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxPopup"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxEmpty"], {
                    children: "No status found."
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                    lineNumber: 573,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxList"], {
                    children: _temp2
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
                    lineNumber: 573,
                    columnNumber: 72
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 573,
            columnNumber: 10
        }, this);
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== disabled || $[11] !== selected || $[12] !== t2 || $[13] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Combobox"], {
            disabled: disabled,
            items: t1,
            itemToStringLabel: _ProjectStatusComboboxComboboxItemToStringLabel,
            onValueChange: t2,
            value: selected,
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
            lineNumber: 580,
            columnNumber: 10
        }, this);
        $[10] = disabled;
        $[11] = selected;
        $[12] = t2;
        $[13] = t3;
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    return t5;
}
_c2 = ProjectStatusCombobox;
function _temp2(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ComboboxItem"], {
        value: item,
        children: PROJECT_STATUS_LABELS[item]
    }, item, false, {
        fileName: "[project]/apps/app/components/projects/project-form-shared.tsx",
        lineNumber: 592,
        columnNumber: 10
    }, this);
}
function _ProjectStatusComboboxComboboxItemToStringLabel(s) {
    return PROJECT_STATUS_LABELS[s];
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProjectStartDatePicker");
__turbopack_context__.k.register(_c1, "AustralianStateCombobox");
__turbopack_context__.k.register(_c2, "ProjectStatusCombobox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/project-client-ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientAddressTitleRow",
    ()=>ClientAddressTitleRow,
    "ProjectClientCard",
    ()=>ProjectClientCard,
    "ProjectClientDraftFields",
    ()=>ProjectClientDraftFields,
    "clientDraftErrorMessage",
    ()=>clientDraftErrorMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/alert-dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/checkbox.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/field.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/project-form-shared.tsx [app-client] (ecmascript)");
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
function clientDraftErrorMessage(error) {
    return error.issues.map((i)=>i.message).join(' ');
}
function ProjectClientCard(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(46);
    if ($[0] !== "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342") {
        for(let $i = 0; $i < 46; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342";
    }
    const { client, onEdit, onDelete } = t0;
    const [confirmOpen, setConfirmOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== client) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientAddressLine"])(client);
        $[1] = client;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const addressLine = t1;
    let t2;
    if ($[3] !== client) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientDisplayName"])(client);
        $[3] = client;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
            className: "min-w-0 truncate leading-none",
            children: t2
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 52,
            columnNumber: 10
        }, this);
        $[5] = t2;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 60,
            columnNumber: 10
        }, this);
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== onEdit) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "aria-label": "Edit client",
            onClick: onEdit,
            size: "icon",
            type: "button",
            variant: "outline",
            children: t4
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, this);
        $[8] = onEdit;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GroupSeparator"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 75,
            columnNumber: 10
        }, this);
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogTrigger"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                "aria-label": "Delete client",
                size: "icon",
                type: "button",
                variant: "destructive-outline"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                lineNumber: 82,
                columnNumber: 38
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {}, void 0, false, {
                fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                lineNumber: 82,
                columnNumber: 133
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogTitle"], {
            children: "Delete client?"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 89,
            columnNumber: 10
        }, this);
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    let t9;
    if ($[13] !== client) {
        t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientDisplayName"])(client);
        $[13] = client;
        $[14] = t9;
    } else {
        t9 = $[14];
    }
    const t10 = `Remove ${t9} from this project?`;
    let t11;
    if ($[15] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogHeader"], {
            children: [
                t8,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogDescription"], {
                    children: t10
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 105,
                    columnNumber: 34
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 105,
            columnNumber: 11
        }, this);
        $[15] = t10;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogClose"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                lineNumber: 113,
                columnNumber: 37
            }, void 0),
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 113,
            columnNumber: 11
        }, this);
        $[17] = t12;
    } else {
        t12 = $[17];
    }
    let t13;
    if ($[18] !== onDelete) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogFooter"], {
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: {
                        "ProjectClientCard[<Button>.onClick]": ()=>{
                            onDelete();
                            setConfirmOpen(false);
                        }
                    }["ProjectClientCard[<Button>.onClick]"],
                    type: "button",
                    variant: "destructive",
                    children: "Delete client"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 120,
                    columnNumber: 35
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 120,
            columnNumber: 11
        }, this);
        $[18] = onDelete;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t11 || $[21] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogContent"], {
            children: [
                t11,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 133,
            columnNumber: 11
        }, this);
        $[20] = t11;
        $[21] = t13;
        $[22] = t14;
    } else {
        t14 = $[22];
    }
    let t15;
    if ($[23] !== confirmOpen || $[24] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialog"], {
            onOpenChange: setConfirmOpen,
            open: confirmOpen,
            children: [
                t7,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 142,
            columnNumber: 11
        }, this);
        $[23] = confirmOpen;
        $[24] = t14;
        $[25] = t15;
    } else {
        t15 = $[25];
    }
    let t16;
    if ($[26] !== t15 || $[27] !== t5) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
            className: "shrink-0",
            children: [
                t5,
                t6,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 151,
            columnNumber: 11
        }, this);
        $[26] = t15;
        $[27] = t5;
        $[28] = t16;
    } else {
        t16 = $[28];
    }
    let t17;
    if ($[29] !== t16 || $[30] !== t3) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center justify-between gap-3 py-3",
            children: [
                t3,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 160,
            columnNumber: 11
        }, this);
        $[29] = t16;
        $[30] = t3;
        $[31] = t17;
    } else {
        t17 = $[31];
    }
    let t18;
    if ($[32] !== client) {
        t18 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientEmailPhoneLine"])(client);
        $[32] = client;
        $[33] = t18;
    } else {
        t18 = $[33];
    }
    let t19;
    if ($[34] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm leading-snug",
            children: t18
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[34] = t18;
        $[35] = t19;
    } else {
        t19 = $[35];
    }
    let t20;
    if ($[36] !== addressLine) {
        t20 = addressLine || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-muted-foreground/72",
            children: "No address"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 185,
            columnNumber: 26
        }, this);
        $[36] = addressLine;
        $[37] = t20;
    } else {
        t20 = $[37];
    }
    let t21;
    if ($[38] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm leading-snug",
            children: t20
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 193,
            columnNumber: 11
        }, this);
        $[38] = t20;
        $[39] = t21;
    } else {
        t21 = $[39];
    }
    let t22;
    if ($[40] !== t19 || $[41] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
            className: "space-y-2 text-muted-foreground",
            children: [
                t19,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 201,
            columnNumber: 11
        }, this);
        $[40] = t19;
        $[41] = t21;
        $[42] = t22;
    } else {
        t22 = $[42];
    }
    let t23;
    if ($[43] !== t17 || $[44] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t17,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 210,
            columnNumber: 11
        }, this);
        $[43] = t17;
        $[44] = t22;
        $[45] = t23;
    } else {
        t23 = $[45];
    }
    return t23;
}
_s(ProjectClientCard, "K0P4KBWx07RrP/6wa1lswi6XsbQ=");
_c = ProjectClientCard;
function ProjectClientDraftFields(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(49);
    if ($[0] !== "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342") {
        for(let $i = 0; $i < 49; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342";
    }
    const { draft, setDraft, showAddressInputs, addressTitleSlot } = t0;
    let t1;
    if ($[1] !== setDraft) {
        t1 = ({
            "ProjectClientDraftFields[patchAddress]": (patch)=>{
                setDraft({
                    "ProjectClientDraftFields[patchAddress > setDraft()]": (prev)=>({
                            ...prev,
                            address: {
                                ...prev.address,
                                ...patch
                            }
                        })
                }["ProjectClientDraftFields[patchAddress > setDraft()]"]);
            }
        })["ProjectClientDraftFields[patchAddress]"];
        $[1] = setDraft;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const patchAddress = t1;
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
            htmlFor: "client-draft-firstName",
            children: "First name"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 256,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== setDraft) {
        t3 = ({
            "ProjectClientDraftFields[<Input>.onChange]": (e)=>setDraft({
                    "ProjectClientDraftFields[<Input>.onChange > setDraft()]": (p)=>({
                            ...p,
                            firstName: e.target.value
                        })
                }["ProjectClientDraftFields[<Input>.onChange > setDraft()]"])
        })["ProjectClientDraftFields[<Input>.onChange]"];
        $[4] = setDraft;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== draft.firstName || $[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                    autoComplete: "given-name",
                    id: "client-draft-firstName",
                    nativeInput: true,
                    onChange: t3,
                    placeholder: "First name",
                    value: draft.firstName
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 278,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 278,
            columnNumber: 10
        }, this);
        $[6] = draft.firstName;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
            htmlFor: "client-draft-lastName",
            children: "Last name"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 287,
            columnNumber: 10
        }, this);
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== setDraft) {
        t6 = ({
            "ProjectClientDraftFields[<Input>.onChange]": (e_0)=>setDraft({
                    "ProjectClientDraftFields[<Input>.onChange > setDraft()]": (p_0)=>({
                            ...p_0,
                            lastName: e_0.target.value
                        })
                }["ProjectClientDraftFields[<Input>.onChange > setDraft()]"])
        })["ProjectClientDraftFields[<Input>.onChange]"];
        $[10] = setDraft;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== draft.lastName || $[13] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
            children: [
                t5,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                    autoComplete: "family-name",
                    id: "client-draft-lastName",
                    nativeInput: true,
                    onChange: t6,
                    placeholder: "Last name",
                    value: draft.lastName
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 309,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 309,
            columnNumber: 10
        }, this);
        $[12] = draft.lastName;
        $[13] = t6;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== t4 || $[16] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 318,
            columnNumber: 10
        }, this);
        $[15] = t4;
        $[16] = t7;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
            htmlFor: "client-draft-email",
            children: "Email"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 327,
            columnNumber: 10
        }, this);
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== setDraft) {
        t10 = ({
            "ProjectClientDraftFields[<Input>.onChange]": (e_1)=>setDraft({
                    "ProjectClientDraftFields[<Input>.onChange > setDraft()]": (p_1)=>({
                            ...p_1,
                            email: e_1.target.value
                        })
                }["ProjectClientDraftFields[<Input>.onChange > setDraft()]"])
        })["ProjectClientDraftFields[<Input>.onChange]"];
        $[19] = setDraft;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== draft.email || $[22] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
            children: [
                t9,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                    autoComplete: "email",
                    id: "client-draft-email",
                    nativeInput: true,
                    onChange: t10,
                    placeholder: "Email",
                    type: "email",
                    value: draft.email
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 349,
                    columnNumber: 22
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 349,
            columnNumber: 11
        }, this);
        $[21] = draft.email;
        $[22] = t10;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    let t12;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
            htmlFor: "client-draft-phone",
            children: "Phone"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 358,
            columnNumber: 11
        }, this);
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] !== setDraft) {
        t13 = ({
            "ProjectClientDraftFields[<Input>.onChange]": (e_2)=>setDraft({
                    "ProjectClientDraftFields[<Input>.onChange > setDraft()]": (p_2)=>({
                            ...p_2,
                            phone: e_2.target.value
                        })
                }["ProjectClientDraftFields[<Input>.onChange > setDraft()]"])
        })["ProjectClientDraftFields[<Input>.onChange]"];
        $[25] = setDraft;
        $[26] = t13;
    } else {
        t13 = $[26];
    }
    let t14;
    if ($[27] !== draft.phone || $[28] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                    autoComplete: "tel",
                    id: "client-draft-phone",
                    nativeInput: true,
                    onChange: t13,
                    placeholder: "Phone",
                    type: "tel",
                    value: draft.phone
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 380,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 380,
            columnNumber: 11
        }, this);
        $[27] = draft.phone;
        $[28] = t13;
        $[29] = t14;
    } else {
        t14 = $[29];
    }
    let t15;
    if ($[30] !== t11 || $[31] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                t11,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 389,
            columnNumber: 11
        }, this);
        $[30] = t11;
        $[31] = t14;
        $[32] = t15;
    } else {
        t15 = $[32];
    }
    let t16;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
            htmlFor: "client-draft-company",
            children: "Company"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 398,
            columnNumber: 11
        }, this);
        $[33] = t16;
    } else {
        t16 = $[33];
    }
    let t17;
    if ($[34] !== setDraft) {
        t17 = ({
            "ProjectClientDraftFields[<Input>.onChange]": (e_3)=>setDraft({
                    "ProjectClientDraftFields[<Input>.onChange > setDraft()]": (p_3)=>({
                            ...p_3,
                            company: e_3.target.value
                        })
                }["ProjectClientDraftFields[<Input>.onChange > setDraft()]"])
        })["ProjectClientDraftFields[<Input>.onChange]"];
        $[34] = setDraft;
        $[35] = t17;
    } else {
        t17 = $[35];
    }
    let t18;
    if ($[36] !== draft.company || $[37] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
            children: [
                t16,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                    id: "client-draft-company",
                    nativeInput: true,
                    onChange: t17,
                    placeholder: "Company (optional)",
                    value: draft.company
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 420,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 420,
            columnNumber: 11
        }, this);
        $[36] = draft.company;
        $[37] = t17;
        $[38] = t18;
    } else {
        t18 = $[38];
    }
    let t19;
    if ($[39] !== draft.address || $[40] !== patchAddress || $[41] !== showAddressInputs) {
        t19 = showAddressInputs ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                            htmlFor: "client-draft-addr-street",
                            children: "Street"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 429,
                            columnNumber: 40
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                            id: "client-draft-addr-street",
                            nativeInput: true,
                            onChange: {
                                "ProjectClientDraftFields[<Input>.onChange]": (e_4)=>patchAddress({
                                        street: e_4.target.value
                                    })
                            }["ProjectClientDraftFields[<Input>.onChange]"],
                            placeholder: "Street (optional)",
                            value: draft.address.street
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 429,
                            columnNumber: 106
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 429,
                    columnNumber: 33
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                            htmlFor: "client-draft-addr-suburb",
                            children: "Suburb"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 433,
                            columnNumber: 136
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                            id: "client-draft-addr-suburb",
                            nativeInput: true,
                            onChange: {
                                "ProjectClientDraftFields[<Input>.onChange]": (e_5)=>patchAddress({
                                        suburb: e_5.target.value
                                    })
                            }["ProjectClientDraftFields[<Input>.onChange]"],
                            placeholder: "Suburb (optional)",
                            value: draft.address.suburb
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 433,
                            columnNumber: 202
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 433,
                    columnNumber: 129
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                                    htmlFor: "client-draft-addr-state",
                                    children: "State"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                                    lineNumber: 437,
                                    columnNumber: 191
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AustralianStateCombobox"], {
                                    id: "client-draft-addr-state",
                                    onBlur: _ProjectClientDraftFieldsAustralianStateComboboxOnBlur,
                                    onChange: {
                                        "ProjectClientDraftFields[<AustralianStateCombobox>.onChange]": (next)=>patchAddress({
                                                state: next
                                            })
                                    }["ProjectClientDraftFields[<AustralianStateCombobox>.onChange]"],
                                    placeholder: "State (optional)",
                                    value: draft.address.state
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                                    lineNumber: 437,
                                    columnNumber: 255
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 437,
                            columnNumber: 184
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                                    htmlFor: "client-draft-addr-postcode",
                                    children: "Postcode"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                                    lineNumber: 441,
                                    columnNumber: 154
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                                    id: "client-draft-addr-postcode",
                                    inputMode: "numeric",
                                    nativeInput: true,
                                    onChange: {
                                        "ProjectClientDraftFields[<Input>.onChange]": (e_6)=>patchAddress({
                                                postcode: e_6.target.value
                                            })
                                    }["ProjectClientDraftFields[<Input>.onChange]"],
                                    placeholder: "Postcode (optional)",
                                    value: draft.address.postcode
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                                    lineNumber: 441,
                                    columnNumber: 224
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                            lineNumber: 441,
                            columnNumber: 147
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 437,
                    columnNumber: 129
                }, this)
            ]
        }, void 0, true) : null;
        $[39] = draft.address;
        $[40] = patchAddress;
        $[41] = showAddressInputs;
        $[42] = t19;
    } else {
        t19 = $[42];
    }
    let t20;
    if ($[43] !== addressTitleSlot || $[44] !== t15 || $[45] !== t18 || $[46] !== t19 || $[47] !== t8) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4",
            children: [
                t8,
                t15,
                t18,
                addressTitleSlot,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 455,
            columnNumber: 11
        }, this);
        $[43] = addressTitleSlot;
        $[44] = t15;
        $[45] = t18;
        $[46] = t19;
        $[47] = t8;
        $[48] = t20;
    } else {
        t20 = $[48];
    }
    return t20;
}
_c1 = ProjectClientDraftFields;
function _ProjectClientDraftFieldsAustralianStateComboboxOnBlur() {}
function ClientAddressTitleRow(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8ea5424966c08304c07df215ae10e068f342fabdc118f7a10381a62a9b7f0342";
    }
    const { title, showSameAsFirst, sameAsFirstClient, onSameAsFirstChange } = t0;
    let t1;
    if ($[1] !== title) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-medium text-muted-foreground text-sm",
            children: title
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 484,
            columnNumber: 10
        }, this);
        $[1] = title;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== onSameAsFirstChange || $[4] !== sameAsFirstClient || $[5] !== showSameAsFirst) {
        t2 = showSameAsFirst ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex cursor-pointer items-center gap-2 text-muted-foreground text-sm",
            htmlFor: "client-same-as-first",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Checkbox"], {
                    checked: sameAsFirstClient,
                    id: "client-same-as-first",
                    onCheckedChange: {
                        "ClientAddressTitleRow[<Checkbox>.onCheckedChange]": (next)=>onSameAsFirstChange(Boolean(next))
                    }["ClientAddressTitleRow[<Checkbox>.onCheckedChange]"]
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
                    lineNumber: 492,
                    columnNumber: 147
                }, this),
                "Same as first client"
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 492,
            columnNumber: 28
        }, this) : null;
        $[3] = onSameAsFirstChange;
        $[4] = sameAsFirstClient;
        $[5] = showSameAsFirst;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== t1 || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between gap-3",
            children: [
                t1,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/project-client-ui.tsx",
            lineNumber: 504,
            columnNumber: 10
        }, this);
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    return t3;
}
_c2 = ClientAddressTitleRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProjectClientCard");
__turbopack_context__.k.register(_c1, "ProjectClientDraftFields");
__turbopack_context__.k.register(_c2, "ClientAddressTitleRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/add-project.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddProjectForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-form/dist/esm/useForm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/field.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/sheet.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/project-client-ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/project-form-shared.tsx [app-client] (ecmascript)");
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
;
;
;
;
const FORM_ID = 'add-project-form';
function AddProjectForm() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(97);
    if ($[0] !== "f8756838e9e43654c71ceacbba13fd6602248708c4af760a1c3951d4ba264395") {
        for(let $i = 0; $i < 97; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f8756838e9e43654c71ceacbba13fd6602248708c4af760a1c3951d4ba264395";
    }
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [clients, setClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
    const [sameAsFirstClient, setSameAsFirstClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editingIndex, setEditingIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const addProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.add.add);
    const showSameAsFirstCheckbox = clients.length >= 1 && editingIndex !== 0;
    const showAddressInputs = clients.length === 0 || editingIndex === 0 || !sameAsFirstClient;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            onChange: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["editProjectFormSchema"]
        };
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyEditProjectFormValues"],
        validators: t1,
        onSubmit: {
            "AddProjectForm.useForm[form]": async (t2)=>{
                const { value } = t2;
                const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["editProjectFormSchema"].parse(value);
                if (clients.length < 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: "Add at least one client before saving.",
                        title: "Clients required",
                        type: "error"
                    });
                    return;
                }
                ;
                try {
                    await addProject((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toConvexCreatePayload"])(parsed, clients));
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        title: "Project created",
                        type: "success"
                    });
                    form.reset();
                    setClients([]);
                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                    setEditingIndex(null);
                    setSameAsFirstClient(true);
                    setOpen(false);
                } catch (t3) {
                    const error = t3;
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, "Could not create project. Please try again in a moment."),
                        title: "Could not create project",
                        type: "error"
                    });
                }
            }
        }["AddProjectForm.useForm[form]"]
    });
    let t4;
    if ($[3] !== clients[0] || $[4] !== clients.length || $[5] !== draft || $[6] !== sameAsFirstClient || $[7] !== showSameAsFirstCheckbox) {
        t4 = ({
            "AddProjectForm[buildClientFromDraft]": ()=>{
                const parsed_0 = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftSchema"].safeParse(draft);
                if (!parsed_0.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftErrorMessage"])(parsed_0.error),
                        title: "Client details invalid",
                        type: "error"
                    });
                    return null;
                }
                let next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientFromDraft"])(parsed_0.data);
                if (showSameAsFirstCheckbox && sameAsFirstClient && clients.length >= 1) {
                    const first = clients[0];
                    if (first.address) {
                        next = {
                            ...next,
                            address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneProjectClientAddress"])(first.address)
                        };
                    } else {
                        const { address: _a, ...rest } = next;
                        next = rest;
                    }
                }
                return next;
            }
        })["AddProjectForm[buildClientFromDraft]"];
        $[3] = clients[0];
        $[4] = clients.length;
        $[5] = draft;
        $[6] = sameAsFirstClient;
        $[7] = showSameAsFirstCheckbox;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const buildClientFromDraft = t4;
    let t5;
    if ($[9] !== buildClientFromDraft || $[10] !== editingIndex) {
        t5 = ({
            "AddProjectForm[handleAddOrSaveClient]": ()=>{
                const next_0 = buildClientFromDraft();
                if (!next_0) {
                    return;
                }
                if (editingIndex === null) {
                    setClients({
                        "AddProjectForm[handleAddOrSaveClient > setClients()]": (prev)=>[
                                ...prev,
                                next_0
                            ]
                    }["AddProjectForm[handleAddOrSaveClient > setClients()]"]);
                } else {
                    setClients({
                        "AddProjectForm[handleAddOrSaveClient > setClients()]": (prev_0)=>{
                            const copy = [
                                ...prev_0
                            ];
                            copy[editingIndex] = next_0;
                            return copy;
                        }
                    }["AddProjectForm[handleAddOrSaveClient > setClients()]"]);
                }
                setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                setEditingIndex(null);
                setSameAsFirstClient(true);
            }
        })["AddProjectForm[handleAddOrSaveClient]"];
        $[9] = buildClientFromDraft;
        $[10] = editingIndex;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    const handleAddOrSaveClient = t5;
    let t6;
    if ($[12] !== clients) {
        t6 = ({
            "AddProjectForm[handleEditClient]": (index)=>{
                const c = clients[index];
                if (!c) {
                    return;
                }
                setDraft((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftFromStored"])(c));
                setEditingIndex(index);
                if (index > 0) {
                    setSameAsFirstClient((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientAddressesEqual"])(c.address, clients[0]?.address));
                } else {
                    setSameAsFirstClient(true);
                }
            }
        })["AddProjectForm[handleEditClient]"];
        $[12] = clients;
        $[13] = t6;
    } else {
        t6 = $[13];
    }
    const handleEditClient = t6;
    let t7;
    if ($[14] !== editingIndex) {
        t7 = ({
            "AddProjectForm[handleDeleteClient]": (index_0)=>{
                setClients({
                    "AddProjectForm[handleDeleteClient > setClients()]": (prev_1)=>prev_1.filter({
                            "AddProjectForm[handleDeleteClient > setClients() > prev_1.filter()]": (_, i)=>i !== index_0
                        }["AddProjectForm[handleDeleteClient > setClients() > prev_1.filter()]"])
                }["AddProjectForm[handleDeleteClient > setClients()]"]);
                if (editingIndex === index_0) {
                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                    setEditingIndex(null);
                    setSameAsFirstClient(true);
                }
            }
        })["AddProjectForm[handleDeleteClient]"];
        $[14] = editingIndex;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    const handleDeleteClient = t7;
    let t8;
    if ($[16] !== form) {
        t8 = ({
            "AddProjectForm[<Sheet>.onOpenChange]": (next_1)=>{
                setOpen(next_1);
                if (!next_1) {
                    form.reset();
                    setClients([]);
                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                    setEditingIndex(null);
                    setSameAsFirstClient(true);
                }
            }
        })["AddProjectForm[<Sheet>.onOpenChange]"];
        $[16] = form;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetTrigger"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "default",
                children: "Add project"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 230,
                columnNumber: 32
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 230,
            columnNumber: 10
        }, this);
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetTitle"], {
                children: "Add project"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 237,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 237,
            columnNumber: 11
        }, this);
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    let t11;
    if ($[20] !== form) {
        t11 = ({
            "AddProjectForm[<form>.onSubmit]": (e)=>{
                e.preventDefault();
                form.handleSubmit().catch(_AddProjectFormFormOnSubmitAnonymous);
            }
        })["AddProjectForm[<form>.onSubmit]"];
        $[20] = form;
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    let t12;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
                className: "min-w-0 truncate leading-none",
                children: "Project details"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 257,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== form.Field) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "name",
            children: _temp
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 264,
            columnNumber: 11
        }, this);
        $[23] = form.Field;
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    if ($[25] !== form.Field) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "startDate",
            children: _temp2
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 272,
            columnNumber: 11
        }, this);
        $[25] = form.Field;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] !== form.Field) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "status",
            children: _temp3
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 280,
            columnNumber: 11
        }, this);
        $[27] = form.Field;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] !== t14 || $[30] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 288,
            columnNumber: 11
        }, this);
        $[29] = t14;
        $[30] = t15;
        $[31] = t16;
    } else {
        t16 = $[31];
    }
    let t17;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-medium text-muted-foreground text-sm",
            children: "Address"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 297,
            columnNumber: 11
        }, this);
        $[32] = t17;
    } else {
        t17 = $[32];
    }
    let t18;
    if ($[33] !== form.Field) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.street",
            children: _temp4
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[33] = form.Field;
        $[34] = t18;
    } else {
        t18 = $[34];
    }
    let t19;
    if ($[35] !== form.Field) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.suburb",
            children: _temp5
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 312,
            columnNumber: 11
        }, this);
        $[35] = form.Field;
        $[36] = t19;
    } else {
        t19 = $[36];
    }
    let t20;
    if ($[37] !== form.Field) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.state",
            children: _temp6
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 320,
            columnNumber: 11
        }, this);
        $[37] = form.Field;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] !== form.Field) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.postcode",
            children: _temp7
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[39] = form.Field;
        $[40] = t21;
    } else {
        t21 = $[40];
    }
    let t22;
    if ($[41] !== t20 || $[42] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                t20,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 336,
            columnNumber: 11
        }, this);
        $[41] = t20;
        $[42] = t21;
        $[43] = t22;
    } else {
        t22 = $[43];
    }
    let t23;
    if ($[44] !== t13 || $[45] !== t16 || $[46] !== t18 || $[47] !== t19 || $[48] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
                    className: "space-y-4",
                    children: [
                        t13,
                        t16,
                        t17,
                        t18,
                        t19,
                        t22
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/add-project.tsx",
                    lineNumber: 345,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 345,
            columnNumber: 11
        }, this);
        $[44] = t13;
        $[45] = t16;
        $[46] = t18;
        $[47] = t19;
        $[48] = t22;
        $[49] = t23;
    } else {
        t23 = $[49];
    }
    let t24;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
                className: "min-w-0 truncate leading-none",
                children: "Pricing"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 357,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 357,
            columnNumber: 11
        }, this);
        $[50] = t24;
    } else {
        t24 = $[50];
    }
    let t25;
    if ($[51] !== form.Field) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "quotePrice",
            children: _temp8
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 364,
            columnNumber: 11
        }, this);
        $[51] = form.Field;
        $[52] = t25;
    } else {
        t25 = $[52];
    }
    let t26;
    if ($[53] !== form.Field) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "expenses",
            children: _temp9
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 372,
            columnNumber: 11
        }, this);
        $[53] = form.Field;
        $[54] = t26;
    } else {
        t26 = $[54];
    }
    let t27;
    if ($[55] !== form.Field) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "received",
            children: _temp10
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 380,
            columnNumber: 11
        }, this);
        $[55] = form.Field;
        $[56] = t27;
    } else {
        t27 = $[56];
    }
    let t28;
    if ($[57] !== t25 || $[58] !== t26 || $[59] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t24,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                    children: [
                        t25,
                        t26,
                        t27
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/add-project.tsx",
                    lineNumber: 388,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 388,
            columnNumber: 11
        }, this);
        $[57] = t25;
        $[58] = t26;
        $[59] = t27;
        $[60] = t28;
    } else {
        t28 = $[60];
    }
    let t29;
    if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
                className: "min-w-0 truncate leading-none",
                children: "Client details"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 398,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 398,
            columnNumber: 11
        }, this);
        $[61] = t29;
    } else {
        t29 = $[61];
    }
    let t30;
    if ($[62] !== sameAsFirstClient || $[63] !== showSameAsFirstCheckbox) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientAddressTitleRow"], {
            onSameAsFirstChange: setSameAsFirstClient,
            sameAsFirstClient: sameAsFirstClient,
            showSameAsFirst: showSameAsFirstCheckbox,
            title: "Client address"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 405,
            columnNumber: 11
        }, this);
        $[62] = sameAsFirstClient;
        $[63] = showSameAsFirstCheckbox;
        $[64] = t30;
    } else {
        t30 = $[64];
    }
    let t31;
    if ($[65] !== draft || $[66] !== showAddressInputs || $[67] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectClientDraftFields"], {
            addressTitleSlot: t30,
            draft: draft,
            setDraft: setDraft,
            showAddressInputs: showAddressInputs
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 414,
            columnNumber: 11
        }, this);
        $[65] = draft;
        $[66] = showAddressInputs;
        $[67] = t30;
        $[68] = t31;
    } else {
        t31 = $[68];
    }
    const t32 = editingIndex === null ? "Add Client" : "Save Client";
    let t33;
    if ($[69] !== handleAddOrSaveClient || $[70] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-end",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                onClick: handleAddOrSaveClient,
                type: "button",
                variant: "outline",
                children: t32
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 425,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 425,
            columnNumber: 11
        }, this);
        $[69] = handleAddOrSaveClient;
        $[70] = t32;
        $[71] = t33;
    } else {
        t33 = $[71];
    }
    let t34;
    if ($[72] !== clients || $[73] !== handleDeleteClient || $[74] !== handleEditClient) {
        t34 = clients.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3",
            children: clients.map({
                "AddProjectForm[clients.map()]": (c_0, index_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectClientCard"], {
                        client: c_0,
                        onDelete: {
                            "AddProjectForm[clients.map() > <ProjectClientCard>.onDelete]": ()=>handleDeleteClient(index_1)
                        }["AddProjectForm[clients.map() > <ProjectClientCard>.onDelete]"],
                        onEdit: {
                            "AddProjectForm[clients.map() > <ProjectClientCard>.onEdit]": ()=>handleEditClient(index_1)
                        }["AddProjectForm[clients.map() > <ProjectClientCard>.onEdit]"]
                    }, `${c_0.email}-${index_1}`, false, {
                        fileName: "[project]/apps/app/components/projects/add-project.tsx",
                        lineNumber: 435,
                        columnNumber: 60
                    }, this)
            }["AddProjectForm[clients.map()]"])
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 434,
            columnNumber: 32
        }, this) : null;
        $[72] = clients;
        $[73] = handleDeleteClient;
        $[74] = handleEditClient;
        $[75] = t34;
    } else {
        t34 = $[75];
    }
    let t35;
    if ($[76] !== t31 || $[77] !== t33 || $[78] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t29,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
                    className: "space-y-4",
                    children: [
                        t31,
                        t33,
                        t34
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/add-project.tsx",
                    lineNumber: 450,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 450,
            columnNumber: 11
        }, this);
        $[76] = t31;
        $[77] = t33;
        $[78] = t34;
        $[79] = t35;
    } else {
        t35 = $[79];
    }
    let t36;
    if ($[80] !== t23 || $[81] !== t28 || $[82] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetPanel"], {
            className: "flex flex-col gap-6",
            children: [
                t23,
                t28,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 460,
            columnNumber: 11
        }, this);
        $[80] = t23;
        $[81] = t28;
        $[82] = t35;
        $[83] = t36;
    } else {
        t36 = $[83];
    }
    let t37;
    if ($[84] !== t11 || $[85] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "flex min-h-0 min-w-0 flex-1 flex-col",
            id: FORM_ID,
            onSubmit: t11,
            children: t36
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 470,
            columnNumber: 11
        }, this);
        $[84] = t11;
        $[85] = t36;
        $[86] = t37;
    } else {
        t37 = $[86];
    }
    let t38;
    if ($[87] === Symbol.for("react.memo_cache_sentinel")) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetClose"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 479,
                columnNumber: 31
            }, void 0),
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 479,
            columnNumber: 11
        }, this);
        $[87] = t38;
    } else {
        t38 = $[87];
    }
    const t39 = !(form.state.isValid && !form.state.isValidating && !form.state.isSubmitting && clients.length >= 1);
    let t40;
    if ($[88] !== t39) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetFooter"], {
            children: [
                t38,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    disabled: t39,
                    form: FORM_ID,
                    type: "submit",
                    variant: "default",
                    children: "Save"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/add-project.tsx",
                    lineNumber: 487,
                    columnNumber: 29
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 487,
            columnNumber: 11
        }, this);
        $[88] = t39;
        $[89] = t40;
    } else {
        t40 = $[89];
    }
    let t41;
    if ($[90] !== t37 || $[91] !== t40) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetContent"], {
            className: "flex max-h-full min-w-0 flex-col p-0",
            side: "right",
            children: [
                t10,
                t37,
                t40
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 495,
            columnNumber: 11
        }, this);
        $[90] = t37;
        $[91] = t40;
        $[92] = t41;
    } else {
        t41 = $[92];
    }
    let t42;
    if ($[93] !== open || $[94] !== t41 || $[95] !== t8) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Sheet"], {
            onOpenChange: t8,
            open: open,
            children: [
                t9,
                t41
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/add-project.tsx",
            lineNumber: 504,
            columnNumber: 11
        }, this);
        $[93] = open;
        $[94] = t41;
        $[95] = t8;
        $[96] = t42;
    } else {
        t42 = $[96];
    }
    return t42;
}
_s(AddProjectForm, "loqjBsAvARosulA17lNa3VGQ7Z4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = AddProjectForm;
function _temp10(field_8) {
    const invalid_7 = field_8.state.meta.isTouched && !field_8.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_7,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_8.name,
                children: "Received"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 516,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_7,
                id: field_8.name,
                inputMode: "decimal",
                min: 0,
                name: field_8.name,
                nativeInput: true,
                onBlur: field_8.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_6)=>field_8.handleChange(e_6.target.value === "" ? undefined : Number(e_6.target.value))
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_8.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 516,
                columnNumber: 98
            }, this),
            invalid_7 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_8.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 518,
                columnNumber: 149
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 516,
        columnNumber: 10
    }, this);
}
function _temp9(field_7) {
    const invalid_6 = field_7.state.meta.isTouched && !field_7.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_6,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_7.name,
                children: "Expenses"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 522,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_6,
                id: field_7.name,
                inputMode: "decimal",
                min: 0,
                name: field_7.name,
                nativeInput: true,
                onBlur: field_7.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_5)=>field_7.handleChange(e_5.target.value === "" ? undefined : Number(e_5.target.value))
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_7.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 522,
                columnNumber: 98
            }, this),
            invalid_6 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_7.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 524,
                columnNumber: 149
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 522,
        columnNumber: 10
    }, this);
}
function _temp8(field_6) {
    const invalid_5 = field_6.state.meta.isTouched && !field_6.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_5,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_6.name,
                children: "Quote price"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 528,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_5,
                id: field_6.name,
                inputMode: "decimal",
                min: 0,
                name: field_6.name,
                nativeInput: true,
                onBlur: field_6.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_4)=>field_6.handleChange(e_4.target.value === "" ? undefined : Number(e_4.target.value))
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_6.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 528,
                columnNumber: 101
            }, this),
            invalid_5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_6.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 530,
                columnNumber: 149
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 528,
        columnNumber: 10
    }, this);
}
function _temp7(field_5) {
    const invalid_4 = field_5.state.meta.isTouched && !field_5.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_4,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_5.name,
                children: "Postcode"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 534,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_4,
                id: field_5.name,
                inputMode: "decimal",
                name: field_5.name,
                nativeInput: true,
                onBlur: field_5.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_3)=>field_5.handleChange(e_3.target.value)
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0000",
                value: field_5.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 534,
                columnNumber: 98
            }, this),
            invalid_4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_5.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 536,
                columnNumber: 120
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 534,
        columnNumber: 10
    }, this);
}
function _temp6(field_4) {
    const invalid_3 = field_4.state.meta.isTouched && !field_4.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_3,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_4.name,
                children: "State"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 540,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AustralianStateCombobox"], {
                id: field_4.name,
                invalid: invalid_3,
                onBlur: field_4.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <AustralianStateCombobox>.onChange]": (next_3)=>field_4.handleChange(next_3)
                }["AddProjectForm[<anonymous> > <AustralianStateCombobox>.onChange]"],
                placeholder: "Select state",
                value: field_4.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 540,
                columnNumber: 95
            }, this),
            invalid_3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_4.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 542,
                columnNumber: 146
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 540,
        columnNumber: 10
    }, this);
}
function _temp5(field_3) {
    const invalid_2 = field_3.state.meta.isTouched && !field_3.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_2,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_3.name,
                children: "Suburb"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 546,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_2,
                id: field_3.name,
                name: field_3.name,
                nativeInput: true,
                onBlur: field_3.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_2)=>field_3.handleChange(e_2.target.value)
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Suburb",
                value: field_3.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 546,
                columnNumber: 96
            }, this),
            invalid_2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_3.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 548,
                columnNumber: 122
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 546,
        columnNumber: 10
    }, this);
}
function _temp4(field_2) {
    const invalid_1 = field_2.state.meta.isTouched && !field_2.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_1,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_2.name,
                children: "Street"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 552,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_1,
                id: field_2.name,
                name: field_2.name,
                nativeInput: true,
                onBlur: field_2.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_1)=>field_2.handleChange(e_1.target.value)
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Street",
                value: field_2.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 552,
                columnNumber: 96
            }, this),
            invalid_1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_2.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 554,
                columnNumber: 122
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 552,
        columnNumber: 10
    }, this);
}
function _temp3(field_1) {
    const invalid_0 = field_1.state.meta.isTouched && !field_1.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_0,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_1.name,
                children: "Status"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 558,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectStatusCombobox"], {
                id: field_1.name,
                invalid: invalid_0,
                onBlur: field_1.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <ProjectStatusCombobox>.onChange]": (next_2)=>field_1.handleChange(next_2)
                }["AddProjectForm[<anonymous> > <ProjectStatusCombobox>.onChange]"],
                placeholder: "Select status",
                value: field_1.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 558,
                columnNumber: 96
            }, this),
            invalid_0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_1.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 560,
                columnNumber: 145
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 558,
        columnNumber: 10
    }, this);
}
function _temp2(field_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_0.name,
                children: "Start Date"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 563,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectStartDatePicker"], {
                onBlur: field_0.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <ProjectStartDatePicker>.onChange]": (date)=>field_0.handleChange(date)
                }["AddProjectForm[<anonymous> > <ProjectStartDatePicker>.onChange]"],
                value: field_0.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 563,
                columnNumber: 75
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 563,
        columnNumber: 10
    }, this);
}
function _temp(field) {
    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field.name,
                children: "Name"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 569,
                columnNumber: 40
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid,
                id: field.name,
                name: field.name,
                nativeInput: true,
                onBlur: field.handleBlur,
                onChange: {
                    "AddProjectForm[<anonymous> > <Input>.onChange]": (e_0)=>field.handleChange(e_0.target.value)
                }["AddProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Project name",
                value: field.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 569,
                columnNumber: 90
            }, this),
            invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/add-project.tsx",
                lineNumber: 571,
                columnNumber: 124
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/add-project.tsx",
        lineNumber: 569,
        columnNumber: 10
    }, this);
}
function _AddProjectFormFormOnSubmitAnonymous() {}
var _c;
__turbopack_context__.k.register(_c, "AddProjectForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/lib/currency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatAud",
    ()=>formatAud,
    "formatAudCompact",
    ()=>formatAudCompact,
    "formatAudWhole",
    ()=>formatAudWhole
]);
const audWhole = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
});
const aud = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const audCompact = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    notation: 'compact',
    maximumFractionDigits: 1
});
function formatAudWhole(amount) {
    return audWhole.format(amount);
}
function formatAudCompact(amount) {
    return audCompact.format(amount);
}
function formatAud(amount) {
    return aud.format(amount);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/projects-kpi-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectsKpiBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardHat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-hat.js [app-client] (ecmascript) <export default as HardHat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt-text.js [app-client] (ecmascript) <export default as ReceiptText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/currency.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function sumBy(projects, pick) {
    let total = 0;
    for (const project of projects){
        total += pick(project) ?? 0;
    }
    return total;
}
function buildTiles(projects) {
    const active = projects.filter((p)=>p.status === 'in_progress').length;
    const completed = projects.filter((p)=>p.status === 'completed').length;
    const totalQuoted = sumBy(projects, (p)=>p.quotePrice);
    const totalReceived = sumBy(projects, (p)=>p.received);
    const netProfit = totalReceived - sumBy(projects, (p)=>p.expenses);
    return [
        {
            label: 'Projects',
            value: projects.length.toString(),
            hint: `${active} active · ${completed} completed`,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
        },
        {
            label: 'Quoted value',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAudCompact"])(totalQuoted),
            hint: 'Across all projects',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardHat$3e$__["HardHat"]
        },
        {
            label: 'Received',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAudCompact"])(totalReceived),
            hint: 'Payments to date',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__["ReceiptText"]
        },
        {
            label: 'Net profit',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAudCompact"])(netProfit),
            hint: 'Received minus expenses',
            icon: netProfit >= 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"],
            tone: netProfit >= 0 ? 'positive' : 'negative'
        }
    ];
}
const TILE_CLASS = 'relative rounded-xl border bg-background bg-clip-padding p-4 shadow-xs/5';
function KpiBarSkeleton() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "61f960f8d784becbe73717bee469e06d7e839c63ca3ca15f6fa7874a16db3541") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "61f960f8d784becbe73717bee469e06d7e839c63ca3ca15f6fa7874a16db3541";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
            children: [
                "projects",
                "quoted",
                "received",
                "profit"
            ].map(_KpiBarSkeletonAnonymous)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = KpiBarSkeleton;
function _KpiBarSkeletonAnonymous(key) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: TILE_CLASS,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-4 w-20"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 72,
                columnNumber: 48
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "mt-3 h-7 w-24"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 72,
                columnNumber: 81
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "mt-2 h-3 w-28"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 72,
                columnNumber: 119
            }, this)
        ]
    }, key, true, {
        fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
        lineNumber: 72,
        columnNumber: 10
    }, this);
}
function ProjectsKpiBar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "61f960f8d784becbe73717bee469e06d7e839c63ca3ca15f6fa7874a16db3541") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "61f960f8d784becbe73717bee469e06d7e839c63ca3ca15f6fa7874a16db3541";
    }
    const { projects } = t0;
    if (projects === undefined) {
        let t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiBarSkeleton, {}, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 88,
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
    if ($[2] !== projects) {
        const tiles = buildTiles(projects);
        t1 = "grid grid-cols-2 gap-3 lg:grid-cols-4";
        t2 = tiles.map(_ProjectsKpiBarTilesMap);
        $[2] = projects;
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t1 || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
            lineNumber: 110,
            columnNumber: 10
        }, this);
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return t3;
}
_c1 = ProjectsKpiBar;
function _ProjectsKpiBarTilesMap(tile) {
    const Icon = tile.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: TILE_CLASS,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-muted-foreground text-xs uppercase tracking-wide",
                        children: tile.label
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                        lineNumber: 121,
                        columnNumber: 112
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        "aria-hidden": true,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0", tile.tone === "positive" && "text-success-foreground", tile.tone === "negative" && "text-destructive-foreground", (!tile.tone || tile.tone === "default") && "text-muted-foreground")
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                        lineNumber: 121,
                        columnNumber: 215
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 121,
                columnNumber: 55
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 font-semibold text-2xl tabular-nums tracking-tight", tile.tone === "positive" && "text-success-foreground", tile.tone === "negative" && "text-destructive-foreground"),
                children: tile.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 121,
                columnNumber: 464
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 truncate text-muted-foreground text-xs",
                children: tile.hint
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
                lineNumber: 121,
                columnNumber: 671
            }, this)
        ]
    }, tile.label, true, {
        fileName: "[project]/apps/app/components/projects/projects-kpi-bar.tsx",
        lineNumber: 121,
        columnNumber: 10
    }, this);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "KpiBarSkeleton");
__turbopack_context__.k.register(_c1, "ProjectsKpiBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/select.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectButton",
    ()=>SelectButton,
    "SelectContent",
    ()=>SelectPopup,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectGroupLabel",
    ()=>SelectGroupLabel,
    "SelectItem",
    ()=>SelectItem,
    "SelectPopup",
    ()=>SelectPopup,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue,
    "selectTriggerVariants",
    ()=>selectTriggerVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$merge$2d$props$2f$mergeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/merge-props/mergeProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/select/index.parts.js [app-client] (ecmascript) <export * as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/esm/use-render/useRender.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Root;
const selectTriggerVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none", {
    defaultVariants: {
        size: "default"
    },
    variants: {
        size: {
            default: "",
            lg: "min-h-10 sm:min-h-9",
            sm: "min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7"
        }
    }
});
const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4";
function SelectButton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
    }
    let render;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        const { className, size, render: t4, children, ...props } = t0;
        render = t4;
        const typeValue = render ? undefined : "button";
        let t5;
        if ($[6] !== children) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex-1 truncate in-data-placeholder:text-muted-foreground/72",
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 52,
                columnNumber: 12
            }, this);
            $[6] = children;
            $[7] = t5;
        } else {
            t5 = $[7];
        }
        let t6;
        if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__["ChevronsUpDownIcon"], {
                className: selectTriggerIconClassName
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 60,
                columnNumber: 12
            }, this);
            $[8] = t6;
        } else {
            t6 = $[8];
        }
        let t7;
        if ($[9] !== t5) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    t5,
                    t6
                ]
            }, void 0, true);
            $[9] = t5;
            $[10] = t7;
        } else {
            t7 = $[10];
        }
        const defaultProps = {
            children: t7,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectTriggerVariants({
                size
            }), "min-w-0", className),
            "data-slot": "select-button",
            type: typeValue
        };
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$use$2d$render$2f$useRender$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRender"];
        t1 = "button";
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
    if ($[11] !== render || $[12] !== t1 || $[13] !== t2) {
        t4 = {
            defaultTagName: t1,
            props: t2,
            render
        };
        $[11] = render;
        $[12] = t1;
        $[13] = t2;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    return t3(t4);
}
_c = SelectButton;
function SelectTrigger(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
    }
    let children;
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, size: t1, children, ...props } = t0);
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
    const size = t1 === undefined ? "default" : t1;
    let t2;
    if ($[6] !== className || $[7] !== size) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectTriggerVariants({
            size
        }), className);
        $[6] = className;
        $[7] = size;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Icon, {
            "data-slot": "select-icon",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDownIcon$3e$__["ChevronsUpDownIcon"], {
                className: selectTriggerIconClassName
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 155,
                columnNumber: 56
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 155,
            columnNumber: 10
        }, this);
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== children || $[11] !== props || $[12] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Trigger, {
            className: t2,
            "data-slot": "select-trigger",
            ...props,
            children: [
                children,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 162,
            columnNumber: 10
        }, this);
        $[10] = children;
        $[11] = props;
        $[12] = t2;
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    return t4;
}
_c1 = SelectTrigger;
function SelectValue(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 truncate data-placeholder:text-muted-foreground", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Value, {
            className: t1,
            "data-slot": "select-value",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 204,
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
_c2 = SelectValue;
function SelectPopup(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(29);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 29; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
    }
    let anchor;
    let children;
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    if ($[1] !== t0) {
        ({ className, children, side: t1, sideOffset: t2, align: t3, alignOffset: t4, alignItemWithTrigger: t5, anchor, ...props } = t0);
        $[1] = t0;
        $[2] = anchor;
        $[3] = children;
        $[4] = className;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
        $[9] = t4;
        $[10] = t5;
    } else {
        anchor = $[2];
        children = $[3];
        className = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
        t3 = $[8];
        t4 = $[9];
        t5 = $[10];
    }
    const side = t1 === undefined ? "bottom" : t1;
    const sideOffset = t2 === undefined ? 4 : t2;
    const align = t3 === undefined ? "start" : t3;
    const alignOffset = t4 === undefined ? 0 : t4;
    const alignItemWithTrigger = t5 === undefined ? true : t5;
    let t6;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ScrollUpArrow, {
            className: "top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-50% before:from-popover",
            "data-slot": "select-scroll-up-arrow",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
                className: "relative size-4.5 sm:size-4"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 270,
                columnNumber: 353
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 270,
            columnNumber: 10
        }, this);
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== className) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("max-h-(--available-height) overflow-y-auto p-1", className);
        $[12] = className;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== children || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative h-full min-w-(--anchor-width) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].List, {
                className: t7,
                "data-slot": "select-list",
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 285,
                columnNumber: 336
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 285,
            columnNumber: 10
        }, this);
        $[14] = children;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ScrollDownArrow, {
            className: "bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-50% before:from-popover",
            "data-slot": "select-scroll-down-arrow",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                className: "relative size-4.5 sm:size-4"
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 294,
                columnNumber: 363
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 294,
            columnNumber: 10
        }, this);
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== props || $[19] !== t8) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Popup, {
            className: "origin-(--transform-origin) text-foreground",
            "data-slot": "select-popup",
            ...props,
            children: [
                t6,
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 301,
            columnNumber: 11
        }, this);
        $[18] = props;
        $[19] = t8;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== align || $[22] !== alignItemWithTrigger || $[23] !== alignOffset || $[24] !== anchor || $[25] !== side || $[26] !== sideOffset || $[27] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Positioner, {
                align: align,
                alignItemWithTrigger: alignItemWithTrigger,
                alignOffset: alignOffset,
                anchor: anchor,
                className: "z-50 select-none",
                "data-slot": "select-positioner",
                side: side,
                sideOffset: sideOffset,
                children: t10
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 310,
                columnNumber: 35
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 310,
            columnNumber: 11
        }, this);
        $[21] = align;
        $[22] = alignItemWithTrigger;
        $[23] = alignOffset;
        $[24] = anchor;
        $[25] = side;
        $[26] = sideOffset;
        $[27] = t10;
        $[28] = t11;
    } else {
        t11 = $[28];
    }
    return t11;
}
_c3 = SelectPopup;
function SelectItem(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
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
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className);
        $[5] = className;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    let t2;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ItemIndicator, {
            className: "col-start-1",
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
                    fileName: "[project]/packages/ui/src/components/select.tsx",
                    lineNumber: 360,
                    columnNumber: 243
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/select.tsx",
                lineNumber: 360,
                columnNumber: 65
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 360,
            columnNumber: 10
        }, this);
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    let t3;
    if ($[8] !== children) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].ItemText, {
            className: "col-start-2 min-w-0",
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 367,
            columnNumber: 10
        }, this);
        $[8] = children;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== props || $[11] !== t1 || $[12] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Item, {
            className: t1,
            "data-slot": "select-item",
            ...props,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 375,
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
_c4 = SelectItem;
function SelectSeparator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
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
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Separator, {
            className: t1,
            "data-slot": "select-separator",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 417,
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
_c5 = SelectSeparator;
function SelectGroup(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].Group, {
            "data-slot": "select-group",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 436,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c6 = SelectGroup;
function SelectGroupLabel(props) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "eb379f572f6d7797e1dbcb7dd25c23eb8cbbf002481cee9ddc30c4b8be5867eb";
    }
    let t0;
    if ($[1] !== props) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$esm$2f$select$2f$index$2e$parts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Select$3e$__["Select"].GroupLabel, {
            className: "px-2 py-1.5 font-medium text-muted-foreground text-xs",
            "data-slot": "select-group-label",
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui/src/components/select.tsx",
            lineNumber: 454,
            columnNumber: 10
        }, this);
        $[1] = props;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
_c7 = SelectGroupLabel;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "SelectButton");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectPopup");
__turbopack_context__.k.register(_c4, "SelectItem");
__turbopack_context__.k.register(_c5, "SelectSeparator");
__turbopack_context__.k.register(_c6, "SelectGroup");
__turbopack_context__.k.register(_c7, "SelectGroupLabel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui/src/components/data-table-pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTablePagination",
    ()=>DataTablePagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/select.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-left.js [app-client] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-client] (ecmascript) <export default as ChevronsRight>");
'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';
;
;
;
;
function DataTablePagination({ table, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between px-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 text-muted-foreground text-sm",
                children: label
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                lineNumber: 20,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-6 lg:space-x-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium text-sm",
                                children: "Rows per page"
                            }, void 0, false, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 23,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Select"], {
                                onValueChange: (value)=>{
                                    table.setPageSize(Number(value));
                                },
                                value: `${table.getState().pagination.pageSize}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SelectTrigger"], {
                                        className: "h-8 w-[70px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SelectValue"], {}, void 0, false, {
                                            fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                            lineNumber: 28,
                                            columnNumber: 8
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 27,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SelectContent"], {
                                        children: [
                                            10,
                                            20,
                                            25,
                                            30,
                                            40,
                                            50
                                        ].map((pageSize)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SelectItem"], {
                                                value: `${pageSize}`,
                                                children: pageSize
                                            }, pageSize, false, {
                                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                                lineNumber: 31,
                                                columnNumber: 50
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 30,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 24,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                        lineNumber: 22,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-[100px] items-center justify-center font-medium text-sm",
                        children: [
                            "Page ",
                            table.getState().pagination.pageIndex + 1,
                            " of",
                            ' ',
                            table.getPageCount()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                        lineNumber: 37,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "hidden size-8 lg:flex",
                                disabled: !table.getCanPreviousPage(),
                                onClick: ()=>table.setPageIndex(0),
                                size: "icon",
                                variant: "outline",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Go to first page"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 43,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 44,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 42,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "size-8",
                                disabled: !table.getCanPreviousPage(),
                                onClick: ()=>table.previousPage(),
                                size: "icon",
                                variant: "outline",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Go to previous page"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 47,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 48,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 46,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "size-8",
                                disabled: !table.getCanNextPage(),
                                onClick: ()=>table.nextPage(),
                                size: "icon",
                                variant: "outline",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Go to next page"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 51,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 52,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 50,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "hidden size-8 lg:flex",
                                disabled: !table.getCanNextPage(),
                                onClick: ()=>table.setPageIndex(table.getPageCount() - 1),
                                size: "icon",
                                variant: "outline",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Go to last page"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 55,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                        lineNumber: 56,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                                lineNumber: 54,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                        lineNumber: 41,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
                lineNumber: 21,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui/src/components/data-table-pagination.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c = DataTablePagination;
var _c;
__turbopack_context__.k.register(_c, "DataTablePagination");
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
"[project]/packages/ui/src/components/data-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-table/build/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/table-core/build/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$data$2d$table$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/data-table-pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/table.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
// React Compiler can't track mutations on the TanStack Table instance (setOptions during render).
'use no memo';
;
;
;
;
;
function getColumnWidth(columnSize, _size) {
    // Only set fixed width for narrow columns (e.g. actions) so the table fits container width
    if (columnSize != null && columnSize <= 80) {
        return `${columnSize}px`;
    }
    return undefined;
}
function DataTable({ columns, data, initialPageSize = 20, onRowClick, emptyMessage = 'No results.', showPagination = true, stickyHeader = false }) {
    _s();
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"])({
        data,
        columns,
        getCoreRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoreRowModel"])(),
        getPaginationRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaginationRowModel"])(),
        autoResetPageIndex: false,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: initialPageSize
            }
        }
    });
    const { pageIndex, pageSize } = table.getState().pagination;
    const rowCount = data.length;
    const hasFooter = columns.some((column)=>column.footer != null);
    const rangeLabel = rowCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-muted-foreground text-sm",
        children: [
            pageIndex * pageSize + 1,
            "–",
            Math.min((pageIndex + 1) * pageSize, rowCount),
            " / ",
            rowCount
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui/src/components/data-table.tsx",
        lineNumber: 55,
        columnNumber: 37
    }, this) : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-w-0 overflow-hidden', stickyHeader && 'h-full min-h-0'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                className: "w-full table-fixed",
                containerClassName: stickyHeader ? 'min-h-0 flex-1 overflow-y-auto' : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                        className: stickyHeader ? '[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-muted' : undefined,
                        children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: headerGroup.headers.map((header)=>{
                                    const size = header.getSize();
                                    const columnSize = header.column.columnDef.size;
                                    const width = getColumnWidth(columnSize, size);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: width ? undefined : 'min-w-0',
                                        style: width ? {
                                            width,
                                            minWidth: width,
                                            maxWidth: width
                                        } : undefined,
                                        children: header.isPlaceholder ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header.column.columnDef.header, header.getContext())
                                    }, header.id, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                        lineNumber: 67,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, headerGroup.id, false, {
                                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                lineNumber: 62,
                                columnNumber: 50
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                        lineNumber: 61,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                        children: table.getRowModel().rows?.length ? table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                className: onRowClick ? 'cursor-pointer' : undefined,
                                "data-state": row.getIsSelected() && 'selected',
                                onClick: onRowClick ? ()=>onRowClick(row.original) : undefined,
                                children: row.getVisibleCells().map((cell)=>{
                                    const size_0 = cell.column.getSize();
                                    const columnSize_0 = cell.column.columnDef.size;
                                    const width_0 = getColumnWidth(columnSize_0, size_0);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                        className: "min-w-0 whitespace-normal break-words align-top",
                                        style: width_0 ? {
                                            width: width_0,
                                            minWidth: width_0,
                                            maxWidth: width_0
                                        } : undefined,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(cell.column.columnDef.cell, cell.getContext())
                                    }, cell.id, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                        lineNumber: 83,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, row.id, false, {
                                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                lineNumber: 78,
                                columnNumber: 78
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "h-24 text-center",
                                colSpan: columns.length,
                                children: emptyMessage
                            }, void 0, false, {
                                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                lineNumber: 92,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/packages/ui/src/components/data-table.tsx",
                            lineNumber: 91,
                            columnNumber: 23
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                        lineNumber: 77,
                        columnNumber: 5
                    }, this),
                    hasFooter && rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableFooter"], {
                        children: table.getFooterGroups().map((footerGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: footerGroup.headers.map((header_0)=>{
                                    const size_1 = header_0.getSize();
                                    const columnSize_1 = header_0.column.columnDef.size;
                                    const width_1 = getColumnWidth(columnSize_1, size_1);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                        className: width_1 ? undefined : 'min-w-0',
                                        style: width_1 ? {
                                            width: width_1,
                                            minWidth: width_1,
                                            maxWidth: width_1
                                        } : undefined,
                                        children: header_0.isPlaceholder ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header_0.column.columnDef.footer, header_0.getContext())
                                    }, header_0.id, false, {
                                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                        lineNumber: 103,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, footerGroup.id, false, {
                                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                                lineNumber: 98,
                                columnNumber: 51
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/packages/ui/src/components/data-table.tsx",
                        lineNumber: 97,
                        columnNumber: 35
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                lineNumber: 60,
                columnNumber: 4
            }, this),
            showPagination && rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameFooter"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$data$2d$table$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTablePagination"], {
                    label: rangeLabel,
                    table: table
                }, void 0, false, {
                    fileName: "[project]/packages/ui/src/components/data-table.tsx",
                    lineNumber: 115,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui/src/components/data-table.tsx",
                lineNumber: 114,
                columnNumber: 39
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui/src/components/data-table.tsx",
        lineNumber: 59,
        columnNumber: 10
    }, this);
}
_s(DataTable, "+qfJc9U8evODZQ8bBg9G2KVouAc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"]
    ];
});
_c = DataTable;
var _c;
__turbopack_context__.k.register(_c, "DataTable");
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
"[project]/apps/app/components/projects/delete-project.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeleteProject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/alert-dialog.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
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
;
function DeleteProject({ projectId, projectName, trigger, open: controlledOpen, onOpenChange, redirectOnDelete = true }) {
    _s();
    const [uncontrolledOpen, setUncontrolledOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = (next)=>{
        if (!isControlled) {
            setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
    };
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const removeProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.remove.remove);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const onDelete = async ()=>{
        setIsDeleting(true);
        try {
            await removeProject({
                projectId
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                title: 'Project deleted',
                type: 'success'
            });
            setOpen(false);
            if (redirectOnDelete) {
                router.push('/projects');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, 'Could not delete project. Please try again in a moment.'),
                title: 'Could not delete project',
                type: 'error'
            });
        } finally{
            setIsDeleting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialog"], {
        onOpenChange: setOpen,
        open: open,
        children: [
            isControlled ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogTrigger"], {
                render: trigger ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "destructive-outline",
                    children: "Delete project"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                    lineNumber: 64,
                    columnNumber: 66
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                lineNumber: 64,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogContent"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogTitle"], {
                                children: "Delete project?"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                                lineNumber: 67,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogDescription"], {
                                children: `This will permanently delete ${projectName}. This action cannot be undone.`
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                                lineNumber: 68,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                        lineNumber: 66,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogFooter"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AlertDialogClose"], {
                                render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline"
                                }, void 0, false, {
                                    fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                                    lineNumber: 73,
                                    columnNumber: 32
                                }, void 0),
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                                lineNumber: 73,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                loading: isDeleting,
                                onClick: ()=>{
                                    onDelete().catch(()=>{
                                    /* Error is handled in onDelete */ });
                                },
                                variant: "destructive",
                                children: "Delete project"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                                lineNumber: 76,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                        lineNumber: 72,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/delete-project.tsx",
                lineNumber: 65,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/delete-project.tsx",
        lineNumber: 63,
        columnNumber: 10
    }, this);
}
_s(DeleteProject, "aWr10a9v1JYUPv24NBIudj9pOuY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DeleteProject;
var _c;
__turbopack_context__.k.register(_c, "DeleteProject");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/edit-project.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditProjectForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-form/dist/esm/useForm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/field.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/frame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/sheet.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/toast.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/project-client-ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/project-form-shared.tsx [app-client] (ecmascript)");
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
;
;
;
;
const FORM_ID = 'edit-project-form';
function projectDocToEditDefaults(project) {
    return {
        status: project.status,
        name: project.name,
        address: {
            ...project.address
        },
        startDate: project.startDate ? new Date(project.startDate) : undefined,
        quotePrice: project.quotePrice,
        expenses: project.expenses,
        received: project.received
    };
}
function cloneClient(client) {
    return {
        ...client,
        ...client.address ? {
            address: {
                ...client.address
            }
        } : {}
    };
}
function cloneClientsFromProject(project) {
    return project.clients.map(cloneClient);
}
function EditProjectForm(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(116);
    if ($[0] !== "473f77f6f304a15a0a74277a2318ac1e4ccb421312780ee437546dd40218d48a") {
        for(let $i = 0; $i < 116; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "473f77f6f304a15a0a74277a2318ac1e4ccb421312780ee437546dd40218d48a";
    }
    const { projectId, trigger, project: projectProp, open: controlledOpen, onOpenChange } = t0;
    let t1;
    if ($[1] !== projectId || $[2] !== projectProp) {
        t1 = projectProp ? "skip" : {
            projectId
        };
        $[1] = projectId;
        $[2] = projectProp;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const queriedProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.get.get, t1);
    const project = projectProp ?? queriedProject;
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    let t2;
    if ($[4] !== isControlled || $[5] !== onOpenChange) {
        t2 = ({
            "EditProjectForm[setOpen]": (next)=>{
                if (!isControlled) {
                    setUncontrolledOpen(next);
                }
                onOpenChange?.(next);
            }
        })["EditProjectForm[setOpen]"];
        $[4] = isControlled;
        $[5] = onOpenChange;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const setOpen = t2;
    let t3;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = [];
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const [clients, setClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
    const [sameAsFirstClient, setSameAsFirstClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    let t4;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            kind: "hidden"
        };
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const [clientFormMode, setClientFormMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t4);
    const updateProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.update.update);
    const showSameAsFirstCheckbox = clientFormMode.kind !== "hidden" && clients.length >= 1 && (clientFormMode.kind === "new" || clientFormMode.kind === "edit" && clientFormMode.index !== 0);
    const showAddressInputs = clientFormMode.kind === "hidden" ? false : clients.length === 0 || clientFormMode.kind === "edit" && clientFormMode.index === 0 || !sameAsFirstClient;
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            onChange: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["editProjectFormSchema"]
        };
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== clients || $[11] !== projectId || $[12] !== setOpen || $[13] !== updateProject) {
        t6 = {
            defaultValues: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyEditProjectFormValues"],
            validators: t5,
            onSubmit: async (t7)=>{
                const { value } = t7;
                const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["editProjectFormSchema"].parse(value);
                if (clients.length < 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: "A project must have at least one client.",
                        title: "Clients required",
                        type: "error"
                    });
                    return;
                }
                ;
                try {
                    await updateProject({
                        projectId,
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toConvexUpdatePayload"])(parsed, clients)
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        title: "Project updated",
                        type: "success"
                    });
                    setOpen(false);
                } catch (t8) {
                    const error = t8;
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$convex$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConvexErrorMessage"])(error, "Could not update project. Please try again in a moment."),
                        title: "Could not update project",
                        type: "error"
                    });
                }
            }
        };
        $[10] = clients;
        $[11] = projectId;
        $[12] = setOpen;
        $[13] = updateProject;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])(t6);
    let t7;
    if ($[15] !== form) {
        t7 = ({
            "EditProjectForm[hydrateFromProject]": (nextProject)=>{
                const defaults = projectDocToEditDefaults(nextProject);
                form.reset();
                form.setFieldValue("name", defaults.name);
                form.setFieldValue("status", defaults.status);
                form.setFieldValue("address.street", defaults.address.street);
                form.setFieldValue("address.suburb", defaults.address.suburb);
                form.setFieldValue("address.state", defaults.address.state);
                form.setFieldValue("address.postcode", defaults.address.postcode);
                form.setFieldValue("startDate", defaults.startDate);
                form.setFieldValue("quotePrice", defaults.quotePrice);
                form.setFieldValue("expenses", defaults.expenses);
                form.setFieldValue("received", defaults.received);
                setClients(cloneClientsFromProject(nextProject));
                setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                setSameAsFirstClient(true);
                setClientFormMode({
                    kind: "hidden"
                });
            }
        })["EditProjectForm[hydrateFromProject]"];
        $[15] = form;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    const hydrateFromProject = t7;
    let t8;
    let t9;
    if ($[17] !== hydrateFromProject || $[18] !== open || $[19] !== project) {
        t8 = ({
            "EditProjectForm[useEffect()]": ()=>{
                if (!(open && project)) {
                    return;
                }
                hydrateFromProject(project);
            }
        })["EditProjectForm[useEffect()]"];
        t9 = [
            hydrateFromProject,
            open,
            project
        ];
        $[17] = hydrateFromProject;
        $[18] = open;
        $[19] = project;
        $[20] = t8;
        $[21] = t9;
    } else {
        t8 = $[20];
        t9 = $[21];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t8, t9);
    let t10;
    if ($[22] !== clients[0] || $[23] !== clients.length || $[24] !== draft || $[25] !== sameAsFirstClient || $[26] !== showSameAsFirstCheckbox) {
        t10 = ({
            "EditProjectForm[buildClientFromDraft]": ()=>{
                const parsed_0 = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftSchema"].safeParse(draft);
                if (!parsed_0.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftErrorMessage"])(parsed_0.error),
                        title: "Client details invalid",
                        type: "error"
                    });
                    return null;
                }
                let next_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientFromDraft"])(parsed_0.data);
                if (showSameAsFirstCheckbox && sameAsFirstClient && clients.length >= 1) {
                    const first = clients[0];
                    if (first.address) {
                        next_0 = {
                            ...next_0,
                            address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneProjectClientAddress"])(first.address)
                        };
                    } else {
                        const { address: _a, ...rest } = next_0;
                        next_0 = rest;
                    }
                }
                return next_0;
            }
        })["EditProjectForm[buildClientFromDraft]"];
        $[22] = clients[0];
        $[23] = clients.length;
        $[24] = draft;
        $[25] = sameAsFirstClient;
        $[26] = showSameAsFirstCheckbox;
        $[27] = t10;
    } else {
        t10 = $[27];
    }
    const buildClientFromDraft = t10;
    let t11;
    if ($[28] !== buildClientFromDraft || $[29] !== clientFormMode.index || $[30] !== clientFormMode.kind) {
        t11 = ({
            "EditProjectForm[handleAddOrSaveClient]": ()=>{
                const next_1 = buildClientFromDraft();
                if (!next_1) {
                    return;
                }
                if (clientFormMode.kind === "new") {
                    setClients({
                        "EditProjectForm[handleAddOrSaveClient > setClients()]": (prev)=>[
                                ...prev,
                                next_1
                            ]
                    }["EditProjectForm[handleAddOrSaveClient > setClients()]"]);
                } else {
                    if (clientFormMode.kind === "edit") {
                        const index = clientFormMode.index;
                        setClients({
                            "EditProjectForm[handleAddOrSaveClient > setClients()]": (prev_0)=>{
                                const copy = [
                                    ...prev_0
                                ];
                                copy[index] = next_1;
                                return copy;
                            }
                        }["EditProjectForm[handleAddOrSaveClient > setClients()]"]);
                    }
                }
                setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                setSameAsFirstClient(true);
                setClientFormMode({
                    kind: "hidden"
                });
            }
        })["EditProjectForm[handleAddOrSaveClient]"];
        $[28] = buildClientFromDraft;
        $[29] = clientFormMode.index;
        $[30] = clientFormMode.kind;
        $[31] = t11;
    } else {
        t11 = $[31];
    }
    const handleAddOrSaveClient = t11;
    let t12;
    if ($[32] !== clients) {
        t12 = ({
            "EditProjectForm[handleEditClient]": (index_0)=>{
                const c = clients[index_0];
                if (!c) {
                    return;
                }
                setDraft((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clientDraftFromStored"])(c));
                setClientFormMode({
                    kind: "edit",
                    index: index_0
                });
                if (index_0 > 0) {
                    setSameAsFirstClient((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectClientAddressesEqual"])(c.address, clients[0]?.address));
                } else {
                    setSameAsFirstClient(true);
                }
            }
        })["EditProjectForm[handleEditClient]"];
        $[32] = clients;
        $[33] = t12;
    } else {
        t12 = $[33];
    }
    const handleEditClient = t12;
    let t13;
    if ($[34] !== clientFormMode.index || $[35] !== clientFormMode.kind || $[36] !== clients.length) {
        t13 = ({
            "EditProjectForm[handleDeleteClient]": (index_1)=>{
                if (clients.length <= 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toastManager"].add({
                        description: "Remove clients from the project only after adding another.",
                        title: "At least one client required",
                        type: "error"
                    });
                    return;
                }
                setClients({
                    "EditProjectForm[handleDeleteClient > setClients()]": (prev_1)=>prev_1.filter({
                            "EditProjectForm[handleDeleteClient > setClients() > prev_1.filter()]": (_, i)=>i !== index_1
                        }["EditProjectForm[handleDeleteClient > setClients() > prev_1.filter()]"])
                }["EditProjectForm[handleDeleteClient > setClients()]"]);
                if (clientFormMode.kind === "edit" && clientFormMode.index === index_1) {
                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                    setClientFormMode({
                        kind: "hidden"
                    });
                    setSameAsFirstClient(true);
                }
            }
        })["EditProjectForm[handleDeleteClient]"];
        $[34] = clientFormMode.index;
        $[35] = clientFormMode.kind;
        $[36] = clients.length;
        $[37] = t13;
    } else {
        t13 = $[37];
    }
    const handleDeleteClient = t13;
    let t14;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = ({
            "EditProjectForm[startAddClient]": ()=>{
                setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                setSameAsFirstClient(true);
                setClientFormMode({
                    kind: "new"
                });
            }
        })["EditProjectForm[startAddClient]"];
        $[38] = t14;
    } else {
        t14 = $[38];
    }
    const startAddClient = t14;
    const clientFormVisible = clientFormMode.kind !== "hidden";
    let t15;
    if ($[39] !== form || $[40] !== hydrateFromProject || $[41] !== project || $[42] !== setOpen) {
        t15 = ({
            "EditProjectForm[<Sheet>.onOpenChange]": (next_2)=>{
                setOpen(next_2);
                if (next_2) {
                    if (project) {
                        hydrateFromProject(project);
                    }
                } else {
                    form.reset(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyEditProjectFormValues"]);
                    setClients([]);
                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                    setClientFormMode({
                        kind: "hidden"
                    });
                    setSameAsFirstClient(true);
                }
            }
        })["EditProjectForm[<Sheet>.onOpenChange]"];
        $[39] = form;
        $[40] = hydrateFromProject;
        $[41] = project;
        $[42] = setOpen;
        $[43] = t15;
    } else {
        t15 = $[43];
    }
    let t16;
    if ($[44] !== isControlled || $[45] !== trigger) {
        t16 = isControlled ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetTrigger"], {
            render: trigger ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                children: "Edit project"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 421,
                columnNumber: 66
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 421,
            columnNumber: 33
        }, this);
        $[44] = isControlled;
        $[45] = trigger;
        $[46] = t16;
    } else {
        t16 = $[46];
    }
    let t17;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetTitle"], {
                children: "Edit project"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 430,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 430,
            columnNumber: 11
        }, this);
        $[47] = t17;
    } else {
        t17 = $[47];
    }
    let t18;
    if ($[48] !== form) {
        t18 = ({
            "EditProjectForm[<form>.onSubmit]": (e)=>{
                e.preventDefault();
                form.handleSubmit().catch(_EditProjectFormFormOnSubmitAnonymous);
            }
        })["EditProjectForm[<form>.onSubmit]"];
        $[48] = form;
        $[49] = t18;
    } else {
        t18 = $[49];
    }
    let t19;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
                className: "min-w-0 truncate leading-none",
                children: "Project details"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 450,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 450,
            columnNumber: 11
        }, this);
        $[50] = t19;
    } else {
        t19 = $[50];
    }
    let t20;
    if ($[51] !== form.Field) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "name",
            children: _temp
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 457,
            columnNumber: 11
        }, this);
        $[51] = form.Field;
        $[52] = t20;
    } else {
        t20 = $[52];
    }
    let t21;
    if ($[53] !== form.Field) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                    name: "status",
                    children: _temp2
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 465,
                    columnNumber: 66
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                    name: "startDate",
                    children: _temp3
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 465,
                    columnNumber: 113
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 465,
            columnNumber: 11
        }, this);
        $[53] = form.Field;
        $[54] = t21;
    } else {
        t21 = $[54];
    }
    let t22;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-medium text-muted-foreground text-sm",
            children: "Address"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 473,
            columnNumber: 11
        }, this);
        $[55] = t22;
    } else {
        t22 = $[55];
    }
    let t23;
    let t24;
    if ($[56] !== form.Field) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.street",
            children: _temp4
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 481,
            columnNumber: 11
        }, this);
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
            name: "address.suburb",
            children: _temp5
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 482,
            columnNumber: 11
        }, this);
        $[56] = form.Field;
        $[57] = t23;
        $[58] = t24;
    } else {
        t23 = $[57];
        t24 = $[58];
    }
    let t25;
    if ($[59] !== form.Field) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                    name: "address.state",
                    children: _temp6
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 492,
                    columnNumber: 66
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                    name: "address.postcode",
                    children: _temp7
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 492,
                    columnNumber: 120
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 492,
            columnNumber: 11
        }, this);
        $[59] = form.Field;
        $[60] = t25;
    } else {
        t25 = $[60];
    }
    let t26;
    if ($[61] !== t20 || $[62] !== t21 || $[63] !== t23 || $[64] !== t24 || $[65] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t19,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
                    className: "space-y-4",
                    children: [
                        t20,
                        t21,
                        t22,
                        t23,
                        t24,
                        t25
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 500,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 500,
            columnNumber: 11
        }, this);
        $[61] = t20;
        $[62] = t21;
        $[63] = t23;
        $[64] = t24;
        $[65] = t25;
        $[66] = t26;
    } else {
        t26 = $[66];
    }
    let t27;
    if ($[67] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
                className: "min-w-0 truncate leading-none",
                children: "Pricing"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 512,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 512,
            columnNumber: 11
        }, this);
        $[67] = t27;
    } else {
        t27 = $[67];
    }
    let t28;
    if ($[68] !== form.Field) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t27,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                            name: "quotePrice",
                            children: _temp8
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                            lineNumber: 519,
                            columnNumber: 85
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                            name: "expenses",
                            children: _temp9
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                            lineNumber: 519,
                            columnNumber: 136
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(form.Field, {
                            name: "received",
                            children: _temp10
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                            lineNumber: 519,
                            columnNumber: 185
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 519,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 519,
            columnNumber: 11
        }, this);
        $[68] = form.Field;
        $[69] = t28;
    } else {
        t28 = $[69];
    }
    let t29;
    if ($[70] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameTitle"], {
            className: "min-w-0 truncate leading-none",
            children: "Client details"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 527,
            columnNumber: 11
        }, this);
        $[70] = t29;
    } else {
        t29 = $[70];
    }
    let t30;
    if ($[71] !== clientFormMode.kind) {
        t30 = clientFormMode.kind === "hidden" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            onClick: startAddClient,
            type: "button",
            variant: "outline",
            children: "Add client"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 534,
            columnNumber: 46
        }, this) : null;
        $[71] = clientFormMode.kind;
        $[72] = t30;
    } else {
        t30 = $[72];
    }
    let t31;
    if ($[73] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FrameHeader"], {
            className: "flex flex-row items-center justify-between gap-3 py-3",
            children: [
                t29,
                t30
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 542,
            columnNumber: 11
        }, this);
        $[73] = t30;
        $[74] = t31;
    } else {
        t31 = $[74];
    }
    let t32;
    if ($[75] !== clientFormMode.kind || $[76] !== clientFormVisible || $[77] !== draft || $[78] !== handleAddOrSaveClient || $[79] !== sameAsFirstClient || $[80] !== showAddressInputs || $[81] !== showSameAsFirstCheckbox) {
        t32 = clientFormVisible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectClientDraftFields"], {
                    addressTitleSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientAddressTitleRow"], {
                        onSameAsFirstChange: setSameAsFirstClient,
                        sameAsFirstClient: sameAsFirstClient,
                        showSameAsFirst: showSameAsFirstCheckbox,
                        title: "Client address"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                        lineNumber: 550,
                        columnNumber: 102
                    }, void 0),
                    draft: draft,
                    setDraft: setDraft,
                    showAddressInputs: showAddressInputs
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 550,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: {
                                "EditProjectForm[<Button>.onClick]": ()=>{
                                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyClientDraft"]);
                                    setSameAsFirstClient(true);
                                    setClientFormMode({
                                        kind: "hidden"
                                    });
                                }
                            }["EditProjectForm[<Button>.onClick]"],
                            type: "button",
                            variant: "ghost",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                            lineNumber: 550,
                            columnNumber: 389
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleAddOrSaveClient,
                            type: "button",
                            variant: "outline",
                            children: clientFormMode.kind === "new" ? "Add Client" : "Save Client"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                            lineNumber: 558,
                            columnNumber: 94
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 550,
                    columnNumber: 349
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 550,
            columnNumber: 31
        }, this) : null;
        $[75] = clientFormMode.kind;
        $[76] = clientFormVisible;
        $[77] = draft;
        $[78] = handleAddOrSaveClient;
        $[79] = sameAsFirstClient;
        $[80] = showAddressInputs;
        $[81] = showSameAsFirstCheckbox;
        $[82] = t32;
    } else {
        t32 = $[82];
    }
    let t33;
    if ($[83] !== clients || $[84] !== handleDeleteClient || $[85] !== handleEditClient) {
        let t34;
        if ($[87] !== handleDeleteClient || $[88] !== handleEditClient) {
            t34 = ({
                "EditProjectForm[clients.map()]": (c_0, index_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$client$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectClientCard"], {
                        client: c_0,
                        onDelete: {
                            "EditProjectForm[clients.map() > <ProjectClientCard>.onDelete]": ()=>handleDeleteClient(index_2)
                        }["EditProjectForm[clients.map() > <ProjectClientCard>.onDelete]"],
                        onEdit: {
                            "EditProjectForm[clients.map() > <ProjectClientCard>.onEdit]": ()=>handleEditClient(index_2)
                        }["EditProjectForm[clients.map() > <ProjectClientCard>.onEdit]"]
                    }, `${c_0.email}-${index_2}`, false, {
                        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                        lineNumber: 575,
                        columnNumber: 61
                    }, this)
            })["EditProjectForm[clients.map()]"];
            $[87] = handleDeleteClient;
            $[88] = handleEditClient;
            $[89] = t34;
        } else {
            t34 = $[89];
        }
        t33 = clients.map(t34);
        $[83] = clients;
        $[84] = handleDeleteClient;
        $[85] = handleEditClient;
        $[86] = t33;
    } else {
        t33 = $[86];
    }
    let t34;
    if ($[90] !== t33) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3",
            children: t33
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 597,
            columnNumber: 11
        }, this);
        $[90] = t33;
        $[91] = t34;
    } else {
        t34 = $[91];
    }
    let t35;
    if ($[92] !== t32 || $[93] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {
            className: "space-y-4",
            children: [
                t32,
                t34
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 605,
            columnNumber: 11
        }, this);
        $[92] = t32;
        $[93] = t34;
        $[94] = t35;
    } else {
        t35 = $[94];
    }
    let t36;
    if ($[95] !== t31 || $[96] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$frame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Frame"], {
            children: [
                t31,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 614,
            columnNumber: 11
        }, this);
        $[95] = t31;
        $[96] = t35;
        $[97] = t36;
    } else {
        t36 = $[97];
    }
    let t37;
    if ($[98] !== t26 || $[99] !== t28 || $[100] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetPanel"], {
            className: "flex flex-col gap-6",
            children: [
                t26,
                t28,
                t36
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 623,
            columnNumber: 11
        }, this);
        $[98] = t26;
        $[99] = t28;
        $[100] = t36;
        $[101] = t37;
    } else {
        t37 = $[101];
    }
    let t38;
    if ($[102] !== t18 || $[103] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "flex min-h-0 min-w-0 flex-1 flex-col",
            id: FORM_ID,
            onSubmit: t18,
            children: t37
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 633,
            columnNumber: 11
        }, this);
        $[102] = t18;
        $[103] = t37;
        $[104] = t38;
    } else {
        t38 = $[104];
    }
    let t39;
    if ($[105] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetClose"], {
            render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 642,
                columnNumber: 31
            }, void 0),
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 642,
            columnNumber: 11
        }, this);
        $[105] = t39;
    } else {
        t39 = $[105];
    }
    const t40 = !(form.state.isValid && !form.state.isValidating && !form.state.isSubmitting && clients.length >= 1);
    let t41;
    if ($[106] !== t40) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetFooter"], {
            children: [
                t39,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    disabled: t40,
                    form: FORM_ID,
                    type: "submit",
                    variant: "default",
                    children: "Save"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                    lineNumber: 650,
                    columnNumber: 29
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 650,
            columnNumber: 11
        }, this);
        $[106] = t40;
        $[107] = t41;
    } else {
        t41 = $[107];
    }
    let t42;
    if ($[108] !== t38 || $[109] !== t41) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SheetContent"], {
            className: "flex max-h-full min-w-0 flex-col p-0",
            side: "right",
            children: [
                t17,
                t38,
                t41
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 658,
            columnNumber: 11
        }, this);
        $[108] = t38;
        $[109] = t41;
        $[110] = t42;
    } else {
        t42 = $[110];
    }
    let t43;
    if ($[111] !== open || $[112] !== t15 || $[113] !== t16 || $[114] !== t42) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Sheet"], {
            onOpenChange: t15,
            open: open,
            children: [
                t16,
                t42
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/edit-project.tsx",
            lineNumber: 667,
            columnNumber: 11
        }, this);
        $[111] = open;
        $[112] = t15;
        $[113] = t16;
        $[114] = t42;
        $[115] = t43;
    } else {
        t43 = $[115];
    }
    return t43;
}
_s(EditProjectForm, "KIvOLGNvGTSCfn2mvlEH5kVS4sI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$form$2f$dist$2f$esm$2f$useForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = EditProjectForm;
function _temp10(field_8) {
    const invalid_7 = field_8.state.meta.isTouched && !field_8.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_7,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_8.name,
                children: "Received"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 680,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_7,
                id: field_8.name,
                inputMode: "decimal",
                min: 0,
                name: field_8.name,
                nativeInput: true,
                onBlur: field_8.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_6)=>field_8.handleChange(e_6.target.value === "" ? undefined : Number(e_6.target.value))
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_8.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 680,
                columnNumber: 98
            }, this),
            invalid_7 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_8.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 682,
                columnNumber: 150
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 680,
        columnNumber: 10
    }, this);
}
function _temp9(field_7) {
    const invalid_6 = field_7.state.meta.isTouched && !field_7.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_6,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_7.name,
                children: "Expenses"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 686,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_6,
                id: field_7.name,
                inputMode: "decimal",
                min: 0,
                name: field_7.name,
                nativeInput: true,
                onBlur: field_7.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_5)=>field_7.handleChange(e_5.target.value === "" ? undefined : Number(e_5.target.value))
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_7.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 686,
                columnNumber: 98
            }, this),
            invalid_6 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_7.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 688,
                columnNumber: 150
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 686,
        columnNumber: 10
    }, this);
}
function _temp8(field_6) {
    const invalid_5 = field_6.state.meta.isTouched && !field_6.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_5,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_6.name,
                children: "Quote price"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 692,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_5,
                id: field_6.name,
                inputMode: "decimal",
                min: 0,
                name: field_6.name,
                nativeInput: true,
                onBlur: field_6.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_4)=>field_6.handleChange(e_4.target.value === "" ? undefined : Number(e_4.target.value))
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0",
                step: "0.01",
                type: "number",
                value: field_6.state.value ?? ""
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 692,
                columnNumber: 101
            }, this),
            invalid_5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_6.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 694,
                columnNumber: 150
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 692,
        columnNumber: 10
    }, this);
}
function _temp7(field_5) {
    const invalid_4 = field_5.state.meta.isTouched && !field_5.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_4,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_5.name,
                children: "Postcode"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 698,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_4,
                id: field_5.name,
                inputMode: "decimal",
                name: field_5.name,
                nativeInput: true,
                onBlur: field_5.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_3)=>field_5.handleChange(e_3.target.value)
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "0000",
                value: field_5.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 698,
                columnNumber: 98
            }, this),
            invalid_4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_5.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 700,
                columnNumber: 121
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 698,
        columnNumber: 10
    }, this);
}
function _temp6(field_4) {
    const invalid_3 = field_4.state.meta.isTouched && !field_4.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_3,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_4.name,
                children: "State"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 704,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AustralianStateCombobox"], {
                id: field_4.name,
                invalid: invalid_3,
                onBlur: field_4.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <AustralianStateCombobox>.onChange]": (next_4)=>field_4.handleChange(next_4)
                }["EditProjectForm[<anonymous> > <AustralianStateCombobox>.onChange]"],
                placeholder: "Select state",
                value: field_4.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 704,
                columnNumber: 95
            }, this),
            invalid_3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_4.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 706,
                columnNumber: 147
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 704,
        columnNumber: 10
    }, this);
}
function _temp5(field_3) {
    const invalid_2 = field_3.state.meta.isTouched && !field_3.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_2,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_3.name,
                children: "Suburb"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 710,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_2,
                id: field_3.name,
                name: field_3.name,
                nativeInput: true,
                onBlur: field_3.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_2)=>field_3.handleChange(e_2.target.value)
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Suburb",
                value: field_3.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 710,
                columnNumber: 96
            }, this),
            invalid_2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_3.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 712,
                columnNumber: 123
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 710,
        columnNumber: 10
    }, this);
}
function _temp4(field_2) {
    const invalid_1 = field_2.state.meta.isTouched && !field_2.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_1,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_2.name,
                children: "Street"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 716,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid_1,
                id: field_2.name,
                name: field_2.name,
                nativeInput: true,
                onBlur: field_2.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_1)=>field_2.handleChange(e_1.target.value)
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Street",
                value: field_2.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 716,
                columnNumber: 96
            }, this),
            invalid_1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_2.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 718,
                columnNumber: 123
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 716,
        columnNumber: 10
    }, this);
}
function _temp3(field_1) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_1.name,
                children: "Start Date"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 721,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectStartDatePicker"], {
                onBlur: field_1.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <ProjectStartDatePicker>.onChange]": (date)=>field_1.handleChange(date)
                }["EditProjectForm[<anonymous> > <ProjectStartDatePicker>.onChange]"],
                value: field_1.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 721,
                columnNumber: 75
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 721,
        columnNumber: 10
    }, this);
}
function _temp2(field_0) {
    const invalid_0 = field_0.state.meta.isTouched && !field_0.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid_0,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field_0.name,
                children: "Status"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 727,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectStatusCombobox"], {
                id: field_0.name,
                invalid: invalid_0,
                onBlur: field_0.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <ProjectStatusCombobox>.onChange]": (next_3)=>field_0.handleChange(next_3)
                }["EditProjectForm[<anonymous> > <ProjectStatusCombobox>.onChange]"],
                placeholder: "Select status",
                value: field_0.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 727,
                columnNumber: 96
            }, this),
            invalid_0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field_0.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 729,
                columnNumber: 146
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 727,
        columnNumber: 10
    }, this);
}
function _temp(field) {
    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Field"], {
        "data-invalid": invalid,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldLabel"], {
                htmlFor: field.name,
                children: "Name"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 733,
                columnNumber: 40
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Input"], {
                "aria-invalid": invalid,
                id: field.name,
                name: field.name,
                nativeInput: true,
                onBlur: field.handleBlur,
                onChange: {
                    "EditProjectForm[<anonymous> > <Input>.onChange]": (e_0)=>field.handleChange(e_0.target.value)
                }["EditProjectForm[<anonymous> > <Input>.onChange]"],
                placeholder: "Project name",
                value: field.state.value
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 733,
                columnNumber: 90
            }, this),
            invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FieldError"], {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$project$2d$form$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFieldErrors"])(field.state.meta.errors)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/edit-project.tsx",
                lineNumber: 735,
                columnNumber: 125
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/edit-project.tsx",
        lineNumber: 733,
        columnNumber: 10
    }, this);
}
function _EditProjectFormFormOnSubmitAnonymous() {}
var _c;
__turbopack_context__.k.register(_c, "EditProjectForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/projects-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/empty.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/components/menu.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as EllipsisVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/lib/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$delete$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/delete-project.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$edit$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/edit-project.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use no memo';
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
function ProjectActionsCell({ project }) {
    _s();
    const [editOpen, setEditOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteOpen, setDeleteOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return(// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
    // biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-end",
        onClick: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Menu"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuTrigger"], {
                        render: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            "aria-label": "Project actions",
                            size: "icon-sm",
                            type: "button",
                            variant: "ghost"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                            lineNumber: 32,
                            columnNumber: 26
                        }, void 0),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EllipsisVertical$3e$__["EllipsisVertical"], {
                            className: "size-4"
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                            lineNumber: 33,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 32,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuPopup"], {
                        align: "end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuItem"], {
                                onClick: ()=>setEditOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {}, void 0, false, {
                                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                        lineNumber: 37,
                                        columnNumber: 7
                                    }, this),
                                    "Edit"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                lineNumber: 36,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                lineNumber: 40,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuItem"], {
                                onClick: ()=>setDeleteOpen(true),
                                variant: "destructive",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {}, void 0, false, {
                                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                        lineNumber: 42,
                                        columnNumber: 7
                                    }, this),
                                    "Delete"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                lineNumber: 41,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 35,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 31,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$edit$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onOpenChange: setEditOpen,
                open: editOpen,
                project: project,
                projectId: project._id
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 47,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$delete$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onOpenChange: setDeleteOpen,
                open: deleteOpen,
                projectId: project._id,
                projectName: project.name,
                redirectOnDelete: false
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 48,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this));
}
_s(ProjectActionsCell, "lsiNUXUJKtaPct74oizTi7jQeP4=");
_c = ProjectActionsCell;
function NoProjectsYetEmpty() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Empty"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyMedia"], {
                        variant: "icon",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                            lineNumber: 57,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 56,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyTitle"], {
                        children: "No projects yet"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 59,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyDescription"], {
                        children: "Create a project to track builds, clients, and site details in one place. Use the Add project button above to get started."
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 60,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 55,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
            lineNumber: 54,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
}
_c1 = NoProjectsYetEmpty;
function NoMatchEmpty() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Empty"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyMedia"], {
                        variant: "icon",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"], {
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                            lineNumber: 73,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 72,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyTitle"], {
                        children: "No matching projects"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 75,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyDescription"], {
                        children: "Try another name, address, suburb, postcode, or client detail — or clear the status filter."
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 76,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 71,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
            lineNumber: 70,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 69,
        columnNumber: 10
    }, this);
}
_c2 = NoMatchEmpty;
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
        parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }
    if (days > 0) {
        parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Today';
}
const RightHeader = ({ label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-right",
        children: label
    }, void 0, false, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 134,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
_c3 = RightHeader;
function MoneyDelta({ amount, positiveSuffix, negativeSuffix }) {
    const isPositive = amount >= 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: isPositive ? 'text-success-foreground text-xs' : 'text-destructive-foreground text-xs',
        children: isPositive ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAud"])(amount)} ${positiveSuffix}` : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAud"])(Math.abs(amount))} ${negativeSuffix}`
    }, void 0, false, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 145,
        columnNumber: 10
    }, this);
}
_c4 = MoneyDelta;
const columns = [
    {
        accessorKey: 'name',
        header: 'Project',
        cell: ({ row })=>{
            const { name, address } = row.original;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 space-y-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate font-medium",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 160,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate text-muted-foreground text-xs",
                        children: [
                            address.street,
                            ", ",
                            address.suburb,
                            " ",
                            address.state,
                            ' ',
                            address.postcode
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 161,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 159,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row })=>{
            const { status, startDate } = row.original;
            const badge = statusBadgeProps(status);
            const showDuration = status === 'in_progress' && startDate;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        size: "lg",
                        variant: badge.variant,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                className: "size-1.5 rounded-full bg-current opacity-70"
                            }, void 0, false, {
                                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                                lineNumber: 182,
                                columnNumber: 7
                            }, ("TURBOPACK compile-time value", void 0)),
                            badge.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 181,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    showDuration ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-xs",
                        children: formatDuration(startDate)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 185,
                        columnNumber: 22
                    }, ("TURBOPACK compile-time value", void 0)) : null
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 180,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: 'quotePrice',
        header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightHeader, {
                label: "Quote"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 192,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
        size: 130,
        cell: ({ row })=>{
            const { quotePrice, expenses } = row.original;
            if (quotePrice === undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                    lineNumber: 202,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            }
            const remaining = expenses === undefined ? undefined : quotePrice - expenses;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-0.5 text-right tabular-nums",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAud"])(quotePrice)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 206,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    remaining === undefined ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoneyDelta, {
                        amount: remaining,
                        negativeSuffix: "over",
                        positiveSuffix: "left"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 207,
                        columnNumber: 40
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 205,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: 'expenses',
        header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightHeader, {
                label: "Spent"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 212,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
        size: 120,
        cell: ({ row })=>{
            const { expenses } = row.original;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right tabular-nums",
                children: expenses === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                    lineNumber: 221,
                    columnNumber: 32
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAud"])(expenses)
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                    lineNumber: 221,
                    columnNumber: 83
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 220,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: 'received',
        header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightHeader, {
                label: "Received"
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 226,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
        size: 130,
        cell: ({ row })=>{
            const { received, expenses } = row.original;
            if (received === undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                    lineNumber: 236,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            }
            const profit = expenses === undefined ? undefined : received - expenses;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-0.5 text-right tabular-nums",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$lib$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAud"])(received)
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 240,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    profit === undefined ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoneyDelta, {
                        amount: profit,
                        negativeSuffix: "loss",
                        positiveSuffix: "profit"
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 241,
                        columnNumber: 37
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 239,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: 'clients',
        header: 'Client',
        size: 180,
        cell: ({ row })=>{
            const { clients } = row.original;
            const [primary, ...rest] = clients;
            if (!primary) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-sm",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                    lineNumber: 256,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 space-y-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate font-medium",
                        children: [
                            primary.firstName,
                            " ",
                            primary.lastName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 259,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate text-muted-foreground text-xs",
                        children: primary.email
                    }, void 0, false, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 262,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    rest.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-xs",
                        children: [
                            "+",
                            rest.length,
                            " more ",
                            rest.length === 1 ? 'client' : 'clients'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                        lineNumber: 265,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)) : null
                ]
            }, void 0, true, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 258,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: 'actions',
        header: '',
        size: 60,
        cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectActionsCell, {
                project: row.original
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-list.tsx",
                lineNumber: 276,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
    }
];
function ProjectsList({ projects, isFiltered, resetKey = '' }) {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    if (projects === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-muted-foreground text-sm",
            children: "Loading projects…"
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
            lineNumber: 289,
            columnNumber: 12
        }, this);
    }
    if (projects.length === 0) {
        return isFiltered ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NoMatchEmpty, {}, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
            lineNumber: 292,
            columnNumber: 25
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NoProjectsYetEmpty, {}, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-list.tsx",
            lineNumber: 292,
            columnNumber: 44
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTable"], {
        columns: columns,
        data: projects,
        emptyMessage: "No matching projects.",
        onRowClick: (project)=>router.push(`/projects/${project._id}`),
        stickyHeader: true
    }, resetKey, false, {
        fileName: "[project]/apps/app/components/projects/projects-list.tsx",
        lineNumber: 294,
        columnNumber: 10
    }, this);
}
_s1(ProjectsList, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c5 = ProjectsList;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ProjectActionsCell");
__turbopack_context__.k.register(_c1, "NoProjectsYetEmpty");
__turbopack_context__.k.register(_c2, "NoMatchEmpty");
__turbopack_context__.k.register(_c3, "RightHeader");
__turbopack_context__.k.register(_c4, "MoneyDelta");
__turbopack_context__.k.register(_c5, "ProjectsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/app/components/projects/projects-page-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectsPageContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/components/input-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/page-heading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$add$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/add-project.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$projects$2d$kpi$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/projects-kpi-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$projects$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/components/projects/projects-list.tsx [app-client] (ecmascript)");
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
const STATUS_FILTERS = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'not_started',
        label: 'Not started'
    },
    {
        value: 'in_progress',
        label: 'In progress'
    },
    {
        value: 'completed',
        label: 'Completed'
    }
];
function countByStatus(projects, status) {
    if (projects === undefined) {
        return undefined;
    }
    if (status === 'all') {
        return projects.length;
    }
    return projects.filter((project)=>project.status === status).length;
}
function ProjectsPageContent() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(39);
    if ($[0] !== "3f98e5a4e4e54af7bde008889f648a99687758b80485dc0c5036f910df16c36d") {
        for(let $i = 0; $i < 39; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3f98e5a4e4e54af7bde008889f648a99687758b80485dc0c5036f910df16c36d";
    }
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [debouncedSearch, setDebouncedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    let t0;
    let t1;
    if ($[1] !== search) {
        t0 = ({
            "ProjectsPageContent[useEffect()]": ()=>{
                const id = window.setTimeout({
                    "ProjectsPageContent[useEffect() > window.setTimeout()]": ()=>setDebouncedSearch(search)
                }["ProjectsPageContent[useEffect() > window.setTimeout()]"], 300);
                return ()=>window.clearTimeout(id);
            }
        })["ProjectsPageContent[useEffect()]"];
        t1 = [
            search
        ];
        $[1] = search;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[4] !== debouncedSearch) {
        t2 = debouncedSearch.trim();
        $[4] = debouncedSearch;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    const trimmedSearch = t2;
    const isSearching = trimmedSearch !== "";
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {};
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const allProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.list.list, t3);
    let t4;
    if ($[7] !== isSearching || $[8] !== trimmedSearch) {
        t4 = isSearching ? {
            query: trimmedSearch
        } : "skip";
        $[7] = isSearching;
        $[8] = trimmedSearch;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const searchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].projects.search.search, t4);
    const baseProjects = isSearching ? searchResults : allProjects;
    let t5;
    bb0: {
        if (baseProjects === undefined) {
            t5 = undefined;
            break bb0;
        }
        if (statusFilter === "all") {
            t5 = baseProjects;
            break bb0;
        }
        let t6;
        if ($[10] !== baseProjects || $[11] !== statusFilter) {
            let t7;
            if ($[13] !== statusFilter) {
                t7 = ({
                    "ProjectsPageContent[baseProjects.filter()]": (project)=>project.status === statusFilter
                })["ProjectsPageContent[baseProjects.filter()]"];
                $[13] = statusFilter;
                $[14] = t7;
            } else {
                t7 = $[14];
            }
            t6 = baseProjects.filter(t7);
            $[10] = baseProjects;
            $[11] = statusFilter;
            $[12] = t6;
        } else {
            t6 = $[12];
        }
        t5 = t6;
    }
    const visibleProjects = t5;
    let t6;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full min-h-0 w-full flex-col gap-4");
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupAddon"], {
            align: "inline-start",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupText"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"], {
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                    lineNumber: 146,
                    columnNumber: 64
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                lineNumber: 146,
                columnNumber: 48
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 146,
            columnNumber: 10
        }, this);
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    let t8;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = ({
            "ProjectsPageContent[<InputGroupInput>.onChange]": (e)=>setSearch(e.target.value)
        })["ProjectsPageContent[<InputGroupInput>.onChange]"];
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== search) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroup"], {
            className: "w-full sm:min-w-80 sm:max-w-2xl",
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupInput"], {
                    "aria-label": "Search projects",
                    onChange: t8,
                    placeholder: "Search by name, address, client\u2026",
                    type: "search",
                    value: search
                }, void 0, false, {
                    fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                    lineNumber: 162,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 162,
            columnNumber: 10
        }, this);
        $[18] = search;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$add$2d$project$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 170,
            columnNumber: 11
        }, this);
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$page$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            heading: "Projects",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
            rightSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    t9,
                    t10
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[21] = t9;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    let t12;
    if ($[23] !== allProjects) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$projects$2d$kpi$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            projects: allProjects
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 185,
            columnNumber: 11
        }, this);
        $[23] = allProjects;
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] !== allProjects || $[26] !== statusFilter) {
        t13 = STATUS_FILTERS.map({
            "ProjectsPageContent[STATUS_FILTERS.map()]": (filter)=>{
                const isActive = statusFilter === filter.value;
                const count = countByStatus(allProjects, filter.value);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$components$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    "aria-pressed": isActive,
                    className: "shrink-0",
                    onClick: {
                        "ProjectsPageContent[STATUS_FILTERS.map() > <Button>.onClick]": ()=>setStatusFilter(filter.value)
                    }["ProjectsPageContent[STATUS_FILTERS.map() > <Button>.onClick]"],
                    size: "sm",
                    variant: isActive ? "secondary" : "ghost",
                    children: [
                        filter.label,
                        count === undefined ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("tabular-nums", isActive ? "text-secondary-foreground/70" : "text-muted-foreground"),
                            children: count
                        }, void 0, false, {
                            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                            lineNumber: 199,
                            columnNumber: 173
                        }, this)
                    ]
                }, filter.value, true, {
                    fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                    lineNumber: 197,
                    columnNumber: 16
                }, this);
            }
        }["ProjectsPageContent[STATUS_FILTERS.map()]"]);
        $[25] = allProjects;
        $[26] = statusFilter;
        $[27] = t13;
    } else {
        t13 = $[27];
    }
    let t14;
    if ($[28] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1",
            children: t13
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 210,
            columnNumber: 11
        }, this);
        $[28] = t13;
        $[29] = t14;
    } else {
        t14 = $[29];
    }
    const t15 = isSearching || statusFilter !== "all";
    const t16 = `${trimmedSearch}|${statusFilter}`;
    let t17;
    if ($[30] !== t15 || $[31] !== t16 || $[32] !== visibleProjects) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-0 flex-1 flex-col",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$components$2f$projects$2f$projects$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isFiltered: t15,
                projects: visibleProjects,
                resetKey: t16
            }, void 0, false, {
                fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
                lineNumber: 220,
                columnNumber: 57
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 220,
            columnNumber: 11
        }, this);
        $[30] = t15;
        $[31] = t16;
        $[32] = visibleProjects;
        $[33] = t17;
    } else {
        t17 = $[33];
    }
    let t18;
    if ($[34] !== t11 || $[35] !== t12 || $[36] !== t14 || $[37] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: [
                t11,
                t12,
                t14,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/apps/app/components/projects/projects-page-content.tsx",
            lineNumber: 230,
            columnNumber: 11
        }, this);
        $[34] = t11;
        $[35] = t12;
        $[36] = t14;
        $[37] = t17;
        $[38] = t18;
    } else {
        t18 = $[38];
    }
    return t18;
}
_s(ProjectsPageContent, "+OSspNwrbx8911Xh2G8pDtonYEo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = ProjectsPageContent;
var _c;
__turbopack_context__.k.register(_c, "ProjectsPageContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_3052ae26._.js.map