import { db } from '@/db'
import { projectEditors, projects } from '@/db/schema'
import { and, desc, eq, gte, inArray, or } from 'drizzle-orm'

export async function getUpcomingProjects(userId: number, isAdmin:boolean = false) {
  if(isAdmin)
  {
    const adminResponse = await getUpcomingProjectsAdmin();
    return adminResponse;
  }
  const response = await getUpcomingProjectsOwnerEditor(userId);
  return response;
}


export async function getUpcomingProjectsAdmin() {
    try {
    const upcomingProjects = await db
    .select({
      id: projects.id,
      project_name: projects.project_name,
      description: projects.description,
      end_date: projects.end_date,
    })
    .from(projects)
    .where((gte(projects.end_date, new Date())))
    .orderBy(projects.end_date)
    .limit(5);
    
    return { projects: upcomingProjects };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch upcoming projects');
  }
}
export async function getUpcomingProjectsOwnerEditor(userId:number) {
  try {
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

    const upcomingProjects = await db
    .select({
      id: projects.id,
      project_name: projects.project_name,
      description: projects.description,
      end_date: projects.end_date,
    })
    .from(projects)
    .where(and(gte(projects.end_date, new Date()), accessFilter))
    .orderBy(projects.end_date)
    .limit(5);
    
    return { projects: upcomingProjects };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch upcoming projects');
  }
}