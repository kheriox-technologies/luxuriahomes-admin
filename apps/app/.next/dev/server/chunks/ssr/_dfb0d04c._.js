module.exports = [
"[project]/node_modules/next/dist/shared/lib/action-revalidation-kind.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ActionDidNotRevalidate: null,
    ActionDidRevalidateDynamicOnly: null,
    ActionDidRevalidateStaticAndDynamic: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ActionDidNotRevalidate: function() {
        return ActionDidNotRevalidate;
    },
    ActionDidRevalidateDynamicOnly: function() {
        return ActionDidRevalidateDynamicOnly;
    },
    ActionDidRevalidateStaticAndDynamic: function() {
        return ActionDidRevalidateStaticAndDynamic;
    }
});
const ActionDidNotRevalidate = 0;
const ActionDidRevalidateStaticAndDynamic = 1;
const ActionDidRevalidateDynamicOnly = 2; //# sourceMappingURL=action-revalidation-kind.js.map
}),
"[project]/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MutableRequestCookiesAdapter: null,
    ReadonlyRequestCookiesError: null,
    RequestCookiesAdapter: null,
    appendMutableCookies: null,
    areCookiesMutableInCurrentPhase: null,
    createCookiesWithMutableAccessCheck: null,
    getModifiedCookieValues: null,
    responseCookiesToRequestCookies: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MutableRequestCookiesAdapter: function() {
        return MutableRequestCookiesAdapter;
    },
    ReadonlyRequestCookiesError: function() {
        return ReadonlyRequestCookiesError;
    },
    RequestCookiesAdapter: function() {
        return RequestCookiesAdapter;
    },
    appendMutableCookies: function() {
        return appendMutableCookies;
    },
    areCookiesMutableInCurrentPhase: function() {
        return areCookiesMutableInCurrentPhase;
    },
    createCookiesWithMutableAccessCheck: function() {
        return createCookiesWithMutableAccessCheck;
    },
    getModifiedCookieValues: function() {
        return getModifiedCookieValues;
    },
    responseCookiesToRequestCookies: function() {
        return responseCookiesToRequestCookies;
    }
});
const _cookies = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/cookies.js [app-rsc] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _actionrevalidationkind = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/action-revalidation-kind.js [app-rsc] (ecmascript)");
class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super('Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options');
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'clear':
                    case 'delete':
                    case 'set':
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for('next.mutated.cookies');
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new _cookies.ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookies = new _cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookies.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            // TODO-APP: change method of getting workStore
            const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
            if (workStore) {
                workStore.pathWasRevalidated = _actionrevalidationkind.ActionDidRevalidateStaticAndDynamic;
            }
            const allCookies = responseCookies.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        const wrappedCookies = new Proxy(responseCookies, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case 'delete':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case 'set':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.set(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        return wrappedCookies;
    }
}
function createCookiesWithMutableAccessCheck(requestStore) {
    const wrappedCookies = new Proxy(requestStore.mutableCookies, {
        get (target, prop, receiver) {
            switch(prop){
                case 'delete':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().delete');
                        target.delete(...args);
                        return wrappedCookies;
                    };
                case 'set':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().set');
                        target.set(...args);
                        return wrappedCookies;
                    };
                default:
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
        }
    });
    return wrappedCookies;
}
function areCookiesMutableInCurrentPhase(requestStore) {
    return requestStore.phase === 'action';
}
/** Ensure that cookies() starts throwing on mutation
 * if we changed phases and can no longer mutate.
 *
 * This can happen when going:
 *   'render' -> 'after'
 *   'action' -> 'render'
 * */ function ensureCookiesAreStillMutable(requestStore, _callingExpression) {
    if (!areCookiesMutableInCurrentPhase(requestStore)) {
        // TODO: maybe we can give a more precise error message based on callingExpression?
        throw new ReadonlyRequestCookiesError();
    }
}
function responseCookiesToRequestCookies(responseCookies) {
    const requestCookies = new _cookies.RequestCookies(new Headers());
    for (const cookie of responseCookies.getAll()){
        requestCookies.set(cookie);
    }
    return requestCookies;
} //# sourceMappingURL=request-cookies.js.map
}),
"[project]/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDedupedByCallsiteServerErrorLoggerDev", {
    enumerable: true,
    get: function() {
        return createDedupedByCallsiteServerErrorLoggerDev;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(__turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const errorRef = {
    current: null
};
// React.cache is currently only available in canary/experimental React channels.
const cache = typeof _react.cache === 'function' ? _react.cache : (fn)=>fn;
// When Cache Components is enabled, we record these as errors so that they
// are captured by the dev overlay as it's more critical to fix these
// when enabled.
const logErrorOrWarn = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : console.warn;
// We don't want to dedupe across requests.
// The developer might've just attempted to fix the warning so we should warn again if it still happens.
const flushCurrentErrorIfNew = cache((key)=>{
    try {
        logErrorOrWarn(errorRef.current);
    } finally{
        errorRef.current = null;
    }
});
function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
    return function logDedupedError(...args) {
        const message = getMessage(...args);
        if ("TURBOPACK compile-time truthy", 1) {
            var _stack;
            const callStackFrames = (_stack = new Error().stack) == null ? void 0 : _stack.split('\n');
            if (callStackFrames === undefined || callStackFrames.length < 4) {
                logErrorOrWarn(message);
            } else {
                // Error:
                //   logDedupedError
                //   asyncApiBeingAccessedSynchronously
                //   <userland callsite>
                // TODO: This breaks if sourcemaps with ignore lists are enabled.
                const key = callStackFrames[4];
                errorRef.current = message;
                flushCurrentErrorIfNew(key);
            }
        } else //TURBOPACK unreachable
        ;
    };
} //# sourceMappingURL=create-deduped-by-callsite-server-error-logger.js.map
}),
"[project]/node_modules/next/dist/server/request/cookies.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cookies", {
    enumerable: true,
    get: function() {
        return cookies;
    }
});
const _requestcookies = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-rsc] (ecmascript)");
const _cookies = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/cookies.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/server/request/utils.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)");
function cookies() {
    const callingExpression = 'cookies';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        if (workUnitStore && workUnitStore.phase === 'after' && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E843",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.forceStatic) {
            // When using forceStatic we override all other logic and always just return an empty
            // cookies object without tracking
            const underlyingCookies = createEmptyCookies();
            return makeUntrackedCookies(underlyingCookies);
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E849",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                    const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                        value: "E831",
                        enumerable: false,
                        configurable: true
                    });
                    Error.captureStackTrace(error, cookies);
                    workStore.invalidDynamicUsageError ??= error;
                    throw error;
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E846",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                    return makeHangingCookies(workStore, workUnitStore);
                case 'prerender-client':
                    const exportName = '`cookies`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a Client Component. Next.js should be preventing ${exportName} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E832",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    // We need track dynamic access here eagerly to keep continuity with
                    // how cookies has worked in PPR without cacheComponents.
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, callingExpression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    // We track dynamic access here so we don't need to wrap the cookies
                    // in individual property access tracking.
                    return (0, _dynamicrendering.throwToInterruptStaticGeneration)(callingExpression, workStore, workUnitStore);
                case 'prerender-runtime':
                    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, makeUntrackedCookies(workUnitStore.cookies));
                case 'private-cache':
                    // Private caches are delayed until the runtime stage in use-cache-wrapper,
                    // so we don't need an additional delay here.
                    return makeUntrackedCookies(workUnitStore.cookies);
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    let underlyingCookies;
                    if ((0, _requestcookies.areCookiesMutableInCurrentPhase)(workUnitStore)) {
                        // We can't conditionally return different types here based on the context.
                        // To avoid confusion, we always return the readonly type here.
                        underlyingCookies = workUnitStore.userspaceMutableCookies;
                    } else {
                        underlyingCookies = workUnitStore.cookies;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Semantically we only need the dev tracking when running in `next dev`
                        // but since you would never use next dev with production NODE_ENV we use this
                        // as a proxy so we can statically exclude this code from production builds.
                        return makeUntrackedCookiesWithDevWarnings(workUnitStore, underlyingCookies, workStore == null ? void 0 : workStore.route);
                    } else //TURBOPACK unreachable
                    ;
                default:
                    workUnitStore;
            }
        }
    }
    // If we end up here, there was no work store or work unit store present.
    (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
}
function createEmptyCookies() {
    return _requestcookies.RequestCookiesAdapter.seal(new _cookies.RequestCookies(new Headers({})));
}
const CachedCookies = new WeakMap();
function makeHangingCookies(workStore, prerenderStore) {
    const cachedPromise = CachedCookies.get(prerenderStore);
    if (cachedPromise) {
        return cachedPromise;
    }
    const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`cookies()`');
    CachedCookies.set(prerenderStore, promise);
    return promise;
}
function makeUntrackedCookies(underlyingCookies) {
    const cachedCookies = CachedCookies.get(underlyingCookies);
    if (cachedCookies) {
        return cachedCookies;
    }
    const promise = Promise.resolve(underlyingCookies);
    CachedCookies.set(underlyingCookies, promise);
    return promise;
}
function makeUntrackedCookiesWithDevWarnings(requestStore, underlyingCookies, route) {
    if (requestStore.asyncApiPromises) {
        let promise;
        if (underlyingCookies === requestStore.mutableCookies) {
            promise = requestStore.asyncApiPromises.mutableCookies;
        } else if (underlyingCookies === requestStore.cookies) {
            promise = requestStore.asyncApiPromises.cookies;
        } else {
            throw Object.defineProperty(new _invarianterror.InvariantError('Received an underlying cookies object that does not match either `cookies` or `mutableCookies`'), "__NEXT_ERROR_CODE", {
                value: "E890",
                enumerable: false,
                configurable: true
            });
        }
        return instrumentCookiesPromiseWithDevWarnings(promise, route);
    }
    const cachedCookies = CachedCookies.get(underlyingCookies);
    if (cachedCookies) {
        return cachedCookies;
    }
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingCookies, requestStore, _stagedrendering.RenderStage.Runtime);
    const proxiedPromise = instrumentCookiesPromiseWithDevWarnings(promise, route);
    CachedCookies.set(underlyingCookies, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createCookiesAccessError);
