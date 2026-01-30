import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, TrendingUp, Heart } from 'lucide-react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [totalCheckins, setTotalCheckins] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
        
        if (!currentUser?.username) {
          navigate('/login')
          return
        }

        // Carrega dados do usuário
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
        if (res.ok) {
          const body = await res.json()
          setUserData(body.user)
        }

        // Carrega check-ins do mês
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        
        const resCheckins = await fetch(`${apiUrl.replace(/\/$/, '')}/api/daily-checkins/month/${encodeURIComponent(currentUser.username)}/${year}/${month}`)
        if (resCheckins.ok) {
          const bodyCheckins = await resCheckins.json()
          setTotalCheckins(bodyCheckins.data.length)
          
          // Verifica se já marcou hoje
          const todayDate = today.toISOString().split('T')[0]
          setCheckedInToday(bodyCheckins.data.includes(todayDate))
        }
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const handleDailyCheckin = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/daily-checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      })

      if (res.ok) {
        const body = await res.json()
        if (body.isNew) {
          setCheckedInToday(true)
          setTotalCheckins(prev => prev + 1)
        }
        // Redireciona para calendário
        navigate('/calendario')
      }
    } catch (err) {
      console.error('Erro ao fazer check-in:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faff] font-marcellus flex items-center justify-center">
        <p className="text-lg text-[#666]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#7B67A6] mb-2">Bem-vindo, {userData?.username}! 👋</h1>
          <p className="text-lg text-[#666]">Vamos acompanhar sua jornada de saúde e nutrição</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card: Check-ins este mês */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#40804b]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#999] text-sm font-semibold">VALIDAÇÕES ESTE MÊS</p>
                <p className="text-4xl font-bold text-[#40804b] mt-2">{totalCheckins}</p>
                <p className="text-[#999] text-sm mt-1">dias marcados</p>
              </div>
              <Calendar className="text-[#40804b] opacity-20" size={64} />
            </div>
          </div>

          {/* Card: Status de hoje */}
          <div className={`rounded-lg shadow-md p-6 border-l-4 ${checkedInToday ? 'bg-[#f0fdf4] border-[#40804b]' : 'bg-white border-[#ddd]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#999] text-sm font-semibold">HOJE</p>
                <p className={`text-3xl font-bold mt-2 ${checkedInToday ? 'text-[#40804b]' : 'text-[#999]'}`}>
                  {checkedInToday ? '✓ Validado' : 'Não validado'}
                </p>
                <p className="text-[#999] text-sm mt-1">Clique para marcar</p>
              </div>
              <CheckCircle2 className={`opacity-20 ${checkedInToday ? 'text-[#40804b]' : 'text-[#999]'}`} size={64} />
            </div>
          </div>

          {/* Card: Motivação */}
          <div className="bg-gradient-to-br from-[#f9f4ff] to-[#f0f8f7] rounded-lg shadow-md p-6 border-l-4 border-[#7B67A6]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#999] text-sm font-semibold">MOTIVAÇÃO</p>
                <p className="text-[#7B67A6] font-bold mt-2">Você está no caminho certo! 💪</p>
                <p className="text-[#999] text-sm mt-1">Continue consistente</p>
              </div>
              <Heart className="text-[#7B67A6] opacity-20" size={64} />
            </div>
          </div>
        </div>

        {/* Botão Principal de Validação */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-8">
          <h2 className="text-2xl font-bold text-[#333] mb-4">Validar Refeição de Hoje</h2>
          <p className="text-[#666] mb-8">Clique no botão abaixo para confirmar que você comeu conforme sua dieta! 🥗</p>
          
          <button
            onClick={handleDailyCheckin}
            disabled={checkedInToday}
            className={`px-12 py-4 rounded-lg font-bold text-lg transition-all ${
              checkedInToday
                ? 'bg-[#ddd] text-[#999] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#40804b] to-[#5a9d5f] text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {checkedInToday ? '✓ Já validado hoje!' : '✓ Validar Agora'}
          </button>

          {!checkedInToday && (
            <p className="text-[#40804b] mt-6 font-semibold">Após validar, você será direcionado ao seu calendário 📅</p>
          )}
        </div>

        {/* Dicas Rápidas */}
        <div className="bg-[#f1ebfe] rounded-lg p-8 border border-[#40804b]">
          <h3 className="text-xl font-bold text-[#40804b] mb-4">💡 Dicas Rápidas</h3>
          <ul className="space-y-3 text-[#333]">
            <li>✓ Marque sua validação diária para acompanhar sua consistência</li>
            <li>✓ Visite seu calendário para ver as fases de motivação</li>
            <li>✓ Consulte seu plano alimentar para referência das refeições</li>
            <li>✓ Mantenha a consistência - cada dia marcado é um passo para seus objetivos!</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}
