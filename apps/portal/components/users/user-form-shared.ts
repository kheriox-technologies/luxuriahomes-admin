import { z } from 'zod';

export const addUserFormSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().trim().email('A valid email is required'),
	phoneNumber: z.string().optional(),
	roles: z.array(z.string()),
});

export type AddUserFormValues = z.infer<typeof addUserFormSchema>;

export const emptyAddUserFormValues: AddUserFormValues = {
	firstName: '',
	lastName: '',
	email: '',
	phoneNumber: '',
	roles: [],
};

export const editUserFormSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phoneNumber: z.string().optional(),
	roles: z.array(z.string()),
});

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export function userFormFieldError(
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
