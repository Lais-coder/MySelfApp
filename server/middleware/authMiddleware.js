const { getUserByUsername } = require('../db')

async function isAdmin(req, res, next) {
    try {
        const username = req.query.username || req.body.username || req.headers['x-username']
        if (!username) return res.status(401).json({ error: 'username é obrigatório para verificação de admin' })

        const user = await getUserByUsername(username)
        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

        if (user.is_admin && Number(user.is_admin) === 1) return next()
        return res.status(403).json({ error: 'Acesso negado: requer privilégios de administrador' })
    } catch (err) {
        console.error('Erro no middleware isAdmin:', err)
        return res.status(500).json({ error: 'Erro interno' })
    }
}

module.exports = { isAdmin }
