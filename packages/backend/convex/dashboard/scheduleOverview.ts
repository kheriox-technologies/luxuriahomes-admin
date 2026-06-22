import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { addBusinessDaysToTimestamp } from '../projectTasks/shared';

/**
 * Batch query for the dashboard board: for each selected project, return the
 * tasks, order tasks, and orders whose date range overlaps the supplied window
 * (`start <= rangeEnd && end >= rangeStart`). Doing this in a single query
 * avoids calling Convex hooks in a loop on the client.
 */
export const scheduleOverview = query({
	args: {
		projectIds: v.array(v.id('projects')),
		rangeStart: v.number(),
		rangeEnd: v.number(),
	},
	handler: async (ctx, { projectIds, rangeStart, rangeEnd }) => {
		await requireAdmin(ctx);

		return Promise.all(
			projectIds.map(async (projectId) => {
				const project = await ctx.db.get(projectId);

				// Stage names, to label each task with its parent stage.
				const stages = await ctx.db
					.query('projectStages')
					.withIndex('by_project', (q) => q.eq('projectId', projectId))
					.collect();
				const stageNameById = new Map(stages.map((s) => [s._id, s.name]));

				// projectTasks.startDate/endDate are required numbers.
				const allTasks = await ctx.db
					.query('projectTasks')
					.withIndex('by_project', (q) => q.eq('projectId', projectId))
					.collect();
				const taskById = new Map(allTasks.map((t) => [t._id, t]));

				// A task is overdue when its end date has passed and it isn't yet
				// complete. rangeStart is today-midnight, so it is the "now" boundary.
				const isTaskOverdue = (task: (typeof allTasks)[number]) =>
					task.endDate < rangeStart && task.status !== 'Complete';

				const tasks = allTasks
					.filter(
						(task) =>
							(task.startDate <= rangeEnd && task.endDate >= rangeStart) ||
							isTaskOverdue(task)
					)
					.map((task) => ({
						...task,
						stageName: stageNameById.get(task.stageId) ?? '',
						isOverdue: isTaskOverdue(task),
					}))
					.sort((a, b) => {
						if (a.isOverdue !== b.isOverdue) {
							return a.isOverdue ? -1 : 1;
						}
						return a.startDate - b.startDate;
					});

				// projectOrders.orderBy/deliverBy are optional. Map orderBy -> start
				// and deliverBy -> end (each falls back to the other), and skip
				// orders that have neither date.
				const allOrders = await ctx.db
					.query('projectOrders')
					.withIndex('by_project', (q) => q.eq('projectId', projectId))
					.collect();
				const orders = allOrders
					.map((order) => ({
						...order,
						start: order.orderBy ?? order.deliverBy,
						end: order.deliverBy ?? order.orderBy,
					}))
					.filter(
						(order) =>
							order.start !== undefined &&
							order.end !== undefined &&
							order.start <= rangeEnd &&
							order.end >= rangeStart
					)
					.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

				// Linked-order counts per order task, to convey status on the card.
				const orderCountByOrderTask = new Map<string, number>();
				for (const order of allOrders) {
					if (order.orderTaskId) {
						orderCountByOrderTask.set(
							order.orderTaskId,
							(orderCountByOrderTask.get(order.orderTaskId) ?? 0) + 1
						);
					}
				}

				// projectOrderTasks have no stored dates — derive the ordering window
				// from the parent task (start = parent start - duration business days,
				// end = parent start - 1 business day), matching the Gantt.
				const orderTasks = (
					await ctx.db
						.query('projectOrderTasks')
						.withIndex('by_project', (q) => q.eq('projectId', projectId))
						.collect()
				)
					.flatMap((orderTask) => {
						const parent = taskById.get(orderTask.parentTaskId);
						if (!parent) {
							return [];
						}
						const start = addBusinessDaysToTimestamp(
							parent.startDate,
							-orderTask.durationDays
						);
						const end = addBusinessDaysToTimestamp(parent.startDate, -1);
						if (!(start <= rangeEnd && end >= rangeStart)) {
							return [];
						}
						return [
							{
								...orderTask,
								start,
								end,
								stageName: stageNameById.get(orderTask.stageId) ?? '',
								linkedOrderCount: orderCountByOrderTask.get(orderTask._id) ?? 0,
							},
						];
					})
					.sort((a, b) => a.start - b.start);

				return {
					projectId,
					projectName: project?.name ?? 'Unknown project',
					tasks,
					orderTasks,
					orders,
				};
			})
		);
	},
});
