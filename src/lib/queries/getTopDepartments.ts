import { db } from '@/db'
import { projects, departments } from '@/db/schema'
import { sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

export async function getTopDepartments() {
    const result = await db
        .select({
            department_name: departments.department_name,
            project_count: sql<number>`count(${projects.id})`
        })
        .from(projects)
        .leftJoin(departments, eq(departments.id, projects.department_id))
        .groupBy(departments.department_name)
        .orderBy(sql`count(${projects.id}) DESC`)
        .limit(6);

    return result;
}