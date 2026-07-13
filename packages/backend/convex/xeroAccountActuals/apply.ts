import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';

/**
 * Reconciles synced per-account "Actual" rows for the given projects against a
 * fresh set of `entries`. Internal-only: invoked by the syncProjectFinancials
 * action. Per project (only the ones in `projectIds` — projects the sync
 * skipped are left untouched), diff-upserts:
 *   - patches an existing row whose amount changed,
 *   - inserts a row for an account that gained a non-zero actual,
 *   - deletes a row whose account is absent from this run (its actual cleared to
 *     zero, so the UI blanks it).
 */
export const apply = internalMutation({
	args: {
		projectIds: v.array(v.id('projects')),
		entries: v.array(
			v.object({
				projectId: v.id('projects'),
				accountId: v.string(),
				amount: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		// Group this run's entries by project, keyed by account for quick lookup.
		const entriesByProject = new Map<Id<'projects'>, Map<string, number>>();
		for (const entry of args.entries) {
			let byAccount = entriesByProject.get(entry.projectId);
			if (!byAccount) {
				byAccount = new Map<string, number>();
				entriesByProject.set(entry.projectId, byAccount);
			}
			byAccount.set(entry.accountId, entry.amount);
		}

		let written = 0;
		for (const projectId of args.projectIds) {
			const desired =
				entriesByProject.get(projectId) ?? new Map<string, number>();
			const existing = await ctx.db
				.query('xeroAccountActuals')
				.withIndex('by_project', (q) => q.eq('projectId', projectId))
				.collect();

			const seenAccounts = new Set<string>();
			for (const row of existing) {
				const amount = desired.get(row.accountId);
				if (amount === undefined) {
					// Account no longer has a non-zero actual — clear the stale row.
					await ctx.db.delete(row._id);
					continue;
				}
				seenAccounts.add(row.accountId);
				if (row.amount !== amount) {
					await ctx.db.patch(row._id, { amount });
					written++;
				}
			}

			for (const [accountId, amount] of desired) {
				if (seenAccounts.has(accountId)) {
					continue;
				}
				await ctx.db.insert('xeroAccountActuals', {
					projectId,
					accountId,
					amount,
				});
				written++;
			}
		}

		return written;
	},
});
