const http = require('http');

const options = [
    { path: '/api/login', method: 'POST', body: JSON.stringify({ username: 'test', password: 'password' }) },
    { path: '/api/me?username=admin', method: 'GET' },
    { path: '/api/admin/users?username=admin', method: 'GET' },
    { path: '/api/daily-checkins/admin?username=admin', method: 'GET' }
];

async function runTests() {
    for (const opt of options) {
        const reqOptions = {
            hostname: 'localhost',
            port: 4000,
            path: opt.path,
            method: opt.method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`PATH: ${opt.path} | STATUS: ${res.statusCode} | BODY: ${data.substring(0, 100)}...`);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        if (opt.body) {
            req.write(opt.body);
        }
        req.end();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

runTests();
