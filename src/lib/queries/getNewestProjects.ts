import { db } from '@/db'
import { projects } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function getNewestProjects() {
  try {
    const newestProjects = await db
      .select({
        id: projects.id,
        project_name: projects.project_name,
        description: projects.description,
        created_at: projects.created_at,
      })
      .from(projects)
      .orderBy(desc(projects.created_at))
      .limit(5);
    
    return { projects: newestProjects };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch newest projects');
  }
}