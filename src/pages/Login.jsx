import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    ;(async () => {
      try {
        await login(formData.username, formData.password)
        navigate('/profile')
      } catch (err) {
      }
    })()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-medium to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h2 className="text-4xl font-marcellus text-center text-purple-lilac2 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu nome de usuário"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-purple-lilac2 focus:outline-none focus:ring-2 focus:ring-purple-lilac2/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-purple-lilac2 focus:outline-none focus:ring-2 focus:ring-purple-lilac2/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-medium text-white text-lg font-bold rounded-lg hover:bg-green-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-700">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-purple-lilac2 font-bold hover:text-purple-dark transition-colors">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
