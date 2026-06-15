import { internalMutation } from '../_generated/server';

export const backfillOrder = internalMutation({
	args: {},
	handler: async (ctx) => {
		const stages = await ctx.db.query('scheduleStages').collect();
		const byTemplate = new Map<string, typeof stages>();
		for (const stage of stages) {
			const group = byTemplate.get(stage.scheduleTemplateId) ?? [];
			group.push(stage);
			byTemplate.set(stage.scheduleTemplateId, group);
		}
		let updated = 0;
		for (const group of byTemplate.values()) {
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
