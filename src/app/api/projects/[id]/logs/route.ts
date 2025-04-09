import { NextRequest, NextResponse } from 'next/server';
import { createLog } from '@/lib/logs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Get the project ID from the URL params
    const projectId = parseInt(params.id, 10);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Create the log using your existing createLog function
    await createLog(
      projectId,
      'ADD_NOTE',
      'NOTES',
      text,
      null,
      null,
      { text }
    );

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create log' },
      { status: 500 }
    );
  }
}
