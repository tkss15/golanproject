import { db } from "@/db";
import { fundingSources, projectFundingSources } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProjectFundings(projectId: number) {
    const fundings = await db
    .select({
        id: projectFundingSources.id,
        project_id: projectFundingSources.project_id,
        funding_source_id: projectFundingSources.funding_source_id,
        name: fundingSources.source_name,
        budget: projectFundingSources.allocated_amount
    })
    .from(projectFundingSources)
    .leftJoin(fundingSources, eq(projectFundingSources.funding_source_id, fundingSources.id))
    .where(eq(projectFundingSources.project_id, projectId));
    return fundings;

}
