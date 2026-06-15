import { internalMutation } from '../_generated/server';

export const backfillOffsetDays = internalMutation({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db.query('scheduleTasks').collect();
		let updated = 0;
		for (const task of tasks) {
			if (!task.dependencyTaskId && task.offsetDays === undefined) {
				await ctx.db.patch(task._id, { offsetDays: 0 });
				updated++;
			}
		}
		return { updated };
	},
});
