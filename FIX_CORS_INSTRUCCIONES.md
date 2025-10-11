# 🔧 Fix CORS - Instrucciones Exactas

## ⚡ Fix de 2 Minutos

### Ubicación del Archivo
```
neuroplan-backend/src/main.ts
```

### Líneas a Modificar
Busca esta sección (aprox. línea 10-20):

```typescript
// Configuración CORS para hackathon
app.enableCors({
  origin: [
    'http://localhost:5173', // Vite React
    'http://localhost:3000', // React Dev Server
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### Reemplazar Por

```typescript
// Configuración CORS para hackathon
app.enableCors({
  origin: [
    'http://localhost:8080', // ✅ NeuroPlan Frontend (AÑADIDO)
    'http://127.0.0.1:8080', // ✅ IPv4 localhost (AÑADIDO)
    'http://localhost:5173', // Vite React
    'http://localhost:3000', // React Dev Server
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### Pasos

1. **Abrir archivo:**
   ```bash
   cd neuroplan-backend
   code src/main.ts
   # O usar tu editor preferido
   ```

2. **Buscar** (Ctrl+F): `app.enableCors`

3. **Agregar dos líneas:**
   ```typescript
   'http://localhost:8080',
   'http://127.0.0.1:8080',
   ```
   Justo después de `origin: [`

4. **Guardar:** Ctrl+S

5. **Reiniciar backend:**
   ```bash
   # En la terminal del backend, presionar Ctrl+C
   # Luego ejecutar:
   npm run start:dev
   ```

6. **Verificar logs:**
   Deberías ver:
   ```
   🚀 NeuroPlan Backend iniciado correctamente!
   🌐 Servidor: http://localhost:3001
   ```

### Verificación Inmediata

**Opción 1: Desde Terminal**
```bash
curl -H "Origin: http://localhost:8080" -I http://localhost:3001/health
```

Debe incluir:
```
Access-Control-Allow-Origin: http://localhost:8080
```

**Opción 2: Desde Navegador**
```javascript
// Abrir http://localhost:8080 
// Consola (F12):
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log) // ✅ Debe funcionar sin errores
```

**Opción 3: Test Automatizado**
```bash
cd neuroplan-frontend
node test-backend-connection.cjs
```

Resultado esperado:
```
CORS configurado: 6/6 endpoints ✅
```

---

## 🎯 Resultado Esperado

### Antes del Fix ❌
```
❌ Access to fetch at 'http://localhost:3001/api/...' from origin 
   'http://localhost:8080' has been blocked by CORS policy
```

### Después del Fix ✅
```json
✅ {
  "status": "healthy",
  "uptime": 1326.47,
  "database": "connected"
}
```

---

## 🚀 Verificación en el Frontend

1. **Abrir:** http://localhost:8080/pei-engine

2. **Buscar banner de estado:**
   - ❌ Antes: Banner amarillo "Ejecutando en modo demo"
   - ✅ Después: Banner verde "Backend NeuroPlan conectado"

3. **Verificar sección:**
   - ✅ Debe aparecer "Generador de PEI Conectado"
   - ✅ Formulario para subir archivos visible
   - ✅ Botón "Crear Estudiante y Generar PEI" activo

4. **Probar funcionalidad:**
   - Completar nombre: "Test Student"
   - Subir cualquier PDF
   - Click "Crear Estudiante y Generar PEI"
   - ✅ Debe mostrar progreso real
   - ✅ Debe crear estudiante en la base de datos

---

## 🎬 Para la Demo del Hackathon

Con este fix aplicado:
- ✅ Demo funcionará en **tiempo real**
- ✅ Creación **real** de estudiantes
- ✅ Generación **real** de PEIs con Claude AI
- ✅ **Impresionarás** al jurado con funcionalidad completa

**¡Solo 2 minutos para tener todo funcionando perfectamente! 🏆**