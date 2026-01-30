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

    const hasQuestionnaire = (rows || []).some(r => r.name === 'questionnaire_data')
    const hasQuestionnaireUpdated = (rows || []).some(r => r.name === 'questionnaire_updated_at')

    const actions = []
    if (!hasQuestionnaire) actions.push(cb => db.run("ALTER TABLE users ADD COLUMN questionnaire_data JSON", cb))
    if (!hasQuestionnaireUpdated) actions.push(cb => db.run("ALTER TABLE users ADD COLUMN questionnaire_updated_at DATETIME", cb))

    if (actions.length === 0) {
      console.log('Colunas de questionário já presentes. Nada a fazer.')
      process.exit(0)
    }

    // executar ações sequencialmente
    const runNext = () => {
      const fn = actions.shift()
      if (!fn) {
        console.log('Migração concluída com sucesso.')
        process.exit(0)
      }
      fn((e) => {
        if (e) {
          console.error('Erro na migração:', e)
          process.exit(1)
        }
        runNext()
      })
    }
    runNext()
  })
})
