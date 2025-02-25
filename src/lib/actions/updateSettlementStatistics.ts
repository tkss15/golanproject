'use server'

import { db } from "@/db";
import { settlement_statistics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

interface UpdateData {
  households: number;
  population: number;
  population_2030: number;
  growth_rate: number;
  topics_of_interest?: string[] | null;
  nearby_projects?: string[] | null;
}

export async function updateSettlementStatistics(
  settlementId: number,
  data: UpdateData
) {
  try {
    // Log the data being received
    console.log('Updating statistics with:', data);

    // Convert arrays to PostgreSQL arrays using sql template literals
    const topicsArray = data.topics_of_interest 
      ? sql`array[${sql.join(data.topics_of_interest, sql`, `)}]::text[]`
      : null;
    
    const projectsArray = data.nearby_projects
      ? sql`array[${sql.join(data.nearby_projects, sql`, `)}]::text[]`
      : null;

    await db
      .update(settlement_statistics)
      .set({
        households: data.households,
        population: data.population,
        population_2030: data.population_2030,
        growth_rate: data.growth_rate,
        topics_of_interest: topicsArray,
        nearby_projects: projectsArray,
        updatedAt: new Date()
      })
      .where(eq(settlement_statistics.settlement_id, settlementId));

    revalidatePath(`/settlements/${settlementId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating settlement statistics:', error);
    return { success: false, error: String(error) };
  }
}