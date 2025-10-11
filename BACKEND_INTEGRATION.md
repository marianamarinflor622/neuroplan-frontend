# 🔌 Integración Frontend-Backend NeuroPlan

## ✅ Estado de la Integración

**Frontend:** Conectado y funcionando ✅  
**Backend:** Esperando conexión en `http://localhost:3001` ⏳  
**Modo actual:** Demo con fallback automático  

---

## 🚀 Cómo Usar la Integración

### 1. Configurar CORS en el Backend (IMPORTANTE)

El backend debe permitir conexiones desde el puerto 8080. Actualiza el archivo `main.ts` del backend:

```typescript
// En neuroplan-backend/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:8080', // ✅ Tu frontend actual
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

### 2. Backend Funcionando (Modo Producción)

Si el backend está ejecutándose en `http://localhost:3001`:

1. **Automático:** El frontend detecta la conexión
2. **Interfaz:** Aparece la sección "Generador de PEI Conectado"
3. **Funcionalidad real:**
   - ✅ Crear estudiantes
   - ✅ Subir reportes médicos (PDF/DOC/IMG)
   - ✅ Generar PEIs con Claude AI
   - ✅ Descargar PEIs como PDF
   - ✅ Ver listados de estudiantes y PEIs

### 3. Backend No Disponible (Modo Demo)

Si el backend no está disponible:

1. **Automático:** Ejecuta en modo simulación
2. **Interfaz:** Muestra "Ejecutando en modo demo"
3. **Funcionalidad demo:**
   - ✅ Análisis simulado con progreso
   - ✅ Todas las interfaces funcionales
   - ✅ Sin errores de conexión

---

## 🔧 Configuración

### Variables de Entorno (`.env`)

```env
# Backend Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
VITE_NODE_ENV=development
VITE_API_TIMEOUT=10000
```

### Servicios Implementados

#### `src/services/api.ts`
- Configuración central de Axios
- Interceptores para autenticación
- Manejo de errores automático

#### `src/services/neuroplanApi.ts`
- **studentsService:** Crear estudiantes, subir reportes
- **peisService:** Generar PEIs, listar, descargar PDF
- **audioService:** Text-to-speech con ElevenLabs
- **resourcesService:** Búsqueda con Linkup
- **workflowService:** Automatización con n8n
- **authService:** Autenticación (preparado para futuro)

#### `src/types/api.ts`
- Interfaces TypeScript para todos los modelos
- DTOs para requests
- Tipos de respuesta y errores

---

## 📊 Páginas Integradas

### PEI Engine (`/pei-engine`)

**Funcionalidades implementadas:**

1. **Detección automática de backend**
   ```tsx
   const [backendConnected, setBackendConnected] = useState(false);
   ```

2. **Subida de reportes médicos**
   ```tsx
   await studentsService.uploadReport(studentId, file);
   ```

3. **Generación de PEIs**
   ```tsx
   await peisService.generate({ reportId });
   ```

4. **Descarga de PDFs**
   ```tsx
   window.open(`${API_BASE_URL}/peis/${pei.id}/pdf`, '_blank');
   ```

### Dashboard (`/dashboard`)
- Lista de estudiantes en tiempo real
- Estadísticas de PEIs generados
- Estado de conexión con backend

### Autenticación
- **Login/Logout:** Integrado con token JWT
- **Fallback:** Modo demo sin autenticación
- **Persistencia:** LocalStorage para sesiones

---

## 🧪 Pruebas de Conexión

### Verificar Backend
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3001/health
```

### Probar Endpoints
```bash
# Listar estudiantes
curl http://localhost:3001/api/uploads/students

# Listar PEIs
curl http://localhost:3001/api/peis
```

### Logs del Frontend
```javascript
// En la consola del navegador verás:
"Conectado al backend NeuroPlan" // ✅ Backend disponible
"Backend no disponible, usando modo demo" // ⚠️ Modo fallback
```

---

## 🔄 Flujo Completo Demo

### Caso 1: Con Backend Conectado

1. **Abre:** http://localhost:8080/pei-engine
2. **Verás:** Banner verde "Backend NeuroPlan conectado"
3. **Formulario:** Completa nombre y sube archivo PDF
4. **Click:** "Crear Estudiante y Generar PEI"
5. **Resultado:** 
   - Estudiante creado en base de datos
   - Reporte procesado con OCR
   - PEI generado con Claude AI
   - PDF disponible para descarga

### Caso 2: Sin Backend (Demo)

1. **Abre:** http://localhost:8080/pei-engine
2. **Verás:** Banner amarillo "Ejecutando en modo demo"
3. **Click:** "Análisis Demo"
4. **Resultado:** 
   - Simulación de análisis con progreso
   - Datos mock para todas las interfaces
   - Experiencia completa sin backend

---

## 🎯 Para la Demo del Hackathon

### Preparación
1. **Configurar CORS en backend:** Agregar puerto 8080 en `main.ts`
2. **Iniciar backend:** `cd neuroplan-backend && npm run start:dev`
3. **Verificar frontend:** http://localhost:8080
4. **Verificar conexión:** Debe aparecer banner verde
5. **Preparar archivo:** PDF de reporte médico de ejemplo

### Guión de Demo
```
1. "Esto es NeuroPlan conectado en tiempo real con nuestro backend"
2. [Mostrar banner verde de conexión]
3. "Voy a crear un estudiante y generar un PEI real"
4. [Completar formulario con nombre y archivo]
5. "El sistema usa Claude AI para analizar el reporte médico"
6. [Mostrar progreso en tiempo real]
7. "Y aquí tenemos el PEI generado listo para descargar"
8. [Descargar PDF generado]
```

---

## 🛠️ Arquitectura de la Integración

```
Frontend (React + Vite)     Backend (NestJS)
├── PEI Engine Page        ├── PEIs Module
├── Dashboard Page         ├── Students Module  
├── Auth Context          ├── ElevenLabs Module
├── API Services          ├── Linkup Module
└── Type Definitions      └── n8n Module
```

### Ventajas del Diseño

✅ **Resistente a fallos:** Funciona con o sin backend  
✅ **Detección automática:** Sin configuración manual  
✅ **Experiencia consistente:** Mismo UI en ambos modos  
✅ **Tipo seguro:** TypeScript en toda la comunicación  
✅ **Manejo de errores:** Feedback claro al usuario  
✅ **Preparado para producción:** Configuración por variables de entorno  

---

## 🚀 Próximos Pasos

### Para la Demo
- [ ] Iniciar backend NeuroPlan
- [ ] Verificar conexión frontend-backend
- [ ] Preparar reportes médicos de ejemplo
- [ ] Practicar flujo completo de demo

### Para Producción
- [ ] Configurar variables de entorno para producción
- [ ] Implementar autenticación JWT completa
- [ ] Configurar HTTPS y CORS apropiados
- [ ] Implementar caching y optimizaciones

---

**🎯 ¡Tu frontend está completamente preparado para demostrar el poder de NeuroPlan en el hackathon!**