import type { Doc } from '@workspace/backend/dataModel';

export type { Doc, Id } from '@workspace/backend/dataModel';

/** A project document, shared between the web client portal and the mobile app. */
export type Project = Doc<'projects'>;
