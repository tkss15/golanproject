import { db } from "@/db"
import { projects, projectEditors, projectSettlements, users } from '@/db/schema'
import { eq } from "drizzle-orm";

export const createProject = async (project: typeof projects.$inferInsert, editors: Array<string>, settlement: string, userKinde: typeof users.$inferSelect) => {
    const emptymilestone = {
        milestones: []
    }
    const sanitizedProject = Object.fromEntries(
        Object.entries(project).map(([key, value]) => {
            if (value && typeof value === 'string' && (key.includes('date') || key.includes('_at'))) {
                const dateValue = new Date(value);
                if (!isNaN(dateValue.getTime())) {
                    return [key, dateValue];
                }
            }
            return [key, value];
        })
    );
    const  createProject = await db.insert(projects).values({
        project_name: sanitizedProject.project_name,
        owner_id: sanitizedProject.owner_id,
        description: sanitizedProject.description,
        budget: sanitizedProject.budget,
        start_date: sanitizedProject.start_date,
        end_date: sanitizedProject.end_date,
        status: sanitizedProject.status,
        priority: sanitizedProject.priority,
        department_id: sanitizedProject.department_id,
        contact_email: sanitizedProject.contact_email,
        contact_phone: sanitizedProject.contact_phone,
        created_at: new Date(),
        updated_at: new Date(),
    }).returning();
    if(!createProject)
    {
        return {error: "Project creation failed"}
    }

    const createSettlement = await db.insert(projectSettlements).values({
        project_id: createProject[0].id,
        settlement_id: parseInt(settlement),
        is_main_settlement: true,
        budget_allocation: sanitizedProject.budget,
        specific_goals: {},
        settlement_status: 'active',
        milestones: emptymilestone,
        start_date: sanitizedProject.start_date,
        end_date: sanitizedProject.end_date,
        timeline_status: 'on_track',
        actual_completion_date: null,
        milestone_progress: {},
        last_updated: new Date(),
    })
    if(!createSettlement)
    {
        await db.delete(projects).where(eq(projects.id, createProject[0].id));
        return {error: "Settlement creation failed"}
    }

    const createEditors = await db.insert(projectEditors).values(editors.map(editor => (
    {
            project_id: createProject[0].id, 
            editor_id: parseInt(editor), 
            added_by: userKinde.id, 
            added_at: new Date(), 
            is_active: true
        })
    ));
    return createProject[0];
}