function instrumentCookiesPromiseWithDevWarnings(promise, route) {
    Object.defineProperties(promise, {
        [Symbol.iterator]: replaceableWarningDescriptorForSymbolIterator(promise, route),
        size: replaceableWarningDescriptor(promise, 'size', route),
        get: replaceableWarningDescriptor(promise, 'get', route),
        getAll: replaceableWarningDescriptor(promise, 'getAll', route),
        has: replaceableWarningDescriptor(promise, 'has', route),
        set: replaceableWarningDescriptor(promise, 'set', route),
        delete: replaceableWarningDescriptor(promise, 'delete', route),
        clear: replaceableWarningDescriptor(promise, 'clear', route),
        toString: replaceableWarningDescriptor(promise, 'toString', route)
    });
    return promise;
}
function replaceableWarningDescriptor(target, prop, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, `\`cookies().${prop}\``);
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, prop, {
                value,
                writable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function replaceableWarningDescriptorForSymbolIterator(target, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, '`...cookies()` or similar iteration');
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, Symbol.iterator, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function createCookiesAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E830",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=cookies.js.map
}),
"[project]/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HeadersAdapter: null,
    ReadonlyHeadersError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HeadersAdapter: function() {
        return HeadersAdapter;
    },
    ReadonlyHeadersError: function() {
        return ReadonlyHeadersError;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
class ReadonlyHeadersError extends Error {
    constructor(){
        super('Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers');
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === 'undefined') return;
                // If the original casing exists, return the value.
                return _reflect.ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return _reflect.ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === 'undefined') return false;
                // If the original casing exists, return true.
                return _reflect.ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === 'undefined') return true;
                // If the original casing exists, delete the property.
                return _reflect.ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'append':
                    case 'delete':
                    case 'set':
                        return ReadonlyHeadersError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(', ');
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === 'string') {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== 'undefined') return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== 'undefined';
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map
}),
"[project]/node_modules/next/dist/server/request/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "headers", {
    enumerable: true,
    get: function() {
        return headers;
    }
});
const _headers = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/server/request/utils.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)");
function headers() {
    const callingExpression = 'headers';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        if (workUnitStore && workUnitStore.phase === 'after' && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E839",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.forceStatic) {
            // When using forceStatic we override all other logic and always just return an empty
            // headers object without tracking
            const underlyingHeaders = _headers.HeadersAdapter.seal(new Headers({}));
            return makeUntrackedHeaders(underlyingHeaders);
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E833",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, headers);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E838",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                case 'prerender-client':
                case 'private-cache':
                case 'prerender-runtime':
                case 'prerender-ppr':
                case 'prerender-legacy':
                case 'request':
                    break;
                default:
                    workUnitStore;
            }
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E828",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'prerender':
                    return makeHangingHeaders(workStore, workUnitStore);
                case 'prerender-client':
                    const exportName = '`headers`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a client component. Next.js should be preventing ${exportName} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E693",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    // PPR Prerender (no cacheComponents)
                    // We are prerendering with PPR. We need track dynamic access here eagerly
                    // to keep continuity with how headers has worked in PPR without cacheComponents.
                    // TODO consider switching the semantic to throw on property access instead
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, callingExpression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    // Legacy Prerender
                    // We are in a legacy static generation mode while prerendering
                    // We track dynamic access here so we don't need to wrap the headers in
                    // individual property access tracking.
                    return (0, _dynamicrendering.throwToInterruptStaticGeneration)(callingExpression, workStore, workUnitStore);
                case 'prerender-runtime':
                    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, makeUntrackedHeaders(workUnitStore.headers));
                case 'private-cache':
                    // Private caches are delayed until the runtime stage in use-cache-wrapper,
                    // so we don't need an additional delay here.
                    return makeUntrackedHeaders(workUnitStore.headers);
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Semantically we only need the dev tracking when running in `next dev`
                        // but since you would never use next dev with production NODE_ENV we use this
                        // as a proxy so we can statically exclude this code from production builds.
                        return makeUntrackedHeadersWithDevWarnings(workUnitStore.headers, workStore == null ? void 0 : workStore.route, workUnitStore);
                    } else //TURBOPACK unreachable
                    ;
                    //TURBOPACK unreachable
                    ;
                default:
                    workUnitStore;
            }
        }
    }
    // If we end up here, there was no work store or work unit store present.
    (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
}
const CachedHeaders = new WeakMap();
function makeHangingHeaders(workStore, prerenderStore) {
    const cachedHeaders = CachedHeaders.get(prerenderStore);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`headers()`');
    CachedHeaders.set(prerenderStore, promise);
    return promise;
}
function makeUntrackedHeaders(underlyingHeaders) {
    const cachedHeaders = CachedHeaders.get(underlyingHeaders);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = Promise.resolve(underlyingHeaders);
    CachedHeaders.set(underlyingHeaders, promise);
    return promise;
}
function makeUntrackedHeadersWithDevWarnings(underlyingHeaders, route, requestStore) {
    if (requestStore.asyncApiPromises) {
        const promise = requestStore.asyncApiPromises.headers;
        return instrumentHeadersPromiseWithDevWarnings(promise, route);
    }
    const cachedHeaders = CachedHeaders.get(underlyingHeaders);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingHeaders, requestStore, _stagedrendering.RenderStage.Runtime);
    const proxiedPromise = instrumentHeadersPromiseWithDevWarnings(promise, route);
    CachedHeaders.set(underlyingHeaders, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createHeadersAccessError);
