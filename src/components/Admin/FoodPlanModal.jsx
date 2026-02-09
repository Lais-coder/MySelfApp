import React from 'react';
import { AlertCircle, Plus, Trash2, Check } from 'lucide-react';

export default function FoodPlanModal({ 
  editingUser, 
  setModalOpen, 
  validationErrors, 
  weekDays, 
  currentDayStep, 
  setCurrentDayStep, 
  planObj, 
  setPlanObj, 
  setSelectedMealContext, 
  setShowTemplateModal, 
  handleSavePlan 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-purple-lilac2 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h2 className="text-2xl font-bold">Criar Plano para {editingUser}</h2>
          <button onClick={() => setModalOpen(false)} className="text-xl font-bold hover:bg-white/20 p-2 rounded">✕</button>
        </div>

        <div className="p-6">
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex gap-2 items-start">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800 mb-2">Erros encontrados:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((err, idx) => <li key={idx}>• {err}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stepper */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              {weekDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentDayStep(idx)}
                  className={`flex-1 mx-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                    currentDayStep === idx ? 'bg-[#7c64a4] text-white shadow-md' : 
                    planObj.days?.[idx]?.meals?.every(m => m.items?.some(i => i.trim())) ? 'bg-green-100 text-green-700 border-2 border-green-400' : 
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                  {planObj.days?.[idx]?.meals?.every(m => m.items?.some(i => i.trim())) && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Day Editor */}
          {planObj.days?.[currentDayStep] && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">{planObj.days[currentDayStep].day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {planObj.days[currentDayStep].meals?.map((meal, mIdx) => (
                  <div key={mIdx} className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-indigo-700">{meal.name}</h4>
                      <button onClick={() => { setSelectedMealContext({ dayIndex: currentDayStep, mealIndex: mIdx }); setShowTemplateModal(true); }} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">+ Modelo</button>
                    </div>
                    {meal.items?.map((item, iIdx) => (
                      <div key={iIdx} className="flex gap-2 items-center mb-2">
                        <input value={item} onChange={(e) => { const d = [...planObj.days]; d[currentDayStep].meals[mIdx].items[iIdx] = e.target.value; setPlanObj({ days: d }); }} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                        <button onClick={() => { const d = [...planObj.days]; d[currentDayStep].meals[mIdx].items = d[currentDayStep].meals[mIdx].items.filter((_, idx) => idx !== iIdx); setPlanObj({ days: d }); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => { const d = [...planObj.days]; d[currentDayStep].meals[mIdx].items.push(''); setPlanObj({ days: d }); }} className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">+ Item</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-between pt-6 border-t">
                <button onClick={() => setCurrentDayStep(Math.max(0, currentDayStep - 1))} disabled={currentDayStep === 0} className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50">← Anterior</button>
                <button onClick={() => setCurrentDayStep(Math.min(6, currentDayStep + 1))} disabled={currentDayStep === 6} className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50">Próximo →</button>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-6 border-t mt-6">
            <button onClick={() => setModalOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg font-bold">Cancelar</button>
            <button onClick={handleSavePlan} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg"><Check size={18} /> Salvar Plano</button>
          </div>
        </div>
      </div>
    </div>
  );
}