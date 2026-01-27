import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuestionnaireStep({ step, totalSteps, questions, onNext, onPrevious }) {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  const currentQuestion = questions[step - 1]

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      onNext(answers)
    } else {
      // Última pergunta - redirecionar para perfil
      navigate('/profile', { state: { answers } })
    }
  }

  const progressPercentage = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-medium to-purple-darker flex items-center justify-center p-4">
      {/* Header com progresso */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8 bg-white/10 p-4 rounded-lg">
          <button
            onClick={onPrevious}
            className="text-white text-2xl hover:text-yellow-light transition-colors"
            aria-label="Voltar"
          >
            ←
          </button>
          <div className="flex-1 h-1 bg-gray-400 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-lilac2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-white font-bold">{step}/{totalSteps}</span>
        </div>

        {/* Conteúdo da pergunta */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-marcellus text-purple-lilac2 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Opções de resposta */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-lilac2 hover:bg-purple-light/10 transition-all"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleAnswer(option.id)}
                  className="w-5 h-5 text-purple-lilac2 cursor-pointer"
                />
                <span className="ml-4 text-lg text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {/* Botões de navegação */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={onPrevious}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="px-8 py-3 bg-purple-lilac2 text-white rounded-lg font-bold hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {step === totalSteps ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
