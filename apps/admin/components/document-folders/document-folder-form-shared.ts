import { z } from 'zod';

export const documentFolderFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type DocumentFolderFormValues = z.infer<typeof documentFolderFormSchema>;

export const emptyDocumentFolderFormValues: DocumentFolderFormValues = {
	name: '',
};

export function documentFolderFormFieldError(
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
