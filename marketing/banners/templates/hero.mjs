import { COPY, PHOTOS } from '../brand.mjs';
import {
	contactStrip,
	label,
	page,
	photoLayer,
	TOKENS,
	wordmark,
} from './layout.mjs';

/**
 * The lead banner: the dusk facade full-bleed, with a solid brand panel holding
 * the wordmark, tagline and contact details so type never sits on photography.
 */
export function hero(ratio, p) {
	const t = TOKENS[ratio];
	const wide = ratio === '16x9';
	const display = wide ? 63 : t.display;

	const css = `
.canvas{flex-direction:${wide ? 'row' : 'column'}}
.stage{position:relative;flex:none;
	${wide ? 'width:50%;height:100%' : 'width:100%;height:54%'}}
.panel{flex:1;background:${p.ground};padding:${t.margin}px;
	${wide ? '' : `padding-top:${t.margin * 0.8}px`}}
.mid{display:flex;flex-direction:column;gap:${wide ? 24 : 24}px}
.display{font-size:${display}px;line-height:${t.displayLead};color:${p.ink}}
.desc{font-size:${t.body}px;line-height:1.62;color:${p.inkMuted};max-width:${wide ? 25 : 26}em}
.edge{position:absolute;top:0;bottom:0;left:0;width:1px;background:${p.rule};
	${wide ? '' : 'display:none'}}
`;

	const body = `
<div class="stage">${photoLayer(PHOTOS.facadeDusk, p, 'background-position:center 62%')}</div>
<div class="panel">
	<div class="edge"></div>
	${wordmark(t.logo, p.ink)}
	<div class="mid">
		${label(COPY.locale, p, t)}
		<h1 class="serif display">${COPY.tagline[0]}<br>${COPY.tagline[1]}</h1>
		<p class="desc">${COPY.description}</p>
	</div>
	${contactStrip(p, t, 2)}
</div>`;

	return page({ ratio, palette: p, css, body });
}
