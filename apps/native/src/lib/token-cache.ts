import { getItemAsync, setItemAsync } from 'expo-secure-store';

// Persists the Clerk session token in the device secure store so the user stays
// signed in across app restarts.
export const tokenCache = {
	getToken(key: string) {
		try {
			return getItemAsync(key);
		} catch {
			return Promise.resolve(null);
		}
	},
	saveToken(key: string, value: string) {
		return setItemAsync(key, value);
	},
};
