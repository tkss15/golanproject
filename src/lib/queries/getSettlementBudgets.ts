import { db } from '@/db'
import { settlements, projectSettlements } from '@/db/schema'
import { sql, eq } from 'drizzle-orm'

export async function getSettlementBudgets() {
    const result = await db
        .select({
            settlement_name: settlements.name,
            total_budget: sql<number>`COALESCE(SUM(${projectSettlements.budget_allocation}), 0)`
        })
        .from(settlements)
        .leftJoin(projectSettlements, eq(settlements.settlement_id, projectSettlements.settlement_id))
        .groupBy(settlements.settlement_id, settlements.name)
        .orderBy(settlements.name);

    return result;
}