import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from './QuestionnaireStep'
import { personalQuestions, healthQuestions } from './questionnaireData'
import { sendToN8n } from '../../services/questionnaireService'

export default function Questionnaire({ type }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [allAnswers, setAllAnswers] = useState({})
  const navigate = useNavigate()

  // Define qual conjunto de dados usar baseado na prop 'type'
  const questionnaireData = type === 'personal' ? personalQuestions : healthQuestions
  const apiEndpoint = type === 'personal' ? '/api/save-questionnaire' : '/api/save-health'

  const handleNext = (stepAnswers) => {
    const merged = { ...allAnswers, ...stepAnswers }
    setAllAnswers(merged)

    if (currentStep < questionnaireData.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      ;(async () => {
        try {
          // 1. Envia para n8n
          await sendToN8n(merged)
          
          // 2. Salva no SQLite
          const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
          if (currentUser?.username) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
            await fetch(`${apiUrl.replace(/\/$/, '')}${apiEndpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: currentUser.username,
                answers: merged
              })
            })
          }
        } catch (err) {
          console.error('Erro ao salvar questionário:', err)
        } finally {
          navigate('/dashboard')
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