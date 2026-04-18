import type { s3 } from '@pulumi/aws';
import {
  acm,
  cloudfront,
  iam,
  lambda,
  Provider,
  route53,
  s3 as s3Sdk,
} from '@pulumi/aws';
import { appConfig, defaultTags, envName } from '../config';

const usEast1Provider = new Provider('us-east-1-provider', {
  region: 'us-east-1',
});

interface CDNInput {
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

};
