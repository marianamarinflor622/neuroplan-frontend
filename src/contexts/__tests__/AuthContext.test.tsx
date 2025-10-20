import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as neuroplanApi from '../../services/neuroplanApi';

// Mock del servicio de API
vi.mock('../../services/neuroplanApi', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock del hook de toast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Inicialización', () => {
    it('debe inicializar con usuario no autenticado', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('debe cargar usuario desde localStorage si existe', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nombre: 'Test',
        apellidos: 'User',
      };

      localStorage.setItem('neuroplan_user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', 'mock-token');

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
      });
    });
  });

  describe('Login', () => {
    it('debe hacer login exitosamente con credenciales válidas', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'admin@demo.com',
            nombre: 'Admin',
            apellidos: 'Demo',
            rol: 'ADMIN',
          },
        },
        status: 200,
      };

      vi.mocked(neuroplanApi.authService.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean = false;
      await waitFor(async () => {
        loginResult = await result.current.login('admin@demo.com', 'Admin123!');
      });

      expect(loginResult).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('admin@demo.com');
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
    });

    it('debe fallar login con credenciales inválidas', async () => {
      vi.mocked(neuroplanApi.authService.login).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean = true;
      await waitFor(async () => {
        loginResult = await result.current.login('wrong@example.com', 'wrongpass');
      });

      expect(loginResult).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('debe rechazar login si la respuesta no tiene token', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            nombre: 'Test',
            apellidos: 'User',
          },
        },
      };

      vi.mocked(neuroplanApi.authService.login).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean = true;
      await waitFor(async () => {
        loginResult = await result.current.login('test@example.com', 'password');
      });

      expect(loginResult).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Logout', () => {
    it('debe hacer logout y limpiar datos', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'admin@demo.com',
            nombre: 'Admin',
            apellidos: 'Demo',
          },
        },
        status: 200,
      };

      vi.mocked(neuroplanApi.authService.login).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(async () => {
        await result.current.login('admin@demo.com', 'Admin123!');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Ahora hacer logout
      result.current.logout();

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalledWith('neuroplan_user');
      });
    });
  });

  describe('UpdateUser', () => {
    it('debe actualizar datos del usuario', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'admin@demo.com',
            nombre: 'Admin',
            apellidos: 'Demo',
          },
        },
      };

      vi.mocked(neuroplanApi.authService.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(async () => {
        await result.current.login('admin@demo.com', 'Admin123!');
      });

      // Actualizar nombre
      result.current.updateUser({ nombre: 'Nuevo Nombre' });

      await waitFor(() => {
        expect(result.current.user?.nombre).toBe('Nuevo Nombre');
        expect(result.current.user?.email).toBe('admin@demo.com'); // Resto sin cambios
      });
    });

    it('no debe actualizar si no hay usuario autenticado', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      result.current.updateUser({ nombre: 'Nuevo Nombre' });

      expect(result.current.user).toBeNull();
    });
  });
});
