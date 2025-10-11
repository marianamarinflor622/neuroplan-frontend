# 🔄 Guía de Prueba: n8n Workflow Automation

## 📋 Resumen

Esta guía te ayudará a probar la integración de n8n para la automatización de workflows en NeuroPlan.

## 🎯 Funcionalidades Implementadas

### 1. **Trigger Workflow Personalizado**
Dispara workflows personalizados con datos JSON.

**Endpoint:** `POST /api/n8n/trigger-workflow`

**Body:**
```json
{
  "workflowName": "send-email-notification",
  "data": {
    "email": "user@example.com",
    "message": "Tu PEI ha sido generado exitosamente",
    "studentName": "María González"
  }
}
```

### 2. **Notificar PEI Generado**
Envía notificación cuando se genera un nuevo PEI.

**Endpoint:** `POST /api/n8n/pei/{peiId}/generated`

**Ejemplo:**
```bash
curl -X POST http://localhost:3001/api/n8n/pei/1/generated
```

### 3. **Notificar PEI Aprobado**
Envía notificación cuando un PEI es aprobado por el educador.

**Endpoint:** `POST /api/n8n/pei/{peiId}/approved`

**Ejemplo:**
```bash
curl -X POST http://localhost:3001/api/n8n/pei/1/approved
```

### 4. **Obtener Estadísticas**
Consulta estadísticas de ejecución de workflows.

**Endpoint:** `GET /api/n8n/stats`

**Respuesta esperada:**
```json
{
  "totalWorkflows": 5,
  "executedWorkflows": 120,
  "successfulExecutions": 115,
  "failedExecutions": 5,
  "averageExecutionTime": 234
}
```

## 🎨 Interfaz de Prueba

### Acceso
- **URL Demo:** http://localhost:8080/workflow-demo
- **Integrada en:** http://localhost:8080/pei-engine (al final de la página)

### Pestañas del Demo

#### 📤 Trigger Workflow
1. **Nombre del Workflow:** Ingresa el nombre del workflow (ej: `send-email-notification`)
2. **Datos (JSON):** Ingresa un objeto JSON con los datos del workflow
3. **Botón:** "Disparar Workflow"

**Ejemplo de uso:**
```json
{
  "email": "teacher@school.com",
  "subject": "Nuevo PEI disponible",
  "body": "Se ha generado un nuevo PEI para el estudiante Juan Pérez",
  "priority": "high"
}
```

#### 🔔 Notificaciones
1. **Notificar PEI Generado:**
   - Ingresa el ID del PEI
   - Haz clic en "Notificar Generación"
   - Envía notificaciones automáticas a padres y educadores

2. **Notificar PEI Aprobado:**
   - Ingresa el ID del PEI
   - Haz clic en "Notificar Aprobación"
   - Activa workflows de implementación

#### 📊 Estadísticas
1. Haz clic en "Cargar Estadísticas"
2. Visualiza métricas de workflows ejecutados
3. Revisa tasas de éxito y fallos

## 🧪 Pruebas con curl

### 1. Verificar Health Check
```bash
curl -X GET http://localhost:3001/api/health
```

### 2. Disparar Workflow
```bash
curl -X POST http://localhost:3001/api/n8n/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "test-workflow",
    "data": {
      "message": "Prueba de workflow",
      "timestamp": "2025-10-12T10:00:00Z"
    }
  }'
```

### 3. Notificar PEI Generado
```bash
curl -X POST http://localhost:3001/api/n8n/pei/1/generated
```

### 4. Notificar PEI Aprobado
```bash
curl -X POST http://localhost:3001/api/n8n/pei/1/approved
```

### 5. Obtener Estadísticas
```bash
curl -X GET http://localhost:3001/api/n8n/stats
```

## 🛠️ Requisitos Previos

### Backend
1. Backend corriendo en `http://localhost:3001`
2. Módulo n8n configurado
3. CORS habilitado para puerto 8080

### Frontend
1. Frontend corriendo en `http://localhost:8080`
2. Variables de entorno configuradas:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## 📦 Componentes Implementados

### `WorkflowDemo.tsx`
Componente React con:
- ✅ 3 pestañas (Trigger, Notificaciones, Estadísticas)
- ✅ Detección automática de conexión backend
- ✅ Validación de formularios
- ✅ Notificaciones toast
- ✅ Manejo de errores
- ✅ Estados de carga

### Servicios API
```typescript
// src/services/neuroplanApi.ts
export const workflowService = {
  trigger: (data: TriggerWorkflowDTO): Promise<ApiResponse<WorkflowExecution>>
  notifyPEIGenerated: (peiId: number): Promise<ApiResponse<WorkflowExecution>>
  notifyPEIApproved: (peiId: number): Promise<ApiResponse<WorkflowExecution>>
  getStats: (): Promise<ApiResponse<any>>
}
```

## 🎬 Escenarios de Prueba

### Escenario 1: Generación de PEI
1. Crear estudiante y subir reporte médico
2. Generar PEI usando AWS Bedrock
3. El sistema dispara automáticamente: `/n8n/pei/{id}/generated`
4. Se envían notificaciones por email/SMS a:
   - Padres del estudiante
   - Educador asignado
   - Administrador del sistema

### Escenario 2: Aprobación de PEI
1. Educador revisa el PEI generado
2. Educador aprueba el PEI
3. El sistema dispara: `/n8n/pei/{id}/approved`
4. Se activan workflows de implementación:
   - Actualización en calendario
   - Asignación de recursos
   - Notificaciones a tutores

### Escenario 3: Workflow Personalizado
1. Crear workflow en n8n para envío de reportes
2. Desde el frontend, disparar workflow con datos personalizados
3. n8n ejecuta las acciones configuradas
4. El sistema registra la ejecución en estadísticas

