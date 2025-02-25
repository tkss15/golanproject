import { db } from '@/db'
import { users } from '@/db/schema'
import { ne } from 'drizzle-orm'

const DELETED_USER_ID = 99;

export async function getAllUsers() {
    const usersArr = await db.select()
            .from(users)
            .where(ne(users.id, DELETED_USER_ID))
    return usersArr
}



export async function getAllUsersPage(limit: number, offset: number) {
    const usersArr = await db.select()
    .from(users)
    .where(ne(users.id, DELETED_USER_ID))
    .limit(limit)       
    .offset(offset)


    return usersArr
}