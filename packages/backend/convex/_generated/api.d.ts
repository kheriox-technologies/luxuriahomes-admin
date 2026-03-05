/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_checkIdentity from "../lib/checkIdentity.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_logger from "../lib/logger.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as permissions_getEffectiveForRoles from "../permissions/getEffectiveForRoles.js";
import type * as permissions_list from "../permissions/list.js";
import type * as permissions_listRoleNames from "../permissions/listRoleNames.js";
import type * as permissions_removeRole from "../permissions/removeRole.js";
import type * as permissions_upsertRole from "../permissions/upsertRole.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/checkIdentity": typeof lib_checkIdentity;
  "lib/clerk": typeof lib_clerk;
  "lib/logger": typeof lib_logger;
  "lib/permissions": typeof lib_permissions;
  "permissions/getEffectiveForRoles": typeof permissions_getEffectiveForRoles;
  "permissions/list": typeof permissions_list;
  "permissions/listRoleNames": typeof permissions_listRoleNames;
  "permissions/removeRole": typeof permissions_removeRole;
  "permissions/upsertRole": typeof permissions_upsertRole;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
