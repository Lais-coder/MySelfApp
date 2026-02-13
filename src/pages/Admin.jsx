import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

import DashboardHome from '../components/Admin/DashboardHome'
import DayEditor from '../components/Admin/DayEditor'
import MealTemplateModal from '../components/Admin/MealTemplateModal'
import FoodPlanModal from '../components/Admin/FoodPlanModal'
// Importe o componente que criamos
import UserDetailsModal from '../components/Admin/UserDetailsModal'
import { AlertCircle, Check, LayoutDashboard } from 'lucide-react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // NOVOS ESTADOS PARA O DETALHE DO USUÁRIO
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState(null)

  const [currentDayStep, setCurrentDayStep] = useState(0)
  const [planObj, setPlanObj] = useState({ days: [] })
  const [mealTemplates, setMealTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedMealContext, setSelectedMealContext] = useState(null)
  const [newTemplate, setNewTemplate] = useState({ name: '', meal_type: 'Café da Manhã', items: [''] })
  const [validationErrors, setValidationErrors] = useState([])

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const mealTypes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar']
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const loadUsers = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('user_data') || 'null')
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
      const adminUser = JSON.parse(localStorage.getItem('user_data') || 'null')
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
      const adminUser = JSON.parse(localStorage.getItem('user_data') || 'null')
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#40804b]">Painel Administrativo</h1>
            <p className="text-gray-500 mt-1">Gerencie alunos, dietas e acompanhe o progresso.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-500 animate-pulse">Carregando dados...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <DashboardHome
              users={users}
              // ADICIONE AQUI A FUNÇÃO PARA ABRIR O MODAL DE DETALHES
              onViewDetails={(user) => {
                setViewingUser(user);
                setDetailsModalOpen(true);
              }}
              onDefinePlan={(username) => {
                setEditingUser(username)
                setPlanObj({ days: weekDays.map(day => ({ day, meals: mealTypes.map(m => ({ name: m, items: [''] })) })) })
                setCurrentDayStep(0); setValidationErrors([]); setModalOpen(true); loadMealTemplates();
              }}
            />
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES DO USUÁRIO COM A LÓGICA DE FECHAR */}
      {detailsModalOpen && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setDetailsModalOpen(false)}
        />
      )}

      {modalOpen && (
        <FoodPlanModal
          editingUser={editingUser}
          setModalOpen={setModalOpen}
          validationErrors={validationErrors}
          weekDays={weekDays}
          currentDayStep={currentDayStep}
          setCurrentDayStep={setCurrentDayStep}
          planObj={planObj}
          setPlanObj={setPlanObj}
          setSelectedMealContext={setSelectedMealContext}
          setShowTemplateModal={setShowTemplateModal}
          handleSavePlan={handleSavePlan}
        />
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