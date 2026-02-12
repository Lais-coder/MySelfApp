import { useNavigate } from 'react-router-dom'
import { AlertCircle, FileQuestion, UserX, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'

export default function DashboardHome({ users }) {
    const navigate = useNavigate()
    // 1. Cálculos de métricas
    const totalUsers = users.length

    const noFoodPlanCount = users.filter(u =>
        !u.food_plan ||
        u.food_plan === '{}' ||
        (typeof u.food_plan === 'string' && u.food_plan.length < 5)
    ).length

    const noQuizCount = users.filter(u =>
        !u.questionnaire_data ||
        u.questionnaire_data === '{}' ||
        (typeof u.questionnaire_data === 'string' && u.questionnaire_data.length < 5)
    ).length

    // Inativos: 0 checkins OU nenhum nos últimos 7 dias. 
    // Como users vem de /api/admin/users, temos o checkinCount, mas não a data do ultimo checkin detalhada aqui 
    // (a menos que o backend mande, mas vamos usar checkinCount como proxy ou 0 checkins para simplicidade inicial conforme pedido "0 check-ins")
    const inactiveCount = users.filter(u => !u.checkinCount || u.checkinCount === 0).length

    // Média de Engajamento
    const totalCheckins = users.reduce((acc, curr) => acc + (curr.checkinCount || 0), 0)
    const avgCheckins = totalUsers > 0 ? (totalCheckins / totalUsers).toFixed(1) : 0

    // 2. Lista Users sem plano (para a tabela detalhada)
    const noFoodPlanUsers = users.filter(u =>
        !u.food_plan ||
        u.food_plan === '{}' ||
        (typeof u.food_plan === 'string' && u.food_plan.length < 5)
    )

    // 3. Lista de Intervenção Prioritária (Top 5 sem checkins, ordenados por data de criação - mais antigos primeiro)
    const priorityUsers = users
        .filter(u => !u.checkinCount || u.checkinCount === 0)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, 5)

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Cards de Triagem (Widgets) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card: Sem Plano */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-50 p-3 rounded-lg text-red-500">
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-3xl font-bold text-gray-800">{noFoodPlanCount}</span>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Sem Plano Alimentar</h3>
                </div>

                {/* Card: Sem Quiz */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-50 p-3 rounded-lg text-orange-500">
                            <FileQuestion size={24} />
                        </div>
                        <span className="text-3xl font-bold text-gray-800">{noQuizCount}</span>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Sem Questionário</h3>
                </div>

                {/* Card: Inativos */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gray-100 p-3 rounded-lg text-gray-500">
                            <UserX size={24} />
                        </div>
                        <span className="text-3xl font-bold text-gray-800">{inactiveCount}</span>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Nunca Acessaram</h3>
                </div>

                {/* Card: Engajamento */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-lg text-[#40804b]">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-3xl font-bold text-gray-800">{avgCheckins}</span>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Média de Check-ins</h3>
                </div>
            </div>

            {/* Seção 1: Alunos sem Plano Alimentar (NOVO) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-50 p-2 rounded-lg text-red-500">
                        <AlertCircle size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Alunos sem Plano Alimentar</h2>
                </div>

                {noFoodPlanUsers.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Todos os alunos possuem plano! 🎉</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white rounded-lg">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Usuário</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Email</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {noFoodPlanUsers.slice(0, 5).map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{u.username}</td>
                                        <td className="px-6 py-4 text-gray-500">{u.email || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate('/admin/no-food-plan')}
                                                className="px-4 py-2 bg-[#f0f8f7] text-[#40804b] border border-[#40804b] rounded-lg text-sm font-bold hover:bg-[#40804b] hover:text-white transition-colors flex items-center gap-2 ml-auto"
                                            >
                                                Gerenciar <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {noFoodPlanUsers.length > 5 && (
                            <div className="p-4 text-center border-t border-gray-100">
                                <p className="text-sm text-gray-500">E mais {noFoodPlanUsers.length - 5} alunos...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Seção 2: Intervenção Prioritária */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6 ">
                    <div className="bg-purple-50 p-2 rounded-lg text-[#7B67A6]">
                        <AlertTriangle size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Intervenção Prioritária</h2>
                </div>

                <p className="text-gray-500 text-sm mb-4">Alunos que estão na plataforma mas <strong>nunca realizaram um check-in</strong> (ordenados por data de cadastro).</p>

                {priorityUsers.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Nenhum aluno precisa de intervenção urgente! 🎉</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {priorityUsers.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#7c64a4] hover:bg-purple-50/30 transition-all group">
                                <div>
                                    <h4 className="font-bold text-gray-800 group-hover:text-[#7c64a4] transition-colors">{u.username}</h4>
                                    <p className="text-xs text-gray-500">{u.email || 'Sem email'}</p>
                                    <p className="text-xs text-gray-400 mt-1">Cadastrado em: {new Date(u.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
