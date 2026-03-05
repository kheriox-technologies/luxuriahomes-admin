import { s3 } from '@pulumi/aws';
import { appConfig, defaultTags, envName } from '../config';

interface S3Buckets {
	configBucket: s3.Bucket;
}

export const createS3Buckets = (): S3Buckets => {
	const bucketNamePrefix = `${appConfig.require('regionCode')}-${appConfig.require('appCode')}-${envName}`;
	const commonBucketArgs: s3.BucketArgs = {
		forceDestroy: false,
		tags: {
			...defaultTags,
		},
	};

	const corsRules = [
		{
			allowedHeaders: ['*'],
			allowedMethods: ['GET', 'HEAD', 'PUT', 'POST'],
			allowedOrigins: ['*'],
			exposeHeaders: ['ETag'],
			maxAgeSeconds: 3600,
		},
	];

	const configBucket = new s3.Bucket('config-bucket', {
		...commonBucketArgs,
		bucket: `${bucketNamePrefix}-config`,
	});
	new s3.BucketCorsConfigurationV2('config-bucket-cors', {
		bucket: configBucket.id,
		corsRules,
	});

	return {
		configBucket,
	};
};
