# 🔍 AUDITORÍA TÉCNICA COMPLETA - NEUROPLAN AI CAMPUS
**Fecha:** 20 de Octubre de 2025  
**Análisis conjunto:** Claude + GPT  
**Estado:** Frontend operativo en modo demo | Backend operativo con gaps

---

## 📊 DIAGNÓSTICO ACTUAL

### ✅ Lo que FUNCIONA
- **Frontend**: React 18 + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend**: NestJS + Prisma + PostgreSQL
- **Servicios activos**: Puerto 8080 (frontend), 3001 (backend), 5432 (DB)
- **Autenticación básica**: JWT + 5 roles definidos
- **UI/UX**: Panel accesibilidad, componentes organizados
- **Documentación**: README y auditorías actualizadas

### ⚠️ Lo que NECESITA ATENCIÓN INMEDIATA

#### 1. **Frontend - Integración Real**
- ❌ AuthContext en modo fallback (genera usuarios mock si backend falla)
- ❌ No hay manejo global de errores HTTP
- ❌ Falta loading states y feedback visual
- ❌ Sin validación runtime de respuestas API
- ❌ Sin tests (0 coverage)
- ❌ Import con doble espacio en ProtectedRoute.tsx
- ❌ Sin configuración ESLint/Prettier en pipeline
- ❌ Accesibilidad sin auditoría (falta WCAG compliance)

#### 2. **Backend - Seguridad y Completitud**
- ❌ Contraseñas demo (123456) vs DTO (mínimo 8 chars)
- ❌ Sin filtrado por centro/estudiante (familia ve todo)
- ❌ `/auth/me` básico, falta enriquecer
- ❌ Sin auditoría de acciones (compliance RGPD)
- ❌ Sin versionado de PEIs
- ❌ Sin rate limiting
- ❌ Sin logging centralizado
- ❌ Servicios IA como placeholders (sin orquestación real)
- ❌ Falta módulo Curriculum y ContentAdaptation

#### 3. **Infraestructura - DevOps**
- ❌ Sin CI/CD automatizado
- ❌ Sin tests automatizados
- ❌ Sin monitoreo/observabilidad
- ❌ Sin estrategia de backups
- ❌ Sin documentación de deployment

---

## 🎯 PLAN DE ACCIÓN INMEDIATO

### FASE 1: CORRECCIONES CRÍTICAS (Esta semana)

#### A. Frontend - Limpieza y Robustez

**1.1 Arreglar ProtectedRoute.tsx**
```typescript
// ANTES:
import {  useLocation, Link } from 'react-router-dom';

// DESPUÉS:
import { useLocation, Link } from 'react-router-dom';
```

**1.2 Implementar Manejo Global de Errores**
```typescript
// src/lib/api-error-handler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return new ApiError(
      error.response.status,
      error.response.data.message || 'Error del servidor',
      error.response.data
    );
  }
  if (error.request) {
    return new ApiError(0, 'No se pudo conectar con el servidor', error);
  }
  return new ApiError(500, error.message || 'Error desconocido');
};
```

**1.3 Mejorar AuthContext - Quitar Fallback Demo**
```typescript
// src/contexts/AuthContext.tsx
const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  
  try {
    const response = await authService.login(email, password);
    
    if (!response.data.token || !response.data.user) {
      throw new ApiError(401, 'Respuesta inválida del servidor');
    }
    
    localStorage.setItem('authToken', response.data.token);
    setUser(response.data.user);
    localStorage.setItem('neuroplan_user', JSON.stringify(response.data.user));
    
    return true;
  } catch (error) {
    const apiError = handleApiError(error);
    toast({
      title: 'Error de autenticación',
      description: apiError.message,
      variant: 'destructive',
    });
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**1.4 Agregar Hook de API con Loading States**
```typescript
// src/hooks/useApiRequest.ts
export function useApiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      setData(response.data);
      return response.data;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

#### B. Backend - Seguridad Básica

**2.1 Arreglar Contraseñas Demo**
```bash
# Opción 1: Actualizar seed.ts
# Cambiar todas las contraseñas de "123456" a "Demo2025!"

# Opción 2: Relajar validación temporalmente
# En src/modules/auth/dto/login.dto.ts:
@MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
password: string;
```

**2.2 Implementar Filtrado por Rol Familia**
```typescript
// src/modules/uploads/uploads.service.ts
async getStudents(userId: string, userRole: string) {
  if (userRole === 'FAMILIA') {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: { usuarioFamiliaId: true }
    });
    
    if (!user?.usuarioFamiliaId) {
      throw new ForbiddenException('Usuario familiar sin estudiante vinculado');
    }
    
    return [await this.prisma.estudiante.findUnique({
      where: { id: user.usuarioFamiliaId },
      include: { reports: true, peis: true }
    })];
  }
  
  // Para otros roles, devolver todos
  return this.prisma.estudiante.findMany({
    include: { reports: true, peis: true }
  });
}
```

