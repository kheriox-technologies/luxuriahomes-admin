# CDN Signed URL Setup

The CDN CloudFront distribution requires signed URLs for all requests.
Unsigned requests return HTTP 403.

## 1. Generate the RSA Key Pair

Run once per environment (or share the same pair across dev/prod):

```bash
openssl genrsa -out cdn_private_key.pem 2048
openssl rsa -pubout -in cdn_private_key.pem -out cdn_public_key.pem
```

- Keep `cdn_private_key.pem` **secret** — store in a secrets manager, never commit it.
- `cdn_public_key.pem` goes into Pulumi config as a secret.

## 2. Set the Public Key in Pulumi Config

```bash
cd packages/infra
pulumi config set --stack dev --secret app:cdnPublicKey -- "$(cat cdn_public_key.pem)"
pulumi config set --stack prod --secret app:cdnPublicKey -- "$(cat cdn_public_key.pem)"
```

The `--` is required because the PEM content starts with `-----BEGIN`, which the CLI misinterprets as a flag.

After deploying, note the **CloudFront Public Key ID** from the Pulumi stack outputs or the AWS Console
(CloudFront → Key management → Public keys). This ID is needed when signing URLs in the application.

## 3. Sign URLs in the Application

Install the AWS SDK CloudFront signer:

```bash
pnpm add @aws-sdk/cloudfront-signer
```

Example (Node.js / Next.js server action):

```ts
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

const signedUrl = getSignedUrl({
  url: `${process.env.CDN_BASE_URL}/path/to/object`,
  keyPairId: process.env.CDN_KEY_PAIR_ID,
  privateKey: process.env.CDN_PRIVATE_KEY,
  dateLessThan: new Date(Date.now() + 3_600_000).toISOString(), // 1 hour expiry
});
```

## 4. Required Environment Variables

| Variable | Description |
|---|---|
| `CDN_KEY_PAIR_ID` | CloudFront Public Key ID (from AWS Console / Pulumi output) |
| `CDN_PRIVATE_KEY` | RSA private key in PEM format |
| `CDN_BASE_URL` | e.g. `https://cdn-dev.luxuriahomes.com.au` |

Add these to your `.env.local` and any deployment environment (Vercel, Convex, etc.).

## 5. Domains

| Environment | CDN Domain |
|---|---|
| `dev` | `cdn-dev.luxuriahomes.com.au` |
| `prod` | `cdn.luxuriahomes.com.au` |
