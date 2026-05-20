const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
  // Avoid throwing on import; routes will check config before use.
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

function getPublicUrl(key) {
  return `${publicUrl.replace(/\/$/, '')}/${key}`;
}

function buildObjectKey(prefix, originalName) {
  const ext = path.extname(originalName || '').toLowerCase();
  const safeExt = ext && ext.length <= 10 ? ext : '';
  return `${prefix}/${Date.now()}_${Math.random().toString(36).slice(2)}${safeExt}`;
}

async function uploadToR2(buffer, key, contentType) {
  if (!bucket) {
    throw new Error('R2 bucket is not configured');
  }

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream'
  }));

  return getPublicUrl(key);
}

async function deleteFromR2(key) {
  if (!bucket || !key) {
    return;
  }

  await client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  }));
}

module.exports = {
  buildObjectKey,
  uploadToR2,
  deleteFromR2
};
