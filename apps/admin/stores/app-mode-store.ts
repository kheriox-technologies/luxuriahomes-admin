import { create } from 'zustand';

export type AppMode = 'builder' | 'client';

interface AppModeState {
	mode: AppMode;
	setMode: (mode: AppMode) => void;
}

export const useAppModeStore = create<AppModeState>((set) => ({
	mode: 'client',
	setMode: (mode) => {
		set({ mode });
	},
}));
