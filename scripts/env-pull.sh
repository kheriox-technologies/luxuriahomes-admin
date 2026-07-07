#!/bin/bash

ENV=${1:-dev}
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 [dev|prod]"
  exit 1
fi

S3_BUCKET="s3://apse2-lha-${ENV}-config"

aws s3 cp "$S3_BUCKET/mobile/env/.env.local" apps/mobile/.env.local
aws s3 cp "$S3_BUCKET/mobile/env/.env.$ENV" "apps/mobile/.env.$ENV"
aws s3 cp "$S3_BUCKET/mobile/credentials/credentials.json" apps/mobile/credentials.json
aws s3 cp --recursive "$S3_BUCKET/mobile/credentials/credentials/" apps/mobile/credentials/
aws s3 cp "$S3_BUCKET/portal/env/.env.local" apps/portal/.env.local
aws s3 cp "$S3_BUCKET/portal/env/.env.$ENV" "apps/portal/.env.$ENV"
aws s3 cp "$S3_BUCKET/web/env/.env.local" apps/web/.env.local
aws s3 cp "$S3_BUCKET/web/env/.env.$ENV" "apps/web/.env.$ENV"
aws s3 cp "$S3_BUCKET/backend/env/.env.local" packages/backend/.env.local
aws s3 cp "$S3_BUCKET/infra/keys/cdn_private_key.pem" packages/infra/cdn_private_key.pem
aws s3 cp "$S3_BUCKET/infra/keys/cdn_public_key.pem" packages/infra/cdn_public_key.pem
