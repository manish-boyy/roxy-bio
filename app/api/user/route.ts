import { NextResponse } from 'next/server';
import { config } from '@/config';

// Proxy route to fetch Discord data from HTTP source to avoid Mixed Content errors
export async function GET() {
    try {
        const url = `http://fi1.bot-hosting.net:5945/api/${config.discordId}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            next: { revalidate: 10 } // Cache for 10 seconds
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch from source: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
