# 🚀 Guia Rápido - Como Executar o Projeto

## Pré-requisitos
- Node.js v16+ instalado
- npm ou yarn

## Instalação e Execução

### 1️⃣ Abra o terminal na pasta do projeto
```bash
cd "c:\Users\grupo\OneDrive\Documentos\GitHub\Projeto-Nutricional\React-App"
```

### 2️⃣ Instale as dependências
```bash
npm install
```
Isso pode levar alguns minutos na primeira vez.

### 3️⃣ Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O navegador abrirá automaticamente em `http://localhost:3000`

## 📱 Navegação

- **Home** `/` - Página inicial
- **Login** `/login` - Fazer login
- **Signup** `/signup` - Criar conta com questionário
- **Profile** `/profile` - Seu perfil
- **Plano Alimentar** `/plano-alimentar` - Seu plano de refeições
- **Calendário** `/calendario` - Acompanhamento de progresso

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor com hot reload
```

### Build
```bash
npm run build        # Cria versão otimizada para produção
npm run preview      # Visualiza a build
```

## 📝 Adicionar Imagens

1. Copie suas imagens para a pasta `public/imagens/`
2. Use nos componentes assim:
```jsx
<img src="/imagens/seu-arquivo.png" alt="Descrição" />
```

## ✨ Estrutura Criada

✅ **5 páginas funcionais**
- Home com benefícios e seção premium
- Login responsivo
- Questionário em 5 etapas (componentizado)
- Perfil do usuário
- Plano alimentar por dia
- Calendário com progresso

✅ **Componentes Reutilizáveis**
- Navbar com links
- Footer
- QuestionnaireStep (pode ser usado em outras páginas)

✅ **Tailwind CSS**
- Totalmente responsivo
- Cores personalizadas
- Animações e transições

✅ **Roteamento**
- React Router configurado
- Navegação entre páginas

## 🎨 Cores Disponíveis

Use diretos no className:

```jsx
// Roxos
className="text-purple-lilac2"
className="bg-purple-dark"

// Verdes  
className="text-green-darkGreen"
className="bg-green-medium"

// Amarelo
className="bg-yellow-light"
```

## 📚 Estrutura de Pastas

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
│   ├── services/
│   │   └── api.js (para integração com backend)
│   ├── context/
│   │   └── AuthContext.jsx (gerenciamento de estado)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── imagens/ (adicione suas imagens aqui)
└── index.html
```

## 🔗 Próximos Passos

### Para Integrar com Backend:
1. Abra `src/services/api.js`
2. Altere `API_BASE_URL` para seu servidor
3. Use as funções em seus componentes

### Para Adicionar Novas Perguntas:
1. Edite `src/components/Questionnaire/questionnaireData.js`
2. Adicione novo objeto à array `questionnaireData`

### Para Modificar Cores:
1. Edite `tailwind.config.js`
2. Altere os valores em `theme.extend.colors`

## ⚠️ Notas Importantes

- Os dados de exemplo são estáticos (não persistem após reload)
- Para dados reais, integre com um backend
- As imagens devem estar em `public/imagens/`
- O login exemplo não faz autenticação real

## 🆘 Troubleshooting

### Porta 3000 já em uso?
```bash
npm run dev -- --port 3001
```

### Dependências não instalam?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de imagens não carregando?
- Certifique-se que as imagens estão em `public/imagens/`
- Use o caminho correto: `/imagens/arquivo.png`

---

**Dúvidas?** Veja o `README.md` para mais informações!

Bom desenvolvimento! 🎉
