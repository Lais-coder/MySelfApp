# 🌐 Guia de Deployment

Aqui você encontrará instruções para fazer deploy da aplicação React em diferentes plataformas.

## 📦 Preparar Aplicação para Produção

```bash
npm run build
```

Isso criará uma pasta `dist/` com os arquivos otimizados.

## 🚀 Opções de Deploy

### 1️⃣ **Vercel** (Recomendado para React)

Vercel é a empresa por trás do Next.js e oferece deploy gratuito e fácil.

#### Passos:

1. Instale a CLI do Vercel:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Confirme as opções padrão pressionando Enter

Sua aplicação estará online em minutos!

[Saiba mais](https://vercel.com)

---

### 2️⃣ **Netlify**

Netlify é outra ótima opção com deploy contínuo via Git.

#### Passos:

1. Vá para [netlify.com](https://netlify.com)
2. Clique em "Sign up"
3. Conecte seu repositório GitHub
4. Selecione este repositório
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clique "Deploy"

Sua app será publicada automaticamente a cada push!

---

### 3️⃣ **GitHub Pages**

Grátis e integrado com GitHub.

#### Passos:

1. Instale gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Adicione ao `package.json`:
```json
"homepage": "https://seu-usuario.github.io/seu-repo",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

---

### 4️⃣ **Azure Static Web Apps**

Se você tem conta Azure.

#### Passos:

1. Vá para [Azure Portal](https://portal.azure.com)
2. Crie "Static Web App"
3. Conecte seu repositório GitHub
4. Configure:
   - App location: `/`
   - Build location: `dist`
   - App artifact location: `dist`
5. Confirme

Deploy automático a cada commit!

---

### 5️⃣ **Heroku** (Só Backend)

Para fazer deploy apenas da API backend em Node.js:

1. Crie `server.js` na raiz:
```javascript
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

2. Instale dependências:
```bash
npm install express
```

3. Atualize `package.json`:
```json
"scripts": {
  "build": "vite build",
  "start": "node server.js"
}
```

4. Deploy:
```bash
heroku create seu-app-nome
heroku git:remote -a seu-app-nome
git push heroku main
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.production` para produção:

```env
VITE_API_URL=https://sua-api.com
VITE_APP_NAME=MYF'SP
```

Use em seu código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 📊 Otimizações para Produção

### 1. Analise o tamanho do bundle:
```bash
npm install --save-dev vite-plugin-visualizer
```

Configure em `vite.config.js`:
```javascript
import { visualizer } from "vite-plugin-visualizer"

export default {
  plugins: [
    react(),
    visualizer()
  ]
}
```

### 2. Code Splitting automático

Vite já faz isso, mas você pode otimizar manualmente:

```javascript
// Lazy loading de rotas
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))

// Em App.jsx:
<Suspense fallback={<LoadingPage />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

### 3. Comprimir imagens

- Use WebP em vez de PNG/JPG
- Redimensione imagens para o tamanho real
- Use responsive images com `srcset`

---

## ✅ Checklist Pré-Deploy

- [ ] Remover `console.log` de desenvolvimento
- [ ] Testar em build local: `npm run build && npm run preview`
- [ ] Adicionar `.env.production` com variáveis corretas
- [ ] Testar links e navegação
- [ ] Testar em mobile
- [ ] Verificar performance com Lighthouse
- [ ] Adicionar favicon em `public/`
- [ ] Verificar meta tags em `index.html`

---

## 🔄 Deploy Contínuo

Recomendo configurar CI/CD para deploy automático:

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        run: npx vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📈 Monitoramento

Adicione ferramentas de monitoramento:

- **Sentry**: Error tracking
- **LogRocket**: Session replay e debugging
- **Google Analytics**: Análise de tráfego
- **Datadog**: APM e monitoramento

---

## 🆘 Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Delete `node_modules` e `package-lock.json`, depois reinstale

### App não carrega após deploy
- Verificar console do navegador (F12)
- Verificar logs do servidor
- Confirmar variáveis de ambiente

### Performance lenta
- Verificar tamanho do bundle
- Implementar lazy loading
- Comprimir imagens
- Usar CDN para assets

---

## 📚 Recursos Úteis

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [Web Vitals](https://web.dev/vitals/)

---

**Pronto para ir online! 🚀**
