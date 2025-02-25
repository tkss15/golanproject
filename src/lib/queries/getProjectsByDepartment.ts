import { db } from '@/db'
import { projects, users, settlements, projectSettlements, projectFundingSources } from '@/db/schema'
import { eq, count, inArray, and } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { validateProjectIds } from './projects/validateProjectIds'

// Main router function
export async function getProjects(limit: number, offset: number, departmentId?: number, funderId?: number) {
    if (departmentId && funderId) {
        return getProjectsByDepartmentAndFunder(limit, offset, departmentId, funderId);
    } 
    else if (funderId) {
        return getProjectsByFunder(limit, offset, funderId);
    } 
    else if (departmentId) {
        return getProjectsByDepartmentC(limit, offset, departmentId);
    }
    else {
        return getAllProjects(limit, offset);
    }
}

// Function for getting projects by both department and funder
async function getProjectsByDepartmentAndFunder(limit: number, offset: number, departmentId: number, funderId: number) {
    const projectsArr = await db
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
        owner: {
            firstName: users.first_name,
            lastName: users.last_name,
        }
    })
    .from(projects)
    .leftJoin(users, eq(projects.owner_id, users.id))
    .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
    .where(and(eq(projects.department_id, departmentId), eq(projectFundingSources.id, funderId)))
    .limit(limit)
    .offset(offset)

    const projectCount = await db.select({
        count: count()
    }).from(projects)
    .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
    .where(and(eq(projects.department_id, departmentId), eq(projectFundingSources.id, funderId)))

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Function for getting projects by department only
async function getProjectsByDepartmentC(limit: number, offset: number, departmentId: number) {
    const projectsArr = await db
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
        owner: {
            firstName: users.first_name,
            lastName: users.last_name,
        },
    })
    .from(projects)
    .leftJoin(users, eq(projects.owner_id, users.id))
    .where(eq(projects.department_id, departmentId))
    .limit(limit)
    .offset(offset)

    const projectCount = await db.select({
        count: count()
    }).from(projects)
    .where(eq(projects.department_id, departmentId))

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}
// Function for getting projects by funder only
async function getProjectsByFunder(limit: number, offset: number, funderId: number) {
    const projectsArr = await db
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
        owner: {
            firstName: users.first_name,
            lastName: users.last_name,
        },
    })
    .from(projects)
    .leftJoin(users, eq(projects.owner_id, users.id))
    .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
    .where(eq(projectFundingSources.funding_source_id, funderId))
    .limit(limit)
    .offset(offset)

    const projectCount = await db.select({
        count: count()
    }).from(projects)
    .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
    .where(eq(projectFundingSources.funding_source_id, funderId))

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Function for getting all projects
async function getAllProjects(limit: number, offset: number) {
    const projectsArr = await db
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
        owner: {
            firstName: users.first_name,
            lastName: users.last_name,
        },
    })
    .from(projects)
    .leftJoin(users, eq(projects.owner_id, users.id))
    .limit(limit)
    .offset(offset)
    const projectCount = await db.select({
        count: count()
    }).from(projects)
    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Helper function to add settlements to projects
async function addSettlementsToProjects(projectsArr: any[], projectCount: number) {
    
    const data = await Promise.all(
        projectsArr.map(async (project) => {
            const arrSettlements = await db
                .select({
                    settlement_id: settlements.settlement_id,
                    name: settlements.name,
                    is_main_settlement: projectSettlements.is_main_settlement,
                    budget_allocation: projectSettlements.budget_allocation,
                    specific_goals: projectSettlements.specific_goals,
                    settlement_status: projectSettlements.settlement_status
                })
                .from(projectSettlements)
                .leftJoin(settlements, eq(projectSettlements.settlement_id, settlements.settlement_id))
                .where(eq(projectSettlements.project_id, project.id))

            return {
                ...project,
                settlements: arrSettlements.length ? arrSettlements : []
            }
        })
    )
    return {
        data: data,
        count: projectCount
    }
}

