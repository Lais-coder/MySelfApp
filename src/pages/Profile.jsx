import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { 
  User, 
  Calendar, 
  Scale, 
  Ruler, 
  Target, 
  Dumbbell, 
  Ban, 
  Moon, 
  Edit3, 
  LogOut,
  Check,
  X
} from 'lucide-react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function Profile() {
  const location = useLocation()
  const [userAnswers, setUserAnswers] = useState({})
  const [userData, setUserData] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [form, setForm] = useState({ nome: '', idade: '', profissao: '', atividade_fisica: '' })
  const navigate = useNavigate()

  useEffect(() => {
    // Tenta recuperar do location.state primeiro (navegação direta após questionário)
    if (location.state?.answers) {
      setUserAnswers(location.state.answers)
    }
    
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        
        // Lê usuário do localStorage com tratamento seguro
        let currentUser = null
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            currentUser = JSON.parse(userStr)
          }
        } catch (parseErr) {
          console.warn('Erro ao parsear usuário do localStorage:', parseErr)
        }

        if (!currentUser?.username) {
          console.warn('Usuário não encontrado no localStorage')
          return
        }

        // Carrega dados do usuário
        try {
          const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/me?username=${encodeURIComponent(currentUser.username)}`)
          if (!res.ok) {
            setUserData({ name: currentUser.username, email: currentUser.email || '', joinDate: 'novembro de 2024' })
          } else {
            const body = await res.json()
            setUserData({
              name: body.user.username,
              email: body.user.email || '',
              joinDate: new Date(body.user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            })
          }
        } catch (userErr) {
          console.error('Erro ao carregar dados do usuário:', userErr)
          setUserData({ name: currentUser.username, email: currentUser.email || '', joinDate: 'novembro de 2024' })
        }

        // Carrega respostas do questionário (não quebra se falhar)
        try {
          const resQuestionnaire = await fetch(`${apiUrl.replace(/\/$/, '')}/api/questionnaire/user/${encodeURIComponent(currentUser.username)}`)
          if (resQuestionnaire.ok) {
            const bodyQuestionnaire = await resQuestionnaire.json()
            if (bodyQuestionnaire.data && Object.keys(bodyQuestionnaire.data).length > 0) {
              setUserAnswers(bodyQuestionnaire.data)
              // popula formulário de edição
              setForm(prev => ({
                ...prev,
                nome: bodyQuestionnaire.data.nome || prev.nome,
                idade: bodyQuestionnaire.data.idade || prev.idade,
                profissao: bodyQuestionnaire.data.profissao || prev.profissao,
                atividade_fisica: bodyQuestionnaire.data.atividade_fisica || prev.atividade_fisica
              }))
            }
          } else {
            console.warn('Nenhum questionário encontrado para o usuário (status: ' + resQuestionnaire.status + ')')
          }
        } catch (questionnaireErr) {
          console.warn('Erro ao carregar questionário (pode ser normal se o usuário não preencheu ainda):', questionnaireErr)
          // Não quebramos o fluxo se o questionário não carregar
        }
      } catch (err) {
        console.error('Erro geral ao carregar perfil:', err)
      }
    }
    load()
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (!currentUser?.username) return

      const payload = { ...form }
      await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      // atualiza estado local
      setUserAnswers(prev => ({ ...prev, ...form }))
      setUserData(prev => ({ ...prev, name: form.nome || prev?.name }))
      setEditing(false)
    } catch (err) {
      console.error('Erro ao salvar perfil:', err)
    }
  }

  const handleSaveField = async (field) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (!currentUser?.username) return

      const payload = { [field]: form[field] }
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(currentUser.username)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Erro ao salvar campo')

      // atualiza estado local apenas do campo
      setUserAnswers(prev => ({ ...prev, [field]: form[field] }))
      if (field === 'nome') setUserData(prev => ({ ...prev, name: form.nome }))
      setEditingField(null)
    } catch (err) {
      console.error('Erro ao salvar campo:', err)
      alert('Erro ao salvar: ' + (err.message || ''))
    }
  }

  const handleCancelField = (field) => {
    setForm(prev => ({ ...prev, [field]: userAnswers[field] || (field === 'nome' ? (userData?.name || '') : '') }))
    setEditingField(null)
  }

  return (
    
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14">
        <div className="bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          
          {/* Header do Perfil (Igual ao CSS .profile-header) */}
          <div className="flex items-center mb-5 j">
            <div className="w-[100px] h-[100px] bg-[#e0e8f0] rounded-full flex items-center justify-center text-4xl font-bold text-[#999] mr-5">
              {userData?.name ? userData.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="m-0 text-[28px] text-[#333] font-bold">{userData?.name || 'Usuário'}</h1>
              <p className="m-0 text-[#555] text-base">@{userData?.name?.toLowerCase().replace(/\s+/g, '.') || 'usuario'}</p>
              <p className="m-0 text-[#555] text-base">Por aqui desde {userData?.joinDate || 'recentemente'}</p>
              <p className="m-0 text-base mt-1">
                <a href="#" className="text-[#00796b] no-underline font-bold hover:underline">Segue 0</a> · <a href="#" className="text-[#00796b] no-underline font-bold hover:underline">Tem 0 seguidores</a>
              </p>
            </div>
          </div>

          {/* Grid de Stats (Estilo .stat-box) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mt-[10px]">
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7] group">
              <Target className="mx-auto mb-1 text-gray-400 group-hover:text-[#7B67A6]" size={20} />
              <h3 className="m-0 text-lg">Gênero</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.genero === 'feminino' ? '👩 Feminino' : userAnswers.genero === 'masculino' ? '👨 Masculino' : 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7] group">
              <Dumbbell className="mx-auto mb-1 text-gray-400 group-hover:text-[#7B67A6]" size={20} />
              <h3 className="m-0 text-lg">Estado Civil</h3>
              <p className="mt-1 text-[#7B67A6] font-bold capitalize">{userAnswers.estado_civil || 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7] group">
              <Ban className="mx-auto mb-1 text-gray-400 group-hover:text-[#7B67A6]" size={20} />
              <h3 className="m-0 text-lg">Profissão</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.profissao || 'N/A'}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-3 text-center transition-colors hover:bg-[#f0f8f7] group">
              <Moon className="mx-auto mb-1 text-gray-400 group-hover:text-[#7B67A6]" size={20} />
              <h3 className="m-0 text-lg">Carga Horária</h3>
              <p className="mt-1 text-[#7B67A6] font-bold">{userAnswers.carga_horaria || 'N/A'}</p>
            </div>
          </div>

          {/* Seção de Informações Detalhadas (Estilo .meal) */}
          <div className="mt-[30px]">
            <h3 className="text-xl font-bold mb-[15px] text-[#40804b]">Informações Pessoais</h3>

            {/* Linha Nome */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <User className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Nome Completo</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {(!editing && editingField !== 'nome') ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.nome || userData?.name || '---'}</p>
                    <button onClick={() => setEditingField('nome')} className="ml-2 p-1 text-gray-500 hover:text-gray-800">
                      <Edit3 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="nome" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded-md text-right" />
                    <button onClick={() => handleSaveField('nome')} className="p-1 text-green-600 hover:text-green-800"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('nome')} className="p-1 text-red-500 hover:text-red-700"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Linha Idade */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <Calendar className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Idade</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {(!editing && editingField !== 'idade') ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.idade || '---'} anos</p>
                    <button onClick={() => setEditingField('idade')} className="ml-2 p-1 text-gray-500 hover:text-gray-800">
                      <Edit3 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="idade" value={form.idade} onChange={handleChange} className="w-24 p-2 border rounded-md text-right inline-block" />
                    <button onClick={() => handleSaveField('idade')} className="p-1 text-green-600 hover:text-green-800"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('idade')} className="p-1 text-red-500 hover:text-red-700"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Linha Profissão */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <Scale className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Profissão</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {(!editing && editingField !== 'profissao') ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.profissao || '---'}</p>
                    <button onClick={() => setEditingField('profissao')} className="ml-2 p-1 text-gray-500 hover:text-gray-800">
                      <Edit3 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="profissao" value={form.profissao} onChange={handleChange} className="w-full p-2 border rounded-md text-right" />
                    <button onClick={() => handleSaveField('profissao')} className="p-1 text-green-600 hover:text-green-800"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('profissao')} className="p-1 text-red-500 hover:text-red-700"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Linha Atividade Física */}
            <div className="bg-white border border-[#ddd] rounded-lg p-[15px] flex justify-between items-center mt-[15px] transition-colors hover:bg-[#f0f8f7]">
              <div className="flex items-center">
                <Ruler className="text-[#40804b] mr-[15px]" size={28} />
                <h3 className="m-0 text-xl text-[#40804b] font-semibold">Atividade Física</h3>
              </div>
              <div className="w-1/2 text-right flex items-center justify-end gap-2">
                {(!editing && editingField !== 'atividade_fisica') ? (
                  <>
                    <p className="m-0 text-gray-700 font-medium">{userAnswers.atividade_fisica || '---'}</p>
                    <button onClick={() => setEditingField('atividade_fisica')} className="ml-2 p-1 text-gray-500 hover:text-gray-800">
                      <Edit3 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input name="atividade_fisica" value={form.atividade_fisica} onChange={handleChange} className="w-full p-2 border rounded-md text-right" />
                    <button onClick={() => handleSaveField('atividade_fisica')} className="p-1 text-green-600 hover:text-green-800"><Check size={18} /></button>
                    <button onClick={() => handleCancelField('atividade_fisica')} className="p-1 text-red-500 hover:text-red-700"><X size={18} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links de Acesso Rápido */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Link to="/plano-alimentar" className="p-6 bg-[#f0f8f7] rounded-lg border border-[#ddd] hover:border-[#40804b] transition-all text-center no-underline group">
              <h3 className="text-2xl text-[#40804b] mb-2 font-bold group-hover:scale-105 transition-transform">Plano Alimentar</h3>
              <p className="text-gray-600">Confira suas refeições recomendadas</p>
            </Link>
            <Link to="/calendario" className="p-6 bg-[#f9f4ff] rounded-lg border border-[#ddd] hover:border-[#7B67A6] transition-all text-center no-underline group">
              <h3 className="text-2xl text-[#7B67A6] mb-2 font-bold group-hover:scale-105 transition-transform">Calendário</h3>
              <p className="text-gray-600">Acompanhe sua rotina e progresso</p>
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:opacity-95 flex items-center gap-2">
              <LogOut size={16} />
              <span>Sair da Conta</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}