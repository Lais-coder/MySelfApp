require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// AJUSTE: Incluído 'updateUserHealth' na desestruturação abaixo
const { 
  init, 
  insertSubmission, 
  listSubmissions, 
  createUser, 
  getUserByUsername, 
  updateUserQuestionnaire, 
  updateUserHealth, // <--- ADICIONADO AQUI
  getUserQuestionnaire, 
  updateUserFields, 
  listUsers, 
  getCheckinsCounts, 
  addDailyCheckin, 
  getDailyCheckins, 
  getDailyCheckinsForMonth, 
  setUserFoodPlan, 
  getUserFoodPlan, 
  listMealTemplates, 
  getMealTemplatesByType, 
  createMealTemplate, 
  deleteMealTemplate 
} = require('./db')

const { db } = require('./db')
const bcrypt = require('bcryptjs')

const PORT = process.env.PORT || 4000
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}-${file.originalname}`
    cb(null, unique)
  }
})

const upload = multer({ storage })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

init()

// GARANTIA: Executa um comando para garantir que a coluna health_data exista no SQLite
// Se ela já existir, o SQLite apenas ignorará o erro.
db.serialize(() => {
  db.run("ALTER TABLE users ADD COLUMN health_data JSON", (err) => {
    if (err) {
      // Coluna já existe, tudo ok
    } else {
      console.log("Coluna health_data adicionada com sucesso ao banco de dados.");
    }
  });
});

// Middleware simples para verificar se o usuário é admin
async function isAdmin(req, res, next) {
  try {
    const username = req.query.username || req.body.username || req.headers['x-username']
    if (!username) return res.status(401).json({ error: 'username é obrigatório para verificação de admin' })

    const user = await getUserByUsername(username)
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    if (user.is_admin && Number(user.is_admin) === 1) return next()
    return res.status(403).json({ error: 'Acesso negado: requer privilégios de administrador' })
  } catch (err) {
    console.error('Erro no middleware isAdmin:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
}

app.post('/api/questionnaire', upload.any(), async (req, res) => {
  try {
    const payloadRaw = req.body.payload || '{}'
    const payload = JSON.parse(payloadRaw)

    const filesObj = {}
    if (req.files && req.files.length) {
      req.files.forEach(f => {
        filesObj[f.fieldname] = {
          filename: f.filename,
          originalname: f.originalname,
          path: `/uploads/${f.filename}`
        }
      })
    }

    const name = payload.nome || payload.name || null
    const email = payload.email || null

    const dbRes = await insertSubmission(name, email, payload, filesObj)

    res.json({ success: true, id: dbRes.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Rota de login simples
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ error: 'username e password são obrigatórios' })

    const user = await getUserByUsername(username)
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' })

    const { password: _p, ...userSafe } = user
    res.json({ success: true, user: userSafe })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Rota de registro
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ error: 'username e password são obrigatórios' })

    const existing = await getUserByUsername(username)
    if (existing) return res.status(409).json({ error: 'Usuário já existe' })

    const hash = await bcrypt.hash(password, 10)
    const dbRes = await createUser(username, email || null, hash)

    const user = await getUserByUsername(username)
    const { password: _p, ...userSafe } = user
    res.status(201).json({ success: true, user: userSafe })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Retorna dados do usuário (sem senha)
app.get('/api/me', async (req, res) => {
  try {
    const username = req.query.username
    if (!username) return res.status(400).json({ error: 'username é obrigatório' })

    const user = await getUserByUsername(username)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

    const { password: _p, ...userSafe } = user
    res.json({ success: true, user: userSafe })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Rota para salvar a ETAPA 2 (Saúde)
app.post('/api/save-health', async (req, res) => {
  try {
    const { username, answers } = req.body;
    if (!username || !answers) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // AGORA FUNCIONA: A função está importada corretamente
    await updateUserHealth(username, answers);

    res.json({ success: true, message: 'Dados de saúde salvos!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para salvar a ETAPA 1 (Dados Pessoais)
app.post('/api/save-questionnaire', async (req, res) => {
  try {
    const { username, answers } = req.body;
    if (!username || !answers) {
      return res.status(400).json({ error: 'Username e respostas são obrigatórios' });
    }

    await updateUserQuestionnaire(username, answers);

    res.json({ success: true, message: 'Questionário salvo com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar questionário' });
  }
});

// Salvar ou atualizar respostas do questionário para um usuário
app.post('/api/questionnaire/user', async (req, res) => {
  try {
    const { username, questionnaireData } = req.body || {}
    if (!username || !questionnaireData) {
      return res.status(400).json({ error: 'username e questionnaireData são obrigatórios' })
    }

    await updateUserQuestionnaire(username, questionnaireData)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Recuperar respostas do questionário de um usuário
app.get('/api/questionnaire/user/:username', async (req, res) => {
  try {
    const { username } = req.params
    if (!username) return res.status(400).json({ error: 'username é obrigatório' })

    const data = await getUserQuestionnaire(username)
    res.json({ success: true, data: data || {} })
  } catch (err) {
    console.error('Erro ao recuperar questionário:', err)
    res.status(500).json({ error: err.message })
  }
})

// Adicionar daily check-in
app.post('/api/daily-checkin', async (req, res) => {
  try {
    const { username } = req.body || {}
    if (!username) return res.status(400).json({ error: 'username é obrigatório' })

    const today = new Date().toISOString().split('T')[0]
    const result = await addDailyCheckin(username, today)
    res.json({ success: true, isNew: result.isNew })
  } catch (err) {
    console.error('Erro ao adicionar check-in:', err)
    res.status(500).json({ error: err.message })
  }
})

// Obter check-ins do mês
app.get('/api/daily-checkins/month/:username/:year/:month', async (req, res) => {
  try {
    const { username, year, month } = req.params
    const checkins = await getDailyCheckinsForMonth(username, parseInt(year), parseInt(month))
    const dates = checkins.map(c => c.check_in_date)
    res.json({ success: true, data: dates })
  } catch (err) {
    console.error('Erro ao recuperar check-ins do mês:', err)
    res.status(500).json({ error: err.message })
  }
})

// Obter todos os check-ins do usuário
app.get('/api/daily-checkins/:username', async (req, res) => {
  try {
    const { username } = req.params
    const checkins = await getDailyCheckins(username)
    const dates = checkins.map(c => c.check_in_date)
    res.json({ success: true, data: dates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Atualizar campos do usuário
app.put('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params
    const fields = req.body || {}
    await updateUserFields(username, fields)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Atualizar plano alimentar
app.put('/api/user/:username/foodplan', async (req, res) => {
  try {
    const target = req.params.username
    const plan = req.body.plan || {}
    const caller = req.query.username || req.body.username || req.headers['x-username']
    
    if (caller !== target) {
      const userCaller = await getUserByUsername(caller)
      if (!userCaller || !userCaller.is_admin || Number(userCaller.is_admin) !== 1) return res.status(403).json({ error: 'Acesso negado' })
    }

    await setUserFoodPlan(target, plan)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obter plano alimentar
app.get('/api/user/:username/foodplan', async (req, res) => {
  try {
    const target = req.params.username
    const plan = await getUserFoodPlan(target)
    res.json({ success: true, data: plan || {} })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Rotas administrativas
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await listUsers()
    const counts = await getCheckinsCounts()
    const countsMap = {}
    counts.forEach(c => { countsMap[c.username] = c.count })
    const data = users.map(u => ({ username: u.username, email: u.email, questionnaire_data: u.questionnaire_data, health_data: u.health_data, is_admin: u.is_admin, created_at: u.created_at, checkinCount: countsMap[u.username] || 0 }))
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/admin/checkins', isAdmin, async (req, res) => {
  try {
    const counts = await getCheckinsCounts()
    res.json({ success: true, data: counts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/admin/user/:username/checkins', isAdmin, async (req, res) => {
  try {
    const { username } = req.params
    const checkins = await getDailyCheckins(username)
    res.json({ success: true, data: checkins.map(c => c.check_in_date) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Criar usuário admin
app.post('/api/admin/create-user', isAdmin, async (req, res) => {
  try {
    const { username, password, email } = req.body || {}
    const existing = await getUserByUsername(username)
    const hash = await bcrypt.hash(password, 10)
    if (existing) {
      db.run('UPDATE users SET password = ?, email = ?, is_admin = 1 WHERE username = ?', [hash, email || null, username], (err) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ success: true })
      })
    } else {
      db.run('INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 1)', [username, email || null, hash], (err) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ success: true })
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Meal Templates
app.get('/api/admin/meal-templates', isAdmin, async (req, res) => {
  try {
    const templates = await listMealTemplates()
    res.json({ success: true, data: templates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/meal-templates', isAdmin, async (req, res) => {
  try {
    const { name, meal_type, items } = req.body
    const result = await createMealTemplate(name, meal_type, items)
    res.json({ success: true, data: { id: result.id, name, meal_type, items } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admin/meal-templates/:id', isAdmin, async (req, res) => {
  try {
    const result = await deleteMealTemplate(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})