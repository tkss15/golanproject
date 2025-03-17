import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { departments } from "@/db/schema";
import { z } from "zod";

// Create a validation schema for the input data
const departmentSchema = z.object({
  department_name: z.string().min(1).max(256),
  project_type: z.string().min(1).max(256),
});

export async function GET(request: NextRequest) {
  const departmentsArray = await db
    .select()
    .from(departments);
  return NextResponse.json(departmentsArray);
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = departmentSchema.parse(body);

    // Insert the department into the database
    const [newDepartment] = await db
      .insert(departments)
      .values(validatedData)
      .returning();

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    
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