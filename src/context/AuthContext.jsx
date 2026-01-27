import { useState, useContext, createContext } from 'react'

// Criar contexto de autenticação
export const AuthContext = createContext()

// Provedor de autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      // Aqui você chamaria a API real
      const userData = { username, email: `${username}@example.com` }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

// Contexto para perfil do usuário
export const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [questionnnaireAnswers, setQuestionnaireAnswers] = useState({})

  const updateProfile = (data) => {
    setProfile(prev => ({ ...prev, ...data }))
  }

  const saveAnswers = (answers) => {
    setQuestionnaireAnswers(answers)
    localStorage.setItem('questionnaire', JSON.stringify(answers))
  }

  const value = {
    profile,
    questionnnaireAnswers,
    updateProfile,
    saveAnswers
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

// Hook para usar contexto de perfil
export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile deve ser usado dentro de ProfileProvider')
  }
  return context
}