function instrumentHeadersPromiseWithDevWarnings(promise, route) {
    Object.defineProperties(promise, {
        [Symbol.iterator]: replaceableWarningDescriptorForSymbolIterator(promise, route),
        append: replaceableWarningDescriptor(promise, 'append', route),
        delete: replaceableWarningDescriptor(promise, 'delete', route),
        get: replaceableWarningDescriptor(promise, 'get', route),
        has: replaceableWarningDescriptor(promise, 'has', route),
        set: replaceableWarningDescriptor(promise, 'set', route),
        getSetCookie: replaceableWarningDescriptor(promise, 'getSetCookie', route),
        forEach: replaceableWarningDescriptor(promise, 'forEach', route),
        keys: replaceableWarningDescriptor(promise, 'keys', route),
        values: replaceableWarningDescriptor(promise, 'values', route),
        entries: replaceableWarningDescriptor(promise, 'entries', route)
    });
    return promise;
}
function replaceableWarningDescriptor(target, prop, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, `\`headers().${prop}\``);
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, prop, {
                value,
                writable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function replaceableWarningDescriptorForSymbolIterator(target, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, '`...headers()` or similar iteration');
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, Symbol.iterator, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function createHeadersAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E836",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=headers.js.map
}),
"[project]/node_modules/next/dist/server/request/draft-mode.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "draftMode", {
    enumerable: true,
    get: function() {
        return draftMode;
    }
});
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _hooksservercontext = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/hooks-server-context.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
function draftMode() {
    const callingExpression = 'draftMode';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore || !workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
    }
    switch(workUnitStore.type){
        case 'prerender-runtime':
            // TODO(runtime-ppr): does it make sense to delay this? normally it's always microtasky
            return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, createOrGetCachedDraftMode(workUnitStore.draftMode, workStore));
        case 'request':
            return createOrGetCachedDraftMode(workUnitStore.draftMode, workStore);
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            // Inside of `"use cache"` or `unstable_cache`, draft mode is available if
            // the outmost work unit store is a request store (or a runtime prerender),
            // and if draft mode is enabled.
            const draftModeProvider = (0, _workunitasyncstorageexternal.getDraftModeProviderForCacheScope)(workStore, workUnitStore);
            if (draftModeProvider) {
                return createOrGetCachedDraftMode(draftModeProvider, workStore);
            }
        // Otherwise, we fall through to providing an empty draft mode.
        // eslint-disable-next-line no-fallthrough
        case 'prerender':
        case 'prerender-client':
        case 'prerender-ppr':
        case 'prerender-legacy':
            // Return empty draft mode
            return createOrGetCachedDraftMode(null, workStore);
        default:
            return workUnitStore;
    }
}
function createOrGetCachedDraftMode(draftModeProvider, workStore) {
    const cacheKey = draftModeProvider ?? NullDraftMode;
    const cachedDraftMode = CachedDraftModes.get(cacheKey);
    if (cachedDraftMode) {
        return cachedDraftMode;
    }
    if (("TURBOPACK compile-time value", "development") === 'development' && !(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
        const route = workStore == null ? void 0 : workStore.route;
        return createDraftModeWithDevWarnings(draftModeProvider, route);
    } else {
        return Promise.resolve(new DraftMode(draftModeProvider));
    }
}
const NullDraftMode = {};
const CachedDraftModes = new WeakMap();
function createDraftModeWithDevWarnings(underlyingProvider, route) {
    const instance = new DraftMode(underlyingProvider);
    const promise = Promise.resolve(instance);
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            switch(prop){
                case 'isEnabled':
                    warnForSyncAccess(route, `\`draftMode().${prop}\``);
                    break;
                case 'enable':
                case 'disable':
                    {
                        warnForSyncAccess(route, `\`draftMode().${prop}()\``);
                        break;
                    }
                default:
                    {
                    // We only warn for well-defined properties of the draftMode object.
                    }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        }
    });
    return proxiedPromise;
}
class DraftMode {
    constructor(provider){
        this._provider = provider;
    }
    get isEnabled() {
        if (this._provider !== null) {
            return this._provider.isEnabled;
        }
        return false;
    }
    enable() {
        // We have a store we want to track dynamic data access to ensure we
        // don't statically generate routes that manipulate draft mode.
        trackDynamicDraftMode('draftMode().enable()', this.enable);
        if (this._provider !== null) {
            this._provider.enable();
        }
    }
    disable() {
        trackDynamicDraftMode('draftMode().disable()', this.disable);
        if (this._provider !== null) {
            this._provider.disable();
        }
    }
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createDraftModeAccessError);
function createDraftModeAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E835",
        enumerable: false,
        configurable: true
    });
}
function trackDynamicDraftMode(expression, constructorOpt) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        // We have a store we want to track dynamic data access to ensure we
        // don't statically generate routes that manipulate draft mode.
        if ((workUnitStore == null ? void 0 : workUnitStore.phase) === 'after') {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside \`after()\`. The enabled status of \`draftMode()\` can be read inside \`after()\` but you cannot enable or disable \`draftMode()\`. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E845",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E553",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                case 'private-cache':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside "use cache". The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E829",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, constructorOpt);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside a function cached with \`unstable_cache()\`. The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E844",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                case 'prerender-runtime':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used ${expression} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`), "__NEXT_ERROR_CODE", {
                            value: "E126",
                            enumerable: false,
                            configurable: true
                        });
                        return (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(workStore.route, expression, error, workUnitStore);
                    }
                case 'prerender-client':
                    const exportName = '`draftMode`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a Client Component. Next.js should be preventing ${exportName} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E832",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    workUnitStore.revalidate = 0;
                    const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${workStore.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                        value: "E558",
                        enumerable: false,
                        configurable: true
                    });
                    workStore.dynamicUsageDescription = expression;
                    workStore.dynamicUsageStack = err.stack;
                    throw err;
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    break;
                default:
                    workUnitStore;
            }
        }
    }
} //# sourceMappingURL=draft-mode.js.map
}),
"[project]/node_modules/next/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports.cookies = __turbopack_context__.r("[project]/node_modules/next/dist/server/request/cookies.js [app-rsc] (ecmascript)").cookies;
module.exports.headers = __turbopack_context__.r("[project]/node_modules/next/dist/server/request/headers.js [app-rsc] (ecmascript)").headers;
module.exports.draftMode = __turbopack_context__.r("[project]/node_modules/next/dist/server/request/draft-mode.js [app-rsc] (ecmascript)").draftMode;
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00b3da01bc6fabac667292638710c7e9927debf754":"invalidateCacheAction"},"",""] */ __turbopack_context__.s([
    "invalidateCacheAction",
    ()=>invalidateCacheAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function invalidateCacheAction() {
    void (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).delete(`__clerk_invalidate_cache_cookie_${Date.now()}`);
}
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    invalidateCacheAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(invalidateCacheAction, "00b3da01bc6fabac667292638710c7e9927debf754", null);
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/server/keyless.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getKeylessCookieName",
    ()=>getKeylessCookieName,
    "getKeylessCookieValue",
    ()=>getKeylessCookieValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/utils/feature-flags.js [app-rsc] (ecmascript)");
;
;
const keylessCookiePrefix = `__clerk_keys_`;
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
    return hashHex.slice(0, 16);
}
async function getKeylessCookieName() {
    const PATH = process.env.PWD;
    if (!PATH) {
        return `${keylessCookiePrefix}${0}`;
    }
    const lastThreeDirs = PATH.split("/").filter(Boolean).slice(-3).reverse().join("/");
    const hash = await hashString(lastThreeDirs);
    return `${keylessCookiePrefix}${hash}`;
}
async function getKeylessCookieValue(getter) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canUseKeyless"]) {
        return void 0;
    }
    const keylessCookieName = await getKeylessCookieName();
    let keyless;
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            keyless = JSON.parse(getter(keylessCookieName) || "{}");
        }
    } catch  {
        keyless = void 0;
    }
    return keyless;
}
;
 //# sourceMappingURL=keyless.js.map
}),
"[project]/node_modules/@clerk/shared/dist/runtime/keyless/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clerkDevelopmentCache",
    ()=>clerkDevelopmentCache,
    "createClerkDevCache",
    ()=>createClerkDevCache,
    "createConfirmationMessage",
    ()=>createConfirmationMessage,
    "createKeylessModeMessage",
    ()=>createKeylessModeMessage,
    "createKeylessService",
    ()=>createKeylessService,
    "createNodeFileStorage",
    ()=>createNodeFileStorage,
    "resolveKeysWithKeylessFallback",
    ()=>resolveKeysWithKeylessFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$runtimeEnvironment$2d$D1yr0yUs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/runtimeEnvironment-D1yr0yUs.mjs [app-rsc] (ecmascript)");
