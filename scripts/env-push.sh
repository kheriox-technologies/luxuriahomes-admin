#!/bin/bash

ENV=${1:-dev}
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 [dev|prod]"
  exit 1
fi

S3_BUCKET="s3://apse2-lha-${ENV}-config"

aws s3 cp apps/app/.env.local "$S3_BUCKET/app/env/.env.local"
aws s3 cp "apps/app/.env.$ENV" "$S3_BUCKET/app/env/.env.$ENV"
aws s3 cp apps/admin/.env.local "$S3_BUCKET/admin/env/.env.local"
aws s3 cp "apps/admin/.env.$ENV" "$S3_BUCKET/admin/env/.env.$ENV"
aws s3 cp apps/client/.env.local "$S3_BUCKET/client/env/.env.local"
aws s3 cp "apps/client/.env.$ENV" "$S3_BUCKET/client/env/.env.$ENV"
aws s3 cp apps/web/.env.local "$S3_BUCKET/web/env/.env.local"
aws s3 cp "apps/web/.env.$ENV" "$S3_BUCKET/web/env/.env.$ENV"
aws s3 cp packages/backend/.env.local "$S3_BUCKET/backend/env/.env.local"
aws s3 cp packages/infra/cdn_private_key.pem "$S3_BUCKET/infra/keys/cdn_private_key.pem"
aws s3 cp packages/infra/cdn_public_key.pem "$S3_BUCKET/infra/keys/cdn_public_key.pem"