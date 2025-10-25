import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '../ProtectedRoute';
import { UserRole } from '@/types/api';
import { vi } from 'vitest';
// Mock del AuthContext
const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
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
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show content when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com' },
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('debe mostrar loading cuando está cargando', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    // Mock de window.location
    const mockLocation = {
      href: '',
      assign: vi.fn(),
    };
  Object.defineProperty(globalThis, 'location', {
      value: mockLocation,
      writable: true,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Necesitas iniciar sesión para acceder a tu Perfil NeuroAcadémico')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('debe verificar permisos de rol cuando se especifica', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com', rol: 'PROFESOR' },
    });

    render(
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ORIENTADOR]}>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('No tienes permisos para acceder a esta sección')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('debe permitir acceso cuando el rol está en la lista permitida', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com', rol: 'ADMIN' },
    });

    render(
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ORIENTADOR]}>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
