# 🔧 Guia de Troubleshooting

Soluções para problemas comuns ao trabalhar com o projeto.

---

## 🚨 Problemas de Instalação

### Problema: "npm: comando não encontrado"
**Solução:**
- Instale [Node.js](https://nodejs.org) (versão 16+)
- Reinicie o terminal após instalação
- Verifique: `node -v` e `npm -v`

### Problema: "EACCES: permission denied"
**Solução:**
```bash
# No Windows, execute como administrador
# No Mac/Linux:
sudo npm install
# Ou use nvm (Node Version Manager)
```

### Problema: Dependências não instalam
**Solução:**
```bash
# Limpe cache do npm
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

---

## 🌐 Problemas de Execução

### Problema: "Port 3000 already in use"
**Solução:**
```bash
# Opção 1: Use outra porta
npm run dev -- --port 3001

# Opção 2: Mate o processo usando a porta
# No Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# No Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Problema: "Cannot find module 'react'"
**Solução:**
```bash
# Reinstale todas as dependências
npm install

# Ou instale a dependência faltante
npm install react react-dom
```

### Problema: "Vite not found"
**Solução:**
```bash
# Instale Vite globalmente (opcional)
npm install -g vite

# Ou execute local
npx vite
```

---

## 🎨 Problemas com Estilos

### Problema: Tailwind CSS não funciona
**Solução:**
1. Verifique se `tailwind.config.js` está configurado
2. Verifique se `index.css` tem os imports:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
3. Reinicie o dev server: `npm run dev`

### Problema: Cores personalizadas não aparecem
**Solução:**
1. Edite `tailwind.config.js`
2. Verifique a sintaxe (chaves, vírgulas)
3. Reinicie o servidor
4. Limpe cache do navegador (Ctrl+Shift+Delete)

### Problema: Estilos não atualizam em produção
**Solução:**
```bash
# Rebuild
npm run build

# Limpe cache do navegador
# Verifique o arquivo gerado em dist/
```

---

## 🗂️ Problemas de Arquivo

### Problema: "Cannot find file" em imagens
**Solução:**
1. Verifique se a imagem está em `public/imagens/`
2. Use o caminho correto: `/imagens/foto.png` (sem `src/`)
3. Verifique o nome exato (case-sensitive no Linux/Mac)

### Problema: Imagem não carrega após deploy
**Solução:**
1. Copie imagens para `public/imagens/`
2. Faça build: `npm run build`
3. Verifique se a pasta `public` foi incluída no deploy

### Problema: Arquivo .env não funciona
**Solução:**
1. Arquivo deve estar na raiz do projeto
2. Use prefixo `VITE_` nas variáveis:
```env
VITE_API_URL=https://api.exemplo.com
```
3. Acesse com: `import.meta.env.VITE_API_URL`
4. Reinicie o servidor para ler as variáveis

---

## 🔄 Problemas de Roteamento

### Problema: 404 ao acessar rotas
**Solução:**
1. Verifique se `React Router` está instalado
2. Configure o fallback para `index.html` no servidor
3. Use `<BrowserRouter>` em App.jsx

### Problema: Link não navega
**Solução:**
```jsx
// ✅ BOM - Usar Link/NavLink
import { Link } from 'react-router-dom'
<Link to="/perfil">Ir para perfil</Link>

// ❌ RUIM - Usar <a> tag
<a href="/perfil">Ir para perfil</a>
```

### Problema: State não persiste ao navegar
**Solução:**
- Use localStorage ou sessionStorage
- Ou use gerenciador de estado (Context, Zustand)
- Recupere dados ao montar componente

---

## 🔐 Problemas de Autenticação

### Problema: Token não salva
**Solução:**
```javascript
// ✅ BOM - Usar sessionStorage para dados sensíveis
sessionStorage.setItem('token', token)

// Recuperar:
const token = sessionStorage.getItem('token')
```

### Problema: Login não redireciona
**Solução:**
```javascript
// Use useNavigate do React Router
const navigate = useNavigate()
navigate('/profile')
```

---

## 📡 Problemas com API

### Problema: "CORS error" ao chamar API
**Solução:**

**Opção 1:** Configure CORS no backend
```javascript
// No seu servidor Node/Express
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

**Opção 2:** Use proxy no Vite
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://seu-backend.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

### Problema: "Network error" ao chamar API
**Solução:**
1. Verifique se a API está rodando
2. Verifique se URL está correta
3. Verifique headers (Content-Type, Authorization)
4. Abra DevTools (F12) > Network para ver requisição

### Problema: Timeout de API
**Solução:**
```javascript
// Adicione timeout à requisição
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetch(url, {
    signal: controller.signal
  })
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Requisição expirou')
  }
} finally {
  clearTimeout(timeoutId)
}
```

---

## 💾 Problemas de Build

### Problema: Build falha com erro de sintaxe
**Solução:**
1. Verificar erros em arquivo (ESLint)
2. Verifique imports e exports
3. Verifique if há `console.log` ou `debugger`

### Problema: "Unexpected token" durante build
**Solução:**
1. Verifique se JSX está em arquivos `.jsx`
2. Verifique imports de React
3. Verifique configuração do vite.config.js

### Problema: Build muito grande
**Solução:**
```bash
# Analise o bundle
npm install --save-dev vite-plugin-visualizer

