const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { getUserByUsername, createUser } = require('../db')

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body || {}
        if (!username || !password) return res.status(400).json({ error: 'username e password são obrigatórios' })

        const user = await getUserByUsername(username)
        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ error: 'Credenciais inválidas' })

        if (user.is_active === 0) return res.status(403).json({ error: 'Conta inativa. Contate o administrador.' })

        const { password: _p, ...userSafe } = user
        res.json({ success: true, user: userSafe, token: user.username })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// Rota de registro
router.post('/register', async (req, res) => {
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

module.exports = router
