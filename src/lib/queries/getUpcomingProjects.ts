import { db } from '@/db'
import { projects } from '@/db/schema'
import { desc, gte } from 'drizzle-orm'

export async function getUpcomingProjects() {
  try {
    const upcomingProjects = await db
      .select({
        id: projects.id,
        project_name: projects.project_name,
        description: projects.description,
        end_date: projects.end_date,
      })
      .from(projects)
      .where(gte(projects.end_date, new Date()))
      .orderBy(projects.end_date)
      .limit(5);
    
    return { projects: upcomingProjects };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch upcoming projects');
  }
}