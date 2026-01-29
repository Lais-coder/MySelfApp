import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

const MOTIVATION_PHASES = [
  { day: 1, phase: '🌱 Iniciante', message: 'Seu primeiro passo!', color: '#E8F5E9' },
  { day: 7, phase: '🔥 Aquecendo', message: 'Já pegou ritmo!', color: '#FFF3E0' },
  { day: 14, phase: '💪 Forte', message: 'Está indo bem!', color: '#FCE4EC' },
  { day: 21, phase: '⭐ Estrela', message: 'Você é incrível!', color: '#F3E5F5' },
  { day: 30, phase: '🏆 Campeão', message: 'Parabéns! 🎉', color: '#E0F2F1' }
]

function getMotivationPhase(day) {
  let phase = MOTIVATION_PHASES[0]
  for (const p of MOTIVATION_PHASES) {
    if (day >= p.day) {
      phase = p
    } else {
      break
    }
  }
  return phase
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [checkedDays, setCheckedDays] = useState([])
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
        
        if (!currentUser?.username) return

        // Carrega dados do usuário
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
        if (res.ok) {
          const body = await res.json()
          setUserData(body.user)
        }

        // Carrega check-ins do mês atual
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        
        const resCheckins = await fetch(
          `${apiUrl.replace(/\/$/, '')}/api/daily-checkins/month/${encodeURIComponent(currentUser.username)}/${year}/${month}`
        )
        if (resCheckins.ok) {
          const bodyCheckins = await resCheckins.json()
          setCheckedDays(bodyCheckins.data)
        }
      } catch (err) {
        console.error('Erro ao carregar calendário:', err)
      }
    }
    load()
  }, [currentDate])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isChecked = (day) => {
    if (!day) return false
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return checkedDays.includes(dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  // Calcula quantos dias foram marcados
  const totalMarked = checkedDays.length
  const phase = getMotivationPhase(totalMarked)

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1000px] w-[90%] mx-auto py-8 mt-14 mb-20">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#40804b] mb-2">Seu Calendário de Acompanhamento 📅</h1>
          <p className="text-lg text-[#666]">Acompanhe seus dias de validação e suas fases de motivação</p>
        </div>

        {/* Status Atual */}
        <div className="bg-gradient-to-r from-[#f0fdf4] to-[#e8f5e9] rounded-lg shadow-md p-8 mb-8 border border-[#40804b]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#40804b] text-sm font-bold uppercase">Sua Fase Atual</p>
              <h2 className="text-3xl font-bold text-[#333] mt-2">{phase.phase}</h2>
              <p className="text-lg text-[#666] mt-1">{phase.message}</p>
              <p className="text-[#40804b] font-semibold mt-3">
                {totalMarked} dia{totalMarked !== 1 ? 's' : ''} validado{totalMarked !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-6xl">{phase.phase.split(' ')[0]}</div>
          </div>
        </div>

        {/* Calendário */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Controles de navegação */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
            >
              <ChevronLeft className="text-[#40804b]" size={24} />
            </button>
            <h2 className="text-2xl font-bold text-[#40804b] capitalize">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
            >
              <ChevronRight className="text-[#40804b]" size={24} />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="h-12 flex items-center justify-center font-bold text-[#40804b]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Dias do calendário */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const checked = isChecked(day)
              const phase = day ? getMotivationPhase(day) : null
              
              return (
                <div
                  key={idx}
                  className={`h-24 p-2 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
                    !day
                      ? 'bg-transparent border-transparent'
                      : checked
                      ? `border-[#40804b] bg-[#f0fdf4]`
                      : 'border-[#ddd] bg-white hover:border-[#40804b]'
                  }`}
                >
                  {day && (
                    <>
                      <div className="font-bold text-lg text-[#333]">{day}</div>
                      {checked && (
                        <div className="text-sm font-semibold text-[#40804b] mt-1">✓ Validado</div>
                      )}
                      <div className="text-xs text-[#999] mt-1 leading-tight">
                        {phase?.phase.split(' ')[0]}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legenda de Fases */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-[#40804b] mb-6">Fases de Motivação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOTIVATION_PHASES.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-l-4 border-[#40804b]"
                style={{ backgroundColor: p.color }}
              >
                <div className="text-2xl mb-2">{p.phase.split(' ')[0]}</div>
                <p className="font-bold text-[#333]">{p.phase}</p>
                <p className="text-sm text-[#666] mt-1">Dia {p.day}</p>
                <p className="text-sm text-[#40804b] font-semibold mt-2">"{p.message}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-[#fef3c7] rounded-lg p-6 border border-[#f59e0b]">
          <p className="font-semibold text-[#b45309]">💡 Dica: Continue marcando seus check-ins diários para desbloquear todas as fases de motivação e atingir o status de Campeão! 🏆</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