;
//#region src/keyless/devCache.ts
const THROTTLE_DURATION_MS = 600 * 1e3;
/**
* Creates a development-only cache for keyless mode logging and API calls.
* This prevents console spam and duplicate API requests.
*
* @returns The cache instance or undefined in non-development environments
*/ function createClerkDevCache() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$runtimeEnvironment$2d$D1yr0yUs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["t"])()) return;
    if (!globalThis.__clerk_internal_keyless_logger) globalThis.__clerk_internal_keyless_logger = {
        __cache: /* @__PURE__ */ new Map(),
        log: function({ cacheKey, msg }) {
            if (this.__cache.has(cacheKey) && Date.now() < (this.__cache.get(cacheKey)?.expiresAt || 0)) return;
            console.log(msg);
            this.__cache.set(cacheKey, {
                expiresAt: Date.now() + THROTTLE_DURATION_MS
            });
        },
        run: async function(callback, { cacheKey, onSuccessStale = THROTTLE_DURATION_MS, onErrorStale = THROTTLE_DURATION_MS }) {
            if (this.__cache.has(cacheKey) && Date.now() < (this.__cache.get(cacheKey)?.expiresAt || 0)) return this.__cache.get(cacheKey)?.data;
            try {
                const result = await callback();
                this.__cache.set(cacheKey, {
                    expiresAt: Date.now() + onSuccessStale,
                    data: result
                });
                return result;
            } catch (e) {
                this.__cache.set(cacheKey, {
                    expiresAt: Date.now() + onErrorStale
                });
                throw e;
            }
        }
    };
    return globalThis.__clerk_internal_keyless_logger;
}
/**
* Creates the console message shown when running in keyless mode.
*
* @param keys - The keyless application keys
* @returns Formatted console message
*/ function createKeylessModeMessage(keys) {
    return `\n\x1b[35m\n[Clerk]:\x1b[0m You are running in keyless mode.\nYou can \x1b[35mclaim your keys\x1b[0m by visiting ${keys.claimUrl}\n`;
}
/**
* Creates the console message shown when keys have been claimed.
*
* @returns Formatted console message
*/ function createConfirmationMessage() {
    return `\n\x1b[35m\n[Clerk]:\x1b[0m Your application is running with your claimed keys.\nYou can safely remove the \x1b[35m.clerk/\x1b[0m from your project.\n`;
}
/**
* Shared singleton instance of the development cache.
*/ const clerkDevelopmentCache = createClerkDevCache();
//#endregion
//#region src/keyless/nodeFileStorage.ts
const CLERK_HIDDEN = ".clerk";
const CLERK_LOCK = "clerk.lock";
const TEMP_DIR_NAME = ".tmp";
const CONFIG_FILE = "keyless.json";
const README_FILE = "README.md";
/**
* Creates a file-based storage adapter for keyless mode.
* This is used by Node.js-based frameworks (Next.js, TanStack Start, etc.)
* to persist keyless configuration to the file system.
*
* @param fs - Node.js fs module or compatible adapter
* @param path - Node.js path module or compatible adapter
* @param options - Configuration options
* @returns A KeylessStorage implementation
*/ function createNodeFileStorage(fs, path, options = {}) {
    const { cwd = ()=>process.cwd(), frameworkPackageName = "@clerk/shared" } = options;
    let inMemoryLock = false;
    const getClerkDir = ()=>path.join(cwd(), CLERK_HIDDEN);
    const getTempDir = ()=>path.join(getClerkDir(), TEMP_DIR_NAME);
    const getConfigPath = ()=>path.join(getTempDir(), CONFIG_FILE);
    const getReadmePath = ()=>path.join(getTempDir(), README_FILE);
    const getLockPath = ()=>path.join(cwd(), CLERK_LOCK);
    const isLocked = ()=>inMemoryLock || fs.existsSync(getLockPath());
    const lock = ()=>{
        if (isLocked()) return false;
        inMemoryLock = true;
        try {
            fs.writeFileSync(getLockPath(), "This file can be deleted if your app is stuck.", {
                encoding: "utf8",
                mode: 420
            });
            return true;
        } catch  {
            inMemoryLock = false;
            return false;
        }
    };
    const unlock = ()=>{
        inMemoryLock = false;
        try {
            if (fs.existsSync(getLockPath())) fs.rmSync(getLockPath(), {
                force: true
            });
        } catch  {}
    };
    const ensureDirectoryExists = ()=>{
        const tempDir = getTempDir();
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, {
            recursive: true
        });
    };
    const updateGitignore = ()=>{
        const gitignorePath = path.join(cwd(), ".gitignore");
        const entry = `/${CLERK_HIDDEN}/`;
        if (!fs.existsSync(gitignorePath)) fs.writeFileSync(gitignorePath, "", {
            encoding: "utf8",
            mode: 420
        });
        if (!fs.readFileSync(gitignorePath, {
            encoding: "utf-8"
        }).includes(entry)) fs.appendFileSync(gitignorePath, `\n# clerk configuration (can include secrets)\n${entry}\n`);
    };
    const writeReadme = ()=>{
        const readme = `## DO NOT COMMIT
This directory is auto-generated from \`${frameworkPackageName}\` because you are running in Keyless mode.
Avoid committing the \`.clerk/\` directory as it includes the secret key of the unclaimed instance.
`;
        fs.writeFileSync(getReadmePath(), readme, {
            encoding: "utf8",
            mode: 384
        });
    };
    return {
        read () {
            try {
                if (!fs.existsSync(getConfigPath())) return "";
                return fs.readFileSync(getConfigPath(), {
                    encoding: "utf-8"
                });
            } catch  {
                return "";
            }
        },
        write (data) {
            if (!lock()) return;
            try {
                ensureDirectoryExists();
                updateGitignore();
                writeReadme();
                fs.writeFileSync(getConfigPath(), data, {
                    encoding: "utf8",
                    mode: 384
                });
            } finally{
                unlock();
            }
        },
        remove () {
            if (!lock()) return;
            try {
                if (fs.existsSync(getClerkDir())) fs.rmSync(getClerkDir(), {
                    recursive: true,
                    force: true
                });
            } finally{
                unlock();
            }
        }
    };
}
//#endregion
//#region src/keyless/service.ts
/**
* Creates metadata headers for the keyless service.
*/ function createMetadataHeaders(framework, frameworkVersion) {
    const headers = new Headers();
    if (framework) headers.set("Clerk-Framework", framework);
    if (frameworkVersion) headers.set("Clerk-Framework-Version", frameworkVersion);
    return headers;
}
/**
* Creates a keyless service that handles accountless application creation and storage.
* This provides a simple API for frameworks to integrate keyless mode.
*
* @param options - Configuration for the service including storage and API adapters
* @returns A keyless service instance
*
* @example
* ```ts
* import { createKeylessService } from '@clerk/shared/keyless';
*
* const keylessService = createKeylessService({
*   storage: createFileStorage(),
*   api: createKeylessAPI({ secretKey }),
*   framework: 'TanStack Start',
* });
*
* const keys = await keylessService.getOrCreateKeys(request);
* if (keys) {
*   console.log('Publishable Key:', keys.publishableKey);
* }
* ```
*/ function createKeylessService(options) {
    const { storage, api, framework, frameworkVersion } = options;
    let hasLoggedKeylessMessage = false;
    const safeParseConfig = ()=>{
        try {
            const data = storage.read();
            if (!data) return;
            return JSON.parse(data);
        } catch  {
            return;
        }
    };
    return {
        async getOrCreateKeys () {
            const existingConfig = safeParseConfig();
            if (existingConfig?.publishableKey && existingConfig?.secretKey) return existingConfig;
            const headers = createMetadataHeaders(framework, frameworkVersion);
            const accountlessApplication = await api.createAccountlessApplication(headers);
            if (accountlessApplication) storage.write(JSON.stringify(accountlessApplication));
            return accountlessApplication;
        },
        readKeys () {
            return safeParseConfig();
        },
        removeKeys () {
            storage.remove();
        },
        async completeOnboarding () {
            const headers = createMetadataHeaders(framework, frameworkVersion);
            return api.completeOnboarding(headers);
        },
        logKeylessMessage (claimUrl) {
            if (!hasLoggedKeylessMessage) {
                hasLoggedKeylessMessage = true;
                console.log(`[Clerk]: Running in keyless mode. Claim your keys at: ${claimUrl}`);
            }
        },
        async resolveKeysWithKeylessFallback (configuredPublishableKey, configuredSecretKey) {
            let publishableKey = configuredPublishableKey;
            let secretKey = configuredSecretKey;
            let claimUrl;
            let apiKeysUrl;
            try {
                const locallyStoredKeys = safeParseConfig();
                if (Boolean(configuredPublishableKey) && configuredPublishableKey === locallyStoredKeys?.publishableKey && locallyStoredKeys) {
                    try {
                        await clerkDevelopmentCache?.run(()=>this.completeOnboarding(), {
                            cacheKey: `${locallyStoredKeys.publishableKey}_complete`,
                            onSuccessStale: 1440 * 60 * 1e3
                        });
                    } catch  {}
                    clerkDevelopmentCache?.log({
                        cacheKey: `${locallyStoredKeys.publishableKey}_claimed`,
                        msg: createConfirmationMessage()
                    });
                    return {
                        publishableKey,
                        secretKey,
                        claimUrl,
                        apiKeysUrl
                    };
                }
                if (!publishableKey && !secretKey) {
                    const keylessApp = await this.getOrCreateKeys();
                    if (keylessApp) {
                        publishableKey = keylessApp.publishableKey;
                        secretKey = keylessApp.secretKey;
                        claimUrl = keylessApp.claimUrl;
                        apiKeysUrl = keylessApp.apiKeysUrl;
                        clerkDevelopmentCache?.log({
                            cacheKey: keylessApp.publishableKey,
                            msg: createKeylessModeMessage(keylessApp)
                        });
                    }
                }
            } catch  {}
            return {
                publishableKey,
                secretKey,
                claimUrl,
                apiKeysUrl
            };
        }
    };
}
//#endregion
//#region src/keyless/resolveKeysWithKeylessFallback.ts
/**
* Resolves Clerk keys, falling back to keyless mode in development if configured keys are missing.
*
* @param configuredPublishableKey - The publishable key from options or environment
* @param configuredSecretKey - The secret key from options or environment
* @param keylessService - The keyless service instance (or null if unavailable)
* @param canUseKeyless - Whether keyless mode is enabled in the current environment
* @returns The resolved keys (either configured or from keyless mode)
*/ async function resolveKeysWithKeylessFallback(configuredPublishableKey, configuredSecretKey, keylessService, canUseKeyless) {
    let publishableKey = configuredPublishableKey;
    let secretKey = configuredSecretKey;
    let claimUrl;
    let apiKeysUrl;
    if (!canUseKeyless) return {
        publishableKey,
        secretKey,
        claimUrl,
        apiKeysUrl
    };
    if (!keylessService) return {
        publishableKey,
        secretKey,
        claimUrl,
        apiKeysUrl
    };
    try {
        const locallyStoredKeys = keylessService.readKeys();
        if (Boolean(configuredPublishableKey) && configuredPublishableKey === locallyStoredKeys?.publishableKey && locallyStoredKeys) {
            try {
                await clerkDevelopmentCache?.run(()=>keylessService.completeOnboarding(), {
                    cacheKey: `${locallyStoredKeys.publishableKey}_complete`,
                    onSuccessStale: 1440 * 60 * 1e3
                });
            } catch  {}
            clerkDevelopmentCache?.log({
                cacheKey: `${locallyStoredKeys.publishableKey}_claimed`,
                msg: createConfirmationMessage()
            });
            return {
                publishableKey,
                secretKey,
                claimUrl,
                apiKeysUrl
            };
        }
        if (!publishableKey && !secretKey) {
            const keylessApp = await keylessService.getOrCreateKeys();
            if (keylessApp) {
                publishableKey = keylessApp.publishableKey;
                secretKey = keylessApp.secretKey;
                claimUrl = keylessApp.claimUrl;
                apiKeysUrl = keylessApp.apiKeysUrl;
                clerkDevelopmentCache?.log({
                    cacheKey: keylessApp.publishableKey,
                    msg: createKeylessModeMessage(keylessApp)
                });
            }
        }
    } catch  {}
    return {
        publishableKey,
        secretKey,
        claimUrl,
        apiKeysUrl
    };
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/@clerk/shared/dist/runtime/telemetry-DE2JFEBf.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>eventMethodCalled,
    "c",
    ()=>eventPrebuiltComponentOpened,
    "i",
    ()=>eventFrameworkMetadata,
    "l",
    ()=>TelemetryCollector,
    "n",
    ()=>EVENT_THEME_USAGE,
    "o",
    ()=>eventComponentMounted,
    "r",
    ()=>eventThemeUsage,
    "s",
    ()=>eventPrebuiltComponentMounted,
    "t",
    ()=>EVENT_SAMPLING_RATE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keys$2d$DuxzP8MU$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/keys-DuxzP8MU.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$underscore$2d$ClYSgvuy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/underscore-ClYSgvuy.mjs [app-rsc] (ecmascript)");
;
;
//#region src/telemetry/throttler.ts
const DEFAULT_CACHE_TTL_MS = 864e5;
/**
* Manages throttling for telemetry events using a configurable cache implementation
* to mitigate event flooding in frequently executed code paths.
*/ var TelemetryEventThrottler = class {
    #cache;
    #cacheTtl = DEFAULT_CACHE_TTL_MS;
    constructor(cache){
        this.#cache = cache;
    }
    isEventThrottled(payload) {
        const now = Date.now();
        const key = this.#generateKey(payload);
        const entry = this.#cache.getItem(key);
        if (!entry) {
            this.#cache.setItem(key, now);
            return false;
        }
        if (now - entry > this.#cacheTtl) {
            this.#cache.setItem(key, now);
            return false;
        }
        return true;
    }
    /**
	* Generates a consistent unique key for telemetry events by sorting payload properties.
	* This ensures that payloads with identical content in different orders produce the same key.
	*/ #generateKey(event) {
        const { sk: _sk, pk: _pk, payload, ...rest } = event;
        const sanitizedEvent = {
            ...payload,
            ...rest
        };
        return JSON.stringify(Object.keys({
            ...payload,
            ...rest
        }).sort().map((key)=>sanitizedEvent[key]));
    }
};
/**
* LocalStorage-based cache implementation for browser environments.
*/ var LocalStorageThrottlerCache = class {
    #storageKey = "clerk_telemetry_throttler";
    getItem(key) {
        return this.#getCache()[key];
    }
    setItem(key, value) {
        try {
            const cache = this.#getCache();
            cache[key] = value;
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch (err) {
            if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED") && localStorage.length > 0) localStorage.removeItem(this.#storageKey);
        }
    }
    removeItem(key) {
        try {
            const cache = this.#getCache();
            delete cache[key];
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch  {}
    }
    #getCache() {
        try {
            const cacheString = localStorage.getItem(this.#storageKey);
            if (!cacheString) return {};
            return JSON.parse(cacheString);
        } catch  {
            return {};
        }
    }
    static isSupported() {
        return ("TURBOPACK compile-time value", "undefined") !== "undefined" && !!window.localStorage;
    }
};
/**
* In-memory cache implementation for non-browser environments (e.g., React Native).
*/ var InMemoryThrottlerCache = class {
    #cache = /* @__PURE__ */ new Map();
    #maxSize = 1e4;
    getItem(key) {
        if (this.#cache.size > this.#maxSize) {
            this.#cache.clear();
            return;
        }
        return this.#cache.get(key);
    }
    setItem(key, value) {
        this.#cache.set(key, value);
    }
    removeItem(key) {
        this.#cache.delete(key);
    }
};
//#endregion
//#region src/telemetry/collector.ts
/**
* The `TelemetryCollector` class handles collection of telemetry events from Clerk SDKs. Telemetry is opt-out and can be disabled by setting a CLERK_TELEMETRY_DISABLED environment variable.
* The `ClerkProvider` also accepts a `telemetry` prop that will be passed to the collector during initialization:.
*
* ```jsx
* <ClerkProvider telemetry={false}>
*    ...
* </ClerkProvider>
* ```
*
* For more information, please see the telemetry documentation page: https://clerk.com/docs/telemetry.
*/ /**
* Type guard to check if window.Clerk exists and has the expected structure.
*/ function isWindowClerkWithMetadata(clerk) {
    return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
const VALID_LOG_LEVELS = new Set([
    "error",
    "warn",
    "info",
    "debug",
    "trace"
]);
const DEFAULT_CONFIG = {
    samplingRate: 1,
    maxBufferSize: 5,
    endpoint: "https://clerk-telemetry.com"
};
var TelemetryCollector = class {
    #config;
    #eventThrottler;
    #metadata = {};
    #buffer = [];
    #pendingFlush = null;
    constructor(options){
        this.#config = {
            maxBufferSize: options.maxBufferSize ?? DEFAULT_CONFIG.maxBufferSize,
            samplingRate: options.samplingRate ?? DEFAULT_CONFIG.samplingRate,
            perEventSampling: options.perEventSampling ?? true,
            disabled: options.disabled ?? false,
            debug: options.debug ?? false,
            endpoint: DEFAULT_CONFIG.endpoint
        };
        if (!options.clerkVersion && ("TURBOPACK compile-time value", "undefined") === "undefined") this.#metadata.clerkVersion = "";
        else this.#metadata.clerkVersion = options.clerkVersion ?? "";
        this.#metadata.sdk = options.sdk;
        this.#metadata.sdkVersion = options.sdkVersion;
        this.#metadata.publishableKey = options.publishableKey ?? "";
        const parsedKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keys$2d$DuxzP8MU$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["u"])(options.publishableKey);
        if (parsedKey) this.#metadata.instanceType = parsedKey.instanceType;
        if (options.secretKey) this.#metadata.secretKey = options.secretKey.substring(0, 16);
        this.#eventThrottler = new TelemetryEventThrottler(LocalStorageThrottlerCache.isSupported() ? new LocalStorageThrottlerCache() : new InMemoryThrottlerCache());
    }
    get isEnabled() {
        if (this.#metadata.instanceType !== "development") return false;
        if (this.#config.disabled || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$underscore$2d$ClYSgvuy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["o"])(process.env.CLERK_TELEMETRY_DISABLED)) return false;
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !!window?.navigator?.webdriver) //TURBOPACK unreachable
        ;
        return true;
    }
    get isDebug() {
        return this.#config.debug || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$underscore$2d$ClYSgvuy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["o"])(process.env.CLERK_TELEMETRY_DEBUG);
    }
    record(event) {
        try {
            const preparedPayload = this.#preparePayload(event.event, event.payload);
            this.#logEvent(preparedPayload.event, preparedPayload);
            if (!this.#shouldRecord(preparedPayload, event.eventSamplingRate)) return;
            this.#buffer.push({
                kind: "event",
                value: preparedPayload
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry event", error);
        }
    }
    /**
	* Records a telemetry log entry if logging is enabled and not in debug mode.
	*
	* @param entry - The telemetry log entry to record.
	*/ recordLog(entry) {
        try {
            if (!this.#shouldRecordLog(entry)) return;
            const levelIsValid = typeof entry?.level === "string" && VALID_LOG_LEVELS.has(entry.level);
            const messageIsValid = typeof entry?.message === "string" && entry.message.trim().length > 0;
            let normalizedTimestamp = null;
            const timestampInput = entry?.timestamp;
            if (typeof timestampInput === "number" || typeof timestampInput === "string") {
                const candidate = new Date(timestampInput);
                if (!Number.isNaN(candidate.getTime())) normalizedTimestamp = candidate;
            }
            if (!levelIsValid || !messageIsValid || normalizedTimestamp === null) {
                if (this.isDebug && typeof console !== "undefined") console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", {
                    levelIsValid,
                    messageIsValid,
                    timestampIsValid: normalizedTimestamp !== null
                });
                return;
            }
            const sdkMetadata = this.#getSDKMetadata();
            const logData = {
                sdk: sdkMetadata.name,
                sdkv: sdkMetadata.version,
                cv: this.#metadata.clerkVersion ?? "",
                lvl: entry.level,
                msg: entry.message,
                ts: normalizedTimestamp.toISOString(),
                pk: this.#metadata.publishableKey || null,
                payload: this.#sanitizeContext(entry.context)
            };
            this.#buffer.push({
                kind: "log",
                value: logData
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry log entry", error);
        }
    }
    #shouldRecord(preparedPayload, eventSamplingRate) {
        return this.isEnabled && !this.isDebug && this.#shouldBeSampled(preparedPayload, eventSamplingRate);
    }
    #shouldRecordLog(_entry) {
        return true;
    }
    #shouldBeSampled(preparedPayload, eventSamplingRate) {
        const randomSeed = Math.random();
        if (!(randomSeed <= this.#config.samplingRate && (this.#config.perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate))) return false;
        return !this.#eventThrottler.isEventThrottled(preparedPayload);
    }
    #scheduleFlush() {
        if ("TURBOPACK compile-time truthy", 1) {
            this.#flush();
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    #flush() {
        const itemsToSend = [
            ...this.#buffer
        ];
        this.#buffer = [];
        this.#pendingFlush = null;
        if (itemsToSend.length === 0) return;
        const eventsToSend = itemsToSend.filter((item)=>item.kind === "event").map((item)=>item.value);
        const logsToSend = itemsToSend.filter((item)=>item.kind === "log").map((item)=>item.value);
        if (eventsToSend.length > 0) {
            const eventsUrl = new URL("/v1/event", this.#config.endpoint);
            fetch(eventsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    events: eventsToSend
                })
            }).catch(()=>void 0);
        }
        if (logsToSend.length > 0) {
            const logsUrl = new URL("/v1/logs", this.#config.endpoint);
            fetch(logsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    logs: logsToSend
                })
            }).catch(()=>void 0);
        }
    }
    /**
	* If running in debug mode, log the event and its payload to the console.
	*/ #logEvent(event, payload) {
        if (!this.isDebug) return;
        if (typeof console.groupCollapsed !== "undefined") {
            console.groupCollapsed("[clerk/telemetry]", event);
            console.log(payload);
            console.groupEnd();
        } else console.log("[clerk/telemetry]", event, payload);
    }
    /**
	* If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
	*
	* This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
	*/ #getSDKMetadata() {
        const sdkMetadata = {
            name: this.#metadata.sdk,
            version: this.#metadata.sdkVersion
        };
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return sdkMetadata;
    }
    /**
	* Append relevant metadata from the Clerk singleton to the event payload.
	*/ #preparePayload(event, payload) {
        const sdkMetadata = this.#getSDKMetadata();
        return {
            event,
            cv: this.#metadata.clerkVersion ?? "",
            it: this.#metadata.instanceType ?? "",
            sdk: sdkMetadata.name,
            sdkv: sdkMetadata.version,
            ...this.#metadata.publishableKey ? {
                pk: this.#metadata.publishableKey
            } : {},
            ...this.#metadata.secretKey ? {
                sk: this.#metadata.secretKey
            } : {},
            payload
        };
    }
    /**
	* Best-effort sanitization of the context payload. Returns a plain object with JSON-serializable
	* values or null when the input is missing or not serializable. Arrays are not accepted.
	*/ #sanitizeContext(context) {
        if (context === null || typeof context === "undefined") return null;
        if (typeof context !== "object") return null;
        try {
            const cleaned = JSON.parse(JSON.stringify(context));
            if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) return cleaned;
            return null;
        } catch  {
            return null;
        }
    }
};
//#endregion
//#region src/telemetry/events/component-mounted.ts
const EVENT_COMPONENT_MOUNTED = "COMPONENT_MOUNTED";
const EVENT_COMPONENT_OPENED = "COMPONENT_OPENED";
const EVENT_SAMPLING_RATE$3 = .1;
/** Increase sampling for high-signal auth components on mount. */ const AUTH_COMPONENTS = new Set([
    "SignIn",
    "SignUp"
]);
/**
* Returns the per-event sampling rate for component-mounted telemetry events.
* Uses a higher rate for SignIn/SignUp to improve signal quality.
*
*  @internal
*/ function getComponentMountedSamplingRate(component) {
    return AUTH_COMPONENTS.has(component) ? 1 : EVENT_SAMPLING_RATE$3;
}
/**
* Factory for prebuilt component telemetry events.
*
* @internal
*/ function createPrebuiltComponentEvent(event) {
    return function(component, props, additionalPayload) {
        return {
            event,
            eventSamplingRate: event === EVENT_COMPONENT_MOUNTED ? getComponentMountedSamplingRate(component) : EVENT_SAMPLING_RATE$3,
            payload: {
                component,
                appearanceProp: Boolean(props?.appearance),
                theme: Boolean(props?.appearance?.theme),
                elements: Boolean(props?.appearance?.elements),
                variables: Boolean(props?.appearance?.variables),
                ...additionalPayload
            }
        };
    };
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is mounted.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentMounted('SignUp', props));
*/ function eventPrebuiltComponentMounted(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_MOUNTED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is opened as a modal.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentOpened('GoogleOneTap', props));
*/ function eventPrebuiltComponentOpened(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_OPENED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a component is mounted. Use `eventPrebuiltComponentMounted` for prebuilt components.
*
* **Caution:** Filter the `props` you pass to this function to avoid sending too much data.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Ideally you only pass a handful of props here.
* @example
* telemetry.record(eventComponentMounted('SignUp', props));
*/ function eventComponentMounted(component, props = {}) {
    return {
        event: EVENT_COMPONENT_MOUNTED,
        eventSamplingRate: getComponentMountedSamplingRate(component),
        payload: {
            component,
            ...props
        }
    };
}
//#endregion
//#region src/telemetry/events/method-called.ts
const EVENT_METHOD_CALLED = "METHOD_CALLED";
const EVENT_SAMPLING_RATE$2 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventMethodCalled(method, payload) {
    return {
        event: EVENT_METHOD_CALLED,
        eventSamplingRate: EVENT_SAMPLING_RATE$2,
        payload: {
            method,
            ...payload
        }
    };
}
//#endregion
//#region src/telemetry/events/framework-metadata.ts
const EVENT_FRAMEWORK_METADATA = "FRAMEWORK_METADATA";
const EVENT_SAMPLING_RATE$1 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventFrameworkMetadata(payload) {
    return {
        event: EVENT_FRAMEWORK_METADATA,
        eventSamplingRate: EVENT_SAMPLING_RATE$1,
        payload
    };
}
//#endregion
//#region src/telemetry/events/theme-usage.ts
const EVENT_THEME_USAGE = "THEME_USAGE";
const EVENT_SAMPLING_RATE = 1;
/**
* Helper function for `telemetry.record()`. Create a consistent event object for tracking theme usage in ClerkProvider.
*
* @param appearance - The appearance prop from ClerkProvider.
* @example
* telemetry.record(eventThemeUsage(appearance));
*/ function eventThemeUsage(appearance) {
    return {
        event: EVENT_THEME_USAGE,
        eventSamplingRate: EVENT_SAMPLING_RATE,
        payload: analyzeThemeUsage(appearance)
    };
}
/**
* Analyzes the appearance prop to extract theme usage information for telemetry.
*
* @internal
*/ function analyzeThemeUsage(appearance) {
    if (!appearance || typeof appearance !== "object") return {};
    const themeProperty = appearance.theme;
    if (!themeProperty) return {};
    let themeName;
    if (Array.isArray(themeProperty)) for (const theme of themeProperty){
        const name = extractThemeName(theme);
        if (name) {
            themeName = name;
            break;
        }
    }
    else themeName = extractThemeName(themeProperty);
    return {
        themeName
    };
}
/**
* Extracts the theme name from a theme object.
*
* @internal
*/ function extractThemeName(theme) {
    if (typeof theme === "string") return theme;
    if (typeof theme === "object" && theme !== null) {
        if ("name" in theme && typeof theme.name === "string") return theme.name;
    }
}
;
 //# sourceMappingURL=telemetry-DE2JFEBf.mjs.map
}),
"[project]/node_modules/@clerk/shared/dist/runtime/telemetry.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$constants$2d$Bta24VLk$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/constants-Bta24VLk.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$isomorphicAtob$2d$CoF80qYz$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/isomorphicAtob-CoF80qYz.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$isomorphicBtoa$2d$DWmLcIHi$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/isomorphicBtoa-DWmLcIHi.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keys$2d$DuxzP8MU$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/keys-DuxzP8MU.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$underscore$2d$ClYSgvuy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/underscore-ClYSgvuy.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2d$DE2JFEBf$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/telemetry-DE2JFEBf.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/node_modules/@clerk/shared/dist/runtime/telemetry-DE2JFEBf.mjs [app-rsc] (ecmascript) <export l as TelemetryCollector>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryCollector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2d$DE2JFEBf$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["l"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2d$DE2JFEBf$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/telemetry-DE2JFEBf.mjs [app-rsc] (ecmascript)");
}),
"[project]/node_modules/@clerk/backend/dist/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClerkClient",
    ()=>createClerkClient,
    "verifyToken",
    ()=>verifyToken2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$4CR2VU2D$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-4CR2VU2D.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$YBVFDYDR$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-YBVFDYDR.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$P263NW7Z$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-P263NW7Z.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$7KLH7JRZ$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-7KLH7JRZ.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$I4B6KCGC$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-I4B6KCGC.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$TOROEX6P$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/chunk-TOROEX6P.mjs [app-rsc] (ecmascript)");
