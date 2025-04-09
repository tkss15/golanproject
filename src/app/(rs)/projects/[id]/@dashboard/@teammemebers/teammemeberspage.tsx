'use client'
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import NewMessageDialog from "./dialog-add-remove";
import OverviewLayout from "../OverviewLayout";
import { InvitedUser } from "@/zod-schemas/users";
import { useProject } from "@/components/ProjectContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamMembersPage({project_users}: {project_users: InvitedUser[]}) {
    // if (!searchParams.project_id) return null  
    const {editMode, setEditMode, editing} = useProject();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<InvitedUser[]>(project_users);
    const params = useParams();
    const projectId = params.id as string;
    
    // Use useEffect to handle loading state on client-side only
    useEffect(() => {
      // Initial mount with no loading
      setIsLoading(false);
      setUsers(project_users);
    }, [project_users]);
    
    const handleRoleChange = async (userId: string, newRole: string) => {
      setIsLoading(true);
      try {
        // Update locally first for immediate feedback
        const updatedUsers = users.map(user => {
          if (user.user.id === userId) {
            return { ...user, role: newRole };
          }
          return user;
        });
        setUsers(updatedUsers);
        
        // Send the update to the server
        const response = await fetch(`/api/projects/${projectId}/editors/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            role: newRole
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update role');
        }
      } catch (error) {
        console.error('Error updating role:', error);
        // Revert to original state if there's an error
        setUsers(project_users);
      } finally {
        setIsLoading(false);
      }
    };
    
    const header = (
      <div className="flex justify-between w-full">
        <p>חברי צוות</p>
        <NewMessageDialog project_users={users} />
      </div>
    )
    return (
        <OverviewLayout header={editing ? header : "חברי צוות"}>
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-32 rounded-md" />
                <Skeleton className="h-12 w-32 rounded-md" />
                <Skeleton className="h-12 w-32 rounded-md" />
                <Skeleton className="h-12 w-32 rounded-md" />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {users.length === 0 && <p>לא נמצאו חברי צוות</p>}
              {users.map((name, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md w-48">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={`/placeholder.svg`} />
                      {name.user?.first_name && name.user?.last_name &&
                      <AvatarFallback>{name.user?.first_name?.charAt(0) + name.user?.last_name?.charAt(0)}</AvatarFallback>
                      }
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{name.user?.first_name} {name.user?.last_name}</p>
                      <p className="text-xs text-gray-500">{name.role || 'viewer'}</p>
                    </div>
                  </div>
                  {editing && (
                    <select 
                      className="text-xs p-1 border rounded"
                      value={name.role || 'viewer'}
                      onChange={(e) => handleRoleChange(name.user.id, e.target.value)}
                    >
                      <option value="viewer">צופה</option>
                      <option value="editor">עורך</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </OverviewLayout>
    )
}
