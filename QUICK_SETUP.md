# 🚀 Configuración Rápida Backend + Frontend

## ⚡ Setup en 5 Minutos

### 1. Configurar CORS en el Backend

**Archivo:** `neuroplan-backend/src/main.ts`

Reemplaza la sección CORS con:

```typescript
// Configuración CORS para hackathon
app.enableCors({
  origin: [
    'http://localhost:8080', // ✅ Frontend NeuroPlan
    'http://localhost:5173', // Vite React (backup)
    'http://localhost:3000', // React Dev Server (backup)
    'http://127.0.0.1:8080', // ✅ IPv4 localhost
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### 2. Ejecutar Backend

```bash
cd neuroplan-backend

# Si no tienes dependencias instaladas
npm install

# Si no tienes la base de datos configurada
npx prisma generate
npx prisma db push

# Iniciar servidor
npm run start:dev
```

**Resultado esperado:**
```
🚀 NeuroPlan Backend iniciado correctamente!

🌐 Servidor: http://localhost:3001
📚 API Docs: http://localhost:3001/api/docs
🧠 Modo: development
🎯 Hackathon Mode: ✅ ACTIVADO

🔉 Binding: 0.0.0.0:3001
```

### 3. Verificar Conexión

**Frontend:** http://localhost:8080/pei-engine

**Debes ver:**
- 🟢 Banner verde: "Backend NeuroPlan conectado"
- 📝 Sección "Generador de PEI Conectado"
- 🔗 Tiempo real badge

### 4. Probar Integración

**Test rápido:**
```bash
# Verificar health check
curl http://localhost:3001/health

# Verificar API docs
open http://localhost:3001/api/docs
```

### 5. Demo Completo

1. **Navegar a:** http://localhost:8080/pei-engine
2. **Completar formulario:**
   - Nombre: "María González"
   - Archivo: Cualquier PDF
3. **Click:** "Crear Estudiante y Generar PEI"
4. **Ver:** Progreso en tiempo real
5. **Resultado:** PDF generado para descarga

---

## 🔧 Troubleshooting

### Error: CORS
```
Access to XMLHttpRequest at 'http://localhost:3001/api/...' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solución:** Verificar que el puerto 8080 esté en la configuración CORS del backend.

### Error: Connection Refused
```
Network Error / Connection refused
```

**Solución:** Verificar que el backend esté ejecutándose en puerto 3001.

### Modo Demo Automático
Si ves banner amarillo "Ejecutando en modo demo", significa que el frontend no puede conectarse al backend. Verifica:

1. Backend ejecutándose ✅
2. Puerto 3001 disponible ✅
3. CORS configurado correctamente ✅

---

## 🎯 Resultado Final

**Con backend conectado:**
- ✅ Creación real de estudiantes
- ✅ Upload y procesamiento de archivos
- ✅ Generación de PEIs con Claude AI
- ✅ Descarga de PDFs reales
- ✅ Integraciones con ElevenLabs, Linkup, n8n

**Sin backend (fallback):**
- ✅ Demo funcional completo
- ✅ Sin errores o crashes
- ✅ Experiencia de usuario convincente

**¡Tu setup está listo para impresionar en el hackathon! 🏆**