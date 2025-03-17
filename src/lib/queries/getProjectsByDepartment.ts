import { db } from '@/db'
import { projects, users, settlements, projectSettlements, projectFundingSources, projectEditors } from '@/db/schema'
import { eq, count, inArray, and, or, gte, lte, between } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { validateProjectIds } from './projects/validateProjectIds'

// Reusable project selection fields to avoid duplication
const projectSelectionFields = {
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
};

// Helper function to create user access filter (owner or editor)
function createUserAccessFilter(userId: number) {
    return or(
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
}

// Helper function to create date range filter
function createDateRangeFilter(startDate?: Date, endDate?: Date) {
    if (startDate && endDate) {
        // Projects that have any overlap with the specified date range
        return or(
            // Project entirely within range
            and(gte(projects.start_date, startDate), lte(projects.end_date, endDate)),
            // Project starts before range but ends within range
            and(lte(projects.start_date, startDate), and(gte(projects.end_date, startDate), lte(projects.end_date, endDate))),
            // Project starts within range but ends after range
            and(and(gte(projects.start_date, startDate), lte(projects.start_date, endDate)), gte(projects.end_date, endDate)),
            // Project spans the entire range
            and(lte(projects.start_date, startDate), gte(projects.end_date, endDate))
        );
    } else if (startDate) {
        // Projects that end on or after the start date
        return gte(projects.end_date, startDate);
    } else if (endDate) {
        // Projects that start on or before the end date
        return lte(projects.start_date, endDate);
    }
    
    // No date filter
    return undefined;
}

// Main router function
export async function getProjects(limit: number, offset: number, departmentId?: number, funderId?: number, userId?: number, startDate?: Date, endDate?: Date) {
    // Handle filter combinations
    if (departmentId && funderId) {
        return getProjectsByDepartmentAndFunder(limit, offset, departmentId, funderId, userId, startDate, endDate);
    } 
    
    if (funderId) {
        return getProjectsByFunder(limit, offset, funderId, userId, startDate, endDate);
    } 
    
    if (departmentId) {
        return getProjectsByDepartmentC(limit, offset, departmentId, userId, startDate, endDate);
    }
    
    // Get all projects (will be filtered for user access if userId is provided)
    return getAllProjects(limit, offset, userId, startDate, endDate);
}

// Function for getting projects by both department and funder
async function getProjectsByDepartmentAndFunder(limit: number, offset: number, departmentId: number, funderId: number, userId?: number, startDate?: Date, endDate?: Date) {
    // Base filter for department and funder
    let baseFilter = and(eq(projects.department_id, departmentId), eq(projectFundingSources.id, funderId));
    
    // Add user access filter if userId is provided
    if (userId) {
        baseFilter = and(baseFilter, createUserAccessFilter(userId));
    }
    
    // Add date range filter if provided
    const dateFilter = createDateRangeFilter(startDate, endDate);
    if (dateFilter) {
        baseFilter = and(baseFilter, dateFilter);
    }
    
    const projectsArr = await db
        .select(projectSelectionFields)
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
        .where(baseFilter)
        .limit(limit)
        .offset(offset);

    const projectCount = await db
        .select({ count: count() })
        .from(projects)
        .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
        .where(baseFilter);

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Function for getting projects by department only
async function getProjectsByDepartmentC(limit: number, offset: number, departmentId: number, userId?: number, startDate?: Date, endDate?: Date) {
    // Base filter for department
    let baseFilter = eq(projects.department_id, departmentId);
    
    // Add user access filter if userId is provided
    if (userId) {
        baseFilter = and(baseFilter, createUserAccessFilter(userId));
    }
    
    // Add date range filter if provided
    const dateFilter = createDateRangeFilter(startDate, endDate);
    if (dateFilter) {
        baseFilter = and(baseFilter, dateFilter);
    }
    
    const projectsArr = await db
        .select(projectSelectionFields)
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .where(baseFilter)
        .limit(limit)
        .offset(offset);

    const projectCount = await db
        .select({ count: count() })
        .from(projects)
        .where(baseFilter);

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Function for getting projects by funder only
async function getProjectsByFunder(limit: number, offset: number, funderId: number, userId?: number, startDate?: Date, endDate?: Date) {
    // Base filter for funder
    let baseFilter = eq(projectFundingSources.funding_source_id, funderId);
    
    // Add user access filter if userId is provided
    if (userId) {
        baseFilter = and(baseFilter, createUserAccessFilter(userId));
    }
    
    // Add date range filter if provided
    const dateFilter = createDateRangeFilter(startDate, endDate);
    if (dateFilter) {
        baseFilter = and(baseFilter, dateFilter);
    }
    
    const projectsArr = await db
        .select(projectSelectionFields)
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
        .where(baseFilter)
        .limit(limit)
        .offset(offset);

    const projectCount = await db
        .select({ count: count() })
        .from(projects)
        .leftJoin(projectFundingSources, eq(projects.id, projectFundingSources.project_id))
        .where(baseFilter);

    return addSettlementsToProjects(projectsArr, projectCount[0].count);
}

// Function for getting all projects
async function getAllProjects(limit: number, offset: number, userId?: number, startDate?: Date, endDate?: Date) {
    // Start with empty filter
    let filter: any = undefined;
    let hasFilter = false;
    
    // Apply user filter if provided
    if (userId) {
        filter = createUserAccessFilter(userId);
        hasFilter = true;
    }
    
    // Apply date range filter if provided
    const dateFilter = createDateRangeFilter(startDate, endDate);
    if (dateFilter) {
        filter = hasFilter ? and(filter, dateFilter) : dateFilter;
        hasFilter = true;
    }
    
    // Get projects with optional filter
    const projectsArr = await db
        .select(projectSelectionFields)
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .where(filter || undefined)
        .limit(limit)
        .offset(offset);
        
    // Get count with the same filter
    const projectCount = await db
        .select({ count: count() })
        .from(projects)
        .where(filter || undefined);
        
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
                .where(eq(projectSettlements.project_id, project.id));

            return {
                ...project,
                settlements: arrSettlements.length ? arrSettlements : []
            }
        })
    );
    
    return {
        data: data,
        count: projectCount
    }
}

