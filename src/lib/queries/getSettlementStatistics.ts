import { db } from '@/db'
import { settlement_statistics } from '@/db/schema'
import { eq } from 'drizzle-orm'


export async function getSettlementstatisics(id: number) {
    const Settlementstatisics = await db.select()
            .from(settlement_statistics)
            .where((eq(settlement_statistics.settlement_id, id)))
            .orderBy(settlement_statistics.updatedAt) // returns array.
    console.log(Settlementstatisics);
    return Settlementstatisics; 
}