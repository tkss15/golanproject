import { Check } from "lucide-react"
import { UserAvatar } from "./UserAvatar"
import { User } from "@/zod-schemas/users"


export function UserListItem({ 
    user, 
    isSelected, 
    onSelect 
  }: { 
    user: User
    isSelected: boolean
    onSelect: (user: User) => void 
  }) {


    return (
      <div
        onClick={() => onSelect(user)}
        className="flex items-center gap-3 hover:bg-gray-200/60 hover:rounded-md p-2 cursor-pointer"
      >
        <UserAvatar user={user} />
        <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">

            {user.first_name} {user.last_name}


          </span>
          <span className="text-sm text-muted-foreground">{user.email}</span>      


        </div>
        {isSelected && (
          <Check className="text-gray-500 ml-auto" />
        )}
      </div>
    )
  }