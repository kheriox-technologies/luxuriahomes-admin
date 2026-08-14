import { CONTACT, PEOPLE } from '../brand.mjs';
import { page, TOKENS, wordmark } from './layout.mjs';

/**
 * Brushed-gold fill. Navy gets the graduated gold of the signboard artwork;
 * linen has no metallic to imitate, so it takes a flat ink.
 */
export const goldFill = (p) =>
	p.name === 'navy'
		? 'linear-gradient(155deg, #f6e7bd 0%, #d9b667 34%, #c79a3b 58%, #efdca8 100%)'
		: `linear-gradient(155deg, ${p.ink} 0%, ${p.accent} 60%, ${p.ink} 100%)`;

const person = ({ name, phone }, align) => `
<div class="person" style="text-align:${align}">
	<div class="p-name">${name.toUpperCase()}</div>
	<div class="p-phone">${phone}</div>
</div>`;

/**
 * The signboard: no photography, no prose — the wordmark, the licence and the
 * four things a passer-by might act on, held on flat navy. Built to be read at
 * a distance from a fence, a site hoarding or a sponsor screen.
 */
export function signboard(ratio, p) {
	const t = TOKENS[ratio];
	const wide = ratio === '16x9';
	const gold = goldFill(p);

	const css = `
.canvas{flex-direction:column;justify-content:space-between;
	background:${p.name === 'navy' ? p.groundDeep : p.ground};
	padding:${wide ? t.margin * 0.8 : t.margin * 1.1}px ${t.margin}px}
.row{display:flex;align-items:flex-start;justify-content:space-between;gap:40px}
.p-name{font-size:${wide ? 56 : 46}px;font-weight:600;letter-spacing:0.06em;line-height:1.05;
	background:${gold};-webkit-background-clip:text;color:transparent}
.p-phone{font-size:${wide ? 40 : 33}px;font-weight:400;letter-spacing:0.02em;
	margin-top:${wide ? 8 : 6}px;color:${p.ink};opacity:0.92}
.lockup{display:flex;flex-direction:column;align-items:center;gap:${wide ? 22 : 20}px}
.licence{font-size:${wide ? 26 : 23}px;font-weight:400;letter-spacing:0.08em;
	color:${p.inkMuted}}
.foot{font-size:${wide ? 42 : 30}px;font-weight:500;letter-spacing:0.01em;color:${p.ink}}
`;

	const body = `
<div class="row">
	${person(PEOPLE[0], 'left')}
	${person(PEOPLE[1], 'right')}
</div>
<div class="lockup">
	${wordmark(wide ? 360 : 300, gold)}
	<div class="licence">QBCC : ${CONTACT.qbcc.replace(/\D+/g, '')}</div>
</div>
<div class="row">
	<div class="foot">${CONTACT.website}</div>
	<div class="foot">${CONTACT.email}</div>
</div>`;

	return page({ ratio, palette: p, css, body });
}