**2.3 Enriquecer /auth/me**
```typescript
// src/modules/auth/auth.controller.ts
@UseGuards(JwtAuthGuard)
@Get('me')
async getProfile(@CurrentUser() user: any) {
  const fullUser = await this.authService.getUserWithRelations(user.id);
  
  return {
    id: fullUser.id,
    email: fullUser.email,
    nombre: fullUser.nombre,
    apellidos: fullUser.apellidos,
    rol: fullUser.rol,
    centroId: fullUser.centroId,
    centro: fullUser.centro,
    activo: fullUser.activo,
    ...(fullUser.rol === 'FAMILIA' && {
      estudianteVinculado: fullUser.estudianteVinculado
    }),
    ...(fullUser.rol === 'PROFESOR' && {
      asignaturas: fullUser.asignaturas,
      grupos: fullUser.grupos
    })
  };
}
```

**2.4 Middleware de Auditoría Básico**
```typescript
// src/common/middleware/audit.middleware.ts
@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    res.on('finish', async () => {
      if (req.user) {
        await this.prisma.auditLog.create({
          data: {
            userId: req.user.id,
            action: `${req.method} ${req.path}`,
            statusCode: res.statusCode,
            duration: Date.now() - startTime,
            timestamp: new Date()
          }
        });
      }
    });
    
    next();
  }
}
```

#### C. Testing Inicial

**3.1 Configurar Jest en Frontend**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

**3.2 Test Básico de AuthContext**
```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  it('debe inicializar con usuario no autenticado', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('debe hacer login correctamente', async () => {
    // Mock del servicio
    // Test del flujo completo
  });
});
```

