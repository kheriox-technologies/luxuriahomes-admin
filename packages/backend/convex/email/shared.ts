'use node';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConvexError } from 'convex/values';
import { OAuth2Client } from 'google-auth-library';
import MailComposer from 'nodemailer/lib/mail-composer';
import type { Id } from '../_generated/dataModel';
import type { ActionCtx } from '../_generated/server';

// The authorized mailbox sends as itself, so the message is filed in its Sent
// folder. `me` resolves to whichever account the refresh token belongs to.
const GMAIL_SEND_ENDPOINT =
	'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const BASE64_PLUS_REGEX = /\+/g;
const BASE64_SLASH_REGEX = /\//g;
const BASE64_TRAILING_EQ_REGEX = /=+$/;

export interface GmailConfig {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	sender: string;
}

export interface AttachmentInput {
	contentBase64?: string;
	contentType: string;
	filename: string;
	s3Key?: string;
	storageId?: Id<'_storage'>;
}

export interface ResolvedAttachment {
	content: Buffer;
	contentType: string;
	filename: string;
}

export interface MessageInput {
	attachments: ResolvedAttachment[];
	bcc?: string[];
	cc?: string[];
	from: string;
	html?: string;
	subject: string;
	text?: string;
	to: string[];
}

/**
 * Reads and validates the Google Workspace email configuration from the
 * Convex environment. Auth uses an OAuth2 refresh token issued for the shared
 * sender mailbox (no service-account key required).
 */
export function getGmailConfig(): GmailConfig {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
	const sender = process.env.GMAIL_SENDER;
	if (!(clientId && clientSecret && refreshToken && sender)) {
		throw new Error('Missing Google Workspace email configuration');
	}
	return { clientId, clientSecret, refreshToken, sender };
}

/**
 * Mints a short-lived Gmail access token from the stored refresh token. The
 * token belongs to the authorized sender mailbox, so sent messages are filed
 * in that mailbox's Sent folder.
 */
export async function getGmailAccessToken(
	config: GmailConfig
): Promise<string> {
	const oauth2Client = new OAuth2Client(config.clientId, config.clientSecret);
	oauth2Client.setCredentials({ refresh_token: config.refreshToken });
	const { token } = await oauth2Client.getAccessToken();
	if (!token) {
		throw new Error('Failed to obtain Gmail access token');
	}
	return token;
}

function createCdnS3Client(): { client: S3Client; bucket: string } {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;
	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}
	const client = new S3Client({
		region,
		credentials: { accessKeyId, secretAccessKey },
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
	});
	return { client, bucket };
}

function ensureSingleSource(att: AttachmentInput): void {
	const sources = [att.s3Key, att.storageId, att.contentBase64].filter(
		(source) => source !== undefined
	);
	if (sources.length !== 1) {
		throw new ConvexError({
			code: 'INVALID_ATTACHMENT',
			message: `Attachment "${att.filename}" must have exactly one source`,
		});
	}
}

async function readS3Attachment(
	client: S3Client,
	bucket: string,
	att: AttachmentInput & { s3Key: string }
): Promise<Buffer> {
	const res = await client.send(
		new GetObjectCommand({ Bucket: bucket, Key: att.s3Key })
	);
	if (!res.Body) {
		throw new ConvexError({
			code: 'ATTACHMENT_NOT_FOUND',
			message: `Stored file for "${att.filename}" was not found`,
		});
	}
	return Buffer.from(await res.Body.transformToByteArray());
}

async function readStorageAttachment(
	ctx: ActionCtx,
	att: AttachmentInput & { storageId: Id<'_storage'> }
): Promise<Buffer> {
	const blob = await ctx.storage.get(att.storageId);
	if (!blob) {
		throw new ConvexError({
			code: 'ATTACHMENT_NOT_FOUND',
			message: `Stored file for "${att.filename}" was not found`,
		});
	}
	return Buffer.from(await blob.arrayBuffer());
}

/**
 * Resolves each attachment input to raw bytes, pulling from Convex storage,
 * S3, or inline base64 as appropriate. The S3 client is created lazily so the
 * AWS configuration is only required when an S3-backed attachment is present.
 */
export async function resolveAttachments(
	ctx: ActionCtx,
	attachments: AttachmentInput[]
): Promise<ResolvedAttachment[]> {
	const resolved: ResolvedAttachment[] = [];
	let s3: { client: S3Client; bucket: string } | undefined;
	for (const att of attachments) {
		ensureSingleSource(att);
		let content: Buffer;
		if (att.contentBase64 !== undefined) {
			content = Buffer.from(att.contentBase64, 'base64');
		} else if (att.storageId !== undefined) {
			content = await readStorageAttachment(
				ctx,
				att as AttachmentInput & { storageId: Id<'_storage'> }
			);
		} else {
			s3 = s3 ?? createCdnS3Client();
			content = await readS3Attachment(
				s3.client,
				s3.bucket,
				att as AttachmentInput & { s3Key: string }
			);
		}
		resolved.push({
			filename: att.filename,
			contentType: att.contentType,
			content,
		});
	}
	return resolved;
}

/**
 * Builds an RFC822 message with attachments and returns it base64url-encoded,
 * ready for the Gmail `messages.send` API.
 */
export async function buildRawMessage(input: MessageInput): Promise<string> {
	const mail = new MailComposer({
		from: input.from,
		to: input.to,
		cc: input.cc,
		bcc: input.bcc,
		subject: input.subject,
		text: input.text,
		html: input.html,
		attachments: input.attachments.map((a) => ({
			filename: a.filename,
			content: a.content,
			contentType: a.contentType,
		})),
	});
	const message = await new Promise<Buffer>((resolve, reject) => {
		mail.compile().build((err, builtMessage) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(builtMessage);
		});
	});
	return message
		.toString('base64')
		.replace(BASE64_PLUS_REGEX, '-')
		.replace(BASE64_SLASH_REGEX, '_')
		.replace(BASE64_TRAILING_EQ_REGEX, '');
}

/**
 * Sends a base64url-encoded raw message through the Gmail API as the authorized
 * mailbox. Returns the Gmail message and thread identifiers.
 */
export async function sendGmailMessage(
	accessToken: string,
	raw: string
): Promise<{ messageId: string; threadId: string }> {
	const resp = await fetch(GMAIL_SEND_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ raw }),
	});
	if (!resp.ok) {
		const detail = await resp.text();
		throw new Error(`Gmail send failed (${resp.status}): ${detail}`);
	}
	const data = (await resp.json()) as { id: string; threadId: string };
	return { messageId: data.id, threadId: data.threadId };
}
