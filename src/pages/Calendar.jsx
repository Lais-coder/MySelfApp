import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Trophy, Star, Target } from 'lucide-react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

const MOTIVATION_PHASES = [
  { day: 1, phase: '🌱 Iniciante', message: 'Seu primeiro passo!', color: '#f0f8f7' },
  { day: 7, phase: '🔥 Aquecendo', message: 'Já pegou ritmo!', color: '#fff9f0' },
  { day: 14, phase: '💪 Forte', message: 'Está indo bem!', color: '#fff5f7' },
  { day: 21, phase: '⭐ Estrela', message: 'Você é incrível!', color: '#f9f4ff' },
  { day: 30, phase: '🏆 Campeão', message: 'Parabéns! 🎉', color: '#f0fdf4' }
]

function getMotivationPhase(day) {
  let phase = MOTIVATION_PHASES[0]
  for (const p of MOTIVATION_PHASES) {
    if (day >= p.day) phase = p
    else break
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
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const isChecked = (day) => {
    if (!day) return false
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return checkedDays.includes(dateStr)
  }

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const totalMarked = checkedDays.length
  const phase = getMotivationPhase(totalMarked)

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      
      {/* Container Principal idêntico ao Profile */}
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14">
        <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          {/* Header da Página */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-[#eee] pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#333] m-0">Calendário</h1>
              <p className="text-[#555] mt-2 text-base">Acompanhe sua consistência e evolução diária.</p>
            </div>
            
            {/* Status de Fase Atual (Estilo Badge do Profile) */}
            <div className="bg-[#f9f4ff] border border-[#7B67A6]/20 p-4 rounded-lg flex items-center gap-4">
              <div className="text-3xl">{phase.phase.split(' ')[0]}</div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#7B67A6] m-0 tracking-wider">Fase Atual</p>
                <h3 className="text-lg font-bold text-[#333] m-0">{phase.phase.split(' ')[1]}</h3>
              </div>
            </div>
          </div>

          {/* Grid de Conteúdo: Calendário à esquerda, Infos à direita */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna do Calendário (Ocupa 2/3 no desktop) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[10px] border border-[#ddd] overflow-hidden">
                <div className="p-4 border-b bg-[#f9f4ff] flex items-center justify-between">
                  <button onClick={previousMonth} className="p-1 hover:bg-white rounded-full transition-colors">
                    <ChevronLeft className="text-[#7B67A6]" size={24} />
                  </button>
                  <h2 className="text-xl font-bold text-[#7B67A6] capitalize m-0">{monthName}</h2>
                  <button onClick={nextMonth} className="p-1 hover:bg-white rounded-full transition-colors">
                    <ChevronRight className="text-[#7B67A6]" size={24} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="h-10 flex items-center justify-center font-bold text-[#7B67A6] text-xs uppercase">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                      const checked = isChecked(day)
                      return (
                        <div
                          key={idx}
                          className={`h-16 sm:h-20 rounded-lg border flex flex-col items-center justify-center transition-all ${
                            !day ? 'border-transparent' : 
                            checked ? 'border-[#40804b] bg-[#f0f8f7]' : 'border-[#eee] bg-white hover:border-[#7B67A6]'
                          }`}
                        >
                          {day && (
                            <>
                              <span className={`text-sm font-bold ${checked ? 'text-[#40804b]' : 'text-gray-400'}`}>{day}</span>
                              {checked && <div className="text-[9px] font-bold text-[#40804b] mt-1">✓ OK</div>}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Lateral de Status e Legendas */}
            <div className="flex flex-col gap-6">
              {/* Card de Resumo de Progresso */}
              <div className="bg-[#f0f8f7] border border-[#40804b]/20 rounded-[10px] p-5">
                <h3 className="text-[#40804b] font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Target size={18}/> Progresso
                </h3>
                <div className="text-4xl font-bold text-[#333] mb-1">{totalMarked}</div>
                <p className="text-[#555] text-sm font-medium">Dias validados no mês</p>
                <div className="mt-4 bg-white/50 rounded-full h-2 w-full overflow-hidden">
                  <div className="bg-[#40804b] h-full transition-all" style={{ width: `${(totalMarked/30)*100}%` }}></div>
                </div>
              </div>

              {/* Lista de Fases (Estilo .stat-box compacta) */}
              <div className="border border-[#ddd] rounded-[10px] p-5">
                <h3 className="text-[#333] font-bold text-base mb-4">Próximas Fases</h3>
                <div className="space-y-4">
                  {MOTIVATION_PHASES.map((p, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-md ${totalMarked >= p.day ? 'bg-[#f0f8f7]' : 'opacity-50'}`}>
                      <span className="text-xl">{p.phase.split(' ')[0]}</span>
                      <div>
                        <p className="text-xs font-bold m-0 text-[#333]">{p.phase.split(' ')[1]}</p>
                        <p className="text-[10px] m-0 text-gray-500">{p.day} dias</p>
                      </div>
                      {totalMarked >= p.day && <Star size={14} className="ml-auto text-[#40804b]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dica Final Estilo Link do Profile */}
          <div className="mt-8 p-6 bg-[#fff9f0] border border-[#f59e0b]/20 rounded-[10px] flex items-center gap-4">
             <div className="bg-white p-3 rounded-lg shadow-sm border border-[#eee]">
                <Trophy className="text-[#f59e0b]" size={24} />
             </div>
             <p className="text-sm text-[#7c5e10] m-0 leading-relaxed">
               <strong>Dica de Ouro:</strong> Não quebre a corrente! A consistência é mais importante que a perfeição. Continue validando seus dias para atingir o status de <strong>Campeão</strong>.
             </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}