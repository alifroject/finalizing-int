// app/api/moderate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Stored in .env.local
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', 
      messages: [
        {
          role: 'system',
         content: `You're a multilingual message safety filter. Understand all languages. Only return one word: "allow" or "block" based on whether the message contains hate speech, bias, or private personal data — regardless of language.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0,
    }),
  });

  const data = await openaiRes.json();
  const decision = data.choices?.[0]?.message?.content?.toLowerCase() ?? 'allow';

  return NextResponse.json({ decision });
}
