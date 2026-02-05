// ETAPA 1: DADOS PESSOAIS
export const personalQuestions = [
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
];

// ETAPA 2: SAÚDE E ALIMENTAÇÃO
export const healthQuestions = [
  { id: 'possui_doenca', question: 'Possui alguma doença?', type: 'text' },
  { id: 'historico_familiar', question: 'Histórico de doença na família:', type: 'text' },
  { id: 'ultimo_dia_menstruacao', question: 'Último dia de menstruação (se aplicável):', type: 'text' },
  
  // NOVO CAMPO: Objetivo Principal (Conectado ao seu Perfil)
  { 
    id: 'objetivo_principal', 
    question: 'Qual o seu objetivo principal?', 
    type: 'option', 
    options: [
      { id: 'emagrecimento', label: 'Emagrecimento' },
      { id: 'hipertrofia', label: 'Ganho de Massa (Hipertrofia)' },
      { id: 'performance', label: 'Performance Esportiva' },
      { id: 'saude', label: 'Saúde e Bem-estar' },
      { id: 'reeducacao', label: 'Reeducação Alimentar' }
    ] 
  },
  
  { id: 'alergias', question: 'Você possui alergia a algum alimento?', type: 'text' },
  { id: 'comidas_nao_gosta', question: 'Quais são as comidas que você NÃO gosta?', type: 'text' },
  { id: 'exames_laboratoriais', question: 'Possui exames laboratoriais (anexar se tiver):', type: 'file' },
  { id: 'atividade_fisica', question: 'Pratica atividade física?', type: 'text' },
  { id: 'consumo_diario', question: 'Recordatório Alimentar: O que você consome diariamente?', type: 'meals' }
];