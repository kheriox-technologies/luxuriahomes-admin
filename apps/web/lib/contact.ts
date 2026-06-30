import { env } from '@workspace/env/web';

/** Strips spaces and separators so a number is safe inside a tel: href. */
export function telHref(phone: string): string {
	const digits = phone.replace(/[^\d+]/g, '');
	return `tel:${digits}`;
}

export const CONTACT = {
	email: env.NEXT_PUBLIC_CONTACT_EMAIL,
	phone: env.NEXT_PUBLIC_CONTACT_PHONE,
	address: env.NEXT_PUBLIC_CONTACT_ADDRESS,
	qbccLicence: env.NEXT_PUBLIC_QBCC_LICENCE,
} as const;

/** Phone numbers parsed from the comma-separated NEXT_PUBLIC_CONTACT_PHONE. */
export const PHONES: string[] = CONTACT.phone
	.split(',')
	.map((value) => value.trim())
	.filter(Boolean);
