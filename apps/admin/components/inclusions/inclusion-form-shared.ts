import { z } from 'zod';

export const inclusionFormSchema = z
	.object({
		title: z.string().trim().min(1, 'Title is required'),
		categoryId: z.string(),
		newCategoryName: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (!(data.newCategoryName?.trim() || data.categoryId)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Category is required',
				path: ['categoryId'],
			});
		}
	});

export type InclusionFormValues = z.infer<typeof inclusionFormSchema>;

export const inclusionVariantClasses = [
	'Standard',
	'Gold',
	'Platinum',
] as const;

export type InclusionVariantClass = (typeof inclusionVariantClasses)[number];

const moneyPattern = /^\d+(\.\d{1,2})?$/;

const moneyStringSchema = z
	.string()
	.trim()
	.min(1, 'Amount is required')
	.regex(moneyPattern, 'Enter a valid amount (up to 2 decimals)');

export const addInclusionVariantFormSchema = z.object({
	class: z.enum(inclusionVariantClasses),
	vendor: z.string().trim().min(1, 'Vendor is required'),
	models: z
		.array(z.string().trim().min(1, 'Model cannot be empty'))
		.min(1, 'Add at least one model'),
	color: z.string().optional(),
	costPrice: moneyStringSchema,
	salePrice: moneyStringSchema,
	details: z.string().optional(),
	link: z.string().optional(),
	image: z.string().optional(),
	storageId: z.string().optional(),
});

export type AddInclusionVariantFormValues = z.infer<
	typeof addInclusionVariantFormSchema
>;

export const emptyInclusionFormValues: {
	title: string;
	categoryId: string;
	newCategoryName: string;
} = {
	title: '',
	categoryId: '',
	newCategoryName: '',
};

export const emptyAddInclusionVariantFormValues: AddInclusionVariantFormValues =
	{
		class: 'Standard',
		vendor: '',
		models: [],
		color: '',
		costPrice: '',
		salePrice: '',
		details: '',
		link: '',
		image: '',
		storageId: '',
	};

export function inclusionFormFieldError(
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

export function parseMoneyString(value: string): number {
	const normalized = value.trim();
	if (!moneyPattern.test(normalized)) {
		throw new Error('Invalid money value');
	}
	return Number(normalized);
}

export function normalizeOptionalText(
	value: string | undefined
): string | undefined {
	const normalized = value?.trim();
	if (!normalized) {
		return undefined;
	}
	return normalized;
}

export function formatVariantBadgeLabel(count: number): string {
	if (count === 1) {
		return '1 Variant';
	}
	return `${count} Variants`;
}
