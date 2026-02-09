import React from 'react'

export default function Sidebar({ days, activeDay, onSelectDay, today }) {
  return (
    <div className="flex flex-row md:flex-col gap-2 overflow-x-hidden md:overflow-x-visible pb-4 md:pb-0 justify-between md:justify-start">
      {days.map((dayPlan) => {
        const isToday = today === dayPlan.day
        const isActive = activeDay === dayPlan.day

        return (
          <button
            key={dayPlan.day}
            onClick={() => onSelectDay(dayPlan.day)}
            className={`
              flex-shrink-0 flex flex-col md:flex-row items-center justify-center md:justify-between
              w-10 h-10 md:w-full md:h-auto md:px-4 md:py-3 rounded-[10px] border transition-all duration-200
              ${isActive 
                ? 'bg-[#40804b] text-white border-[#40804b] shadow-md' 
                : 'bg-white text-[#555] border-[#ddd] hover:border-[#7B67A6]/30 hover:bg-[#f9f4ff]'
              }
              /* Destaque do dia de hoje em Roxo quando não está ativo */
              ${isToday && !isActive ? 'border-[#7B67A6] border-2 shadow-[0_0_10px_rgba(123,103,166,0.15)]' : ''}
            `}
            title={dayPlan.day}
          >
            {/* Nome Completo: Desktop */}
            <span className={`hidden md:block font-bold text-base ${isActive ? 'text-white' : 'text-[#333]'}`}>
              {dayPlan.day}
            </span>

            {/* Apenas Inicial: Mobile */}
            <span className={`block md:hidden font-bold text-sm ${isActive ? 'text-white' : 'text-[#333]'}`}>
              {dayPlan.day.charAt(0)}
            </span>

            {/* Selo "Hoje": Desktop - Agora em Roxo para contraste */}
            {isToday && (
              <span className={`
                hidden md:block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase md:ml-2
                ${isActive ? 'bg-white text-[#40804b]' : 'bg-[#7B67A6] text-white'}
                ${!isActive ? 'animate-pulse' : ''} 
              `}>
                Hoje
              </span>
            )}
            
            {/* Indicador Mobile com Pulsação em Roxo */}
            {isToday && (
               <div className="md:hidden flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 relative ${isActive ? 'bg-white' : 'bg-[#7B67A6]'}`}>
                    {/* Camada da animação de pulso roxa */}
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isActive ? 'bg-white' : 'bg-[#7B67A6]'}`} />
                  </div>
               </div>
            )}
          </button>
        )
      })}
    </div>
  )
}