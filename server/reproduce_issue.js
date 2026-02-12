
const { listUsers, db } = require('./db');

async function test() {
    try {
        console.log("Fetching users...");
        const users = await listUsers();
        if (users.length === 0) {
            console.log("No users found to test.");
            return;
        }

        const user = users[0];
        console.log("First user keys:", Object.keys(user));

        if (user.is_active === undefined) {
            console.error("FAIL: is_active is missing from user object!");
        } else {
            console.log("SUCCESS: is_active is present:", user.is_active);
        }
    } catch (e) {
        console.error(e);
    }
}

test();
