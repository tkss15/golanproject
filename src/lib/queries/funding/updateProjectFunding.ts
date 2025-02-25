import { db } from "@/db";
import { projectFundingSources } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateProjectFunding(projectId: number, fundingSourceId: number, funding: Partial<typeof projectFundingSources.$inferInsert>) {
    return await db.update(projectFundingSources).set(funding).where(eq(projectFundingSources.project_id, projectId)).where(eq(projectFundingSources.funding_source_id, fundingSourceId));
}
