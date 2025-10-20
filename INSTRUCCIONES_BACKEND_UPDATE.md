# 🔧 INSTRUCCIONES PARA ACTUALIZAR BACKEND

## 📁 Archivo a modificar
`c:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend\prisma\seed.ts`

---

## ✅ CAMBIO REQUERIDO

### Línea 119 - Actualizar contraseña del usuario FAMILIA

**ANTES:**
```typescript
const familiaPassword = await bcrypt.hash('demo123', 10);
```

**DESPUÉS:**
```typescript
const familiaPassword = await bcrypt.hash('Familia123!', 10);
```

---

## 📝 ESTADO ACTUAL DE CONTRASEÑAS

| Usuario | Email | Contraseña Actual | Estado |
|---------|-------|-------------------|--------|
| **System** | system@neuroplan.ai | SystemPass123! | ✅ Cumple validación (11 chars) |
| **Admin** | admin@demo.com | Admin123! | ✅ Cumple validación (9 chars) |
| **Orientador** | orientador@demo.com | Orientador123! | ✅ Cumple validación (14 chars) |
| **Profesor** | profesor@demo.com | Profesor123! | ✅ Cumple validación (12 chars) |
| **Familia** | familia@demo.com | demo123 | ❌ **NO CUMPLE** (7 chars) |

---

## 🔐 VALIDACIÓN DTO BACKEND

El backend requiere contraseñas con:
- **Mínimo 8 caracteres**
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- Al menos 1 carácter especial

**Ubicación del DTO:** `src/modules/auth/dto/login.dto.ts`

```typescript
@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
password: string;
```

---

## 🚀 PASOS PARA APLICAR EL CAMBIO

### 1. Editar el archivo seed.ts
```bash
cd c:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend
```

Abre el archivo `prisma\seed.ts` y cambia la línea 119.

### 2. Regenerar la base de datos
```bash
npm run prisma:reset
# o
npx prisma migrate reset --force
```

Este comando:
- ✅ Elimina la base de datos actual
- ✅ Crea una nueva con el schema actualizado
- ✅ Ejecuta el seed con las nuevas contraseñas

### 3. Verificar que funciona
```bash
npm run start:dev
```

Prueba el login desde el frontend con:
- **Email:** familia@demo.com
- **Contraseña:** Familia123!

---

## 📊 CREDENCIALES ACTUALIZADAS (POST-CAMBIO)

```
┌─────────────┬──────────────────────────┬────────────────────┐
│ Rol         │ Email                    │ Contraseña         │
├─────────────┼──────────────────────────┼────────────────────┤
│ System      │ system@neuroplan.ai      │ SystemPass123!     │
│ Admin       │ admin@demo.com           │ Admin123!          │
│ Orientador  │ orientador@demo.com      │ Orientador123!     │
│ Profesor    │ profesor@demo.com        │ Profesor123!       │
│ Familia     │ familia@demo.com         │ Familia123! (NEW)  │
└─────────────┴──────────────────────────┴────────────────────┘
```

---

## 🔍 VERIFICACIÓN ADICIONAL

### Comprobar que el usuario familia puede ver solo su estudiante

En el servicio de uploads (`src/modules/uploads/uploads.service.ts`), verifica que existe esta lógica:

```typescript
async getStudents(userId: string, userRole: string) {
  if (userRole === 'FAMILIA') {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: { usuarioFamiliaId: true }
    });
    
    if (!user?.usuarioFamiliaId) {
      throw new ForbiddenException('Usuario familiar sin estudiante vinculado');
    }
    
    return [await this.prisma.student.findUnique({
      where: { id: user.usuarioFamiliaId },
      include: { reports: true, peis: true }
    })];
  }
  
  // Para otros roles, devolver todos
  return this.prisma.student.findMany({
    include: { reports: true, peis: true }
  });
}
```

**Si esta lógica NO existe, créala.**

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de aplicar los cambios, verifica:

- [ ] Contraseña de familia actualizada en seed.ts
- [ ] Base de datos regenerada con `prisma:reset`
- [ ] Backend arrancado sin errores
- [ ] Login exitoso desde frontend con familia@demo.com / Familia123!
- [ ] Usuario familia solo ve su estudiante vinculado (demo-student-001)
- [ ] No hay errores en consola del backend
- [ ] Toast de bienvenida aparece correctamente en frontend

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "La contraseña debe tener al menos 8 caracteres"
✅ Verifica que ejecutaste `prisma:reset` después de cambiar seed.ts

### Error: "No se pudo conectar con el servidor"
✅ Asegúrate de que el backend está corriendo en puerto 3001

### Error: "Usuario familiar sin estudiante vinculado"
✅ Verifica que el estudiante tiene `usuarioFamiliaId: familia.id` en el seed

### Login exitoso pero usuario familia ve todos los estudiantes
❌ **Falta implementar filtrado por rol en el backend**
✅ Implementa la lógica de getStudents mostrada arriba

---

## 📚 DOCUMENTACIÓN RELACIONADA

- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
- [bcrypt en Node.js](https://github.com/kelektiv/node.bcrypt.js)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

*Documento generado: 20 Octubre 2025 - NeuroPlan AI Campus*
