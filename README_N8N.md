# 🔄 n8n Workflow Automation - README

## 📋 ¿Qué es esto?

Demo interactivo de la integración de **n8n** para automatización de workflows en NeuroPlan.

---

## 🚀 Inicio Rápido (30 segundos)

### 1. Iniciar servidores
```bash
# Terminal 1: Backend
cd ../neuroplan-backend && npm run start:dev

# Terminal 2: Frontend  
npm run dev
```

### 2. Abrir demo
```
http://localhost:8080/workflow-demo
```

### 3. Verificar
✅ Badge verde "Backend conectado"

---

## 🎯 Funcionalidades

### 1️⃣ Trigger Workflow
Dispara workflows personalizados con datos JSON.

**Ejemplo:**
```json
{
  "email": "teacher@school.com",
  "subject": "Nuevo PEI generado",
  "priority": "high"
}
```

### 2️⃣ Notificaciones PEI
- **Generado:** Notifica cuando se crea un PEI
- **Aprobado:** Notifica cuando se aprueba un PEI

### 3️⃣ Estadísticas
Visualiza métricas de workflows ejecutados en tiempo real.

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| `QUICKSTART_N8N.md` | Guía de inicio rápido |
| `N8N_WORKFLOW_TESTING_GUIDE.md` | Testing completo |
| `N8N_DEMO_SUMMARY.md` | Resumen ejecutivo |
| `DEMO_FINAL_INSTRUCTIONS.md` | Instrucciones para hackathon |

---

## 🧪 Testing

### Test Automatizado
```bash
node test-n8n-endpoints.cjs
```

### Test Visual
```
http://localhost:8080/test-connection.html
```

---

## 🎬 Demo Rápida (1 minuto)

1. **Abrir:** http://localhost:8080/workflow-demo
2. **Estadísticas:** Clic en "Cargar Estadísticas"
3. **Notificación:** Ingresar ID `1` → Notificar
4. **Resultado:** Ver JSON de respuesta

---

## 🔌 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/n8n/trigger-workflow` | Disparar workflow |
| POST | `/n8n/pei/:id/generated` | Notificar generación |
| POST | `/n8n/pei/:id/approved` | Notificar aprobación |
| GET | `/n8n/stats` | Obtener estadísticas |

---

## 💡 Casos de Uso

### Notificación Automática
Cuando se genera un PEI:
1. Sistema dispara workflow
2. n8n envía emails a padres/educadores
3. Actualiza calendarios
4. Registra en sistemas externos

### Reportes Mensuales
Workflow programado que:
1. Genera reporte de métricas
2. Envía a administradores
3. Actualiza dashboards

---

## 🐛 Solución de Problemas

### Backend no conectado
```bash
# Verificar backend
curl http://localhost:3001/api/health

# Si no responde, iniciar:
cd ../neuroplan-backend
npm run start:dev
```

### CORS Error
Verificar `main.ts` del backend:
```typescript
app.enableCors({
  origin: ['http://localhost:8080'],
  credentials: true,
});
```

---

## ✅ Verificación Rápida

```bash
# Test completo
node test-n8n-endpoints.cjs

# Resultado esperado:
# ✓ TODOS LOS TESTS PASARON
```

---

## 🎯 Estado

🟢 **PRODUCTION READY**

- ✅ Componente funcional
- ✅ 3 pestañas implementadas
- ✅ Integración completa
- ✅ Documentación exhaustiva
- ✅ Tests automatizados

---

## 📞 Más Información

Ver documentación completa en:
- `PROYECTO_COMPLETO.md` - Resumen total
- `N8N_WORKFLOW_TESTING_GUIDE.md` - Guía detallada
- `DEMO_FINAL_INSTRUCTIONS.md` - Script de hackathon

---

**Versión:** 1.0  
**Fecha:** 12 de octubre de 2025  
**Estado:** ✅ Listo para Demo
