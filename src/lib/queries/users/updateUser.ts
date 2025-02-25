import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'


/*

*/
type KindeUser = {
    given_name: string;
    family_name: string;
    role: string;
    email: string;
}
type User = {
    id: number;
    role: string;
    email: string;
    kinde_id: string;
    first_name: string | null;
    last_name: string | null;
    picture: string | null;
    created_at: Date | null;
    last_login: Date | null;
    is_suspended: boolean | null;
    is_active: boolean | null;
}

export async function updateUser(newUser: User, userOptions: Partial<KindeUser>) {
    try {
        const createdUser = await db.update(users)
            .set({
                first_name: userOptions.given_name,
                last_name: userOptions.family_name,
                role: userOptions.role,
                email: userOptions.email,
            })
            .where(eq(users.kinde_id, newUser.kinde_id))
            .returning({
                kinde_id: users.kinde_id,
                email: users.email,
                first_name: users.first_name,
                last_name: users.last_name,
                picture: users.picture,
                role: users.role,
                is_suspended: users.is_suspended,
                is_active: users.is_active,
                created_at: users.created_at,
                last_login: users.last_login
            });
        console.log(userOptions);
        return createdUser[0];
    } catch (error) {
        throw new Error(`Failed to insert file: ${error.message}`);
    }
}