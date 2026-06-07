'use server';

import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { auth } from '@clerk/nextjs/server';

const trailingSlash = /\/$/;

function buildSignedUrl(s3Key: string): string {
	const baseUrl = process.env.NEXT_PUBLIC_CDN_URL;
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
		dateLessThan: new Date(Date.now() + 3_600_000).toISOString(),
	});
}

export async function signCdnUrl(s3Key: string): Promise<string> {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('Unauthorized');
	}
	return buildSignedUrl(s3Key);
}

export async function signCdnUrls(
	s3Keys: string[]
): Promise<Record<string, string>> {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('Unauthorized');
	}
	const result: Record<string, string> = {};
	for (const key of s3Keys) {
		result[key] = buildSignedUrl(key);
	}
	return result;
}
