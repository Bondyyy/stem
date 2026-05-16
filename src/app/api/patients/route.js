// src/app/api/patients/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/patients?doctor_email=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorEmail = searchParams.get('doctor_email');

    if (!doctorEmail) {
      return NextResponse.json({ error: 'Thiếu tham số doctor_email.' }, { status: 400 });
    }

    const db = await getDb();
    const patients = await db.all(
      `SELECT dp.id, dp.patient_code, u.email AS patient_email
       FROM doctor_patients dp
       LEFT JOIN users u ON u.patient_code = dp.patient_code
       WHERE dp.doctor_email = ?
       ORDER BY dp.id ASC`,
      doctorEmail
    );

    return NextResponse.json({ patients }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/patients]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// POST /api/patients  — body: { doctor_email, patient_code }
export async function POST(request) {
  try {
    const { doctor_email, patient_code } = await request.json();

    if (!doctor_email || !patient_code) {
      return NextResponse.json({ error: 'Thiếu doctor_email hoặc patient_code.' }, { status: 400 });
    }

    const db = await getDb();

    // Kiểm tra bệnh nhân tồn tại với role = 'mom'
    const patientUser = await db.get(
      `SELECT id FROM users WHERE patient_code = ? AND role = 'mom'`,
      patient_code.trim().toUpperCase()
    );

    if (!patientUser) {
      return NextResponse.json({ error: 'Không tìm thấy mã bệnh nhân.' }, { status: 404 });
    }

    // Thêm vào danh sách, UNIQUE constraint xử lý trùng lặp
    try {
      await db.run(
        `INSERT INTO doctor_patients (doctor_email, patient_code) VALUES (?, ?)`,
        doctor_email, patient_code.trim().toUpperCase()
      );
    } catch (constraintErr) {
      if (constraintErr.message?.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'Bệnh nhân này đã nằm trong danh sách quản lý.' },
          { status: 409 }
        );
      }
      throw constraintErr;
    }

    return NextResponse.json({ message: 'Đã thêm bệnh nhân vào danh sách quản lý.' }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/patients]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// DELETE /api/patients  — body: { doctor_email, patient_code }
export async function DELETE(request) {
  try {
    const { doctor_email, patient_code } = await request.json();

    if (!doctor_email || !patient_code) {
      return NextResponse.json({ error: 'Thiếu doctor_email hoặc patient_code.' }, { status: 400 });
    }

    const db = await getDb();
    await db.run(
      `DELETE FROM doctor_patients WHERE doctor_email = ? AND patient_code = ?`,
      doctor_email, patient_code
    );

    return NextResponse.json({ message: 'Đã xóa bệnh nhân khỏi danh sách quản lý.' }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/patients]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}
