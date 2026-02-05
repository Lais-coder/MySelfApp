import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuestionnaireStep({ step, totalSteps, questions, onNext, onPrevious }) {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const currentQuestion = questions[step - 1]

  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  // Verifica se a pergunta atual foi respondida para liberar o botão
  const isCurrentQuestionAnswered = () => {
    if (currentQuestion.type === 'meals') {
      const mealTypes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia']
      return mealTypes.some(meal => answers[meal] && answers[meal].trim() !== '')
    }
    if (currentQuestion.type === 'file') return true // Arquivos geralmente são opcionais, mas você pode mudar
    
    return answers[currentQuestion.id] && answers[currentQuestion.id].toString().trim() !== ''
  }

  const handleNext = () => {
    if (isCurrentQuestionAnswered()) {
      onNext(answers)
    }
  }

  const progressPercentage = (step / totalSteps) * 100

  const renderMealsInput = () => {
    const mealTypes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia']
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {mealTypes.map((mealName) => (
          <div 
            key={mealName} 
            className="p-4 border border-gray-100 rounded-xl bg-[#fcfcfc] text-left"
          >
            {/* Letra menor para os títulos das refeições */}
            <h4 className="font-bold text-xs text-[#7B67A6] mb-2 uppercase tracking-tight">{mealName}</h4>
            <textarea
              value={answers[mealName] || ''}
              onChange={(e) => handleInputChange(mealName, e.target.value)}
              placeholder={`O que você come no ${mealName.toLowerCase()}?`}
              /* Letra menor (text-xs) para o conteúdo digitado */
              className="w-full px-3 py-2 border border-[#e0e8f0] rounded-lg text-xs focus:outline-none focus:border-[#7B67A6] min-h-[60px] font-marcellus transition-all"
            />
          </div>
        ))}
      </div>
    )
  }

  const renderInput = () => {
    if (currentQuestion.type === 'meals') return renderMealsInput()

    switch (currentQuestion.type) {
      case 'option':
        return (
          <div className="space-y-3 text-left">
            {currentQuestion.options.map((option) => (
              <label 
                key={option.id} 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.id 
                  ? 'border-[#7B67A6] bg-[#f9f4ff]' 
                  : 'border-[#e0e8f0] hover:border-[#7B67A6]'
                }`}
              >
                <input
                  type="radio"
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleInputChange(currentQuestion.id, option.id)}
                  className="w-5 h-5 accent-[#7B67A6]"
                />
                <span className={`ml-4 font-marcellus ${answers[currentQuestion.id] === option.id ? 'text-[#7B67A6] font-bold' : 'text-[#333]'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )
      case 'textarea':
        return (
          <textarea
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl focus:border-[#7B67A6] outline-none min-h-[150px] font-marcellus bg-[#fcfcfc] text-left"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
          />
        )
      default:
        return (
          <input
            type="text"
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl focus:border-[#7B67A6] outline-none font-marcellus bg-[#fcfcfc] text-left"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-[#7B67A6] bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">←</button>
          <div className="flex-1">
            <div className="h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
              <div className="h-full bg-[#7B67A6] transition-all" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Modal com Sombra Roxa */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-white shadow-[0_20px_60px_rgba(123,103,166,0.25)] text-left relative">
          
          <div className="mb-10">
            <span className="text-[#7B67A6] font-bold text-xs uppercase tracking-[3px] opacity-70">
              Passo {step} de {totalSteps}
            </span>
            <h2 className="text-3xl font-marcellus text-[#333] mt-2 mb-4 leading-tight">
              {currentQuestion.question}
            </h2>
            <div className="w-16 h-1.5 bg-[#7B67A6] rounded-full"></div>
          </div>

          <div className="mb-10 max-h-[500px] overflow-y-auto pr-2">
            {renderInput()}
          </div>

          <div className="flex gap-4 justify-between pt-8 border-t border-gray-100">
            <button
              onClick={onPrevious}
              disabled={step === 1}
              className="px-8 py-3 bg-gray-50 text-[#999] rounded-lg font-bold disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              /* BOTÃO DESABILITADO SE NÃO RESPONDER */
              disabled={!isCurrentQuestionAnswered()}
              className={`px-12 py-3 text-white rounded-lg font-bold transition-all shadow-md ${
                isCurrentQuestionAnswered() ? 'bg-[#40804b] hover:bg-[#346a3d]' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'Finalizar Questionário' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}