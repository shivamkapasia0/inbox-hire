import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'emails.json');
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const emails = JSON.parse(fileContent);
      return NextResponse.json(emails);
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error reading emails:', error);
    return NextResponse.json(
      { error: 'Failed to read emails' },
      { status: 500 }
    );
  }
} 