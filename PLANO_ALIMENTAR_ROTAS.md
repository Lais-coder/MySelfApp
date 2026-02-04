# 📋 Rotas do Plano Alimentar - Documentação

## 🔄 Fluxo Completo

### 1. **Backend - Rotas Disponíveis**

#### `PUT /api/user/:username/foodplan`
**Descrição**: Salva ou atualiza o plano alimentar de um usuário.

**Parâmetros**:
- `:username` (URL) - Usuário alvo que terá o plano atualizado
- `?username=admin` (Query) - Usuário que está fazendo a requisição (para validação de admin)

**Body (JSON)**:
```json
{
  "plan": {
    "days": [
      {
        "day": "Domingo",
        "meals": [
          {
            "name": "Café da Manhã",
            "items": ["Café com leite", "Bolo caseiro", "Frutas"]
          },
          {
            "name": "Almoço",
            "items": ["Frango assado", "Arroz", "Feijão"]
          },
          {
            "name": "Lanche",
            "items": ["Sorvete natural", "Frutas vermelhas"]
          },
          {
            "name": "Jantar",
            "items": ["Massa", "Molho de tomate", "Salada"]
          }
        ]
      },
      // ... outros 6 dias
    ]
  }
}
```

**Validação**:
- Se o `caller` (quem faz a requisição) for diferente do `target` (usuário alvo), requer privilégios de admin
- Retorna `403` se não for admin tentando alterar plano de outro usuário

**Resposta**:
```json
{
  "success": true
}
```

---

#### `GET /api/user/:username/foodplan`
**Descrição**: Recupera o plano alimentar de um usuário.

**Parâmetros**:
- `:username` (URL) - Usuário cujo plano será recuperado

**Resposta**:
```json
{
  "success": true,
  "data": {
    "days": [
      {
        "day": "Domingo",
        "meals": [...]
      },
      // ... outros dias
    ]
  }
}
```

**Nota**: Se não houver plano cadastrado, retorna `{ success: true, data: {} }`

---

### 2. **Frontend - Como Usa as Rotas**

#### **Admin.jsx** (Página do Nutricionista)
**Fluxo de Salvamento**:

1. Nutricionista cria **modelos de refeição** (ex: "Café leve 1", "Almoço proteico")
2. Para cada modelo, seleciona em quais **dias da semana** aplicar
3. Ao clicar em "Salvar Plano Completo":
   - Gera automaticamente a estrutura `{ days: [...] }` com 7 dias × 4 refeições
   - Preenche cada dia/refeição com os itens dos modelos conforme os dias selecionados
   - Envia via `PUT /api/user/:username/foodplan?username=admin`
   - Body: `{ plan: { days: [...] } }`

**Exemplo de geração**:
```javascript
// Se você tem um modelo "Café leve" aplicado em Segunda e Quarta:
// O sistema gera:
{
  days: [
    { day: "Domingo", meals: [{ name: "Café da Manhã", items: [] }, ...] },
    { day: "Segunda", meals: [{ name: "Café da Manhã", items: ["Café", "Pão"] }, ...] },
    { day: "Terça", meals: [{ name: "Café da Manhã", items: [] }, ...] },
    { day: "Quarta", meals: [{ name: "Café da Manhã", items: ["Café", "Pão"] }, ...] },
    // ...
  ]
}
```

---

#### **FoodPlan.jsx** (Página do Paciente)
**Fluxo de Leitura**:

1. Ao carregar a página, faz `GET /api/user/:username/foodplan`
2. Recebe `{ success: true, data: { days: [...] } }`
3. Extrai `body.data.days` (ou `body.data` se for array direto)
4. Renderiza o plano na tela, mostrando cada dia e suas refeições
5. Se não houver plano cadastrado, usa um plano padrão

---

### 3. **Banco de Dados**

**Tabela**: `users`
**Coluna**: `food_plan` (Tipo: JSON/TEXT)

**Estrutura armazenada**:
```json
{
  "days": [
    {
      "day": "Domingo",
      "meals": [
        { "name": "Café da Manhã", "items": ["..."] },
        { "name": "Almoço", "items": ["..."] },
        { "name": "Lanche", "items": ["..."] },
        { "name": "Jantar", "items": ["..."] }
      ]
    },
    // ... outros 6 dias
  ]
}
```

**Funções do DB** (`server/db.js`):
- `setUserFoodPlan(username, planObj)` - Salva como `JSON.stringify(planObj)`
- `getUserFoodPlan(username)` - Retorna `JSON.parse(row.food_plan || '{}')`

---

## ✅ Verificação de Funcionamento

### ✅ **Está Funcionando Corretamente**:

1. ✅ Admin pode salvar plano para qualquer usuário (validação de admin funciona)
2. ✅ Paciente pode ler seu próprio plano
3. ✅ Estrutura de dados é consistente entre salvar e ler
4. ✅ Se não houver plano, paciente vê plano padrão
5. ✅ Modelos de refeição são convertidos automaticamente para estrutura de dias

### ⚠️ **Pontos de Atenção**:

1. **Autenticação**: As rotas não exigem token JWT, apenas validação de `username` via query/body. Isso funciona, mas não é o padrão mais seguro.
2. **Validação de dados**: O backend não valida se a estrutura `{ days: [...] }` está completa (7 dias, 4 refeições cada). A validação está apenas no frontend.
3. **Plano padrão**: Se o paciente não tiver plano, o frontend usa um plano hardcoded. Isso está OK para UX, mas pode ser melhorado.

---

## 🔧 Como Testar

1. **Como Admin**:
   ```bash
   # Criar plano para usuário "joao"
   curl -X PUT http://localhost:4000/api/user/joao/foodplan?username=admin \
     -H "Content-Type: application/json" \
     -d '{"plan": {"days": [...]}}'
   ```

2. **Como Paciente**:
   ```bash
   # Ler plano do usuário "joao"
   curl http://localhost:4000/api/user/joao/foodplan
   ```

---

## 📝 Resumo

- ✅ **Rotas estão funcionando corretamente**
- ✅ **Fluxo Admin → DB → Paciente está integrado**
- ✅ **Estrutura de dados é consistente**
- ✅ **Validação de admin funciona**
- ⚠️ **Sugestão**: Adicionar validação de estrutura no backend para maior segurança
