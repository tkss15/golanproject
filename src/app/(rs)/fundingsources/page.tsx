import { getAllFundingSources } from "@/lib/queries/getFundingSources";
import FundingTable from './foundingtable'
import { AddFundingDialog } from "./funding-dialog"
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = {
    title: 'מקורות מימון',
}

export default async function getFundingSources() {
    return <>
        <Suspense fallback={<Loading/>}>
            <FetchFundingSources />
        </Suspense>
    </>
} 

async function FetchFundingSources() {
    const arrFundingSources: Array<any> = await getAllFundingSources();
    return <>
        <div className="flex justify-between">
            <h2>מקורות מימון</h2>
        </div>
        <FundingTable arrFundingSources={arrFundingSources}/>
    </>
}



