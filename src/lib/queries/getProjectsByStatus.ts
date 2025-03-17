import { db } from '@/db'
import { projects, users, projectEditors, departments } from '@/db/schema'
import { eq, count, inArray, and, or } from 'drizzle-orm';
import type { selectProjecSchemaType } from '@/zod-schemas/projects'

// Original function - get count of projects by status
export async function getProjectsByStatus(projectStatus: string): Promise<number> {
    const result = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, projectStatus));

    return result[0].count;
}

// Original function - get projects data by status
export async function getProjectsByStatusData(projectStatus: string): Promise<Array<selectProjecSchemaType>> {
    const result = await db
        .select()
        .from(projects)
        .where(eq(projects.status, projectStatus));

    return result;
}

/**
 * Get projects by status with access control (check if user is owner or editor)
 * Returns both the project data and total count in one query
 * 
 * @param projectStatus - The status to filter projects by
 * @param userId - The user ID to check permissions against
 * @param limit - Maximum number of results to return
 * @param offset - Number of results to skip (for pagination)
 * @returns Object containing project data and total count
 */
export async function getProjectsByStatusWithAccess(
    projectStatus: string,
    userId: number,
    limit: number = 10,
    offset: number = 0
) {
    // Create the access filter (user is owner OR editor)
    const accessFilter = or(
        eq(projects.owner_id, userId),
        inArray(
            projects.id,
            db.select({ project_id: projectEditors.project_id })
                .from(projectEditors)
                .where(
                    and(
                        eq(projectEditors.editor_id, userId),
                        eq(projectEditors.is_active, true)
                    )
                )
        )
    );

    // Query for projects with this status that the user has access to
    const projectsWithAccess = await db
        .select({
            id: projects.id,
            project_name: projects.project_name,
            description: projects.description,
            budget: projects.budget,
            start_date: projects.start_date,
            end_date: projects.end_date,
            status: projects.status,
            priority: projects.priority,
            contact_email: projects.contact_email,
            contact_phone: projects.contact_phone,
            created_at: projects.created_at,
            updated_at: projects.updated_at,
            department_name: departments.department_name,
            owner: {
                firstName: users.first_name,
                lastName: users.last_name,
                picture: users.picture
            },
            // Flag to indicate the user has access (always true for this query)
            hasAccess: () => true
        })
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(departments, eq(projects.department_id, departments.id))
        .where(and(eq(projects.status, projectStatus), accessFilter))
        .limit(limit)
        .offset(offset);

    // Get count of accessible projects with this status
    const accessibleCount = await db
        .select({ count: count() })
        .from(projects)
        .where(and(eq(projects.status, projectStatus), accessFilter));

    // Get projects with this status that the user DOESN'T have access to
    // (showing limited information)
    const projectsWithoutAccess = await db
        .select({
            id: projects.id,
            project_name: projects.project_name,
            description: projects.description,
            budget: projects.budget,
            start_date: projects.start_date,
            end_date: projects.end_date,
            status: projects.status,
            priority: projects.priority,
            contact_email: projects.contact_email,
            contact_phone: projects.contact_phone,
            created_at: projects.created_at,
            updated_at: projects.updated_at,
            department_name: departments.department_name,
            owner: {
                firstName: users.first_name,
                lastName: users.last_name,
                picture: users.picture
            },
            // Flag to indicate the user does not have access
            hasAccess: () => false
        })
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(departments, eq(projects.department_id, departments.id))
        .where(
            and(
                eq(projects.status, projectStatus),
                // Negate the access filter to get projects user doesn't have access to
                // We use negation by checking that neither condition in the OR is true
                and(
                    // User is not the owner
                    !eq(projects.owner_id, userId),
                    // User is not an editor
                    !inArray(
                        projects.id,
                        db.select({ project_id: projectEditors.project_id })
                            .from(projectEditors)
                            .where(
                                and(
                                    eq(projectEditors.editor_id, userId),
                                    eq(projectEditors.is_active, true)
                                )
                            )
                    )
                )
            )
        )
        .limit(limit)
        .offset(offset);

    // Get total count (both accessible and inaccessible)
    const totalCount = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, projectStatus));

    // Combine the results
    const allProjects = [...projectsWithAccess, ...projectsWithoutAccess];

    return {
        data: allProjects,
        accessibleCount: accessibleCount[0].count,
        totalCount: totalCount[0].count
    };
}

/**
 * Get all projects by status with access information
 * This version does not limit results by access, but includes access information
 */
export async function getAllProjectsByStatusWithAccessInfo(
    projectStatus: string,
    userId: number,
    limit: number = 10,
    offset: number = 0
) {
    // Create the user access filter
    const accessFilter = or(
        eq(projects.owner_id, userId),
        inArray(
            projects.id,
            db.select({ project_id: projectEditors.project_id })
                .from(projectEditors)
                .where(
                    and(
                        eq(projectEditors.editor_id, userId),
                        eq(projectEditors.is_active, true)
                    )
                )
        )
    );

    // Query for all projects with this status
    const allProjects = await db
        .select({
            id: projects.id,
            project_name: projects.project_name,
            description: projects.description,
            budget: projects.budget,
            start_date: projects.start_date,
            end_date: projects.end_date,
            status: projects.status,
            priority: projects.priority,
            contact_email: projects.contact_email,
            contact_phone: projects.contact_phone,
            created_at: projects.created_at,
            updated_at: projects.updated_at,
            department_name: departments.department_name,
            owner: {
                firstName: users.first_name,
                lastName: users.last_name,
                picture: users.picture
            }
        })
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(departments, eq(projects.department_id, departments.id))
        .where(eq(projects.status, projectStatus))
        .limit(limit)
        .offset(offset);

    // Get count of accessible projects with this status
    const accessibleCount = await db
        .select({ count: count() })
        .from(projects)
        .where(and(eq(projects.status, projectStatus), accessFilter));

    // Get total count of all projects with this status
    const totalCount = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, projectStatus));

    // Get IDs of projects the user has access to
    const accessibleProjectIds = await db
        .select({ id: projects.id })
        .from(projects)
        .where(and(eq(projects.status, projectStatus), accessFilter));

    // Create a Set of accessible project IDs for faster lookup
    const accessibleIds = new Set(accessibleProjectIds.map(p => p.id));

    // Annotate each project with access information
    const projectsWithAccessInfo = allProjects.map(project => ({
        ...project,
        hasAccess: accessibleIds.has(project.id)
    }));

    return {
        data: projectsWithAccessInfo,
        accessibleCount: accessibleCount[0].count,
        totalCount: totalCount[0].count
    };
}
