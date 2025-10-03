import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'

const __dirname = import.meta.dirname

const initializeTestDb = async () => {
    try {
        const sql = fs.readFileSync(path.resolve(__dirname, '../test_moviemachine.sql'), 'utf8')
        await pool.query(sql)
        console.log('Test database initialized successfully')
    } catch (error) {
        console.error('Error initializing test database:', error)
    }
}

//Add user before running login test.
const insertTestUser = async (user) => {
    try {
        const hashedPassword = await hash(user.password, 10)

        await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [user.username, hashedPassword, user.email]);

        console.log('Test user inserted successfully')
    } catch (error) {
        console.error('Error inserting test user:', error)
    }
}

//simply create a token with passed email.
const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET)
}

export { initializeTestDb, insertTestUser, getToken }