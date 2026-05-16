// src/app/api/otp/route.js

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import nodemailer from 'nodemailer';

const OTP_TTL_MS = 5 * 60 * 1000; // 5 phút

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

export async function POST(request) {
  try {
    const { action, email, otp_code } = await request.json();

    if (!action || !email) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
    }

    const db = await getDb();

    /* ─── SEND OTP ───────────────────────────────────────────────────── */
    if (action === 'send') {
      const otp       = generateOtp();
      const expiredAt = Date.now() + OTP_TTL_MS;

      // Upsert: overwrite nếu đã có OTP cũ
      await db.run(
        `INSERT INTO otp_verifications (email, otp_code, expired_at, verified)
         VALUES (?, ?, ?, 0)
         ON CONFLICT(email) DO UPDATE SET
           otp_code   = excluded.otp_code,
           expired_at = excluded.expired_at,
           verified   = 0`,
        email, otp, expiredAt
      );

      // Gửi email
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"MamaTrack 🌸" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Mã OTP xác thực MamaTrack',
        html: `
          <div style="font-family:'DM Sans',sans-serif;max-width:480px;margin:0 auto;padding:2rem;background:#fdf6f0;border-radius:1rem;">
            <h2 style="color:#c97070;font-family:serif;">🌸 MamaTrack</h2>
            <p style="color:#2d2420;font-size:1rem;">Mã OTP xác thực tài khoản của bạn là:</p>
            <div style="font-size:2.5rem;font-weight:700;letter-spacing:.4rem;color:#c97070;text-align:center;padding:1rem;background:#fff;border-radius:.75rem;margin:1rem 0;border:2px solid #e8a0a0;">
              ${otp}
            </div>
            <p style="color:#8a7570;font-size:.85rem;">Mã có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            <hr style="border:none;border-top:1px solid #ecdbd5;margin:1.5rem 0;">
            <p style="color:#c5ada7;font-size:.78rem;text-align:center;">Đây là email tự động từ MamaTrack. Vui lòng không trả lời email này.</p>
          </div>
        `,
      });

      return NextResponse.json({ message: 'Đã gửi mã OTP đến email của bạn.' }, { status: 200 });
    }

    /* ─── VERIFY OTP ─────────────────────────────────────────────────── */
    if (action === 'verify') {
      if (!otp_code) {
        return NextResponse.json({ error: 'Thiếu mã OTP.' }, { status: 400 });
      }

      const row = await db.get(
        `SELECT otp_code, expired_at, verified FROM otp_verifications WHERE email = ?`,
        email
      );

      if (!row) {
        return NextResponse.json({ error: 'Chưa có mã OTP. Vui lòng gửi lại.' }, { status: 400 });
      }
      if (Date.now() > row.expired_at) {
        return NextResponse.json({ error: 'Mã OTP đã hết hạn, vui lòng gửi lại.' }, { status: 400 });
      }
      if (row.otp_code !== otp_code.trim()) {
        return NextResponse.json({ error: 'Mã OTP không đúng.' }, { status: 400 });
      }

      // Cập nhật verified = 1
      await db.run(
        `UPDATE otp_verifications SET verified = 1 WHERE email = ?`,
        email
      );

      return NextResponse.json({ message: 'Xác thực OTP thành công.' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Action không hợp lệ.' }, { status: 400 });
  } catch (err) {
    console.error('[/api/otp]', err);
    return NextResponse.json({ error: 'Lỗi server nội bộ.' }, { status: 500 });
  }
}
