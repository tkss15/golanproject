import { db } from '@/db';
import { projectManagers } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET all project managers
export async function GET() {
  try {
    const managers = await db.select().from(projectManagers);
    return NextResponse.json(managers);
  } catch (error) {
    console.error('Error fetching project managers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project managers' },
      { status: 500 }
    );
  }
}

// POST a new project manager
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.full_name) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    const newManager = await db.insert(projectManagers).values({
      full_name: body.full_name,
      company_name: body.company_name || null,
      position: body.position || null,
      email: body.email || null,
      phone: body.phone || null,
      is_external: body.is_external !== undefined ? body.is_external : true,
      user_id: body.user_id || null,
      is_active: true,
    }).returning();

    return NextResponse.json(newManager[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project manager:', error);
    return NextResponse.json(
      { error: 'Failed to create project manager' },
      { status: 500 }
    );
  }
}