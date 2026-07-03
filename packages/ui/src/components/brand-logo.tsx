import { cn } from '@workspace/ui/lib/utils';

// The logo's intrinsic aspect ratio (from logo.svg viewBox 0 0 7627 3029),
// so a height class alone determines the width.
const LOGO_ASPECT = 'aspect-[7627/3029]';

// Default mask asset. Each consuming app serves this from its own `public/`.
const DEFAULT_MASK_URL = '/logo.svg';

interface BrandLogoProps {
	/** Sizing + color, e.g. `"h-12 text-sidebar-foreground"`. */
	className?: string;
	/** Accessible name. Omit when a labelled ancestor (e.g. a Link) covers it. */
	label?: string;
	/** Root-relative URL of the mask SVG. Defaults to `/logo.svg`. */
	maskUrl?: string;
}

/**
 * Palette-aware wordmark. The single-color SVG at `maskUrl` is used as a CSS
 * mask and the box is painted with `bg-current`, so the logo takes on the
 * current text color and follows the active foreground (e.g. the sidebar ink).
 * Set height + color through `className`; width comes from the aspect ratio.
 */
export function BrandLogo({
	className,
	label,
	maskUrl = DEFAULT_MASK_URL,
}: BrandLogoProps) {
	const url = `url(${maskUrl})`;
	const maskStyle = {
		maskImage: url,
		maskPosition: 'center',
		maskRepeat: 'no-repeat',
		maskSize: 'contain',
		WebkitMaskImage: url,
		WebkitMaskPosition: 'center',
		WebkitMaskRepeat: 'no-repeat',
		WebkitMaskSize: 'contain',
	} as const;
	const classes = cn('block bg-current', LOGO_ASPECT, className);
	if (label) {
		return (
			<span
				aria-label={label}
				className={classes}
				role="img"
				style={maskStyle}
			/>
		);
	}
	return <span aria-hidden className={classes} style={maskStyle} />;
}
