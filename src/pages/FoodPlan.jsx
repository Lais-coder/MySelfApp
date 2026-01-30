import React, { useState, useEffect } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { Coffee, Leaf, ForkKnife } from 'lucide-react'

export default function FoodPlan() {
  // Inicializamos com null para saber que ainda está "carregando"
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
        
        try { 
          currentUser = JSON.parse(localStorage.getItem('user') || 'null') 
        } catch (e) { 
          currentUser = null 
        }

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

        // Verificação Robusta: só aceita se body.data for um Array
        if (body.data && Array.isArray(body.data)) {
          setMealPlan(body.data)
        } else {
          console.warn("API não retornou um array em 'data'. Usando plano padrão.")
          setMealPlan(defaultPlan)
        }
      } catch (err) {
        console.error('Erro ao carregar plano:', err)
        setMealPlan(defaultPlan)
      }
    }
    load()
  }, [])

  // Definimos qual lista usar: a da API ou a padrão
  const displayPlan = Array.isArray(mealPlan) ? mealPlan : defaultPlan

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-marcellus text-slate-800">Plano Alimentar</h1>
            <p className="text-gray-500 mt-1">Sugestões simples e práticas para sua semana.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Coffee size={20} className="text-[#8b5cf6]" />
              <span className="text-sm text-gray-600">Café equilibrado</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Leaf size={20} className="text-[#10b981]" />
              <span className="text-sm text-gray-600">Porções de verduras</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPlan.map((day, dayIdx) => (
            <div key={day.day || dayIdx} className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
              <div className="p-5 border-b">
                <h2 className="text-2xl font-semibold text-slate-800">{day.day}</h2>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adicionada proteção opcional ?. antes do map de meals */}
                {day.meals?.map((meal, mealIdx) => (
                  <div key={meal.name || mealIdx} className="rounded-lg p-4 border bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800">{meal.name}</h3>
                      <span className="text-xs text-gray-500">{meal.items?.length || 0} itens</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {meal.items?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="inline-block w-2 h-2 mt-2 rounded-full bg-[#8b5cf6]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-md p-6 flex items-center gap-6">
            <div className="p-4 bg-[#f0fdf4] rounded-lg">
              <ForkKnife size={36} className="text-[#059669]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Dica de Nutrição</h3>
              <p className="text-gray-600">Mantenha-se hidratado e prefira alimentos minimamente processados. Pequenas mudanças durante a semana geram grandes resultados a longo prazo.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}