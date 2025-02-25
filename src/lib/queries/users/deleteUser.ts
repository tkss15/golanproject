import { db } from '@/db'
import { projectEditors, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { transferProjects, transferFiles, transferProejctLogs } from './trasnferFiles'
import { getToken } from '@/app/api/auth/kinde';

const DELETED_USER_ID = 99;

export async function getUserIdByKindeId(kindeId: string) {
    const user = await db.select().from(users).where(eq(users.kinde_id, kindeId));
    return user[0];
}

export async function deleteUser(userKindeId: string, toUserKindeId?: string) {
    try {
        // Todo: delete the user from kinde and from the database
        // also if the user own projects we need to delete/transfer the projects to another user
        // we also need to remove all the files / images the user uploaded ( or transfer them to another user)
        const user = await getUserIdByKindeId(userKindeId);

        if(toUserKindeId) {
            const toUser = await getUserIdByKindeId(toUserKindeId);
            await transferProjects(user, toUser);
            await transferFiles(user, toUser);
        }
        await transferProejctLogs(user);
        // // User 99 is deleted user precreated in the database
        await db.update(projectEditors).set({
            added_by: DELETED_USER_ID
        }).where(eq(projectEditors.added_by, user.id));
        await db.delete(projectEditors).where(eq(projectEditors.editor_id, user.id));
        // Delete the user from the database
        await db.delete(users).where(eq(users.id, user.id));
        await deleteUserKindeUser(userKindeId);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }   
}


export async function deleteUserKindeUser(userKindeId: string) {
    const endpoint = `${process.env.KINDE_ISSUER_URL}/api/v1/user?id=${userKindeId}`;
    try {
        const M2MToken = await getToken();
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${M2MToken.access_token}`,
            },
            body: JSON.stringify({
                is_delete_profile: true
            }),
        });
        console.log(response);  
        if(!response.ok) {
            throw new Error('Failed to delete user from Kinde');
        }
    } catch (error) {
        console.error('Error deleting user from Kinde:', error);
        throw error;
    }

}
