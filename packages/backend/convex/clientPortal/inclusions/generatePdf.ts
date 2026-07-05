'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { ConvexError, v } from 'convex/values';
import { api, internal } from '../../_generated/api';
import type { Doc } from '../../_generated/dataModel';
import { action } from '../../_generated/server';
import { checkIdentity } from '../../lib/checkIdentity';
import {
	buildInclusionsDocDefinition,
	type ProjectPdfInclusion,
	type ProjectPdfSection,
} from '../../projectInclusions/pdf/docDefinition';
import { PDF_LOGO_DATA_URL } from '../../projectInclusions/pdf/logo';
import { renderPdfToBuffer } from '../../projectInclusions/pdf/render';

// Rows returned by clientPortal/inclusions/list embed the resolved category name.
type ClientInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	categoryName: string;
};

const trailingSlash = /\/$/;
const SIGNED_URL_TTL_MS = 3_600_000;
const OTHER_CATEGORY = 'Other';

function buildSignedUrl(s3Key: string): string {
	const baseUrl = process.env.CDN_BASE_URL;
	const keyPairId = process.env.CDN_KEY_PAIR_ID;
	const privateKey = process.env.CDN_PRIVATE_KEY?.replace(/\\n/g, '\n');
	if (!(baseUrl && keyPairId && privateKey)) {
		throw new Error('Missing CDN configuration');
	}
	const url = `${baseUrl.replace(trailingSlash, '')}/${s3Key}`;
	return getSignedUrl({
		url,
		keyPairId,
		privateKey,
		dateLessThan: new Date(Date.now() + SIGNED_URL_TTL_MS).toISOString(),
	});
}

function matchesSearch(inclusion: ClientInclusion, needle: string): boolean {
	const haystack = [
		inclusion.title,
		inclusion.code,
		inclusion.vendor,
		inclusion.color ?? '',
		inclusion.models.join(' '),
		(inclusion.locations ?? []).map((l) => l.name).join(' '),
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(needle);
}

function sectionVariationTotal(inclusions: ClientInclusion[]): number {
	return inclusions.reduce(
		(sum, i) => (i.class === 'Standard' ? sum : sum + (i.variationPrice ?? 0)),
		0
	);
}

function toPdfInclusion(inclusion: ClientInclusion): ProjectPdfInclusion {
	return {
		_id: inclusion._id,
		class: inclusion.class,
		code: inclusion.code,
		color: inclusion.color,
		details: inclusion.details,
		image: inclusion.image,
		link: inclusion.link,
		locations: inclusion.locations,
		models: inclusion.models,
		status: inclusion.status,
		title: inclusion.title,
		variationPrice: inclusion.variationPrice,
		vendor: inclusion.vendor,
	};
}

function buildSections(inclusions: ClientInclusion[]): ProjectPdfSection[] {
	const buckets = new Map<string, ClientInclusion[]>();
	for (const inclusion of inclusions) {
		const key = inclusion.categoryName || OTHER_CATEGORY;
		const list = buckets.get(key) ?? [];
		list.push(inclusion);
		buckets.set(key, list);
	}
	return [...buckets.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, rows]) => {
			const sorted = [...rows].sort((a, b) => a.title.localeCompare(b.title));
			return {
				sectionId: name,
				sectionName: name,
				inclusions: sorted.map(toPdfInclusion),
				totalVariationSalePrice: sectionVariationTotal(sorted),
			};
		});
}

const PNG_SIGNATURE = '89504e47';
const JPEG_SIGNATURE = 'ffd8ff';

function detectImageMime(bytes: Buffer): 'image/png' | 'image/jpeg' | null {
	const head = bytes.subarray(0, 4).toString('hex');
	if (head.startsWith(PNG_SIGNATURE)) {
		return 'image/png';
	}
	if (head.startsWith(JPEG_SIGNATURE)) {
		return 'image/jpeg';
	}
	return null;
}

