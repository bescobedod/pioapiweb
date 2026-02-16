// services/s3.js
const path = require('path');
const crypto = require('crypto');
const {
  S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: process.env.AWS_PUBLIC_KEY && process.env.AWS_SECRET_KEY
    ? { accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY }
    : undefined
});

function mimeExt(mime) {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png')  return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/heic' || mime === 'image/heif') return '.heic';
  return ''; // último recurso
}

function buildS3Key({ id_caso, originalName, mimeType }) {
  // 👇 Ajusta tu prefix. RECOMENDADO: solo 'casos' (NO 'pioapp/casos')
  const prefix = (process.env.S3_PREFIX || 'casos').replace(/\/+$/, '');
  const extByName = (originalName && path.extname(originalName).toLowerCase()) || '';
  const ext = extByName || mimeExt(mimeType) || '.jpg'; // fuerza extensión
  const ts = Date.now();
  const rand = crypto.randomBytes(8).toString('hex');
  return `${prefix}/${id_caso}/${ts}-${rand}${ext}`;
}

async function uploadBufferToS3({ bucket, key, buffer, contentType }) {
  try {
    // Validar parámetros
    if (!bucket || !key || !buffer) {
      throw new Error(`Parámetros inválidos: bucket=${bucket}, key=${key}, buffer=${buffer ? 'presente' : 'ausente'}`);
    }

    console.log(`[S3] Subiendo a s3://${bucket}/${key}, tamaño: ${buffer.length} bytes, ContentType: ${contentType}`);

    const out = await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType
    }));

    const code = out?.$metadata?.httpStatusCode;
    console.log(`[S3] Respuesta del servidor: HTTP ${code}`);

    if (code && code >= 400) {
      throw new Error(`S3 PutObject falló con HTTP ${code}`);
    }

    return { bucket, key, httpStatusCode: code ?? 200 };
  } catch (err) {
    console.error(`[S3] Error al subir archivo:`, err.message);
    throw err;
  }
}

async function deleteFromS3({ bucket, key }) {
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

async function getPresignedUrl({ bucket, key, expiresInSec = 3600 }) {
  return getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: expiresInSec });
}

module.exports = { buildS3Key, uploadBufferToS3, deleteFromS3, getPresignedUrl };