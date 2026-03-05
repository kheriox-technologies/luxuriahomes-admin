#!/bin/bash

S3_BUCKET="s3://apse2-mrt-dev-config"

aws s3 cp "$S3_BUCKET/web/env/.env" apps/web/.env
aws s3 cp "$S3_BUCKET/admin/env/.env" apps/admin/.env

aws s3 cp "$S3_BUCKET/backend/env/.env" packages/backend/.env
