import { projectSettlements } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function deleteProjectSettlements(project_id: number, tx?: any) {
    const result = await (tx || db)
      .delete(projectSettlements)
      .where(eq(projectSettlements.project_id, project_id))
    return result;
}

