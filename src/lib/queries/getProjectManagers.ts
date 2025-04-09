import { db } from '@/db';
import { projectManagers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getAllProjectManagers() {
  try {
    const managers = await db.select().from(projectManagers).orderBy(desc(projectManagers.created_at));
    return managers;
  } catch (error) {
    console.error('Error fetching project managers:', error);
    throw new Error('Failed to fetch project managers');
  }
}

export async function getProjectManagerById(id: number) {
  try {
    const manager = await db.select().from(projectManagers).where(eq(projectManagers.id, id));
    return manager[0] || null;
  } catch (error) {
    console.error(`Error fetching project manager with ID ${id}:`, error);
    throw new Error('Failed to fetch project manager');
  }
}

export async function getActiveProjectManagers() {
  try {
    const managers = await db.select()
      .from(projectManagers)
      .where(eq(projectManagers.is_active, true))
      .orderBy(desc(projectManagers.created_at));
    return managers;
  } catch (error) {
    console.error('Error fetching active project managers:', error);
    throw new Error('Failed to fetch active project managers');
  }
}

export async function getProjectManagersByType(isExternal: boolean) {
  try {
    const managers = await db.select()
      .from(projectManagers)
      .where(eq(projectManagers.is_external, isExternal))
      .orderBy(desc(projectManagers.created_at));
    return managers;
  } catch (error) {
    console.error(`Error fetching ${isExternal ? 'external' : 'internal'} project managers:`, error);
    throw new Error(`Failed to fetch ${isExternal ? 'external' : 'internal'} project managers`);
  }
}