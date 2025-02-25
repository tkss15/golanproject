import { db } from '@/db'
import { fundingSources } from '@/db/schema'


export async function getAllFundingSources() {
    const fundingArr = await db.select()
            .from(fundingSources)
    return fundingArr;
}