// db.js - Conexiune MySQL prin XAMPP
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'montaj_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test conexiune la pornire
pool.getConnection()
    .then(conn => {
        console.log('✅ Conectat la MySQL (XAMPP)');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Eroare conexiune MySQL:', err.message);
    });

module.exports = pool;