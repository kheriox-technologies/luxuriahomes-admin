import { CONTACT, COPY, ICONS, PHOTOS } from '../brand.mjs';
import { page, photo, TOKENS, wordmark } from './layout.mjs';

/** `#rrggbb` → `rgba(...)`, for fading a solid palette ground to nothing. */
const fade = (hex, alpha) => {
	const channels = [1, 3, 5].map((i) =>
		Number.parseInt(hex.slice(i, i + 2), 16)
	);
	return `rgba(${channels.join(', ')}, ${alpha})`;
};

const detail = (name, heading, lines, p, t, scale) => `
<div class="detail">
	<svg viewBox="0 0 24 24" width="${Math.round(t.lead * scale * 0.95)}" height="${Math.round(t.lead * scale * 0.95)}"
		fill="none" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round"
		stroke-linejoin="round">${ICONS[name]}</svg>
	<div class="d-text">
		<div class="d-head" style="color:${p.accent}">${heading}</div>
		${lines.map((l) => `<div class="d-line" style="color:${p.ink}">${l}</div>`).join('')}
	</div>
</div>`;

/**
 * The contact banner, re-weighted.
 *
 * Same world as `contact`, but the hierarchy is inverted: the wordmark leads at
 * roughly twice its usual height and the phone numbers are set at display
 * scale, while the tagline and CTA line drop to quiet supporting type. Read
 * from across a room this says "Luxuria Homes — here is how to call them",
 * which is the job of a sponsor board.
 *
 * `wide`/`tall` pick the photograph per ratio and `position` anchors its crop.
 * `blend` chooses how the photograph meets the type: `strip` butts it against
 * the panel down a hard edge, `bleed` runs it full-frame and dissolves it into
 * the ground under the contact block.
 */
