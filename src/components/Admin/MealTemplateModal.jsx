import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function MealTemplateModal({
  planObj,
  selectedMealContext,
  setShowTemplateModal,
  setSelectedMealContext,
  setNewTemplate,
  loadingTemplates,
  mealTemplates,
  newTemplate,
  handleUseTemplate,
  handleDeleteTemplate,
  handleCreateTemplate
}) {
  return (
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
          >✕</button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-base">Selecionar modelo existente</h3>
            {loadingTemplates ? <p className="text-gray-500 text-base">Carregando...</p> : 
              mealTemplates.filter(t => t.meal_type === planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name).length === 0 ? 
              <p className="text-gray-500 text-base">Nenhum modelo disponível para esta refeição.</p> : 
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {mealTemplates.filter(t => t.meal_type === planObj.days[selectedMealContext.dayIndex]?.meals[selectedMealContext.mealIndex]?.name).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition-all">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-base">{t.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{t.items.join(' • ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUseTemplate(t)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">Usar</button>
                      <button onClick={() => handleDeleteTemplate(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-base">Criar novo modelo</h3>
            <div className="space-y-3">
              <select value={newTemplate.name} onChange={(e) => setNewTemplate(t => ({ ...t, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-base">
                <option value="">Selecione o nome do modelo</option>
                <option value="Café da Manhã">Café da Manhã</option><option value="Almoço">Almoço</option><option value="Merenda">Merenda</option><option value="Jantar">Jantar</option>
              </select>
              <div className="space-y-2">
                {newTemplate.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={item} onChange={(e) => { const items = [...newTemplate.items]; items[idx] = e.target.value; setNewTemplate(t => ({ ...t, items })); }} className="flex-1 px-3 py-2 border rounded-lg text-base" />
                    <button onClick={() => { const items = newTemplate.items.filter((_, i) => i !== idx); setNewTemplate(t => ({ ...t, items: items.length ? items : [''] })); }} className="p-2 text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => setNewTemplate(t => ({ ...t, items: [...t.items, ''] }))} className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-base font-medium flex items-center justify-center gap-2"><Plus size={16} /> Adicionar item</button>
              <button onClick={handleCreateTemplate} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-base font-semibold flex items-center justify-center gap-2"><Plus size={16} /> Criar e usar modelo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}