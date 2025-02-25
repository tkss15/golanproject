import { db } from "@/db";
import { projectFundingSources } from "@/db/schema";


function validateFunding(funding: typeof projectFundingSources.$inferInsert) {
    if (!funding.project_id) throw new Error('Project ID is required');
    if (!funding.funding_source_id) throw new Error('Funding source ID is required');
    if (!funding.allocated_amount) throw new Error('Allocated amount is required');
    if (!funding.allocation_date) throw new Error('Allocation date is required');
}

export async function createProjectFunding(projectId: number, funding: typeof projectFundingSources.$inferInsert) {
    try {
        validateFunding(funding);
        const response = await db
        .insert(projectFundingSources)
        .values({...funding, project_id: projectId});
        return response;
    } catch (error) {
        console.error('Error creating project funding:', error);
        throw error;
    }
}

export async function createProjectFundings(fundings: Array<typeof projectFundingSources.$inferInsert>) {
    return await db.insert(projectFundingSources).values(fundings);
}

