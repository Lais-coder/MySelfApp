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
  db.run(`
    CREATE TABLE IF NOT EXISTS meal_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      items TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela meal_templates:', err)
      process.exit(1)
    }
    console.log('Tabela meal_templates criada/verificada com sucesso.')
    process.exit(0)
  })
})
