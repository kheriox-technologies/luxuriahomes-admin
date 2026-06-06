import type { s3 } from '@pulumi/aws';
import { iam } from '@pulumi/aws';
import { defaultTags, envName } from '../config';

interface IAMInput {
	cdnBucket: s3.Bucket;
	staticBucket: s3.Bucket;
}

export const createIAMResources = (input: IAMInput): void => {
	const adminFrontendUser = new iam.User(`admin-frontend-user-${envName}`, {
		name: `admin-frontend-user-${envName}`,
		forceDestroy: true,
		tags: defaultTags,
	});

	const policyDocument = iam.getPolicyDocumentOutput({
		statements: [
			{
				actions: ['s3:*'],
				resources: [
					input.cdnBucket.arn,
					input.cdnBucket.arn.apply((arn) => `${arn}/*`),
					input.staticBucket.arn,
					input.staticBucket.arn.apply((arn) => `${arn}/*`),
				],
			},
		],
	});

	const policy = new iam.Policy(`admin-frontend-policy-${envName}`, {
		name: `admin-frontend-policy-${envName}`,
		policy: policyDocument.json,
		tags: defaultTags,
	});

	new iam.UserPolicyAttachment(`admin-frontend-user-policy-${envName}`, {
		user: adminFrontendUser.name,
		policyArn: policy.arn,
	});
};
