import { CONTACT, COPY, ICONS, PHOTOS } from '../brand.mjs';
import { label, page, photo, TOKENS, wordmark } from './layout.mjs';

const detail = (name, heading, lines, p, t) => `
<div class="detail">
	<svg viewBox="0 0 24 24" width="${Math.round(t.lead * 1.25)}" height="${Math.round(t.lead * 1.25)}"
		fill="none" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round"
		stroke-linejoin="round">${ICONS[name]}</svg>
	<div class="d-text">
		<div class="d-head" style="color:${p.accent}">${heading}</div>
		${lines.map((l) => `<div class="d-line" style="color:${p.ink}">${l}</div>`).join('')}
	</div>
</div>`;

/**
 * The call to action. No scrim games here — a solid brand ground so the phone
 * numbers stay readable from across a showroom, with a single photo edge to
 * keep it in the family.
 */
export function contact(ratio, p) {
	const t = TOKENS[ratio];
	const wide = ratio === '16x9';

	const css = `
.canvas{flex-direction:${wide ? 'row' : 'column'};background:${p.ground}}
.stage{position:relative;flex:none;background-size:cover;background-position:center;
	background-image:url('${photo(wide ? PHOTOS.staircase : PHOTOS.lounge)}');
	${wide ? 'width:27%;height:100%' : 'width:100%;height:26%'}}
.panel{flex:1;padding:${t.margin}px ${wide ? t.margin * 1.15 : t.margin}px}
.head{display:flex;flex-direction:column;gap:${wide ? 24 : 24}px}
.title{font-size:${Math.round(t.display * (wide ? 1.2 : 0.96))}px;line-height:1.08;
	color:${p.ink};max-width:9em}
.sub{font-size:${t.lead}px;line-height:1.58;color:${p.inkMuted};max-width:${wide ? 30 : 24}em}
.details{display:grid;grid-template-columns:${wide ? '1fr 1fr' : '1fr'};
	column-gap:${t.margin * 0.7}px;row-gap:${wide ? 34 : 26}px;
	padding-top:${wide ? 38 : 30}px;border-top:1px solid ${p.rule}}
.detail{display:flex;gap:16px;align-items:flex-start}
.detail svg{flex:none;margin-top:3px}
.d-text{display:flex;flex-direction:column;gap:6px;min-width:0}
.d-head{font-size:${t.label}px;text-transform:uppercase;letter-spacing:0.2em;font-weight:600}
.d-line{font-size:${Math.round(t.lead * 1.08)}px;line-height:1.4;font-weight:400;letter-spacing:0.01em}
.foot{display:flex;align-items:flex-end;justify-content:space-between;gap:32px}
.secondary{font-size:${t.body}px;color:${p.inkMuted};letter-spacing:0.04em;text-align:right;
	max-width:16em;line-height:1.5}
`;

	// Ordered so each column carries one two-line and one one-line detail —
	// a 2x2 of ragged heights reads as an accident.
	const details = [
		detail('phone', 'Call Us', CONTACT.phones, p, t),
		detail(
			'pin',
			'Visit Us',
			['Unit 7, 21 Technology Drive', 'Augustine Heights QLD 4300'],
			p,
			t
		),
		detail('mail', 'Email Us', [CONTACT.email], p, t),
		detail('globe', 'Online', [CONTACT.website], p, t),
	].join('');

	const body = `
<div class="stage"></div>
<div class="panel panel-flow" style="display:flex;flex-direction:column;justify-content:space-between">
	<div class="head">
		${label(COPY.secondary, p, t)}
		<h1 class="serif title">${COPY.ctaTitle}</h1>
		<p class="sub">${COPY.ctaSubtext}</p>
	</div>
	<div class="details">${details}</div>
	<div class="foot">
		${wordmark(t.logo * 1.15, p.ink)}
		<div class="secondary">${CONTACT.qbcc}</div>
	</div>
</div>`;

	return page({ ratio, palette: p, css, body });
}
