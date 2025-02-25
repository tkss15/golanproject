import { projectLogs } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function deleteProjectLogs(project_id: number, tx?: any) {
    const result = await (tx || db)
      .delete(projectLogs)
      .where(eq(projectLogs.project_id, project_id))
    return result;
}

