import { db } from "@/db";
import { projectEditors, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserByKindId } from "@/lib/queries/users/getUser";

export async function updateUserRole(projectId: number, userId: number, role: string) {
  // First, check if the editor exists
  const existingEditor = await db
    .select()
    .from(projectEditors)
    .where(
      and(
        eq(projectEditors.project_id, projectId),
        eq(projectEditors.editor_id, userId)
      )
    )
    .limit(1);

  if (existingEditor.length === 0) {
    throw new Error("Editor not found");
  }

  // Update the role
  await db
    .update(projectEditors)
    .set({ role: role })
    .where(
      and(
        eq(projectEditors.project_id, projectId),
        eq(projectEditors.editor_id, userId)
      )
    );

  return { success: true };
}

/**
 * Gets a user's role in a specific project based on their Kinde session
 * @param projectId - The ID of the project (can be string or number)
 * @param kindeId - The Kinde ID from the user's session
 * @returns The user's role ('editor', 'viewer') or null if they don't have access
 */
export async function getUserProjectRole(projectId: string | number, kindeId: string): Promise<string | null> {
  try {
    // Validate and convert project ID to number
    const projectIdNum = typeof projectId === 'string' ? parseInt(projectId, 10) : projectId;
    
    // Check if projectId is valid
    if (isNaN(projectIdNum)) {
      console.error(`Invalid project ID: ${projectId}`);
      return null;
    }
    
    // Get the internal user ID from the Kinde ID
    const user = await getUserByKindId(kindeId);
    
    if (!user) {
      console.error(`User not found for Kinde ID: ${kindeId}`);
      return null;
    }

    const userId = user.id;

    // Look up the user's role in the project
    const editorRecord = await db
      .select({
        role: projectEditors.role
      })
      .from(projectEditors)
      .where(
        and(
          eq(projectEditors.project_id, projectIdNum),
          eq(projectEditors.editor_id, userId),
          eq(projectEditors.is_active, true)
        )
      )
      .limit(1);

    // If record exists, return the role
    if (editorRecord.length > 0) {
      return editorRecord[0].role;
    }
    
    // Check if the user is the project owner (they would have full editor permissions)
    const projectOwnerCheck = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectIdNum),
          eq(projects.owner_id, userId)
        )
      )
      .limit(1);
      
    if (projectOwnerCheck.length > 0) {
      return 'editor'; // Project owners have full editor access
    }

    // User has no role in this project
    return null;
  } catch (error) {
    console.error('Error getting user project role:', error);
    return null;
  }
}