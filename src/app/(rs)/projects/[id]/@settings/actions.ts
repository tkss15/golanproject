'use server'

import { getProject } from "@/lib/queries/projects/getProject";
import { getProjectManagerById } from "@/lib/queries/projects/getProjectManagers";
import { updateProject } from "@/lib/queries/projects/updateProject";
import { createLog } from "@/lib/logs";
import { revalidatePath } from "next/cache";

export async function updateProjectManager(projectId: number, managerId: number) {
  const currentData = await getProject(projectId);
  if (!currentData) {
    throw new Error("Project not found");
  }
  
  // Check if there's no change
  if (currentData.manager_id === managerId) {
    throw new Error("מנהל הפרויקט כבר משוייך לפרויקט זה");
  }
  
  // Get manager details for log
  const oldManager = currentData.manager_id ? 
    await getProjectManagerById(currentData.manager_id) : null;
  const newManager = await getProjectManagerById(managerId);
  
  if (!newManager) {
    throw new Error("מנהל הפרויקט לא נמצא");
  }
  
  // Update the project with the new manager
  await updateProject(projectId, { manager_id: managerId });
  
  // Create log entry
  const oldManagerName = oldManager?.full_name ?? "ללא מנהל";
  
  createLog(
    projectId, 
    "שינוי מנהל פרויקט", 
    "פרויקט", 
    `מנהל הפרויקט שונה מ"${oldManagerName}" ל"${newManager.full_name}"`,
    { manager: oldManagerName },
    { manager: newManager.full_name }
  );
  
  revalidatePath(`/projects/${projectId}`);
}
