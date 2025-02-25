import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { projectLogs, users } from "@/db/schema";

export async function getProjectLogs(projectId: number, limit: number = 5, offset: number = 0) {
    const logs = await db.select({
        id: projectLogs.id,
        user_first_name: users.first_name,
        user_last_name: users.last_name,
        description: projectLogs.description,
        created_at: projectLogs.created_at
    })
    .from(projectLogs)
    .where(eq(projectLogs.project_id, projectId))
    .innerJoin(users, eq(projectLogs.user_id, users.id))
    .orderBy(desc(projectLogs.created_at))
    .limit(limit)
    .offset(offset);
    return logs;
}


export async function getProjectLogsExpanded(projectId: number, limit: number = 5, offset: number = 0) {
    const logs = await db.select({
        log: projectLogs,
        user: users,
    })

    .from(projectLogs)
    .where(eq(projectLogs.project_id, projectId))
    .innerJoin(users, eq(projectLogs.user_id, users.id))
    .orderBy(desc(projectLogs.created_at))
    return logs;
}