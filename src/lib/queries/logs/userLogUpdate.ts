import { db } from "@/db";
import { projectLogs } from "@/db/schema";

interface LogData {
  projectId: number;
  userId: number;
  actionType: string;
  module: string;
  description: string;
  previousState?: any;
  newState?: any;
  metadata?: any;
}

export async function createProjectLog({
  projectId,
  userId,
  actionType,
  module,
  description,
  previousState,
  newState,
  metadata
}: LogData) {
  try {
    const log = await db.insert(projectLogs).values({
      project_id: projectId,
      user_id: userId,
      action_type: actionType,
      module: module,
      description: description,
      previous_state: previousState,
      new_state: newState,
      metadata: metadata,
      created_at: new Date()
    }).returning();

    return log[0];
  } catch (error) {
    console.error('Error creating project log:', error);
    throw error;
  }
}
