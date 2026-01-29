// Dados das perguntas do questionário
export const questionnaireData = [
  { id: 'nome', question: 'Qual seu nome:', type: 'text' },
  { id: 'genero', question: 'Qual seu gênero?', type: 'option', options: [
    { id: 'feminino', label: 'Feminino' },
    { id: 'masculino', label: 'Masculino' }
  ] },
  { id: 'idade', question: 'Idade:', type: 'text' },
  { id: 'estado_civil', question: 'Estado civil:', type: 'option', options: [
    { id: 'solteiro', label: 'Solteiro' },
    { id: 'casado', label: 'Casado' },
    { id: 'divorciado', label: 'Divorciado' },
    { id: 'viuvo', label: 'Viúvo' }
  ] },
  { id: 'profissao', question: 'Profissão:', type: 'text' },
  { id: 'carga_horaria', question: 'Carga horária:', type: 'text' },



  { id: 'pq_procurou', question: 'Por que procurou um nutricionista?', type: 'text' },
  { id: 'quem_indicou', question: 'Quem te indicou? Como chegou até mim?', type: 'text' },
  { id: 'possui_doenca', question: 'Possui alguma doença', type: 'text' },
  { id: 'historico_familiar', question: 'Histórico de doença na família', type: 'text' },
  { id: 'ultimo_dia_menstruacao', question: 'Último dia de menstruação', type: 'text' },
  { id: 'exames_laboratoriais', question: 'Possui exames laboratoriais (anexar se tiver)', type: 'file' },
  { id: 'atividade_fisica', question: 'Pratica atividade física', type: 'text' },
  { id: 'consumo_geral', question: 'O que geralmente consome (café da manhã, lanche, almoço, lanche, jantar e ceia)', type: 'textarea' }
]

// Simple helper store (kept for compatibility)
export const useQuestionnaireStore = (state) => {
  const [answers, setAnswers] = state || {}

  const saveAnswers = (newAnswers) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }))
  }

  const getAnswers = () => answers

  return { saveAnswers, getAnswers }
}
