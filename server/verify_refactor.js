const fetch = require('node-fetch')

const API_URL = 'http://localhost:4000/api'

async function test() {
    console.log('Testing routes...')

    const endpoints = [
        { name: 'Login (POST)', url: '/login', method: 'POST', body: {} },
        { name: 'Me (GET)', url: '/me?username=test', method: 'GET' },
        { name: 'Admin Users (GET)', url: '/admin/users?username=admin', method: 'GET' }
    ]

    for (const ep of endpoints) {
        try {
            const res = await fetch(`${API_URL}${ep.url}`, {
                method: ep.method,
                headers: { 'Content-Type': 'application/json' },
                body: ep.method === 'POST' ? JSON.stringify(ep.body) : undefined
            })
            console.log(`${ep.name}: ${res.status} ${res.statusText}`)
        } catch (err) {
            console.error(`${ep.name}: Error - ${err.message}`)
        }
    }
}

test()
