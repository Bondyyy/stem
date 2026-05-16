// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

function generatePatientCode() {
  return `BN${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request) {
  try {
    const db = await getDb();
    const { action, email, password, role, otp_code } = await request.json();

    if (!action || !email || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
    }

    /* ─── REGISTER ──────────────────────────────────────────────────── */
    if (action === 'register') {
      if (!role) return NextResponse.json({ error: 'Thiếu role.' }, { status: 400 });
      if (!otp_code) return NextResponse.json({ error: 'Thiếu mã OTP.' }, { status: 400 });

      // 1. Verify OTP
      const otpRow = await db.get(
        `SELECT otp_code, expired_at, verified FROM otp_verifications WHERE email = ?`,
        email
      );

      if (!otpRow) {
        return NextResponse.json({ error: 'Chưa có mã OTP. Vui lòng gửi lại.' }, { status: 400 });
      }
      if (Date.now() > otpRow.expired_at) {
        return NextResponse.json({ error: 'Mã OTP đã hết hạn, vui lòng gửi lại.' }, { status: 400 });
      }
      if (otpRow.otp_code !== otp_code.trim()) {
        return NextResponse.json({ error: 'Mã OTP không đúng.' }, { status: 400 });
      }

      // 2. Check email not already registered
      const existing = await db.get(`SELECT id FROM users WHERE email = ?`, email);
      if (existing) {
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
      await db.run(
        `INSERT INTO users (email, password, role, patient_code) VALUES (?, ?, ?, ?)`,
        email, password, role, patientCode
      );

      // 5. Delete OTP record
      await db.run(`DELETE FROM otp_verifications WHERE email = ?`, email);

      const newUser = await db.get(
        `SELECT id, email, role, patient_code FROM users WHERE email = ?`,
        email
      );
      return NextResponse.json({ message: 'Đăng ký thành công.', user: newUser }, { status: 201 });
    }

    /* ─── LOGIN ─────────────────────────────────────────────────────── */
    if (action === 'login') {
      if (!role) return NextResponse.json({ error: 'Thiếu role.' }, { status: 400 });

      // Step 1: check email + password
      const user = await db.get(
        `SELECT id, email, role, patient_code FROM users WHERE email = ? AND password = ?`,
        email, password
      );

      if (!user) {
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
      }

      // Step 2: check role matches
      if (user.role !== role) {
        return NextResponse.json({ error: 'Bạn đã chọn sai vai trò đăng nhập.' }, { status: 403 });
      }

      return NextResponse.json({ message: 'Đăng nhập thành công.', user }, { status: 200 });
    }

    return NextResponse.json({ error: 'Action không hợp lệ.' }, { status: 400 });
  } catch (err) {
    console.error('[/api/auth]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}