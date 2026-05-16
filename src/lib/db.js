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
  `);
}