declare module 'frappe-gantt' {
	interface FrappeGanttTask {
		bar_label?: string;
		custom_class?: string;
		dependencies?: string;
		end: string;
		id: string;
		name: string;
		progress?: number;
		start: string;
		[key: string]: unknown;
	}

	interface FrappeGanttViewMode {
		column_width?: number;
		date_format?: string;
		lower_text?: (date: Date, prevDate: Date | null, lang: string) => string;
		name: string;
		padding?: string;
		step?: string | number;
		thick_line?: (date: Date) => boolean;
		upper_text?: (date: Date, prevDate: Date | null, lang: string) => string;
		upper_text_frequency?: number;
	}

	interface FrappeGanttOptions {
		bar_corner_radius?: number;
		bar_height?: number;
		column_width?: number;
		container_height?: number | 'auto';
		custom_popup_html?: ((task: FrappeGanttTask) => string) | null;
		date_format?: string;
		infinite_padding?: boolean;
		lower_header_height?: number;
		on_click?: (task: FrappeGanttTask) => void;
		on_date_change?: (task: FrappeGanttTask, start: Date, end: Date) => void;
		on_progress_change?: (task: FrappeGanttTask, progress: number) => void;
		on_view_change?: (mode: string) => void;
		padding?: number;
		popup_on?: 'click' | 'hover';
		readonly?: boolean;
		show_bar_label?: boolean;
		upper_header_height?: number;
		view_mode?: string;
		view_modes?: (FrappeGanttViewMode | string)[];
	}

	export default class Gantt {
		constructor(
			element: HTMLElement | string,
			tasks: FrappeGanttTask[],
			options?: FrappeGanttOptions
		);
		change_view_mode(mode?: string, maintain_pos?: boolean): void;
		refresh(tasks: FrappeGanttTask[]): void;
		update_tasks(tasks: FrappeGanttTask[]): void;
	}
}
