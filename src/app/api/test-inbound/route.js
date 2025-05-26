import { NextResponse } from 'next/server';
import { sendToAllClients } from '../events/route';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Test endpoint received data:', data);

    // Send test event to all clients
    sendToAllClients({
      type: 'new_email',
      email: {
        id: Date.now().toString(),
        from: data.from || 'test@example.com',
        to: data.to || 'test@example.com',
        subject: data.subject || 'Test Email',
        text: data.text || 'This is a test email',
        html: data.html || '<p>This is a test email</p>',
        date: new Date().toISOString(),
        status: 'test'
      }
    });

    return NextResponse.json({ success: true, message: 'Test event sent' });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process test request', details: error.message },
      { status: 500 }
    );
  }
} 