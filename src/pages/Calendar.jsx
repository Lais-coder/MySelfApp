import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function Calendar() {
  const months = [
    { name: 'Janeiro', days: 31 },
    { name: 'Fevereiro', days: 28 },
    { name: 'Março', days: 31 },
  ]

  const getDaysArray = (days) => {
    return Array.from({ length: days }, (_, i) => i + 1)
  }

  const isGoalAchieved = (day) => day % 3 === 0 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-marcellus text-purple-lilac2 mb-12 text-center">
          Calendário de Metas
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {months.map((month) => (
            <div key={month.name} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-medium to-green-dark text-white p-4">
                <h2 className="text-2xl font-marcellus">{month.name}</h2>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                    <div key={day} className="text-center font-bold text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}

                  {getDaysArray(month.days).map((day) => (
                    <div
                      key={day}
                      className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                        isGoalAchieved(day)
                          ? 'bg-green-medium text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-marcellus text-green-darkGreen mb-4">✓ Meta Atingida</h3>
            <p className="text-gray-700">
              Você completou sua rotina de exercícios e alimentação do dia.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-marcellus text-gray-600 mb-4">○ Meta em Andamento</h3>
            <p className="text-gray-700">
              Continue acompanhando seus objetivos diários.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center p-8 bg-purple-lilac2/10 rounded-lg border-2 border-purple-lilac2">
          <h3 className="text-2xl font-marcellus text-purple-lilac2 mb-4">Seu Progresso</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-green-medium">24</p>
              <p className="text-gray-700">Dias Consecutivos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-lilac2">85%</p>
              <p className="text-gray-700">Metas Cumpridas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-light">12</p>
              <p className="text-gray-700">kg Perdidos</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
