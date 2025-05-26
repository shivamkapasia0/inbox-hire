import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file content
    const fileContent = await file.text();
    
    // Validate JSON format
    try {
      JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Write to emails.json
    const dataPath = path.join(process.cwd(), 'src/data/emails.json');
    await fs.writeFile(dataPath, fileContent, 'utf8');

    return NextResponse.json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
} 