/**
 * Manejo centralizado de errores de API
 * Proporciona tipado fuerte y mensajes consistentes para errores HTTP
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Determina si el error es de autenticación
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  /**
   * Determina si el error es de validación
   */
  isValidationError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  /**
   * Determina si el error es del servidor
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Obtiene un mensaje amigable para el usuario
   */
  getUserFriendlyMessage(): string {
    if (this.statusCode === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    if (this.statusCode === 401) {
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }

    if (this.statusCode === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }

    if (this.statusCode === 404) {
      return 'El recurso solicitado no existe.';
    }

    if (this.statusCode === 422) {
      return 'Los datos proporcionados no son válidos.';
    }

    if (this.statusCode >= 500) {
      return 'Error del servidor. Por favor, intenta nuevamente más tarde.';
    }

    return this.message || 'Ha ocurrido un error inesperado.';
  }
}

/**
 * Convierte errores de Axios/Fetch en ApiError tipados
 */
export const handleApiError = (error: any, endpoint?: string): ApiError => {
  // Error de respuesta HTTP (4xx, 5xx)
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Extraer mensaje del backend si existe
    const message =
      data?.message ||
      data?.error ||
      data?.msg ||
      getDefaultMessageForStatus(status);

    return new ApiError(status, message, data, endpoint);
  }

  // Error de red (sin respuesta del servidor)
  if (error.request) {
    return new ApiError(
      0,
      'No se pudo conectar con el servidor',
      { originalError: error.message },
      endpoint
    );
  }

  // Error de configuración o desconocido
  return new ApiError(
    500,
    error.message || 'Error desconocido',
    { originalError: error },
    endpoint
  );
};

/**
 * Mensajes por defecto según código HTTP
 */
function getDefaultMessageForStatus(status: number): string {
  const messages: Record<number, string> = {
    400: 'Solicitud incorrecta',
    401: 'No autenticado',
    403: 'Acceso denegado',
    404: 'Recurso no encontrado',
    409: 'Conflicto con el estado actual',
    422: 'Datos de validación incorrectos',
    429: 'Demasiadas solicitudes',
    500: 'Error interno del servidor',
    502: 'Puerta de enlace incorrecta',
    503: 'Servicio no disponible',
    504: 'Tiempo de espera agotado',
  };

  return messages[status] || `Error HTTP ${status}`;
}

/**
 * Utilidad para registrar errores (puede integrarse con Sentry, LogRocket, etc.)
 */
export const logError = (error: ApiError, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 API Error:', {
      statusCode: error.statusCode,
      message: error.message,
      endpoint: error.endpoint,
      details: error.details,
      context,
      stack: error.stack,
    });
  }

  // TODO: Integrar con servicio de logging en producción
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
};

/**
 * Type guard para verificar si un error es ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
