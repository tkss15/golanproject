import { db } from '@/db'
import { departments, projects } from '@/db/schema'
import { sql,eq  } from 'drizzle-orm'

export async function getAllDepartments() {
    const departmentArr = await db.select()
            .from(departments)
    return departmentArr
}

export async function getAllDepartmentsWithCount() {
    const departmentArr = await db
        .select({
            id: departments.id,
            department_name: departments.department_name,
            project_type: departments.project_type,
            project_count: sql<number>`count(${projects.id})::int`
        })
        .from(departments)
        .leftJoin(projects, eq(departments.id, projects.department_id))
        .groupBy(departments.id, departments.department_name, departments.project_type)
    return departmentArr
}