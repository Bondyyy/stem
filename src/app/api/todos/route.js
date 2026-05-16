// src/app/api/todos/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/todos?patient_code=BNxxxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get('patient_code');

    if (!patientCode) {
      return NextResponse.json({ error: 'Thiếu tham số patient_code.' }, { status: 400 });
    }

    const db = await getDb();
    const todos = await db.all(
      `SELECT id, patient_code, title, task_time, task_date, completed, created_at
       FROM todos WHERE patient_code = ? ORDER BY task_date ASC, task_time ASC, created_at ASC`,
      patientCode
    );

    return NextResponse.json({ todos }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/todos]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// POST /api/todos  — tạo mới
export async function POST(request) {
  try {
    const { patient_code, title, task_time, task_date } = await request.json();

    if (!patient_code || !title) {
      return NextResponse.json({ error: 'Thiếu patient_code hoặc tên việc.' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO todos (patient_code, title, task_time, task_date, completed)
       VALUES (?, ?, ?, ?, 0)`,
      patient_code, title.trim(), task_time || null, task_date || null
    );

    const todo = await db.get(`SELECT * FROM todos WHERE id = ?`, result.lastID);
    return NextResponse.json({ message: 'Đã thêm việc cần làm.', todo }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/todos]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// PUT /api/todos  — sửa hoặc toggle completed
export async function PUT(request) {
  try {
    const { id, title, task_time, task_date, completed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id việc cần làm.' }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.get(`SELECT id FROM todos WHERE id = ?`, id);
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy việc cần làm.' }, { status: 404 });
    }

    // Nếu chỉ toggle completed
    if (completed !== undefined && title === undefined) {
      await db.run(`UPDATE todos SET completed = ? WHERE id = ?`, completed ? 1 : 0, id);
    } else {
      // Cập nhật đầy đủ
      await db.run(
        `UPDATE todos SET title = ?, task_time = ?, task_date = ? WHERE id = ?`,
        title?.trim(), task_time || null, task_date || null, id
      );
    }

    const updated = await db.get(`SELECT * FROM todos WHERE id = ?`, id);
    return NextResponse.json({ message: 'Đã cập nhật việc cần làm.', todo: updated }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/todos]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}

// DELETE /api/todos  — body: { id }
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id việc cần làm.' }, { status: 400 });
    }

    const db = await getDb();
    await db.run(`DELETE FROM todos WHERE id = ?`, id);
    return NextResponse.json({ message: 'Đã xóa việc cần làm.' }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/todos]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}
