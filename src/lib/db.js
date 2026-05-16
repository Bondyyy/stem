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
  // 1. Concurrency optimizations & foreign keys
  await db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
  `);

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

    CREATE TABLE IF NOT EXISTS otp_verifications (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      otp_code   TEXT    NOT NULL,
      expired_at INTEGER NOT NULL,
      verified   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS todos (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_code TEXT    NOT NULL,
      title        TEXT    NOT NULL,
      task_time    TEXT,
      task_date    TEXT,
      completed    INTEGER NOT NULL DEFAULT 0,
      created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS doctor_patients (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_email TEXT    NOT NULL,
      patient_code TEXT    NOT NULL,
      UNIQUE(doctor_email, patient_code)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_code     TEXT    NOT NULL,
      title            TEXT    NOT NULL,
      appointment_date TEXT    NOT NULL,
      appointment_time TEXT    NOT NULL,
      location         TEXT,
      created_by       TEXT    NOT NULL,
      created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS auth_attempts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL,
      action     TEXT    NOT NULL,
      ip         TEXT,
      success    INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS otp_requests (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL,
      ip         TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_patient_code ON users(patient_code) WHERE patient_code IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_doctor_patients ON doctor_patients(doctor_email, patient_code);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_records_patient_week ON records(patient_code, week);
    CREATE INDEX IF NOT EXISTS idx_todos_patient ON todos(patient_code);
    CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_code);
    CREATE INDEX IF NOT EXISTS idx_appointments_created_by ON appointments(created_by);
  `);

  await safeAddColumn(db, 'records', 'mood', 'TEXT');
  await safeAddColumn(db, 'records', 'fetal_movement', 'TEXT');
}

async function safeAddColumn(db, table, column, type) {
  try {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  } catch (err) {
    // column might already exist
  }
}