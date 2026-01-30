import React, { useState, useEffect } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { Coffee, Leaf, ForkKnife } from 'lucide-react'

export default function FoodPlan() {
  const [mealPlan, setMealPlan] = useState(null)

  const defaultPlan = [
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

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        let currentUser = null
        try { currentUser = JSON.parse(localStorage.getItem('user') || 'null') } catch (e) { currentUser = null }

        if (!currentUser?.username) {
          setMealPlan(defaultPlan)
          return
        }

        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}/foodplan`)
        if (!res.ok) {
          setMealPlan(defaultPlan)
          return
        }
        const body = await res.json()
        if (body.data && Array.isArray(body.data)) {
          setMealPlan(body.data)
        } else {
          setMealPlan(defaultPlan)
        }
      } catch (err) {
        setMealPlan(defaultPlan)
      }
    }
    load()
  }, [])

  const displayPlan = Array.isArray(mealPlan) ? mealPlan : defaultPlan

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />

      {/* Container externo (Azulado) */}
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14">
        
        {/* Bloco Branco Principal (Igual ao Profile) */}
        <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          {/* Header do Plano */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-[#eee] pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl text-[#333] font-bold m-0">Plano Alimentar</h1>
              <p className="text-[#555] mt-2 text-base">Sugestões baseadas no seu perfil e objetivos.</p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 bg-[#f9f4ff] px-4 py-2 rounded-lg border border-[#7B67A6]/20">
                <Coffee size={18} className="text-[#7B67A6]" />
                <span className="text-xs sm:text-sm text-[#7B67A6] font-bold">Equilíbrio</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f0f8f7] px-4 py-2 rounded-lg border border-[#40804b]/20">
                <Leaf size={18} className="text-[#40804b]" />
                <span className="text-xs sm:text-sm text-[#40804b] font-bold">Natural</span>
              </div>
            </div>
          </div>

          {/* Grid de Dias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayPlan.map((day, dayIdx) => (
              <div key={day.day || dayIdx} className="bg-white rounded-[10px] border border-[#ddd] overflow-hidden">
                {/* Título do Dia estilo Stat Box do Profile */}
                <div className="p-4 border-b bg-[#f9f4ff] text-center">
                  <h2 className="text-xl font-bold text-[#7B67A6] m-0">{day.day}</h2>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {day.meals?.map((meal, mealIdx) => (
                    <div 
                      key={meal.name || mealIdx} 
                      className="rounded-lg p-4 border border-[#eee] bg-white transition-all hover:border-[#40804b] group"
                    >
                      <div className="flex items-center justify-between mb-2 border-b border-[#f7f7f7] pb-2">
                        <h3 className="font-bold text-[#40804b] text-sm m-0">{meal.name}</h3>
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#40804b]">
                          {meal.items?.length || 0} ITENS
                        </span>
                      </div>
                      <ul className="text-sm text-[#555] space-y-1.5 m-0 p-0 list-none">
                        {meal.items?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 mt-1.5 shrink-0 rounded-full bg-[#7B67A6]" />
                            <span className="leading-tight font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Dica de Nutrição estilo Link de Acesso Rápido do Profile */}
            <div className="col-span-1 lg:col-span-2 bg-[#f0f8f7] rounded-[10px] p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#ddd]">
              <div className="p-4 bg-white rounded-lg shadow-sm shrink-0 border border-[#eee]">
                <ForkKnife size={32} className="text-[#40804b]" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-[#40804b] m-0">Dica de Nutrição</h3>
                <p className="text-[#555] text-sm leading-relaxed mt-1 m-0">
                  Mantenha-se hidratado e prefira alimentos naturais. Pequenas mudanças diárias geram grandes resultados a longo prazo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}