import { Link } from 'react-router-dom'
import { User } from 'lucide-react' // Importando o ícone para o perfil
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'

export default function Navbar() {
  const [homeTarget, setHomeTarget] = useState('/')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        if (u?.username) setHomeTarget('/dashboard')
        if (u?.is_admin && Number(u.is_admin) === 1) setIsAdmin(true)
      }
    } catch (e) {
      setHomeTarget('/')
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white/80 backdrop-blur-md px-8 py-4 shadow-sm">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="flex items-center">
        <Link to={homeTarget} className="flex items-center group">
          <img 
            src={logo} 
            alt="Logo MYF'SP" 
            className="mr-4 h-10 rounded-full transition-transform group-hover:scale-110"
          />
          <span className="font-marcellus text-lg font-bold text-[#1f1d1d]">
            MYF'SP
          </span>
        </Link>
      </div>
      
      {/* Lado Direito: Navegação do Sistema */}
      <div className="flex items-center gap-6">

        <Link 
          to="/plano-alimentar" 
          className="font-marcellus font-medium text-[#1f1d1d] transition-colors duration-300 hover:text-[#40804b]"
        >
          Plano Alimentar
        </Link>

        <Link 
          to="/calendario" 
          className="font-marcellus font-medium text-[#1f1d1d] transition-colors duration-300 hover:text-[#40804b]"
        >
          Calendário
        </Link>

        {isAdmin && (
          <Link 
            to="/admin" 
            className="font-marcellus font-medium text-[#1f1d1d] transition-colors duration-300 hover:text-[#40804b]"
          >
            Admin
          </Link>
        )}

        {/* Link para o Perfil com imagem/ícone */}
        <Link 
          to="/profile" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e0e8f0] text-[#999] hover:bg-[#40804b] hover:text-white transition-all overflow-hidden border border-gray-200"
        >
          {/* Se você tiver uma imagem de usuário real, pode usar uma <img /> aqui */}
          <User size={24} className="text-inherit" />
        </Link>
      </div>
    </nav>
  )
}