import { getMainSettlementInProject } from "@/lib/queries/getSettlementProjects";

import Milestones from "./milestones";
export default async function ProjectHeader({
    params,
  }: {
    params: { id?: string };
  }) {
    const { id:project_id } = await params;
    if(!project_id)
        return <p>Waiting for ID</p>
    const settlementProject = await getMainSettlementInProject(parseInt(project_id));
    if(!settlementProject)
        return <p>אנא הגדר לפרויקט ישוב ראשי.</p>
    const {startDate, endDate, milestoneProgress} = settlementProject;
    const milestones = settlementProject.milestones.milestones;
    const milestoneProg = {
      total_milestones: milestones.length,
      completed: milestones.filter(milestone => milestone.status === 'completed').length,
      in_progress: milestones.filter(milestone => milestone.status === 'in_progress').length,
      not_started: milestones.filter(milestone => milestone.status !== 'completed' && milestone.status !== 'in_progress').length,
    }

    return (  
      <Milestones startDate={startDate} endDate={endDate} milestones={settlementProject.milestones.milestones} />
    )
}
