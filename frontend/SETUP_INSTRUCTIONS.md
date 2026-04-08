# Database Setup Instructions

## Step 1: Create MySQL User and Database

You need to run the `setup-user.sql` script as the MySQL root user. Try these methods:

### Method 1: Using MySQL Command Line (Recommended)

```bash
mysql -u root -p < setup-user.sql
```

When prompted, enter your MySQL root password.

### Method 2: Using phpMyAdmin (if using XAMPP)

1. Open phpMyAdmin in your browser (usually http://localhost/phpmyadmin)
2. Click on "SQL" tab
3. Copy and paste the contents of `setup-user.sql`
4. Click "Go" to execute

### Method 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `setup-user.sql` file
4. Execute the script

## Step 2: Verify the Setup

After creating the user, test the connection:

```bash
node scripts/test-db-connection.js
```

You should see:
```
✓ Connected to database successfully!
✓ Users table exists. Current user count: 0
✓ Connection closed
```

## Step 3: Start the Application

```bash
npm run dev
```

Visit http://localhost:3000 and test registration and login.

## New Database Credentials

- **User**: social_media_user
- **Password**: 123456
- **Database**: social_media_db
- **Host**: localhost
- **Port**: 3306

These credentials are configured in `.env.local` file.
