import { requireMatchingBackendUrl } from './backend-check';
import { createCDNDistributions } from './resources/cloud-front';
import { createS3Buckets } from './resources/s3';

requireMatchingBackendUrl();
const s3Buckets = createS3Buckets();
createCDNDistributions({
  staticBucket: s3Buckets.staticBucket,
});
