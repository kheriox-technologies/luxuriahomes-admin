import type { Doc } from '@workspace/backend/dataModel';

// Mirrors apps/portal/components/projects/project-form-shared.tsx, but with no UI
// dependencies so it can be shared by the mobile Add/Edit project screens. Keep
// the validation rules and payload shapes in sync with the portal module.

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

export type ProjectStoredClient = Doc<'projects'>['clients'][number];

const postcodeRegex = /^\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trim = (s: string) => s.trim();

export function isAustralianState(s: string): s is AustralianState {
	return (AUSTRALIAN_STATES as readonly string[]).includes(s);
}

// --- Client draft --------------------------------------------------------

export interface AddressDraft {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

export interface ClientDraft {
	address: AddressDraft;
	company: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
}

export const emptyAddressDraft: AddressDraft = {
	street: '',
	suburb: '',
	state: '',
	postcode: '',
};

export const emptyClientDraft: ClientDraft = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	company: '',
	address: { ...emptyAddressDraft },
};

/**
 * Validates a client draft. Returns the built Convex client on success, or a
 * map of field → message on failure. Optional address is all-or-nothing.
 */
export function validateClientDraft(
	draft: ClientDraft
):
	| { ok: true; client: ProjectStoredClient }
	| { ok: false; errors: Record<string, string> } {
	const errors: Record<string, string> = {};

	if (!trim(draft.firstName)) {
		errors.firstName = 'First name is required';
	}
	if (!trim(draft.lastName)) {
		errors.lastName = 'Last name is required';
	}
	if (!emailRegex.test(trim(draft.email))) {
		errors.email = 'Enter a valid email';
	}
	if (!trim(draft.phone)) {
		errors.phone = 'Phone is required';
	}

	const a = draft.address;
	const street = trim(a.street);
	const suburb = trim(a.suburb);
	const state = trim(a.state);
	const postcode = trim(a.postcode);
	const anyAddress = Boolean(street || suburb || state || postcode);
	if (anyAddress) {
		if (!street) {
			errors['address.street'] = 'Street is required when address is provided';
		}
		if (!suburb) {
			errors['address.suburb'] = 'Suburb is required when address is provided';
		}
		if (!state) {
			errors['address.state'] = 'State is required when address is provided';
		} else if (!isAustralianState(state)) {
			errors['address.state'] = 'Select a valid Australian state';
		}
		if (!postcode) {
			errors['address.postcode'] =
				'Postcode is required when address is provided';
		} else if (!postcodeRegex.test(postcode)) {
			errors['address.postcode'] = 'Postcode must be exactly 4 digits';
		}
	}

	if (Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	const company = trim(draft.company);
	const address =
		anyAddress && isAustralianState(state)
			? { street, suburb, state, postcode }
			: undefined;

	return {
		ok: true,
		client: {
			firstName: trim(draft.firstName),
			lastName: trim(draft.lastName),
			email: trim(draft.email),
			phone: trim(draft.phone),
			...(company ? { company } : {}),
			...(address ? { address } : {}),
		},
	};
}

export function clientDraftFromStored(c: ProjectStoredClient): ClientDraft {
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

export function cloneClientAddress(
	address: NonNullable<ProjectStoredClient['address']>
): NonNullable<ProjectStoredClient['address']> {
	return {
		street: address.street,
		suburb: address.suburb,
		state: address.state,
		postcode: address.postcode,
	};
}

export function clientAddressesEqual(
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

export function clientDisplayName(c: ProjectStoredClient): string {
	return `${trim(c.firstName)} ${trim(c.lastName)}`.trim();
}

export function clientAddressLine(c: ProjectStoredClient): string {
	if (!c.address) {
		return '';
	}
	const a = c.address;
	return `${a.street}, ${a.suburb}, ${a.state} ${a.postcode}`;
}

// --- Project form --------------------------------------------------------

export interface ProjectFormValues {
	address: AddressDraft;
	name: string;
	quotePrice: number | undefined;
	startDate: Date | undefined;
	status: ProjectStatus;
	xeroTrackingOptionId: string | undefined;
}

export const emptyProjectFormValues: ProjectFormValues = {
	name: '',
	address: { ...emptyAddressDraft },
	status: 'not_started',
	startDate: undefined,
	quotePrice: undefined,
	xeroTrackingOptionId: undefined,
};

/** Field → message map of validation errors for the core project fields. */
export function validateProjectForm(
	values: ProjectFormValues
): Record<string, string> {
	const errors: Record<string, string> = {};
	if (!trim(values.name)) {
		errors.name = 'Name is required';
	}
	if (!trim(values.address.street)) {
		errors['address.street'] = 'Street is required';
	}
	if (!trim(values.address.suburb)) {
		errors['address.suburb'] = 'Suburb is required';
	}
	const state = trim(values.address.state);
	if (!state) {
		errors['address.state'] = 'State is required';
	} else if (!isAustralianState(state)) {
		errors['address.state'] = 'Select a valid Australian state';
	}
	if (!postcodeRegex.test(trim(values.address.postcode))) {
		errors['address.postcode'] = 'Postcode must be exactly 4 digits';
	}
	if (values.quotePrice !== undefined && values.quotePrice < 0) {
		errors.quotePrice = 'Quote price must be 0 or more';
	}
	return errors;
}

function sanitizeClient(c: ProjectStoredClient): ProjectStoredClient {
	const company = c.company !== undefined ? trim(c.company) : '';
	const base: ProjectStoredClient = {
		firstName: trim(c.firstName),
		lastName: trim(c.lastName),
		email: trim(c.email),
		phone: trim(c.phone),
		...(company ? { company } : {}),
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
	values: ProjectFormValues,
	clients: ProjectStoredClient[]
) {
	return {
		name: trim(values.name),
		address: {
			street: trim(values.address.street),
			suburb: trim(values.address.suburb),
			state: values.address.state as AustralianState,
			postcode: trim(values.address.postcode),
		},
		status: values.status,
		clients: clients.map(sanitizeClient),
		startDate: values.startDate ? values.startDate.getTime() : undefined,
		quotePrice: values.quotePrice,
		xeroTrackingOptionId: values.xeroTrackingOptionId,
	};
}

export function toConvexUpdatePayload(
	values: ProjectFormValues,
	clients: ProjectStoredClient[]
) {
	return {
		name: trim(values.name),
		address: {
			street: trim(values.address.street),
			suburb: trim(values.address.suburb),
			state: values.address.state as AustralianState,
			postcode: trim(values.address.postcode),
		},
		status: values.status,
		clients: clients.map(sanitizeClient),
		startDate: values.startDate ? values.startDate.getTime() : null,
		quotePrice: values.quotePrice ?? null,
		xeroTrackingOptionId: values.xeroTrackingOptionId ?? null,
	};
}

/** Best-effort extraction of a ConvexError message, with a fallback. */
export function convexErrorMessage(error: unknown, fallback: string): string {
	if (error && typeof error === 'object' && 'data' in error) {
		const data = (error as { data?: unknown }).data;
		if (data && typeof data === 'object' && 'message' in data) {
			const message = (data as { message?: unknown }).message;
			if (typeof message === 'string' && message) {
				return message;
			}
		}
	}
	return fallback;
}
