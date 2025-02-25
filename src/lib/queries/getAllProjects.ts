import { db } from '@/db'
import { projects, users } from '@/db/schema'
import { eq } from 'drizzle-orm';

export async function getAllProjects() {
    const projectsArr = await db
    .select({
        "*": projects,
        ownerFirstName: users.first_name,
        ownerLastName: users.last_name,
    })
    .from(projects)
    .leftJoin(users, eq(projects.owner_id, users.id))
    return projectsArr
}