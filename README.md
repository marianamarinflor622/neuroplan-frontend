# 🧠 NeuroPlan AI Campus - Frontend

Plataforma educativa integrada que adapta los temarios oficiales a cada estudiante neurodivergente mediante IA personalizada, alineada con LOMLOE.

## 🎯 Descripción

**NeuroPlan AI Campus** es una plataforma que automatiza la creación de **Planes Educativos Individualizados (PEI)** para estudiantes con necesidades educativas especiales, integrándose directamente en centros educativos españoles.

### Características principales:
- 🤖 **Generación automática de PEIs** con IA
- 📚 **Adaptación de temarios oficiales** a diferentes estilos de aprendizaje
- ♿ **Sistema de accesibilidad avanzado** (WCAG 2.1)
- 🏫 **Multi-tenancy** para múltiples centros educativos
- 🔐 **Sistema de roles** completo (Admin, Orientador, Profesor, Director, Estudiante/Familia)
- 📊 **Dashboard educativo** con métricas de progreso
- 🎨 **Adaptación visual/auditiva/kinestésica** automática

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript 5.8**
- **Vite 7.1** (build tool)
- **Tailwind CSS 3.4** + **shadcn/ui**
- **React Router** (navegación)
- **React Query** (gestión estado servidor)
- **React Hook Form** + **Zod** (formularios y validación)

### Backend Integration
- **NestJS** backend (puerto 3001)
- **PostgreSQL** + **Prisma ORM**
- **JWT** + **RBAC** (autenticación y roles)
- **AWS Bedrock** (Claude AI para generación PEI)

## 🚀 Inicio Rápido

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

### Ejecutar en Desarrollo
```bash
npm run dev
# Aplicación disponible en http://localhost:5173
```

### Build para Producción
```bash
npm run build
npm run preview
```

## 👥 Sistema de Roles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN** | Administrador del sistema | Control total |
| **ORIENTADOR** | Psicopedagogo/orientador | Crear PEIs, gestionar estudiantes |
| **PROFESOR** | Profesor del centro | Consultar PEIs, seguimiento |
| **DIRECTOR_CENTRO** | Director del centro educativo | Vista institucional |
| **ESTUDIANTE_FAMILIA** | Estudiante o familia | Acceso a su perfil y progreso |

## 🔌 Endpoints Backend

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de usuario
- `GET /auth/me` - Perfil usuario actual

### Gestión de Estudiantes
- `POST /api/uploads/students` - Crear estudiante
- `GET /api/uploads/students` - Listar estudiantes
- `GET /api/uploads/students/:id` - Obtener estudiante
- `POST /api/uploads/reports/:studentId` - Subir informe médico

### PEIs (Planes Educativos)
- `POST /api/peis/generate` - Generar PEI con IA
- `GET /api/peis` - Listar PEIs
- `GET /api/peis/:id` - Obtener PEI específico
- `GET /api/peis/:id/pdf` - Descargar PEI en PDF

### Servicios IA
- `POST /api/aws/bedrock/generate-pei` - Generar PEI con Claude
- `POST /api/aws/bedrock/simplify-content` - Simplificar contenido
- `POST /api/aws/textract/extract` - Extraer texto de documentos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes shadcn/ui
│   ├── Header.tsx       # Navegación principal
│   ├── AccessibilityPanel.tsx # Panel de accesibilidad
│   └── ProtectedRoute.tsx # Rutas protegidas por rol
├── pages/               # Páginas de la aplicación
│   ├── Index.tsx        # Página de inicio
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── PEIEngine.tsx    # Motor de generación PEI
│   ├── Login.tsx        # Inicio de sesión
│   └── Register.tsx     # Registro
├── contexts/            # Contextos React
│   ├── AuthContext.tsx  # Autenticación y usuario
│   └── AccessibilityContext.tsx # Configuración accesibilidad
├── services/            # Servicios API
│   ├── api.ts           # Cliente HTTP base
│   └── neuroplanApi.ts  # Endpoints específicos
├── types/               # Tipos TypeScript
│   └── api.ts           # Interfaces y enums
├── hooks/               # Hooks personalizados
└── lib/                 # Utilidades
    └── utils.ts         # Funciones helper
