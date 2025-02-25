import { useUsers } from "@/hooks/useUsers"
import { InvitedUser } from "@/zod-schemas/users"
import { Button } from "../ui/button"
import { UserListItem } from "./UserListItem"
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

export function UserList({ 
    search, 
    selectedUsers, 
    onUserSelect,
    avoidSelf,
  }: {
    search: string
    selectedUsers: InvitedUser[]
    onUserSelect: (user: InvitedUser) => void
    avoidSelf?: string
  }) {
    console.log(avoidSelf);
    const { users, loading, hasMore, loadMore } = useUsers(search)
    if (loading && users.length === 0) {
      return <UserListSkeleton />
    }

    const filteredUsers = avoidSelf ? users.filter(user => user.kinde_id !== avoidSelf) : users
    return (
      <div className="space-y-4 max-h-[240px] overflow-y-auto border-2 rounded-md border-gray-200 p-3">
        {users.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            אין משתמשים שמתאימים לחיפוש
          </p>
        )}
        {filteredUsers.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            isSelected={selectedUsers.some(u => u.user.id === user.id)}
            onSelect={onUserSelect}

          />
        ))}
        {hasMore && (
          <Button 
            variant="outline" 
            onClick={loadMore} 
            className="w-full"
          >
            Load more
          </Button>
        )}
      </div>
    )
  }

  export function UserListSkeleton() {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (

          <div key={index} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex flex-col flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }