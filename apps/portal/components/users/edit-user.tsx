'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { Check, X } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { UserRow } from './types';
import { useRoleOptions } from './use-role-options';
import { editUserFormSchema } from './user-form-shared';
import UserRolesMultiSelect from './user-roles-multi-select';

const FORM_ID = 'edit-user-form';

function sameRoles(a: string[], b: string[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	const setB = new Set(b);
	return a.every((role) => setB.has(role));
}

export default function EditUser({
	user,
	trigger,
	onUpdated,
}: {
	user: UserRow;
	trigger: ReactElement;
	onUpdated: () => void;
}) {
	const [open, setOpen] = useState(false);
	const updateUser = useAction(api.users.update.update);
	const setRoles = useAction(api.users.setRoles.setRoles);
	const roleOptions = useRoleOptions();

	const form = useForm({
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
			roles: user.roles,
		},
		validators: {
			onChange: editUserFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = editUserFormSchema.parse(value);
				await updateUser({
					userId: user.userId,
					firstName: parsed.firstName?.trim() || undefined,
					lastName: parsed.lastName?.trim() || undefined,
					phoneNumber: parsed.phoneNumber ?? '',
				});
				if (!sameRoles(parsed.roles, user.roles)) {
					await setRoles({ userId: user.userId, roles: parsed.roles });
				}
				toastManager.add({ title: 'User updated', type: 'success' });
				setOpen(false);
				onUpdated();
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update user. Please try again in a moment.'
					),
					title: 'Could not update user',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					firstName: user.firstName,
					lastName: user.lastName,
					phoneNumber: user.phoneNumber,
					roles: user.roles,
				},
				{ keepDefaultValues: true }
			);
		}
	}, [form, open, user]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<form
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<DialogPanel className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Email</FieldLabel>
							<Input disabled nativeInput readOnly value={user.email} />
						</Field>
						<div className="flex flex-col gap-4 sm:flex-row">
							<form.Field name="firstName">
								{(field) => (
									<Field className="flex-1">
										<FieldLabel htmlFor={field.name}>First name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Jane"
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>
							<form.Field name="lastName">
								{(field) => (
									<Field className="flex-1">
										<FieldLabel htmlFor={field.name}>Last name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Doe"
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>
						</div>
						<form.Field name="phoneNumber">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Phone
										<span className="ml-1 text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="+15551234567"
										type="tel"
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
						<form.Field name="roles">
							{(field) => (
								<Field>
									<FieldLabel htmlFor="edit-user-roles">Roles</FieldLabel>
									<UserRolesMultiSelect
										id="edit-user-roles"
										onChange={(next) => field.handleChange(next)}
										options={roleOptions}
										value={field.state.value}
									/>
								</Field>
							)}
						</form.Field>
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								<X aria-hidden />
								Cancel
							</Button>
						}
					/>
					<Button
						disabled={
							!(
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting
							)
						}
						form={FORM_ID}
						loading={form.state.isSubmitting}
						type="submit"
						variant="outline"
					>
						<Check aria-hidden />
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
