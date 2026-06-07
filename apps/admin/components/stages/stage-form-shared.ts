import { z } from 'zod';

export const stageDependencySchema = z.object({
	stageId: z.string().min(1),
	type: z.enum(['after', 'alongWith']),
});

export const stageFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	dependsOn: z.array(stageDependencySchema).default([]),
	linkedOrderIds: z.array(z.string()).default([]),
});

export type StageFormValues = z.infer<typeof stageFormSchema>;
export type StageDependency = z.infer<typeof stageDependencySchema>;

export const emptyStageFormValues: StageFormValues = {
	name: '',
	description: '',
	dependsOn: [],
	linkedOrderIds: [],
};

export function stageFormFieldError(
	errors: readonly unknown[] | undefined
): string {
	if (!errors || errors.length === 0) {
		return '';
	}
	return errors
		.map((error) =>
			error instanceof Error ? error.message : String(error ?? '')
		)
		.filter(Boolean)
		.join(' ');
}
