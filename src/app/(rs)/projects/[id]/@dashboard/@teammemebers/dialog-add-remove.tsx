'use client'
import { useState, Suspense } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { User } from "@/zod-schemas/users"
import { UserList } from "@/components/user/UserList"
import { UserListSkeleton } from "@/components/user/UserList"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import { UserAvatar } from "@/components/user/UserAvatar"
import { InvitedUser } from "@/zod-schemas/users"
import { useParams } from "next/navigation";

export default function NewMessageDialog({project_users}: {project_users: InvitedUser[]}) {
  const {id} = useParams();
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<InvitedUser[]>(project_users)

  const handleUserSelection = (user: User) => {

    const newInvitedUser: InvitedUser = {
      user: user,
      joined_date: new Date(),
      added_by: {id: "-1"}
    }
    setSelectedUsers(prev =>
      prev.some(u => u.user.id === user.id)
        ? prev.filter(u => u.user.id !== user.id)
        : [...prev, newInvitedUser]
    )
  }
//   const projectEditor: ProjectEditor = {
//     project_id: parseInt(id),
//     editor_id: user.id,
//     added_by: user.id,
//     is_active: true,
//     added_at: new Date(),
//     id: 0
// }


  const handleContinue = async() => {
    // Implement the continue logic here
    const response = await fetch(`/api/projects/${id}/editors`, {
      method: 'POST',
      body: JSON.stringify(selectedUsers)
    })
    if(response.ok) {
      console.log('Users added successfully')
    } else {
      console.error('Failed to add users')
    }
    console.log('Continuing with selected users:', selectedUsers)
    setOpen(false)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right">הוסף אישים לפרוייקט</DialogTitle>
          <p className="text-sm text-muted-foreground text-right">
            הוסף אישים לפרוייקט שלך
          </p>

        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Input
            placeholder="חפש אישים..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}

          />
          
          <Suspense fallback={<UserListSkeleton />}>
            <UserList
              search={search}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelection}
            />
          </Suspense>
          
          <DialogFooter>
            <div className="flex flex-col gap-2">
              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  {selectedUsers.map(user => (
                    <UserAvatar key={user.user.id} user={user.user} />
                  ))}
                </div>
              )}
              <Button
                variant="secondary"
                disabled={selectedUsers.length === 0}
                onClick={handleContinue}
              >
                המשך ({selectedUsers.length})
              </Button>

            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}