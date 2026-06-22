import { Badge } from '@workspace/ui/components/badge';
import { CalendarRange } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatScheduleDate } from '@/components/dashboard/dashboard-status';

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

type TypeLabel = 'T' | 'O' | 'OT';

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
	typeLabel: TypeLabel;
}

const TYPE_BADGE_VARIANT: Record<TypeLabel, 'info' | 'purple' | 'warning'> = {
	T: 'info',
	O: 'purple',
	OT: 'warning',
};

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
	typeLabel,
}: ScheduleCardProps) {
	const dateRange = formatDateRange(startDate, endDate);

	const baseClassName =
		'relative flex flex-col gap-2 rounded-xl border bg-background p-3 shadow-xs/5';
	const hoverClassName = href ? 'transition-colors hover:bg-accent/40' : '';

	return (
		<div className={`${baseClassName} ${hoverClassName}`}>
			{href ? (
				<a
					className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					href={href}
					rel="noopener noreferrer"
					target="_blank"
				>
					<span className="sr-only">{title}</span>
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
					<Badge size="lg" variant={TYPE_BADGE_VARIANT[typeLabel]}>
						{typeLabel}
					</Badge>
					{actions}
				</div>
			</div>
			{dateRange ? (
				<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
					<CalendarRange className="size-3.5 shrink-0" />
					<span className="truncate">{dateRange}</span>
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
