// src/app/api/chat/route.js

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { message, records = [] } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Tin nhắn không được để trống.' }, { status: 400 });
    }

    // ── Tóm tắt lịch sử thai kỳ thành text ──
    const historyText = records.length > 0
      ? records.map(r =>
          `  • Tuần ${r.week}: cân nặng ${r.weight ?? '?'} kg, huyết áp ${r.blood_pressure ?? '?'}, triệu chứng: ${r.symptoms ?? 'không ghi nhận'}`
        ).join('\n')
      : '  (Chưa có dữ liệu thai kỳ nào được ghi nhận)';

    const latest      = records.at(-1);
    const latestWeek  = latest?.week     ?? 'chưa xác định';
    const latestSymp  = latest?.symptoms ?? 'không ghi nhận';

    // ── System prompt ──
    const systemInstruction = `Bạn là người bạn tâm giao ấm áp, thấu hiểu và luôn đồng hành cùng mẹ bầu.
Dưới đây là lịch sử thai kỳ của cô ấy:
${historyText}

Tuần gần nhất là tuần ${latestWeek}, triệu chứng gần nhất là "${latestSymp}".

Hãy dựa vào thông tin này để thấu hiểu hoàn cảnh, động viên tinh thần và trả lời câu hỏi của mẹ một cách chân thành, ấm áp, dùng ngôn ngữ gần gũi như người bạn thân.
Tuyệt đối không đưa ra lời khuyên y tế thay thế bác sĩ — nếu câu hỏi liên quan đến sức khỏe nghiêm trọng, hãy nhẹ nhàng khuyên mẹ tham khảo ý kiến bác sĩ.
Trả lời bằng tiếng Việt, ngắn gọn (không quá 200 từ), không dùng markdown hay ký tự đặc biệt.`;

    // ── Gọi Gemini ──
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
    });

    const result = await model.generateContent(message);
    const reply  = result.response.text();

    return NextResponse.json({ reply }, { status: 200 });

  } catch (err) {
    console.error('[POST /api/chat] Lỗi:', err);
    return NextResponse.json(
      { error: 'AI tạm thời không phản hồi được. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}