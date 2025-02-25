import { getSettlementstatisics } from "@/lib/queries/getSettlementStatistics";
import { getYearlyProjects } from "@/lib/queries/projects/getYearlyProjects";
import { BackButton } from "@/components/BackButton";
import CityPage from '@/components/CityPage';
import { getSettlement } from "@/lib/queries/getSettlement";

export default async function SettlementStatisicsFormPage({
    searchParams,
}: {
    searchParams: Promise<{[key: string] : string | undefined}>
})
{
    try {
        const { settlement_id } = await searchParams;
        // Edit customer form
        if(settlement_id)
        {
            const settlement = await getSettlement(parseInt(settlement_id));
            const settle_statisitcs = await getSettlementstatisics(parseInt(settlement_id));
            const yearlyProjects = await getYearlyProjects(parseInt(settlement_id));
            if(!settle_statisitcs)
            {
                return (
                    <>
                        <h2 className="text-2xl mb-2"> Settlement ID #{settlement_id} not found</h2>
                        <BackButton title="Go Back" variant={'default'}/>
                    </>
                )
            }
            //@type
            return <CityPage 
            settlement_statistics={settle_statisitcs as any} 
            settlement={settlement as any}
            projects={yearlyProjects as any}
            />
            // put customer form component
        } else {
            // new customer form component
        }
    } catch (error) {
        if( error instanceof Error )
        {
            throw error;
        }
    }
}