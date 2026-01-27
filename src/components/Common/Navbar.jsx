import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white/80 backdrop-blur-md px-8 py-4 shadow-sm">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="Logo MYF'SP" 
            className="mr-4 h-10 rounded-full"
          />
          <span className="font-marcellus text-lg font-bold text-[#1f1d1d]">
            MYF'SP
          </span>
        </Link>
      </div>
      
      {/* Lado Direito: Links com Hover e Tooltip */}
      <div className="flex items-center">
        <a 
          href="#contato" 
          className="group relative mx-4 font-medium text-[#1f1d1d] transition-colors duration-300 hover:text-[#00796b]"
        >
          Contato
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded border border-gray-300 bg-white px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
            (11) 91234-5678
          </span>
        </a>

        <a 
          href="#email" 
          className="group relative mx-4 font-medium text-[#1f1d1d] transition-colors duration-300 hover:text-[#00796b]"
        >
          Email
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded border border-gray-300 bg-white px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
            myfsp@gmail.com.br
          </span>
        </a>
      </div>
    </nav>
  )
}