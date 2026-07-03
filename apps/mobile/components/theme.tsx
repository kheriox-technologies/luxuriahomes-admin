import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	colorScheme as nativewindColorScheme,
	useColorScheme,
} from 'nativewind';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { palette } from '@/lib/theme';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

const ThemePreferenceContext = createContext<{
	preference: ThemePreference;
	setPreference: (preference: ThemePreference) => void;
}>({ preference: 'system', setPreference: () => undefined });

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [preference, setPreferenceState] = useState<ThemePreference>('system');

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
			if (stored === 'light' || stored === 'dark' || stored === 'system') {
				setPreferenceState(stored);
				nativewindColorScheme.set(stored);
			}
		});
	}, []);

	const setPreference = useCallback((next: ThemePreference) => {
		setPreferenceState(next);
		nativewindColorScheme.set(next);
		AsyncStorage.setItem(STORAGE_KEY, next);
	}, []);

	return (
		<ThemePreferenceContext.Provider value={{ preference, setPreference }}>
			{children}
		</ThemePreferenceContext.Provider>
	);
}

export function useThemePreference() {
	return useContext(ThemePreferenceContext);
}

/** Resolved palette for non-className color needs (icons, navigation). */
export function useThemeColors() {
	const { colorScheme } = useColorScheme();
	return palette[colorScheme === 'dark' ? 'dark' : 'light'];
}
