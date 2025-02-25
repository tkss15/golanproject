import { projectLogs } from '@/db/schema';
import { db } from '@/db'; // Your database connection
import { projectFiles, users, projects } from '@/db/schema'; // Your schema imports
import { eq, sql } from 'drizzle-orm';


type User = typeof users.$inferSelect;
const DELETED_USER_ID = 99;
export async function transferFiles(fromUser: User, toUser: User) {
    try {
        // Perform the update
        const result = await db
          .update(projectFiles)
          .set({
            uploaded_by: toUser.id,
            description: sql`CONCAT(${projectFiles.description}, ' (Transferred from user ', ${fromUser.first_name + ' ' + fromUser.last_name}::text, ' to ', ${toUser.first_name + ' ' + toUser.last_name}::text, ')')`
          })
          .where(eq(projectFiles.uploaded_by, fromUser.id));
   
        return {
          success: true,
          message: `Successfully transferred files from user ${fromUser.first_name + ' ' + fromUser.last_name} to user ${toUser.first_name + ' ' + toUser.last_name}`,
          result
        };
   
    } catch (error) {
        console.error('Error transferring user files:', error);
        throw error;
    }
}

export async function transferProjects(fromUser: User, toUser: User) {
    try {
        // Todo: transfer all the projects the user own to another user
        const result = await db.update(projects)
        .set({
            owner_id: toUser.id,
        })
        .where(eq(projects.owner_id, fromUser.id));
        console.log(result);
        return {
            success: true,
            message: `Successfully transferred projects from user ${fromUser.first_name + ' ' + fromUser.last_name} to user ${toUser.first_name + ' ' + toUser.last_name}`,
            result
        };
    } catch (error) {
        console.error('Error transferring user projects:', error);
        throw error;
    }
}


export async function transferProejctLogs(fromUser: User) {
    // Todo: transfer all the project logs the user own to another user
    try {
        const result = await db.update(projectLogs).set({
            user_id: DELETED_USER_ID
        }).where(eq(projectLogs.user_id, fromUser.id));
        return {
            success: true,
            message: `Successfully transferred project logs from user ${fromUser.first_name + ' ' + fromUser.last_name} to user DELETED_USER_ID`,
            result
        }
    } catch (error) {
        console.error('Error transferring user project logs:', error);
        throw error;
    }
}