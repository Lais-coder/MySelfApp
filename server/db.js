const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')

// ensure folder exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new sqlite3.Database(DB_PATH)

// Create table if not exists
const init = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        data JSON,
        files JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT,
        questionnaire_data JSON,
        questionnaire_updated_at DATETIME,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS daily_checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        check_in_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(username, check_in_date),
        FOREIGN KEY(username) REFERENCES users(username)
      )
    `)
  })
}

const insertSubmission = (name, email, dataObj, filesObj) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO submissions (name, email, data, files) VALUES (?, ?, ?, ?)')
    stmt.run(name || null, email || null, JSON.stringify(dataObj || {}), JSON.stringify(filesObj || {}), function (err) {
      if (err) return reject(err)
      resolve({ id: this.lastID })
    })
  })
}

const listSubmissions = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM submissions ORDER BY created_at DESC', (err, rows) => {
      if (err) return reject(err)
      resolve(rows.map(r => ({ ...r, data: JSON.parse(r.data || '{}'), files: JSON.parse(r.files || '{}') })))
    })
  })
}

const createUser = (username, email, passwordHash) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
    stmt.run(username, email || null, passwordHash, function (err) {
      if (err) return reject(err)
      resolve({ id: this.lastID })
    })
  })
}

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })
}

const updateUserQuestionnaire = (username, questionnaireData) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE users SET questionnaire_data = ?, questionnaire_updated_at = CURRENT_TIMESTAMP WHERE username = ?')
    stmt.run(JSON.stringify(questionnaireData), username, function (err) {
      if (err) return reject(err)
      resolve({ success: true })
    })
  })
}

const setUserFoodPlan = (username, planObj) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE users SET food_plan = ? WHERE username = ?')
    stmt.run(JSON.stringify(planObj || {}), username, function (err) {
      if (err) return reject(err)
      resolve({ success: true })
    })
  })
}

const getUserFoodPlan = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT food_plan FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err)
      if (!row) return resolve(null)
      try {
        resolve(JSON.parse(row.food_plan || '{}'))
      } catch (e) {
        resolve({})
      }
    })
  })
}

const getUserQuestionnaire = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT questionnaire_data FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err)
      if (!row) return resolve(null)
      resolve(JSON.parse(row.questionnaire_data || '{}'))
    })
  })
}

const updateUserFields = (username, fields) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Recupera usuário atual
      db.get('SELECT questionnaire_data, email FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return reject(err)
        if (!row) return reject(new Error('Usuário não encontrado'))

        let questionnaire = {}
        try {
          questionnaire = JSON.parse(row.questionnaire_data || '{}')
        } catch (e) {
          questionnaire = {}
        }

        // Campos possíveis: email (se enviado) e outros que serão mesclados no questionnaire
        const email = fields.email || row.email || null
        const mergedQuestionnaire = { ...questionnaire, ...(fields.questionnaire || {}), ...fields }
        // Remove email do objeto questionnaire se presente
        delete mergedQuestionnaire.email

        const stmt = db.prepare('UPDATE users SET questionnaire_data = ?, questionnaire_updated_at = CURRENT_TIMESTAMP, email = ? WHERE username = ?')
        stmt.run(JSON.stringify(mergedQuestionnaire), email, username, function (uerr) {
          if (uerr) return reject(uerr)
          resolve({ success: true })
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

const listUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, email, questionnaire_data, questionnaire_updated_at, is_admin, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) return reject(err)
      const parsed = rows.map(r => ({ ...r, questionnaire_data: JSON.parse(r.questionnaire_data || '{}') }))
      resolve(parsed)
    })
  })
}

const getCheckinsCounts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT username, COUNT(*) as count FROM daily_checkins GROUP BY username', (err, rows) => {
      if (err) return reject(err)
      resolve(rows || [])
    })
  })
}

const addDailyCheckin = (username, date) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO daily_checkins (username, check_in_date) VALUES (?, ?)')
    stmt.run(username, date, function (err) {
      if (err) return reject(err)
      resolve({ success: true, isNew: this.changes > 0 })
    })
  })
}

const getDailyCheckins = (username) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT check_in_date FROM daily_checkins WHERE username = ? ORDER BY check_in_date DESC', [username], (err, rows) => {
      if (err) return reject(err)
      resolve(rows || [])
    })
  })
}

const getDailyCheckinsForMonth = (username, year, month) => {
  return new Promise((resolve, reject) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`
    
    db.all(
      'SELECT check_in_date FROM daily_checkins WHERE username = ? AND check_in_date >= ? AND check_in_date < ? ORDER BY check_in_date',
      [username, startDate, endDate],
      (err, rows) => {
        if (err) return reject(err)
        resolve(rows || [])
      }
    )
  })
}

module.exports = {
  db,
  init,
  insertSubmission,
  listSubmissions,
  createUser,
  getUserByUsername,
  updateUserQuestionnaire,
  getUserQuestionnaire,
  updateUserFields,
  listUsers,
  getCheckinsCounts,
  addDailyCheckin,
  getDailyCheckins,
  getDailyCheckinsForMonth,
  setUserFoodPlan,
  getUserFoodPlan
}
