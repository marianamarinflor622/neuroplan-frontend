import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApiRequest, useApiMutation } from '../useApiRequest';
import type { ApiResponse } from '../../types/api';

describe('useApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estados iniciales', () => {
    it('debe inicializar con estados correctos', () => {
      const { result } = renderHook(() => useApiRequest());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe('Execute - Llamada exitosa', () => {
    it('debe manejar una llamada exitosa correctamente', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockApiCall = vi.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        message: 'Success',
      } as ApiResponse<typeof mockData>);

      const { result } = renderHook(() => useApiRequest());

      let returnedData: any;
      await waitFor(async () => {
        returnedData = await result.current.execute(mockApiCall);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
      expect(returnedData).toEqual(mockData);
    });

    it('debe ejecutar callback onSuccess', async () => {
      const mockData = { id: '1', name: 'Test' };
      const onSuccess = vi.fn();
      const mockApiCall = vi.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        message: 'Success',
      } as ApiResponse<typeof mockData>);

      const { result } = renderHook(() => useApiRequest({ onSuccess }));

      await waitFor(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Execute - Llamada con error', () => {
    it('debe manejar errores correctamente', async () => {
      const mockError = new Error('API Error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() => useApiRequest({ onError }));

      let returnedData: any;
      await waitFor(async () => {
        returnedData = await result.current.execute(mockApiCall);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeTruthy();
      expect(result.current.isError).toBe(true);
      expect(returnedData).toBeNull();
      expect(onError).toHaveBeenCalled();
    });

    it('debe manejar respuesta inválida', async () => {
      const mockApiCall = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useApiRequest());

      await waitFor(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.isError).toBe(true);
    });
  });

  describe('Reset', () => {
    it('debe resetear todos los estados', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockApiCall = vi.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        message: 'Success',
      } as ApiResponse<typeof mockData>);

      const { result } = renderHook(() => useApiRequest());

      await waitFor(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.data).toEqual(mockData);

      await waitFor(() => {
        result.current.reset();
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('SetData', () => {
    it('debe actualizar data manualmente', async () => {
      const { result } = renderHook(() => useApiRequest());
      const newData = { id: '2', name: 'Manual' };

      await waitFor(() => {
        result.current.setData(newData);
        expect(result.current.data).toEqual(newData);
      });
    });
  });
});

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estados iniciales', () => {
    it('debe inicializar con estados correctos', () => {
      const { result } = renderHook(() => useApiMutation());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Mutate - Exitoso', () => {
    it('debe ejecutar mutación exitosamente', async () => {
      const mockData = { id: '1', name: 'Created' };
      const variables = { name: 'New Item' };
      const mockApiCall = vi.fn().mockResolvedValue({
        data: mockData,
        status: 201,
        message: 'Created',
      } as ApiResponse<typeof mockData>);

      const onSuccess = vi.fn();
      const { result } = renderHook(() => useApiMutation({ onSuccess }));

      let returnedData: any;
      await waitFor(async () => {
        returnedData = await result.current.mutate(mockApiCall, variables);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(returnedData).toEqual(mockData);
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Mutate - Con error', () => {
    it('debe manejar errores en mutación', async () => {
      const mockError = new Error('Mutation failed');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() => useApiMutation({ onError }));

      let returnedData: any;
      await waitFor(async () => {
        returnedData = await result.current.mutate(mockApiCall, {});
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.isError).toBe(true);
      expect(returnedData).toBeNull();
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Reset', () => {
    it('debe resetear estados de mutación', async () => {
      const mockError = new Error('Test error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);

      const { result } = renderHook(() => useApiMutation());

      await waitFor(async () => {
        await result.current.mutate(mockApiCall, {});
      });

      expect(result.current.error).toBeTruthy();

      await waitFor(() => {
        result.current.reset();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.isError).toBe(false);
      });
    });
  });
});
