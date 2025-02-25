import { db } from '@/db'
import { projectFiles, users } from '@/db/schema'
// import { eq } from 'drizzle-orm'


/*

*/
export type NewUser = {
    id: string;
    kind_id: string;
    email: string;
    first_name: string;
    last_name: string;
    picture: number;
    role: string;
    is_suspended: boolean;
    is_active: boolean;
    created_at: Date;
    last_login: Date;
}

function validateUserData(newUser: NewUser) {
    if (!newUser.id) throw new Error('User ID is required');
    if (!newUser.kind_id) throw new Error('Kind ID is required');
    if (!newUser.email) throw new Error('Email is required');
    if (!newUser.first_name) throw new Error('First name is required');
    if (!newUser.last_name) throw new Error('Last name is required');
}


export async function createUser(newUser: NewUser) {
    validateUserData(newUser);
    
    try {
        const createdUser = await db.insert(users)
            .values({
                kinde_id: newUser.kind_id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                picture: newUser.picture,
                role: newUser.role ?? 'user',
                is_suspended: false,
                is_active: true,
                created_at: new Date(),
                last_login: new Date(),
            })
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

        return createdUser[0];
    } catch (error) {
        throw new Error(`Failed to insert file: ${error.message}`);
    }
}