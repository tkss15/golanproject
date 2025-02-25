import { getUserByKindId } from "@/lib/queries/users/getUser";
import { createLog } from "@/lib/logs";
import { ProjectEditor } from "@/zod-schemas/project_editors";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAllUsersProject } from "@/lib/queries/getAllUsersProject";
import { createProjectEditors, deleteProjectEditors } from "@/lib/queries/projects/editors/createProjectEditor";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        // Extract and validate project ID
        const { id } = await params;
        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            return new Response(JSON.stringify({ error: "Invalid project ID" }), { status: 400 });
        }

        // Get new editors from request body
        const newEditors: Array<ProjectEditor> = await request.json();
        console.log(newEditors);
        
        // Get current user (inviter) information
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();
        if (!kindeUser?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        
        const inviter = await getUserByKindId(kindeUser.id);
        
        // Get current project editors
        const currentEditors = await getAllUsersProject(projectId);
        const currentEditorIds = currentEditors.map(editor => editor.user?.id);
        const newEditorIds = newEditors.map(editor => editor.user?.id);

        // Determine editors to add and remove
        const editorsToAdd = newEditorIds.filter(id => id !== undefined && !currentEditorIds.includes(id));
        const editorsToRemove = currentEditorIds.filter(id => id !== undefined && !newEditorIds.includes(id));

        console.log('Added editors', editorsToAdd);
        console.log('Removed editors', editorsToRemove);

        // Create objects for new editors
        const projectEditorObjects = editorsToAdd.map(editorId => ({
            project_id: projectId,
            editor_id: editorId,
            added_by: inviter.id,
            added_at: new Date(),
            is_active: true,
        }));

        // // Perform the database operations
        if (editorsToAdd.length > 0) {
            await createProjectEditors(projectEditorObjects);
        }

        if (editorsToRemove.length > 0) {
            await deleteProjectEditors(projectId, editorsToRemove);
        }

        // Create descriptive log message
        const logDescription = createLogDescription(editorsToAdd.length, editorsToRemove.length);

        // Log the changes
        await createLog(
            projectId,
            'update_editors',
            'project',
            logDescription,
            currentEditors,
            projectEditorObjects,
            { added: editorsToAdd, removed: editorsToRemove }
        );

        // Update the editors in the database
        // const updatedEditors = await updateProjectEditors(projectId, newEditorIds);

        return new Response(JSON.stringify('nothing'), { status: 200 });


    } catch (error) {
        console.error('Error updating project editors:', error);
        return new Response(
            JSON.stringify({ 
                error: "Failed to update project editors",
                details: error instanceof Error ? error.message : "Unknown error"
            }), 
            { status: 500 }
        );
    }
}

function createLogDescription(addedCount: number, removedCount: number): string {
    const parts: string[] = [];
    
    if (addedCount > 0) {
        parts.push(`נוספו ${addedCount} משתמשים`);
    }
    
    if (removedCount > 0) {
        parts.push(`הוסרו ${removedCount} משתמשים`);
    }
    
    return parts.join(' ו') + ' מהפרוייקט';
}