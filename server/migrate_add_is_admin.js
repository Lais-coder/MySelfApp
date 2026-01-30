const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')

if (!fs.existsSync(DB_PATH)) {
  console.log('Arquivo de DB não encontrado, nada a migrar.')
  process.exit(0)
}

const db = new sqlite3.Database(DB_PATH)

db.serialize(() => {
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('Erro ao verificar schema:', err)
      process.exit(1)
    }

    const hasIsAdmin = (rows || []).some(r => r.name === 'is_admin')
    if (hasIsAdmin) {
      console.log('Coluna is_admin já presente. Nada a fazer.')
      process.exit(0)
    }

    db.run('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0', (aerr) => {
      if (aerr) {
        console.error('Erro ao adicionar coluna is_admin:', aerr)
        process.exit(1)
      }
      console.log('Coluna is_admin adicionada com sucesso.')
      process.exit(0)
    })
  })
})
