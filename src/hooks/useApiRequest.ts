import { useState, useCallback } from 'react';
import { ApiError, handleApiError, logError } from '@/lib/api-error-handler';
import type { ApiResponse } from '@/types/api';

/**
 * Estado del hook useApiRequest
 */
interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Opciones para el hook
 */
interface UseApiRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  logErrors?: boolean;
}

/**
 * Hook personalizado para manejar llamadas a la API de forma consistente
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApiRequest<Student[]>();
 * 
 * const loadStudents = async () => {
 *   await execute(() => studentService.getAll());
 * };
 * ```
 */
export function useApiRequest<T>(options: UseApiRequestOptions = {}) {
  const { onSuccess, onError, logErrors = true } = options;

  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Ejecuta una llamada a la API y maneja estados
   */
  const execute = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      endpoint?: string
    ): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();

        // Validar estructura de respuesta
        if (!response || typeof response !== 'object') {
          throw new Error('Respuesta de API inválida');
        }

        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        // Callback de éxito
        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        const apiError = handleApiError(err, endpoint);

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        // Log del error
        if (logErrors) {
          logError(apiError, { endpoint });
        }

        // Callback de error
        if (onError) {
          onError(apiError);
        }

        return null;
      }
    },
    [onSuccess, onError, logErrors]
  );

  /**
   * Reinicia el estado del hook
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Actualiza los datos sin hacer nueva llamada
   */
  const setData = useCallback((newData: T | null) => {
    setState((prev) => ({ ...prev, data: newData }));
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
    // Propiedades derivadas útiles
    isError: state.error !== null,
    isSuccess: state.data !== null && state.error === null,
    isEmpty: state.data === null && !state.loading && state.error === null,
  };
}

/**
 * Variante del hook para mutaciones (POST, PUT, DELETE)
 * No almacena data automáticamente, ideal para formularios
 */
export function useApiMutation<TData = any, TVariables = any>(
  options: UseApiRequestOptions = {}
) {
  const { onSuccess, onError, logErrors = true } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (
      apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>,
      variables: TVariables,
      endpoint?: string
    ): Promise<TData | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(variables);

        setLoading(false);

        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        const apiError = handleApiError(err, endpoint);

        setLoading(false);
        setError(apiError);

        if (logErrors) {
          logError(apiError, { endpoint, variables });
        }

        if (onError) {
          onError(apiError);
        }

        return null;
      }
    },
    [onSuccess, onError, logErrors]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
    isError: error !== null,
  };
}

/**
 * Hook para manejar múltiples requests en paralelo
 * 
 * @example
 * ```tsx
 * const { execute, loading, errors } = useParallelRequests();
 * 
 * const loadData = async () => {
 *   const [students, teachers] = await execute([
 *     () => studentService.getAll(),
 *     () => teacherService.getAll()
 *   ]);
 * };
 * ```
 */
export function useParallelRequests() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApiError[]>([]);

  const execute = useCallback(
    async <T extends any[]>(
      apiCalls: Array<() => Promise<ApiResponse<any>>>
    ): Promise<Array<any | null>> => {
      setLoading(true);
      setErrors([]);

      const results = await Promise.allSettled(
        apiCalls.map((call) => call())
      );

      const data: Array<any | null> = [];
      const newErrors: ApiError[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          data.push(result.value.data);
        } else {
          const error = handleApiError(result.reason);
          data.push(null);
          newErrors.push(error);
          logError(error, { requestIndex: index });
        }
      });

      setLoading(false);
      setErrors(newErrors);

      return data;
    },
    []
  );

  return {
    execute,
    loading,
    errors,
    hasErrors: errors.length > 0,
  };
}
