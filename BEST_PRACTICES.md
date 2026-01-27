# 💡 Melhores Práticas - React + Vite + Tailwind

Guia de boas práticas para desenvolvimento de qualidade.

## 📐 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Common/         # Navbar, Footer, etc
│   └── Questionnaire/  # Componentes específicos
├── pages/              # Páginas completas
├── services/           # Chamadas de API
├── context/            # Context API
├── hooks/              # Custom hooks
├── utils/              # Funções utilitárias
├── styles/             # Estilos globais
└── App.jsx             # Arquivo raiz
```

---

## ✅ Padrões de Código

### 1. **Nomenclatura de Componentes**

```javascript
// ✅ BOM - PascalCase para componentes
export default function UserProfile() { }
export default function MealPlanCard() { }

// ❌ RUIM - camelCase ou nomes genéricos
export default function userProfile() { }
export default function card() { }
```

### 2. **Props e Desestruturação**

```javascript
// ✅ BOM - Desestruturar em function params
export default function Card({ title, description, onClose }) {
  return <div>{title}</div>
}

// ❌ RUIM - Usar props.algo
export default function Card(props) {
  return <div>{props.title}</div>
}
```

### 3. **Eventos**

```javascript
// ✅ BOM - Nomes descritivos com "handle" prefix
const handleClick = () => { }
const handleFormSubmit = (e) => { }

// ❌ RUIM - Nomes genéricos
const onClick = () => { }
const onSubmit = (e) => { }
```

### 4. **Estados**

```javascript
// ✅ BOM - Estados bem nomeados
const [isLoading, setIsLoading] = useState(false)
const [userProfile, setUserProfile] = useState(null)
const [error, setError] = useState(null)

// ❌ RUIM - Nomes confusos
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [err, setErr] = useState(null)
```

### 5. **Efeitos Colaterais**

```javascript
// ✅ BOM - Cleanup em useEffect
useEffect(() => {
  const timer = setInterval(() => {
    // fazer algo
  }, 1000)

  return () => clearInterval(timer) // Cleanup
}, [])

// ❌ RUIM - Sem cleanup (memory leak)
useEffect(() => {
  setInterval(() => { }, 1000)
}, [])
```

---

## 🎨 Tailwind CSS

### 1. **Organização de Classes**

```javascript
// ✅ BOM - Ordem: Layout, Display, Spacing, Size, Color, Typography, Effects
<div className="
  flex items-center justify-between
  px-4 py-2
  w-full
  bg-white text-gray-800
  text-lg font-bold
  shadow-md rounded-lg
  hover:shadow-lg transition-shadow
">
  Content
</div>

// ❌ RUIM - Classes desorganizadas
<div className="hover:shadow-lg text-lg px-4 shadow-md bg-white rounded-lg">
  Content
</div>
```

### 2. **Componentes Reutilizáveis**

```javascript
// ✅ BOM - Componente Button reutilizável
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) {
  const baseStyle = 'font-bold rounded-lg transition-colors'
  const variants = {
    primary: 'bg-purple-lilac2 text-white hover:bg-purple-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Uso:
<Button variant="primary" size="lg">Entrar</Button>
<Button variant="secondary" size="sm">Cancelar</Button>
```

### 3. **Evitar Classes Inline Longas**

```javascript
// ✅ BOM - Usar componentes ou @apply
export function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  )
}

// Em index.css:
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow;
  }
}

// ❌ RUIM - Classes inline gigantes
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ...">
```

---

## 🎯 Rendering Otimizado

### 1. **Memoização**

```javascript
import { memo } from 'react'

// ✅ BOM - Componente puro memoizado
export const UserCard = memo(({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  )
})

// ❌ RUIM - Sem memoização (renderiza sempre)
export function UserCard({ user, onSelect }) {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  )
}
```

### 2. **useCallback**

```javascript
import { useCallback } from 'react'

// ✅ BOM - Memoizar callbacks
const handleDelete = useCallback((id) => {
  deleteUser(id)
}, [])

// Passar para componentes puro memoizado
<MemoizedList onDelete={handleDelete} />

// ❌ RUIM - Criar função inline
<MemoizedList onDelete={(id) => deleteUser(id)} />
```

### 3. **useMemo**

```javascript
import { useMemo } from 'react'

// ✅ BOM - Memoizar cálculos pesados
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name))
}, [users])

// ❌ RUIM - Calcular em cada render
const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name))
```

---

## 🔍 Performance

### 1. **Lazy Loading de Rotas**

```javascript
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))

// Em App.jsx:
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

### 2. **Imagens Otimizadas**

```javascript
// ✅ BOM - srcset responsivo
<img 
  src="/imagens/logo-md.png" 
  srcSet="
    /imagens/logo-sm.png 480w,
    /imagens/logo-md.png 768w,
    /imagens/logo-lg.png 1200w
  "
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
  alt="Logo"
/>

// ❌ RUIM - Imagem grande em todos os dispositivos
<img src="/imagens/logo-lg.png" alt="Logo" />
```

---

## 🧪 Testes

### 1. **Estrutura de Teste**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('deve renderizar com texto correto', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique</Button>)
    screen.getByText('Clique').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

---

## 🛡️ Segurança

### 1. **Sanitizar Input**

```javascript
import DOMPurify from 'dompurify'

// ✅ BOM - Sanitizar HTML
const safeHTML = DOMPurify.sanitize(userInput)
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />

// ❌ RUIM - Usar dangerouslySetInnerHTML sem sanitizar
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. **Proteger Dados Sensíveis**

```javascript
// ✅ BOM - Não guardar tokens no localStorage
sessionStorage.setItem('token', token) // ou cookie seguro

// ❌ RUIM - Guardar dados sensíveis no localStorage
localStorage.setItem('password', password)
```

### 3. **Variáveis de Ambiente**

```javascript
// ✅ BOM - Usar variáveis de ambiente
const apiUrl = import.meta.env.VITE_API_URL

// ❌ RUIM - Hardcoded
const apiUrl = 'https://minha-api.com'
```

---

## 📝 Documentação

### 1. **JSDoc Comments**

```javascript
/**
 * Componente de botão reutilizável
 * @param {string} variant - Estilo do botão (primary, secondary)
 * @param {string} size - Tamanho (sm, md, lg)
 * @param {ReactNode} children - Conteúdo do botão
 * @param {Function} onClick - Callback ao clicar
 */
export function Button({ variant, size, children, onClick }) {
  // ...
}
```

### 2. **Comentários Úteis**

```javascript
// ✅ BOM - Explica o "por quê"
// Usar setTimeout aqui é necessário porque a animação CSS
// leva 300ms e React atualiza o state imediatamente
setTimeout(() => setIsOpen(false), 300)

// ❌ RUIM - Óbvio demais
// Set isOpen to false
setIsOpen(false)
```

---

## 🔄 Git Workflow

```bash
# ✅ BOM - Commits descritivos
git commit -m "feat: adicionar autenticação com JWT"
git commit -m "fix: corrigir layout em mobile"
git commit -m "refactor: melhorar performance do questionnaire"

# ❌ RUIM - Commits genéricos
git commit -m "update"
git commit -m "fix bug"
```

---

## 🚀 Dicas Extras

1. **Use ESLint e Prettier** para formatação automática
2. **Ative o StrictMode** em desenvolvimento para verificar problemas
3. **Use React DevTools** para debug e análise de performance
4. **Não mutue estado** - sempre crie novos objetos
5. **Prefira composição** sobre herança
6. **Mantenha componentes pequenos** (single responsibility)
7. **Use TypeScript** para projetos maiores

---

**Código limpo = Projeto sustentável! 🎯**
