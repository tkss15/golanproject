import { db } from '@/db';
import { projectManagers } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET a specific project manager by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const manager = await db.select().from(projectManagers).where(eq(projectManagers.id, id));
    
    if (!manager.length) {
      return NextResponse.json(
        { error: 'Project manager not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(manager[0]);
  } catch (error) {
    console.error(`Error fetching project manager with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project manager' },
      { status: 500 }
    );
  }
}

// PUT (update) a specific project manager by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Prepare update data - only include fields that are provided
    const updateData: any = {};
    if (body.full_name !== undefined) updateData.full_name = body.full_name;
    if (body.company_name !== undefined) updateData.company_name = body.company_name;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.is_external !== undefined) updateData.is_external = body.is_external;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.user_id !== undefined) updateData.user_id = body.user_id;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date();

    const updatedManager = await db.update(projectManagers)
      .set(updateData)
      .where(eq(projectManagers.id, id))
      .returning();

    if (!updatedManager.length) {
      return NextResponse.json(
        { error: 'Project manager not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedManager[0]);
  } catch (error) {
    console.error(`Error updating project manager with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update project manager' },
      { status: 500 }
    );
  }
}

// DELETE is actually a soft delete (setting is_active to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    const deactivatedManager = await db.update(projectManagers)
      .set({ 
        is_active: false,
        updated_at: new Date()
      })
      .where(eq(projectManagers.id, id))
      .returning();

    if (!deactivatedManager.length) {
      return NextResponse.json(
        { error: 'Project manager not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Project manager deactivated successfully',
      manager: deactivatedManager[0]
    });
  } catch (error) {
    console.error(`Error deactivating project manager with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to deactivate project manager' },
      { status: 500 }
    );
  }
}