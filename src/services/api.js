// Exemplo de serviço API para integração com backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Autenticação
export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return response.json()
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    localStorage.removeItem('token')
    return response.json()
  }
}

// Perfil do Usuário
export const userService = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    return response.json()
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  saveQuestionnaire: async (answers) => {
    const response = await fetch(`${API_BASE_URL}/users/questionnaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(answers)
    })
    return response.json()
  }
}

// Plano Alimentar
export const mealPlanService = {
  getMealPlan: async () => {
    const response = await fetch(`${API_BASE_URL}/meal-plan`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    return response.json()
  },

  generateMealPlan: async (preferences) => {
    const response = await fetch(`${API_BASE_URL}/meal-plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(preferences)
    })
    return response.json()
  }
}

// Progresso e Calendário
export const progressService = {
  getProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/progress`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    return response.json()
  },

  logDailyGoal: async (date, completed) => {
    const response = await fetch(`${API_BASE_URL}/progress/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ date, completed })
    })
    return response.json()
  }
}

// Utilitário para verificar token
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// Utilitário para setar token após login
export const setAuthToken = (token) => {
  localStorage.setItem('token', token)
}

// Utilitário para remover token
export const removeAuthToken = () => {
  localStorage.removeItem('token')
}
