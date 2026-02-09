import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function DayEditor({ 
  dayPlan, 
  currentDayStep, 
  planObj, 
  setPlanObj, 
  onOpenTemplates 
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">{dayPlan.day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dayPlan.meals?.map((meal, mIdx) => (
          <div key={mIdx} className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg text-indigo-700">{meal.name}</h4>
              <button
                onClick={() => onOpenTemplates(mIdx)}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> Adicionar modelo pronto
              </button>
            </div>
            <div className="space-y-2 mb-3">
              {meal.items?.map((item, iIdx) => (
                <div key={iIdx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const d = [...planObj.days]
                      d[currentDayStep].meals[mIdx].items[iIdx] = e.target.value
                      setPlanObj({ days: d })
                    }}
                    placeholder="Ex: Arroz integral, Frango grelhado..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      const d = [...planObj.days]
                      d[currentDayStep].meals[mIdx].items = d[currentDayStep].meals[mIdx].items.filter((_, idx) => idx !== iIdx)
                      setPlanObj({ days: d })
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const d = [...planObj.days]
                d[currentDayStep].meals[mIdx].items.push('')
                setPlanObj({ days: d })
              }}
              className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} /> Adicionar item
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}