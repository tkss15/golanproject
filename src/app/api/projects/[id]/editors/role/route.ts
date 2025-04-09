import { getUserByKindId } from "@/lib/queries/users/getUser";
import { createLog } from "@/lib/logs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { updateUserRole } from "@/lib/queries/projects/editors/updateUserRole";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        // Extract and validate project ID
        const { id } = await params;
        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            return new Response(JSON.stringify({ error: "Invalid project ID" }), { status: 400 });
        }

        // Get role change details from request body
        const { userId, role } = await request.json();
        
        if (!userId || !role) {
            return new Response(JSON.stringify({ error: "User ID and role are required" }), { status: 400 });
        }
        
        // Validate role
        if (role !== 'viewer' && role !== 'editor') {
            return new Response(JSON.stringify({ error: "Invalid role. Must be 'viewer' or 'editor'" }), { status: 400 });
        }

        // Get current user information
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();
        if (!kindeUser?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        
        const currentUser = await getUserByKindId(kindeUser.id);

        // Update the user's role in the database
        await updateUserRole(projectId, parseInt(userId), role);

        // Log the change
        await createLog(
            projectId,
            'update_role',
            'team_members',
            `תפקיד המשתמש שונה ל-${role === 'editor' ? 'עורך' : 'צופה'}`,
            { previousRole: role === 'editor' ? 'viewer' : 'editor' },
            { newRole: role },
            { userId, updatedBy: currentUser.id }
        );

        return new Response(JSON.stringify({ 
            success: true,
            message: `User role updated to ${role}`
        }), { status: 200 });

    } catch (error) {
        console.error('Error updating user role:', error);
        return new Response(
            JSON.stringify({ 
                error: "Failed to update user role",
                details: error instanceof Error ? error.message : "Unknown error"
            }), 
            { status: 500 }
        );
    }
}
