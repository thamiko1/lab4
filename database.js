import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsername(username) {
    const [rows] = await pool.query(`
        SELECT username FROM account WHERE username = ?
    `, [username]);

    if (rows.length > 0) {
        return rows[0].username;
    }
    
    return null;
}

export async function getPassword(username) {
    const [rows] = await pool.query(`
        SELECT password FROM account WHERE username = ?
    `, [username]);

    if (rows.length > 0) {
        return rows[0].password;
    }
    
    return null;
}

export async function createUser(username, password) {
  await pool.query('INSERT INTO account (username, password) VALUES (?, ?)', [username, password]);
}
