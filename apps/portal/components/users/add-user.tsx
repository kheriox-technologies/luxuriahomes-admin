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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { Check, CheckIcon, CopyIcon, Plus, PlusIcon, X } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { useRoleOptions } from './use-role-options';
import {
	addUserFormSchema,
	emptyAddUserFormValues,
	userFormFieldError,
} from './user-form-shared';
import UserRolesMultiSelect from './user-roles-multi-select';

const FORM_ID = 'add-user-form';

interface CreatedUser {
	email: string;
	password: string;
}

export default function AddUser({ onCreated }: { onCreated: () => void }) {
	const [open, setOpen] = useState(false);
	const [created, setCreated] = useState<CreatedUser | null>(null);
	const [copied, setCopied] = useState(false);
	const createUser = useAction(api.users.create.create);
	const roleOptions = useRoleOptions();

	const form = useForm({
		defaultValues: emptyAddUserFormValues,
		validators: {
			onChange: addUserFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = addUserFormSchema.parse(value);
				const result = await createUser({
					email: parsed.email,
					firstName: parsed.firstName?.trim() || undefined,
					lastName: parsed.lastName?.trim() || undefined,
					phoneNumber: parsed.phoneNumber?.trim() || undefined,
					roles: parsed.roles,
				});
				toastManager.add({ title: 'User created', type: 'success' });
				form.reset();
				setCreated({ email: parsed.email, password: result.generatedPassword });
				onCreated();
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not create user. Please try again in a moment.'
					),
					title: 'Could not create user',
					type: 'error',
				});
			}
		},
	});

	const resetAndClose = () => {
		setOpen(false);
		setCreated(null);
		setCopied(false);
		form.reset();
	};

	const copyPassword = async () => {
		if (!created) {
			return;
		}
		try {
			await navigator.clipboard.writeText(created.password);
			setCopied(true);
		} catch {
			toastManager.add({ title: 'Could not copy password', type: 'error' });
		}
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				if (nextOpen) {
					setOpen(true);
					return;
				}
				resetAndClose();
			}}
			open={open}
		>
			<DialogTrigger
				render={
					<Button variant="outline">
						<PlusIcon />
						Add User
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{created ? 'User created' : 'Add User'}</DialogTitle>
				</DialogHeader>

				{created ? (
					<DialogPanel className="flex flex-col gap-4">
						<p className="text-muted-foreground text-sm">
							{`${created.email} was created. Copy the generated password now — it won't be shown again.`}
						</p>
						<Field>
							<FieldLabel htmlFor="generated-password">
								Generated password
							</FieldLabel>
							<div className="flex items-center gap-2">
								<Input
									className="flex-1 font-mono"
									id="generated-password"
									nativeInput
									readOnly
									value={created.password}
								/>
								<Button
									aria-label="Copy password"
									onClick={() => {
										copyPassword().catch(() => {
											/* handled in copyPassword */
										});
									}}
									size="icon"
									type="button"
									variant="outline"
								>
									{copied ? <CheckIcon /> : <CopyIcon />}
								</Button>
							</div>
						</Field>
					</DialogPanel>
				) : (
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
							<form.Field name="email">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="jane@example.com"
												type="email"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{userFormFieldError(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
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
										<FieldLabel htmlFor="add-user-roles">Roles</FieldLabel>
										<UserRolesMultiSelect
											id="add-user-roles"
											onChange={(next) => field.handleChange(next)}
											options={roleOptions}
											value={field.state.value}
										/>
									</Field>
								)}
							</form.Field>
						</DialogPanel>
					</form>
				)}

				<DialogFooter>
					{created ? (
						<Button onClick={resetAndClose} type="button" variant="outline">
							<Check aria-hidden />
							Done
						</Button>
					) : (
						<>
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
								<Plus aria-hidden />
								Create User
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
