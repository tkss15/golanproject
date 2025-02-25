import { db } from "@/db";
import { projectEditors } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function createProjectEditor(projectEditor: typeof projectEditors.$inferInsert[]) {
    const editor = await db.insert(projectEditors).values(projectEditor)
    return editor
}

// Function to create new project editors
export async function createProjectEditors(editors: typeof projectEditors.$inferInsert[]) {
    try {
      // Insert all new editors in a single query for better performance
      const result = await db.insert(projectEditors).values(editors);
      return result;

    } catch (error) {
      console.error('Error creating project editors:', error);
      throw new Error('Failed to create project editors');
    }   
  }
  
  // Function to delete project editors by marking them as inactive
  export async function deleteProjectEditors(projectId: number, editorIds: number[]) {
    try {
      const result = await db
        .delete(projectEditors)
        .where(and(eq(projectEditors.project_id, projectId), inArray(projectEditors.editor_id, editorIds)))
      return result;

    } catch (error) {
      console.error('Error deleting project editors:', error);
      throw new Error('Failed to delete project editors');
    }
  }

  export async function deleteAllProjectEditors(projectId: number, tx?: any) {
    const result = await (tx || db)
      .delete(projectEditors)
      .where(eq(projectEditors.project_id, projectId))
    return result;
  }


