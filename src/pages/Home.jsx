import { Link } from 'react-router-dom'
// Importação dos ícones do Lucide
import { Zap, Scale, Heart } from 'lucide-react' 
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import background from '../assets/background-image.jpg'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-4 sm:px-8 lg:px-16 bg-[#D9D5A0]">
        <img 
          src={background} 
          alt="" 
          className="fixed inset-0 w-full h-full object-cover z-0" 
        />
        
        <div className="fixed inset-0 bg-black/5 z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-4 font-semibold drop-shadow-sm">
              Com o MYF'SP você...
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-marcellus text-gray-800 mb-4 sm:mb-6 leading-tight">
              <span className="text-purple-lilac2">Alimenta</span> seus objetivos
            </h1>
            <p className="text-lg sm:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-md mx-auto md:mx-0">
              Seu plano, sua nutrição, sua melhor saúde.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white/95 text-gray-800 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-all text-center"
              >
                Comece agora
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-purple-lilac2 text-white rounded-full font-bold shadow-lg hover:bg-purple-dark transition-all text-center"
              >
                Já tenho uma conta
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Benefícios Section - Agora com Lucide Icons */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-marcellus text-center mb-12 sm:mb-16">
            <span className="text-purple-lilac2">Benefícios</span> do nosso <span className="text-purple-lilac2">Plano</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 - Energia */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100 group hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <Zap size={64} className="text-green-darkGreen group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-marcellus text-gray-800 mb-3">Mais <span className="text-green-darkGreen">Energia</span></h3>
              <p className="text-gray-600 text-sm sm:text-base">Sinta-se disposto para as atividades do dia a dia.</p>
            </div>

            {/* Card 2 - Peso */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100 group hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <Scale size={64} className="text-green-darkGreen group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-marcellus text-gray-800 mb-3">Controle de <span className="text-green-darkGreen">Peso</span></h3>
              <p className="text-gray-600 text-sm sm:text-base">Perda de peso saudável sem dietas restritivas.</p>
            </div>

            {/* Card 3 - Vida */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100 group hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <Heart size={64} className="text-green-darkGreen group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-marcellus text-gray-800 mb-3">Expectativa de <span className="text-green-darkGreen">Vida</span></h3>
              <p className="text-gray-600 text-sm sm:text-base">Uma boa alimentação contribui para sua saúde.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-marcellus text-purple-lilac2 text-center mb-6">
            Plano Premium
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-700 mb-10 max-w-2xl mx-auto">
            Acesso a um acompanhamento completo com profissionais dedicados.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-marcellus text-gray-800 mb-3">Consultoria Nutricional</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Planos personalizados com acompanhamento semanal.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-marcellus text-gray-800 mb-3">Treinos Personalizados</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Treinos ajustados às suas metas e rotina.</p>
            </div>
          </div>

          <div className="text-center">
            <button className="w-full sm:w-auto px-10 py-4 bg-purple-lilac2 text-white text-lg font-bold rounded-full hover:bg-purple-dark transition-all shadow-lg">
              Assine o Plano Premium
            </button>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}