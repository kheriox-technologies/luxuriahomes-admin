import { internalMutation } from '../_generated/server';

export const backfillOffsetDays = internalMutation({
	args: {},
	handler: async (ctx) => {
		const stages = await ctx.db.query('scheduleStages').collect();
		let updated = 0;
		for (const stage of stages) {
			if (!stage.dependencyStageId && stage.offsetDays === undefined) {
				await ctx.db.patch(stage._id, { offsetDays: 0 });
				updated++;
			}
		}
		return { updated };
	},
});
