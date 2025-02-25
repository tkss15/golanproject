import { db } from '@/db'
import { projects } from '@/db/schema'
import { inArray } from 'drizzle-orm'


export async function validateProjectIds(projectIds: number[]) {
    if (!projectIds || projectIds.length === 0) {
        throw new Error('Project IDs are required')
    }

    const existingProjectIds = await db
        .select({ id: projects.id })
        .from(projects)
        .where(inArray(projects.id, projectIds));

    const existingIds = existingProjectIds.map(p => p.id);
    const missingIds = projectIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
        throw new Error(`Projects not found for IDs: ${missingIds.join(', ')}`)
    }

    return existingIds;
}
