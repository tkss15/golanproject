// app/api/funding-sources/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fundingSources } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Create a validation schema for the input data
const fundingSourceSchema = z.object({
  source_name: z.string().min(1).max(256),
  source_type: z.string().min(1).max(256),
  contact_details: z.string().optional(),
});


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
// @ts-nocheck
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }  // Removed the Promise union type
) {
    try {
      // Remove the await since params is no longer a Promise
      const requestParams = params;
      
      // Rest of your code remains the same
      if (!requestParams.id) {
        return NextResponse.json(
          { error: 'Funding source ID is required' },
          { status: 400 }
        );
      }
  
      // Parse and validate the request body
      const body = await request.json();
      const validatedData = fundingSourceSchema.parse(body);
  
      // Add updated_at timestamp to the update data
      const updateData = {
        ...validatedData,
        updated_at: new Date(),
      };
  
      // Update the funding source in the database
      const [updatedFundingSource] = await db
        .update(fundingSources)
        .set(updateData)
        .where(eq(fundingSources.id, requestParams.id))
        .returning();
  
      // If no record was found and updated, return 404
      if (!updatedFundingSource) {
        return NextResponse.json(
          { error: 'Funding source not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(updatedFundingSource);
    } catch (error) {
      console.error('Error updating funding source:', error);
      
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