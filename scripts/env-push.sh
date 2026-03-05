#!/bin/bash

S3_BUCKET="s3://apse2-mrt-dev-config"

aws s3 cp apps/web/.env "$S3_BUCKET/web/env/.env"
aws s3 cp apps/admin/.env "$S3_BUCKET/admin/env/.env"

aws s3 cp packages/backend/.env "$S3_BUCKET/backend/env/.env"