## 📈 Casos de Uso Reales

### 1. Sistema de Notificaciones Automáticas
**Workflow:** `notify-pei-stakeholders`
```json
{
  "workflowName": "notify-pei-stakeholders",
  "data": {
    "peiId": 1,
    "studentName": "Juan Pérez",
    "parentEmail": "parent@email.com",
    "teacherEmail": "teacher@school.com",
    "generatedDate": "2025-10-12"
  }
}
```

### 2. Generación de Reportes Periódicos
**Workflow:** `generate-monthly-report`
```json
{
  "workflowName": "generate-monthly-report",
  "data": {
    "month": "October",
    "year": 2025,
    "recipients": ["admin@school.com", "director@school.com"]
  }
}
```

### 3. Integración con Google Calendar
**Workflow:** `sync-pei-calendar`
```json
{
  "workflowName": "sync-pei-calendar",
  "data": {
    "peiId": 1,
    "studentId": 5,
    "calendarId": "school-calendar@google.com",
    "events": [
      {
        "title": "Reunión de seguimiento PEI",
        "date": "2025-11-01",
        "duration": 60
      }
    ]
  }
}
```

## 🐛 Solución de Problemas

### Error: Backend no conectado
**Problema:** El frontend no puede conectarse al backend

**Solución:**
1. Verificar que el backend esté corriendo:
   ```bash
   cd ../neuroplan-backend
   npm run start:dev
   ```
2. Verificar CORS en `main.ts`:
   ```typescript
   app.enableCors({
     origin: ['http://localhost:8080', 'http://localhost:5173'],
     credentials: true,
   });
   ```

### Error: Workflow not found
**Problema:** El workflow especificado no existe en n8n

**Solución:**
1. Verificar workflows disponibles en n8n
2. Usar nombres de workflows existentes
3. Revisar configuración de n8n en el backend

### Error: 404 en endpoints
**Problema:** Los endpoints de n8n no existen

**Solución:**
1. Verificar que el módulo n8n esté registrado en `app.module.ts`
2. Verificar rutas en `n8n.controller.ts`
3. Verificar que el backend tenga las dependencias instaladas

## 📊 Métricas de Éxito

### Indicadores Clave
- ✅ Tiempo de respuesta < 2 segundos
- ✅ Tasa de éxito > 95%
- ✅ Notificaciones entregadas en < 5 segundos
- ✅ Escalabilidad: +1000 workflows/día

### Monitoreo
- Dashboard en n8n: `http://localhost:5678`
- Estadísticas en frontend: `/workflow-demo`
- Logs del backend: `console` y archivos

## 🎯 Próximos Pasos

### Mejoras Futuras
1. **Webhooks bidireccionales:** Recibir notificaciones de n8n
2. **Editor visual de workflows:** Crear workflows desde el frontend
3. **Plantillas de workflows:** Workflows predefinidos para casos comunes
4. **Integración con más servicios:**
   - Slack
   - Microsoft Teams
   - Telegram
   - WhatsApp Business

### Optimizaciones
1. **Caché de estadísticas:** Redis para estadísticas en tiempo real
2. **Cola de mensajes:** RabbitMQ para workflows pesados
3. **Retry automático:** Reintentos en caso de fallo
4. **Rate limiting:** Limitar requests por usuario/IP

## 📚 Recursos Adicionales

### Documentación
- [n8n Documentation](https://docs.n8n.io/)
- [Hookdeck Documentation](https://hookdeck.com/docs)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)

### Tutoriales
- [Crear Workflows en n8n](https://docs.n8n.io/workflows/)
- [Webhooks en n8n](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Automatización con n8n](https://docs.n8n.io/courses/)

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 8080
- [ ] CORS configurado correctamente
- [ ] n8n corriendo (opcional para modo mock)
- [ ] Variables de entorno configuradas
- [ ] Endpoint `/api/health` respondiendo
- [ ] Endpoint `/api/n8n/stats` respondiendo
- [ ] Frontend muestra "Backend conectado"
- [ ] Todas las pestañas del demo funcionan
- [ ] Notificaciones toast aparecen correctamente
- [ ] Resultados se muestran en formato JSON

## 🎉 Demo para Hackathon

### Script de Presentación
1. **Introducción (30s):**
   "NeuroPlan automatiza completamente el ciclo de vida de los PEIs usando n8n"

2. **Demo Trigger Workflow (1min):**
   - Mostrar interfaz de Trigger Workflow
   - Ingresar datos de ejemplo
   - Disparar workflow
   - Mostrar resultado exitoso

3. **Demo Notificaciones (1min):**
   - Generar PEI usando AWS Bedrock
   - Disparar notificación de generación
   - Mostrar cómo se envían emails automáticamente
   - Aprobar PEI
   - Disparar notificación de aprobación

4. **Demo Estadísticas (30s):**
   - Cargar estadísticas
   - Mostrar métricas de workflows ejecutados
   - Explicar escalabilidad del sistema

5. **Cierre (30s):**
   "Con n8n, NeuroPlan elimina el trabajo manual y garantiza que todos los stakeholders estén informados en tiempo real"

### Puntos Clave para Destacar
- ✅ **Automatización completa:** Cero intervención manual
- ✅ **Escalabilidad:** Soporta miles de workflows por día
- ✅ **Integración fácil:** Se conecta con cualquier servicio
- ✅ **Tiempo real:** Notificaciones instantáneas
- ✅ **Confiabilidad:** Sistema de reintentos automáticos

---

**Fecha:** 12 de octubre de 2025  
**Versión:** 1.0  
**Equipo:** NeuroPlan Hackathon
