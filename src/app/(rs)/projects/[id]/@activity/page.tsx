import { getProjectLogsExpanded } from "@/lib/queries/logs/getProjectLogs";
import { ActivityLog } from "./actrivity-log";
import { AddNote } from "./AddNote";

export default async function ProjectActivity({
    params,
}: {
    params: { id?: string };
}) {
    const { id: project_id } = await params;
    if(!project_id)
        return <p>Waiting for ID</p>
    
    // Fetch initial logs from server
    const logs = await getProjectLogsExpanded(parseInt(project_id));
    
    return (
        <div>
            <ActivityLog logs={logs} project_id={project_id}/>
        </div>
    )
}