const makeContactBold =
	({
		wide: widePhoto,
		tall: tallPhoto,
		position = 'center',
		blend = 'strip',
	}) =>
	(ratio, p) => {
		const t = TOKENS[ratio];
		const wide = ratio === '16x9';
		const bleeding = blend === 'bleed';
		/**
		 * Contact type is the loudest thing after the logo, so it scales hardest —
		 * eased off where the photograph has taken part of the panel width, so the
		 * street address still sets on one line.
		 */
		let detailScale = 1.44;
		if (wide) {
			detailScale = bleeding ? 1.5 : 1.62;
		}
		/**
		 * Two columns need a full-width panel. Where the photograph has taken
		 * part of it, the details stack instead — a wrapped street address reads
		 * worse than a taller block.
		 */
		const columns = wide && !bleeding ? '1fr 1fr' : '1fr';

		// Where the photograph gives way to solid ground. The panel starts only
		// once the gradient is fully opaque, so no type is ever read against
		// photographic detail.
		const solidAt = wide ? 42 : 40;
		const dissolve = bleeding
			? `linear-gradient(${wide ? 'to right' : 'to bottom'},
				${fade(p.ground, 0)} 0%, ${fade(p.ground, 0.06)} ${solidAt * 0.35}%,
				${fade(p.ground, 0.55)} ${solidAt * 0.72}%, ${p.ground} ${solidAt}%,
				${p.ground} 100%)`
			: 'none';

		const css = `
.canvas{flex-direction:${wide ? 'row' : 'column'};background:${p.ground};
	${bleeding ? 'position:relative;display:block' : ''}}
.stage{background-size:cover;background-position:${position};
	background-image:url('${photo(wide ? widePhoto : tallPhoto)}');
	${
		bleeding
			? // On the tall canvas the photograph keeps its own band rather than the
				// whole frame: cropping a landscape frame to 9:16 would leave a sliver
				// of wall where the house should be.
				`position:absolute;left:0;right:0;top:0;${wide ? 'bottom:0' : `height:${solidAt + 14}%`}`
			: `position:relative;flex:none;${wide ? 'width:22%;height:100%' : 'width:100%;height:20%'}`
	}}
.dissolve{position:absolute;inset:0;background:${dissolve}}
.panel{${bleeding ? `position:absolute;inset:0;${wide ? `left:${solidAt}%` : `top:${solidAt}%`};` : 'flex:1;'}
	padding:${wide ? t.margin * 0.9 : t.margin * 0.85}px ${wide ? t.margin * 1.1 : t.margin}px}
.head{display:flex;flex-direction:column;align-items:${wide ? 'flex-start' : 'center'};
	gap:${wide ? 26 : 22}px}
.head .wordmark{margin-left:${wide ? '-4px' : '0'}}
.tagline{font-size:${Math.round(t.label * 1.15)}px;text-transform:uppercase;
	letter-spacing:0.3em;font-weight:500;color:${p.inkFaint};
	text-align:${wide ? 'left' : 'center'}}
.details{display:grid;grid-template-columns:${columns};
	column-gap:${t.margin * 0.8}px;row-gap:${wide && !bleeding ? 44 : 30}px;
	padding-top:${wide ? 52 : 38}px;border-top:2px solid ${p.accent}}
.detail{display:flex;gap:${wide ? 20 : 18}px;align-items:flex-start}
.detail svg{flex:none;margin-top:${wide ? 12 : 10}px}
.d-text{display:flex;flex-direction:column;gap:${wide ? 8 : 6}px;min-width:0}
.d-head{font-size:${t.label}px;text-transform:uppercase;letter-spacing:0.22em;
	font-weight:600;opacity:0.9}
.d-line{font-size:${Math.round(t.lead * detailScale)}px;line-height:1.28;
	font-weight:500;letter-spacing:0.005em}
.foot{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;
	border-top:1px solid ${p.rule};padding-top:${wide ? 26 : 22}px}
.cta{font-size:${Math.round(t.body * 1.05)}px;color:${p.inkMuted};letter-spacing:0.05em;
	max-width:18em;line-height:1.45}
.secondary{font-size:${Math.round(t.body * 1.05)}px;color:${p.inkMuted};letter-spacing:0.05em;
	text-align:right;white-space:nowrap}
`;

		// Phones first and alone in the left column — the number is the conversion.
		const details = [
			detail('phone', 'Call Us', CONTACT.phones, p, t, detailScale),
			detail(
				'pin',
				'Visit Us',
				['Unit 7, 21 Technology Drive', 'Augustine Heights QLD 4300'],
				p,
				t,
				detailScale
			),
			detail('mail', 'Email Us', [CONTACT.email], p, t, detailScale),
			detail('globe', 'Online', [CONTACT.website], p, t, detailScale),
		].join('');

		const body = `
<div class="stage"></div>
${bleeding ? '<div class="dissolve"></div>' : ''}
<div class="panel panel-flow" style="display:flex;flex-direction:column;justify-content:space-between">
	<div class="head">
		${wordmark(t.logo * (wide ? 2.15 : 1.85), p.ink)}
		<div class="tagline">${COPY.tagline.join(' ').replace(',', '')}</div>
	</div>
	<div class="details">${details}</div>
	<div class="foot">
		<div class="cta">${COPY.ctaTitle}</div>
		<div class="secondary">${CONTACT.qbcc}</div>
	</div>
</div>`;

		return page({ ratio, palette: p, css, body });
	};

/** Interiors — the staircase and the lounge. */
export const contactBold = makeContactBold({
	wide: PHOTOS.staircase,
	tall: PHOTOS.lounge,
});

/**
 * The Camp Hill facade instead, run full-frame and dissolved into the ground
 * rather than cut off at a hard edge. Anchored on the house so the crop holds
 * the battened upper storey and the entry, not the street tree beside them.
 */
export const contactBoldFacade = makeContactBold({
	wide: PHOTOS.facadeDusk,
	tall: PHOTOS.facadeDusk,
	position: '22% center',
	blend: 'bleed',
});
