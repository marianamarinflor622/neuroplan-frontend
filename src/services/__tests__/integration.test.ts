import { describe, it, expect, vi, beforeEach } from 'vitest';
import { studentsService, authService } from '../neuroplanApi';
import { mapBackendStudent, mapFrontendStudent } from '@/lib/data-mappers';
// Mock de axios
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Integración Backend-Frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mappers de datos', () => {
    it('debe mapear estudiante del backend al frontend', () => {
      const backendStudent = {
        id: '123',
        nombre: 'Juan',
        apellidos: 'Pérez García',
        fechaNacimiento: '2010-05-15',
        curso: '6º Primaria',
        nombreTutor: 'María García',
        emailTutor: 'maria@email.com',
        colegio: 'CEIP Cervantes',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const frontendStudent = mapBackendStudent(backendStudent);

      expect(frontendStudent).toEqual({
        id: '123',
        name: 'Juan',
        lastName: 'Pérez García',
        birthDate: '2010-05-15',
        grade: '6º Primaria',
        parentName: 'María García',
        parentEmail: 'maria@email.com',
        school: 'CEIP Cervantes',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        reports: [],
        peis: [],
      });
    });

    it('debe mapear estudiante del frontend al backend', () => {
      const frontendStudent = {
        name: 'Ana',
        lastName: 'López Martín',
        birthDate: '2012-03-20',
        grade: '4º Primaria',
        parentName: 'Carlos López',
        parentEmail: 'carlos@email.com',
        school: 'CEIP Goya',
      };

      const backendStudent = mapFrontendStudent(frontendStudent);

      expect(backendStudent).toEqual({
        nombre: 'Ana',
        apellidos: 'López Martín',
        fechaNacimiento: '2012-03-20',
        curso: '4º Primaria',
        nombreTutor: 'Carlos López',
        emailTutor: 'carlos@email.com',
        colegio: 'CEIP Goya',
      });
    });
  });

  describe('Servicios de autenticación', () => {
    it('debe manejar login con respuesta del backend', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token-123',
          user: {
            id: '1',
            email: 'test@example.com',
            nombre: 'Test',
            apellidos: 'User',
            rol: 'PROFESOR',
          },
        },
        status: 200,
      };

      const { default: api } = await import('../api');
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password');

      // El resto de asserts se mantienen igual
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('debe manejar login con respuesta alternativa del backend', async () => {
      const mockResponse = {
        data: {
          accessToken: 'jwt-token-456',
          user: {
            id: '2',
            email: 'admin@example.com',
            nombre: 'Admin',
            apellidos: 'Sistema',
            rol: 'ADMIN',
          },
        },
        status: 200,
      };

      const { default: api } = await import('../api');
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.login('admin@example.com', 'password');

      expect(result.data.token).toBe('jwt-token-456');
      expect(result.data.user.email).toBe('admin@example.com');
    });
  });

  describe('Servicios de estudiantes', () => {
    it('debe crear estudiante con datos mapeados', async () => {
      const studentData = {
        firstName: 'Luis',
        lastName: 'Fernández',
        birthDate: '2011-08-10',
        grade: '5º Primaria',
        parentName: 'Elena Fernández',
        parentEmail: 'elena@email.com',
        school: 'CEIP Picasso',
      };

      const mockResponse = {
        data: {
          id: '456',
          nombre: 'Luis',
          apellidos: 'Fernández',
          fechaNacimiento: '2011-08-10',
          curso: '5º Primaria',
          nombreTutor: 'Elena Fernández',
          emailTutor: 'elena@email.com',
          colegio: 'CEIP Picasso',
        },
        status: 201,
      };

      const { default: api } = await import('../api');
      vi.mocked(api.post).mockResolvedValue(mockResponse);

  await studentsService.create(studentData);

      expect(api.post).toHaveBeenCalledWith('/uploads/students', {
        nombre: 'Luis',
        apellidos: 'Fernández',
        fechaNacimiento: '2011-08-10',
        curso: '5º Primaria',
        nombreTutor: 'Elena Fernández',
        emailTutor: 'elena@email.com',
        colegio: 'CEIP Picasso',
      });
    });
  });
});
