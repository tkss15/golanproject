import { getAllProjectManagers } from "@/lib/queries/getProjectManagers";
import ManagersTable from './managerstable';
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = {
    title: 'מנהלי פרויקטים חיצוניים',
}

export default async function getProjectManagers() {
    return <>
        <Suspense fallback={<Loading/>}>
            <FetchProjectManagers />
        </Suspense>
    </>
} 

async function FetchProjectManagers() {
    const projectManagers = await getAllProjectManagers();
    return <>
        <div className="flex justify-between">
            <h2>מנהלי פרויקטים חיצוניים</h2>
        </div>
        <ManagersTable projectManagers={projectManagers}/>
    </>
}
