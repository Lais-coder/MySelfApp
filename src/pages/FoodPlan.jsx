import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function FoodPlan() {
  const mealPlan = [
    {
      day: 'Segunda',
      meals: [
        { name: 'Café da Manhã', items: ['Ovos mexidos', 'Pão integral', 'Suco natural'] },
        { name: 'Almoço', items: ['Frango grelhado', 'Arroz integral', 'Brócolis'] },
        { name: 'Lanche', items: ['Maçã', 'Iogurte grego'] },
        { name: 'Jantar', items: ['Peixe assado', 'Batata doce', 'Salada'] }
      ]
    },
    {
      day: 'Terça',
      meals: [
        { name: 'Café da Manhã', items: ['Aveia', 'Banana', 'Amêndoas'] },
        { name: 'Almoço', items: ['Carne vermelha', 'Feijão', 'Arroz'] },
        { name: 'Lanche', items: ['Iogurte natural', 'Granola'] },
        { name: 'Jantar', items: ['Frango com legumes', 'Quinoa'] }
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-marcellus text-purple-lilac2 mb-12 text-center">
          Seu Plano Alimentar Personalizado
        </h1>

        <div className="grid gap-8">
          {mealPlan.map((day) => (
            <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-purple-lilac2 to-purple-medium text-white p-6">
                <h2 className="text-3xl font-marcellus">{day.day}</h2>
              </div>

              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {day.meals.map((meal) => (
                  <div key={meal.name} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-lilac2">
                    <h3 className="font-bold text-gray-800 mb-2">{meal.name}</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {meal.items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-purple-lilac2 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-light/20 border-2 border-yellow-light rounded-lg p-8 text-center">
          <h3 className="text-2xl font-marcellus text-gray-800 mb-4">Dica de Nutrição</h3>
          <p className="text-lg text-gray-700">
            Mantenha-se hidratado! Beba pelo menos 2 litros de água por dia para melhorar sua disposição e saúde.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
