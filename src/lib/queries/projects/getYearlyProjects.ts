import { db } from '@/db'
import { projects, projectSettlements, departments, users } from '@/db/schema'
import { sql, and, eq } from 'drizzle-orm'

export async function getYearlyProjects(settlementId: number) {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 1
    const endYear = currentYear + 3

    const projectsArr = await db
        .select({
            projects: {
                id: projects.id,
                project_name: projects.project_name,
                description: projects.description,
                start_date: projects.start_date,
                end_date: projects.end_date,
                budget: projects.budget,
                status: projects.status,
                contact_email: projects.contact_email,
                contact_phone: projects.contact_phone,
                created_at: projects.created_at,
                updated_at: projects.updated_at
            },
            department_name: departments.department_name,
            owner_first_name: users.first_name,
            owner_last_name: users.last_name,
            project_settlements: projectSettlements
        })
        .from(projects)
        .innerJoin(
            projectSettlements,
            eq(projects.id, projectSettlements.project_id)
        )
        .innerJoin(
            departments,
            eq(projects.department_id, departments.id)
        )
        .innerJoin(
            users,
            eq(projects.owner_id, users.id)
        )
        .where(
            and(
                eq(projectSettlements.settlement_id, settlementId),
                sql`EXTRACT(YEAR FROM ${projects.start_date}) BETWEEN ${startYear} AND ${endYear}`
            )
        )
        .orderBy(sql`EXTRACT(YEAR FROM ${projects.start_date})`)

    return projectsArr
}