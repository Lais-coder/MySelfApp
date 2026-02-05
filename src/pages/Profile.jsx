import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { 
  User, 
  Calendar as CalendarIcon, 
  Scale, 
  Ruler, 
  Target, 
  Dumbbell, 
  Ban, 
  Moon, 
  Edit3, 
  LogOut,
  Check,
  X,
  Trophy
} from 'lucide-react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

// Importando a mesma lógica de fases do seu Calendário
const MOTIVATION_PHASES = [
  { day: 1, phase: '🌱 Iniciante' },
  { day: 7, phase: '🔥 Aquecendo' },
  { day: 14, phase: '💪 Forte' },
  { day: 21, phase: '⭐ Estrela' },
  { day: 30, phase: '🏆 Campeão' }
]

function getMotivationPhase(day) {
  let phase = MOTIVATION_PHASES[0]
  for (const p of MOTIVATION_PHASES) {
    if (day >= p.day) phase = p
    else break
  }
  return phase
}

export default function Profile() {
  const location = useLocation()
  const [userAnswers, setUserAnswers] = useState({})
  const [userData, setUserData] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [totalCheckins, setTotalCheckins] = useState(0)
  // Ajustado o form para objetivo_principal
  const [form, setForm] = useState({ nome: '', idade: '', profissao: '', atividade_fisica: '', objetivo_principal: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        let currentUser = null
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) currentUser = JSON.parse(userStr)
        } catch (e) {}

        if (!currentUser?.username) return

        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
        if (res.ok) {
          const body = await res.json()
          setUserData({
            name: body.user.username,
            email: body.user.email || '',
            joinDate: new Date(body.user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          })

          const step1 = body.user.questionnaire_data ? JSON.parse(body.user.questionnaire_data) : {}
          const step2 = body.user.health_data ? JSON.parse(body.user.health_data) : {}
          const combined = { ...step1, ...step2 }

          setUserAnswers(combined)
          setForm({
            nome: combined.nome || '',
            idade: combined.idade || '',
            profissao: combined.profissao || '',
            atividade_fisica: combined.atividade_fisica || '',
            objetivo_principal: combined.objetivo_principal || ''
          })
        }

        // Carrega check-ins para calcular a fase
        const today = new Date()
        const resCheckins = await fetch(
          `${apiUrl.replace(/\/$/, '')}/api/daily-checkins/month/${encodeURIComponent(currentUser.username)}/${today.getFullYear()}/${today.getMonth() + 1}`
        )
        if (resCheckins.ok) {
          const bodyCheckins = await resCheckins.json()
          setTotalCheckins(bodyCheckins.data.length)
        }

      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      }
    }
    load()
  }, [location])

  const phase = getMotivationPhase(totalCheckins)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveField = async (field) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (!currentUser?.username) return

      // objetivo_principal também pertence à rota de saúde (Etapa 2)
      const healthFields = ['atividade_fisica', 'objetivo_principal']
      const isHealth = healthFields.includes(field)
      const endpoint = isHealth ? '/api/save-health' : `/api/user/${encodeURIComponent(currentUser.username)}`
      
      const payload = isHealth 
        ? { username: currentUser.username, answers: { ...userAnswers, [field]: form[field] } }
        : { [field]: form[field] }

      const res = await fetch(`${apiUrl.replace(/\/$/, '')}${endpoint}`, {
        method: isHealth ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setUserAnswers(prev => ({ ...prev, [field]: form[field] }))
        if (field === 'nome') setUserData(prev => ({ ...prev, name: form.nome }))
        setEditingField(null)
      }
    } catch (err) { console.error(err) }
  }

  const handleCancelField = (field) => {
    setForm(prev => ({ ...prev, [field]: userAnswers[field] || '' }))
    setEditingField(null)
  }

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14">
        <div className="bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <div className="flex items-center">
              <div className="w-[100px] h-[100px] bg-[#e0e8f0] rounded-full flex items-center justify-center text-4xl font-bold text-[#999] mr-5">
                {userData?.name ? userData.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="m-0 text-[28px] text-[#333] font-bold">{userAnswers.nome || userData?.name || 'Usuário'}</h1>
                <p className="m-0 text-[#555] text-base">@{userData?.name?.toLowerCase().replace(/\s+/g, '.') || 'usuario'}</p>
                <p className="m-0 text-[#555] text-base">Desde {userData?.joinDate || 'recentemente'}</p>
              </div>
            </div>

            {/* FASE ATUAL (GAMIFICAÇÃO) */}
            <div className="bg-[#f9f4ff] border border-[#7B67A6]/20 p-4 rounded-lg flex items-center gap-3 self-start md:self-center">
              <div className="text-3xl">{phase.phase.split(' ')[0]}</div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#7B67A6] m-0 tracking-wider">Sua Evolução</p>
                <h3 className="text-lg font-bold text-[#333] m-0">{phase.phase.split(' ')[1]}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mt-[10px]">
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7]">
              <Target className="mx-auto mb-1 text-gray-400" size={20} />
              <h3 className="m-0 text-lg">Gênero</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.genero || 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7]">
              <Dumbbell className="mx-auto mb-1 text-gray-400" size={20} />
              <h3 className="m-0 text-lg">Estado Civil</h3>
              <p className="mt-1 text-[#7B67A6] font-bold capitalize">{userAnswers.estado_civil || 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7]">
              <Ban className="mx-auto mb-1 text-gray-400" size={20} />
              <h3 className="m-0 text-lg">Profissão</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.profissao || 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7]">
              <Moon className="mx-auto mb-1 text-gray-400" size={20} />
              <h3 className="m-0 text-lg">Carga Horária</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.carga_horaria || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-[30px]">
            <h3 className="text-xl font-bold mb-[15px] text-[#40804b]">Informações Pessoais</h3>

            {/* Linha Nome */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <User className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Nome Completo</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {editingField !== 'nome' ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.nome || '---'}</p>
                    <button onClick={() => setEditingField('nome')} className="p-1 text-gray-500"><Edit3 size={16} /></button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="nome" value={form.nome} onChange={handleChange} className="p-2 border rounded-md text-right" />
                    <button onClick={() => handleSaveField('nome')} className="text-green-600"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('nome')} className="text-red-500"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Linha Idade */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <CalendarIcon className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Idade</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {editingField !== 'idade' ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.idade ? `${userAnswers.idade} anos` : '---'}</p>
                    <button onClick={() => setEditingField('idade')} className="p-1 text-gray-500"><Edit3 size={16} /></button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="idade" value={form.idade} onChange={handleChange} className="p-2 border rounded-md text-right w-20" />
                    <button onClick={() => handleSaveField('idade')} className="text-green-600"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('idade')} className="text-red-500"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Linha Atividade Física */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <Dumbbell className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Atividade Física</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {editingField !== 'atividade_fisica' ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.atividade_fisica || '---'}</p>
                    <button onClick={() => setEditingField('atividade_fisica')} className="p-1 text-gray-500"><Edit3 size={16} /></button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="atividade_fisica" value={form.atividade_fisica} onChange={handleChange} className="p-2 border rounded-md text-right w-full" />
                    <button onClick={() => handleSaveField('atividade_fisica')} className="text-green-600"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('atividade_fisica')} className="text-red-500"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* SUBSTITUÍDO: Linha Objetivo Principal */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <Target className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Objetivo Principal</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {editingField !== 'objetivo_principal' ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.objetivo_principal || '---'}</p>
                    <button onClick={() => setEditingField('objetivo_principal')} className="p-1 text-gray-500"><Edit3 size={16} /></button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="objetivo_principal" value={form.objetivo_principal} onChange={handleChange} placeholder="Ex: Emagrecimento" className="p-2 border rounded-md text-right w-full" />
                    <button onClick={() => handleSaveField('objetivo_principal')} className="text-green-600"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('objetivo_principal')} className="text-red-500"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Link to="/plano-alimentar" className="p-6 bg-[#f0f8f7] rounded-lg border border-[#ddd] hover:border-[#40804b] text-center no-underline group">
              <h3 className="text-2xl text-[#40804b] mb-2 font-bold group-hover:scale-105 transition-transform">Plano Alimentar</h3>
              <p className="text-gray-600">Confira suas refeições recomendadas</p>
            </Link>
            <Link to="/calendario" className="p-6 bg-[#f9f4ff] rounded-lg border border-[#ddd] hover:border-[#7B67A6] text-center no-underline group">
              <h3 className="text-2xl text-[#7B67A6] mb-2 font-bold group-hover:scale-105 transition-transform">Calendário</h3>
              <p className="text-gray-600">Acompanhe sua rotina e progresso</p>
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-opacity hover:opacity-90">
              <LogOut size={16} /> Sair da Conta
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}