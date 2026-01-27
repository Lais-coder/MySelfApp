// Exemplos de como adicionar TypeScript ao projeto (Opcional)
// Renomeie os arquivos .jsx para .tsx e use tipos

// ============================================
// Exemplo 1: Tipagem de Componente

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  children 
}: ButtonProps) {
  return (
    <button 
      className={`btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ============================================
// Exemplo 2: Tipagem de State

import { useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // ...
}

// ============================================
// Exemplo 3: Tipagem de Props Complexos

interface QuestionnaireProps {
  step: number
  totalSteps: number
  questions: Question[]
  onNext: (answers: Record<string, string>) => void
  onPrevious: () => void
}

interface Question {
  id: string
  question: string
  type: 'radio' | 'checkbox' | 'text'
  options: Option[]
}

interface Option {
  id: string
  label: string
}

export function Questionnaire({ 
  step, 
  totalSteps, 
  questions, 
  onNext, 
  onPrevious 
}: QuestionnaireProps) {
  // ...
}

// ============================================
// Exemplo 4: Tipagem de API Service

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // ...
  }
}

// ============================================
// Exemplo 5: Tipagem de Context

import { createContext, ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // ...
}

// ============================================
// Exemplo 6: Tipagem de useCallback e useMemo

import { useCallback, useMemo } from 'react'

interface MealPlan {
  id: number
  name: string
  calories: number
}

export function MealPlanner() {
  const meals: MealPlan[] = []

  const handleSelectMeal = useCallback((mealId: number): void => {
    console.log(`Selected meal: ${mealId}`)
  }, [])

  const totalCalories = useMemo((): number => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0)
  }, [meals])

  return <div>{totalCalories}</div>
}

// ============================================
// Exemplo 7: Tipagem de Custom Hooks

import { useState, useCallback } from 'react'

interface UseFormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [state, setState] = useState<UseFormState<T>>({
    data: initialValues,
    errors: {},
    isSubmitting: false
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value }
    }))
  }, [])

  return { ...state, handleChange }
}

// Uso:
const { data, handleChange } = useForm(
  { username: '', password: '' },
  async (values) => { /* submit */ }
)

// ============================================
// Exemplo 8: Tipagem de Evento

import { FormEvent, ChangeEvent } from 'react'

export function LoginForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // ...
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  )
}

// ============================================
// Exemplo 9: Tipagem de Array de Componentes

import React from 'react'

interface NavLink {
  label: string
  href: string
  icon?: React.ReactNode
}

export function Navbar() {
  const links: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/profile' },
  ]

  return (
    <nav>
      {links.map(link => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}

// ============================================
// Exemplo 10: Tipagem com Generics

interface Pagination<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export async function fetchPaginated<T>(
  url: string,
  page: number = 1,
  pageSize: number = 10
): Promise<Pagination<T>> {
  const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`)
  return response.json()
}

// Uso:
const users = await fetchPaginated<User>('/api/users')
const meals = await fetchPaginated<Meal>('/api/meals', 1, 20)
