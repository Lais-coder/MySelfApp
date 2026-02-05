import React, { useState, useEffect } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { Coffee, Leaf, ForkKnife, ChevronDown, Loader2, AlertCircle, ClipboardList, Hourglass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FoodPlan() {
  const [mealPlan, setMealPlan] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState(true)
  const navigate = useNavigate()

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const getTodayDayName = () => weekDays[new Date().getDay()]

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
          navigate('/login')
          return
        }

        // 1. Verificamos primeiro se o usuário já respondeu o questionário
        const resUser = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
        if (resUser.ok) {
          const userData = await resUser.json()
          const pData = userData.user.questionnaire_data
          const hData = userData.user.health_data
          
          // Se qualquer uma das etapas estiver vazia, bloqueamos o acesso
          const isComplete = (pData && pData !== "{}" && pData.length > 5) && (hData && hData !== "{}" && hData.length > 5)
          
          if (!isComplete) {
            setHasAnsweredQuiz(false)
            setLoading(false)
            return
          }
        }

        // 2. Buscamos o plano alimentar (Sem plano padrão)
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}/foodplan`)
        
        if (res.ok) {
          const body = await res.json()
          
          // Se o administrador enviou dados válidos
          if (body.data && body.data.days && body.data.days.length > 0) {
            setMealPlan(body.data.days)
            setExpandedDay(getTodayDayName())
          } else {
            setMealPlan(null) // Plano ainda não feito pelo nutricionista
          }
        }
      } catch (err) {
        console.error('Erro ao buscar plano:', err)
        setMealPlan(null)
      } finally {
        setLoading(false)
      }
    }

    loadFromAdmin()
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />

      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-[#eee] pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold m-0 text-[#333]">Plano Alimentar</h1>
              <p className="text-[#555] mt-2 text-base">Sua dieta personalizada para atingir seus objetivos.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#f9f4ff] px-4 py-2 rounded-lg border border-[#7B67A6]/20">
                <Coffee size={18} className="text-[#7B67A6]" />
                <span className="text-xs font-bold text-[#7B67A6]">Nutricional</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-[#7B67A6]" size={40} />
              <p className="text-gray-500">Consultando seu prontuário...</p>
            </div>
          ) : !hasAnsweredQuiz ? (
            /* VALIDAÇÃO 1: Questionário Pendente */
            <div className="text-center py-16 px-4 border-2 border-dashed border-[#7B67A6]/20 rounded-2xl bg-[#fcfaff]">
              <div className="bg-[#f1ebfe] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList size={40} className="text-[#7B67A6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#333] mb-3">Questionário Pendente</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Para que o seu nutricionista possa elaborar um plano alimentar eficiente, você precisa primeiro responder todas as etapas do questionário disponível no seu Dashboard.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-[#7B67A6] text-white font-bold rounded-lg hover:bg-[#665491] transition-all"
              >
                Ir para o Dashboard
              </button>
            </div>
          ) : !mealPlan ? (
            /* VALIDAÇÃO 2: Plano ainda não criado pelo nutricionista */
            <div className="text-center py-16 px-4 border-2 border-dashed border-[#40804b]/20 rounded-2xl bg-[#f0f8f7]/30">
              <div className="bg-[#f0f8f7] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hourglass size={40} className="text-[#40804b]" />
              </div>
              <h2 className="text-2xl font-bold text-[#333] mb-3">Plano em Elaboração</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Seu nutricionista já recebeu suas informações! Agora ele está analisando seus dados para criar o melhor plano possível. Em breve ele estará disponível aqui.
              </p>
              <div className="mt-8 inline-block px-4 py-2 bg-white border border-[#40804b]/20 rounded-full text-[#40804b] text-xs font-bold uppercase tracking-widest">
                Aguarde a notificação
              </div>
            </div>
          ) : (
            /* EXIBIÇÃO DO PLANO REAL */
            <div className="space-y-3">
              {mealPlan.map((dayPlan) => {
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
          )}

          {/* Dica de Nutrição - Mantida para quando houver plano ou aguardando */}
          <div className="mt-10 bg-[#f0f8f7] rounded-[10px] p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#ddd]">
            <div className="p-4 bg-white rounded-lg shadow-sm shrink-0 border border-[#eee]">
              <ForkKnife size={32} className="text-[#40804b]" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#40804b] m-0">Dica de Nutrição</h3>
              <p className="text-[#555] text-sm leading-relaxed mt-1 m-0">A base de uma vida saudável é a consistência. Siga as orientações e valide seu check-in diariamente.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}