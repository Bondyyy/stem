// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Sinh patient_code ngẫu nhiên, VD: "BN0472"
function generatePatientCode() {
  const digits = Math.floor(1000 + Math.random() * 9000); // 4 chữ số
  return `BN${digits}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, role } = body;

    if (!action || !email || !password) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (action, email, password).' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // ------------------------------------------------------------------ //
    //  ĐĂNG KÝ
    // ------------------------------------------------------------------ //
    if (action === 'register') {
      if (!role) {
        return NextResponse.json(
          { error: 'Thiếu trường role khi đăng ký.' },
          { status: 400 }
        );
      }

      // Kiểm tra email đã tồn tại chưa
      const existing = await db.get(
        'SELECT id FROM users WHERE email = ?',
        email
      );
      if (existing) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng.' },
          { status: 409 }
        );
      }

      // Chỉ sinh patient_code cho bà mẹ (role = 'mom')
      let patientCode = null;
      if (role === 'mom') {
        // Đảm bảo mã không trùng
        let isUnique = false;
        while (!isUnique) {
          patientCode = generatePatientCode();
          const taken = await db.get(
            'SELECT id FROM users WHERE patient_code = ?',
            patientCode
          );
          if (!taken) isUnique = true;
        }
      }

      const result = await db.run(
        `INSERT INTO users (email, password, role, patient_code)
         VALUES (?, ?, ?, ?)`,
        email,
        password,
        role,
        patientCode
      );

      const newUser = await db.get(
        'SELECT id, email, role, patient_code FROM users WHERE id = ?',
        result.lastID
      );

      return NextResponse.json(
        { message: 'Đăng ký thành công.', user: newUser },
        { status: 201 }
      );
    }

    // ------------------------------------------------------------------ //
    //  ĐĂNG NHẬP
    // ------------------------------------------------------------------ //
    if (action === 'login') {
      const user = await db.get(
        `SELECT id, email, role, patient_code
         FROM users
         WHERE email = ? AND password = ?`,
        email,
        password
      );

      if (!user) {
        return NextResponse.json(
          { error: 'Email hoặc mật khẩu không đúng.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { message: 'Đăng nhập thành công.', user },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------ //
    //  ACTION KHÔNG HỢP LỆ
    // ------------------------------------------------------------------ //
    return NextResponse.json(
      { error: `Action không hợp lệ: "${action}". Dùng "register" hoặc "login".` },
      { status: 400 }
    );

  } catch (err) {
    console.error('[/api/auth] Lỗi server:', err);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ.' },
      { status: 500 }
    );
  }
}