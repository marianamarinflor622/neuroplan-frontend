# 🚀 Inicio Rápido - Prueba de n8n Workflows

## 📋 Requisitos Previos

- Node.js instalado
- Backend de NeuroPlan
- Frontend de NeuroPlan

## ⚡ Pasos Rápidos

### 1. Iniciar Backend (si no está corriendo)

```bash
# Navegar a la carpeta del backend
cd ../neuroplan-backend

# Instalar dependencias (si es necesario)
npm install

# Iniciar en modo desarrollo
npm run start:dev
```

**El backend debe estar corriendo en:** `http://localhost:3001`

---

### 2. Iniciar Frontend (si no está corriendo)

```bash
# Navegar a la carpeta del frontend
cd c:/Users/misky/Desktop/neuroplan-hackathon/neuroplan-frontend

# Instalar dependencias (si es necesario)
npm install

# Iniciar en modo desarrollo
npm run dev
```

**El frontend debe estar corriendo en:** `http://localhost:8080`

---

### 3. Verificar Conexión

#### Opción A: Test HTML Visual
Abre en tu navegador:
```
http://localhost:8080/test-connection.html
```

Deberías ver todos los tests en verde, incluyendo:
- ✅ Health Check
- ✅ Students
- ✅ ElevenLabs
- ✅ Linkup
- ✅ n8n Stats
- ✅ AWS Bedrock

---

#### Opción B: Script de Test Automatizado
```bash
node test-n8n-endpoints.cjs
```

Deberías ver:
```
✓ TODOS LOS TESTS PASARON
Exitosos: 6/6
Tasa de éxito: 100%
```

---

### 4. Probar Demo de n8n Workflows

Abre una de estas URLs:

**Demo Standalone:**
```
http://localhost:8080/workflow-demo
```

**Demo Integrado en PEI Engine:**
```
http://localhost:8080/pei-engine
```
(Scroll hasta el final para ver la sección de Workflows)

---

## 🎯 Prueba Rápida de Funcionalidades

### Test 1: Estadísticas
1. Abre http://localhost:8080/workflow-demo
2. Ve a la pestaña "Estadísticas"
3. Haz clic en "Cargar Estadísticas"
4. Deberías ver las métricas de n8n

### Test 2: Notificación de PEI Generado
1. Ve a la pestaña "Notificaciones"
2. En "Notificar PEI Generado", ingresa ID: `1`
3. Haz clic en "Notificar Generación"
4. Deberías ver un toast verde de éxito

### Test 3: Trigger Workflow Personalizado
1. Ve a la pestaña "Trigger Workflow"
2. Nombre del Workflow: `test-workflow`
3. Datos JSON:
```json
{
  "message": "Prueba de workflow",
  "timestamp": "2025-10-12T10:00:00Z"
}
```
4. Haz clic en "Disparar Workflow"
5. Deberías ver el resultado en JSON

---

## 🐛 Solución de Problemas

### Error: "Backend no conectado"

**Problema:** El frontend no puede conectarse al backend

**Soluciones:**

1. **Verificar que el backend esté corriendo:**
```bash
curl http://localhost:3001/api/health
```

Si no responde, iniciar el backend:
```bash
cd ../neuroplan-backend
npm run start:dev
```

2. **Verificar CORS:** Asegúrate de que el backend tenga CORS configurado para puerto 8080 en `main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
});
```

3. **Verificar .env del frontend:** Asegúrate de tener:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

### Error: "404 Not Found" en endpoints de n8n

**Problema:** Los endpoints de n8n no existen en el backend

**Solución:** Verifica que el módulo n8n esté registrado en el backend:

1. Abre `neuroplan-backend/src/app.module.ts`
2. Busca `N8nModule` en los imports
3. Si no está, el módulo n8n no está implementado aún

---

### Error: "CORS policy" en la consola del navegador

**Problema:** El backend no permite requests desde el puerto 8080

**Solución:** Actualizar `main.ts` del backend con:
```typescript
app.enableCors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

Reiniciar el backend después del cambio.

---

## 📚 Documentación Adicional

- **Guía completa de testing:** `N8N_WORKFLOW_TESTING_GUIDE.md`
- **Resumen ejecutivo:** `N8N_DEMO_SUMMARY.md`
- **Tests automatizados:** `test-n8n-endpoints.cjs`
- **Tests visuales:** `public/test-connection.html`

---

## ✅ Checklist de Verificación

Antes de la demo, asegúrate de:

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 8080
- [ ] Health check respondiendo OK
- [ ] Test HTML muestra todos los endpoints en verde
- [ ] Demo de workflows abre correctamente
- [ ] Panel muestra "Backend conectado" en verde
- [ ] Las 3 pestañas funcionan correctamente
- [ ] Notificaciones toast aparecen
- [ ] Resultados JSON se muestran correctamente

---

## 🎬 Listo para Demo

Si todos los checks están en verde, estás listo para demostrar la funcionalidad de n8n workflows!

**URLs principales:**
- Demo: http://localhost:8080/workflow-demo
- PEI Engine: http://localhost:8080/pei-engine
- Tests: http://localhost:8080/test-connection.html

---

**¡Buena suerte con tu hackathon! 🚀**
