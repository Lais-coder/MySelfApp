import React, { useState, useEffect } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { Coffee, Leaf, ForkKnife, ChevronDown, Loader2 } from 'lucide-react'

export default function FoodPlan() {
  const [mealPlan, setMealPlan] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [loading, setLoading] = useState(true)

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  
  const getTodayDayName = () => weekDays[new Date().getDay()]

  // Plano padrão completo com todos os 7 dias
  const defaultPlan = [
    {
      day: 'Domingo',
      meals: [
        { name: 'Café da Manhã', items: ['Café com leite', 'Bolo caseiro', 'Frutas'] },
        { name: 'Almoço', items: ['Frango assado', 'Arroz', 'Feijão'] },
        { name: 'Lanche', items: ['Sorvete natural', 'Frutas vermelhas'] },
        { name: 'Jantar', items: ['Massa', 'Molho de tomate', 'Salada'] }
      ]
    },
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
    {
      day: 'Quarta',
      meals: [
        { name: 'Café da Manhã', items: ['Panqueca integral', 'Mel', 'Morango'] },
        { name: 'Almoço', items: ['Peixe grelhado', 'Batata doce', 'Brócolis'] },
        { name: 'Lanche', items: ['Banana', 'Amendoim'] },
        { name: 'Jantar', items: ['Frango com batata', 'Salada'] }
      ]
    },
    {
      day: 'Quinta',
      meals: [
        { name: 'Café da Manhã', items: ['Iogurte', 'Granola', 'Fruta'] },
        { name: 'Almoço', items: ['Carne moída', 'Arroz', 'Feijão'] },
        { name: 'Lanche', items: ['Maçã', 'Castanha'] },
        { name: 'Jantar', items: ['Peixe', 'Salada morna', 'Arroz integral'] }
      ]
    },
    {
      day: 'Sexta',
      meals: [
        { name: 'Café da Manhã', items: ['Ovos cozidos', 'Pão', 'Queijo'] },
        { name: 'Almoço', items: ['Frango', 'Pasta integral', 'Legumes'] },
        { name: 'Lanche', items: ['Suco natural', 'Biscoito integral'] },
        { name: 'Jantar', items: ['Carne vermelha', 'Batata', 'Salada'] }
      ]
    },
    {
      day: 'Sábado',
      meals: [
        { name: 'Café da Manhã', items: ['Açaí', 'Granola', 'Banana'] },
        { name: 'Almoço', items: ['Churrasco', 'Salada', 'Batata frita'] },
        { name: 'Lanche', items: ['Fruta da estação'] },
        { name: 'Jantar', items: ['Peixe grelhado', 'Arroz', 'Legumes'] }
      ]
    }
  ]

  useEffect(() => {
    const loadFromAdmin = async () => {
      setLoading(true)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        let currentUser = null
        
        try { 
          currentUser = JSON.parse(localStorage.getItem('user') || 'null') 
        } catch (e) { 
          currentUser = null 
        }

        if (!currentUser?.username) {
          // Se não logado, usa plano padrão
          setMealPlan(defaultPlan)
          setExpandedDay(getTodayDayName())
          setLoading(false)
          return
        }

        // Chamada para a rota que o Administrador alimenta
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}/foodplan`)
        
        if (res.ok) {
          const body = await res.json()
          
          // Se o administrador enviou dados
          if (body.data && Object.keys(body.data).length > 0) {
            const planData = Array.isArray(body.data) ? body.data : (body.data.days || defaultPlan)
            setMealPlan(planData)
          } else {
            // Se não tiver plano do admin, usa padrão
            setMealPlan(defaultPlan)
          }
        } else {
          // Se erro na requisição, usa padrão
          setMealPlan(defaultPlan)
        }
        
        // Sempre abre o dia atual
        setExpandedDay(getTodayDayName())
      } catch (err) {
        console.error('Erro ao buscar plano do administrador:', err)
        setMealPlan(defaultPlan)
        setExpandedDay(getTodayDayName())
      } finally {
        setLoading(false)
      }
    }

    loadFromAdmin()
  }, [])

  const displayPlan = mealPlan || defaultPlan

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />

      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-[#eee] pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold m-0 text-[#333]">Plano Alimentar</h1>
              <p className="text-[#555] mt-2 text-base">Personalizado pelo seu administrador.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#f9f4ff] px-4 py-2 rounded-lg border border-[#7B67A6]/20">
                <Coffee size={18} className="text-[#7B67A6]" />
                <span className="text-xs font-bold text-[#7B67A6]">Personalizado</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-[#7B67A6]" size={40} />
              <p className="text-gray-500">Carregando seu plano exclusivo...</p>
            </div>
          ) : displayPlan.length > 0 ? (
            <div className="space-y-3">
              {/* Mostra todos os dias, mas apenas o dia atual expandido por padrão */}
              {displayPlan.map((dayPlan) => {
                const isToday = getTodayDayName() === dayPlan.day
                const isExpanded = expandedDay === dayPlan.day
                
                return (
                  <div key={dayPlan.day} className={`bg-white rounded-[10px] border overflow-hidden transition-all ${isToday ? 'border-[#40804b] shadow-lg' : 'border-[#ddd]'}`}>
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : dayPlan.day)}
                      className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isToday ? 'bg-gradient-to-r from-[#f0f8f7] to-white' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <h2 className={`text-xl font-bold m-0 ${isToday ? 'text-[#40804b]' : 'text-slate-700'}`}>
                          {dayPlan.day}
                        </h2>
                        {isToday && (
                          <span className="text-[10px] bg-[#40804b] text-white px-3 py-1 rounded-full font-bold uppercase">📅 Hoje</span>
                        )}
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-[${isToday ? '#40804b' : '#999'}] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-6 bg-white border-t border-[#eee]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {dayPlan.meals?.map((meal, idx) => (
                            <div key={idx} className="rounded-lg p-4 border border-[#eee] hover:border-[#40804b] transition-all bg-gradient-to-br from-white to-[#f9f9f9]">
                              <div className="flex items-center justify-between mb-3 border-b border-[#f7f7f7] pb-2">
                                <h3 className="font-bold text-[#40804b] text-sm m-0">{meal.name}</h3>
                              </div>
                              <ul className="space-y-1.5 m-0 p-0 list-none">
                                {meal.items?.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-2 text-[#555] text-sm font-medium">
                                    <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-[#40804b] flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-gray-400">Nenhum plano alimentar cadastrado pelo administrador ainda.</p>
            </div>
          )}

          {/* Dica de Nutrição */}
          <div className="mt-10 bg-[#f0f8f7] rounded-[10px] p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#ddd]">
            <div className="p-4 bg-white rounded-lg shadow-sm shrink-0 border border-[#eee]">
              <ForkKnife size={32} className="text-[#40804b]" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#40804b] m-0">Dica de Nutrição</h3>
              <p className="text-[#555] text-sm leading-relaxed mt-1 m-0">Consulte sempre seu nutricionista para ajustes finos no plano enviado pelo administrador.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}