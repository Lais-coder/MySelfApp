import { Link } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import background from '../assets/background-image.jpg'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-40 px-4 sm:px-8 lg:px-16 bg-[#D9D5A0]">
        <img 
          src={background} 
          alt="" 
          className="absolute inset-0 w-full h-82 object-cover" 
        />
        
        {/* Conteúdo com z-10 para ficar acima da imagem e relative para permitir o z-index */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-4">Com o MYF'SP você...</p>
            <h1 className="text-3xl sm:text-5xl font-marcellus text-gray-800 mb-4">
              <span className="text-purple-lilac2">Alimenta</span> seus objetivos
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Seu plano, sua nutrição, sua melhor saúde.
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white/90 text-gray-800 rounded-full font-bold shadow-sm hover:bg-gray-300 transition-all duration-300"
              >
                Comece agora
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-purple-lilac2 text-white rounded-full font-bold hover:bg-purple-dark transition-all duration-300"
              >
                Já tenho uma conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-marcellus text-center mb-16">
            <span className="text-purple-lilac2">Benefícios</span> do nosso <span className="text-purple-lilac2">Plano</span> Alimentar
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white/60 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow border border-gray-100">
              <div className="mb-6 flex justify-center">
                <img
                  src="/imagens/energia2.png"
                  alt="Energia"
                  className="w-20 h-20"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="text-2xl font-marcellus text-gray-800 mb-4">
                Mais <span className="text-green-darkGreen">Energia</span>
              </h3>
              <p className="text-gray-600">
                Sinta-se disposto para as atividades do dia a dia.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/60 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow border border-gray-100">
              <div className="mb-6 flex justify-center">
                <img
                  src="/imagens/peso-removebg-preview.png"
                  alt="Peso"
                  className="w-20 h-20"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="text-2xl font-marcellus text-gray-800 mb-4">
                Controle de <span className="text-green-darkGreen">Peso</span>
              </h3>
              <p className="text-gray-600">
                Perda de peso saudável sem dietas restritivas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/60 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow border border-gray-100">
              <div className="mb-6 flex justify-center">
                <img
                  src="/imagens/coração.png"
                  alt="Vida"
                  className="w-20 h-20"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="text-2xl font-marcellus text-gray-800 mb-4">
                Expectativa de <span className="text-green-darkGreen">Vida</span>
              </h3>
              <p className="text-gray-600">
                Uma boa alimentação contribui para sua saúde mental e física.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-marcellus text-purple-lilac2 text-center mb-6">
            Plano Premium para uma experiência ainda mais completa
          </h2>
          <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Com o plano Premium, você terá acesso a um acompanhamento completo com profissionais dedicados ao seu bem-estar físico e mental.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-marcellus text-gray-800 mb-4">
                Consultoria Nutricional
              </h3>
              <p className="text-gray-600">
                Receba planos alimentares personalizados com acompanhamento semanal.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-marcellus text-gray-800 mb-4">
                Treinos Personalizados
              </h3>
              <p className="text-gray-600">
                Tenha treinos ajustados às suas metas com personal trainers experientes.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-purple-lilac2 text-white text-lg font-bold rounded-lg hover:bg-purple-dark transition-colors">
              Assine o Plano Premium
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}