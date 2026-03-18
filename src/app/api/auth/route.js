// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

function generatePatientCode() {
  return `BN${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request) {
  try {
    await initDb();
    const sql = getDb();
    const { action, email, password, role } = await request.json();

    if (!action || !email || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
    }

    if (action === 'register') {
      if (!role) return NextResponse.json({ error: 'Thiếu role.' }, { status: 400 });

      const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0)
        return NextResponse.json({ error: 'Email đã được sử dụng.' }, { status: 409 });

      let patientCode = null;
      if (role === 'mom') {
        let unique = false;
        while (!unique) {
          patientCode = generatePatientCode();
          const taken = await sql`SELECT id FROM users WHERE patient_code = ${patientCode}`;
          if (taken.length === 0) unique = true;
        }
      }

      const rows = await sql`
        INSERT INTO users (email, password, role, patient_code)
        VALUES (${email}, ${password}, ${role}, ${patientCode})
        RETURNING id, email, role, patient_code
      `;
      return NextResponse.json({ message: 'Đăng ký thành công.', user: rows[0] }, { status: 201 });
    }

    if (action === 'login') {
      const rows = await sql`
        SELECT id, email, role, patient_code FROM users
        WHERE email = ${email} AND password = ${password}
      `;
      if (rows.length === 0)
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
      return NextResponse.json({ message: 'Đăng nhập thành công.', user: rows[0] }, { status: 200 });
    }

    return NextResponse.json({ error: 'Action không hợp lệ.' }, { status: 400 });
  } catch (err) {
    console.error('[/api/auth]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}