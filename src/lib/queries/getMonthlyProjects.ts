import { db } from '@/db'
import { projects, users } from '@/db/schema'
import { sql, eq } from 'drizzle-orm'

interface MonthlyCount {
  month: string;
  total_count: number;
  user_count: number;
}

export async function getMonthlyProjects(kinde_id: string): Promise<MonthlyCount[]> {
  // First get the user's internal ID from the users table
  const userResult = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.kinde_id, kinde_id))
    .limit(1);

  const userId = userResult[0]?.id;

  // Now use this ID to query the projects
  const result = await db
    .select({
      month: sql<string>`TO_CHAR(start_date, 'MM:YY')`,
      total_count: sql<number>`COUNT(DISTINCT id)`,
      user_count: sql<number>`SUM(CASE WHEN owner_id = ${userId} THEN 1 ELSE 0 END)`
    })
    .from(projects)
    .where(
      sql`start_date >= CURRENT_DATE - INTERVAL '12 months'`
    )
    .groupBy(sql`TO_CHAR(start_date, 'MM:YY')`)
    .orderBy(sql`MIN(start_date)`);

  return result;
}