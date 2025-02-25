import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/zod-schemas/users"
export function UserAvatar({ user }: { user: User }) {
    return (
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.picture} />
        <AvatarFallback>
          {user.first_name[0]}
          {user.last_name[0]}
        </AvatarFallback>
      </Avatar>
    )
  }