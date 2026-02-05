import { useEffect, useState } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { useRef } from 'react'
import { AlertCircle, Plus, Trash2, Check } from 'lucide-react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  // Plano estruturado por dia/refeição
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDayStep, setCurrentDayStep] = useState(0)
  const [planObj, setPlanObj] = useState({ days: [] })
  // Modelos de refeição carregados do backend
  const [mealTemplates, setMealTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  // Modal para selecionar/criar modelo
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedMealContext, setSelectedMealContext] = useState(null) // { dayIndex, mealIndex }
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    meal_type: 'Café da Manhã',
    items: ['']
  })
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState([])

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const mealTypes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar']
  
  const modalRef = useRef()

  const validatePlan = () => {
    const errors = []
    if (!planObj.days || planObj.days.length !== 7) {
      errors.push('Você deve adicionar todos os 7 dias da semana')
    } else {
      planObj.days.forEach((day, idx) => {
        if (!day.meals || day.meals.length !== 4) {
          errors.push(`${day.day} deve ter exatamente 4 refeições (Café, Almoço, Lanche, Jantar)`)
        } else {
          day.meals.forEach((meal, mIdx) => {
            if (!meal.items || meal.items.length === 0) {
              errors.push(`${day.day} - ${meal.name}: adicione pelo menos 1 item`)
            }
          })
        }
      })
    }
    setValidationErrors(errors)
    return errors.length === 0
  }

  const initializePlan = () => {
    const newPlan = weekDays.map(day => ({
      day,
      meals: mealTypes.map(mealType => ({ name: mealType, items: [''] }))
    }))
    setPlanObj({ days: newPlan })
    setCurrentDayStep(0)
    setValidationErrors([])
    loadMealTemplates()
  }

  const loadMealTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (!adminUser?.username) return

      const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/meal-templates`)
      url.searchParams.set('username', adminUser.username)

      const res = await fetch(url.toString())
      if (res.ok) {
        const body = await res.json()
        setMealTemplates(body.data || [])
      }
    } catch (err) {
      console.error('Erro ao carregar modelos:', err)
    } finally {
      setLoadingTemplates(false)
    }
  }

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

        const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
        if (currentUser?.username) url.searchParams.set('username', currentUser.username)

        const res = await fetch(url.toString())
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            console.warn('Não autorizado a acessar painel admin. Verifique se está logado como admin.')
          } else {
            console.warn('Erro ao acessar rota admin/users:', res.status)
          }
          return
        }
        const body = await res.json()
        setUsers(body.data || [])
      } catch (err) {
        console.error('Erro ao carregar admin:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        <h1 className="text-3xl font-bold text-[#40804b] mb-6">Painel Administrativo</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Usuários</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="px-4 py-2">Usuário</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Check-ins</th>
                    <th className="px-4 py-2">Admin</th>
                    <th className="px-4 py-2">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username} className="border-t">
                      <td className="px-4 py-3 font-medium">{u.username}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.checkinCount || 0}</td>
                      <td className="px-4 py-3">{u.is_admin ? 'Sim' : 'Não'}</td>
                      <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setEditingUser(u.username)
                            initializePlan()
                            setModalOpen(true)
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                        >
                          Definir Plano
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Create admin form */}
              <div className="mt-6">
                <button onClick={() => setShowCreateAdmin(s => !s)} className="px-3 py-2 bg-indigo-600 text-white rounded">{showCreateAdmin ? 'Fechar criação de admin' : 'Criar novo admin'}</button>
                {showCreateAdmin && (
                  <div className="mt-3 p-4 bg-slate-50 border rounded">
                    <h3 className="font-semibold mb-2">Criar Admin</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input placeholder="username" value={newAdmin.username} onChange={e => setNewAdmin(p => ({ ...p, username: e.target.value }))} className="p-2 border rounded" />
                      <input placeholder="email" value={newAdmin.email} onChange={e => setNewAdmin(p => ({ ...p, email: e.target.value }))} className="p-2 border rounded" />
                      <input placeholder="senha" value={newAdmin.password} onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))} className="p-2 border rounded" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={async () => {
                        try {
                          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                          const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                          if (!adminUser?.username) return alert('Você precisa estar logado como admin para criar um admin')
                          const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/create-user?username=${encodeURIComponent(adminUser.username)}`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdmin)
                          })
                          if (!res.ok) throw new Error('Erro: ' + res.status)
                          alert('Admin criado/atualizado com sucesso')
                          // recarrega lista
                          const reloadUrl = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
                          reloadUrl.searchParams.set('username', adminUser.username)
                          const reloadRes = await fetch(reloadUrl.toString())
                          if (reloadRes.ok) {
                            const body = await reloadRes.json()
                            setUsers(body.data || [])
                          }
                          setShowCreateAdmin(false)
                          setNewAdmin({ username: '', email: '', password: '' })
                        } catch (err) {
                          console.error(err)
                          alert('Erro ao criar admin: ' + err.message)
                        }
                      }} className="px-4 py-2 bg-indigo-600 text-white rounded">Criar Admin</button>
                      <button onClick={() => { setShowCreateAdmin(false); setNewAdmin({ username: '', email: '', password: '' }) }} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal estruturado para editar plano com validação */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-purple-lilac2 text-white px-6 py-4 flex justify-between items-center shadow-md">
              <h2 className="text-2xl font-bold">Criar Plano para {editingUser}</h2>
              <button onClick={() => setModalOpen(false)} className="text-xl font-bold hover:bg-white/20 p-2 rounded">✕</button>
            </div>

            <div className="p-6">
              {/* Validação */}
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex gap-2 items-start">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-800 mb-2">Erros encontrados:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationErrors.map((err, idx) => <li key={idx}>• {err}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Indicator */}
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  {weekDays.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentDayStep(idx)}
                      className={`flex-1 mx-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                        currentDayStep === idx
                          ? 'bg-[#7c64a4] text-white shadow-md'
                          : planObj.days?.[idx]?.meals?.every(m => m.items?.some(i => i.trim()))
                          ? 'bg-green-100 text-green-700 border-2 border-green-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                      {planObj.days?.[idx]?.meals?.every(m => m.items?.some(i => i.trim())) && (
                        <span className="ml-1">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">Verde = Preenchido | Azul = Atual</p>
              </div>

              {/* Day Editor */}
              {planObj.days?.[currentDayStep] && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">{planObj.days[currentDayStep].day}</h3>

                  {/* Meals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {planObj.days[currentDayStep].meals?.map((meal, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-indigo-700">{meal.name}</h4>
                          <button
                            onClick={() => {
                              setSelectedMealContext({ dayIndex: currentDayStep, mealIndex: mIdx })
                              setShowTemplateModal(true)
                            }}
                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Plus size={14} /> Adicionar modelo pronto
                          </button>
                        </div>
                        <div className="space-y-2 mb-3">
                          {meal.items?.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const d = [...planObj.days]
                                  d[currentDayStep].meals[mIdx].items[iIdx] = e.target.value
                                  setPlanObj({ days: d })
                                }}
                                placeholder="Ex: Arroz integral, Frango grelhado..."
                                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <button
                                onClick={() => {
                                  const d = [...planObj.days]
                                  d[currentDayStep].meals[mIdx].items = d[currentDayStep].meals[mIdx].items.filter((_, idx) => idx !== iIdx)
                                  setPlanObj({ days: d })
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            const d = [...planObj.days]
                            d[currentDayStep].meals[mIdx].items.push('')
                            setPlanObj({ days: d })
                          }}
                          className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Plus size={16} /> Adicionar item
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 justify-between pt-6 border-t">
                    <button
                      onClick={() => setCurrentDayStep(Math.max(0, currentDayStep - 1))}
                      disabled={currentDayStep === 0}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium"
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={() => setCurrentDayStep(Math.min(6, currentDayStep + 1))}
                      disabled={currentDayStep === 6}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium"
                    >
                      Próximo →
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex gap-3 justify-end pt-6 border-t mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!validatePlan()) return
                    try {
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                      const res = await fetch(
                        `${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(editingUser)}/foodplan?username=${encodeURIComponent(adminUser?.username || '')}`,
                        {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ plan: planObj })
                        }
                      )
                      if (!res.ok) throw new Error('Erro ao salvar plano: ' + res.status)
                      alert('Plano salvo com sucesso!')
                      const reloadUrl = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
                      if (adminUser?.username) reloadUrl.searchParams.set('username', adminUser.username)
                      const reloadRes = await fetch(reloadUrl.toString())
                      if (reloadRes.ok) {
                        const body = await reloadRes.json()
                        setUsers(body.data || [])
                      }
                      setModalOpen(false)
                      setEditingUser(null)
                    } catch (err) {
                      console.error(err)
                      alert('Erro ao salvar plano: ' + (err.message || ''))
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center gap-2 transition-colors shadow-lg"
                >
                  <Check size={18} /> Salvar Plano Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para selecionar/criar modelo de refeição */}
      {showTemplateModal && selectedMealContext && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
              <h2 className="text-2xl font-bold">
                Modelos de {planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name}
              </h2>
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  setSelectedMealContext(null)
                  setNewTemplate({ name: '', meal_type: 'Café da Manhã', items: [''] })
                }}
                className="text-xl font-bold hover:bg-white/20 p-2 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Lista de modelos existentes */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-base">Selecionar modelo existente</h3>
                {loadingTemplates ? (
                  <p className="text-gray-500 text-base">Carregando...</p>
                ) : mealTemplates.filter(t => t.meal_type === planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name).length === 0 ? (
                  <p className="text-gray-500 text-base">Nenhum modelo disponível para esta refeição.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mealTemplates
                      .filter(t => t.meal_type === planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name)
                      .map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition-all"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-base">{t.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{t.items.join(' • ')}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const d = [...planObj.days]
                                d[selectedMealContext.dayIndex].meals[selectedMealContext.mealIndex].items = [...(t.items || [])]
                                setPlanObj({ days: d })
                                setShowTemplateModal(false)
                                setSelectedMealContext(null)
                              }}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                            >
                              Usar
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Tem certeza que deseja deletar este modelo?')) return
                                try {
                                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                                  const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                                  const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/meal-templates/${t.id}`)
                                  url.searchParams.set('username', adminUser?.username || '')
                                  const res = await fetch(url.toString(), { method: 'DELETE' })
                                  if (res.ok) {
                                    await loadMealTemplates()
                                  } else {
                                    alert('Erro ao deletar modelo')
                                  }
                                } catch (err) {
                                  console.error(err)
                                  alert('Erro ao deletar modelo: ' + err.message)
                                }
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Deletar modelo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Criar novo modelo */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-base">Criar novo modelo</h3>
                <div className="space-y-3">
                  <select
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(t => ({ ...t, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecione o nome do modelo</option>
                    <option value="Café da Manhã">Café da Manhã</option>
                    <option value="Almoço">Almoço</option>
                    <option value="Merenda">Merenda</option>
                    <option value="Jantar">Jantar</option>
                  </select>
                  <div className="space-y-2">
                    {newTemplate.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const items = [...newTemplate.items]
                            items[idx] = e.target.value
                            setNewTemplate(t => ({ ...t, items }))
                          }}
                          placeholder="Item da refeição"
                          className="flex-1 px-3 py-2 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => {
                            const items = newTemplate.items.filter((_, i) => i !== idx)
                            setNewTemplate(t => ({ ...t, items: items.length ? items : [''] }))
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setNewTemplate(t => ({ ...t, items: [...t.items, ''] }))}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-base font-medium flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Adicionar item
                  </button>
                  <button
                    onClick={async () => {
                      if (!newTemplate.name || !newTemplate.name.trim()) {
                        alert('Selecione um nome para o modelo')
                        return
                      }
                      const cleanedItems = newTemplate.items.map(i => i.trim()).filter(Boolean)
                      if (cleanedItems.length === 0) {
                        alert('Adicione pelo menos um item')
                        return
                      }
                      try {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                        const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                        const mealType = planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name
                        const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/meal-templates`)
                        url.searchParams.set('username', adminUser?.username || '')
                        const res = await fetch(url.toString(), {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: newTemplate.name.trim(),
                            meal_type: mealType,
                            items: cleanedItems
                          })
                        })
                        if (res.ok) {
                          await loadMealTemplates()
                          // Aplicar automaticamente o modelo criado
                          const d = [...planObj.days]
                          d[selectedMealContext.dayIndex].meals[selectedMealContext.mealIndex].items = cleanedItems
                          setPlanObj({ days: d })
                          setNewTemplate({ name: '', meal_type: mealType, items: [''] })
                          setShowTemplateModal(false)
                          setSelectedMealContext(null)
                        } else {
                          const body = await res.json().catch(() => ({}))
                          alert('Erro ao criar modelo: ' + (body.error || 'Erro desconhecido'))
                        }
                      } catch (err) {
                        console.error(err)
                        alert('Erro ao criar modelo: ' + err.message)
                      }
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-base font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Criar e usar modelo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
