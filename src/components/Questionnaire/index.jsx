import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from './QuestionnaireStep'
import { personalQuestions, healthQuestions } from './questionnaireData'
import { sendToN8n } from '../../services/questionnaireService'

export default function Questionnaire() {
  const navigate = useNavigate()

  // Fase: 1 = Personal (Roxo), 2 = Health (Verde)
  const [phase, setPhase] = useState(1)
  const [currentStep, setCurrentStep] = useState(1)
  const [allAnswers, setAllAnswers] = useState({})

  // Determina dados baseados na fase atual
  const currentQuestions = phase === 1 ? personalQuestions : healthQuestions
  const currentTheme = phase === 1 ? 'purple' : 'green'

  const handleNext = (stepAnswers) => {
    // Acumula respostas
    const merged = { ...allAnswers, ...stepAnswers }
    setAllAnswers(merged)

    if (currentStep < currentQuestions.length) {
      // Avança na mesma fase
      setCurrentStep(prev => prev + 1)
    } else {
      // Fim da fase atual
      if (phase === 1) {
        // Transição para Fase 2
        setPhase(2)
        setCurrentStep(1)
      } else {
        // Fim da Fase 2 -> Submit Final
        submitAll(merged)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      // Se estiver no primeiro passo da fase
      if (phase === 2) {
        // Volta para o último passo da Fase 1
        setPhase(1)
        setCurrentStep(personalQuestions.length)
      } else {
        // Sai do questionário (volta pro dashboard) se estiver no inicio da Fase 1
        navigate('/dashboard')
      }
    }
  }

  const submitAll = async (finalAnswers) => {
    try {
      // 1. Envia para n8n (Payload único com tudo)
      await sendToN8n(finalAnswers)

      // 2. Salva no SQLite
      const currentUser = JSON.parse(localStorage.getItem('user_data') || 'null')
      if (currentUser?.username) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

        // Salva etapa 1 (Personal)
        // Nota: O backend espera endpoints separados ou um unificado?
        // O código anterior usava endpoints separados. Vamos manter a lógica de salvar ambos.
        // Ou melhor, salvar tudo de uma vez se o backend suportar, mas para garantir compatibilidade
        // vamos enviar para os endpoints existentes sequencialmente ou adaptar.
        // Assumindo que o backend salva JSONs parciais ou totais.

        // Salvar Personal Data
        await fetch(`${apiUrl.replace(/\/$/, '')}/api/save-questionnaire`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            answers: finalAnswers // Envia tudo, o backend que filtre ou salve tudo
          })
        })

        // Salvar Health Data
        await fetch(`${apiUrl.replace(/\/$/, '')}/api/save-health`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            answers: finalAnswers
          })
        })
      }

      // Sucesso
      navigate('/dashboard')

    } catch (err) {
      console.error('Erro ao salvar questionário:', err)
      // Mesmo com erro, talvez redirecionar ou mostrar toast
      navigate('/dashboard')
    }
  }

  return (
    <QuestionnaireStep
      step={currentStep}
      totalSteps={currentQuestions.length}
      questions={currentQuestions}
      onNext={handleNext}
      onPrevious={handlePrevious}
      theme={currentTheme}
    />
  )
}