**3.3 E2E Test Básico**
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('login exitoso redirige al dashboard', async ({ page }) => {
  await page.goto('http://localhost:8080/login');
  
  await page.fill('input[type="email"]', 'admin@demo.com');
  await page.fill('input[type="password"]', 'Demo2025!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

### FASE 2: MEJORAS ESTRUCTURALES (Próximas 2 semanas)

#### A. Módulo Curriculum (Backend)

**Estructura de archivos:**
```
src/modules/curriculum/
├── curriculum.module.ts
├── curriculum.controller.ts
├── curriculum.service.ts
├── dto/
│   ├── create-curriculum.dto.ts
│   └── update-curriculum.dto.ts
└── entities/
    └── curriculum.entity.ts
```

**Schema Prisma:**
```prisma
model Curriculum {
  id                    String   @id @default(uuid())
  asignatura            String
  nivel                 String
  etapa                 String // PRIMARIA, ESO, BACHILLERATO, FP
  resultadosAprendizaje Json
  criteriosEvaluacion   Json
  competenciasClave     Json
  contenidosOficiales   Json
  centroId              String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  contenidosAdaptados ContenidoAdaptado[]
  
  @@index([centroId, nivel, asignatura])
}

model ContenidoAdaptado {
  id           String @id @default(uuid())
  curriculumId String
  peiId        String
  modalidad    String // visual, auditivo, kinestesico, mixto
  contenido    Json
  recursos     Json
  complejidad  String
  
  curriculum Curriculum @relation(fields: [curriculumId], references: [id])
  pei        PEI        @relation(fields: [peiId], references: [id])
  
  @@index([curriculumId, peiId])
}
```

#### B. Sistema de Versionado PEIs

```prisma
model PEIVersion {
  id            String   @id @default(uuid())
  peiId         String
  version       Int
  status        String
  contenido     Json
  cambios       Json
  creadoPor     String
  aprobadoPor   String?
  motivoCambio  String?
  
  createdAt DateTime @default(now())
  
  pei     PEI     @relation(fields: [peiId], references: [id])
  creator Usuario @relation("created", fields: [creadoPor], references: [id])
  approver Usuario? @relation("approved", fields: [aprobadoPor], references: [id])
  
  @@index([peiId, version])
}
```

#### C. Pasaporte Educativo

```prisma
model PasaporteEducativo {
  id           String @id @default(uuid())
  estudianteId String @unique
  
  logros       Json[]
  competencias Json[]
  badges       Json[]
  historial    Json[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  estudiante Estudiante @relation(fields: [estudianteId], references: [id])
}

model EventoProgreso {
  id           String   @id @default(uuid())
  estudianteId String
  tipo         String // leccion_completada, evaluacion, intervencion
  datos        Json
  timestamp    DateTime @default(now())
  
  estudiante Estudiante @relation(fields: [estudianteId], references: [id])
  
  @@index([estudianteId, timestamp])
}
```

---

### FASE 3: IA Y AUTOMATIZACIÓN (Semanas 3-4)

#### A. Microservicio Python para IA

**Estructura:**
```
neuroplan-ai-service/
├── app/
│   ├── main.py
│   ├── routers/
│   │   ├── pei_generation.py
│   │   ├── content_adaptation.py
│   │   └── analysis.py
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── ocr_service.py
│   │   └── adaptation_service.py
│   └── models/
│       ├── pei_model.py
│       └── schemas.py
├── requirements.txt
└── Dockerfile
```

**Integración con NestJS:**
```typescript
// src/modules/ai/ai.service.ts
@Injectable()
export class AIService {
  private aiServiceUrl = process.env.AI_SERVICE_URL;

  async generatePEI(diagnosticData: any): Promise<any> {
    const response = await axios.post(
      `${this.aiServiceUrl}/pei/generate`,
      diagnosticData,
      { timeout: 30000 }
    );
    
    return response.data;
  }

  async adaptContent(curriculum: any, pei: any): Promise<any> {
    const response = await axios.post(
      `${this.aiServiceUrl}/content/adapt`,
      { curriculum, pei }
    );
    
    return response.data;
  }
}
```

#### B. N8N Workflows

**Workflow 1: Procesamiento de Informe**
```
Trigger: Webhook (nuevo informe subido)
→ AWS Textract (OCR)
→ AWS Comprehend (análisis entidades)
→ Python AI Service (generar borrador PEI)
→ Crear PEI en DB (estado: DRAFT)
→ Notificación email a orientador
```

**Workflow 2: Aprobación PEI**
```
Trigger: Webhook (PEI aprobado)
→ Generar PDF del PEI
→ Actualizar Pasaporte Educativo
→ Notificación email a familia
→ Notificación SMS (Vonage)
→ Registrar en auditoría
```

---

### FASE 4: SEGURIDAD Y COMPLIANCE (Semana 5)

#### A. Rate Limiting
```typescript
// src/main.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de requests
  message: 'Demasiadas peticiones, intenta de nuevo más tarde'
});

app.use('/api/', limiter);
```

#### B. Helmet y CORS Estricto
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### C. Cifrado de Archivos
```typescript
// src/modules/uploads/encryption.service.ts
import crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  encrypt(buffer: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    return { encrypted, iv, tag };
  }

  decrypt(encrypted: Buffer, iv: Buffer, tag: Buffer): Buffer {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
```

---

### FASE 5: TESTING Y CI/CD (Semana 6)

#### A. GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:e2e
      - run: npm run build

  e2e:
    needs: [frontend, backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx playwright install
      - run: npm run test:e2e
```

#### B. Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 📊 MÉTRICAS DE ÉXITO

### Técnicas
- ✅ Coverage de tests: >80%
- ✅ Build time: <2min
- ✅ Lighthouse score: >90
- ✅ Bundle size: <500KB (sin lazy loading)
- ✅ API response time: <200ms (p95)
- ✅ Uptime: >99.5%

### Funcionales
- ✅ % PEIs generados automáticamente: >80%
- ✅ Tiempo generación PEI: <2min
- ✅ Satisfacción usuarios: >4/5
- ✅ Cumplimiento WCAG 2.1 AA: 100%
- ✅ Incidentes seguridad: 0

---

## 🗓️ CRONOGRAMA EJECUTIVO

| Semana | Fase | Entregables |
|--------|------|-------------|
| 1 | Correcciones Críticas | Auth real, errores manejados, tests básicos |
| 2-3 | Mejoras Estructurales | Módulo Curriculum, Versionado PEIs, Pasaporte |
| 3-4 | IA & Automatización | Microservicio Python, n8n workflows |
| 5 | Seguridad & Compliance | Rate limiting, cifrado, auditoría |
| 6 | Testing & CI/CD | Pipeline completo, E2E tests |

---

## 🎯 PRIORIDADES INMEDIATAS (PRÓXIMAS 48H)

### ✅ HACER AHORA
1. **Arreglar import en ProtectedRoute.tsx**
2. **Actualizar contraseñas demo a Demo2025!**
3. **Implementar handleApiError en AuthContext**
4. **Crear hook useApiRequest**
5. **Agregar filtrado familia en backend**
6. **Configurar ESLint + Prettier**
7. **Primer test E2E de login**

### 📝 DOCUMENTAR
1. **API contract (OpenAPI/Swagger)**
2. **Guía de desarrollo**
3. **Arquitectura actualizada (diagrama)**
4. **Política de RGPD y consentimientos**

---

## 🤝 CONCLUSIÓN Y SIGUIENTE PASO

**Coincido completamente con el análisis de GPT.** La base está sólida pero necesita:
1. Cerrar la integración real (quitar fallbacks)
2. Robustecer seguridad y filtros
3. Completar módulos faltantes (Curriculum, Pasaporte)
4. Añadir testing y CI/CD
5. Implementar IA real (no placeholders)

**¿Quieres que empecemos por alguna de las correcciones inmediatas?** Puedo:
- Arreglar el código ahora mismo
- Generar los archivos de configuración
- Crear los tests básicos
- Diseñar los diagramas de arquitectura
- O priorizar cualquier otra área

---

*Documento generado por Claude con análisis conjunto GPT - 20 Octubre 2025*
