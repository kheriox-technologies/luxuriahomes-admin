#!/bin/bash

ENV=${1:-dev}
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 [dev|prod]"
  exit 1
fi

S3_BUCKET="s3://apse2-lha-${ENV}-config"

aws s3 cp "$S3_BUCKET/admin/env/.env.local" apps/admin/.env.local
aws s3 cp "$S3_BUCKET/admin/env/.env.$ENV" "apps/admin/.env.$ENV"
aws s3 cp "$S3_BUCKET/backend/env/.env.local" packages/backend/.env.local
