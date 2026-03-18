// src/app/api/records/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/records?patient_code=BN1234 ──────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get('patient_code');

    if (!patientCode) {
      return NextResponse.json({ error: 'Thiếu tham số patient_code.' }, { status: 400 });
    }

    const db = await getDb();
    const records = await db.all(
      `SELECT id, patient_code, week, weight, blood_pressure, symptoms
       FROM records WHERE patient_code = ? ORDER BY week ASC`,
      patientCode
    );

    return NextResponse.json({ records }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// ── POST /api/records ─────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { patient_code, week, weight, blood_pressure, symptoms } = await request.json();

    if (!patient_code || week === undefined || week === null) {
      return NextResponse.json({ error: 'Thiếu patient_code hoặc week.' }, { status: 400 });
    }

    const db = await getDb();

    const row = await db.get(
      `SELECT MAX(week) AS max_week FROM records WHERE patient_code = ?`,
      patient_code
    );

    const maxWeek    = row?.max_week;
    const expected   = maxWeek === null || maxWeek === undefined ? 1 : maxWeek + 1;

    if (week !== expected) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đúng thứ tự tuần.', expected_week: expected, received_week: week },
        { status: 400 }
      );
    }

    const result = await db.run(
      `INSERT INTO records (patient_code, week, weight, blood_pressure, symptoms)
       VALUES (?, ?, ?, ?, ?)`,
      patient_code, week, weight ?? null, blood_pressure ?? null, symptoms ?? null
    );

    const newRecord = await db.get(
      `SELECT id, patient_code, week, weight, blood_pressure, symptoms FROM records WHERE id = ?`,
      result.lastID
    );

    return NextResponse.json({ message: 'Lưu thành công.', record: newRecord }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// ── PUT /api/records ──────────────────────────────────────────────────
// Body: { id, weight, blood_pressure, symptoms }
export async function PUT(request) {
  try {
    const { id, weight, blood_pressure, symptoms } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id bản ghi.' }, { status: 400 });
    }

    const db = await getDb();

    const existing = await db.get(`SELECT id FROM records WHERE id = ?`, id);
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy bản ghi.' }, { status: 404 });
    }

    await db.run(
      `UPDATE records SET weight = ?, blood_pressure = ?, symptoms = ? WHERE id = ?`,
      weight ?? null, blood_pressure ?? null, symptoms ?? null, id
    );

    const updated = await db.get(
      `SELECT id, patient_code, week, weight, blood_pressure, symptoms FROM records WHERE id = ?`,
      id
    );

    return NextResponse.json({ message: 'Cập nhật thành công.', record: updated }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// ── DELETE /api/records ───────────────────────────────────────────────
// Body: { id, patient_code, week }
export async function DELETE(request) {
  try {
    const { id, patient_code, week } = await request.json();

    if (!id || !patient_code || week === undefined) {
      return NextResponse.json({ error: 'Thiếu id, patient_code hoặc week.' }, { status: 400 });
    }

    const db = await getDb();

    // Kiểm tra tuần lớn nhất
    const row = await db.get(
      `SELECT MAX(week) AS max_week FROM records WHERE patient_code = ?`,
      patient_code
    );

    const maxWeek = row?.max_week;

    if (week < maxWeek) {
      return NextResponse.json(
        { error: 'Chỉ được phép xóa tuần thai gần nhất (tuần lớn nhất).' },
        { status: 400 }
      );
    }

    await db.run(`DELETE FROM records WHERE id = ?`, id);

    return NextResponse.json({ message: `Đã xóa tuần ${week} thành công.` }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}