# Configure em vite.config.js
import { visualizer } from "vite-plugin-visualizer"

export default {
  plugins: [visualizer()]
}

# Build e abra stats.html
npm run build
```

---

## 🔍 Problemas de Debug

### Não consegue ver erro no console
**Solução:**
1. Abra DevTools: F12
2. Vá para aba "Console"
3. Verifique erros vermelhos
4. Procure por warnings amarelos

### Componente não renderiza
**Solução:**
1. Verifique se componente está bem escrito
2. Verifique imports/exports
3. Adicione console.log para debug:
```jsx
export function MeuComponente() {
  console.log('Renderizando...')
  return <div>Olá</div>
}
```

### Estado não atualiza
**Solução:**
```jsx
// ❌ RUIM - Mutar estado diretamente
state.nome = 'novo'

// ✅ BOM - Criar novo objeto
setState({ ...state, nome: 'novo' })
```

---

## 🌍 Problemas de Deploy

### Problema: "Not found" após deploy
**Solução:**
Configure fallback para SPA no servidor:
- **Vercel**: Automático
- **Netlify**: Adicione `_redirects` file
- **GitHub Pages**: Configure jekyll

### Problema: Assets não carregam após deploy
**Solução:**
1. Verifique path das imagens
2. Use `/imagens/` em vez de `./imagens/`
3. Reconstrua: `npm run build`

### Problema: Performance lenta após deploy
**Solução:**
1. Analise bundle: veja tamanho dos chunks
2. Implemente lazy loading
3. Comprima imagens
4. Use CDN para assets estáticos

---

## 📱 Problemas de Mobile

### Problema: Layout quebrado em mobile
**Solução:**
1. Use viewport meta tag (já está em index.html)
2. Teste com DevTools (F12 > Responsive Design)
3. Use Tailwind breakpoints:
```jsx
<div className="
  text-sm md:text-base lg:text-lg
  w-full md:w-1/2 lg:w-1/3
">
```

### Problema: Zoom estranho no iOS
**Solução:**
Verifique viewport no index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🆘 Resolvendo Problemas Desconhecidos

1. **Cheque a documentação**
   - React: https://react.dev
   - Tailwind: https://tailwindcss.com
   - Vite: https://vitejs.dev

2. **Procure online**
   - Google o erro exato
   - Procure no Stack Overflow
   - Verifique issues no GitHub

3. **Resetar projeto**
   ```bash
   # Backup de src/ e public/
   rm -rf node_modules dist .next
   npm install
   npm run dev
   ```

4. **Verificar logs detalhados**
   ```bash
   # Build com logs
   npm run build -- --debug
   
   # Dev com logs
   npm run dev -- --debug
   ```

---

## 📞 Como Pedir Ajuda

Ao relatar um problema, inclua:
1. Versão do Node: `node -v`
2. Mensagem de erro exata
3. O que você estava fazendo quando ocorreu
4. Passos para reproduzir
5. Screenshot ou código relevante

---

**Ainda com problemas?**

1. Verifique se Node.js está atualizado
2. Limpe caches: `npm cache clean --force`
3. Delete node_modules e reinstale
4. Consulte a documentação oficial
5. Abra issue no GitHub

---

**Boa sorte! 🚀**
