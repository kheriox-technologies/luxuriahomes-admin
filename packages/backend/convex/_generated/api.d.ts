/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as fileStorage_deleteStorage from "../fileStorage/deleteStorage.js";
import type * as fileStorage_generateUploadUrl from "../fileStorage/generateUploadUrl.js";
import type * as fileStorage_resolvePublicUrl from "../fileStorage/resolvePublicUrl.js";
import type * as inclusionCategories_add from "../inclusionCategories/add.js";
import type * as inclusionCategories_list from "../inclusionCategories/list.js";
import type * as inclusionCategories_remove from "../inclusionCategories/remove.js";
import type * as inclusionCategories_search from "../inclusionCategories/search.js";
import type * as inclusionCategories_shared from "../inclusionCategories/shared.js";
import type * as inclusionCategories_update from "../inclusionCategories/update.js";
import type * as inclusionVariants_add from "../inclusionVariants/add.js";
import type * as inclusionVariants_listByInclusion from "../inclusionVariants/listByInclusion.js";
import type * as inclusionVariants_remove from "../inclusionVariants/remove.js";
import type * as inclusionVariants_search from "../inclusionVariants/search.js";
import type * as inclusionVariants_shared from "../inclusionVariants/shared.js";
import type * as inclusionVariants_update from "../inclusionVariants/update.js";
import type * as inclusions_add from "../inclusions/add.js";
import type * as inclusions_backfillSearchText from "../inclusions/backfillSearchText.js";
import type * as inclusions_get from "../inclusions/get.js";
import type * as inclusions_list from "../inclusions/list.js";
import type * as inclusions_remove from "../inclusions/remove.js";
import type * as inclusions_search from "../inclusions/search.js";
import type * as inclusions_shared from "../inclusions/shared.js";
import type * as inclusions_update from "../inclusions/update.js";
import type * as lib_buildSearchText from "../lib/buildSearchText.js";
import type * as lib_checkIdentity from "../lib/checkIdentity.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_logger from "../lib/logger.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as permissions_getEffectiveForRoles from "../permissions/getEffectiveForRoles.js";
import type * as permissions_list from "../permissions/list.js";
import type * as permissions_listRoleNames from "../permissions/listRoleNames.js";
import type * as permissions_removeRole from "../permissions/removeRole.js";
import type * as permissions_upsertRole from "../permissions/upsertRole.js";
import type * as projects_add from "../projects/add.js";
import type * as projects_get from "../projects/get.js";
import type * as projects_list from "../projects/list.js";
import type * as projects_remove from "../projects/remove.js";
import type * as projects_search from "../projects/search.js";
import type * as projects_shared from "../projects/shared.js";
import type * as projects_update from "../projects/update.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "fileStorage/deleteStorage": typeof fileStorage_deleteStorage;
  "fileStorage/generateUploadUrl": typeof fileStorage_generateUploadUrl;
  "fileStorage/resolvePublicUrl": typeof fileStorage_resolvePublicUrl;
  "inclusionCategories/add": typeof inclusionCategories_add;
  "inclusionCategories/list": typeof inclusionCategories_list;
  "inclusionCategories/remove": typeof inclusionCategories_remove;
  "inclusionCategories/search": typeof inclusionCategories_search;
  "inclusionCategories/shared": typeof inclusionCategories_shared;
  "inclusionCategories/update": typeof inclusionCategories_update;
  "inclusionVariants/add": typeof inclusionVariants_add;
  "inclusionVariants/listByInclusion": typeof inclusionVariants_listByInclusion;
  "inclusionVariants/remove": typeof inclusionVariants_remove;
  "inclusionVariants/search": typeof inclusionVariants_search;
  "inclusionVariants/shared": typeof inclusionVariants_shared;
  "inclusionVariants/update": typeof inclusionVariants_update;
  "inclusions/add": typeof inclusions_add;
  "inclusions/backfillSearchText": typeof inclusions_backfillSearchText;
  "inclusions/get": typeof inclusions_get;
  "inclusions/list": typeof inclusions_list;
  "inclusions/remove": typeof inclusions_remove;
  "inclusions/search": typeof inclusions_search;
  "inclusions/shared": typeof inclusions_shared;
  "inclusions/update": typeof inclusions_update;
  "lib/buildSearchText": typeof lib_buildSearchText;
  "lib/checkIdentity": typeof lib_checkIdentity;
  "lib/clerk": typeof lib_clerk;
  "lib/logger": typeof lib_logger;
  "lib/permissions": typeof lib_permissions;
  "permissions/getEffectiveForRoles": typeof permissions_getEffectiveForRoles;
  "permissions/list": typeof permissions_list;
  "permissions/listRoleNames": typeof permissions_listRoleNames;
  "permissions/removeRole": typeof permissions_removeRole;
  "permissions/upsertRole": typeof permissions_upsertRole;
  "projects/add": typeof projects_add;
  "projects/get": typeof projects_get;
  "projects/list": typeof projects_list;
  "projects/remove": typeof projects_remove;
  "projects/search": typeof projects_search;
  "projects/shared": typeof projects_shared;
  "projects/update": typeof projects_update;
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
