// Dados das perguntas do questionário
export const questionnaireData = [
  {
    id: 'q1',
    question: 'Qual é o seu objetivo principal?',
    options: [
      { id: 'weight_loss', label: 'Perda de peso' },
      { id: 'muscle_gain', label: 'Ganho de massa muscular' },
      { id: 'healthy_eating', label: 'Melhorar hábitos alimentares' },
      { id: 'energy', label: 'Aumentar energia e disposição' }
    ]
  },
  {
    id: 'q2',
    question: 'Qual é o seu nível de atividade física?',
    options: [
      { id: 'sedentary', label: 'Sedentário (pouca ou nenhuma atividade)' },
      { id: 'light', label: 'Leve (1-3 dias por semana)' },
      { id: 'moderate', label: 'Moderado (3-5 dias por semana)' },
      { id: 'intense', label: 'Intenso (6-7 dias por semana)' }
    ]
  },
  {
    id: 'q3',
    question: 'Você possui alguma restrição alimentar?',
    options: [
      { id: 'none', label: 'Nenhuma' },
      { id: 'vegetarian', label: 'Vegetariano' },
      { id: 'vegan', label: 'Vegano' },
      { id: 'gluten_free', label: 'Sem glúten' },
      { id: 'lactose_free', label: 'Sem lactose' },
      { id: 'other', label: 'Outra' }
    ]
  },
  {
    id: 'q4',
    question: 'Qual é o seu tipo de corpo?',
    options: [
      { id: 'ectomorph', label: 'Magro (Ectomorfo)' },
      { id: 'mesomorph', label: 'Atlético (Mesomorfo)' },
      { id: 'endomorph', label: 'Robusto (Endomorfo)' }
    ]
  },
  {
    id: 'q5',
    question: 'Qual é a sua preferência de refeições por dia?',
    options: [
      { id: 'three_meals', label: '3 refeições principais' },
      { id: 'five_meals', label: '5 refeições (com lanches)' },
      { id: 'intermittent', label: 'Jejum intermitente' },
      { id: 'flexible', label: 'Sem preferência, quero flexibilidade' }
    ]
  }
]

export const useQuestionnaireStore = (state) => {
  const [answers, setAnswers] = state || {}
  
  const saveAnswers = (newAnswers) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }))
  }

  const getAnswers = () => answers

  return { saveAnswers, getAnswers }
}
