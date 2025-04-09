import { db } from '@/db';
import { projectManagers } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get all active project managers
 */
export async function getAllProjectManagers() {
  try {
    const managers = await db.select({
      id: projectManagers.id,
      full_name: projectManagers.full_name,
      company_name: projectManagers.company_name,
      position: projectManagers.position,
      is_external: projectManagers.is_external,
      email: projectManagers.email,
      phone: projectManagers.phone,
    })
    .from(projectManagers)
    .where(eq(projectManagers.is_active, true));

    return managers;
  } catch (error) {
    console.error('Error fetching project managers:', error);
    throw new Error('Failed to fetch project managers');
  }
}

/**
 * Get a project manager by ID
 */
export async function getProjectManagerById(id: number) {
  try {
    const manager = await db.select().from(projectManagers).where(eq(projectManagers.id, id));
    return manager[0] || null;
  } catch (error) {
    console.error(`Error fetching project manager with ID ${id}:`, error);
    throw new Error('Failed to fetch project manager');
  }
}
