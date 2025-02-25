import { db } from '@/db'
import { projects, fundingSources, projectFundingSources } from '@/db/schema'
import { sql } from 'drizzle-orm'
import { eq, and, or, inArray } from 'drizzle-orm'

export async function getTopFundingSources() {
    const result = await db
        .select({
            source_name: sql<string>`COALESCE(${fundingSources.source_name}, 'ללא מקור')`,  // Handle null values
            total_amount: sql<number>`COALESCE(SUM(${projectFundingSources.allocated_amount}), 0)`
        })
        .from(projectFundingSources)
        .leftJoin(fundingSources, eq(fundingSources.id, projectFundingSources.funding_source_id))
        .leftJoin(projects, eq(projects.id, projectFundingSources.project_id))
        .where(inArray(projects.status, ['1', '2', '3']))
        .groupBy(fundingSources.id, fundingSources.source_name)
        .orderBy(sql`SUM(${projectFundingSources.allocated_amount}) DESC`)
        .limit(6);

    // Ensure we never return null values
    return result.map(item => ({
        source_name: item.source_name || 'ללא מקור',
        total_amount: item.total_amount || 0
    }));
}