// src/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/telemetry.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2d$DE2JFEBf$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__l__as__TelemetryCollector$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/telemetry-DE2JFEBf.mjs [app-rsc] (ecmascript) <export l as TelemetryCollector>");
;
;
;
;
;
;
;
var verifyToken2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$P263NW7Z$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withLegacyReturn"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$4CR2VU2D$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyToken"]);
function createClerkClient(options) {
    const opts = {
        ...options
    };
    const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$4CR2VU2D$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createBackendApiClient"])(opts);
    const requestState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$chunk$2d$4CR2VU2D$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAuthenticateRequest"])({
        options: opts,
        apiClient
    });
    const telemetry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$telemetry$2d$DE2JFEBf$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__l__as__TelemetryCollector$3e$__["TelemetryCollector"]({
        publishableKey: opts.publishableKey,
        secretKey: opts.secretKey,
        samplingRate: 0.1,
        ...opts.sdkMetadata ? {
            sdk: opts.sdkMetadata.name,
            sdkVersion: opts.sdkMetadata.version
        } : {},
        ...opts.telemetry || {}
    });
    return {
        ...apiClient,
        ...requestState,
        telemetry
    };
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/server/createClerkClient.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClerkClientWithOptions",
    ()=>createClerkClientWithOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/backend/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/constants.js [app-rsc] (ecmascript)");
