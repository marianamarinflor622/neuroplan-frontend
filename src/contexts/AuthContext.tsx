import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { authService } from '../services/neuroplanApi';
import { UserRole } from '../types/api';
import { handleApiError, logError } from '@/lib/api-error-handler';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol?: UserRole;
  centroId?: string;
  centro?: {
    id: string;
    nombre: string;
    codigo: string;
  };
  activo?: boolean;
  perfilNeuroAcademico?: {
    nivelActual: string;
    objetivosAcademicos: string;
    fortalezas: string[];
    areasApoyo: string[];
    preferenciasSensoriales: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token válido en localStorage
        const savedUser = localStorage.getItem('neuroplan_user');
        const authToken = localStorage.getItem('authToken');
        
        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('neuroplan_user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      // Validar respuesta del backend
      if (!response.data.token || !response.data.user) {
        toast({
          title: 'Error de autenticación',
          description: 'Respuesta inválida del servidor',
          variant: 'destructive',
        });
        return false;
      }
      
      // Guardar token y datos de usuario
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      localStorage.setItem('neuroplan_user', JSON.stringify(response.data.user));
      
      toast({
        title: '¡Bienvenido!',
        description: `Has iniciado sesión como ${response.data.user.nombre}`,
      });
      
      return true;
    } catch (error) {
      const apiError = handleApiError(error, '/auth/login');
      
      logError(apiError, { email });
      
      toast({
        title: 'Error al iniciar sesión',
        description: apiError.getUserFriendlyMessage(),
        variant: 'destructive',
      });
      
      // Limpiar cualquier dato previo
      localStorage.removeItem('authToken');
      localStorage.removeItem('neuroplan_user');
      setUser(null);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('neuroplan_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('neuroplan_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
