import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from './QuestionnaireStep'
import { questionnaireData } from './questionnaireData'

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1)
  const [allAnswers, setAllAnswers] = useState({})
  const navigate = useNavigate()

  const handleNext = (stepAnswers) => {
    setAllAnswers(prev => ({ ...prev, ...stepAnswers }))
    
    if (currentStep < questionnaireData.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Redirecionar após completar todas as perguntas
      navigate('/profile', { state: { answers: allAnswers } })
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
