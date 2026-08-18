import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _s3: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }
  return _s3;
}

function requireBucket(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");
  return bucket;
}

/**
 * Presigned PUT URL for a direct client-to-S3 upload, so large BaseVideo
 * files bypass the Next.js server entirely.
 */
export async function createUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 900,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: requireBucket(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
}

/**
 * Presigned GET URL for time-limited playback of a stored asset (BaseVideo
 * raw footage or a RenderJob's resultS3Url), scoped to an authenticated
 * request.
 */
export async function createPlaybackUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: requireBucket(),
    Key: key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
}

/** Namespaces an object key per tenant so franchise storage stays isolated. */
export function buildObjectKey(
  tenantId: string,
  category: "base" | "render" | "thumbnail",
  filename: string,
): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${tenantId}/${category}/${Date.now()}-${safeName}`;
}

/**
 * Public CDN URL for an object, for assets meant to be directly embeddable
 * (e.g. Product.thumbnailUrl) rather than gated behind a presigned GET.
 * Assumes the bucket/CloudFront distribution is configured to serve the
 * "thumbnail" prefix publicly while other prefixes stay private — confirm
 * that split exists before relying on this for anything sensitive.
 */
export function buildPublicAssetUrl(key: string): string {
  const domain = process.env.CLOUDFRONT_DOMAIN;
  if (!domain) throw new Error("CLOUDFRONT_DOMAIN is not configured");
  return `https://${domain}/${key}`;
}
