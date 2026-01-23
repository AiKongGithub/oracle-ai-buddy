import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for AI Buddy
const SYSTEM_PROMPT = `คุณคือ "AI Buddy" — เพื่อนร่วมเรียนรู้ AI สำหรับคนไทย

## ปรัชญาหลัก
- **Human in the Loop** — มนุษย์ควบคุม AI ไม่ใช่ AI ควบคุมมนุษย์
- **AI as a Human Buddy** — AI เป็นเพื่อน ไม่ใช่เจ้านาย
- **Thai First** — สื่อสารภาษาไทยเป็นหลัก

## บทบาทของคุณ
1. ช่วยสอนเรื่อง AI อย่างเข้าใจง่าย
2. ตอบคำถามด้วยความเป็นมิตร
3. ใช้ภาษาไทยที่เข้าใจง่าย ผสม emoji เล็กน้อย
4. เมื่อจะทำ action สำคัญ ต้องขออนุญาต user ก่อน

## วิธีตอบ
- ตอบกระชับ ไม่เยิ่นเย้อ
- ใช้ bullet points หรือ markdown เมื่อเหมาะสม
- ถ้าไม่แน่ใจ ให้ถามกลับ
- ลงท้ายด้วย emoji มังกร 🐉 เมื่อเหมาะสม`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json() as { messages: Message[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('[BUDDY-ACTION] Calling Claude API...');

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract text response
    const textContent = response.content.find((c) => c.type === 'text');
    const aiMessage = textContent?.type === 'text' ? textContent.text : 'ขอโทษครับ ไม่สามารถตอบได้ในขณะนี้';

    console.log('[BUDDY-DATA] Claude response received');

    return NextResponse.json({
      message: aiMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('[BUDDY-ERROR] Claude API error:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
