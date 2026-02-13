import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuestionnaireStep({ step, totalSteps, questions, onNext, onPrevious, theme = 'purple' }) {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const currentQuestion = questions[step - 1]

  // Definição de cores baseadas no tema
  const colors = {
    purple: {
      primary: '#7B67A6',
      bgLight: '#f9f4ff',
      shadow: 'rgba(123,103,166,0.25)',
      button: '#7B67A6',
      buttonHover: '#6a5990',
      textTitle: '#7B67A6'
    },
    green: {
      primary: '#40804b',
      bgLight: '#f4fbf6',
      shadow: 'rgba(64,128,75,0.25)',
      button: '#40804b',
      buttonHover: '#346a3d',
      textTitle: '#40804b'
    }
  }

  const activeTheme = colors[theme] || colors.purple

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
      // Limpa answers se for mudar de pergunta (opcional, dependendo de como o pai gerencia)
      // Mas aqui o estado é local por passo, então ao mudar de passo o componente remonta ou atualiza
      // Se a lógica de passo estiver no pai, o `answers` aqui acumula.
      // Vamos manter como está, assumindo que `answers` é resetado ou gerido pelo `key` no pai se necessário,
      // mas como o `QuestionnaireStep` é montado uma vez, o `answers` persiste.
      // O correto seria o pai passar os valores iniciais se quiser persistência ao voltar.
      // Por simplicidade e seguindo o código original, mantemos.
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
            <h4
              className="font-bold text-xs mb-2 uppercase tracking-tight"
              style={{ color: activeTheme.textTitle }}
            >
              {mealName}
            </h4>
            <textarea
              value={answers[mealName] || ''}
              onChange={(e) => handleInputChange(mealName, e.target.value)}
              placeholder={`O que você come no ${mealName.toLowerCase()}?`}
              /* Letra menor (text-xs) para o conteúdo digitado */
              className="w-full px-3 py-2 border border-[#e0e8f0] rounded-lg text-xs focus:outline-none min-h-[60px] font-marcellus transition-all"
              style={{ borderColor: '#e0e8f0' }}
              onFocus={(e) => e.target.style.borderColor = activeTheme.primary}
              onBlur={(e) => e.target.style.borderColor = '#e0e8f0'}
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
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all`}
                style={{
                  borderColor: answers[currentQuestion.id] === option.id ? activeTheme.primary : '#e0e8f0',
                  backgroundColor: answers[currentQuestion.id] === option.id ? activeTheme.bgLight : 'transparent'
                }}
              >
                <input
                  type="radio"
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleInputChange(currentQuestion.id, option.id)}
                  className="w-5 h-5"
                  style={{ accentColor: activeTheme.primary }}
                />
                <span className={`ml-4 font-marcellus ${answers[currentQuestion.id] === option.id ? 'font-bold' : 'text-[#333]'}`}
                  style={{ color: answers[currentQuestion.id] === option.id ? activeTheme.primary : '#333' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )
      case 'textarea':
        return (
          <textarea
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl outline-none min-h-[150px] font-marcellus bg-[#fcfcfc] text-left"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            style={{ borderColor: '#e0e8f0' }}
            onFocus={(e) => e.target.style.borderColor = activeTheme.primary}
            onBlur={(e) => e.target.style.borderColor = '#e0e8f0'}
          />
        )
      case 'file':
        return (
          <div className="text-left w-full">
            <label className="block p-8 border-2 border-dashed border-[#e0e8f0] rounded-xl cursor-pointer hover:bg-white transition-colors bg-[#fcfcfc] text-center group">
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const formData = new FormData()
                    formData.append('file', file)

                    try {
                      // Feedback visual de upload (opcional, aqui simplificado)
                      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/upload`.replace('//api', '/api'), {
                        method: 'POST',
                        body: formData
                      })

                      if (res.ok) {
                        const data = await res.json()
                        handleInputChange(currentQuestion.id, data.filepath)
                      } else {
                        console.error('Falha no upload')
                        alert('Erro ao enviar arquivo. Tente novamente.')
                      }
                    } catch (err) {
                      console.error(err)
                      alert('Erro ao conectar com servidor.')
                    }
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f0f8f7] flex items-center justify-center text-[#40804b] group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {answers[currentQuestion.id] ? 'Arquivo anexado! Clique para alterar.' : 'Clique para selecionar um arquivo'}
                </span>
                {answers[currentQuestion.id] && <span className="text-xs text-[#40804b] font-bold">Upload concluído</span>}
              </div>
            </label>
          </div>
        )
      case 'number':
        return (
          <input
            type="number"
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl outline-none font-marcellus bg-[#fcfcfc] text-left"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            style={{ borderColor: '#e0e8f0' }}
            onFocus={(e) => e.target.style.borderColor = activeTheme.primary}
            onBlur={(e) => e.target.style.borderColor = '#e0e8f0'}
            placeholder="Digite um número..."
          />
        )
      default:
        return (
          <input
            type="text"
            className="w-full p-4 border-2 border-[#e0e8f0] rounded-xl outline-none font-marcellus bg-[#fcfcfc] text-left"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            style={{ borderColor: '#e0e8f0' }}
            onFocus={(e) => e.target.style.borderColor = activeTheme.primary}
            onBlur={(e) => e.target.style.borderColor = '#e0e8f0'}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#f7faff] font-marcellus flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">

        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
            style={{ color: activeTheme.primary }}
          >
            ←
          </button>
          <div className="flex-1">
            <div className="h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%`, backgroundColor: activeTheme.primary }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modal com Sombra Dinâmica */}
        <div
          className="bg-white rounded-2xl p-8 md:p-12 border border-white text-left relative"
          style={{ boxShadow: `0 20px 60px ${activeTheme.shadow}` }}
        >

          <div className="mb-10">
            <span
              className="font-bold text-xs uppercase tracking-[3px] opacity-70"
              style={{ color: activeTheme.textTitle }}
            >
              Passo {step} de {totalSteps}
            </span>
            <h2 className="text-3xl font-marcellus text-[#333] mt-2 mb-4 leading-tight">
              {currentQuestion.question}
            </h2>
            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.primary }}></div>
          </div>

          <div className="mb-10 max-h-[500px] overflow-y-auto pr-2">
            {renderInput()}
          </div>

          <div className="flex gap-4 justify-between pt-8 border-t border-gray-100">
            <button
              onClick={onPrevious}
              disabled={step === 1}
              className="px-8 py-3 bg-gray-50 text-[#999] rounded-lg font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              /* BOTÃO DESABILITADO SE NÃO RESPONDER */
              disabled={!isCurrentQuestionAnswered()}
              className={`px-12 py-3 text-white rounded-lg font-bold transition-all shadow-md`}
              style={{
                backgroundColor: isCurrentQuestionAnswered() ? activeTheme.button : '#d1d5db',
                cursor: isCurrentQuestionAnswered() ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => { if (isCurrentQuestionAnswered()) e.target.style.backgroundColor = activeTheme.buttonHover }}
              onMouseLeave={(e) => { if (isCurrentQuestionAnswered()) e.target.style.backgroundColor = activeTheme.button }}
            >
              {step === totalSteps ? 'Próxima Etapa' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}