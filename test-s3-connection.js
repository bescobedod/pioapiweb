/**
 * Script de diagnóstico para validar la conexión a AWS S3
 * Uso: node test-s3-connection.js
 */

require('dotenv').config();
const {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  HeadBucketCommand
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: process.env.AWS_PUBLIC_KEY && process.env.AWS_SECRET_KEY
    ? { accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY }
    : undefined
});

async function testS3Connection() {
  console.log('🔍 Iniciando diagnóstico de conexión a AWS S3...\n');

  try {
    // 1. Validar variables de entorno
    console.log('📋 Verificando variables de entorno:');
    console.log(`   AWS_BUCKET_NAME: ${process.env.AWS_BUCKET_NAME ? '✅ Configurado' : '❌ NO configurado'}`);
    console.log(`   AWS_BUCKET_REGION: ${process.env.AWS_BUCKET_REGION ? '✅ Configurado' : '❌ NO configurado'}`);
    console.log(`   AWS_PUBLIC_KEY: ${process.env.AWS_PUBLIC_KEY ? '✅ Configurado' : '❌ NO configurado'}`);
    console.log(`   AWS_SECRET_KEY: ${process.env.AWS_SECRET_KEY ? '✅ Configurado' : '❌ NO configurado'}\n`);

    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_BUCKET_REGION) {
      throw new Error('Falta configuración de AWS en variables de entorno');
    }

    // 2. Intentar listar buckets
    console.log('📦 Intentando listar buckets S3...');
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    console.log('   ✅ Conexión exitosa a AWS S3');
    console.log(`   Buckets disponibles: ${listBucketsResponse.Buckets?.length || 0}\n`);

    // 3. Validar acceso al bucket específico
    console.log(`🎯 Validando acceso al bucket "${process.env.AWS_BUCKET_NAME}"...`);
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: process.env.AWS_BUCKET_NAME }));
      console.log('   ✅ Acceso permitido al bucket\n');
    } catch (headErr) {
      console.log(`   ❌ No hay acceso al bucket: ${headErr.message}\n`);
      throw headErr;
    }

    // 4. Intentar subir un archivo de prueba
    console.log('📤 Intentando subir archivo de prueba...');
    const testKey = `test/${Date.now()}-test.txt`;
    const testContent = Buffer.from('Test file from PioApp Server');

    const putResponse = await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
    }));

    const httpStatus = putResponse?.$metadata?.httpStatusCode;
    if (httpStatus && httpStatus >= 200 && httpStatus < 300) {
      console.log(`   ✅ Archivo subido exitosamente (HTTP ${httpStatus})`);
      console.log(`   Ubicación: s3://${process.env.AWS_BUCKET_NAME}/${testKey}\n`);
    } else {
      throw new Error(`Respuesta HTTP inesperada: ${httpStatus}`);
    }

    // 5. Resumen
    console.log('✅ DIAGNÓSTICO EXITOSO\n');
    console.log('Configuración válida:');
    console.log(`   - Bucket: ${process.env.AWS_BUCKET_NAME}`);
    console.log(`   - Región: ${process.env.AWS_BUCKET_REGION}`);
    console.log(`   - URL pública: https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`);
    console.log('\n✨ Tu servidor S3 está listo para subir archivos.\n');

  } catch (error) {
    console.error('\n❌ ERROR EN DIAGNÓSTICO:\n');
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensaje: ${error.message}`);

    if (error.Code) {
      console.error(`   Código AWS: ${error.Code}`);
    }

    if (error.message.includes('InvalidAccessKeyId')) {
      console.error('\n   💡 Sugerencia: Las credenciales de AWS son inválidas o han expirado.');
    } else if (error.message.includes('AccessDenied')) {
      console.error('\n   💡 Sugerencia: La cuenta de AWS no tiene permisos para acceder a este bucket.');
    } else if (error.message.includes('NoSuchBucket')) {
      console.error('\n   💡 Sugerencia: El bucket no existe. Verifica el nombre del bucket.');
    }

    console.error('\nDetalles:', error);
    process.exit(1);
  }
}

testS3Connection();
