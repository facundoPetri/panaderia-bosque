import React, { createContext, useContext, useState } from 'react';

// Definimos el tipo del contexto de autenticación
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Creamos el contexto de autenticación con el tipo definido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));

  const login = (token: string) => {
    sessionStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  const authContextValue: AuthContextType = {
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
