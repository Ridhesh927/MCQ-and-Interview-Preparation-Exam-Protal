const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = async () => {
    // 1. Connect without a specific database to recreate the test database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
    });

    console.log('\n[Test Setup] Dropping and recreating exam_portal_test...');
    await connection.query('DROP DATABASE IF EXISTS exam_portal_test');
    await connection.query('CREATE DATABASE exam_portal_test');
    await connection.end();

    // 2. Set environment to use the test database for the setup process
    process.env.DB_NAME = 'exam_portal_test';

    // 3. Initialize the schema using the existing db.js logic
    const { initDB, pool } = require('../src/config/db');
    await initDB();
    
    // Close pool so the setup process can exit cleanly
    await pool.end();
    console.log('[Test Setup] Database schema initialized.');
};
