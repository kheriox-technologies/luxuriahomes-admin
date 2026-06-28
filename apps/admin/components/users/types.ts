import type { api } from '@workspace/backend/api';
import type { FunctionReturnType } from 'convex/server';

/** A single Clerk user row as returned by the `users.list` action. */
export type UserRow = FunctionReturnType<typeof api.users.list.list>[number];
