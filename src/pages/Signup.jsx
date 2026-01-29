import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire from '../components/Questionnaire'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function Signup() {
  const [step, setStep] = useState('form') 
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    const errs = {}
    if (!form.username || form.username.length < 3) errs.username = 'Usuário deve ter ao menos 3 caracteres'
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Email inválido'
    if (!form.password || form.password.length < 6) errs.password = 'Senha deve ter ao menos 6 caracteres'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'As senhas não coincidem'
    setValidationErrors(errs)
    if (Object.keys(errs).length) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Erro ao criar usuário')
        return
      }

      await login(form.username, form.password)
      setStep('questionnaire')
    } catch (err) {
      setError(err.message)
    }
  }

  if (step === 'questionnaire') {
    return <Questionnaire />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f7f7f7] font-marcellus">
      <div className="w-full max-w-[600px] bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
        
        {/* Header com Barra de Progresso */}
        <header className="flex items-center px-5 py-3 bg-[#f0f0f0] border-b border-[#ddd]">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#333] hover:text-[#7c64a4] transition-colors bg-transparent border-none cursor-pointer">
            &larr;
          </button>
          <div className="flex-1 h-[5px] bg-[#7c64a4] ml-[15px] rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
        </header>

        {/* Conteúdo do Formulário */}
        <div className="p-8 md:p-10 text-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="mx-auto w-20 mb-4 rounded-full transition-transform duration-300 hover:scale-110" 
          />
          <h2 className="text-2xl font-bold text-[#333] mb-5">Criando sua conta</h2>

          <form onSubmit={handleRegister} className="grid gap-4 text-left">
            
            {/* Campo: Usuário (Estilo .option) */}
            <div className="flex flex-col bg-[#f9f9f9] border border-[#ddd] rounded-lg p-3 transition-all hover:bg-[#8a43fd38] hover:border-[#7c64a4] group">
              <label className="text-base text-[#333] mb-1.5">Usuário</label>
              <input 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                required 
                placeholder="Digite seu usuário"
                className="w-full p-3 border border-[#ddd] rounded-lg text-base outline-none transition-all focus:border-[#7c64a4] group-hover:border-[#7c64a4]" 
              />
              {validationErrors.username && <p className="text-xs text-red-600 mt-1">{validationErrors.username}</p>}
            </div>

            {/* Campo: Email */}
            <div className="flex flex-col bg-[#f9f9f9] border border-[#ddd] rounded-lg p-3 transition-all hover:bg-[#8a43fd38] hover:border-[#7c64a4] group">
              <label className="text-base text-[#333] mb-1.5">Email</label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="Digite seu email"
                className="w-full p-3 border border-[#ddd] rounded-lg text-base outline-none transition-all focus:border-[#7c64a4] group-hover:border-[#7c64a4]" 
              />
              {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}
            </div>

            {/* Campo: Senha */}
            <div className="flex flex-col bg-[#f9f9f9] border border-[#ddd] rounded-lg p-3 transition-all hover:bg-[#8a43fd38] hover:border-[#7c64a4] group">
              <label className="text-base text-[#333] mb-1.5">Senha</label>
              <input 
                name="password" 
                type="password"
                value={form.password} 
                onChange={handleChange} 
                required 
                placeholder="Digite sua senha"
                className="w-full p-3 border border-[#ddd] rounded-lg text-base outline-none transition-all focus:border-[#7c64a4] group-hover:border-[#7c64a4]" 
              />
              {validationErrors.password && <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>}
            </div>

            {/* Campo: Confirmação */}
            <div className="flex flex-col bg-[#f9f9f9] border border-[#ddd] rounded-lg p-3 transition-all hover:bg-[#8a43fd38] hover:border-[#7c64a4] group">
              <label className="text-base text-[#333] mb-1.5">Confirme a senha</label>
              <input 
                name="confirmPassword" 
                type="password"
                value={form.confirmPassword} 
                onChange={handleChange} 
                required 
                placeholder="Confirme sua senha"
                className="w-full p-3 border border-[#ddd] rounded-lg text-base outline-none transition-all focus:border-[#7c64a4] group-hover:border-[#7c64a4]" 
              />
              {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>}
            </div>

            {/* Botão Próximo (Estilo .continue-btn) */}
            <button 
              type="submit" 
              className="w-full mt-2 bg-[#7c64a4] text-white py-3.5 rounded-lg text-lg font-bold transition-all active:scale-[0.98] hover:opacity-90 disabled:bg-[#b2b2b2]"
            >
              Próximo
            </button>
            
            {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          </form>
        </div>

        <footer className="text-center p-3 bg-[#f0f0f0] text-sm text-[#666]">
          &copy; 2024, Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}