import { COPY, FEATURED, PHOTOS } from '../brand.mjs';
import {
	contactStrip,
	label,
	page,
	photo,
	TOKENS,
	wordmark,
} from './layout.mjs';

const tile = (file, area, position = 'center') =>
	`<div class="tile" style="grid-area:${area};background-position:${position};
		background-image:url('${photo(file)}')"></div>`;

/** Delivered work: a photo mosaic of the featured completed residence. */
export function portfolio(ratio, p) {
	const t = TOKENS[ratio];
	const wide = ratio === '16x9';

	const specs = FEATURED.specs
		.map((s) => `<li style="color:${p.inkMuted}">${s}</li>`)
		.join(`<li class="dot" style="background:${p.inkFaint}"></li>`);

	const mosaic = wide
		? `<div class="mosaic">
			${tile(PHOTOS.facadeDusk, 'a', 'center 62%')}${tile(PHOTOS.kitchenLiving, 'b')}
			${tile(PHOTOS.openPlan, 'c')}${tile(PHOTOS.bathTub, 'd')}
			${tile(PHOTOS.aerialPool, 'e')}
		</div>`
		: `<div class="mosaic">
			${tile(PHOTOS.facadeDusk, 'a', 'center 62%')}${tile(PHOTOS.kitchenLiving, 'b')}
			${tile(PHOTOS.aerialPool, 'c')}
		</div>`;

	const css = `
.canvas{flex-direction:${wide ? 'row' : 'column'};background:${p.ground}}
.panel{padding:${t.margin}px;${wide ? `width:38%;padding-right:${t.margin * 0.6}px` : ''}}
.stage{flex:1;position:relative;${wide ? `padding:${t.margin}px ${t.margin}px ${t.margin}px 0` : `padding:0 ${t.margin}px ${t.margin}px`}}
.mosaic{display:grid;width:100%;height:100%;gap:${wide ? 14 : 13}px;
	${
		wide
			? `grid-template-columns:1.42fr 1fr 1fr;grid-template-rows:1fr 1fr;
			   grid-template-areas:"a b c" "a d e";`
			: `grid-template-columns:1fr 1fr;grid-template-rows:1.5fr 1fr;
			   grid-template-areas:"a a" "b c";`
	}}
.tile{background-size:cover}
.panel > .wordmark{margin-bottom:10px}
.title{font-size:${wide ? Math.round(t.title * 0.94) : t.title}px;line-height:1.14;
	color:${p.ink};max-width:10em}
.sub{font-size:${t.body}px;line-height:1.6;color:${p.inkMuted};max-width:${wide ? 26 : 34}em}
.project{display:flex;flex-direction:column;gap:${wide ? 13 : 15}px}
.p-name{font-size:${Math.round(t.title * 0.72)}px;line-height:1.15;color:${p.ink};letter-spacing:0.02em}
.p-meta{font-size:${t.label}px;text-transform:uppercase;letter-spacing:0.2em;
	font-weight:600;color:${p.accent}}
.blurb{font-size:${t.rowBody}px;line-height:1.62;color:${p.inkMuted};max-width:${wide ? 26 : 40}em}
.specs{list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:${wide ? 12 : 13}px;
	font-size:${t.rowBody}px;letter-spacing:0.03em}
.dot{width:3px;height:3px;border-radius:50%;flex:none}
.head{display:flex;flex-direction:column;gap:${wide ? 20 : 22}px}
.stackGap{display:flex;flex-direction:column;gap:${wide ? 32 : 26}px}
.divider{height:1px;background:${p.rule};width:100%}
`;

	const intro = `
	<div class="head">
		${label('Our Portfolio', p, t)}
		<h1 class="serif title">${COPY.projectsTitle}</h1>
		<p class="sub">${COPY.projectsSubtext}</p>
	</div>`;

	const project = `
	<div class="project">
		<div class="p-meta">Completed ${FEATURED.completedYear} · ${FEATURED.region}</div>
		<h2 class="serif p-name">${FEATURED.name}</h2>
		<ul class="specs">${specs}</ul>
		<p class="blurb">${FEATURED.blurb}</p>
	</div>`;

	const body = wide
		? `<div class="panel">
			${wordmark(t.logo, p.ink)}
			<div class="stackGap">${intro}<div class="divider"></div>${project}</div>
			${contactStrip(p, t, 1)}
		</div>
		<div class="stage">${mosaic}</div>`
		: `<div class="panel" style="padding-bottom:${t.margin * 0.55}px">
			<div class="stackGap">${wordmark(t.logo, p.ink)}${intro}</div>
		</div>
		<div class="stage">${mosaic}</div>
		<div class="panel" style="padding-top:0">
			<div class="stackGap">${project}${contactStrip(p, t, 2)}</div>
		</div>`;

	return page({ ratio, palette: p, css, body });
}
