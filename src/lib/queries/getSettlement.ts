import { db } from '@/db'
import { settlements } from '@/db/schema'
import { eq } from 'drizzle-orm'


export async function getSettlement(id: number) {
    const settlement = await db.select()
            .from(settlements)
            .where((eq(settlements.settlement_id, id))) // returns array.
    return settlement[0]; 
}