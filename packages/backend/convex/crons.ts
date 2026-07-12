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

// Sync each mapped project's "Spent" value from Xero cost of sales nightly.
// 16:00 UTC ≈ 2–3am AEST, well after end-of-day bookkeeping.
crons.daily(
	'sync project spend from xero',
	{ hourUTC: 16, minuteUTC: 0 },
	internal.xero.syncProjectSpend.syncProjectSpend
);

export default crons;
