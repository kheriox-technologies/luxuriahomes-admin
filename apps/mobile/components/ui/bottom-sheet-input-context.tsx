import { createContext, type ReactNode, useContext } from 'react';

/**
 * Signals that inputs rendered below are inside a `@gorhom/bottom-sheet` sheet.
 *
 * When true, `CenteredTextInput` renders gorhom's `BottomSheetTextInput` instead
 * of a plain `TextInput`, so the sheet's `keyboardBehavior="interactive"` can
 * track focus and lift/scroll to the focused field. Outside a sheet the value is
 * false and a plain `TextInput` is used (BottomSheetTextInput requires gorhom's
 * context and would otherwise error).
 */
const BottomSheetInputContext = createContext(false);

export function BottomSheetInputProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<BottomSheetInputContext.Provider value={true}>
			{children}
		</BottomSheetInputContext.Provider>
	);
}

export function useIsInBottomSheet(): boolean {
	return useContext(BottomSheetInputContext);
}
