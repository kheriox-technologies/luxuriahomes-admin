'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { z } from 'zod';

const AUSTRALIAN_STATES = [
	'ACT',
	'NSW',
	'NT',
	'QLD',
	'SA',
	'TAS',
	'VIC',
	'WA',
] as const;

export type AustralianState = (typeof AUSTRALIAN_STATES)[number];

const STATE_LABELS: Record<AustralianState, string> = {
	ACT: 'ACT — Australian Capital Territory',
	NSW: 'NSW — New South Wales',
	NT: 'NT — Northern Territory',
	QLD: 'QLD — Queensland',
	SA: 'SA — South Australia',
	TAS: 'TAS — Tasmania',
	VIC: 'VIC — Victoria',
	WA: 'WA — Western Australia',
};

const STATE_ITEMS: readonly AustralianState[] = AUSTRALIAN_STATES;

const postcodeRegex = /^\d{4}$/;

const trim = (s: string) => s.trim();

function isAustralianState(s: string): s is AustralianState {
	return (AUSTRALIAN_STATES as readonly string[]).includes(s);
}

const optionalClientAddressSchema = z
	.object({
		street: z.string(),
		suburb: z.string(),
		state: z.string(),
		postcode: z.string(),
	})
	.superRefine((a, ctx) => {
		const street = trim(a.street);
		const suburb = trim(a.suburb);
		const state = trim(a.state);
		const postcode = trim(a.postcode);
		const anyFilled = Boolean(street || suburb || state || postcode);
		if (!anyFilled) {
			return;
		}
		if (!street) {
			ctx.addIssue({
				code: 'custom',
				message: 'Street is required when client address is provided',
				path: ['street'],
			});
		}
		if (!suburb) {
			ctx.addIssue({
				code: 'custom',
				message: 'Suburb is required when client address is provided',
				path: ['suburb'],
			});
		}
		if (!state) {
			ctx.addIssue({
				code: 'custom',
				message: 'State is required when client address is provided',
				path: ['state'],
			});
		} else if (!isAustralianState(state)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Select a valid Australian state',
				path: ['state'],
			});
		}
		if (!postcode) {
			ctx.addIssue({
				code: 'custom',
				message: 'Postcode is required when client address is provided',
				path: ['postcode'],
			});
		} else if (!postcodeRegex.test(postcode)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Postcode must be exactly 4 digits',
				path: ['postcode'],
			});
		}
	});

const addProjectFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	address: z.object({
		street: z.string().trim().min(1, 'Street is required'),
		suburb: z.string().trim().min(1, 'Suburb is required'),
		state: z
			.string()
			.min(1, 'State is required')
			.refine(isAustralianState, 'Select a valid Australian state'),
		postcode: z
			.string()
			.regex(postcodeRegex, 'Postcode must be exactly 4 digits'),
	}),
	client: z.object({
		firstName: z.string().trim().min(1, 'First name is required'),
		lastName: z.string().trim().min(1, 'Last name is required'),
		email: z.string().trim().email('Enter a valid email'),
		phone: z.string().trim().min(1, 'Phone is required'),
		company: z.string(),
		address: optionalClientAddressSchema,
	}),
});

export interface AddProjectFormValues {
	address: {
		street: string;
		suburb: string;
		state: string;
		postcode: string;
	};
	client: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		company: string;
		address: {
			street: string;
			suburb: string;
			state: string;
			postcode: string;
		};
	};
	name: string;
}

const defaultFormValues: AddProjectFormValues = {
	name: '',
	address: {
		street: '',
		suburb: '',
		state: '',
		postcode: '',
	},
	client: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		company: '',
		address: {
			street: '',
			suburb: '',
			state: '',
			postcode: '',
		},
	},
};

