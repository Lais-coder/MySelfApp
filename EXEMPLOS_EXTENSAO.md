// Exemplo 1: Usando o Componente Questionnaire em outra página

import { useState } from 'react'
import QuestionnaireStep from '../components/Questionnaire/QuestionnaireStep'

const customQuestions = [
  {
    id: 'exercise1',
    question: 'Qual tipo de exercício você prefere?',
    options: [
      { id: 'cardio', label: 'Cardio' },
      { id: 'weights', label: 'Musculação' },
      { id: 'yoga', label: 'Yoga' },
      { id: 'mixed', label: 'Misto' }
    ]
  },
  {
    id: 'frequency',
    question: 'Com que frequência deseja treinar?',
    options: [
      { id: 'daily', label: 'Diariamente' },
      { id: 'five_days', label: '5 dias por semana' },
      { id: 'three_days', label: '3 dias por semana' }
    ]
  }
]

export default function ExerciseQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = (answers) => {
    console.log('Respostas do exercício:', answers)
    if (currentStep < customQuestions.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <QuestionnaireStep
      step={currentStep}
      totalSteps={customQuestions.length}
      questions={customQuestions}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  )
}

// ============================================
// Exemplo 2: Proteger rotas com autenticação

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Uso em App.jsx:
// <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

// ============================================
// Exemplo 3: Integrar Contexto de Autenticação

import { AuthProvider } from './context/AuthContext'
import App from './App'

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

// ============================================
// Exemplo 4: Usar serviço de API

import { useEffect, useState } from 'react'
import { userService } from '../services/api'

export default function MealPlanComponent() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        const data = await userService.getMealPlan()
        setMeals(data)
      } catch (error) {
        console.error('Erro ao carregar plano:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMealPlan()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      {meals.map(meal => (
        <div key={meal.id}>{meal.name}</div>
      ))}
    </div>
  )
}

// ============================================
// Exemplo 5: Adicionar Validação em Formulário

import { useState } from 'react'

export default function LoginWithValidation() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'Usuário é obrigatório'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Usuário deve ter pelo menos 3 caracteres'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Formulário válido!', formData)
      // Fazer login
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={errors.username ? 'border-red-500' : ''}
        />
        {errors.username && <span className="text-red-500">{errors.username}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  )
}

// ============================================
// Exemplo 6: Estado Global com localStorage

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Uso:
// const [user, setUser] = useLocalStorage('user', null)

// ============================================
// Exemplo 7: Modal Reutilizável

import { useState } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Uso:
// const { isOpen, open, close } = useModal()
// <button onClick={open}>Abrir Modal</button>
// <Modal isOpen={isOpen} onClose={close} title="Título">
//   Conteúdo aqui
// </Modal>

// ============================================
// Exemplo 8: Toast/Notificação

import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const show = (message, type = 'info', duration = 3000) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }

  const success = (message) => show(message, 'success')
  const error = (message) => show(message, 'error')
  const info = (message) => show(message, 'info')

  return { toast, show, success, error, info }
}

export function Toast({ message, type }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  )
}
