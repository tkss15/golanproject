import { updateProjectSettlements } from "@/lib/queries/projects/updateProject";
import { projectSettlements } from "@/db/schema";
import { getProject } from "@/lib/queries/projects/getProject";
import { getMainSettlementInProject } from "@/lib/queries/getSettlementProjects";
import { createLog } from "@/lib/logs";

export async function PATCH(request: Request, {params}: {params: {id: number, settlement: number}}) {
    try {
        const { id } = await params;
        const body: Partial<typeof projectSettlements> = await request.json();
        const project = await getProject(id);
        if(!project) {
            return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
        }
        const settlementProject = await getMainSettlementInProject(id);
        if(!settlementProject) {
            return new Response(JSON.stringify({ error: 'Settlement not found' }), { status: 404 });
        }
        const {settlementId} = settlementProject;
        let description = ''
        if(body.milestones) {
            description = 'עדכון אבני דרך בפרויקט'
        }
        if(body.start_date || body.end_date) {
            description = 'עדכון תקופת הפרויקט'
        }
        if(body.milestones && body.start_date && body.end_date) {
            description = 'עדכון אבני דרך ותקופת הפרויקט'
        }
        await createLog(id, 'update', 'milestones', description, null, body);
        await updateProjectSettlements(id, settlementId, body);
      return new Response(JSON.stringify({ message: 'Project settlements updated successfully' }), { status: 200 });
    }
    catch (error) {
        console.error('Error updating project:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

}
