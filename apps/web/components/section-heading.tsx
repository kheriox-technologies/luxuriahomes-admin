import { cn } from '@workspace/ui/lib/utils';

interface SectionHeadingProps {
	align?: 'left' | 'center';
	className?: string;
	eyebrow: string;
	subtext?: string;
	title: string;
	tone?: 'light' | 'dark';
}

/** Shared eyebrow + display title + optional subtext used across sections. */
export function SectionHeading({
	eyebrow,
	title,
	subtext,
	align = 'center',
	tone = 'light',
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-4',
				align === 'center' && 'items-center text-center',
				className
			)}
		>
			<span className={cn('eyebrow', tone === 'dark' && 'eyebrow--cream')}>
				{eyebrow}
			</span>
			<h2
				className={cn(
					'font-display text-3xl leading-tight tracking-tight sm:text-4xl',
					tone === 'dark' ? 'text-white' : 'text-foreground'
				)}
			>
				{title}
			</h2>
			{subtext ? (
				<p
					className={cn(
						'max-w-2xl text-base leading-relaxed',
						tone === 'dark' ? 'text-white/70' : 'text-muted-foreground'
					)}
				>
					{subtext}
				</p>
			) : null}
		</div>
	);
}