;
;
;
const clerkClientDefaultOptions = {
    secretKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SECRET_KEY"],
    publishableKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PUBLISHABLE_KEY"],
    apiUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_URL"],
    apiVersion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_VERSION"],
    userAgent: `${"@clerk/nextjs"}@${"7.0.1"}`,
    proxyUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROXY_URL"],
    domain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DOMAIN"],
    isSatellite: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IS_SATELLITE"],
    machineSecretKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MACHINE_SECRET_KEY"],
    sdkMetadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SDK_METADATA"],
    telemetry: {
        disabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELEMETRY_DISABLED"],
        debug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELEMETRY_DEBUG"]
    }
};
const createClerkClientWithOptions = (options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$backend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClerkClient"])({
        ...clerkClientDefaultOptions,
        ...options
    });
;
 //# sourceMappingURL=createClerkClient.js.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/chunk-BUSYA2B4.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__commonJS",
    ()=>__commonJS
]);
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod)=>function __require() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
;
 //# sourceMappingURL=chunk-BUSYA2B4.js.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/runtime/node/safe-node-apis.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$chunk$2d$BUSYA2B4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/chunk-BUSYA2B4.js [app-rsc] (ecmascript)");
;
var require_safe_node_apis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$chunk$2d$BUSYA2B4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__commonJS"])({
    "src/runtime/node/safe-node-apis.js" (exports, module) {
        const { existsSync, writeFileSync, readFileSync, appendFileSync, mkdirSync, rmSync } = __turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)");
        const path = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
        const fs = {
            existsSync,
            writeFileSync,
            readFileSync,
            appendFileSync,
            mkdirSync,
            rmSync
        };
        const cwd = ()=>process.cwd();
        module.exports = {
            fs,
            path,
            cwd
        };
    }
});
const __TURBOPACK__default__export__ = require_safe_node_apis();
 //# sourceMappingURL=safe-node-apis.js.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/server/fs/utils.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "nodeCwdOrThrow",
    ()=>nodeCwdOrThrow,
    "nodeFsOrThrow",
    ()=>nodeFsOrThrow,
    "nodePathOrThrow",
    ()=>nodePathOrThrow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/runtime/node/safe-node-apis.js [app-rsc] (ecmascript)");
