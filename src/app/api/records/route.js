// src/app/api/records/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ------------------------------------------------------------------ //
//  GET /api/records?patient_code=BN1234
// ------------------------------------------------------------------ //
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get('patient_code');

    if (!patientCode) {
      return NextResponse.json(
        { error: 'Thiếu tham số patient_code.' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const records = await db.all(
      `SELECT id, patient_code, week, weight, blood_pressure, symptoms
       FROM records
       WHERE patient_code = ?
       ORDER BY week ASC`,
      patientCode
    );

    return NextResponse.json({ records }, { status: 200 });

  } catch (err) {
    console.error('[GET /api/records] Lỗi server:', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// ------------------------------------------------------------------ //
//  POST /api/records
//  Body: { patient_code, week, weight, blood_pressure, symptoms }
// ------------------------------------------------------------------ //
export async function POST(request) {
  try {
    const body = await request.json();
    const { patient_code, week, weight, blood_pressure, symptoms } = body;

    // --- Kiểm tra các trường bắt buộc ---
    if (!patient_code || week === undefined || week === null) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (patient_code, week).' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // --- Lấy tuần lớn nhất hiện tại của bệnh nhân ---
    const row = await db.get(
      `SELECT MAX(week) AS max_week FROM records WHERE patient_code = ?`,
      patient_code
    );

    const maxWeek = row?.max_week; // null nếu chưa có bản ghi nào

    // --- Xác định tuần hợp lệ tiếp theo ---
    // Lần đầu tiên (chưa có bản ghi) → tuần hợp lệ là 1
    // Đã có bản ghi          → tuần hợp lệ là maxWeek + 1
    const expectedWeek = maxWeek === null || maxWeek === undefined ? 1 : maxWeek + 1;

    if (week !== expectedWeek) {
      return NextResponse.json(
        {
          error: 'Vui lòng nhập đúng thứ tự tuần.',
          expected_week: expectedWeek,
          received_week: week,
        },
        { status: 400 }
      );
    }

    // --- INSERT bản ghi mới ---
    const result = await db.run(
      `INSERT INTO records (patient_code, week, weight, blood_pressure, symptoms)
       VALUES (?, ?, ?, ?, ?)`,
      patient_code,
      week,
      weight ?? null,
      blood_pressure ?? null,
      symptoms ?? null
    );

    const newRecord = await db.get(
      `SELECT id, patient_code, week, weight, blood_pressure, symptoms
       FROM records WHERE id = ?`,
      result.lastID
    );

    return NextResponse.json(
      { message: 'Lưu dữ liệu thai kỳ thành công.', record: newRecord },
      { status: 201 }
    );

  } catch (err) {
    console.error('[POST /api/records] Lỗi server:', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}