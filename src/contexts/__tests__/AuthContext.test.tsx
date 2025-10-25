import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthContext';
import { vi } from 'vitest';
// Mock del servicio de autenticación
vi.mock('../../services/neuroplanApi', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock del hook useToast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock del api-error-handler
vi.mock('../../lib/api-error-handler', () => ({
  handleApiError: vi.fn((error) => ({
    getUserFriendlyMessage: () => 'Error de prueba',
    isAuthError: () => false,
    isValidationError: () => false,
  })),
  logError: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with unauthenticated user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('debe manejar login exitoso', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      nombre: 'Test',
      apellidos: 'User',
      rol: 'PROFESOR',
    };

    const mockResponse = {
      data: {
        token: 'mock-token',
        user: mockUser,
      },
      status: 200,
    };

    const { authService } = await import('../../services/neuroplanApi');
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    // Nota: localStorage se maneja internamente en AuthContext
  });

  it('debe manejar login fallido', async () => {
    const { authService } = await import('../../services/neuroplanApi');
    vi.mocked(authService.login).mockRejectedValue(new Error('Credenciales inválidas'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const success = await result.current.login('test@example.com', 'wrong-password');
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('debe hacer logout correctamente', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Simular login exitoso primero
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      nombre: 'Test',
      apellidos: 'User',
    };

    const mockResponse = {
      data: {
        token: 'mock-token',
        user: mockUser,
      },
      status: 200,
    };

    const { authService } = await import('../../services/neuroplanApi');
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    // Hacer login primero
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Hacer logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should update user data', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    const initialUser = {
      id: '1',
      email: 'test@example.com',
      nombre: 'Test',
      apellidos: 'User',
    };
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: initialUser,
      },
      status: 200,
    };

    const { authService } = await import('../../services/neuroplanApi');
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

  // Login first to have a user
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(initialUser);

  // Update user
    act(() => {
      result.current.updateUser({
        firstName: 'Updated Name',
      });
    });

    expect(result.current.user?.firstName).toBe('Updated Name');
    expect(result.current.user?.email).toBe('test@example.com'); // Otros campos se mantienen
  });
});