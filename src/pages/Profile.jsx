import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function Profile() {
  const location = useLocation()
  const [userAnswers, setUserAnswers] = useState({})
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Obter respostas do questionário se vieram da signup
    if (location.state?.answers) {
      setUserAnswers(location.state.answers)
    }

    // Simular carregamento de dados do usuário
    setUserData({
      name: 'Seu Nome',
      email: 'seu.email@exemplo.com',
      joinDate: new Date().toLocaleDateString('pt-BR')
    })
  }, [location])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-marcellus text-purple-lilac2 mb-8">Seu Perfil</h1>

          {userData && (
            <div className="mb-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Informações Pessoais</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="text-lg font-semibold text-gray-800">{userData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Membro desde</p>
                      <p className="text-lg font-semibold text-gray-800">{userData.joinDate}</p>
                    </div>
                  </div>
                </div>

                {Object.keys(userAnswers).length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Seu Perfil Nutricional</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-semibold">Objetivo:</span> {userAnswers.q1 || 'Não definido'}</p>
                      <p><span className="font-semibold">Atividade:</span> {userAnswers.q2 || 'Não definida'}</p>
                      <p><span className="font-semibold">Restrições:</span> {userAnswers.q3 || 'Nenhuma'}</p>
                      <p><span className="font-semibold">Tipo de corpo:</span> {userAnswers.q4 || 'Não informado'}</p>
                      <p><span className="font-semibold">Refeições/dia:</span> {userAnswers.q5 || 'Não definida'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/plano-alimentar"
              className="p-6 bg-gradient-to-br from-purple-light/20 to-purple-medium/20 rounded-lg border-2 border-purple-lilac2 hover:shadow-lg transition-all text-center"
            >
              <h3 className="text-2xl font-marcellus text-purple-lilac2 mb-2">Plano Alimentar</h3>
              <p className="text-gray-700">Veja seu plano de refeições personalizado</p>
            </Link>

            <Link
              to="/calendario"
              className="p-6 bg-gradient-to-br from-green-light/20 to-green-medium/20 rounded-lg border-2 border-green-darkGreen hover:shadow-lg transition-all text-center"
            >
              <h3 className="text-2xl font-marcellus text-green-darkGreen mb-2">Calendário</h3>
              <p className="text-gray-700">Acompanhe seu progresso e metas</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
