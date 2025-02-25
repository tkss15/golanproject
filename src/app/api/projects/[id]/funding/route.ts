// export async function PATCH(request: Request, {params}: {params: {id: number}}) {
//     const {id} = await params;
//     const body = await request.json();
//     console.log(body);
//     return new Response(JSON.stringify({message: 'Funding updated successfully'}), {status: 200});
// }

import { getUserByKindId } from "@/lib/queries/users/getUser";
import { createLog } from "@/lib/logs";
import { createProjectFundings } from "@/lib/queries/funding/createProjectFunding";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NewProjectFundingSource } from "@/zod-schemas/project_funding_sources";
import { getProjectFundings } from "@/lib/queries/funding/getProjectFundings";
import { deleteProjectFundings } from "@/lib/queries/funding/deleteProjectFundings";
import { updateProjectFunding } from "@/lib/queries/funding/updateProjectFunding";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        // Extract and validate project ID
        const { id } = await params;
        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            return new Response(JSON.stringify({ error: "Invalid project ID" }), { status: 400 });
        }
        // Get all fundings from request body
        const {fundings}: {fundings: Array<NewProjectFundingSource>} = await request.json();
        console.log(fundings);
        // Get current user (inviter) information
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();
        if (!kindeUser?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        
        const inviter = await getUserByKindId(kindeUser.id);
        
        // Get current project editors
        const currentFundings = await getProjectFundings(projectId);
        const currentFundingIds = currentFundings.map(funding => {
            return {
                project_id: funding.project_id,
                funding_source_id: funding.funding_source_id,
            }
        });
        const newFundingIds = fundings.map(funding => {
            return {
                project_id: funding.project_id,
                funding_source_id: funding.funding_source_id,
            }
        });
        console.log(currentFundings);
        console.log(newFundingIds);
        // השוואה מדויקת יותר של מקורות מימון קיימים וחדשים
        const fundingsToAdd = fundings.filter(newFunding => 
            !currentFundings.some(current => 
                current.funding_source_id === newFunding.funding_source_id
            )
        );

        const fundingsToRemove = currentFundings.filter(current =>
            !fundings.some(newFunding => 
                newFunding.funding_source_id === current.funding_source_id
            )
        );

        const fundingsToUpdate = fundings.filter(newFunding =>
            currentFundings.some(current => 
                current.funding_source_id === newFunding.funding_source_id &&
                (current.allocated_amount !== newFunding.allocated_amount ||
                 current.allocation_date?.toISOString() !== newFunding.allocation_date?.toISOString())
            )
        );

        // יצירת אובייקטים למקורות מימון חדשים
        const newFundingObjects = fundingsToAdd.map(funding => ({
            project_id: projectId,
            funding_source_id: funding.funding_source_id,
            allocated_amount: funding.allocated_amount,
            allocation_date: funding.allocation_date || new Date(),
        }));

        // ביצוע פעולות מול בסיס הנתונים
        if (fundingsToAdd.length > 0) {
            await createProjectFundings(newFundingObjects);
        }

        if (fundingsToUpdate.length > 0) {
            await Promise.all(fundingsToUpdate.map(funding => 
                updateProjectFunding(projectId, funding.funding_source_id, {
                    allocated_amount: funding.allocated_amount,
                    allocation_date: funding.allocation_date
                })
            ));
        }

        if (fundingsToRemove.length > 0) {
            await deleteProjectFundings(projectId, fundingsToRemove.map(f => ({
                project_id: projectId,
                funding_source_id: f.funding_source_id
            })));
        }

        // יצירת תיאור מפורט יותר ליומן
        const logDescription = createLogDescription(
            fundingsToAdd.length, 
            fundingsToUpdate.length,
            fundingsToRemove.length
        );

        // רישום השינויים ביומן
        await createLog(
            projectId,
            'update_fundings',
            'project',
            logDescription,
            currentFundings,
            [...newFundingObjects, ...fundingsToUpdate],
            { 
                added: fundingsToAdd, 
                updated: fundingsToUpdate,
                removed: fundingsToRemove 
            }
        );

        return new Response(JSON.stringify({ 
            added: fundingsToAdd.length,
            updated: fundingsToUpdate.length,
            removed: fundingsToRemove.length
        }), { status: 200 });

    } catch (error) {
        console.error('Error updating project fundings:', error);
        return new Response(
            JSON.stringify({ 
                error: "Failed to update project fundings",
                details: error instanceof Error ? error.message : "Unknown error"
            }), 
            { status: 500 }
        );
    }
}

function createLogDescription(addedCount: number, updatedCount: number, removedCount: number): string {
    const parts: string[] = [];
    
    if (addedCount > 0) {
        parts.push(`נוספו ${addedCount} מקורות מימון`);
    }
    
    if (updatedCount > 0) {
        parts.push(`עודכנו ${updatedCount} מקורות מימון`);
    }
    
    if (removedCount > 0) {
        parts.push(`הוסרו ${removedCount} מקורות מימון`);
    }
    
    return parts.join(' ו') + ' מהפרוייקט';
}