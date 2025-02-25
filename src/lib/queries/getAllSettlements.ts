import { db } from '@/db'
import { settlements } from '@/db/schema'

export async function getAllSettlements() {
    const settlementArr = await db.select()
            .from(settlements)
    return settlementArr
}