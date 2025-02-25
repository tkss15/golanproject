import { getAllUsersProject } from "@/lib/queries/getAllUsersProject";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import NewMessageDialog from "./dialog-add-remove";
import OverviewLayout from "../OverviewLayout";
import TeamMembersPage from "./teammemeberspage";

export default async function ProjectHeader({
    params,
  }: {
    params: { id?: string };

  }) {
    const { id:project_id } = await params;
    if(!project_id)
        return <p>Waiting for ID</p>
    const users = await getAllUsersProject(parseInt(project_id));
    // if (!searchParams.project_id) return null  

    return (
          <TeamMembersPage project_users={users} /> 
    )
}

