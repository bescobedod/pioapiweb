# Corrección de Problemas con Upload de Archivos a S3

## Problemas Identificados y Solucionados

### 1. **Orden de Middlewares en la Ruta** ⚠️ (PRINCIPAL)
**Problema:** En [routers.js](routers.js#L67-L70), el middleware `upload.array()` se ejecutaba **ANTES** del middleware `auth`, lo que causaba que:
- Los archivos se procesaran antes de validar la autenticación
- Si la autenticación fallaba, los archivos ya habían sido procesados sin contexto de usuario
- Posibles problemas de seguridad y inconsistencias de datos

**Solución:** Se reordenó para ejecutar primero la autenticación, luego el upload:
```javascript
router.post('/casos/uploadArchivosCaso/:id_caso/archivos',
    upload.array('imagenes', 3),
    auth, casos.uploadArchivosCaso
);

// ✅ AHORA (CORRECTO)
router.post('/casos/uploadArchivosCaso/:id_caso/archivos',
    auth,
    upload.array('imagenes', 3),
    casos.uploadArchivosCaso
);
```

### 2. **Manejo de Errores Mejorado** 📊
Se mejoró la función [uploadArchivosCaso](controllers/pioapp/caso.controller.js#L490-L568) con:
- Validación de configuración de S3
- Logs detallados para debugging
- Manejo individual de errores por archivo
- Respuesta mejorada que indica cuántos archivos se subieron exitosamente
- Stack trace en modo desarrollo

### 3. **Logs en Servicio S3** 🔍
Se añadieron logs detallados en [services/s3.js](services/s3.js#L22-L44) para:
- Validar parámetros antes de enviar a S3
- Registrar información del archivo siendo subido
- Mostrar código HTTP de respuesta
- Facilitar debugging

## Validación de Conexión

Se creó un script de diagnóstico: [test-s3-connection.js](test-s3-connection.js)

### ✅ Estado Actual
```
✅ Conexión a AWS S3: FUNCIONAL
✅ Bucket "pioapp": ACCESIBLE
✅ Permisos: OK
✅ Test de upload: EXITOSO
```

## Cómo Probar la Solución

### 1. Reiniciar el servidor
```bash
npm start
```

### 2. Enviar archivo usando cURL o Postman

**Headers:**
```
Authorization: Bearer <tu_token_jwt>
```

**Body (form-data):**
- `imagenes`: (seleccionar archivo/imagen - máximo 3 archivos)

**POST:**
```
http://localhost:5000/casos/uploadArchivosCaso/1/archivos
```

### 3. Respuesta esperada (exitosa):
```json
{
  "message": "Archivos procesados",
  "exitosos": 3,
  "fallidos": 0,
  "archivos": [
    {
      "id_archivo": 1,
      "id_caso": 1,
      "s3_bucket": "pioapp",
      "s3_key": "casos/1/1770061602239-abc123.jpg",
      "nombre_original": "foto.jpg",
      "mime_type": "image/jpeg",
      "bytes": 2048576,
      "userCreatedAt": 5,
      "createdAt": "2026-02-02T14:00:00.000Z",
      "updatedAt": "2026-02-02T14:00:00.000Z",
      "s3HttpStatus": 200
    }
  ]
}
```

## Posibles Causas de Fallos Previos

1. ❌ Archivo rechazado por el middleware `upload` (tipo MIME no permitido)
   - Solo acepta: `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `image/heif`
   - Tamaño máximo: 10 MB por archivo (configurable en `.env` con `MAX_FILE_SIZE_MB`)

2. ❌ Usuario no autenticado
   - Verifica que el token JWT sea válido
   - El endpoint requiere autenticación válida

3. ❌ Caso no existe
   - Valida que `id_caso` sea correcto

## Comandos Útiles

### Ver logs del servidor
```bash
npm start  # Ver salida en tiempo real
```

### Probar conexión S3
```bash
node test-s3-connection.js
```

### Ver archivos subidos en S3
```bash
# Via AWS CLI
aws s3 ls s3://pioapp/casos/ --recursive

# O en la consola de AWS S3
```

## Notas Importantes

- ⚠️ Las credenciales de AWS están configuradas correctamente
- 📁 Los archivos se almacenan en: `s3://pioapp/casos/{id_caso}/{timestamp}-{random}.{extension}`
- 🔗 URL pública de acceso: `https://pioapp.s3.us-east-1.amazonaws.com/casos/{id_caso}/{filename}`
- 🛡️ Los archivos son privados por defecto (requieren credenciales para acceso público)

## Próximos Pasos Recomendados

1. Probar la carga de archivos desde el cliente/frontend
2. Revisar los logs de la consola para cualquier error adicional
3. Si aún hay problemas, ejecutar: `node test-s3-connection.js` para diagnóstico
4. Considerar añadir compresión de imágenes antes de subir a S3 (opcional)
