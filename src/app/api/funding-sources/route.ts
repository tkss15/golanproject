import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fundingSources } from "@/db/schema";
import { z } from "zod";

// Create a validation schema for the input data
const fundingSourceSchema = z.object({
  source_name: z.string().min(1).max(256),
  source_type: z.string().min(1).max(256),
  contact_details: z.string().optional().default(''),
});

export async function GET(request: NextRequest) {
  const fundingSorcesArray = await db
  .select()
  .from(fundingSources);
  return NextResponse.json(fundingSorcesArray);
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = fundingSourceSchema.parse(body);

    // Insert the funding source into the database
    const [newFundingSource] = await db
      .insert(fundingSources)
      .values(validatedData)
      .returning();

    return NextResponse.json(newFundingSource, { status: 201 });
  } catch (error) {
    console.error('Error creating funding source:', error);
    
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