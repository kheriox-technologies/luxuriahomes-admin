import { z } from 'zod';

export const bannerFormSchema = z.object({
	title: z.string().trim().min(1, 'Title is required'),
	description: z.string().optional(),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

export const emptyBannerFormValues: BannerFormValues = {
	title: '',
	description: '',
};

export function bannerFormFieldError(
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
