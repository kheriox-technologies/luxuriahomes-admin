import { ConvexError } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { httpAction } from '../_generated/server';

// HTTP endpoints for the Gmail add-on (apps/gmail-addon). Authenticated with
// a static bearer key (GMAIL_ADDON_API_KEY) instead of Clerk, since Apps
// Script calls these server-to-server on behalf of internal admin users.

function jsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function isAuthorized(request: Request): boolean {
	const key = process.env.GMAIL_ADDON_API_KEY;
	if (!key) {
		return false;
	}
	return request.headers.get('Authorization') === `Bearer ${key}`;
}

function errorMessage(error: unknown): string {
	if (error instanceof ConvexError) {
		const data = error.data as { message?: string } | string;
		if (typeof data === 'string') {
			return data;
		}
		return data?.message ?? 'Request failed';
	}
	if (error instanceof Error) {
		return error.message;
	}
	return 'Request failed';
}

function requireString(body: Record<string, unknown>, field: string): string {
	const value = body[field];
	if (typeof value !== 'string' || !value) {
		throw new ConvexError({
			code: 'INVALID_ARGUMENT',
			message: `${field} is required`,
		});
	}
	return value;
}

export const listProjects = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	const projects = await ctx.runQuery(
		internal.gmailAddon.queries.listProjects,
		{}
	);
	return jsonResponse(200, { projects });
});

export const listFolders = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	const projectId = new URL(request.url).searchParams.get('projectId');
	if (!projectId) {
		return jsonResponse(400, { error: 'projectId is required' });
	}
	try {
		const project = await ctx.runQuery(internal.gmailAddon.queries.getProject, {
			projectId: projectId as Id<'projects'>,
		});
		const folders = await ctx.runQuery(
			internal.projectDocuments.shared.getAllFoldersForProject,
			{ projectId: projectId as Id<'projects'> }
		);
		const sorted = folders
			.map((folder) => ({ path: folder.path, name: folder.name }))
			.sort((a, b) => a.path.localeCompare(b.path));
		return jsonResponse(200, { projectName: project.name, folders: sorted });
	} catch (error) {
		return jsonResponse(400, { error: errorMessage(error) });
	}
});

export const prepareUpload = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const projectId = requireString(body, 'projectId') as Id<'projects'>;
		const fileName = requireString(body, 'fileName');
		const contentType = requireString(body, 'contentType');
		let folderPath = typeof body.folderPath === 'string' ? body.folderPath : '';

		const newFolderName = body.newFolderName;
		if (typeof newFolderName === 'string' && newFolderName.trim()) {
			folderPath = await ctx.runMutation(
				internal.gmailAddon.mutations.ensureFolder,
				{ projectId, parentPath: folderPath, segments: [newFolderName] }
			);
		}

		const result = await ctx.runAction(
			internal.gmailAddon.actions.generateUploadUrl,
			{ projectId, folderPath, fileName, contentType }
		);
		return jsonResponse(200, { ...result, folderPath });
	} catch (error) {
		return jsonResponse(400, { error: errorMessage(error) });
	}
});

export const completeUpload = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const documentId = await ctx.runMutation(
			internal.gmailAddon.mutations.createDocument,
			{
				projectId: requireString(body, 'projectId') as Id<'projects'>,
				name: requireString(body, 'name'),
				kebabName: requireString(body, 'kebabName'),
				s3Key: requireString(body, 's3Key'),
				folderPath: typeof body.folderPath === 'string' ? body.folderPath : '',
				size: typeof body.size === 'number' ? body.size : undefined,
				mimeType: typeof body.mimeType === 'string' ? body.mimeType : undefined,
				uploadedBy: requireString(body, 'uploadedBy'),
			}
		);
		return jsonResponse(200, { documentId });
	} catch (error) {
		return jsonResponse(400, { error: errorMessage(error) });
	}
});

export const listTrades = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	const trades = await ctx.runQuery(internal.gmailAddon.queries.listTrades, {});
	return jsonResponse(200, { trades });
});

export const listServiceProviders = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	const tradeId = new URL(request.url).searchParams.get('tradeId');
	const serviceProviders = await ctx.runQuery(
		internal.gmailAddon.queries.listServiceProviders,
		{ tradeId: tradeId ? (tradeId as Id<'trades'>) : undefined }
	);
	return jsonResponse(200, { serviceProviders });
});

export const prepareQuotationUpload = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const result = await ctx.runAction(
			internal.gmailAddon.actions.generateQuotationUploadUrl,
			{
				projectId: requireString(body, 'projectId') as Id<'projects'>,
				contentType: requireString(body, 'contentType'),
				ext: requireString(body, 'ext'),
			}
		);
		return jsonResponse(200, result);
	} catch (error) {
		return jsonResponse(400, { error: errorMessage(error) });
	}
});

export const createQuotation = httpAction(async (ctx, request) => {
	if (!isAuthorized(request)) {
		return jsonResponse(401, { error: 'unauthorized' });
	}
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const price = Number(body.price);
		if (!Number.isFinite(price)) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'price must be a valid number',
			});
		}
		const quotationId = await ctx.runMutation(
			internal.gmailAddon.mutations.createQuotation,
			{
				projectId: requireString(body, 'projectId') as Id<'projects'>,
				title: requireString(body, 'title'),
				tradeId: requireString(body, 'tradeId') as Id<'trades'>,
				serviceProviderId: requireString(
					body,
					'serviceProviderId'
				) as Id<'serviceProviders'>,
				price,
				s3Key: typeof body.s3Key === 'string' ? body.s3Key : undefined,
			}
		);
		return jsonResponse(200, { quotationId });
	} catch (error) {
		return jsonResponse(400, { error: errorMessage(error) });
	}
});
