import { cn } from '@workspace/ui/lib/utils';

// The logo's intrinsic aspect ratio (from public/logo.svg viewBox 0 0 7627 3029),
// so a height class alone determines the width.
const LOGO_ASPECT = 'aspect-[7627/3029]';

// Use the single-color SVG as a mask; the box is painted with `bg-current`, so
// the logo takes the current text color.
const LOGO_MASK = {
	maskImage: 'url(/logo.svg)',
	maskPosition: 'center',
	maskRepeat: 'no-repeat',
	maskSize: 'contain',
	WebkitMaskImage: 'url(/logo.svg)',
	WebkitMaskPosition: 'center',
	WebkitMaskRepeat: 'no-repeat',
	WebkitMaskSize: 'contain',
} as const;

interface BrandLogoProps {
	/** Sizing + color, e.g. `"h-12 text-white"`. */
	className?: string;
	/** Accessible name. Omit when a labelled ancestor (e.g. a Link) covers it. */
	label?: string;
}

/**
 * Palette-aware wordmark. `public/logo.svg` is used as a CSS mask and filled
 * with the current text color, so the logo follows the active palette's
 * foreground (via the `text-white` -> `--brand-ink` inversion in `site.css`).
 * Set height + color through `className`; width comes from the aspect ratio.
 */
export function BrandLogo({ className, label }: BrandLogoProps) {
	const classes = cn('block bg-current', LOGO_ASPECT, className);
	if (label) {
		return (
			<span
				aria-label={label}
				className={classes}
				role="img"
				style={LOGO_MASK}
			/>
		);
	}
	return <span aria-hidden className={classes} style={LOGO_MASK} />;
}
