import { getAllDepartmentsWithCount } from "@/lib/queries/getAllDepartments";
import DepartmentsTable from './departmentstable';
import { AddDepartmentDialog } from "./department-dialog";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = {
    title: 'מחלקות',
}

export default async function getDepartments() {
    return <>
        <Suspense fallback={<Loading/>}>
            <FetchDepartments />
        </Suspense>
    </>
} 

async function FetchDepartments() {
    const arrDepartments = await getAllDepartmentsWithCount();
    return <>
        <div className="flex justify-between">
            <h2>מחלקות</h2>
        </div>
        <DepartmentsTable arrDepartments={arrDepartments}/>
    </>
}
