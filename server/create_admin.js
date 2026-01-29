const bcrypt = require('bcryptjs')
const { db, getUserByUsername, createUser } = require('./db')

async function createOrUpdateAdmin(username, password, email) {
  if (!username || !password) {
    console.error('Uso: node create_admin.js <username> <password> [email]')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 10)

  // Verifica se já existe
  getUserByUsername(username).then(user => {
    if (user) {
      // Atualiza senha e marca como admin
      db.run('UPDATE users SET password = ?, email = ?, is_admin = 1 WHERE username = ?', [hashed, email || user.email || null, username], function (err) {
        if (err) return console.error('Erro ao atualizar usuário:', err)
        console.log(`Usuário existente '${username}' atualizado e marcado como admin.`)
        process.exit(0)
      })
    } else {
      // Insere novo usuário com is_admin = 1
      const stmt = db.prepare('INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 1)')
      stmt.run(username, email || null, hashed, function (err) {
        if (err) return console.error('Erro ao criar usuário admin:', err)
        console.log(`Usuário admin '${username}' criado com sucesso.`)
        process.exit(0)
      })
    }
  }).catch(err => {
    console.error('Erro ao consultar usuário:', err)
    process.exit(1)
  })
}

const [, , username, password, email] = process.argv
createOrUpdateAdmin(username, password, email)
