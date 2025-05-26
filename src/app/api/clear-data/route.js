import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/emails.json');
    // Write an empty array to the file
    await fs.writeFile(dataPath, JSON.stringify([], null, 2), 'utf8');
    
    return NextResponse.json({ message: 'Data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
} 