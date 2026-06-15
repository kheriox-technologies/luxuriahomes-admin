import { internalQuery } from '../_generated/server';

export const exportScheduleTemplates = internalQuery({
	args: {},
	handler: async (ctx) => {
		const templates = await ctx.db.query('scheduleTemplates').collect();

		const result: Array<{
			devId: string;
			name: string;
			description: string | undefined;
			stages: Array<{
				devId: string;
				name: string;
				order: number;
				dependencyStageDevId: string | undefined;
				dependencyType: 'startAfter' | 'startWith' | undefined;
				offsetDays: number | undefined;
			}>;
			tasks: Array<{
				devId: string;
				devStageId: string;
				name: string;
				durationDays: number;
				order: number;
				dependencyTaskDevId: string | undefined;
				dependencyType: 'startAfter' | 'startWith' | undefined;
				offsetDays: number | undefined;
			}>;
		}> = [];
		for (const template of templates) {
			const stages = await ctx.db
				.query('scheduleStages')
				.withIndex('by_schedule_template', (q) =>
					q.eq('scheduleTemplateId', template._id)
				)
				.collect();

			const tasks = await ctx.db
				.query('scheduleTasks')
				.withIndex('by_schedule_template', (q) =>
					q.eq('scheduleTemplateId', template._id)
				)
				.collect();

			result.push({
				devId: template._id,
				name: template.name,
				description: template.description,
				stages: stages
					.sort((a, b) => a.order - b.order)
					.map((s) => ({
						devId: s._id,
						name: s.name,
						order: s.order,
						dependencyStageDevId: s.dependencyStageId as string | undefined,
						dependencyType: s.dependencyType,
						offsetDays: s.offsetDays,
					})),
				tasks: tasks.map((t) => ({
					devId: t._id,
					devStageId: t.stageId as string,
					name: t.name,
					durationDays: t.durationDays,
					order: t.order,
					dependencyTaskDevId: t.dependencyTaskId as string | undefined,
					dependencyType: t.dependencyType,
					offsetDays: t.offsetDays,
				})),
			});
		}

		return result;
	},
});
