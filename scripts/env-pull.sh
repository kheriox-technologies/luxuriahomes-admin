#!/bin/bash

ENV=${1:-dev}
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 [dev|prod]"
  exit 1
fi

S3_BUCKET="s3://apse2-lha-${ENV}-config"

aws s3 cp "$S3_BUCKET/admin/env/.env.local" apps/admin/.env.local
aws s3 cp "$S3_BUCKET/admin/env/.env.$ENV" "apps/admin/.env.$ENV"
aws s3 cp "$S3_BUCKET/client/env/.env.local" apps/client/.env.local
aws s3 cp "$S3_BUCKET/client/env/.env.$ENV" "apps/client/.env.$ENV"
aws s3 cp "$S3_BUCKET/web/env/.env.local" apps/web/.env.local
aws s3 cp "$S3_BUCKET/web/env/.env.$ENV" "apps/web/.env.$ENV"
aws s3 cp "$S3_BUCKET/backend/env/.env.local" packages/backend/.env.local
aws s3 cp "$S3_BUCKET/infra/keys/cdn_private_key.pem" packages/infra/cdn_private_key.pem
aws s3 cp "$S3_BUCKET/infra/keys/cdn_public_key.pem" packages/infra/cdn_public_key.pem