```

## ♿ Sistema de Accesibilidad

El proyecto incluye un sistema de accesibilidad completo con:

- **Ajustes de contenido**: Tamaño de fuente, espaciado, altura de línea
- **Ajustes de color**: Contraste, saturación, brillo
- **Herramientas**: Cursor personalizado, guía de lectura, magnificador
- **Perfiles predefinidos**: Epilepsia, Dificultades de aprendizaje, Visuales, Seniors, TDAH, Dislexia
- **Filtros para daltonismo**: Protanopia, Deuteranopia, Tritanopia, etc.

## 🧪 Testing

### Tests Automatizados:
```bash
# Ejecutar tests unitarios
npm test

# Coverage report
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

**Cobertura actual:** 82% (objetivo: 80% ✅)  
**Tests:** 19 tests implementados (18 passing - 94.7%)

### Usuarios de prueba:
```javascript
// Admin
email: "admin@demo.com"
password: "Admin123!"

// Orientador
email: "orientador@demo.com"
password: "Orientador123!"

// Profesor  
email: "profesor@demo.com"
password: "Profesor123!"

// Estudiante/Familia
email: "familia@demo.com"
password: "demo123"  // ⚠️ Pendiente cambiar a "Familia123!"

// Director
email: "director@demo.com"
password: "Director123!"
```

### Testing con Backend Real:
1. Asegurar que el backend esté ejecutándose en puerto 3001
2. Verificar conectividad: `curl http://localhost:3001/health`
3. Usar credenciales reales del backend

### CI/CD:
GitHub Actions configurado con:
- ✅ Lint (ESLint)
- ✅ Tests unitarios (Vitest)
- ✅ Build verification
- ✅ Accessibility tests (Lighthouse)
- ✅ Security scan (Snyk)

## 🏗️ Build y Deploy

### Build de Producción:
```bash
npm run build
# Output en carpeta dist/
```

### Optimizaciones incluidas:
- Code splitting automático
- Tree shaking
- Compresión de assets
- Bundle analysis disponible

## 🔧 Configuración Avanzada

### Personalizar tema:
Ver `tailwind.config.ts` para personalizar colores y estilos.

### Configurar API:
Modificar `src/services/api.ts` para ajustar configuración HTTP.

### Agregar nuevos roles:
1. Actualizar enum `UserRole` en `src/types/api.ts`
2. Modificar `AuthContext.tsx` para manejar el nuevo rol
3. Actualizar `ProtectedRoute.tsx` para permisos

## 📊 Estado del Proyecto

### ✅ Completado (100%):
- **Arquitectura Frontend**: React 18 + TypeScript + Vite
- **Sistema de Autenticación**: JWT + RBAC con 5 roles
- **Error Handling**: ApiError class + handleApiError utility
- **API Hooks**: useApiRequest, useApiMutation, useParallelRequests
- **Testing**: 19 tests unitarios (94.7% passing, 82% coverage)
- **CI/CD**: GitHub Actions pipeline con 4 jobs
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks
- **Accesibilidad**: Panel completo + WCAG 2.1
- **UI Components**: shadcn/ui integrado

### 🔄 En Desarrollo:
- Integración completa frontend-backend
- Testing E2E con Playwright
- Filtrado por rol FAMILIA

### � Pendientes:
- Gestión de Temarios
- Tutor Virtual IA
- Analytics Educativo
- Integraciones LMS

---

## 📚 Documentación

Ver carpeta `/docs` para:
- Plan de acción técnico completo
- Resumen de fases completadas
- Auditoría final del proyecto
- Instrucciones de backend

---

**Desarrollado con ❤️ para la educación inclusiva en España**

*Última actualización: 20 de Octubre de 2025*