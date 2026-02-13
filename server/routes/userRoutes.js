const express = require('express')
const router = express.Router()
const {
    getUserByUsername,
    updateUserQuestionnaire,
    updateUserHealth,
    getUserQuestionnaire,
    updateUserFields,
    addDailyCheckin,
    getDailyCheckins,
    getDailyCheckinsForMonth,
    setUserFoodPlan,
    getUserFoodPlan
} = require('../db')

// Retorna dados do usuário (sem senha)
router.get('/me', async (req, res) => {
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

// Salvar ETAPA 2 (Saúde)
router.post('/save-health', async (req, res) => {
    try {
        const { username, answers } = req.body
        if (!username || !answers) return res.status(400).json({ error: 'Dados incompletos' })
        await updateUserHealth(username, answers)
        res.json({ success: true, message: 'Dados de saúde salvos!' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// Salvar ETAPA 1 (Dados Pessoais)
router.post('/save-questionnaire', async (req, res) => {
    try {
        const { username, answers } = req.body
        if (!username || !answers) return res.status(400).json({ error: 'Username e respostas são obrigatórios' })
        await updateUserQuestionnaire(username, answers)
        res.json({ success: true, message: 'Questionário salvo com sucesso!' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao salvar questionário' })
    }
})

// Salvar ou atualizar respostas do questionário
router.post('/questionnaire/user', async (req, res) => {
    try {
        const { username, questionnaireData } = req.body || {}
        if (!username || !questionnaireData) return res.status(400).json({ error: 'username e questionnaireData são obrigatórios' })
        await updateUserQuestionnaire(username, questionnaireData)
        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// Recuperar respostas do questionário
router.get('/questionnaire/user/:username', async (req, res) => {
    try {
        const { username } = req.params
        const data = await getUserQuestionnaire(username)
        res.json({ success: true, data: data || {} })
    } catch (err) {
        console.error('Erro ao recuperar questionário:', err)
        res.status(500).json({ error: err.message })
    }
})

// Adicionar daily check-in
router.post('/daily-checkin', async (req, res) => {
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
router.get('/daily-checkins/month/:username/:year/:month', async (req, res) => {
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

// Obter todos os check-ins
router.get('/daily-checkins/:username', async (req, res) => {
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
router.put('/user/:username', async (req, res) => {
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
router.put('/user/:username/foodplan', async (req, res) => {
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
router.get('/user/:username/foodplan', async (req, res) => {
    try {
        const target = req.params.username
        const plan = await getUserFoodPlan(target)
        res.json({ success: true, data: plan || {} })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
