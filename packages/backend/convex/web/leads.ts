import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';

const MAX_FIELD_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireText(value: string, field: string, max: number): string {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_INPUT',
			message: `${field} is required`,
		});
	}
	if (trimmed.length > max) {
		throw new ConvexError({
			code: 'INVALID_INPUT',
			message: `${field} is too long`,
		});
	}
	return trimmed;
}

/**
 * Public (unauthenticated) contact-form submission. Stores the enquiry and
 * schedules an admin notification email. Intentionally NOT gated by
 * `requireAdmin`.
 */
export const submitEnquiry = mutation({
	args: {
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		phone: v.optional(v.string()),
		message: v.string(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const firstName = requireText(
			args.firstName,
			'First name',
			MAX_FIELD_LENGTH
		);
		const lastName = requireText(args.lastName, 'Last name', MAX_FIELD_LENGTH);
		const email = requireText(args.email, 'Email', MAX_FIELD_LENGTH);
		const message = requireText(args.message, 'Message', MAX_MESSAGE_LENGTH);
		const phone = args.phone?.trim() || undefined;

		if (!EMAIL_REGEX.test(email)) {
			throw new ConvexError({
				code: 'INVALID_INPUT',
				message: 'Please enter a valid email address',
			});
		}

		await ctx.db.insert('leads', {
			firstName,
			lastName,
			email,
			phone,
			message,
			status: 'new',
			createdAt: Date.now(),
		});

		await ctx.scheduler.runAfter(
			0,
			internal.email.notifyEnquiry.notifyEnquiry,
			{ firstName, lastName, email, phone, message }
		);

		return null;
	},
});
