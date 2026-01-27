# MYF'SP - Projeto Nutricional em React + Vite + Tailwind CSS

Este é o projeto MYF'SP transformado de HTML/CSS puro para uma aplicação React moderna com Vite e Tailwind CSS.

## 🚀 Recursos

- **React 18** com hooks
- **Vite** para build rápido e desenvolvimento
- **Tailwind CSS** para estilos
- **React Router** para navegação
- **Componentes Reutilizáveis** para o questionário
- **Responsivo** em todos os dispositivos

## 📁 Estrutura do Projeto

```
React-App/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── Questionnaire/
│   │       ├── QuestionnaireStep.jsx
│   │       ├── questionnaireData.js
│   │       └── index.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   ├── FoodPlan.jsx
│   │   └── Calendar.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── imagens/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn

### Passos

1. **Instale as dependências:**
```bash
cd React-App
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:3000`

3. **Build para produção:**
```bash
npm run build
```

## 📖 Páginas Disponíveis

### Home (/)
Página inicial com apresentação do projeto, benefícios do plano alimentar e seção premium.

### Login (/login)
Formulário de login com redirecionamento para perfil.

### Signup (/signup)
Questionário componentizado com 5 perguntas sobre:
- Objetivo nutricional
- Nível de atividade
- Restrições alimentares
- Tipo de corpo
- Preferência de refeições

### Profile (/profile)
Perfil do usuário com informações pessoais e resumo do perfil nutricional.

### Plano Alimentar (/plano-alimentar)
Visualização do plano de refeições personalizado por dia da semana.

### Calendário (/calendario)
Calendário com acompanhamento de metas e progresso.

## 🎨 Cores da Paleta

- **Roxo**: #DC8DF2, #CA6DF2, #8836BF, #56208C, #100126, #7c64a4, #7668A6
- **Verde**: #43834c, #718C35, #ecfcf6, #40804B
- **Amarelo**: #e4fc84
- **Creme**: #D9D5A0

## 📝 Notas Importantes

1. **Imagens**: Os caminhos das imagens estão configurados para `/imagens/`. Certifique-se de adicionar as imagens na pasta `public/imagens/`.

2. **Autenticação**: O login atual é apenas um exemplo. Implemente autenticação real conforme necessário.

3. **Dados Dinâmicos**: O plano alimentar e calendário têm dados de exemplo. Integre com um backend para dados reais.

4. **Componentes Reutilizáveis**: O componente `QuestionnaireStep` é totalmente reutilizável para outras páginas.

## 🔧 Customizações Fáceis

### Adicionar Nova Pergunta no Questionário
Edite `src/components/Questionnaire/questionnaireData.js` e adicione um novo objeto:

```javascript
{
  id: 'q6',
  question: 'Sua pergunta aqui?',
  options: [
    { id: 'option1', label: 'Opção 1' },
    { id: 'option2', label: 'Opção 2' }
  ]
}
```

### Modificar Cores
Edite `tailwind.config.js` e altere os valores das cores:

```javascript
colors: {
  purple: {
    lilac2: '#7668A6', // Altere aqui
  }
}
```

## 📦 Dependências Principais

- **react**: Biblioteca React
- **react-dom**: Renderização no DOM
- **react-router-dom**: Roteamento
- **tailwindcss**: Framework CSS utilitário
- **vite**: Build tool rápido

## 📞 Suporte

Para mais informações ou questões sobre o projeto, você pode:
- Entrar em contato: (11) 91234-5678
- Email: myf'sp.gmail.com.br

---

**Desenvolvido com ❤️ para a MYF'SP**
