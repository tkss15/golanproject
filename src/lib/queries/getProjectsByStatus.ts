import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, count } from 'drizzle-orm';

export async function getProjectsByStatus(projectStatus: string): Promise<number>{
    const result = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.status, projectStatus));

return result[0].count;
}