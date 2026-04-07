// Try common MySQL passwords
const mysql = require('mysql2/promise');

const commonPasswords = [
  '',           // empty password
  'root',
  'password',
  'admin',
  '123456',
  '269016',
  'mysql',
  'toor',
];

async function tryPassword(password) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: password,
    });
    await connection.end();
    return true;
  } catch (error) {
    return false;
  }
}

async function findPassword() {
  console.log('Trying common passwords for root user...\n');
  
  for (const pwd of commonPasswords) {
    const display = pwd === '' ? '(empty)' : pwd;
    process.stdout.write(`Trying password: ${display}... `);
    
    const success = await tryPassword(pwd);
    if (success) {
      console.log('✓ SUCCESS!');
      console.log(`\nFound working password: ${display}`);
      console.log('\nUpdate your .env.local with:');
      console.log(`DB_PASSWORD=${pwd}`);
      return;
    } else {
      console.log('✗ failed');
    }
  }
  
  console.log('\n❌ None of the common passwords worked.');
  console.log('\nYou need to reset your MySQL root password.');
  console.log('See: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html');
}

findPassword();
