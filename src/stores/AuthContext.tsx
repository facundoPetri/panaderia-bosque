import React, { createContext, useContext, useState } from 'react'

interface LoginType {
  access_token: string
  fullname: string
  type: string
}
// Definimos el tipo del contexto de autenticación
interface AuthContextType {
  token: string | null
  login: ({ access_token, fullname, type }: LoginType) => void
  logout: () => void
}

// Creamos el contexto de autenticación con el tipo definido
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('token')
  )

  const login = ({ access_token, fullname, type }: LoginType) => {
    sessionStorage.setItem('token', access_token)
    sessionStorage.setItem('fullname', fullname)
    sessionStorage.setItem('userType', type)
    setToken(access_token)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setToken(null)
  }

  const authContextValue = React.useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  )

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
