import { renderHook, act } from '@testing-library/react';
import { useApiRequest } from '../useApiRequest';
import { vi } from 'vitest';
// Mock del api-error-handler
vi.mock('../../lib/api-error-handler', () => ({
  handleApiError: vi.fn((error) => ({
    getUserFriendlyMessage: () => 'Error de prueba',
    isAuthError: () => false,
    isValidationError: () => false,
  })),
  logError: vi.fn(),
}));

describe('useApiRequest', () => {
  it('debe inicializar con estados correctos', () => {
    const { result } = renderHook(() => useApiRequest<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar ejecución exitosa', async () => {
    const mockData = 'test data';
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useApiRequest<string>());

    await act(async () => {
      const response = await result.current.execute(mockApiCall);
      expect(response).toBe(mockData);
    });

    expect(result.current.data).toBe(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores correctamente', async () => {
    const mockError = new Error('API Error');
    const mockApiCall = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useApiRequest<string>());

    await act(async () => {
      try {
        await result.current.execute(mockApiCall);
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it('debe resetear todos los estados', async () => {
    const { result } = renderHook(() => useApiRequest<string>());

    // Simular estado con datos
    await act(async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });
      await result.current.execute(mockApiCall);
    });

    expect(result.current.data).toBe('test');

    // Resetear
    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

// Tests simplificados - solo useApiRequest básico
// Los otros hooks se implementarán en futuras iteraciones