const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, 'data.sqlite')
const db = new sqlite3.Database(DB_PATH)

console.log('Verificando banco de dados...\n')

// Verificar usuários com plano alimentar
db.all(
  `SELECT username, food_plan, is_admin FROM users`,
  (err, rows) => {
    if (err) {
      console.error('Erro:', err)
      db.close()
      return
    }

    console.log('=== USUÁRIOS ===')
    rows.forEach(row => {
      console.log(`\nUsername: ${row.username} (Admin: ${row.is_admin})`)
      if (row.food_plan) {
        try {
          const plan = JSON.parse(row.food_plan)
          if (plan.days && plan.days.length > 0) {
            console.log(`  Plano salvo: ${plan.days.length} dias`)
            console.log(`  Primeiro dia: ${plan.days[0].day}`)
          } else {
            console.log('  Plano: vazio/formato inválido')
          }
        } catch (e) {
          console.log('  Erro ao parsear plano:', e.message)
        }
      } else {
        console.log('  Sem plano alimentar')
      }
    })

    // Verificar data atual
    console.log('\n=== DATA ATUAL ===')
    const now = new Date()
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    console.log(`Data: ${now.toLocaleString('pt-BR')}`)
    console.log(`Dia da semana (getDay): ${now.getDay()}`)
    console.log(`Nome do dia: ${weekDays[now.getDay()]}`)

    db.close()
  }
)