;
;
function assertNotNullable(value, moduleName) {
    if (!value) {
        throw new Error(`Clerk: ${moduleName} is missing. This is an internal error. Please contact Clerk's support.`);
    }
}
const nodeFsOrThrow = ()=>{
    assertNotNullable(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].fs, "fs");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].fs;
};
const nodePathOrThrow = ()=>{
    assertNotNullable(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].path, "path");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].path;
};
const nodeCwdOrThrow = ()=>{
    assertNotNullable(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].cwd, "cwd");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$runtime$2f$node$2f$safe$2d$node$2d$apis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].cwd;
};
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/server/keyless-node.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keyless",
    ()=>keyless
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/keyless/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$createClerkClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/createClerkClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$fs$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/fs/utils.js [app-rsc] (ecmascript)");
;
;
;
;
function createFileStorage() {
    const fs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$fs$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nodeFsOrThrow"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$fs$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nodePathOrThrow"])();
    const cwd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$fs$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nodeCwdOrThrow"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createNodeFileStorage"])(fs, path, {
        cwd,
        frameworkPackageName: "@clerk/nextjs"
    });
}
let keylessServiceInstance = null;
function keyless() {
    if (!keylessServiceInstance) {
        const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$createClerkClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClerkClientWithOptions"])({});
        keylessServiceInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createKeylessService"])({
            storage: createFileStorage(),
            api: {
                async createAccountlessApplication (requestHeaders) {
                    try {
                        return await client.__experimental_accountlessApplications.createAccountlessApplication({
                            requestHeaders
                        });
                    } catch  {
                        return null;
                    }
                },
                async completeOnboarding (requestHeaders) {
                    try {
                        return await client.__experimental_accountlessApplications.completeAccountlessApplicationOnboarding({
                            requestHeaders
                        });
                    } catch  {
                        return null;
                    }
                }
            },
            framework: "nextjs"
        });
    }
    return keylessServiceInstance;
}
;
 //# sourceMappingURL=keyless-node.js.map
}),
"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0069b1901c8c797b6591bd4a43a5c2c09da4554ca8":"createOrReadKeylessAction","00bc46dcab3cf3ef1ea8ee6528731158593440cbd5":"deleteKeylessAction","40e43404e8c10f2489c6e5391622fc121f02bc45b1":"syncKeylessConfigAction"},"",""] */ __turbopack_context__.s([
    "createOrReadKeylessAction",
    ()=>createOrReadKeylessAction,
    "deleteKeylessAction",
    ()=>deleteKeylessAction,
    "syncKeylessConfigAction",
    ()=>syncKeylessConfigAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$errorThrower$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/errorThrower.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$headers$2d$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/headers-utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/keyless.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/runtime/keyless/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2d$node$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/server/keyless-node.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/utils/feature-flags.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const keylessCookieConfig = {
    secure: false,
    httpOnly: false,
    sameSite: "lax"
};
async function syncKeylessConfigAction(args) {
    const { claimUrl, publishableKey, secretKey, returnUrl } = args;
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const request = new Request("https://placeholder.com", {
        headers: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()
    });
    const keylessCookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getKeylessCookieValue"])((name)=>{
        var _a;
        return (_a = cookieStore.get(name)) == null ? void 0 : _a.value;
    });
    const pksMatch = (keylessCookie == null ? void 0 : keylessCookie.publishableKey) === publishableKey;
    const sksMatch = (keylessCookie == null ? void 0 : keylessCookie.secretKey) === secretKey;
    if (pksMatch && sksMatch) {
        return;
    }
    cookieStore.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getKeylessCookieName"])(), JSON.stringify({
        claimUrl,
        publishableKey,
        secretKey
    }), keylessCookieConfig);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$headers$2d$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectClerkMiddleware"])(request)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/clerk-sync-keyless?returnUrl=${returnUrl}`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RedirectType"].replace);
    }
    return;
}
async function createOrReadKeylessAction() {
    var _a;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canUseKeyless"]) {
        return null;
    }
    let result;
    try {
        result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2d$node$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["keyless"])().getOrCreateKeys();
    } catch  {
        result = null;
    }
    if (!result) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$errorThrower$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["errorThrower"].throwMissingPublishableKeyError();
        return null;
    }
    (_a = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clerkDevelopmentCache"]) == null ? void 0 : _a.log({
        cacheKey: result.publishableKey,
        msg: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$runtime$2f$keyless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createKeylessModeMessage"])(result)
    });
    const { claimUrl, publishableKey, secretKey, apiKeysUrl } = result;
    void (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getKeylessCookieName"])(), JSON.stringify({
        claimUrl,
        publishableKey,
        secretKey
    }), keylessCookieConfig);
    return {
        claimUrl,
        publishableKey,
        apiKeysUrl
    };
}
async function deleteKeylessAction() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canUseKeyless"]) {
        return;
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$keyless$2d$node$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["keyless"])().removeKeys();
    } catch  {}
}
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    syncKeylessConfigAction,
    createOrReadKeylessAction,
    deleteKeylessAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncKeylessConfigAction, "40e43404e8c10f2489c6e5391622fc121f02bc45b1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrReadKeylessAction, "0069b1901c8c797b6591bd4a43a5c2c09da4554ca8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteKeylessAction, "00bc46dcab3cf3ef1ea8ee6528731158593440cbd5", null);
}),
"[project]/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extendedEncodeURIComponent",
    ()=>extendedEncodeURIComponent
]);
function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
}),
"[project]/node_modules/@aws-sdk/cloudfront-signer/dist-es/sign.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSignedCookies",
    ()=>getSignedCookies,
    "getSignedUrl",
    ()=>getSignedUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$smithy$2f$core$2f$dist$2d$es$2f$submodules$2f$protocols$2f$extended$2d$encode$2d$uri$2d$component$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
