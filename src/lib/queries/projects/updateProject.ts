import { projects, projectSettlements } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";

export async function updateProject(projectId: number, updates: Partial<typeof projects>) {
    // Convert any date strings to Date objects
    const sanitizedUpdates = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => {
            if (value && typeof value === 'string' && (key.includes('date') || key.includes('_at'))) {
                return [key, new Date(value)];
            }
            return [key, value];
        })
    );

    const project = await db.update(projects)
        .set(sanitizedUpdates)
        .where(eq(projects.id, projectId))
        .returning();
    return project;
}



export async function updateProjectSettlements(projectId: number, settlementId: number, updates: Partial<typeof projectSettlements>) {
        // Convert any date strings to Date objects
        const sanitizedUpdates = Object.fromEntries(
            Object.entries(updates).map(([key, value]) => {
                if (value && typeof value === 'string' && (key.includes('date') || key.includes('_at'))) {
                    return [key, new Date(value)];
                }
                return [key, value];
            })
        );
    const arrProjectSettlments = await db.update(projectSettlements)
        .set(sanitizedUpdates)
        .where(and(eq(projectSettlements.project_id, projectId), eq(projectSettlements.settlement_id, settlementId)))
        .returning();
    return arrProjectSettlments;
}
