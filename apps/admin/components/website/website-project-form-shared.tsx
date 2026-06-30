'use client';

import { useForm } from '@tanstack/react-form';
import type { Doc } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Bath,
	Bed,
	BookOpen,
	Building2,
	Car,
	LandPlot,
	type LucideIcon,
	Sofa,
} from 'lucide-react';
import { z } from 'zod';

export type WebsiteProject = Doc<'websiteProjects'>;

export const WEBSITE_PROJECT_STATUSES = ['completed', 'in_progress'] as const;

export type WebsiteProjectStatus = (typeof WEBSITE_PROJECT_STATUSES)[number];

export const WEBSITE_PROJECT_STATUS_LABELS: Record<
	WebsiteProjectStatus,
	string
> = {
	completed: 'Completed',
	in_progress: 'In progress',
};

export function websiteProjectStatusBadge(status: WebsiteProjectStatus): {
	label: string;
	variant: 'success' | 'warning';
} {
	return status === 'completed'
		? { label: 'Completed', variant: 'success' }
		: { label: 'In progress', variant: 'warning' };
}

/** Optional numeric spec fields, in display order. Reused by form, list, detail. */
export const WEBSITE_PROJECT_SPECS = [
	{ key: 'beds', label: 'Beds', icon: Bed, unit: '' },
	{ key: 'baths', label: 'Baths', icon: Bath, unit: '' },
	{ key: 'cars', label: 'Cars', icon: Car, unit: '' },
	{ key: 'living', label: 'Living', icon: Sofa, unit: '' },
	{ key: 'study', label: 'Study', icon: BookOpen, unit: '' },
	{ key: 'landArea', label: 'Land area', icon: LandPlot, unit: 'm²' },
	{ key: 'buildingArea', label: 'Building area', icon: Building2, unit: 'm²' },
] as const satisfies ReadonlyArray<{
	key: keyof WebsiteProjectFormValues & string;
	label: string;
	icon: LucideIcon;
	unit: string;
}>;

export type WebsiteProjectSpecKey =
	(typeof WEBSITE_PROJECT_SPECS)[number]['key'];

const optionalNonNegative = z
	.number()
	.nonnegative('Must be 0 or more')
	.optional();

export const websiteProjectFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	status: z.enum(WEBSITE_PROJECT_STATUSES),
	completedYear: z
		.number()
		.int('Enter a valid year')
		.min(1900, 'Enter a valid year')
		.max(2100, 'Enter a valid year')
		.optional(),
	beds: optionalNonNegative,
	baths: optionalNonNegative,
	cars: optionalNonNegative,
	living: optionalNonNegative,
	study: optionalNonNegative,
	landArea: optionalNonNegative,
	buildingArea: optionalNonNegative,
	hasPool: z.boolean(),
	include: z.boolean(),
});

export type WebsiteProjectFormValues = z.infer<typeof websiteProjectFormSchema>;

export const emptyWebsiteProjectFormValues = {
	name: '',
	description: '',
	status: 'in_progress',
	completedYear: undefined,
	beds: undefined,
	baths: undefined,
	cars: undefined,
	living: undefined,
	study: undefined,
	landArea: undefined,
	buildingArea: undefined,
	hasPool: false,
	include: false,
} as unknown as WebsiteProjectFormValues;

export function websiteProjectDocToFormDefaults(
	project: WebsiteProject
): WebsiteProjectFormValues {
	return {
		name: project.name,
		description: project.description ?? '',
		status: project.status,
		completedYear: project.completedYear,
		beds: project.beds,
		baths: project.baths,
		cars: project.cars,
		living: project.living,
		study: project.study,
		landArea: project.landArea,
		buildingArea: project.buildingArea,
		hasPool: project.hasPool ?? false,
		include: project.include,
	};
}

export function toWebsiteProjectCreatePayload(value: WebsiteProjectFormValues) {
	const description = value.description?.trim();
	return {
		name: value.name.trim(),
		description: description ? description : undefined,
		status: value.status,
		completedYear: value.completedYear,
		beds: value.beds,
		baths: value.baths,
		cars: value.cars,
		living: value.living,
		study: value.study,
		landArea: value.landArea,
		buildingArea: value.buildingArea,
		hasPool: value.hasPool,
		include: value.include,
	};
}

export function toWebsiteProjectUpdatePayload(value: WebsiteProjectFormValues) {
	const description = value.description?.trim();
	return {
		name: value.name.trim(),
		description: description ? description : null,
		status: value.status,
		completedYear: value.completedYear ?? null,
		beds: value.beds ?? null,
		baths: value.baths ?? null,
		cars: value.cars ?? null,
		living: value.living ?? null,
		study: value.study ?? null,
		landArea: value.landArea ?? null,
		buildingArea: value.buildingArea ?? null,
		hasPool: value.hasPool,
		include: value.include,
	};
}

/**
 * Shared TanStack form instance for the website project add/edit sheets. Exposing
 * it as a hook gives the shared fields component (`WebsiteProjectFormFields`) a
 * precise form type without leaking generics or `any`.
 */
export function useWebsiteProjectForm(
	onSubmit: (value: WebsiteProjectFormValues) => Promise<void>
) {
	return useForm({
		defaultValues: emptyWebsiteProjectFormValues,
		validators: {
			onChange: websiteProjectFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(websiteProjectFormSchema.parse(value));
		},
	});
}

export type WebsiteProjectFormApi = ReturnType<typeof useWebsiteProjectForm>;

export function formatFieldErrors(errors: readonly unknown[]): string {
	return errors
		.map((e) => {
			if (typeof e === 'string') {
				return e;
			}
			if (e && typeof e === 'object' && 'message' in e) {
				const m = (e as { message?: unknown }).message;
				return typeof m === 'string' ? m : String(e);
			}
			return String(e);
		})
		.filter(Boolean)
		.join(' ');
}

export function WebsiteProjectStatusCombobox({
	id,
	disabled,
	value,
	onChange,
	onBlur,
	placeholder,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	value: WebsiteProjectStatus | '';
	onChange: (next: WebsiteProjectStatus) => void;
	onBlur: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const selected = WEBSITE_PROJECT_STATUSES.includes(
		value as WebsiteProjectStatus
	)
		? (value as WebsiteProjectStatus)
		: null;

	return (
		<Combobox<WebsiteProjectStatus>
			disabled={disabled}
			items={[...WEBSITE_PROJECT_STATUSES]}
			itemToStringLabel={(s) => WEBSITE_PROJECT_STATUS_LABELS[s]}
			onValueChange={(next) => {
				if (next) {
					onChange(next);
				}
			}}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={placeholder}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No status found.</ComboboxEmpty>
				<ComboboxList>
					{(item: WebsiteProjectStatus) => (
						<ComboboxItem key={item} value={item}>
							{WEBSITE_PROJECT_STATUS_LABELS[item]}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
