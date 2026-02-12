import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { ArrowRight, Search, Edit, Ban, CheckCircle, Eye } from 'lucide-react'
import FoodPlanModal from '../components/Admin/FoodPlanModal'
import MealTemplateModal from '../components/Admin/MealTemplateModal'
import ConfirmStatusModal from '../components/Admin/ConfirmStatusModal'
import UserDetailsModal from '../components/Admin/UserDetailsModal'
import toast from 'react-hot-toast'

export default function AdminAllUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [currentDayStep, setCurrentDayStep] = useState(0)
    const [planObj, setPlanObj] = useState({ days: [] })
    const [validationErrors, setValidationErrors] = useState([])

    // User Details Modal State
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [viewingUser, setViewingUser] = useState(null)

    // Template Modal State
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [mealTemplates, setMealTemplates] = useState([])
    const [loadingTemplates, setLoadingTemplates] = useState(false)
    const [selectedMealContext, setSelectedMealContext] = useState(null)
    const [newTemplate, setNewTemplate] = useState({ name: '', meal_type: 'Café da Manhã', items: [''] })

    // Status Confirmation State
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [statusTarget, setStatusTarget] = useState({ username: '', newStatus: 0 })

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

            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/users?username=${encodeURIComponent(adminUser.username)}`)

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

    const handleEditPlanClick = async (username) => {
        setEditingUser(username)
        setLoading(true) // Show loading while fetching plan
        try {
            const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/user/${encodeURIComponent(username)}/foodplan?username=${encodeURIComponent(adminUser?.username)}`)
            if (res.ok) {
                const body = await res.json()
                const existingPlan = body.data || {}

                // If plan exists, load it. If not, separate clean slate.
                if (existingPlan.days && existingPlan.days.length > 0) {
                    setPlanObj(existingPlan)
                } else {
                    setPlanObj({ days: weekDays.map(day => ({ day, meals: mealTypes.map(m => ({ name: m, items: [''] })) })) })
                }

                setCurrentDayStep(0)
                setValidationErrors([])
                setModalOpen(true)
                loadMealTemplates()
            }
        } catch (e) {
            console.error(e)
            alert("Erro ao carregar plano do usuário.")
        } finally {
            setLoading(false)
        }
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
                toast.success('Plano salvo!')
                setModalOpen(false)
                load()
            }
        } catch (err) { toast.error(err.message) }
    }

    const handleToggleClick = (username, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1
        setStatusTarget({ username, newStatus })
        setStatusModalOpen(true)
    }

    const onViewDetails = (user) => {
        setViewingUser(user)
        setDetailsModalOpen(true)
    }

    const handleConfirmStatusChange = async () => {
        const { username, newStatus } = statusTarget
        try {
            const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/user/${encodeURIComponent(username)}/status?username=${encodeURIComponent(adminUser?.username)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus })
            })

            if (res.ok) {
                toast.success(`Usuário ${newStatus === 1 ? 'ativado' : 'desativado'} com sucesso!`)
                setUsers(prev => prev.map(u => u.username === username ? { ...u, is_active: newStatus } : u))
                setStatusModalOpen(false)
            } else {
                const b = await res.json()
                throw new Error(b.error || 'Erro ao atualizar status')
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())))

    return (
        <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
            <Navbar />
            <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin')} className="text-[#666] hover:text-[#40804b] transition-colors md:hidden">
                            &larr; Voltar
                        </button>
                        <h1 className="text-3xl font-bold text-[#40804b]">Gestão de Alunos</h1>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#40804b] w-full md:w-64"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-[#666] py-10">Carregando...</p>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-xl text-[#666]">Nenhum usuário encontrado.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#f0f8f7] border-b border-[#e0e8f0]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Usuário</th>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Email</th>

                                        <th className="px-6 py-4 font-bold text-[#40804b]">Status Conta</th>
                                        <th className="px-6 py-4 font-bold text-[#40804b]">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e0e8f0]">
                                    {filteredUsers.map(u => {

                                        return (
                                            <tr key={u.id} className="hover:bg-[#f9faff] transition-colors">
                                                <td className="px-6 py-4 font-medium">
                                                    {u.username}
                                                    {u.is_admin === 1 && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>}
                                                </td>
                                                <td className="px-6 py-4 text-[#666]">{u.email || '-'}</td>

                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleClick(u.username, u.is_active)}
                                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${u.is_active !== 0
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            }`}
                                                    >
                                                        {u.is_active !== 0 ? (
                                                            <>
                                                                <CheckCircle size={14} /> Ativo
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ban size={14} /> Inativo
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => onViewDetails(u)}
                                                            className="p-2 bg-purple-100 text-[#7B67A6] rounded-full hover:bg-purple-200 transition-colors"
                                                            title="Ver Perfil"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditPlanClick(u.username)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#40804b] text-[#40804b] rounded-lg hover:bg-[#40804b] hover:text-white transition-all text-sm font-bold"
                                                        >
                                                            <Edit size={16} /> Ver/Editar Plano
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-100 text-sm text-gray-500 text-right">
                            Total de alunos: {filteredUsers.length}
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
                    handleDeleteTemplate={async (id) => { /* lógica delete fetch */ }}
                    handleCreateTemplate={async () => { /* lógica create fetch */ }}
                />
            )}

            <ConfirmStatusModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onConfirm={handleConfirmStatusChange}
                userName={statusTarget.username}
                newStatus={statusTarget.newStatus}
            />

            <UserDetailsModal
                user={viewingUser}
                onClose={() => setDetailsModalOpen(false)}
            />

            <Footer />
        </div>
    )
}
