import { getRandomValues, randomUUID } from 'expo-crypto';

// Hermes ships no global `crypto`. Code shared with the backend — the quotation
// reference generator behind `@workspace/backend/quotationReference`, for one —
// expects the Web Crypto surface, so install the parts expo-crypto provides
// before any screen renders. Defined rather than assigned because the global is
// a non-writable getter on some React Native versions.
if (!globalThis.crypto?.getRandomValues) {
	Object.defineProperty(globalThis, 'crypto', {
		configurable: true,
		value: { getRandomValues, randomUUID } as Crypto,
	});
}
