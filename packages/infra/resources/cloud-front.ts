import type { s3 } from '@pulumi/aws';
import {
	acm,
	cloudfront,
	iam,
	Provider,
	route53,
	s3 as s3Sdk,
} from '@pulumi/aws';
import { appConfig, defaultTags, envName } from '../config';

const usEast1Provider = new Provider('us-east-1-provider', {
	region: 'us-east-1',
});

interface CDNInput {
	cdnBucket: s3.Bucket;
	staticBucket: s3.Bucket;
}

export const createCDNDistributions = (input: CDNInput): void => {
	const baseDomain = appConfig.require('baseDomain');
	const hostedZoneId = appConfig.require('hostedZoneId');
	const appCode = appConfig.require('appCode');
	const cloudFrontNamePrefix = `${appCode}-${envName}`;

	const staticDomain =
		envName === 'prod'
			? `static.${baseDomain}`
			: `static-${envName}.${baseDomain}`;

	// Get the global certificate from us-east-1 (required for CloudFront)
	const certificate = acm.getCertificate(
		{
			domain: baseDomain,
			statuses: ['ISSUED'],
		},
		{ provider: usEast1Provider }
	);

	// Create Origin Access Controls
	const staticOAC = new cloudfront.OriginAccessControl('static-oac', {
		name: `${cloudFrontNamePrefix}-static-oac`,
		originAccessControlOriginType: 's3',
		signingBehavior: 'always',
		signingProtocol: 'sigv4',
	});

	// Static Distribution
	const staticDistribution = new cloudfront.Distribution(
		'static-distribution',
		{
			origins: [
				{
					domainName: input.staticBucket.bucketRegionalDomainName,
					originAccessControlId: staticOAC.id,
					originId: 'staticS3Origin',
				},
			],
			enabled: true,
			comment: `Static Distribution for ${envName}`,
			aliases: [staticDomain],
			defaultCacheBehavior: {
				allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
				cachedMethods: ['GET', 'HEAD'],
				targetOriginId: 'staticS3Origin',
				forwardedValues: {
					queryString: false,
					cookies: { forward: 'none' },
				},
				viewerProtocolPolicy: 'redirect-to-https',
				minTtl: 0,
				defaultTtl: 3600,
				maxTtl: 86_400,
			},
			priceClass: 'PriceClass_All',
			restrictions: {
				geoRestriction: {
					restrictionType: 'none',
				},
			},
			tags: defaultTags,
			viewerCertificate: {
				acmCertificateArn: certificate.then((cert) => cert.arn),
				sslSupportMethod: 'sni-only',
				minimumProtocolVersion: 'TLSv1.2_2021',
			},
		}
	);

	// S3 Bucket Policy for Static bucket - allows CloudFront to access the bucket
	const staticBucketPolicy = iam.getPolicyDocumentOutput({
		statements: [
			{
				principals: [
					{
						type: 'Service',
						identifiers: ['cloudfront.amazonaws.com'],
					},
				],
				actions: ['s3:GetObject'],
				resources: [input.staticBucket.arn.apply((arn) => `${arn}/*`)],
				conditions: [
					{
						test: 'StringEquals',
						variable: 'AWS:SourceArn',
						values: [staticDistribution.arn],
					},
				],
			},
		],
	});

	new s3Sdk.BucketPolicy('static-bucket-policy', {
		bucket: input.staticBucket.id,
		policy: staticBucketPolicy.json,
	});

	// Route53 records for Static distribution
	new route53.Record('static-route53-record', {
		zoneId: hostedZoneId,
		name: staticDomain,
		type: 'A',
		aliases: [
			{
				name: staticDistribution.domainName,
				zoneId: staticDistribution.hostedZoneId,
				evaluateTargetHealth: false,
			},
		],
	});

	const cdnDomain =
		envName === 'prod' ? `cdn.${baseDomain}` : `cdn-${envName}.${baseDomain}`;

	// CloudFront Public Key + Key Group for signed URL enforcement
	const cdnPublicKey = new cloudfront.PublicKey('cdn-public-key', {
		name: `${cloudFrontNamePrefix}-cdn-public-key`,
		// AWS appends a trailing newline to stored keys; normalize to prevent perpetual diff
		encodedKey: `${appConfig.require('cdnPublicKey').trim()}\n`,
		comment: `CDN signed-URL public key for ${envName}`,
	});

	const cdnKeyGroup = new cloudfront.KeyGroup('cdn-key-group', {
		name: `${cloudFrontNamePrefix}-cdn-key-group`,
		items: [cdnPublicKey.id],
		comment: `CDN key group for ${envName}`,
	});

	const cdnOAC = new cloudfront.OriginAccessControl('cdn-oac', {
		name: `${cloudFrontNamePrefix}-cdn-oac`,
		originAccessControlOriginType: 's3',
		signingBehavior: 'always',
		signingProtocol: 'sigv4',
	});

	const cdnCorsPolicy = new cloudfront.ResponseHeadersPolicy(
		'cdn-cors-policy',
		{
			name: `${cloudFrontNamePrefix}-cdn-cors-policy`,
			corsConfig: {
				accessControlAllowCredentials: false,
				accessControlAllowHeaders: { items: ['*'] },
				accessControlAllowMethods: { items: ['GET', 'HEAD', 'OPTIONS'] },
				accessControlAllowOrigins: { items: ['*'] },
				accessControlMaxAgeSec: 3600,
				originOverride: true,
			},
		}
	);

	// CDN Distribution — signed URLs required (trustedKeyGroups enforces this)
	const cdnDistribution = new cloudfront.Distribution('cdn-distribution', {
		origins: [
			{
				domainName: input.cdnBucket.bucketRegionalDomainName,
				originAccessControlId: cdnOAC.id,
				originId: 'cdnS3Origin',
			},
		],
		enabled: true,
		comment: `CDN Distribution for ${envName}`,
		aliases: [cdnDomain],
		defaultCacheBehavior: {
			allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
			cachedMethods: ['GET', 'HEAD'],
			targetOriginId: 'cdnS3Origin',
			forwardedValues: {
				queryString: false,
				cookies: { forward: 'none' },
			},
			viewerProtocolPolicy: 'redirect-to-https',
			trustedKeyGroups: [cdnKeyGroup.id],
			responseHeadersPolicyId: cdnCorsPolicy.id,
			minTtl: 0,
			defaultTtl: 3600,
			maxTtl: 86_400,
		},
		priceClass: 'PriceClass_All',
		restrictions: {
			geoRestriction: {
				restrictionType: 'none',
			},
		},
		tags: defaultTags,
		viewerCertificate: {
			acmCertificateArn: certificate.then((cert) => cert.arn),
			sslSupportMethod: 'sni-only',
			minimumProtocolVersion: 'TLSv1.2_2021',
		},
	});

	// S3 Bucket Policy for CDN bucket — CloudFront-only access via OAC
	const cdnBucketPolicy = iam.getPolicyDocumentOutput({
		statements: [
			{
				principals: [
					{
						type: 'Service',
						identifiers: ['cloudfront.amazonaws.com'],
					},
				],
				actions: ['s3:GetObject'],
				resources: [input.cdnBucket.arn.apply((arn) => `${arn}/*`)],
				conditions: [
					{
						test: 'StringEquals',
						variable: 'AWS:SourceArn',
						values: [cdnDistribution.arn],
					},
				],
			},
		],
	});

	new s3Sdk.BucketPolicy('cdn-bucket-policy', {
		bucket: input.cdnBucket.id,
		policy: cdnBucketPolicy.json,
	});

	// Route53 record for CDN distribution
	new route53.Record('cdn-route53-record', {
		zoneId: hostedZoneId,
		name: cdnDomain,
		type: 'A',
		aliases: [
			{
				name: cdnDistribution.domainName,
				zoneId: cdnDistribution.hostedZoneId,
				evaluateTargetHealth: false,
			},
		],
	});
};
