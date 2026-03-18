// src/app/api/records/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get('patient_code');
    if (!patientCode)
      return NextResponse.json({ error: 'Thiếu patient_code.' }, { status: 400 });

    const sql = getDb();
    const records = await sql`
      SELECT id, patient_code, week, weight, blood_pressure, symptoms
      FROM records WHERE patient_code = ${patientCode} ORDER BY week ASC
    `;
    return NextResponse.json({ records }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { patient_code, week, weight, blood_pressure, symptoms } = await request.json();
    if (!patient_code || week == null)
      return NextResponse.json({ error: 'Thiếu patient_code hoặc week.' }, { status: 400 });

    const sql = getDb();
    const maxRow = await sql`SELECT MAX(week) AS max_week FROM records WHERE patient_code = ${patient_code}`;
    const maxWeek  = maxRow[0].max_week;
    const expected = maxWeek == null ? 1 : maxWeek + 1;

    if (week !== expected)
      return NextResponse.json(
        { error: 'Vui lòng nhập đúng thứ tự tuần.', expected_week: expected, received_week: week },
        { status: 400 }
      );

    const rows = await sql`
      INSERT INTO records (patient_code, week, weight, blood_pressure, symptoms)
      VALUES (${patient_code}, ${week}, ${weight ?? null}, ${blood_pressure ?? null}, ${symptoms ?? null})
      RETURNING id, patient_code, week, weight, blood_pressure, symptoms
    `;
    return NextResponse.json({ message: 'Lưu thành công.', record: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, weight, blood_pressure, symptoms } = await request.json();
    if (!id) return NextResponse.json({ error: 'Thiếu id.' }, { status: 400 });

    const sql = getDb();
    const existing = await sql`SELECT id FROM records WHERE id = ${id}`;
    if (existing.length === 0)
      return NextResponse.json({ error: 'Không tìm thấy bản ghi.' }, { status: 404 });

    const rows = await sql`
      UPDATE records
      SET weight = ${weight ?? null}, blood_pressure = ${blood_pressure ?? null}, symptoms = ${symptoms ?? null}
      WHERE id = ${id}
      RETURNING id, patient_code, week, weight, blood_pressure, symptoms
    `;
    return NextResponse.json({ message: 'Cập nhật thành công.', record: rows[0] }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id, patient_code, week } = await request.json();
    if (!id || !patient_code || week == null)
      return NextResponse.json({ error: 'Thiếu id, patient_code hoặc week.' }, { status: 400 });

    const sql = getDb();
    const maxRow = await sql`SELECT MAX(week) AS max_week FROM records WHERE patient_code = ${patient_code}`;
    const maxWeek = maxRow[0].max_week;

    if (week < maxWeek)
      return NextResponse.json(
        { error: 'Chỉ được phép xóa tuần thai gần nhất (tuần lớn nhất).' },
        { status: 400 }
      );

    await sql`DELETE FROM records WHERE id = ${id}`;
    return NextResponse.json({ message: `Đã xóa tuần ${week}.` }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/records]', err);
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 });
  }
}