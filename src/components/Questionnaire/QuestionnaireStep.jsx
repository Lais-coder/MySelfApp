import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuestionnaireStep({ step, totalSteps, questions, onNext, onPrevious }) {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const currentQuestion = questions[step - 1]

  const handleInputChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      onNext(answers)
    } else {
      onNext(answers) // O componente pai Questionnaire cuidará do envio final
    }
  }

  const progressPercentage = (step / totalSteps) * 100

  // Função auxiliar para renderizar o input correto
  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'option':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label 
                key={option.id} 
                className="flex items-center p-4 border-2 border-[#e0e8f0] rounded-xl cursor-pointer hover:border-[#40804b] hover:bg-[#f0fdf4] transition-all duration-300 group"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleInputChange(option.id)}
                  className="w-5 h-5 text-[#40804b] accent-[#40804b]"
                />
                <span className="ml-4 text-base text-[#333] group-hover:text-[#40804b] font-marcellus transition-colors">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'textarea':
        return (
          <textarea
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl focus:border-[#40804b] focus:ring-2 focus:ring-[#40804b]/20 outline-none min-h-[150px] resize-none font-marcellus text-base"
            placeholder="Digite sua resposta aqui..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleInputChange(e.target.files[0])}
            className="w-full p-4 border-2 border-dashed border-[#d0d8e0] rounded-xl hover:border-[#40804b] hover:bg-[#f0fdf4] transition-all cursor-pointer"
          />
        )

      default: // 'text'
        return (
          <input
            type="text"
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl focus:border-[#40804b] focus:ring-2 focus:ring-[#40804b]/20 outline-none font-marcellus text-base"
            placeholder="Sua resposta..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f8f9fa] to-[#e8f0ed] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header com Barra de Progresso */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-[#40804b] text-2xl hover:text-[#2d5a35] transition-colors bg-white rounded-full p-2 shadow-sm hover:shadow-md"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#40804b] to-[#5a9d5f] transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#666] mt-2 font-marcellus">{step} de {totalSteps}</p>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-[#e0e8f0]">
          {/* Título da Pergunta */}
          <div className="mb-10">
            <div className="inline-block px-3 py-1 bg-[#f0fdf4] rounded-full text-[#40804b] text-xs font-bold mb-3">
              Pergunta {step}
            </div>
            <h2 className="text-3xl md:text-4xl font-marcellus text-[#333] mb-2 leading-tight">
              {currentQuestion.question}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[#40804b] to-[#5a9d5f] rounded-full mt-4"></div>
          </div>

          {/* Input Area */}
          <div className="mb-10">
            {renderInput()}
          </div>

          {/* Botões */}
          <div className="flex gap-4 justify-between pt-6 border-t border-[#e0e8f0]">
            <button
              onClick={onPrevious}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 bg-[#f0f0f0] text-[#666] rounded-lg font-marcellus font-bold disabled:opacity-40 hover:bg-[#e0e0e0] transition-all disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && currentQuestion.type !== 'file'}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#40804b] to-[#5a9d5f] text-white rounded-lg font-marcellus font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? 'Finalizar' : 'Próximo'} →
            </button>
          </div>
        </div>

        {/* Indicador Visual Inferior */}
        <div className="text-center mt-8">
          <p className="text-[#999] font-marcellus text-sm">
            {progressPercentage < 100 ? `Faltam ${totalSteps - step} pergunta${totalSteps - step > 1 ? 's' : ''}` : 'Pronto! Clique em Finalizar'}
          </p>
        </div>
      </div>
    </div>
  )
}