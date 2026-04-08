// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host:'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.fmshooyjcmbsuuzjoefi',
  password: 'Sv4wkNkuy5,+u.?',
  ssl: {
    rejectUnauthorized: false
  }
});

export { pool };