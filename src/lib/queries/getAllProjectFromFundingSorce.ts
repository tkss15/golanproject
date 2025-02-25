import { db } from '@/db'
import { projects, fundingSources, projectFundingSources } from '@/db/schema'
import { eq } from 'drizzle-orm';

export async function getAllProjectFromFundingSorce(funding_id: string) {
    const projectsArr = await db
    .select({
        project_id: projects.id,
        funding_id: fundingSources.id,
        funding_name: fundingSources.source_name,
    })
    .from(projectFundingSources)
    .where(eq(projectFundingSources.funding_source_id, funding_id))
    .leftJoin(projects, eq(projectFundingSources.project_id, projects.id))
    .leftJoin(fundingSources, eq(projectFundingSources.funding_source_id, fundingSources.id))
    return projectsArr
}
