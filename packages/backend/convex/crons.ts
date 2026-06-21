import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Refresh the cached admin users (assignee picker) once a day. Admins change
// rarely, so a daily sync keeps the tasks UI fast without per-page Clerk calls.
crons.daily(
	'sync admin users',
	{ hourUTC: 0, minuteUTC: 0 },
	internal.adminUsers.syncAdminUsers.syncAdminUsers
);

export default crons;
