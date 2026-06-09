'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CalendarIcon, XIcon } from 'lucide-react';
import { z } from 'zod';

export const AUSTRALIAN_STATES = [
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

export const STATE_LABELS: Record<AustralianState, string> = {
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

export const trim = (s: string) => s.trim();

export function isAustralianState(s: string): s is AustralianState {
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

export const clientDraftSchema = z.object({
	firstName: z.string().trim().min(1, 'First name is required'),
	lastName: z.string().trim().min(1, 'Last name is required'),
	email: z.string().trim().email('Enter a valid email'),
	phone: z.string().trim().min(1, 'Phone is required'),
	company: z.string(),
	address: optionalClientAddressSchema,
});

export type ClientDraftValues = z.infer<typeof clientDraftSchema>;

export type ProjectStoredClient = Doc<'projects'>['clients'][number];

export const emptyClientDraft: ClientDraftValues = {
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
};

export const projectCoreFormSchema = z.object({
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
	startDate: z.date().optional(),
});

export const PROJECT_STATUSES = [
	'not_started',
	'in_progress',
	'completed',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
	not_started: 'Not started',
	in_progress: 'In progress',
	completed: 'Completed',
};

export const editProjectFormSchema = projectCoreFormSchema.extend({
	status: z.enum(PROJECT_STATUSES),
});

export type ProjectCoreFormValues = z.infer<typeof projectCoreFormSchema>;
export type EditProjectFormValues = z.infer<typeof editProjectFormSchema>;

export const emptyProjectCoreFormValues = {
	name: '',
	address: {
		street: '',
		suburb: '',
		state: '',
		postcode: '',
	},
	startDate: undefined,
} as unknown as ProjectCoreFormValues;

export const emptyEditProjectFormValues = {
	...emptyProjectCoreFormValues,
	status: 'not_started',
} as unknown as EditProjectFormValues;

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

export function projectClientDisplayName(c: ProjectStoredClient): string {
	return `${trim(c.firstName)} ${trim(c.lastName)}`.trim();
}

export function projectClientEmailPhoneLine(c: ProjectStoredClient): string {
	return `${trim(c.email)} | ${trim(c.phone)}`;
}

export function projectClientAddressLine(c: ProjectStoredClient): string {
	if (!c.address) {
		return '';
	}
	const a = c.address;
	return `${a.street}, ${a.suburb}, ${a.state} ${a.postcode}`;
}

/** Convex-shaped client from a validated draft (optional address from form fields). */
export function projectClientFromDraft(
	value: ClientDraftValues
): ProjectStoredClient {
	const companyTrimmed = trim(value.company);
	const ca = value.address;
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
		firstName: trim(value.firstName),
		lastName: trim(value.lastName),
		email: trim(value.email),
		phone: trim(value.phone),
		...(companyTrimmed ? { company: companyTrimmed } : {}),
		...(clientAddress ? { address: clientAddress } : {}),
	};
}

export function cloneProjectClientAddress(
	address: NonNullable<ProjectStoredClient['address']>
): NonNullable<ProjectStoredClient['address']> {
	return {
		street: address.street,
		suburb: address.suburb,
		state: address.state,
		postcode: address.postcode,
	};
}

export function projectClientAddressesEqual(
	a: ProjectStoredClient['address'],
	b: ProjectStoredClient['address']
): boolean {
	if (!(a || b)) {
		return true;
	}
	if (!(a && b)) {
		return false;
	}
	return (
		a.street === b.street &&
		a.suburb === b.suburb &&
		a.state === b.state &&
		a.postcode === b.postcode
	);
}

export function clientDraftFromStored(
	c: ProjectStoredClient
): ClientDraftValues {
	return {
		firstName: c.firstName,
		lastName: c.lastName,
		email: c.email,
		phone: c.phone,
		company: c.company ?? '',
		address: {
			street: c.address?.street ?? '',
			suburb: c.address?.suburb ?? '',
			state: c.address?.state ?? '',
			postcode: c.address?.postcode ?? '',
		},
	};
}

function sanitizeProjectClient(c: ProjectStoredClient): ProjectStoredClient {
	const companyTrimmed = c.company !== undefined ? trim(c.company) : '';
	const base: ProjectStoredClient = {
		firstName: trim(c.firstName),
		lastName: trim(c.lastName),
		email: trim(c.email),
		phone: trim(c.phone),
		...(companyTrimmed ? { company: companyTrimmed } : {}),
	};
	if (!c.address) {
		return base;
	}
	return {
		...base,
		address: {
			street: trim(c.address.street),
			suburb: trim(c.address.suburb),
			state: c.address.state,
			postcode: trim(c.address.postcode),
		},
	};
}

export function toConvexCreatePayload(
	value: z.infer<typeof editProjectFormSchema>,
	clients: ProjectStoredClient[]
) {
	return {
		name: trim(value.name),
		address: {
			street: trim(value.address.street),
			suburb: trim(value.address.suburb),
			state: value.address.state as AustralianState,
			postcode: trim(value.address.postcode),
		},
		status: value.status,
		clients: clients.map(sanitizeProjectClient),
		startDate: value.startDate ? value.startDate.getTime() : undefined,
	};
}

export function toConvexUpdatePayload(
	value: z.infer<typeof editProjectFormSchema>,
	clients: ProjectStoredClient[]
) {
	return {
		name: trim(value.name),
		address: {
			street: trim(value.address.street),
			suburb: trim(value.address.suburb),
			state: value.address.state as AustralianState,
			postcode: trim(value.address.postcode),
		},
		status: value.status,
		clients: clients.map(sanitizeProjectClient),
		startDate: value.startDate ? value.startDate.getTime() : null,
	};
}

export function formatStartDateRelative(startDate: number): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const target = new Date(startDate);
	target.setHours(0, 0, 0, 0);

	const diffMs = target.getTime() - today.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return 'Starts today';
	}

	const isFuture = diffDays > 0;
	const absDays = Math.abs(diffDays);

	const futureBase = new Date(today);
	const pastBase = new Date(today);

	let months: number;
	let remainingDays: number;

	if (isFuture) {
		months =
			(target.getFullYear() - futureBase.getFullYear()) * 12 +
			(target.getMonth() - futureBase.getMonth());
		const afterMonths = new Date(futureBase);
		afterMonths.setMonth(afterMonths.getMonth() + months);
		remainingDays = Math.round(
			(target.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24)
		);
	} else {
		months =
			(pastBase.getFullYear() - target.getFullYear()) * 12 +
			(pastBase.getMonth() - target.getMonth());
		const afterMonths = new Date(target);
		afterMonths.setMonth(afterMonths.getMonth() + months);
		remainingDays = Math.round(
			(pastBase.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24)
		);
	}

	if (months === 0) {
		const label = absDays === 1 ? 'day' : 'days';
		return isFuture
			? `Starts in ${absDays} ${label}`
			: `Started ${absDays} Days ago`;
	}

	const monthLabel = months === 1 ? 'Month' : 'Months';
	const dayPart =
		remainingDays > 0
			? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`
			: '';
	return isFuture
		? `Starts in ${months} ${monthLabel}${dayPart}`
		: `Started ${months} ${monthLabel}${dayPart} ago`;
}

export function ProjectStartDatePicker({
	value,
	onChange,
	onBlur,
}: {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	onBlur?: () => void;
}) {
	const label = value
		? value.toLocaleDateString('en-AU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})
		: 'Select start date';

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						className="w-full justify-start font-normal"
						onBlur={onBlur}
						type="button"
						variant="outline"
					/>
				}
			>
				<CalendarIcon aria-hidden className="mr-2 size-4 opacity-60" />
				<span className={value ? '' : 'text-muted-foreground'}>{label}</span>
				{value ? (
					<span className="ml-auto">
						<XIcon
							aria-label="Clear date"
							className="size-4 opacity-60 hover:opacity-100"
							onClick={(e) => {
								e.stopPropagation();
								onChange(undefined);
							}}
						/>
					</span>
				) : null}
			</PopoverTrigger>
			<PopoverPopup align="start" side="bottom">
				<Calendar
					captionLayout="dropdown"
					mode="single"
					onSelect={(date) => {
						onChange(date ?? undefined);
					}}
					selected={value}
				/>
			</PopoverPopup>
		</Popover>
	);
}

export function AustralianStateCombobox({
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

export function ProjectStatusCombobox({
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
	value: ProjectStatus | '';
	onChange: (next: ProjectStatus) => void;
	onBlur: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const selected = PROJECT_STATUSES.includes(value as ProjectStatus)
		? (value as ProjectStatus)
		: null;

	return (
		<Combobox<ProjectStatus>
			disabled={disabled}
			items={[...PROJECT_STATUSES]}
			itemToStringLabel={(s) => PROJECT_STATUS_LABELS[s]}
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
					{(item: ProjectStatus) => (
						<ComboboxItem key={item} value={item}>
							{PROJECT_STATUS_LABELS[item]}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
