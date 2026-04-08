// Test database connection
// Run with: node scripts/test-db-connection.js

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✓ Connected to database successfully!');
    
    // Test query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`✓ Users table exists. Current user count: ${rows[0].count}`);
    
    await connection.end();
    console.log('✓ Connection closed');
    
  } catch (error) {
    console.error('✗ Database connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
