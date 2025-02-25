import { createProjectLog } from "./queries/logs/userLogUpdate";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindId } from "./queries/users/getUser";

export async function createLog(projectId: number, actionType: string, module: string, description: string, previousState?: any, newState?: any, metadata?: any) {
    const session = await getKindeServerSession();
    if (!session) {
        throw new Error('User not authenticated');
    }
    const kindeUser = await session.getUser();
    if (!kindeUser) {
        throw new Error('User not found');
    }
    const user = await getUserByKindId(kindeUser.id);
    if (!user) {
        throw new Error('User not found');
    }
    const userId = user.id;
    await createProjectLog({ projectId, userId, actionType, module, description, previousState, newState, metadata });
}

