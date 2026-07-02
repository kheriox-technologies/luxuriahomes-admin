import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';
import { CalendarRange } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatScheduleDate } from '@/components/dashboard/dashboard-status';
import {
	SCHEDULE_TYPE_META,
	type ScheduleType,
} from '@/components/dashboard/schedule-type';

function formatDateRange(startDate?: number, endDate?: number): string | null {
	if (startDate !== undefined && endDate !== undefined) {
		return `${formatScheduleDate(startDate)} – ${formatScheduleDate(endDate)}`;
	}
	if (startDate !== undefined) {
		return formatScheduleDate(startDate);
	}
	if (endDate !== undefined) {
		return formatScheduleDate(endDate);
	}
	return null;
}

interface ScheduleCardProps {
	actions?: ReactNode;
	endDate?: number;
	href?: string;
	isOverdue?: boolean;
	startDate?: number;
	statusLabel: string;
	statusVariant: 'secondary' | 'warning' | 'success' | 'info' | 'purple';
	subtitle?: string;
	title: string;
	type: ScheduleType;
}

export default function ScheduleCard({
	actions,
	title,
	subtitle,
	startDate,
	endDate,
	href,
	isOverdue,
	statusLabel,
	statusVariant,
	type,
}: ScheduleCardProps) {
	const dateRange = formatDateRange(startDate, endDate);
	const meta = SCHEDULE_TYPE_META[type];
	const { Icon } = meta;

	return (
		<div
			className={cn(
				'relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-background py-3 pr-3 pl-4 shadow-xs/5',
				href &&
					'transition-colors duration-200 hover:border-border hover:bg-accent/40 motion-reduce:transition-none'
			)}
		>
			<span
				aria-hidden
				className={cn('absolute inset-y-0 left-0 w-1', meta.accentClass)}
			/>
			{href ? (
				<a
					className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					href={href}
					rel="noopener noreferrer"
					target="_blank"
				>
					<span className="sr-only">{`${meta.label}: ${title}`}</span>
				</a>
			) : null}
			<div className="flex items-start gap-2">
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<p className="line-clamp-2 font-medium text-sm leading-snug">
						{title}
					</p>
					{subtitle ? (
						<p className="truncate text-muted-foreground text-xs">{subtitle}</p>
					) : null}
				</div>
				<div className="relative z-10 flex items-center gap-1">
					<Badge
						aria-label={meta.label}
						size="lg"
						title={meta.label}
						variant={meta.badgeVariant}
					>
						<Icon aria-hidden />
					</Badge>
					{actions}
				</div>
			</div>
			{dateRange ? (
				<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
					<CalendarRange aria-hidden className="size-3.5 shrink-0" />
					<span className="truncate tabular-nums">{dateRange}</span>
				</div>
			) : null}
			<div className="flex flex-wrap items-center gap-1.5">
				<Badge size="lg" variant={statusVariant}>
					{statusLabel}
				</Badge>
				{isOverdue ? (
					<Badge size="lg" variant="destructive-outline">
						Overdue
					</Badge>
				) : null}
			</div>
		</div>
	);
}
