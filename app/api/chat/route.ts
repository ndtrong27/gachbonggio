import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || 'https://duytrong.app.n8n.cloud/webhook/gach-bong-gio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = '',
      name = 'Khách hàng',
      phone = '',
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Nội dung tin nhắn không được để trống' }, { status: 400 });
    }

    const trimmedMsg = message.trim();
    let botReply = '';

    // 1. Forward request to n8n Webhook
    try {
      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMsg,
          name: name.trim() || 'Khách hàng',
          phone: phone.trim() || '',
          sessionId: sessionId,
        }),
      });

      if (n8nRes.ok) {
        const data = await n8nRes.json();
        if (typeof data === 'string') {
          botReply = data;
        } else if (data?.reply) {
          botReply = data.reply;
        } else if (data?.output) {
          botReply = data.output;
        } else if (data?.message) {
          botReply = data.message;
        } else if (data?.text) {
          botReply = data.text;
        } else if (Array.isArray(data) && data[0]?.reply) {
          botReply = data[0].reply;
        } else if (Array.isArray(data) && data[0]?.output) {
          botReply = data[0].output;
        } else {
          botReply = JSON.stringify(data);
        }
      } else {
        console.warn(`[API /chat] n8n returned status ${n8nRes.status}`);
      }
    } catch (n8nErr) {
      console.error('[API /chat] Lỗi kết nối n8n webhook:', n8nErr);
    }

    if (!botReply) {
      botReply = 'Dạ em chào Quý khách! Em đã ghi nhận yêu cầu tư vấn gạch bông gió của mình. Kỹ thuật viên Vĩnh Cửu Sài Gòn sẽ liên hệ lại qua số điện thoại hoặc Zalo 0909.177.415 để báo giá chi tiết và tư vấn mẫu ngay nhé ạ!';
    }

    // 2. Log conversation into Supabase table ai_chat_logs
    let logId = null;
    try {
      const { data: insertedLog, error: dbError } = await supabase
        .from('ai_chat_logs')
        .insert({
          session_id: sessionId,
          customer_name: name.trim() || 'Khách hàng',
          customer_phone: phone.trim() || '',
          user_message: trimmedMsg,
          bot_response: botReply,
        })
        .select('id')
        .single();

      if (!dbError && insertedLog) {
        logId = insertedLog.id;
      } else if (dbError) {
        console.error('[API /chat] Lỗi lưu log vào Supabase:', dbError);
      }
    } catch (logErr) {
      console.error('[API /chat] Exception khi lưu Supabase:', logErr);
    }

    return NextResponse.json({
      reply: botReply,
      logId,
      sessionId,
    });
  } catch (error) {
    console.error('[API /chat] Exception:', error);
    return NextResponse.json(
      {
        reply: 'Dạ hệ thống tư vấn trực tiếp đang xử lý nhiều lượt hỏi. Quý khách vui lòng để lại số điện thoại hoặc nhắn tin nhanh qua Zalo 0909.177.415 để kỹ thuật viên phản hồi ngay trong 5 phút nhé!',
      },
      { status: 500 }
    );
  }
}