// Helper function to get project count
async function getProjectCount(projectsArr: any[]) {
    if (!projectsArr.length) return 0;
    const result = await db
        .select({ count: count() })
        .from(projects)
    return result[0].count;
}

export async function getProjectsCount() {
    const projectsArr = await db
    .select({
        count: count(),
    })
    .from(projects)
    return projectsArr[0].count
}

export async function getProjectsByDepartment(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required')
    }

    const projectsArr = await db
        .select({
            "*": projects,
            ownerFirstName: users.first_name,
            ownerLastName: users.last_name,
        })
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .where(eq(projects.department_id, departmentId)) // Filter by department
    return projectsArr
}


export async function getProjectsCountByDepartment(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required')
    }
    const result = await db
        .select({
            count: sql<number>`count(*)::int`
        })
        .from(projects)
        .where(eq(projects.department_id, departmentId))
    
    return result[0].count
}

export async function getProjectsByDepartmentAndSettlementCount(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required')
    }
    const result = await db
        .select({
            count: sql<number>`count(*)::int`
        })
        .from(projects)
        .where(eq(projects.department_id, departmentId))
    return result[0].count
}

export async function getProjectsByDepartmentAndSettlement(departmentId: string, limit: number, offset: number) {
    if (!departmentId) {
        throw new Error('Department ID is required')
    }

    const projectsArr = await db
        .select({
            project: {
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
                updated_at: projects.updated_at
            },
            owner: {
                firstName: users.first_name,
                lastName: users.last_name,
            },
            settlements: {
                settlement_id: settlements.settlement_id,
                name: settlements.name,
                is_main_settlement: projectSettlements.is_main_settlement,
                budget_allocation: projectSettlements.budget_allocation,
                specific_goals: projectSettlements.specific_goals,
                settlement_status: projectSettlements.settlement_status
            }
        })
        .from(projects)
        .where(eq(projects.department_id, departmentId))
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(projectSettlements, eq(projects.id, projectSettlements.project_id))
        .leftJoin(settlements, eq(projectSettlements.settlement_id, settlements.settlement_id))
        .limit(limit)
        .offset(offset)


    // Group projects with their settlements
    const groupedProjects = projectsArr.reduce((acc, curr) => {
        const projectId = curr.project.id;
        
        if (!acc[projectId]) {
            acc[projectId] = {
                ...curr.project,
                owner: curr.owner,
                settlements: []
            };
        }

        if (curr.settlements.settlement_id) {
            acc[projectId].settlements.push(curr.settlements);
        }

        return acc;
    }, {} as Record<number, any>);


    return Object.values(groupedProjects);
}
export async function getProjectsByIds(projectIds: number[]) {
    try {
        const validatedProjectIds = await validateProjectIds(projectIds);
 
        const projectsArr = await db
        .select({
            project: {
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
                updated_at: projects.updated_at
            },
            owner: {
                firstName: users.first_name,
                lastName: users.last_name,
            },
            settlements: {
                settlement_id: settlements.settlement_id,
                name: settlements.name,
                is_main_settlement: projectSettlements.is_main_settlement,
                budget_allocation: projectSettlements.budget_allocation,
                specific_goals: projectSettlements.specific_goals,
                settlement_status: projectSettlements.settlement_status
            }
        })
        .from(projects)
        .where(inArray(projects.id, validatedProjectIds))
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(projectSettlements, eq(projects.id, projectSettlements.project_id))
        .leftJoin(settlements, eq(projectSettlements.settlement_id, settlements.settlement_id))

    // Group projects with their settlements
    const groupedProjects = projectsArr.reduce((acc, curr) => {
        const projectId = curr.project.id;
        
        if (!acc[projectId]) {
            acc[projectId] = {
                ...curr.project,
                owner: curr.owner,
                settlements: []
            };
        }

        if (curr.settlements.settlement_id) {
            acc[projectId].settlements.push(curr.settlements);
        }

        return acc;
    }, {} as Record<number, any>);


    return Object.values(groupedProjects);
        
    } catch (error) {
        return null;   
    }
    
}