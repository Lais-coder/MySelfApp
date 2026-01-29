const { init, createUser } = require('./db')
const bcrypt = require('bcryptjs')

async function run() {
  try {
    init()
    const username = process.env.TEST_USERNAME || 'testuser'
    const email = process.env.TEST_EMAIL || 'testuser@example.com'
    const password = process.env.TEST_PASSWORD || 'Test@1234'

    const hash = await bcrypt.hash(password, 10)
    const res = await createUser(username, email, hash)
    console.log('Usuário criado:', { id: res.id, username, email, password })
  } catch (err) {
    console.error('Erro criando usuário de teste:', err.message)
  }
}

run()
