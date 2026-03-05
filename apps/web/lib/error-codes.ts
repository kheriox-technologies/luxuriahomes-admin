export const DEFAULT_ERROR = {
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
};

export type ErrorCode = keyof typeof ERROR_CODES;
