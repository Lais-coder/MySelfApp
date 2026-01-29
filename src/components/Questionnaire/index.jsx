import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from './QuestionnaireStep'
import { questionnaireData } from './questionnaireData'
import { sendToN8n } from '../../services/questionnaireService'

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1)
  const [allAnswers, setAllAnswers] = useState({})
  const navigate = useNavigate()

  const handleNext = (stepAnswers) => {
    const merged = { ...allAnswers, ...stepAnswers }
    setAllAnswers(merged)

    if (currentStep < questionnaireData.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Envia para n8n e salva no banco de dados do usuário
      ;(async () => {
        try {
          // Envia para n8n
          await sendToN8n(merged)
          
          // Salva no banco de dados do usuário
          const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
          if (currentUser?.username) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
            await fetch(`${apiUrl.replace(/\/$/, '')}/api/questionnaire/user`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: currentUser.username,
                questionnaireData: merged
              })
            })
          }
        } catch (err) {
          console.error('Erro ao enviar dados para n8n ou banco de dados', err)
        } finally {
          navigate('/dashboard', { state: { answers: merged } })
        }
      })()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <QuestionnaireStep
      step={currentStep}
      totalSteps={questionnaireData.length}
      questions={questionnaireData}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  )
}

