const REFERENCE_PREFIX = 'LUX';
// Crockford-ish alphabet: no I/L/O/U/0/1, so a reference read aloud or typed
// back off a printed PDF can't be transcribed wrong.
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
const REFERENCE_LENGTH = 6;
const REFERENCE_REGEX = new RegExp(
	`^${REFERENCE_PREFIX}-[${REFERENCE_ALPHABET}]{${REFERENCE_LENGTH}}$`
);
// Bytes at or above this cut off would map onto the first few letters more
// often than the rest, so they're resampled instead of taken modulo.
const REFERENCE_BYTE_CEILING = 256 - (256 % REFERENCE_ALPHABET.length);

/**
 * `LUX-7K3M9Q` — the reference printed on the quotation. Deliberately opaque:
 * a running number would tell every client how many quotations we've issued.
 * 30^6 ≈ 729M codes, and `reserveReference` re-rolls on the rare collision.
 *
 * Kept free of Convex server imports so the composer can generate the candidate
 * it displays and the mutation can confirm it with the same rules.
 */
export function generateQuotationReference(): string {
	let code = '';
	while (code.length < REFERENCE_LENGTH) {
		const bytes = new Uint8Array(REFERENCE_LENGTH);
		crypto.getRandomValues(bytes);
		for (const byte of bytes) {
			if (byte < REFERENCE_BYTE_CEILING && code.length < REFERENCE_LENGTH) {
				code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
			}
		}
	}
	return `${REFERENCE_PREFIX}-${code}`;
}

/** Whether a string is a reference this app would generate today. */
export function isQuotationReference(value: string): boolean {
	return REFERENCE_REGEX.test(value);
}