async function resolveImageDataUrl(s3Key: string): Promise<string | null> {
	try {
		const response = await fetch(buildSignedUrl(s3Key));
		if (!response.ok) {
			return null;
		}
		const bytes = Buffer.from(await response.arrayBuffer());
		const mime = detectImageMime(bytes);
		if (!mime) {
			return null;
		}
		return `data:${mime};base64,${bytes.toString('base64')}`;
	} catch {
		return null;
	}
}

async function resolveImageDataUrls(
	sections: ProjectPdfSection[]
): Promise<Map<string, string>> {
	const jobs: Promise<[string, string | null]>[] = [];
	const seen = new Set<string>();
	for (const section of sections) {
		for (const inclusion of section.inclusions) {
			const key = inclusion.image?.trim();
			if (key && !seen.has(inclusion._id)) {
				seen.add(inclusion._id);
				jobs.push(
					resolveImageDataUrl(key).then((dataUrl) => [inclusion._id, dataUrl])
				);
			}
		}
	}
	const out = new Map<string, string>();
	for (const [id, dataUrl] of await Promise.all(jobs)) {
		if (dataUrl) {
			out.set(id, dataUrl);
		}
	}
	return out;
}

function uploadPdf(projectId: string, buffer: Buffer): Promise<string> {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;
	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}
	const s3Key = `projects/${projectId}/inclusions-pdf/${crypto.randomUUID()}.pdf`;
	const client = new S3Client({
		region,
		credentials: { accessKeyId, secretAccessKey },
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
	});
	return client
		.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: s3Key,
				Body: buffer,
				ContentType: 'application/pdf',
			})
		)
		.then(() => s3Key);
}

/**
 * Client-authorized inclusions PDF, always grouped by category. Mirrors the
 * admin `projectInclusions/generatePdf` but reads only client-safe queries and
 * gates on project-client access instead of `requireAdmin`.
 */
export const generatePdf = action({
	args: {
		projectId: v.id('projects'),
		search: v.optional(v.string()),
		sectionKey: v.optional(v.string()),
	},
	returns: v.object({ s3Key: v.string(), url: v.string() }),
	handler: async (ctx, args): Promise<{ s3Key: string; url: string }> => {
		const identity = await checkIdentity(ctx);
		const allowed = await ctx.runQuery(
			internal.clientPortal.internal.isProjectClient,
			{ projectId: args.projectId, portalUserId: identity.subject }
		);
		if (!allowed) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You do not have access to this project',
			});
		}

		const [inclusions, project] = await Promise.all([
			ctx.runQuery(api.clientPortal.inclusions.list.list, {
				projectId: args.projectId,
			}),
			ctx.runQuery(api.clientPortal.projects.get.get, {
				projectId: args.projectId,
			}),
		]);

		const needle = args.search?.trim().toLowerCase() ?? '';
		const filtered = (inclusions as ClientInclusion[]).filter((inclusion) =>
			needle === '' ? true : matchesSearch(inclusion, needle)
		);

		let sections = buildSections(filtered);
		if (args.sectionKey) {
			sections = sections.filter((s) => s.sectionId === args.sectionKey);
		}

		const imageDataUrls = await resolveImageDataUrls(sections);
		const isSection = Boolean(args.sectionKey);

		const docDefinition = buildInclusionsDocDefinition(
			PDF_LOGO_DATA_URL,
			{
				address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '',
				email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
				phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
			},
			{
				clients: project.clients.map((client) => ({
					email: client.email,
					firstName: client.firstName,
					lastName: client.lastName,
					phone: client.phone,
				})),
				groupedByVendor: false,
				projectAddress: project.address,
				projectName: project.name,
				sections,
			},
			imageDataUrls,
			isSection
				? {
						hideClientSection: true,
						hideSectionHeadings: true,
						titleOverride: args.sectionKey ?? project.name,
					}
				: undefined
		);

		const buffer = await renderPdfToBuffer(docDefinition);
		const s3Key = await uploadPdf(args.projectId, buffer);
		return { s3Key, url: buildSignedUrl(s3Key) };
	},
});
