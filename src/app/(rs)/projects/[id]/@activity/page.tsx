import { ActivityLog } from "./actrivity-log";
import { getProjectLogsExpanded } from "@/lib/queries/logs/getProjectLogs";
export default async function ProjectActivity({
    params,
}: {
    params: { id?: string };
}) {
    const { id:project_id } = await params;
    if(!project_id)
        return <p>Waiting for ID</p>
    const logs = await getProjectLogsExpanded(parseInt(project_id));
    return (
        <div>
            <ActivityLog logs={logs} />
        </div>
    )
}