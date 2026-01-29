import { useEffect, useState } from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/admin/users`)
        if (!res.ok) return
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
