'use client'
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import NewMessageDialog from "./dialog-add-remove";
import OverviewLayout from "../OverviewLayout";
import { InvitedUser } from "@/zod-schemas/users";
import { useProject } from "@/components/ProjectContext";

export default function TeamMembersPage({project_users}: {project_users: InvitedUser[]}) {
    // if (!searchParams.project_id) return null  
    const {editMode, setEditMode, editing} = useProject();
    const header = (
      <div className="flex justify-between w-full">
        <p>חברי צוות</p>
        <NewMessageDialog project_users={project_users} />
      </div>
    )
    return (
        <OverviewLayout header={editing ? header : "חברי צוות"}>
          <div className="flex flex-wrap gap-4">
            {project_users.length === 0 && <p>לא נמצאו חברי צוות</p>}
            {project_users.map((name, index) => (

              <div key={index} className="flex items-center">
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage src={`/placeholder.svg`} />
                  {name.user?.first_name && name.user?.last_name &&
                  <AvatarFallback>{name.user?.first_name?.charAt(0) + name.user?.last_name?.charAt(0)}</AvatarFallback>
                  }
                </Avatar>

                <div>
                  <p className="text-sm font-medium">{name.user?.first_name} {name.user?.last_name}</p>
                  {/* <p className="text-xs text-gray-500">תפקיד</p> */}
                </div>
              </div>
            ))}
          </div>
        </OverviewLayout>
    )
}