// Get total project count
export async function getProjectsCount() {
    const projectsArr = await db
        .select({ count: count() })
        .from(projects);
        
    return projectsArr[0].count;
}

// Public API: Get my projects (where I'm owner or editor)
export async function getMyProjects(
    limit: number, 
    offset: number, 
    userId: string, 
    departmentId?: string,
    startDate?: string,
    endDate?: string,
    isAdmin?: boolean
) {
    if (!userId) {
        throw new Error('User ID is required');
    }
    

    const userIdNum = parseInt(userId);
    const departmentIdNum = departmentId ? parseInt(departmentId) : undefined;
    
    // Parse date strings to Date objects if provided
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    if(isAdmin)
        return getProjects(limit, offset, departmentIdNum, undefined, undefined, startDateObj, endDateObj);
    // Use the main router function which now correctly filters by user access
    return getProjects(limit, offset, departmentIdNum, undefined, userIdNum, startDateObj, endDateObj);
}

// Public API: Count my projects (where I'm owner or editor)
export async function getMyProjectsCount(
    userId: string, 
    departmentId?: string,
    startDate?: string,
    endDate?: string
) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const userIdNum = parseInt(userId);
    const baseFilter = createUserAccessFilter(userIdNum);
    let filters = baseFilter;
    
    // Add department filter if provided
    if (departmentId) {
        filters = and(filters, eq(projects.department_id, parseInt(departmentId)));
    }
    
    // Parse date strings to Date objects if provided
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    
    // Add date filter if provided
    const dateFilter = createDateRangeFilter(startDateObj, endDateObj);
    if (dateFilter) {
        filters = and(filters, dateFilter);
    }

    const result = await db
        .select({ count: count() })
        .from(projects)
        .where(filters);

    return result[0].count;
}

export async function getProjectsByDepartment(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required');
    }

    const projectsArr = await db
        .select({
            "*": projects,
            ownerFirstName: users.first_name,
            ownerLastName: users.last_name,
        })
        .from(projects)
        .leftJoin(users, eq(projects.owner_id, users.id))
        .where(eq(projects.department_id, departmentId)); // Filter by department
        
    return projectsArr;
}

export async function getProjectsCountByDepartment(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required');
    }
    
    const result = await db
        .select({
            count: sql<number>`count(*)::int`
        })
        .from(projects)
        .where(eq(projects.department_id, departmentId));
    
    return result[0].count;
}

export async function getProjectsByDepartmentAndSettlementCount(departmentId: string) {
    if (!departmentId) {
        throw new Error('Department ID is required');
    }
    
    const result = await db
        .select({
            count: sql<number>`count(*)::int`
        })
        .from(projects)
        .where(eq(projects.department_id, departmentId));
        
    return result[0].count;
}

export async function getProjectsByDepartmentAndSettlement(departmentId: string, limit: number, offset: number) {
    if (!departmentId) {
        throw new Error('Department ID is required');
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
        .offset(offset);

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
            .leftJoin(settlements, eq(projectSettlements.settlement_id, settlements.settlement_id));

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