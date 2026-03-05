import { requireMatchingBackendUrl } from './backend-check';
import { createS3Buckets } from './resources/s3';

requireMatchingBackendUrl();
createS3Buckets();
