import React, { useState, useEffect } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import Sidebar from '../components/Common/Sidebar' 
import { Coffee, Leaf, ForkKnife, Loader2, ClipboardList, Hourglass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FoodPlan() {
  const [mealPlan, setMealPlan] = useState(null)
  const [activeDay, setActiveDay] = useState(null)
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

        const resUser = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
        if (resUser.ok) {
          const userData = await resUser.json()
          const pData = userData.user.questionnaire_data
          const hData = userData.user.health_data
          const isComplete = (pData && pData !== "{}" && pData.length > 5) && (hData && hData !== "{}" && hData.length > 5)
          
          if (!isComplete) {
            setHasAnsweredQuiz(false)
            setLoading(false)
            return
          }
        }

        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}/foodplan`)
        
        if (res.ok) {
          const body = await res.json()
          if (body.data && body.data.days && body.data.days.length > 0) {
            setMealPlan(body.data.days)
            setActiveDay(getTodayDayName())
          } else {
            setMealPlan(null)
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

  const currentDayData = mealPlan?.find(d => d.day === activeDay)

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />

      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
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
            <div className="text-center py-16 px-4 border-2 border-dashed border-[#7B67A6]/20 rounded-2xl bg-[#fcfaff]/30">
              <div className="bg-[#f1ebfe] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hourglass size={40} className="text-[#7B67A6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#333] mb-3">Plano em Elaboração</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Seu nutricionista já recebeu suas informações! Agora ele está analisando seus dados para criar o melhor plano possível. Em breve ele estará disponível aqui.
              </p>
              <div className="mt-8 inline-block px-4 py-2 bg-white border border-[#7B67A6]/20 rounded-full text-[#7B67A6] text-xs font-bold uppercase tracking-widest">
                Aguarde a notificação
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="md:w-1/4">
                <h3 className="text-[10px] font-bold text-[#999] uppercase tracking-wider mb-4 px-1">Selecione o dia</h3>
                <Sidebar 
                  days={mealPlan}
                  activeDay={activeDay}
                  onSelectDay={setActiveDay}
                  today={getTodayDayName()}
                />
              </aside>

              <main className="flex-1">
                <div className="bg-[#fcfcfc] rounded-xl border border-[#eee] p-6 min-h-[400px]">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f0f0]">
                    <h2 className="text-2xl font-bold text-[#333]">{activeDay}</h2>
                    {/* Alteração: Ícone Leaf agora em Roxo */}
                    <Leaf size={24} className="text-[#7B67A6]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentDayData?.meals?.map((meal, idx) => (
                      <div key={idx} className="rounded-lg p-4 border border-[#eee] hover:border-[#7B67A6]/30 transition-all bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-3 border-b border-[#f7f7f7] pb-2">
                          <h3 className="font-bold text-[#40804b] text-sm m-0 uppercase tracking-wide">{meal.name}</h3>
                        </div>
                        <ul className="space-y-2 m-0 p-0 list-none">
                          {meal.items?.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-[#555] text-sm font-medium leading-relaxed">
                              <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-[#40804b] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          )}

          {/* Dica de Nutrição: Agora com detalhes em Roxo para destaque */}
          <div className="mt-10 bg-[#f9f4ff] rounded-[10px] p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#7B67A6]/10">
            <div className="p-4 bg-white rounded-lg shadow-sm shrink-0 border border-[#7B67A6]/20">
              <ForkKnife size={32} className="text-[#7B67A6]" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#7B67A6] m-0">Dica de Nutrição</h3>
              <p className="text-[#555] text-sm leading-relaxed mt-1 m-0">A base de uma vida saudável é a consistência. Siga as orientações e valide seu check-in diariamente.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 