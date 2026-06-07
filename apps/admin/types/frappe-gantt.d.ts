declare module '*.css';

declare module 'frappe-gantt' {
	export interface FrappeTask {
		custom_class?: string;
		dependencies?: string;
		end: string;
		id: string;
		name: string;
		progress: number;
		start: string;
		[key: string]: unknown;
	}

	export interface ViewModeConfig {
		column_width?: number;
		date_format?: string;
		lower_text?: string | ((d: Date, ld: Date | null, lang: string) => string);
		name: string;
		padding: string | [string, string];
		snap_at?: string;
		step: string;
		thick_line?: (d: Date) => boolean;
		upper_text?: string | ((d: Date, ld: Date | null, lang: string) => string);
		upper_text_frequency?: number;
	}

	export interface GanttOptions {
		bar_height?: number;
		container_height?: number | 'auto';
		holidays?: Record<string, unknown>;
		ignore?: unknown[];
		infinite_padding?: boolean;
		lines?: 'both' | 'horizontal' | 'vertical' | 'none';
		padding?: number;
		popup?: false | ((ctx: unknown) => void);
		readonly?: boolean;
		scroll_to?: string;
		today_button?: boolean;
		view_mode?:
			| 'Hour'
			| 'Quarter Day'
			| 'Half Day'
			| 'Day'
			| 'Week'
			| 'Month'
			| 'Year';
		view_modes?: (string | ViewModeConfig)[];
	}

	export default class Gantt {
		constructor(
			wrapper: HTMLElement | string,
			tasks: FrappeTask[],
			options?: GanttOptions
		);
		refresh(tasks: FrappeTask[]): void;
		change_view_mode(mode?: string, maintain_pos?: boolean): void;
		clear(): void;
	}
}
