# MySQL Database Setup Guide

## Prerequisites

- MySQL Server installed (XAMPP, MySQL Community Server, or Docker)
- Node.js and npm installed

## Step 1: Create Database

Connect to your MySQL server and run the SQL script:

```bash
mysql -u root -p < database.sql
```

Or manually execute the SQL commands in `database.sql` using phpMyAdmin or MySQL Workbench.

## Step 2: Configure Environment Variables

1. Copy the `.env.local` file and update with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=social_media_db
```

2. Make sure `.env.local` is in your `.gitignore` (already configured)

## Step 3: Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Testing the Application

1. Visit `http://localhost:3000/register`
2. Create an account with username and password
3. Set a nickname
4. Login at `http://localhost:3000/login`

## Database Schema

### users table

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| id         | INT          | Primary key (auto-increment)   |
| account    | VARCHAR(50)  | Unique username                |
| pin_hash   | VARCHAR(255) | Bcrypt hashed password         |
| nickname   | VARCHAR(100) | Display name                   |
| created_at | TIMESTAMP    | Account creation timestamp     |

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- Never commit `.env.local` to version control
- Use strong passwords for production databases
- Consider adding JWT or session management for production
