// Error code → user-facing copy map. Mirrors the portal's
// apps/portal/lib/error-codes.ts so mobile and portal stay in sync.

interface ErrorDetails {
	level: 'error' | 'warning';
	message: string;
	title: string;
}

export const DEFAULT_ERROR: ErrorDetails = {
	level: 'error',
	title: 'Something Went Wrong',
	message:
		'An unexpected error occurred. Please try again or contact support if the problem persists.',
};

export const ERROR_CODES = {
	arbitrary_octopus: {
		level: 'error',
		title: 'Unauthorized Access',
		message: 'You do not have access to this page. Please contact support.',
	},
} satisfies Record<string, ErrorDetails>;

export type ErrorCode = keyof typeof ERROR_CODES;
