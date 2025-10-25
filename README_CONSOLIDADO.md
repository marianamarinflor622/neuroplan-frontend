# 🧠 NeuroPlan AI Campus - Documentación Consolidada

## 📋 Estado del Proyecto (Octubre 2025)

### ✅ COMPLETADO
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + PostgreSQL + Prisma (37 endpoints)
- **Autenticación**: JWT + RBAC con 5 roles
- **UI/UX**: shadcn/ui + sistema de accesibilidad
- **Testing**: Estructura configurada con Vitest
- **Limpieza**: Console.logs eliminados, archivos innecesarios removidos

### 🔄 EN PROGRESO
- Integración real frontend-backend
- Testing automatizado (cobertura objetivo: 70%)
- Seguridad básica implementada

### ⏳ PENDIENTE
- Módulo Curriculum
- Generación PEI con IA real
- CI/CD pipeline
- Deploy en producción

## 🚀 Instalación y Desarrollo

### Prerequisitos
- Node.js 18+
- Backend NeuroPlan corriendo en puerto 3001

### Instalación
```bash
git clone <repository>
cd neuroplan-frontend
npm install
```

### Variables de Entorno
Crear archivo `.env` en la raíz:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo (puerto 8080)
npm run build        # Build producción
npm run test         # Tests unitarios
npm run test:coverage # Tests con cobertura
npm run lint         # ESLint
npm run format       # Prettier
```

## 🏗️ Arquitectura

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite 7.1
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: React Query + Context API
- **Routing**: React Router v6
- **Testing**: Vitest + Testing Library

### Backend Integration
- **API**: NestJS (puerto 3001)
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + RBAC
- **AI**: AWS Bedrock (Claude)

## 👥 Sistema de Roles

| Rol | Descripción | Permisos |
|-----|------------|----------|
| **ADMIN** | Administrador del sistema | Control total |
| **ORIENTADOR** | Orientador educativo | Crear PEIs, gestionar estudiantes |
| **PROFESOR** | Profesor de aula | Ver PEIs, recursos educativos |
| **DIRECTOR_CENTRO** | Director del centro | Aprobar PEIs, métricas |
| **FAMILIA** | Familia del estudiante | Ver solo su hijo, descargar PEI |

## 🔐 Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/me` - Perfil del usuario

### Estudiantes
- `GET /api/uploads/students` - Listar estudiantes
- `POST /api/uploads/students` - Crear estudiante
- `GET /api/uploads/students/:id` - Obtener estudiante

### PEIs
- `POST /api/peis/generate-from-diagnosis` - Generar PEI
- `GET /api/peis` - Listar PEIs
- `GET /api/peis/:id/pdf` - Descargar PDF

## 🧪 Testing

### Estructura de Tests
```
src/
├── contexts/__tests__/
│   └── AuthContext.test.tsx
├── hooks/__tests__/
│   └── useApiRequest.test.ts
└── components/__tests__/
    └── ProtectedRoute.test.tsx
```

### Ejecutar Tests
```bash
npm run test              # Tests unitarios
npm run test:coverage     # Con cobertura
npm run test:ui          # Interfaz visual
```

### Cobertura Objetivo
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔧 Configuración

### ESLint + Prettier
- Configuración automática en pre-commit
- Reglas TypeScript estrictas
- Formateo consistente

### Pre-commit Hooks
```bash
# Se ejecutan automáticamente antes de cada commit:
- ESLint --fix
- Prettier --write
- Si hay errores, commit se cancela
```

## 📊 Métricas de Calidad

### Código
- **Console.logs**: 0 (eliminados)
- **Archivos innecesarios**: 0 (limpiados)
- **Dependencias**: Optimizadas
- **TypeScript**: Estricto

### Testing
- **Cobertura actual**: 0% → Objetivo: 70%
- **Tests implementados**: 3 suites
- **Framework**: Vitest + Testing Library

## 🚨 Problemas Conocidos

### Críticos
1. **Desalineación tipos**: Frontend usa `name/lastName`, backend `nombre/apellidos`
2. **Sin filtrado por rol**: Familia puede ver todos los estudiantes
3. **Contraseñas débiles**: Demo usa "123456" vs DTO 8+ caracteres

### Menores
1. **Sin CI/CD**: Pipeline no configurado
2. **Sin monitoreo**: Observabilidad limitada
3. **Documentación API**: Swagger no implementado

## 🎯 Próximos Pasos

### Inmediato (Esta semana)
1. ✅ **Limpieza completada**
2. ✅ **Testing configurado**
3. ⏳ **Integración real frontend-backend**
4. ⏳ **Corrección de tipos de datos**

### Corto plazo (2 semanas)
1. **Módulo Curriculum** (backend + frontend)
2. **Testing E2E** con Playwright
3. **CI/CD pipeline** básico
4. **Seguridad mejorada**

### Medio plazo (1 mes)
1. **IA real** (Python microservice)
2. **N8N workflows**
3. **AWS integration** completa
4. **Deploy en producción**

## 📞 Soporte

Para consultas técnicas:
- 📧 Email: [contacto]
- 📚 Documentación: `/docs` (archivos consolidados)
- 🐛 Issues: GitHub Issues

---

**Última actualización**: 20 Octubre 2025  
**Versión**: MVP v0.1 (Alpha)  
**Estado**: 🔄 En desarrollo activo
