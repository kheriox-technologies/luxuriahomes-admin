import { COPY, PHOTOS, SERVICES } from '../brand.mjs';
import {
	contactStrip,
	label,
	page,
	photoLayer,
	TOKENS,
	wordmark,
} from './layout.mjs';

/** What Luxuria builds — the four offerings as hairline-separated rows. */
export function services(ratio, p) {
	const t = TOKENS[ratio];
	const wide = ratio === '16x9';

	const rows = SERVICES.map(
		(s) => `<li class="row" style="border-top:1px solid ${p.rule}">
		<h3 class="serif r-title" style="color:${p.ink}">${s.title}</h3>
		<p class="r-desc" style="color:${p.inkMuted}">${s.description}</p>
	</li>`
	).join('');

	// The wide canvas crops its photo into a tall column, so it takes the
	// top-down aerial; the tall canvas gets a wide band of the living pavilion.
	// The courtyard frame is shot from indoors, so any band of it catches ceiling.
	const stagePhoto = wide ? PHOTOS.aerialPool : PHOTOS.kitchenLiving;
	const stagePos = 'background-position:center';

	const css = `
.canvas{flex-direction:${wide ? 'row' : 'column'}}
.stage{position:relative;flex:none;
	${wide ? 'width:34%;height:100%' : 'width:100%;height:32%'}}
.panel{flex:1;background:${p.ground};padding:${t.margin}px}
.head{display:flex;flex-direction:column;gap:${wide ? 20 : 22}px}
.head .wordmark{margin-bottom:${wide ? 14 : 16}px}
.title{font-size:${t.title}px;line-height:1.14;color:${p.ink};max-width:${wide ? 15 : 13}em}
.sub{font-size:${t.body}px;line-height:1.6;color:${p.inkMuted};max-width:${wide ? 40 : 30}em}
.list{list-style:none;display:flex;flex-direction:column;flex:1;justify-content:center;
	margin:${wide ? 26 : 22}px 0}
.row{display:${wide ? 'grid' : 'flex'};
	${wide ? 'grid-template-columns:0.92fr 1.08fr;column-gap:44px;align-items:baseline' : 'flex-direction:column;gap:8px'};
	padding:${wide ? 24 : 20}px 0}
.r-title{font-size:${t.rowTitle}px;line-height:1.2;font-weight:500;letter-spacing:0.01em}
.r-desc{font-size:${t.rowBody}px;line-height:1.55}
`;

	const body = `
<div class="stage">${photoLayer(stagePhoto, p, stagePos)}</div>
<div class="panel">
	<div class="head">
		${wordmark(t.logo * 0.86, p.ink)}
		${label('What We Build', p, t)}
		<h1 class="serif title">${COPY.servicesTitle}</h1>
		<p class="sub">${COPY.servicesSubtext}</p>
	</div>
	<ul class="list">${rows}</ul>
	${contactStrip(p, t, wide ? 3 : 2)}
</div>`;

	return page({ ratio, palette: p, css, body });
}
