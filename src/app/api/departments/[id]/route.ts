import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { departments } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Create a validation schema for the input data
const departmentSchema = z.object({
  department_name: z.string().min(1).max(256),
  project_type: z.string().min(1).max(256),
});

// Get a specific department by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      );
    }

    const department = await db
      .select()
      .from(departments)
      .where(eq(departments.id, params.id))
      .limit(1);

    if (!department.length) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department[0]);
  } catch (error) {
    console.error('Error retrieving department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a department
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = departmentSchema.parse(body);

    // Update the department in the database
    const [updatedDepartment] = await db
      .update(departments)
      .set(validatedData)
      .where(eq(departments.id, params.id))
      .returning();

    // If no record was found and updated, return 404
    if (!updatedDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a department
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      );
    }

    // Delete the department from the database
    const [deletedDepartment] = await db
      .delete(departments)
      .where(eq(departments.id, params.id))
      .returning();

    // If no record was found and deleted, return 404
    if (!deletedDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}