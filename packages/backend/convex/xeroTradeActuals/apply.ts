import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';

/**
 * Reconciles synced per-trade "Actual" rows for the given projects against a
 * fresh set of `entries`. Internal-only: invoked by the syncProjectFinancials
 * action. Per project (only the ones in `projectIds` — projects the sync
 * skipped are left untouched), diff-upserts:
 *   - patches an existing row whose amount changed,
 *   - inserts a row for a trade that gained a non-zero actual,
 *   - deletes a row whose trade is absent from this run (its actual cleared to
 *     zero, so the UI blanks it).
 */
export const apply = internalMutation({
	args: {
		projectIds: v.array(v.id('projects')),
		entries: v.array(
			v.object({
				projectId: v.id('projects'),
				tradeId: v.id('trades'),
				amount: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		// Group this run's entries by project, keyed by trade for quick lookup.
		const entriesByProject = new Map<
			Id<'projects'>,
			Map<Id<'trades'>, number>
		>();
		for (const entry of args.entries) {
			let byTrade = entriesByProject.get(entry.projectId);
			if (!byTrade) {
				byTrade = new Map<Id<'trades'>, number>();
				entriesByProject.set(entry.projectId, byTrade);
			}
			byTrade.set(entry.tradeId, entry.amount);
		}

		let written = 0;
		for (const projectId of args.projectIds) {
			const desired =
				entriesByProject.get(projectId) ?? new Map<Id<'trades'>, number>();
			const existing = await ctx.db
				.query('xeroTradeActuals')
				.withIndex('by_project', (q) => q.eq('projectId', projectId))
				.collect();

			const seenTrades = new Set<Id<'trades'>>();
			for (const row of existing) {
				const amount = desired.get(row.tradeId);
				if (amount === undefined) {
					// Trade no longer has a non-zero actual — clear the stale row.
					await ctx.db.delete(row._id);
					continue;
				}
				seenTrades.add(row.tradeId);
				if (row.amount !== amount) {
					await ctx.db.patch(row._id, { amount });
					written++;
				}
			}

			for (const [tradeId, amount] of desired) {
				if (seenTrades.has(tradeId)) {
					continue;
				}
				await ctx.db.insert('xeroTradeActuals', {
					projectId,
					tradeId,
					amount,
				});
				written++;
			}
		}

		return written;
	},
});
