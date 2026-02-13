require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const { init, db } = require('./db')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')

const PORT = process.env.PORT || 4000
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`
    cb(null, unique)
  }
})

const upload = multer({ storage })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

init()

// Garantia: Executa um comando para garantir que as colunas existam no SQLite
db.serialize(() => {
  db.run("ALTER TABLE users ADD COLUMN health_data JSON", (err) => { })
  db.run("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1", (err) => { })
})

// Rota de upload de questionário legado/específico (mantido no index ou movido se necessário)
app.post('/api/questionnaire', upload.any(), async (req, res) => {
  try {
    const { insertSubmission } = require('./db')
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

// Rota genérica de upload (para o questionário novo)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }
    // Retorna o caminho relativo para salvar no banco
    res.json({
      success: true,
      filepath: `/uploads/${req.file.filename}`,
      filename: req.file.originalname
    })
  } catch (err) {
    console.error('Erro no upload:', err)
    res.status(500).json({ error: 'Falha ao fazer upload' })
  }
})

// Usar rotas modulares
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})