;
function getSignedUrl({ dateLessThan, dateGreaterThan, url, keyPairId, privateKey, ipAddress, policy, passphrase, algorithm }) {
    const cloudfrontSignBuilder = new CloudfrontSignBuilder({
        keyPairId,
        privateKey,
        passphrase,
        algorithm
    });
    if (!url && !policy) {
        throw new Error("@aws-sdk/cloudfront-signer: Please provide 'url' or 'policy'.");
    }
    let baseUrl;
    if (url) {
        baseUrl = encodeUrlPath(url);
    } else if (policy) {
        const resources = getPolicyResources(policy);
        if (!resources[0]) {
            throw new Error("@aws-sdk/cloudfront-signer: No URL provided and unable to determine URL from first policy statement resource.");
        }
        baseUrl = resources[0].replace("*://", "https://");
    }
    if (policy) {
        cloudfrontSignBuilder.setCustomPolicy(policy);
    } else {
        cloudfrontSignBuilder.setPolicyParameters({
            url: baseUrl,
            dateLessThan,
            dateGreaterThan,
            ipAddress
        });
    }
    const startFlag = baseUrl.includes("?") ? "&" : "?";
    const attributes = cloudfrontSignBuilder.createCloudfrontAttribute();
    if (algorithm === "SHA256") {
        attributes["Hash-Algorithm"] = "SHA256";
    }
    const params = Object.entries(attributes).filter(([, value])=>value !== undefined).map(([key, value])=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$smithy$2f$core$2f$dist$2d$es$2f$submodules$2f$protocols$2f$extended$2d$encode$2d$uri$2d$component$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extendedEncodeURIComponent"])(key)}=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$smithy$2f$core$2f$dist$2d$es$2f$submodules$2f$protocols$2f$extended$2d$encode$2d$uri$2d$component$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extendedEncodeURIComponent"])(value)}`).join("&");
    const urlString = baseUrl + startFlag + params;
    return getResource(urlString);
}
function getSignedCookies({ ipAddress, url, privateKey, keyPairId, dateLessThan, dateGreaterThan, policy, passphrase, algorithm }) {
    const cloudfrontSignBuilder = new CloudfrontSignBuilder({
        keyPairId,
        privateKey,
        passphrase,
        algorithm
    });
    if (policy) {
        cloudfrontSignBuilder.setCustomPolicy(policy);
    } else {
        cloudfrontSignBuilder.setPolicyParameters({
            url,
            dateLessThan,
            dateGreaterThan,
            ipAddress
        });
    }
    const cloudfrontCookieAttributes = cloudfrontSignBuilder.createCloudfrontAttribute();
    const cookies = {
        "CloudFront-Key-Pair-Id": cloudfrontCookieAttributes["Key-Pair-Id"],
        "CloudFront-Signature": cloudfrontCookieAttributes["Signature"]
    };
    if (cloudfrontCookieAttributes["Expires"]) {
        cookies["CloudFront-Expires"] = cloudfrontCookieAttributes["Expires"];
    }
    if (cloudfrontCookieAttributes["Policy"]) {
        cookies["CloudFront-Policy"] = cloudfrontCookieAttributes["Policy"];
    }
    if (algorithm === "SHA256") {
        cookies["CloudFront-Hash-Algorithm"] = "SHA256";
    }
    return cookies;
}
function encodeUrlPath(url) {
    const protocolEnd = url.indexOf("//");
    if (protocolEnd === -1) {
        return url;
    }
    const authorityStart = protocolEnd + 2;
    const pathStart = url.indexOf("/", authorityStart);
    if (pathStart === -1) {
        return url;
    }
    const origin = url.slice(0, pathStart);
    const rest = url.slice(pathStart);
    const queryIndex = rest.indexOf("?");
    const rawPath = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
    const rawQuery = queryIndex === -1 ? "" : rest.slice(queryIndex);
    const encodedPath = rawPath.replace(/[^/]+/g, (segment)=>{
        try {
            return encodeURIComponent(decodeURIComponent(segment));
        } catch  {
            return encodeURIComponent(segment);
        }
    });
    let encodedQuery = "";
    if (rawQuery) {
        for (const [key, value] of new URLSearchParams(rawQuery.slice(1)).entries()){
            encodedQuery += `${encodedQuery ? "&" : "?"}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
    }
    return origin + encodedPath + encodedQuery;
}
function getPolicyResources(policy) {
    const parsedPolicy = typeof policy === "string" ? JSON.parse(policy) : policy;
    return (parsedPolicy?.Statement ?? []).map((s)=>s.Resource);
}
function getResource(urlString) {
    const protocol = urlString.slice(0, urlString.indexOf("//"));
    switch(protocol){
        case "http:":
        case "https:":
        case "ws:":
        case "wss:":
            return urlString;
        case "rtmp:":
            const url = new URL(urlString);
            const origin = `${protocol}//${url.hostname}`;
            return urlString.substring(origin.length).replace(/(?::\d+)?\//, "");
        default:
            throw new Error("Invalid URI scheme. Scheme must be one of http, https, or rtmp");
    }
}
class CloudfrontSignBuilder {
    keyPairId;
    privateKey;
    passphrase;
    algorithm;
    policy;
    customPolicy = false;
    dateLessThan;
    constructor({ privateKey, keyPairId, passphrase, algorithm }){
        this.keyPairId = keyPairId;
        this.privateKey = privateKey;
        this.policy = "";
        this.passphrase = passphrase;
        this.algorithm = algorithm ?? "SHA1";
    }
    buildPolicy(args) {
        const policy = {
            Statement: [
                {
                    Resource: args.resource,
                    Condition: {
                        DateLessThan: {
                            "AWS:EpochTime": args.dateLessThan
                        }
                    }
                }
            ]
        };
        if (args.dateGreaterThan) {
            policy.Statement[0].Condition["DateGreaterThan"] = {
                "AWS:EpochTime": args.dateGreaterThan
            };
        }
        if (args.ipAddress) {
            const cidr = this.parseCIDR(args.ipAddress);
            policy.Statement[0].Condition["IpAddress"] = {
                "AWS:SourceIp": cidr
            };
        }
        return policy;
    }
    normalizeBase64(str) {
        const replacements = {
            "+": "-",
            "=": "_",
            "/": "~"
        };
        return str.replace(/[+=/]/g, function(match) {
            return replacements[match];
        });
    }
    encodeToBase64(str) {
        return this.normalizeBase64(Buffer.from(str).toString("base64"));
    }
    validateIP(ipStr) {
        const octets = ipStr.split(".");
        if (octets.length !== 4) {
            throw new Error(`IP does not contain four octets.`);
        }
        const isValid = octets.every((octet)=>{
            const num = Number(octet);
            return Number.isInteger(num) && num >= 0 && num <= 255;
        });
        if (!isValid) {
            throw new Error("invalid IP octets");
        }
    }
    validateMask(maskStr) {
        const mask = Number(maskStr);
        const isValid = Number.isInteger(mask) && mask >= 0 && mask <= 32;
        if (!isValid) {
            throw new Error("invalid mask");
        }
    }
    parseCIDR(cidrStr) {
        try {
            const cidrParts = cidrStr.split("/");
            if (cidrParts.some((part)=>part.length === 0)) {
                throw new Error("missing ip or mask part of CIDR");
            }
            this.validateIP(cidrParts[0]);
            let mask = "32";
            if (cidrParts.length === 2) {
                this.validateMask(cidrParts[1]);
                mask = cidrParts[1];
            }
            return `${cidrParts[0]}/${mask}`;
        } catch (error) {
            const errMessage = `IP address "${cidrStr}" is invalid`;
            if (error instanceof Error) {
                throw new Error(`${errMessage} due to ${error.message}.`);
            } else {
                throw new Error(`${errMessage}.`);
            }
        }
    }
    epochTime(date) {
        return Math.round(date.getTime() / 1000);
    }
    parseDate(date) {
        if (!date) {
            return undefined;
        }
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? undefined : this.epochTime(parsedDate);
    }
    parseDateWindow(expiration, start) {
        const dateLessThan = this.parseDate(expiration);
        if (!dateLessThan) {
            throw new Error("dateLessThan is invalid. Ensure the date value is compatible with the Date constructor.");
        }
        return {
            dateLessThan,
            dateGreaterThan: this.parseDate(start)
        };
    }
    signData(data, privateKey, passphrase) {
        const sign = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createSign"])(this.algorithm === "SHA256" ? "RSA-SHA256" : "RSA-SHA1");
        sign.update(data);
        return sign.sign({
            key: privateKey,
            passphrase
        }, "base64");
    }
    signPolicy(policy, privateKey, passphrase) {
        return this.normalizeBase64(this.signData(policy, privateKey, passphrase));
    }
    setCustomPolicy(policy) {
        this.customPolicy = true;
        this.policy = policy;
    }
    setPolicyParameters({ url, dateLessThan, dateGreaterThan, ipAddress }) {
        if (!url || !dateLessThan) {
            return false;
        }
        const resource = getResource(url);
        const parsedDates = this.parseDateWindow(dateLessThan, dateGreaterThan);
        this.dateLessThan = parsedDates.dateLessThan;
        this.customPolicy = Boolean(parsedDates.dateGreaterThan) || Boolean(ipAddress);
        this.policy = JSON.stringify(this.buildPolicy({
            resource,
            ipAddress,
            dateLessThan: parsedDates.dateLessThan,
            dateGreaterThan: parsedDates.dateGreaterThan
        }));
    }
    createCloudfrontAttribute() {
        if (!Boolean(this.policy)) {
            throw new Error("Invalid policy");
        }
        const signature = this.signPolicy(this.policy, this.privateKey, this.passphrase);
        return {
            Expires: this.customPolicy ? undefined : this.dateLessThan,
            Policy: this.customPolicy ? this.encodeToBase64(this.policy) : undefined,
            "Key-Pair-Id": this.keyPairId,
            Signature: signature
        };
    }
}
}),
"[project]/apps/app/.next-internal/server/app/(client)/client/projects/[projectId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/apps/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$keyless$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$cdn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)");
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
}),
"[project]/apps/app/.next-internal/server/app/(client)/client/projects/[projectId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/apps/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000f79c552fbb05b39a432550070054b4a36d67341",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSuperAdminRole"],
    "00237240cc682734855abb60eed1ea61507bf8ce45",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLandingPath"],
    "0069b1901c8c797b6591bd4a43a5c2c09da4554ca8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$keyless$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOrReadKeylessAction"],
    "008ab63adb1024f4ffe4886920d5531523b1176f89",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAccessibleSurfaces"],
    "00b3da01bc6fabac667292638710c7e9927debf754",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["invalidateCacheAction"],
    "40419a72f70d6b1a2b19f18b38555ef3c5d7d25f8b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasAnyRole"],
    "40438929adcb230af27d8f2e649fe94f2f2c457659",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$cdn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signCdnUrl"],
    "4078531c8b70ca6e79f5512530dc080ba018264a96",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasRole"],
    "407fa7c990f11eea8ffbb59dd799ab0d3fa648c9a9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSurfaceAccess"],
    "40df5fb9d13ca3f0e3e141515702d444c990b39ea7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$cdn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signCdnUrls"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f2e$next$2d$internal$2f$server$2f$app$2f28$client$292f$client$2f$projects$2f5b$projectId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$keyless$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$apps$2f$app$2f$actions$2f$cdn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/app/.next-internal/server/app/(client)/client/projects/[projectId]/page/actions.js { ACTIONS_MODULE0 => "[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/apps/app/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$keyless$2d$actions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/keyless-actions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$app$2f$actions$2f$cdn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/app/actions/cdn.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_dfb0d04c._.js.map