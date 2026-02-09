import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import UserTable from '../components/Admin/UserTable'
import DayEditor from '../components/Admin/DayEditor'
import MealTemplateModal from '../components/Admin/MealTemplateModal'
import { AlertCircle, Check } from 'lucide-react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDayStep, setCurrentDayStep] = useState(0)
  const [planObj, setPlanObj] = useState({ days: [] })
  const [mealTemplates, setMealTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedMealContext, setSelectedMealContext] = useState(null)
  const [newTemplate, setNewTemplate] = useState({ name: '', meal_type: 'Café da Manhã', items: [''] })
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState([])

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const mealTypes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar']
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const loadUsers = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
      const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
      if (adminUser?.username) url.searchParams.set('username', adminUser.username)
      const res = await fetch(url.toString())
      if (res.ok) {
        const body = await res.json()
        setUsers(body.data || [])
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const loadMealTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
      const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/admin/meal-templates`)
      url.searchParams.set('username', adminUser?.username)
      const res = await fetch(url.toString())
      if (res.ok) {
        const body = await res.json()
        setMealTemplates(body.data || [])
      }
    } catch (err) { console.error(err) } finally { setLoadingTemplates(false) }
  }

  useEffect(() => { loadUsers() }, [])

  const handleCreateAdmin = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/create-user?username=${encodeURIComponent(adminUser.username)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdmin)
      })
      if (res.ok) { alert('Admin criado!'); loadUsers(); setShowCreateAdmin(false); setNewAdmin({ username: '', email: '', password: '' }) }
    } catch (err) { alert(err.message) }
  }

  const validatePlan = () => {
    const errors = []
    if (!planObj.days || planObj.days.length !== 7) { errors.push('Você deve adicionar todos os 7 dias da semana') } 
    else {
      planObj.days.forEach((day) => {
        day.meals.forEach((meal) => {
          if (!meal.items || meal.items.length === 0) { errors.push(`${day.day} - ${meal.name}: adicione pelo menos 1 item`) }
        })
      })
    }
    setValidationErrors(errors); return errors.length === 0
  }

  const handleSavePlan = async () => {
    if (!validatePlan()) return
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(editingUser)}/foodplan?username=${encodeURIComponent(adminUser?.username)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planObj })
      })
      if (res.ok) { alert('Plano salvo!'); loadUsers(); setModalOpen(false) }
    } catch (err) { alert(err.message) }
  }

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
      <Navbar />
      <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
        <h1 className="text-3xl font-bold text-[#40804b] mb-6">Painel Administrativo</h1>
        <UserTable 
          users={users} loading={loading} showCreateAdmin={showCreateAdmin} setShowCreateAdmin={setShowCreateAdmin}
          newAdmin={newAdmin} setNewAdmin={setNewAdmin} handleCreateAdmin={handleCreateAdmin}
          onDefinePlan={(username) => {
            setEditingUser(username)
            setPlanObj({ days: weekDays.map(day => ({ day, meals: mealTypes.map(m => ({ name: m, items: [''] })) })) })
            setCurrentDayStep(0); setValidationErrors([]); setModalOpen(true); loadMealTemplates();
          }}
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-lilac2 text-white px-6 py-4 flex justify-between items-center shadow-md">
              <h2 className="text-2xl font-bold">Criar Plano para {editingUser}</h2>
              <button onClick={() => setModalOpen(false)} className="text-xl font-bold hover:bg-white/20 p-2 rounded">✕</button>
            </div>
            <div className="p-6">
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700">
                  <AlertCircle size={20} className="inline mr-2" /> Erros: {validationErrors.join(', ')}
                </div>
              )}
              <div className="mb-6 flex justify-between gap-1">
                {weekDays.map((day, idx) => (
                  <button key={idx} onClick={() => setCurrentDayStep(idx)} className={`flex-1 py-3 rounded-lg font-semibold text-sm ${currentDayStep === idx ? 'bg-[#7c64a4] text-white' : 'bg-gray-100 text-gray-600'}`}>{day.slice(0, 3)}</button>
                ))}
              </div>
              <DayEditor dayPlan={planObj.days[currentDayStep]} currentDayStep={currentDayStep} planObj={planObj} setPlanObj={setPlanObj} onOpenTemplates={(mIdx) => { setSelectedMealContext({ dayIndex: currentDayStep, mealIndex: mIdx }); setShowTemplateModal(true); }} />
              <div className="flex gap-3 justify-between pt-6 border-t mt-6">
                <button onClick={() => setCurrentDayStep(Math.max(0, currentDayStep - 1))} disabled={currentDayStep === 0} className="px-4 py-2 bg-gray-200 rounded-lg">← Anterior</button>
                <button onClick={() => setCurrentDayStep(Math.min(6, currentDayStep + 1))} disabled={currentDayStep === 6} className="px-4 py-2 bg-gray-200 rounded-lg">Próximo →</button>
              </div>
              <div className="flex gap-3 justify-end pt-6 border-t mt-6">
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg font-bold">Cancelar</button>
                <button onClick={handleSavePlan} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"><Check size={18} /> Salvar Plano</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <MealTemplateModal 
          planObj={planObj} selectedMealContext={selectedMealContext} setShowTemplateModal={setShowTemplateModal}
          setSelectedMealContext={setSelectedMealContext} setNewTemplate={setNewTemplate} loadingTemplates={loadingTemplates}
          mealTemplates={mealTemplates} newTemplate={newTemplate}
          handleUseTemplate={(t) => { const d = [...planObj.days]; d[selectedMealContext.dayIndex].meals[selectedMealContext.mealIndex].items = [...t.items]; setPlanObj({ days: d }); setShowTemplateModal(false); }}
          handleDeleteTemplate={async (id) => { /* lógica delete fetch */ }}
          handleCreateTemplate={async () => { /* lógica create fetch */ }}
        />
      )}
      <Footer />
    </div>
  )
}