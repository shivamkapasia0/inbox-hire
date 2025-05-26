import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, reply } = body;

    // Here you would typically update the application in your database
    // For now, we'll just return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Application updated successfully',
      data: { id, status, reply }
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 