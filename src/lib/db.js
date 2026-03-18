import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function initDB() {
  // Ưu tiên dùng đường dẫn từ biến môi trường (Railway Volume)
  // Nếu không có thì mới dùng file cục bộ ở thư mục gốc
  const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Tạo các bảng (giữ nguyên code cũ của bạn bên dưới)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT,
      role TEXT,
      patient_code TEXT
    );
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_code TEXT,
      week INTEGER,
      weight REAL,
      blood_pressure TEXT,
      symptoms TEXT
    );
  `);

  return db;
}