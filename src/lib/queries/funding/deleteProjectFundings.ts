import { projectFundingSources } from "@/db/schema";
import { db } from "@/db";
import { eq, and, inArray } from "drizzle-orm";

export async function deleteProjectFundings(project_id: number, fundingsToDelete: Array<{project_id: number, funding_source_id: number}>) {
    const result = await db
        .delete(projectFundingSources)
        .where(and(
            eq(projectFundingSources.project_id, project_id),
            inArray(
                projectFundingSources.funding_source_id,
                fundingsToDelete.map(f => f.funding_source_id)
            )
        ))
        .execute();
    return result;
}

export async function deleteAllProjectFundings(project_id: number, tx?: any) {
    const result = await (tx || db)
        .delete(projectFundingSources)
        .where(eq(projectFundingSources.project_id, project_id))
        .execute();
    return result;
}
