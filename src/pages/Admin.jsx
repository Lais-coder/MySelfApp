import { useEffect, useState } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { useRef } from 'react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [planText, setPlanText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [planObj, setPlanObj] = useState({ days: [] })
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' })
  const [presets] = useState([
    { name: 'Plano Proteico', plan: { days: [{ day: 'Segunda', meals: [{ name: 'Almoço', items: ['Peito de frango', 'Arroz integral'] }] }] } },
    { name: 'Plano Vegetariano', plan: { days: [{ day: 'Segunda', meals: [{ name: 'Almoço', items: ['Quinoa', 'Salada', 'Grão de bico'] }] }] } }
  ])
  const modalRef = useRef()

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        // Pega usuário atual do localStorage e envia username como query (o backend usa isso para verificar isAdmin)
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
                        <button onClick={() => {
                          setEditingUser(editingUser === u.username ? null : u.username)
                          setPlanText(JSON.stringify(u.questionnaire_data?.food_plan || u.food_plan || {}, null, 2) || '')
                        }} className="px-3 py-1 bg-[#f3f4f6] rounded-md">Definir Plano</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

                {/* Inline editor para definir plano do usuário selecionado */}
                {editingUser && (
                  <div className="mt-6 p-4 bg-slate-50 border rounded">
                    <h3 className="font-semibold mb-2">Definir Plano para {editingUser}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <label className="text-sm text-gray-600">Presets:</label>
                      <select onChange={e => {
                        const idx = e.target.value
                        if (idx === '') return
                        setPlanText(JSON.stringify(presets[idx].plan, null, 2))
                      }} className="p-2 border rounded">
                        <option value="">Escolher preset...</option>
                        {presets.map((p, i) => <option value={i} key={p.name}>{p.name}</option>)}
                      </select>
                    </div>

                    <textarea value={planText} onChange={e => setPlanText(e.target.value)} className="w-full h-40 p-2 border rounded mb-3 font-mono text-sm" />

                    {/* preview */}
                    <div className="mb-3">
                      <h4 className="font-medium">Preview</h4>
                      <pre className="max-h-48 overflow-auto bg-white p-3 border rounded text-sm">{(() => {
                        try { return JSON.stringify(JSON.parse(planText||'{}'), null, 2) } catch (e) { return 'JSON inválido - corrija antes de salvar.' }
                      })()}</pre>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => {
                        try {
                          const parsed = JSON.parse(planText || '{}')
                          setPlanObj(parsed?.days ? parsed : { days: parsed.days || [] })
                        } catch (e) {
                          setPlanObj({ days: [] })
                        }
                        setModalOpen(true)
                      }} className="px-4 py-2 bg-blue-600 text-white rounded">Abrir editor estruturado</button>

                      <button onClick={async () => {
                        try {
                          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                          const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                          let planObj
                          try { planObj = JSON.parse(planText || '{}') } catch (e) { throw new Error('JSON inválido') }
                          const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(editingUser)}/foodplan?username=${encodeURIComponent(adminUser?.username||'')}`, {
                            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planObj })
                          })
                          if (!res.ok) throw new Error('Erro ao salvar plano: ' + res.status)
                          // recarrega lista
                          const reloadUrl = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
                          if (adminUser?.username) reloadUrl.searchParams.set('username', adminUser.username)
                          const reloadRes = await fetch(reloadUrl.toString())
                          if (reloadRes.ok) {
                            const body = await reloadRes.json()
                            setUsers(body.data || [])
                          }
                          setEditingUser(null)
                          setPlanText('')
                        } catch (err) {
                          console.error(err)
                          alert('Erro ao salvar plano: ' + err.message)
                        }
                      }} className="px-4 py-2 bg-[#10b981] text-white rounded">Salvar Plano (JSON)</button>

                      <button onClick={() => { setEditingUser(null); setPlanText('') }} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    </div>
                  </div>
                )}

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

      {/* Modal estruturado para editar plano */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Editar Plano - {editingUser}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800">Fechar ✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <button onClick={() => setPlanObj(p => ({ days: [...(p.days||[]), { day: 'Novo Dia', meals: [] }] }))} className="px-3 py-1 bg-indigo-600 text-white rounded">Adicionar Dia</button>
              </div>

              {(planObj.days || []).map((day, di) => (
                <div key={di} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <input value={day.day} onChange={e => setPlanObj(p => { const d = [...p.days]; d[di].day = e.target.value; return { days: d } })} className="p-2 border rounded w-1/2" />
                    <div className="flex gap-2">
                      <button onClick={() => setPlanObj(p => ({ days: p.days.filter((_,i) => i!==di) }))} className="px-2 py-1 bg-red-500 text-white rounded">Remover Dia</button>
                      <button onClick={() => setPlanObj(p => { const d = [...p.days]; d[di].meals.push({ name: 'Nova Refeição', items: ['Item1'] }); return { days: d } })} className="px-2 py-1 bg-green-500 text-white rounded">Adicionar Refeição</button>
                    </div>
                  </div>

                  {(day.meals || []).map((meal, mi) => (
                    <div key={mi} className="mb-2 p-2 bg-slate-50 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <input value={meal.name} onChange={e => setPlanObj(p => { const d = [...p.days]; d[di].meals[mi].name = e.target.value; return { days: d } })} className="p-2 border rounded w-1/2" />
                        <div className="flex gap-2">
                          <button onClick={() => setPlanObj(p => { const d = [...p.days]; d[di].meals = d[di].meals.filter((_,i)=>i!==mi); return { days: d } })} className="px-2 py-1 bg-red-400 text-white rounded">Remover</button>
                          <button onClick={() => setPlanObj(p => { const d = [...p.days]; d[di].meals[mi].items.push('Novo item'); return { days: d } })} className="px-2 py-1 bg-blue-500 text-white rounded">Adicionar Item</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(meal.items || []).map((it, ii) => (
                          <div key={ii} className="flex items-center gap-2">
                            <input value={it} onChange={e => setPlanObj(p => { const d = [...p.days]; d[di].meals[mi].items[ii] = e.target.value; return { days: d } })} className="p-2 border rounded w-full" />
                            <button onClick={() => setPlanObj(p => { const d = [...p.days]; d[di].meals[mi].items = d[di].meals[mi].items.filter((_,idx)=>idx!==ii); return { days: d } })} className="px-2 py-1 bg-red-300 rounded">x</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => { setModalOpen(false) }} className="px-4 py-2 bg-gray-200 rounded">Fechar</button>
                <button onClick={async () => {
                  try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
                    const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
                    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(editingUser)}/foodplan?username=${encodeURIComponent(adminUser?.username||'')}`, {
                      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planObj })
                    })
                    if (!res.ok) throw new Error('Erro ao salvar plano: ' + res.status)
                    // recarrega lista
                    const reloadUrl = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
                    if (adminUser?.username) reloadUrl.searchParams.set('username', adminUser.username)
                    const reloadRes = await fetch(reloadUrl.toString())
                    if (reloadRes.ok) {
                      const body = await reloadRes.json()
                      setUsers(body.data || [])
                    }
                    setModalOpen(false)
                    setEditingUser(null)
                    setPlanText('')
                  } catch (err) {
                    console.error(err)
                    alert('Erro ao salvar plano: ' + err.message)
                  }
                }} className="px-4 py-2 bg-[#10b981] text-white rounded">Salvar Plano</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
