/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as documentFolders_add from "../documentFolders/add.js";
import type * as documentFolders_get from "../documentFolders/get.js";
import type * as documentFolders_list from "../documentFolders/list.js";
import type * as documentFolders_remove from "../documentFolders/remove.js";
import type * as documentFolders_search from "../documentFolders/search.js";
import type * as documentFolders_seed from "../documentFolders/seed.js";
import type * as documentFolders_seedProjectFolders from "../documentFolders/seedProjectFolders.js";
import type * as documentFolders_shared from "../documentFolders/shared.js";
import type * as documentFolders_update from "../documentFolders/update.js";
import type * as fileStorage_deleteStorage from "../fileStorage/deleteStorage.js";
import type * as fileStorage_generateS3UploadUrl from "../fileStorage/generateS3UploadUrl.js";
import type * as fileStorage_generateUploadUrl from "../fileStorage/generateUploadUrl.js";
import type * as fileStorage_resolvePublicUrl from "../fileStorage/resolvePublicUrl.js";
import type * as inclusionCategories_add from "../inclusionCategories/add.js";
import type * as inclusionCategories_list from "../inclusionCategories/list.js";
import type * as inclusionCategories_remove from "../inclusionCategories/remove.js";
import type * as inclusionCategories_search from "../inclusionCategories/search.js";
import type * as inclusionCategories_shared from "../inclusionCategories/shared.js";
import type * as inclusionCategories_update from "../inclusionCategories/update.js";
import type * as inclusionVariants_add from "../inclusionVariants/add.js";
import type * as inclusionVariants_getUnit from "../inclusionVariants/getUnit.js";
import type * as inclusionVariants_listByInclusion from "../inclusionVariants/listByInclusion.js";
import type * as inclusionVariants_migrateImageBinariesToS3 from "../inclusionVariants/migrateImageBinariesToS3.js";
import type * as inclusionVariants_migrateImageHelpers from "../inclusionVariants/migrateImageHelpers.js";
import type * as inclusionVariants_migrateImagesToS3 from "../inclusionVariants/migrateImagesToS3.js";
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
import type * as lib_toKebabCase from "../lib/toKebabCase.js";
import type * as locations_add from "../locations/add.js";
import type * as locations_get from "../locations/get.js";
import type * as locations_list from "../locations/list.js";
import type * as locations_remove from "../locations/remove.js";
import type * as locations_search from "../locations/search.js";
import type * as locations_seed from "../locations/seed.js";
import type * as locations_shared from "../locations/shared.js";
import type * as locations_update from "../locations/update.js";
import type * as materialColors_add from "../materialColors/add.js";
import type * as materialColors_get from "../materialColors/get.js";
import type * as materialColors_list from "../materialColors/list.js";
import type * as materialColors_remove from "../materialColors/remove.js";
import type * as materialColors_search from "../materialColors/search.js";
import type * as materialColors_seed from "../materialColors/seed.js";
import type * as materialColors_shared from "../materialColors/shared.js";
import type * as materialColors_update from "../materialColors/update.js";
import type * as orders_add from "../orders/add.js";
import type * as orders_get from "../orders/get.js";
import type * as orders_list from "../orders/list.js";
import type * as orders_remove from "../orders/remove.js";
import type * as orders_search from "../orders/search.js";
import type * as orders_shared from "../orders/shared.js";
import type * as orders_update from "../orders/update.js";
import type * as permissions_getEffectiveForRoles from "../permissions/getEffectiveForRoles.js";
import type * as permissions_list from "../permissions/list.js";
import type * as permissions_listRoleNames from "../permissions/listRoleNames.js";
import type * as permissions_removeRole from "../permissions/removeRole.js";
import type * as permissions_upsertRole from "../permissions/upsertRole.js";
import type * as projectDocuments_create from "../projectDocuments/create.js";
import type * as projectDocuments_createFolder from "../projectDocuments/createFolder.js";
import type * as projectDocuments_deleteFolder from "../projectDocuments/deleteFolder.js";
import type * as projectDocuments_generateUploadUrl from "../projectDocuments/generateUploadUrl.js";
import type * as projectDocuments_listContents from "../projectDocuments/listContents.js";
import type * as projectDocuments_move from "../projectDocuments/move.js";
import type * as projectDocuments_remove from "../projectDocuments/remove.js";
import type * as projectDocuments_rename from "../projectDocuments/rename.js";
import type * as projectDocuments_renameFolder from "../projectDocuments/renameFolder.js";
import type * as projectDocuments_shared from "../projectDocuments/shared.js";
import type * as projectInclusions_add from "../projectInclusions/add.js";
import type * as projectInclusions_appendNote from "../projectInclusions/appendNote.js";
import type * as projectInclusions_list from "../projectInclusions/list.js";
import type * as projectInclusions_listNotes from "../projectInclusions/listNotes.js";
import type * as projectInclusions_migrateImageBinariesToS3 from "../projectInclusions/migrateImageBinariesToS3.js";
import type * as projectInclusions_migrateImageHelpers from "../projectInclusions/migrateImageHelpers.js";
import type * as projectInclusions_migrateImagesToS3 from "../projectInclusions/migrateImagesToS3.js";
import type * as projectInclusions_remove from "../projectInclusions/remove.js";
import type * as projectInclusions_search from "../projectInclusions/search.js";
import type * as projectInclusions_shared from "../projectInclusions/shared.js";
import type * as projectInclusions_update from "../projectInclusions/update.js";
import type * as projectServiceProviders_add from "../projectServiceProviders/add.js";
import type * as projectServiceProviders_listByProject from "../projectServiceProviders/listByProject.js";
import type * as projectServiceProviders_remove from "../projectServiceProviders/remove.js";
import type * as projects_add from "../projects/add.js";
import type * as projects_get from "../projects/get.js";
import type * as projects_list from "../projects/list.js";
import type * as projects_remove from "../projects/remove.js";
import type * as projects_search from "../projects/search.js";
import type * as projects_shared from "../projects/shared.js";
import type * as projects_update from "../projects/update.js";
import type * as quotations_add from "../quotations/add.js";
import type * as quotations_approve from "../quotations/approve.js";
import type * as quotations_generateUploadUrl from "../quotations/generateUploadUrl.js";
import type * as quotations_list from "../quotations/list.js";
import type * as quotations_listByProject from "../quotations/listByProject.js";
import type * as quotations_listByProjects from "../quotations/listByProjects.js";
import type * as quotations_remove from "../quotations/remove.js";
import type * as quotations_search from "../quotations/search.js";
import type * as quotations_shared from "../quotations/shared.js";
import type * as quotations_update from "../quotations/update.js";
import type * as serviceProviders_add from "../serviceProviders/add.js";
import type * as serviceProviders_get from "../serviceProviders/get.js";
import type * as serviceProviders_list from "../serviceProviders/list.js";
import type * as serviceProviders_remove from "../serviceProviders/remove.js";
import type * as serviceProviders_search from "../serviceProviders/search.js";
import type * as serviceProviders_seed from "../serviceProviders/seed.js";
import type * as serviceProviders_shared from "../serviceProviders/shared.js";
import type * as serviceProviders_update from "../serviceProviders/update.js";
import type * as stages_add from "../stages/add.js";
import type * as stages_get from "../stages/get.js";
import type * as stages_list from "../stages/list.js";
import type * as stages_remove from "../stages/remove.js";
import type * as stages_reorder from "../stages/reorder.js";
import type * as stages_search from "../stages/search.js";
import type * as stages_shared from "../stages/shared.js";
import type * as stages_update from "../stages/update.js";
import type * as tasks_add from "../tasks/add.js";
import type * as tasks_get from "../tasks/get.js";
import type * as tasks_list from "../tasks/list.js";
import type * as tasks_listAll from "../tasks/listAll.js";
import type * as tasks_remove from "../tasks/remove.js";
import type * as tasks_reorder from "../tasks/reorder.js";
import type * as tasks_search from "../tasks/search.js";
import type * as tasks_shared from "../tasks/shared.js";
import type * as tasks_update from "../tasks/update.js";
import type * as trades_add from "../trades/add.js";
import type * as trades_get from "../trades/get.js";
import type * as trades_list from "../trades/list.js";
import type * as trades_remove from "../trades/remove.js";
import type * as trades_search from "../trades/search.js";
import type * as trades_seed from "../trades/seed.js";
import type * as trades_shared from "../trades/shared.js";
import type * as trades_update from "../trades/update.js";
import type * as units_list from "../units/list.js";
import type * as units_seed from "../units/seed.js";
import type * as vendors_add from "../vendors/add.js";
import type * as vendors_get from "../vendors/get.js";
import type * as vendors_list from "../vendors/list.js";
import type * as vendors_remove from "../vendors/remove.js";
import type * as vendors_search from "../vendors/search.js";
import type * as vendors_seed from "../vendors/seed.js";
import type * as vendors_shared from "../vendors/shared.js";
import type * as vendors_update from "../vendors/update.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "documentFolders/add": typeof documentFolders_add;
  "documentFolders/get": typeof documentFolders_get;
  "documentFolders/list": typeof documentFolders_list;
  "documentFolders/remove": typeof documentFolders_remove;
  "documentFolders/search": typeof documentFolders_search;
  "documentFolders/seed": typeof documentFolders_seed;
  "documentFolders/seedProjectFolders": typeof documentFolders_seedProjectFolders;
  "documentFolders/shared": typeof documentFolders_shared;
  "documentFolders/update": typeof documentFolders_update;
  "fileStorage/deleteStorage": typeof fileStorage_deleteStorage;
  "fileStorage/generateS3UploadUrl": typeof fileStorage_generateS3UploadUrl;
  "fileStorage/generateUploadUrl": typeof fileStorage_generateUploadUrl;
  "fileStorage/resolvePublicUrl": typeof fileStorage_resolvePublicUrl;
  "inclusionCategories/add": typeof inclusionCategories_add;
  "inclusionCategories/list": typeof inclusionCategories_list;
  "inclusionCategories/remove": typeof inclusionCategories_remove;
  "inclusionCategories/search": typeof inclusionCategories_search;
  "inclusionCategories/shared": typeof inclusionCategories_shared;
  "inclusionCategories/update": typeof inclusionCategories_update;
  "inclusionVariants/add": typeof inclusionVariants_add;
  "inclusionVariants/getUnit": typeof inclusionVariants_getUnit;
  "inclusionVariants/listByInclusion": typeof inclusionVariants_listByInclusion;
  "inclusionVariants/migrateImageBinariesToS3": typeof inclusionVariants_migrateImageBinariesToS3;
  "inclusionVariants/migrateImageHelpers": typeof inclusionVariants_migrateImageHelpers;
  "inclusionVariants/migrateImagesToS3": typeof inclusionVariants_migrateImagesToS3;
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
  "lib/toKebabCase": typeof lib_toKebabCase;
  "locations/add": typeof locations_add;
  "locations/get": typeof locations_get;
  "locations/list": typeof locations_list;
  "locations/remove": typeof locations_remove;
  "locations/search": typeof locations_search;
  "locations/seed": typeof locations_seed;
  "locations/shared": typeof locations_shared;
  "locations/update": typeof locations_update;
  "materialColors/add": typeof materialColors_add;
  "materialColors/get": typeof materialColors_get;
  "materialColors/list": typeof materialColors_list;
  "materialColors/remove": typeof materialColors_remove;
  "materialColors/search": typeof materialColors_search;
  "materialColors/seed": typeof materialColors_seed;
  "materialColors/shared": typeof materialColors_shared;
  "materialColors/update": typeof materialColors_update;
  "orders/add": typeof orders_add;
  "orders/get": typeof orders_get;
  "orders/list": typeof orders_list;
  "orders/remove": typeof orders_remove;
  "orders/search": typeof orders_search;
  "orders/shared": typeof orders_shared;
  "orders/update": typeof orders_update;
  "permissions/getEffectiveForRoles": typeof permissions_getEffectiveForRoles;
  "permissions/list": typeof permissions_list;
  "permissions/listRoleNames": typeof permissions_listRoleNames;
  "permissions/removeRole": typeof permissions_removeRole;
  "permissions/upsertRole": typeof permissions_upsertRole;
  "projectDocuments/create": typeof projectDocuments_create;
  "projectDocuments/createFolder": typeof projectDocuments_createFolder;
  "projectDocuments/deleteFolder": typeof projectDocuments_deleteFolder;
  "projectDocuments/generateUploadUrl": typeof projectDocuments_generateUploadUrl;
  "projectDocuments/listContents": typeof projectDocuments_listContents;
  "projectDocuments/move": typeof projectDocuments_move;
  "projectDocuments/remove": typeof projectDocuments_remove;
  "projectDocuments/rename": typeof projectDocuments_rename;
  "projectDocuments/renameFolder": typeof projectDocuments_renameFolder;
  "projectDocuments/shared": typeof projectDocuments_shared;
  "projectInclusions/add": typeof projectInclusions_add;
  "projectInclusions/appendNote": typeof projectInclusions_appendNote;
  "projectInclusions/list": typeof projectInclusions_list;
  "projectInclusions/listNotes": typeof projectInclusions_listNotes;
  "projectInclusions/migrateImageBinariesToS3": typeof projectInclusions_migrateImageBinariesToS3;
  "projectInclusions/migrateImageHelpers": typeof projectInclusions_migrateImageHelpers;
  "projectInclusions/migrateImagesToS3": typeof projectInclusions_migrateImagesToS3;
  "projectInclusions/remove": typeof projectInclusions_remove;
  "projectInclusions/search": typeof projectInclusions_search;
  "projectInclusions/shared": typeof projectInclusions_shared;
  "projectInclusions/update": typeof projectInclusions_update;
  "projectServiceProviders/add": typeof projectServiceProviders_add;
  "projectServiceProviders/listByProject": typeof projectServiceProviders_listByProject;
  "projectServiceProviders/remove": typeof projectServiceProviders_remove;
  "projects/add": typeof projects_add;
  "projects/get": typeof projects_get;
  "projects/list": typeof projects_list;
  "projects/remove": typeof projects_remove;
  "projects/search": typeof projects_search;
  "projects/shared": typeof projects_shared;
  "projects/update": typeof projects_update;
  "quotations/add": typeof quotations_add;
  "quotations/approve": typeof quotations_approve;
  "quotations/generateUploadUrl": typeof quotations_generateUploadUrl;
  "quotations/list": typeof quotations_list;
  "quotations/listByProject": typeof quotations_listByProject;
  "quotations/listByProjects": typeof quotations_listByProjects;
  "quotations/remove": typeof quotations_remove;
  "quotations/search": typeof quotations_search;
  "quotations/shared": typeof quotations_shared;
  "quotations/update": typeof quotations_update;
  "serviceProviders/add": typeof serviceProviders_add;
  "serviceProviders/get": typeof serviceProviders_get;
  "serviceProviders/list": typeof serviceProviders_list;
  "serviceProviders/remove": typeof serviceProviders_remove;
  "serviceProviders/search": typeof serviceProviders_search;
  "serviceProviders/seed": typeof serviceProviders_seed;
  "serviceProviders/shared": typeof serviceProviders_shared;
  "serviceProviders/update": typeof serviceProviders_update;
  "stages/add": typeof stages_add;
  "stages/get": typeof stages_get;
  "stages/list": typeof stages_list;
  "stages/remove": typeof stages_remove;
  "stages/reorder": typeof stages_reorder;
  "stages/search": typeof stages_search;
  "stages/shared": typeof stages_shared;
  "stages/update": typeof stages_update;
  "tasks/add": typeof tasks_add;
  "tasks/get": typeof tasks_get;
  "tasks/list": typeof tasks_list;
  "tasks/listAll": typeof tasks_listAll;
  "tasks/remove": typeof tasks_remove;
  "tasks/reorder": typeof tasks_reorder;
  "tasks/search": typeof tasks_search;
  "tasks/shared": typeof tasks_shared;
  "tasks/update": typeof tasks_update;
  "trades/add": typeof trades_add;
  "trades/get": typeof trades_get;
  "trades/list": typeof trades_list;
  "trades/remove": typeof trades_remove;
  "trades/search": typeof trades_search;
  "trades/seed": typeof trades_seed;
  "trades/shared": typeof trades_shared;
  "trades/update": typeof trades_update;
  "units/list": typeof units_list;
  "units/seed": typeof units_seed;
  "vendors/add": typeof vendors_add;
  "vendors/get": typeof vendors_get;
  "vendors/list": typeof vendors_list;
  "vendors/remove": typeof vendors_remove;
  "vendors/search": typeof vendors_search;
  "vendors/seed": typeof vendors_seed;
  "vendors/shared": typeof vendors_shared;
  "vendors/update": typeof vendors_update;
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
