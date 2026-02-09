import React from 'react'

export default function UserTable({ 
  users, 
  loading, 
  onDefinePlan, 
  showCreateAdmin, 
  setShowCreateAdmin, 
  newAdmin, 
  setNewAdmin, 
  handleCreateAdmin 
}) {
  return (
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
                      onClick={() => onDefinePlan(u.username)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                    >
                      Definir Plano
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  <button onClick={handleCreateAdmin} className="px-4 py-2 bg-indigo-600 text-white rounded">Criar Admin</button>
                  <button onClick={() => { setShowCreateAdmin(false); setNewAdmin({ username: '', email: '', password: '' }) }} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}