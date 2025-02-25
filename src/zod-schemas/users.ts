// types.ts
export interface User {
    id: string
    kinde_id: string
    email: string
    first_name: string
    last_name: string
    picture?: string
    role: string
    created_at: Date
  }
  export interface InvitedUser  {
    user: User,
    joined_date: Date,
    added_by: Pick<User, 'id'>
  }
