import type { api } from '@workspace/backend/api';
import type { FunctionReturnType } from 'convex/server';

export type WebProject = NonNullable<
	FunctionReturnType<typeof api.web.projects.get>
>;

export type WebProjectMedia = NonNullable<WebProject['media']>[number];

const STATUS_LABELS: Record<WebProject['status'], string> = {
	completed: 'Completed',
	in_progress: 'Under Construction',
};

export function statusLabel(status: WebProject['status']): string {
	return STATUS_LABELS[status];
}

/**
 * Resolves the best image key for a project card: the flagged main image, then
 * the first image in the gallery. Returns undefined when no image exists so the
 * caller can render a placeholder.
 */
export function resolveCardImageKey(project: {
	mainImageKey?: string;
	media?: WebProjectMedia[];
}): string | undefined {
	if (project.mainImageKey) {
		return project.mainImageKey;
	}
	return project.media?.find((m) => m.type === 'image')?.key;
}

export function formatArea(value: number | undefined): string | undefined {
	if (value === undefined) {
		return undefined;
	}
	return `${value.toLocaleString()} m²`;
}
