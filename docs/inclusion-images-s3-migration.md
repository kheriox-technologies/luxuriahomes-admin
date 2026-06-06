# Inclusion Images: Convex Storage → S3 + CloudFront Migration

## What Changed

Inclusion variant images are now stored in the CDN S3 bucket (`CDN_BUCKET_NAME`) instead of Convex built-in file storage. The `image` field in `inclusionVariants` and `projectInclusions` now holds an S3 key (e.g. `images/inclusions/abc-123.jpg`) rather than a full Convex URL. Images are served via CloudFront signed URLs (required by the CDN distribution).

The `storageId` field is kept in both tables' schemas during the migration window (marked with a comment) and will be removed once all existing records are cleared.

## New Key Format

```
images/inclusions/{uuid}.{ext}
```

UUID is generated at upload time. One key per image, no reference to the variant ID.

## New Upload Flow

1. Client calls Convex action `fileStorage/generateS3UploadUrl` with `contentType` and `ext`
2. Action returns `{ uploadUrl, s3Key }` — a 5-minute presigned S3 PUT URL
3. Client PUTs the file directly to S3 (`method: PUT`, not POST)
4. Client stores `s3Key` in the form's `image` field
5. On submit, the S3 key is saved to the DB

## New Display Flow

1. Client components batch-call `signCdnUrls(keys)` (a Next.js server action) when variant data loads
2. Server action generates 1-hour CloudFront signed URLs for each key
3. Signed URLs are passed to image components as props

## Required Environment Variables

### Add to Next.js `.env.local` and Vercel

| Variable | Description |
|---|---|
| `CDN_KEY_PAIR_ID` | CloudFront Public Key ID — find in AWS Console: CloudFront → Key management → Public keys |
| `CDN_PRIVATE_KEY` | Contents of `cdn_private_key.pem` (RSA private key, keep secret) |

`NEXT_PUBLIC_CDN_URL` is already configured.

### Convex deployment — no new variables needed

All S3 upload variables are already present: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CDN_BUCKET_NAME`.

See [cdn-signed-urls.md](cdn-signed-urls.md) for the CloudFront key setup instructions.

## Migration Steps

### Step 1 — Deploy the new code

Deploy with `storageId` removed from the schema. New records will no longer write `storageId`. Existing records that still have `storageId` in the DB are fine — the schema change is backward compatible since the field was `optional`.

Existing `image` fields pointing to old Convex storage URLs will continue to render (Convex CDN URLs are still valid while the project exists), so there is no immediate display regression.

### Step 2 — Clear `storageId` from existing records

Run the internal migration mutations to clear the `storageId` field from all existing documents. These mutations patch each document, setting `storageId` to `undefined`.

**For `inclusionVariants`:**

```bash
# Run in a loop until nextCursor is null
npx convex run inclusionVariants/migrateImagesToS3:migrateImagesToS3 '{"batchSize": 100}'
# If there are more records, pass the returned cursor:
npx convex run inclusionVariants/migrateImagesToS3:migrateImagesToS3 '{"cursor": "<nextCursor>", "batchSize": 100}'
```

**For `projectInclusions`:**

```bash
npx convex run projectInclusions/migrateImagesToS3:migrateImagesToS3 '{"batchSize": 100}'
# Repeat with cursor if needed
```

Continue until `nextCursor` is `null` in the response.

### Step 3 — Verify

In the Convex dashboard, spot-check `inclusionVariants` and `projectInclusions` documents to confirm `storageId` is no longer present.

### Step 4 — Migrate image binaries to S3

The mutation above only clears `storageId`. The `image` field for previously-uploaded records still holds the old Convex CDN URL (e.g. `https://<deployment>.convex.cloud/api/storage/<id>`). Run the binary migration actions to download each image from the old Convex URL, upload it to S3, and update the `image` field with the new S3 key.

**For `inclusionVariants`:**

```bash
# Run once — repeats until hasMore is false
npx convex run inclusionVariants/migrateImageBinariesToS3:migrateImageBinariesToS3 '{}'
```

If the response includes `"hasMore": true`, run the command again. Repeat until `hasMore` is `false`.

**For `projectInclusions`:**

```bash
npx convex run projectInclusions/migrateImageBinariesToS3:migrateImageBinariesToS3 '{}'
# Repeat if hasMore: true
```

Each run processes up to 50 records (configurable via `batchSize`). The action logs each migrated record and counts skipped records (due to fetch or upload errors). After this step, all images are hosted on S3 and served via CloudFront.

### Step 5 — Remove `storageId` from the schema

Once Steps 2 and 4 are complete and verified, remove the `storageId: v.optional(v.id('_storage'))` lines from `schema.ts` for both `inclusionVariants` and `projectInclusions`, then redeploy. The migration comment in the schema marks these lines for removal.

## Rollback Plan

- The old `fileStorage/generateUploadUrl`, `resolvePublicUrl`, and `deleteStorage` Convex mutations are still in place. They can be re-wired in the UI if needed.
- Existing records with Convex URLs in the `image` field will still display correctly.
- To revert the schema change, add `storageId: v.optional(v.id('_storage'))` back to both tables and redeploy.

## S3 Storage Cleanup

S3 objects are **not** automatically deleted when a variant's image is changed or the variant is removed. Configure an S3 lifecycle rule on the `images/inclusions/` prefix to expire orphaned objects after a suitable retention period (e.g. 90 days).
