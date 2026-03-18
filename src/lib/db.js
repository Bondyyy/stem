import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// Biến để lưu trữ kết nối database, tránh tạo nhiều kết nối thừa
let dbInstance = null;

export async function getDb() {
  // Nếu đã có kết nối rồi thì dùng lại luôn
  if (dbInstance) return dbInstance;

  // Xác định đường dẫn: Ưu tiên Volume trên Railway, nếu không có thì dùng file cục bộ
  const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');
  
  // Tự động tạo thư mục chứa database nếu chưa có (tránh lỗi trên Railway)
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Mở kết nối database
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Khởi tạo các bảng nếu chưa tồn tại
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
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

  return dbInstance;
}

// Export thêm alias initDB để các file cũ không bị lỗi
export const initDB = getDb;