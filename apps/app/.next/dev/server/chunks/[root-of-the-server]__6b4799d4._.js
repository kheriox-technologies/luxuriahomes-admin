module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/packages/backend/convex/_generated/api.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/api.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/components/index.js [middleware] (ecmascript) <locals>");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["anyApi"];
const internal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["anyApi"];
const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["componentsGeneric"])();
}),
"[project]/apps/app/config/roles.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Single source of truth for role-based surfaces.
 *
 * A "surface" is a URL space owned by a set of roles (admin portal, client
 * portal, ...). Middleware gating, the root landing redirect, and the surface
 * switcher all derive from this registry. Adding a role later means adding a
 * registry entry plus its route folder — nothing else.
 *
 * This module must stay pure/isomorphic (no server-only imports): it is
 * consumed by the edge middleware (proxy.ts), server actions, and client
 * components alike.
 */ __turbopack_context__.s([
    "ADMIN_ROLE",
    ()=>ADMIN_ROLE,
    "CLIENT_ROLE",
    ()=>CLIENT_ROLE,
    "EMPTY_PERMISSION_DATA",
    ()=>EMPTY_PERMISSION_DATA,
    "MEMBER_ROLE",
    ()=>MEMBER_ROLE,
    "SUPER_ADMIN_ROLE",
    ()=>SUPER_ADMIN_ROLE,
    "SURFACES",
    ()=>SURFACES,
    "accessibleSurfaces",
    ()=>accessibleSurfaces,
    "getLandingPath",
    ()=>getLandingPath,
    "hasPathMatch",
    ()=>hasPathMatch,
    "hasSurfaceAccess",
    ()=>hasSurfaceAccess,
    "resolveSurface",
    ()=>resolveSurface
]);
const SURFACES = [
    {
        surface: 'admin',
        prefix: '/',
        home: '/dashboard',
        priority: 0,
        label: 'Admin Portal'
    },
    {
        surface: 'client',
        prefix: '/client',
        home: '/client/projects',
        priority: 1,
        label: 'Client Portal'
    }
];
const SUPER_ADMIN_ROLE = 'super-admin';
const ADMIN_ROLE = 'admin';
const CLIENT_ROLE = 'client';
const MEMBER_ROLE = 'member';
/**
 * Roles that map directly to a surface (or are reserved) and therefore must
 * never be treated as custom admin-surface roles, even if a row with the same
 * name ends up in the permissions table.
 */ const NON_CUSTOM_ROLES = new Set([
    SUPER_ADMIN_ROLE,
    ADMIN_ROLE,
    CLIENT_ROLE,
    MEMBER_ROLE
]);
const EMPTY_PERMISSION_DATA = {
    permissions: {},
    customRoleNames: []
};
function matchesPrefix(pathname, prefix) {
    if (prefix === '/') {
        return true;
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
function resolveSurface(pathname) {
    const byPrefixLength = [
        ...SURFACES
    ].sort((a, b)=>b.prefix.length - a.prefix.length);
    const match = byPrefixLength.find((s)=>matchesPrefix(pathname, s.prefix));
    if (!match) {
        throw new Error('No surface registered for the root prefix');
    }
    return match;
}
function customRoles(roles, perm) {
    return roles.filter((role)=>!NON_CUSTOM_ROLES.has(role) && perm.customRoleNames.includes(role));
}
function hasSurfaceAccess(surface, roles, perm) {
    switch(surface){
        case 'admin':
            return roles.includes(ADMIN_ROLE) || customRoles(roles, perm).length > 0;
        case 'client':
            return roles.includes(CLIENT_ROLE);
        default:
            return false;
    }
}
function accessibleSurfaces(roles, perm) {
    return SURFACES.filter((s)=>hasSurfaceAccess(s.surface, roles, perm)).sort((a, b)=>a.priority - b.priority);
}
/** First path granted to the user's custom roles, for landing purposes. */ function firstGrantedPath(roles, perm) {
    const paths = new Set();
    for (const role of customRoles(roles, perm)){
        for (const path of perm.permissions[role]?.paths ?? []){
            paths.add(path);
        }
    }
    return [
        ...paths
    ].sort()[0] ?? null;
}
function getLandingPath(roles, perm) {
    for (const surface of accessibleSurfaces(roles, perm)){
        if (surface.surface === 'admin' && !roles.includes(ADMIN_ROLE)) {
            const granted = firstGrantedPath(roles, perm);
            if (granted) {
                return granted;
            }
            continue;
        }
        return surface.home;
    }
    return null;
}
function hasPathMatch(pathname, allowedPath) {
    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
}
}),
"[project]/apps/app/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/clerkClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$nextjs$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/nextjs/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/config/roles.ts [middleware] (ecmascript)");
;
;
;
;
;
async function getUserRoles(sessionClaims, userId) {
    const metadataRoles = sessionClaims?.metadata;
    if (Array.isArray(metadataRoles?.roles) && metadataRoles.roles.length > 0) {
        return metadataRoles.roles;
    }
    if (!userId) {
        return [];
    }
    try {
        const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clerkClient"])();
        const user = await client.users.getUser(userId);
        const roles = user.publicMetadata?.roles;
        return Array.isArray(roles) && roles.length > 0 ? roles : [
            'member'
        ];
    } catch  {
        return [
            'member'
        ];
    }
}
const isPublicRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteMatcher"])([
    '/sign-in(.*)',
    '/error'
]);
let permissionsCache = null;
const CACHE_TTL_MS = 60_000;
async function getPermissionData() {
    if (permissionsCache && Date.now() - permissionsCache.timestamp < CACHE_TTL_MS) {
        return {
            permissions: permissionsCache.permissions,
            customRoleNames: permissionsCache.customRoleNames
        };
    }
    try {
        const permissions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$nextjs$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["fetchQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["api"].permissions.list.list, {});
        const customRoleNames = Object.keys(permissions).sort();
        permissionsCache = {
            permissions,
            customRoleNames,
            timestamp: Date.now()
        };
        return {
            permissions,
            customRoleNames
        };
    } catch (err) {
        console.log('[proxy] getPermissionData: Convex fetch failed', {
            error: err instanceof Error ? err.message : String(err)
        });
        // Don't cache failures - retry on next request
        return {
            permissions: {},
            customRoleNames: []
        };
    }
}
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clerkMiddleware"])(async (auth, req)=>{
    if (isPublicRoute(req)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    await auth.protect();
    const { sessionClaims, userId } = await auth();
    const roles = await getUserRoles(sessionClaims, userId);
    const permissionData = await getPermissionData();
    const pathname = req.nextUrl.pathname;
    const errorUrl = new URL('/error?error=arbitrary_octopus', req.url);
    // Root: send the user to the home of their highest-priority surface.
    if (pathname === '/') {
        const landing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["getLandingPath"])(roles, permissionData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(landing ? new URL(landing, req.url) : errorUrl);
    }
    // Surface gate: the path must belong to a surface the user's roles allow.
    // A legitimate user on the wrong surface is sent to their own home; only
    // users with no surface at all see the error page.
    const surface = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resolveSurface"])(pathname);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["hasSurfaceAccess"])(surface.surface, roles, permissionData)) {
        const landing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["getLandingPath"])(roles, permissionData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(landing ? new URL(landing, req.url) : errorUrl);
    }
    // Admin surface, non-admin custom roles: path must be granted explicitly.
    if (surface.surface === 'admin' && !roles.includes(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["ADMIN_ROLE"])) {
        const allowedPaths = new Set();
        for (const role of roles){
            const permission = permissionData.permissions[role];
            if (!permission) {
                continue;
            }
            for (const path of permission.paths){
                allowedPaths.add(path);
            }
        }
        const hasPathAccess = [
            ...allowedPaths
        ].some((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["hasPathMatch"])(pathname, p));
        if (!hasPathAccess) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(errorUrl);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
});
const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|mjs|pdf|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6b4799d4._.js.map