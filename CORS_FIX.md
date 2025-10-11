# 🔧 CORS Fix Necesario para el Backend

## ⚠️ Problema Detectado

El backend está ejecutándose correctamente en `http://localhost:3001`, pero el frontend en `http://localhost:8080` no puede conectarse debido a restricciones CORS.

## ✅ Solución Inmediata

### Paso 1: Actualizar main.ts

**Archivo:** `neuroplan-backend/src/main.ts`

**Buscar esta sección:**
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173', // Vite React
    'http://localhost:3000', // React Dev Server
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  // ...resto de la configuración
});
```

**Reemplazar con:**
```typescript
app.enableCors({
  origin: [
    'http://localhost:8080', // ✅ Frontend NeuroPlan (AÑADIDO)
    'http://localhost:5173', // Vite React
    'http://localhost:3000', // React Dev Server
    'http://127.0.0.1:8080', // ✅ IPv4 localhost (AÑADIDO)
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### Paso 2: Reiniciar Backend

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run start:dev
```

### Paso 3: Verificar Conexión

**URL:** http://localhost:8080/pei-engine

**Resultado esperado:**
- 🟢 Banner verde: "Backend NeuroPlan conectado"
- ✅ Badge "Tiempo real"
- 📝 Sección "Generador de PEI Conectado" visible

## 🧪 Test de Verificación

### Desde el navegador (Consola de desarrollador):
```javascript
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  "uptime": 389.0024011,
  "environment": "development",
  "database": "connected",
  "integrations": {
    "elevenlabs": "mock",
    "linkup": "configured", 
    "n8n": "configured"
  },
  "timestamp": "2025-10-11T20:19:55.993Z"
}
```

## 🚀 Demo Completo Listo

Una vez aplicado el fix CORS:

1. **Frontend detectará automáticamente** la conexión
2. **Banner cambiará a verde** indicando conexión exitosa
3. **Todas las funcionalidades reales** estarán disponibles:
   - ✅ Crear estudiantes en la base de datos
   - ✅ Subir reportes médicos reales
   - ✅ Generar PEIs con Claude AI
   - ✅ Descargar PDFs generados
   - ✅ Ver listas de estudiantes y PEIs

## 🎯 Para la Demo del Hackathon

Con esta configuración tendrás:
- **Demo en tiempo real** funcionando
- **Integración completa** frontend-backend
- **Fallback automático** si algo falla
- **Experiencia impresionante** para el jurado

**¡Solo falta aplicar este pequeño cambio CORS y tendrás todo funcionando perfectamente! 🏆**