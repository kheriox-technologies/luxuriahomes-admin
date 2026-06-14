import { internalMutation } from '../_generated/server';

export const backfillOrder = internalMutation({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db.query('scheduleTasks').collect();
		const byStage = new Map<string, typeof tasks>();
		for (const task of tasks) {
			const group = byStage.get(task.stageId) ?? [];
			group.push(task);
			byStage.set(task.stageId, group);
		}
		let updated = 0;
		for (const group of byStage.values()) {
			group.sort((a, b) => a.order - b.order);
			for (let i = 0; i < group.length; i++) {
				if (group[i].order !== i) {
					await ctx.db.patch(group[i]._id, { order: i });
					updated++;
				}
			}
		}
		return { updated };
	},
});
