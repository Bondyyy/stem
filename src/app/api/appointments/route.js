// src/app/api/appointments/route.js

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getDb } from '@/lib/db';

// GET /api/appointments?patient_code=BNxxxx  hoặc  ?doctor_email=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get('patient_code');
    const doctorEmail = searchParams.get('doctor_email');

    if (!patientCode && !doctorEmail) {
      return NextResponse.json(
        { error: 'Thiếu tham số patient_code hoặc doctor_email.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    let appointments;

    if (patientCode) {
      appointments = await db.all(
        `SELECT id, patient_code, title, appointment_date, appointment_time, location, created_by, created_at
         FROM appointments WHERE patient_code = ?
         ORDER BY appointment_date ASC, appointment_time ASC`,
        patientCode
      );
    } else {
      appointments = await db.all(
        `SELECT id, patient_code, title, appointment_date, appointment_time, location, created_by, created_at
         FROM appointments WHERE created_by = ?
         ORDER BY appointment_date ASC, appointment_time ASC`,
        doctorEmail
      );
    }

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/appointments]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// POST /api/appointments
// Body: { patient_code, title, appointment_date, appointment_time, location, created_by }
export async function POST(request) {
  try {
    const { patient_code, title, appointment_date, appointment_time, location, created_by } =
      await request.json();

    if (!patient_code || !title || !appointment_date || !appointment_time || !created_by) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
    }

    const db = await getDb();

    try {
      await db.exec('BEGIN TRANSACTION');

      // Bảo mật: doctor chỉ được tạo lịch cho bệnh nhân trong danh sách quản lý
      const inList = await db.get(
        `SELECT id FROM doctor_patients WHERE doctor_email = ? AND patient_code = ?`,
        created_by, patient_code.trim().toUpperCase()
      );

      if (!inList) {
        await db.exec('ROLLBACK');
        return NextResponse.json(
          { error: 'Bệnh nhân không nằm trong danh sách quản lý của bạn.' },
          { status: 403 }
        );
      }

      // Kiểm tra trùng lịch cơ bản
      const duplicate = await db.get(
        `SELECT id FROM appointments WHERE patient_code = ? AND appointment_date = ? AND appointment_time = ?`,
        patient_code.trim().toUpperCase(), appointment_date, appointment_time
      );

      if (duplicate) {
        await db.exec('ROLLBACK');
        return NextResponse.json(
          { error: 'Bệnh nhân đã có lịch khám vào thời gian này.' },
          { status: 409 }
        );
      }

      const result = await db.run(
        `INSERT INTO appointments (patient_code, title, appointment_date, appointment_time, location, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        patient_code.trim().toUpperCase(), title.trim(),
        appointment_date, appointment_time, location?.trim() || null, created_by
      );

      const appt = await db.get(`SELECT * FROM appointments WHERE id = ?`, result.lastID);
      
      await db.exec('COMMIT');
      return NextResponse.json({ message: 'Đã tạo lịch khám thành công.', appointment: appt }, { status: 201 });
    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('[POST /api/appointments]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}
