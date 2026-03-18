// src/lib/db.js

import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

let db = null;

export async function getDb() {
  if (db) return db;

  db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  await initDb(db);
  return db;
}

async function initDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      email        TEXT    NOT NULL UNIQUE,
      password     TEXT    NOT NULL,
      role         TEXT    NOT NULL,
      patient_code TEXT
    );

    CREATE TABLE IF NOT EXISTS records (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_code   TEXT    NOT NULL,
      week           INTEGER,
      weight         REAL,
      blood_pressure TEXT,
      symptoms       TEXT
    );
  `);
}