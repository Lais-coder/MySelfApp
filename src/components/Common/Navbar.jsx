import { Link, useLocation } from 'react-router-dom'
import { User, UtensilsCrossed, Calendar, Settings } from 'lucide-react' 
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'

export default function Navbar() {
  const [homeTarget, setHomeTarget] = useState('/')
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

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

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 shadow-sm">
      {/* Lado Esquerdo: Logo */}
      <div className="flex items-center">
        <Link to={homeTarget} className="flex items-center group">
          <img 
            src={logo} 
            alt="Logo" 
            className="mr-2 md:mr-4 h-8 md:h-10 rounded-full transition-transform group-hover:scale-110"
          />
          <span className="font-marcellus text-base md:text-lg font-bold text-[#1f1d1d]">
            MYF'SP
          </span>
        </Link>
      </div>
      
      {/* Lado Direito: Navegação */}
      <div className="flex items-center gap-2 md:gap-6">

        {/* Plano Alimentar */}
        <Link 
          to="/plano-alimentar" 
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 
            ${isActive('/plano-alimentar') 
              ? 'bg-[#f0f8f7] md:bg-transparent text-[#40804b]' 
              : 'text-[#1f1d1d] hover:text-[#40804b] md:hover:bg-transparent'}`}
          title="Plano Alimentar"
        >
          <UtensilsCrossed size={22} className="md:hidden" />
          <span className="hidden md:block font-marcellus font-medium">Plano Alimentar</span>
        </Link>

        {/* Calendário */}
        <Link 
          to="/calendario" 
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 
            ${isActive('/calendario') 
              ? 'bg-[#f0f8f7] md:bg-transparent text-[#40804b]' 
              : 'text-[#1f1d1d] hover:text-[#40804b] md:hover:bg-transparent'}`}
          title="Calendário"
        >
          <Calendar size={22} className="md:hidden" />
          <span className="hidden md:block font-marcellus font-medium">Calendário</span>
        </Link>

        {/* Admin */}
        {isAdmin && (
          <Link 
            to="/admin" 
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 
              ${isActive('/admin') 
                ? 'bg-[#f0f8f7] md:bg-transparent text-[#40804b]' 
                : 'text-[#1f1d1d] hover:text-[#40804b] md:hover:bg-transparent'}`}
            title="Admin"
          >
            <Settings size={22} className="md:hidden" />
            <span className="hidden md:block font-marcellus font-medium">Admin</span>
          </Link>
        )}

        {/* Perfil - Mantive o círculo pois é um elemento de avatar */}
        <Link 
          to="/profile" 
          className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all overflow-hidden border 
            ${isActive('/profile') 
              ? 'bg-[#40804b] text-white border-[#40804b]' 
              : 'bg-[#e0e8f0] text-[#999] border-gray-200 hover:bg-[#40804b] hover:text-white'}`}
        >
          <User size={20} className="md:size-[24px] text-inherit" />
        </Link>
      </div>
    </nav>
  )
}