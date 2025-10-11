import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
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

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Aquí verificarías si hay un token válido en localStorage/sessionStorage
        const savedUser = localStorage.getItem('neuroplan_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('neuroplan_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Aquí harías la llamada real a tu API de autenticación
      // Por ahora simulamos una respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular datos de usuario (en producción vendrían del backend)
      const userData: User = {
        id: '1',
        email,
        nombre: 'Usuario',
        apellidos: 'NeuroPlan',
        perfilNeuroAcademico: {
          nivelActual: 'Bachillerato',
          objetivosAcademicos: 'Acceder a la universidad',
          fortalezas: ['Memoria visual', 'Pensamiento lógico'],
          areasApoyo: ['Atención', 'Organización'],
          preferenciasSensoriales: ['Visual', 'Interactivo']
        }
      };
      
      setUser(userData);
      localStorage.setItem('neuroplan_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

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
