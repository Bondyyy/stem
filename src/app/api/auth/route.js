// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

function generatePatientCode() {
  return `BN${Math.floor(1000 + Math.random() * 9000)}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const db = await getDb();
    const { action, email, password, role, otp_code } = await request.json();

    if (!action || !email || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 });
    }

    /* ─── REGISTER ──────────────────────────────────────────────────── */
    if (action === 'register') {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' }, { status: 400 });
      }
      if (role !== 'mom' && role !== 'doctor') {
        return NextResponse.json({ error: 'Role không hợp lệ.' }, { status: 400 });
      }
      if (!otp_code) return NextResponse.json({ error: 'Thiếu mã OTP.' }, { status: 400 });

      try {
        await db.exec('BEGIN TRANSACTION');

        // 1. Verify OTP
        // Ensure table has otp_hash just in case
        try { await db.exec('ALTER TABLE otp_verifications ADD COLUMN otp_hash TEXT'); } catch(e) {}

        const otpRow = await db.get(
          `SELECT otp_code, otp_hash, expired_at, verified FROM otp_verifications WHERE email = ?`,
          email
        );

        if (!otpRow) {
          await db.exec('ROLLBACK');
          return NextResponse.json({ error: 'Chưa có mã OTP. Vui lòng gửi lại.' }, { status: 400 });
        }
        if (Date.now() > otpRow.expired_at) {
          await db.exec('ROLLBACK');
          return NextResponse.json({ error: 'Mã OTP đã hết hạn, vui lòng gửi lại.' }, { status: 400 });
        }

        let isOtpValid = false;
        if (otpRow.otp_hash) {
          isOtpValid = await bcrypt.compare(otp_code.trim(), otpRow.otp_hash);
        } else if (otpRow.otp_code) {
          isOtpValid = otpRow.otp_code === otp_code.trim();
        }

        if (!isOtpValid) {
          await db.exec('ROLLBACK');
          return NextResponse.json({ error: 'Mã OTP không đúng.' }, { status: 400 });
        }

        // 2. Check email not already registered
        const existing = await db.get(`SELECT id FROM users WHERE email = ?`, email);
        if (existing) {
          await db.exec('ROLLBACK');
          return NextResponse.json({ error: 'Email đã được sử dụng.' }, { status: 409 });
        }

        // 3. Generate patient_code for mom
        let patientCode = null;
        if (role === 'mom') {
          let unique = false;
          while (!unique) {
            patientCode = generatePatientCode();
            const taken = await db.get(`SELECT id FROM users WHERE patient_code = ?`, patientCode);
            if (!taken) unique = true;
          }
        }

        // 4. Insert user
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.run(
          `INSERT INTO users (email, password, role, patient_code) VALUES (?, ?, ?, ?)`,
          email, hashedPassword, role, patientCode
        );

        // 5. Delete OTP record
        await db.run(`DELETE FROM otp_verifications WHERE email = ?`, email);

        await db.exec('COMMIT');

        const newUser = await db.get(
          `SELECT id, email, role, patient_code FROM users WHERE email = ?`,
          email
        );
        return NextResponse.json({ message: 'Đăng ký thành công.', user: newUser }, { status: 201 });
      } catch (err) {
        await db.exec('ROLLBACK');
        throw err;
      }
    }

    /* ─── LOGIN ─────────────────────────────────────────────────────── */
    if (action === 'login') {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const fifteenMinsAgo = Math.floor((Date.now() - 15 * 60 * 1000) / 1000);
      const nowTs = Math.floor(Date.now() / 1000);

      // Check brute-force
      const attemptsCount = await db.get(
        `SELECT COUNT(id) as count FROM auth_attempts WHERE (email = ? OR ip = ?) AND success = 0 AND created_at > ?`,
        email, ip, fifteenMinsAgo
      );

      if (attemptsCount && attemptsCount.count >= 5) {
        return NextResponse.json({ error: 'Bạn đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' }, { status: 429 });
      }

      if (role !== 'mom' && role !== 'doctor') {
        return NextResponse.json({ error: 'Role không hợp lệ.' }, { status: 400 });
      }

      // Step 1: check user
      const user = await db.get(
        `SELECT id, email, password, role, patient_code FROM users WHERE email = ?`,
        email
      );

      if (!user) {
        await db.run(`INSERT INTO auth_attempts (email, action, ip, success, created_at) VALUES (?, 'login', ?, 0, ?)`, email, ip, nowTs);
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
      }

      // Step 2: verify password
      let passwordMatch = false;
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        passwordMatch = await bcrypt.compare(password, user.password);
      } else {
        // legacy plain text
        if (user.password === password) {
          passwordMatch = true;
          // Upgrade password immediately
          const hashedPassword = await bcrypt.hash(password, 12);
          await db.run(`UPDATE users SET password = ? WHERE id = ?`, hashedPassword, user.id);
        }
      }

      if (!passwordMatch) {
        await db.run(`INSERT INTO auth_attempts (email, action, ip, success, created_at) VALUES (?, 'login', ?, 0, ?)`, email, ip, nowTs);
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
      }

      // Step 3: check role matches
      if (user.role !== role) {
        await db.run(`INSERT INTO auth_attempts (email, action, ip, success, created_at) VALUES (?, 'login', ?, 0, ?)`, email, ip, nowTs);
        return NextResponse.json({ error: 'Bạn đã chọn sai vai trò đăng nhập.' }, { status: 403 });
      }

      // Step 4: Login success
      await db.run(`INSERT INTO auth_attempts (email, action, ip, success, created_at) VALUES (?, 'login', ?, 1, ?)`, email, ip, nowTs);
      await db.run(`DELETE FROM auth_attempts WHERE email = ? AND success = 0`, email); // clear failures

      delete user.password;
      return NextResponse.json({ message: 'Đăng nhập thành công.', user }, { status: 200 });
    }

    return NextResponse.json({ error: 'Action không hợp lệ.' }, { status: 400 });
  } catch (err) {
    console.error('[/api/auth]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}