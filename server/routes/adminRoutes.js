const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { isAdmin } = require('../middleware/authMiddleware')
const {
    listUsers,
    getCheckinsCounts,
    toggleUserStatus,
    getDailyCheckins,
    getUserByUsername,
    listMealTemplates,
    createMealTemplate,
    deleteMealTemplate,
    getUsersWithoutFoodPlan,
    getInactiveUsers,
    deleteUser,
    db
} = require('../db')

// Middleware global para todas as rotas de admin
router.use(isAdmin)

// Listar usuários
router.get('/users', async (req, res) => {
    try {
        const users = await listUsers()
        const counts = await getCheckinsCounts()
        const countsMap = {}
        counts.forEach(c => { countsMap[c.username] = c.count })
        const data = users.map(u => ({
            ...u,
            checkinCount: countsMap[u.username] || 0
        }))
        res.json({ success: true, data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Atualizar status do usuário
router.put('/user/:username/status', async (req, res) => {
    try {
        const { username } = req.params
        const { is_active } = req.body
        await toggleUserStatus(username, is_active)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Obter contagem de check-ins (global)
router.get('/checkins', async (req, res) => {
    try {
        const counts = await getCheckinsCounts()
        res.json({ success: true, data: counts })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Obter check-ins de um usuário específico
router.get('/user/:username/checkins', async (req, res) => {
    try {
        const { username } = req.params
        const checkins = await getDailyCheckins(username)
        res.json({ success: true, data: checkins.map(c => c.check_in_date) })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Criar usuário admin
router.post('/create-user', async (req, res) => {
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
router.get('/meal-templates', async (req, res) => {
    try {
        const templates = await listMealTemplates()
        res.json({ success: true, data: templates })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/meal-templates', async (req, res) => {
    try {
        const { name, meal_type, items } = req.body
        const result = await createMealTemplate(name, meal_type, items)
        res.json({ success: true, data: { id: result.id, name, meal_type, items } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/meal-templates/:id', async (req, res) => {
    try {
        const result = await deleteMealTemplate(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Relatórios
router.get('/reports/no-food-plan', async (req, res) => {
    try {
        const users = await getUsersWithoutFoodPlan()
        res.json({ success: true, data: users })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/reports/inactive', async (req, res) => {
    try {
        const days = parseInt(req.query.days || '7')
        const users = await getInactiveUsers(days)
        res.json({ success: true, data: users })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Deletar usuário
router.delete('/user/:username', async (req, res) => {
    try {
        const { username } = req.params
        await deleteUser(username)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
