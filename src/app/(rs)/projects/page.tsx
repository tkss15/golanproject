import { getAllDepartmentsWithCount } from "@/lib/queries/getAllDepartments";
import { BackButton } from "@/components/BackButton";
import ProjectPage from "./project-pages";
import { Suspense } from "react";
import { getAllProjectFromFundingSorce } from "@/lib/queries/getAllProjectFromFundingSorce";
import { getProjectsByDepartmentAndSettlement,getProjects, getProjectsCount, getProjectsByDepartmentAndSettlementCount } from '@/lib/queries/getProjectsByDepartment';
import {getProjectsByIds} from '@/lib/queries/getProjectsByDepartment';
import { getAllFundingSources } from "@/lib/queries/getFundingSources";
import Loading from "@/app/loading";

export default async function ProjectDirectionPage ({
    searchParams,
}: {
    searchParams: Promise<{[key: string] : string | undefined}>
}) {
    const {department_id,prop_sort_by, funder_id, page_number, page_size} = await searchParams;
    // console.log(department_id,project_id,funder_id);
    const currentSorting = (prop_sort_by ?? 'מחלקות')
    const pageSize = parseInt(page_size ?? '5');
    const pageNumber = parseInt(page_number ?? '1');
    const projects = await getProjects(
        pageSize, 
        (pageNumber - 1) * pageSize, 
        (department_id ? parseInt(department_id) : undefined), 
        (funder_id ? parseInt(funder_id) : undefined)
    ) ?? [];
    return (
        <Suspense>
            <ProjectsDepartments currentSorting={currentSorting} projects={projects.data} count={projects.count} department_id={department_id ?? ''} funder_id={funder_id ?? ''}/>
        </Suspense>
    )
    // if(funder_id)
    // {
    //     return(
    //         <Suspense>
    //             <ProjectFundingSources funder_id={funder_id}/>
    //         </Suspense>
    //     )
    // }
    // else {
    //     if(department_id)
    //     {
    //         const departments: Array<any> =  await getAllDepartmentsWithCount();
    //         const proejctsFromDepartments = await getProjectsByDepartmentAndSettlement(department_id, pageSize, (pageNumber - 1) * pageSize);
    //         const count = await getProjectsByDepartmentAndSettlementCount(department_id);
    //         console.log(proejctsFromDepartments, count)
    //         if(!proejctsFromDepartments)
    //         {
    //             return <ProjectPage prop_sort_by={'מחלקות'} projects={[]} prop_departments={proejctsFromDepartments} count={0}/>
    //         }
    //         if(proejctsFromDepartments)
    //         {
    //             return (
    //                 <Suspense>
    
    //                     <ProjectPage prop_sort_by={'מחלקות'} prop_department_id={parseInt(department_id)} projects={proejctsFromDepartments} prop_departments={departments} count={count}/>
                        
    //                 </Suspense>
    //             )
    //         }
    //     }


    // }
}

async function ProjectsDepartments({currentSorting, projects, count, department_id, funder_id} : {currentSorting : string, projects : Array<any>, count : number, department_id : string, funder_id : string}) {
    const elementsSortby: Array<any> =  (currentSorting === 'מחלקות') ? await getAllDepartmentsWithCount() : await getAllFundingSources(); // Get all Funding Soruces        
    const getDepartments = await getAllDepartmentsWithCount();
    const getFundingSources = await getAllFundingSources();
    if(!elementsSortby)
    {
        return (
            <>
                <h2>אין פרוייקטים בעלי אותה מחלקת ממימון.</h2>
                <BackButton title="Go Back" variant={'default'}/>
            </>
        )
    }   
    return (
            <ProjectPage  prop_sort_by={currentSorting}  prop_departments={getDepartments} prop_department_id={department_id} prop_funder_id={funder_id} prop_funding_sources={getFundingSources} projects={projects} count={count}/> 
    )
}

async function ProjectFundingSources({funder_id} : {funder_id : string}) {
    const fundingSoucres: Array<any> =  await getAllFundingSources(); // Get all Funding Soruces        
    const projectsFromFunding = await getAllProjectFromFundingSorce(funder_id); // Find All projects within the same source
    if(!projectsFromFunding) {
        return (
            <>
                <h2>אין פרוייקטים בעלי אותה מחלקת ממימון.</h2>
                <BackButton title="Go Back" variant={'default'}/>
            </>
        )
    }
    if(projectsFromFunding)
    {
        const arrProjects = projectsFromFunding.map((element) => element.project_id ?? -1)
        
        if(!arrProjects)
        {
            return <ProjectPage prop_sort_by={'מקורות מימון'} projects={[]} prop_departments={fundingSoucres} count={0}/>
        }
        if(arrProjects)
        {
            const projects = await getProjectsByIds(arrProjects)
            if(!projects)
            {
                return <ProjectPage prop_sort_by={'מקורות מימון'} projects={[]} prop_departments={fundingSoucres} count={0}/>
            }
            return ( <ProjectPage prop_sort_by={'מקורות מימון'} prop_funder_id={parseInt(funder_id)} projects={projects} prop_departments={fundingSoucres} count={arrProjects.length}/>
            )
        }
    }
}
