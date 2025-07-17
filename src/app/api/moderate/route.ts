import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const res = await fetch('http://127.0.0.1:8000/moderate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            console.error('FastAPI responded with:', res.status, await res.text());
            return NextResponse.json({ error: 'FastAPI error' }, { status: 500 });
        }

        const data = await res.json();
        const decision = data?.decision ?? 'allow';

        return NextResponse.json({ decision });

    } catch (error) {
        console.error('Next.js API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
