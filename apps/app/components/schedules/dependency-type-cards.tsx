'use client';

import { cn } from '@workspace/ui/lib/utils';

interface DependencyTypeCardsProps {
	disabled?: boolean;
	label?: string;
	onChange: (next: 'startAfter' | 'startWith') => void;
	value: 'startAfter' | 'startWith';
}

const OPTIONS = [
	{
		value: 'startAfter' as const,
		label: 'Start After',
		description: 'Begins the day after the dependency ends',
	},
	{
		value: 'startWith' as const,
		label: 'Start With',
		description: 'Begins on the same day as the dependency',
	},
];

export default function DependencyTypeCards({
	value,
	onChange,
	disabled,
	label = 'Dependency type',
}: DependencyTypeCardsProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="font-medium text-sm">{label}</span>
			<div className="grid grid-cols-2 gap-3">
				{OPTIONS.map((option) => {
					const selected = value === option.value;
					return (
						<button
							className={cn(
								'flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors',
								selected
									? 'border-primary bg-primary/5'
									: 'border-border bg-background hover:border-primary/40',
								disabled && 'cursor-not-allowed opacity-50'
							)}
							disabled={disabled}
							key={option.value}
							onClick={() => onChange(option.value)}
							type="button"
						>
							<span className="font-medium text-sm">{option.label}</span>
							<span className="text-muted-foreground text-xs">
								{option.description}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
