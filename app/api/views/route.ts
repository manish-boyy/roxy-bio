import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'views.json');

function getViews() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
            const data = JSON.parse(fileContent);
            return data.views || 0;
        }
    } catch (e) {
        console.error("Error reading views file:", e);
    }
    return 0;
}

function saveViews(views: number) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify({ views }));
    } catch (e) {
        console.error("Error writing views file:", e);
    }
}

export async function GET() {
    const views = getViews();
    return NextResponse.json({ views });
}

export async function POST() {
    let views = getViews();
    views++;
    saveViews(views);
    return NextResponse.json({ views });
}
