import { Redirect } from 'expo-router';

// The "menu" tab never navigates — its tabPress opens the drawer instead
// (see the tabs layout). This redirect is only a safety net for deep links.
export default function MenuScreen() {
	return <Redirect href="/(app)/(tabs)/dashboard" />;
}
