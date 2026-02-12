import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { AlertCircle, ArrowRight } from 'lucide-react'
import FoodPlanModal from '../components/Admin/FoodPlanModal'
import MealTemplateModal from '../components/Admin/MealTemplateModal'

export default function AdminNoFoodPlan() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [currentDayStep, setCurrentDayStep] = useState(0)
    const [planObj, setPlanObj] = useState({ days: [] })
    const [validationErrors, setValidationErrors] = useState([])

    // Template Modal State
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [mealTemplates, setMealTemplates] = useState([])
    const [loadingTemplates, setLoadingTemplates] = useState(false)
    const [selectedMealContext, setSelectedMealContext] = useState(null)
    const [newTemplate, setNewTemplate] = useState({ name: '', meal_type: 'Café da Manhã', items: [''] })

    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const mealTypes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar']
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

    const load = async () => {
        try {
            const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
            if (!adminUser?.is_admin || Number(adminUser.is_admin) !== 1) {
                navigate('/dashboard')
                return
            }

            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/reports/no-food-plan?username=${encodeURIComponent(adminUser.username)}`)

            if (res.ok) {
                const body = await res.json()
                setUsers(body.data || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [navigate])

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

    const handleCreatePlanClick = (username) => {
        setEditingUser(username)
        setPlanObj({ days: weekDays.map(day => ({ day, meals: mealTypes.map(m => ({ name: m, items: [''] })) })) })
        setCurrentDayStep(0)
        setValidationErrors([])
        setModalOpen(true)
        loadMealTemplates()
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
            if (res.ok) {
                alert('Plano salvo!');
                setModalOpen(false)
                load() // Reload list to remove user who now has a plan
            }
        } catch (err) { alert(err.message) }
    }

    return (
        <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
            <Navbar />
            <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate('/admin')} className="text-[#666] hover:text-[#40804b] transition-colors">
                        &larr; Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-[#40804b]">Usuários sem Plano Alimentar</h1>
                </div>

                {loading ? (
                    <p className="text-center text-[#666] py-10">Carregando...</p>
                ) : users.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-xl text-[#666]">Todos os usuários possuem plano alimentar! 🎉</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#f0f8f7] border-b border-[#e0e8f0]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Usuário</th>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Email</th>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Data de Cadastro</th>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e0e8f0]">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-[#f9faff] transition-colors">
                                            <td className="px-6 py-4 font-medium">{u.username}</td>
                                            <td className="px-6 py-4 text-[#666]">{u.email || '-'}</td>
                                            <td className="px-6 py-4 text-[#666]">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleCreatePlanClick(u.username)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#7c64a4] text-white rounded-lg hover:bg-[#68528a] transition-all text-sm font-bold"
                                                >
                                                    Criar Plano <ArrowRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

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
                    handleDeleteTemplate={async (id) => { /* lógica delete fetch - opcional aqui pois é create only context usually */ }}
                    handleCreateTemplate={async () => { /* lógica create fetch */ }}
                />
            )}

            <Footer />
        </div>
    )
}