function formatFieldErrors(errors: readonly unknown[]): string {
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

function AustralianStateCombobox({
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
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const selected = value && isAustralianState(value) ? value : null;

	return (
		<Combobox<AustralianState>
			disabled={disabled}
			items={[...STATE_ITEMS]}
			itemToStringLabel={(code) => STATE_LABELS[code]}
			onValueChange={(next) => {
				onChange(next ?? '');
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
				<ComboboxEmpty>No state found.</ComboboxEmpty>
				<ComboboxList>
					{(item: AustralianState) => (
						<ComboboxItem key={item} value={item}>
							{STATE_LABELS[item]}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}

function toConvexPayload(value: z.infer<typeof addProjectFormSchema>) {
	const companyTrimmed = trim(value.client.company);
	const ca = value.client.address;
	const clientAddressAny =
		trim(ca.street) || trim(ca.suburb) || trim(ca.state) || trim(ca.postcode);

	const clientAddress = clientAddressAny
		? {
				street: trim(ca.street),
				suburb: trim(ca.suburb),
				state: trim(ca.state) as AustralianState,
				postcode: trim(ca.postcode),
			}
		: undefined;

	return {
		name: trim(value.name),
		address: {
			street: trim(value.address.street),
			suburb: trim(value.address.suburb),
			state: value.address.state as AustralianState,
			postcode: trim(value.address.postcode),
		},
		status: 'not_started' as const,
		client: {
			firstName: trim(value.client.firstName),
			lastName: trim(value.client.lastName),
			email: trim(value.client.email),
			phone: trim(value.client.phone),
			...(companyTrimmed ? { company: companyTrimmed } : {}),
			...(clientAddress ? { address: clientAddress } : {}),
		},
	};
}

const FORM_ID = 'add-project-form';

export default function AddProjectForm() {
	const [open, setOpen] = useState(false);
	const addProject = useMutation(api.projects.add.add);

	const form = useForm({
		defaultValues: defaultFormValues,
		validators: {
			onChange: addProjectFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = addProjectFormSchema.parse(value);
			try {
				await addProject(toConvexPayload(parsed));
				toastManager.add({
					title: 'Project created',
					type: 'success',
				});
				form.reset();
				setOpen(false);
			} catch (e) {
				const message =
					e instanceof Error ? e.message : 'Could not create project';
				toastManager.add({
					description: message,
					title: 'Could not create project',
					type: 'error',
				});
			}
		},
	});

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger render={<Button variant="default">Add project</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add project</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<form.Field name="name">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Project name"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<p className="font-medium text-muted-foreground text-sm">
								Address
							</p>
							<form.Field name="address.street">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Street</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Street"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="address.suburb">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Suburb"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="address.state">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>State</FieldLabel>
												<AustralianStateCombobox
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onChange={(next) => field.handleChange(next)}
													placeholder="Select state"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="address.postcode">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="numeric"
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="0000"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
						</div>

						<Separator />

						<div className="flex flex-col gap-4">
							<p className="font-medium text-muted-foreground text-sm">
								Client
							</p>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.firstName">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>First name</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="given-name"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="First name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.lastName">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Last name</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="family-name"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Last name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.email">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Email</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="email"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Email"
													type="email"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.phone">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Phone</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="tel"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Phone"
													type="tel"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
							<form.Field name="client.company">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Company</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Company (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<p className="font-medium text-muted-foreground text-sm">
								Client address
							</p>
							<form.Field name="client.address.street">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Street</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Street (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="client.address.suburb">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Suburb (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.address.state">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>State</FieldLabel>
												<AustralianStateCombobox
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onChange={(next) => field.handleChange(next)}
													placeholder="State (optional)"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.address.postcode">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="numeric"
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Postcode (optional)"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
						</div>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<form.Subscribe
						selector={(state) => ({
							canSave:
								state.isValid && !state.isValidating && !state.isSubmitting,
						})}
					>
						{({ canSave }) => (
							<Button
								disabled={!canSave}
								form={FORM_ID}
								type="submit"
								variant="default"
							>
								Save
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
