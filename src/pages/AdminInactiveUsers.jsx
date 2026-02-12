import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import { Clock, AlertTriangle } from 'lucide-react'

export default function AdminInactiveUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(7)
    const navigate = useNavigate()

    const load = async (daysParam) => {
        setLoading(true)
        try {
            const adminUser = JSON.parse(localStorage.getItem('user') || 'null')
            if (!adminUser?.is_admin || Number(adminUser.is_admin) !== 1) {
                navigate('/dashboard')
                return
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/reports/inactive?days=${daysParam}&username=${encodeURIComponent(adminUser.username)}`)

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
        load(days)
    }, [navigate]) // dias não está na dependência para evitar loop infinito se não tratado, mas aqui controlled pelo botão

    const handleFilterChange = (e) => {
        const val = parseInt(e.target.value)
        setDays(val)
        load(val)
    }

    return (
        <div className="min-h-screen bg-[#f7faff] font-marcellus text-[#333]">
            <Navbar />
            <div className="max-w-[1200px] w-[90%] mx-auto py-8 mt-14 mb-20">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-3xl font-bold text-[#d9534f]">Relatório de Inatividade</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fde8e8] p-3 rounded-full text-[#d9534f]">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Critério de Inatividade</h2>
                            <p className="text-sm text-[#666]">Listando usuários sem check-in nos últimos dias.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-[#333] font-semibold">Dias sem check-in:</label>
                        <select
                            value={days}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-lg bg-gray-50 focus:border-[#7c64a4] outline-none"
                        >
                            <option value={3}>3 dias</option>
                            <option value={7}>7 dias</option>
                            <option value={15}>15 dias</option>
                            <option value={30}>30 dias</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-[#666] py-10">Carregando...</p>
                ) : users.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-xl text-[#666]">Nenhum usuário inativo encontrado para este período! 👏</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#f0f8f7] border-b border-[#e0e8f0]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-[#d9534f]">Usuário</th>
                                        <th className="px-6 py-4 font-bold text-[#d9534f]">Email</th>
                                        <th className="px-6 py-4 font-bold text-[#d9534f]">Último Check-in</th>
                                        <th className="px-6 py-4 font-bold text-[#d9534f]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e0e8f0]">
                                    {users.map(u => {
                                        const lastDate = u.last_checkin ? new Date(u.last_checkin) : null
                                        const diffTime = lastDate ? Math.abs(new Date() - lastDate) : 0
                                        const diffDays = lastDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 'Nunca'

                                        return (
                                            <tr key={u.id} className="hover:bg-[#f9faff] transition-colors">
                                                <td className="px-6 py-4 font-medium">{u.username}</td>
                                                <td className="px-6 py-4 text-[#666]">{u.email || '-'}</td>
                                                <td className="px-6 py-4 text-[#666]">
                                                    {lastDate ? lastDate.toLocaleDateString() : <span className="text-red-500 font-bold">Nunca</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#fde8e8] text-[#c0392b]">
                                                        {typeof diffDays === 'number' ? `${diffDays} dias offline` : 'Nunca acessou'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
