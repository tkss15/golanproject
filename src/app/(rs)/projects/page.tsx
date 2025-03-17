import { getAllDepartmentsWithCount } from "@/lib/queries/getAllDepartments";
import { Suspense } from "react";
import { getMyProjects } from "@/lib/queries/getProjectsByDepartment";
import { getAllFundingSources } from "@/lib/queries/getFundingSources";
import Loading from "@/app/loading";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindId } from "@/lib/queries/users/getUser";
import { redirect } from "next/navigation";
import ProjectPage from "./project-pages";
import type { User } from '@/zod-schemas/users';
// Define types for better code clarity
interface SearchParams {
  department_id?: string;
  prop_sort_by?: string;
  funder_id?: string;
  page_number?: string;
  page_size?: string;
  start_date?: string;
  end_date?: string;
}

// LoadingSkeleton component for Suspense fallback
function LoadingSkeleton() {
  return <Loading />;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Authentication check
  const { getUser } = getKindeServerSession();
  const userResult = await getUser();
  const {id} = userResult ? userResult : { id: null };
  if(!id)
    redirect('/home')

  const myUser = await getUserByKindId(id);
  if (!userResult?.id) {
    redirect('/home');
  }
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProjectsContent searchParams={searchParams} user={myUser} />
    </Suspense>
  );
}

// Separate component for fetching and displaying projects
async function ProjectsContent({ 
  searchParams, 
  user 
}: { 
  searchParams: SearchParams;
  user: User;
}) {
  // Extract and parse search parameters
  const { 
    department_id, 
    prop_sort_by, 
    funder_id, 
    page_number, 
    page_size,
    start_date,
    end_date 
  } = await searchParams;
  
  const currentSorting = prop_sort_by ?? 'מחלקות';
  const pageSize = parseInt(page_size ?? '5');
  const pageNumber = parseInt(page_number ?? '1');
  const departmentId = department_id ?? '';
  const funderId = funder_id ?? '';
  const startDate = start_date ?? undefined;
  const endDate = end_date ?? undefined;
  
  // Fetch required data in parallel
  const [projects, departments, fundingSources] = await Promise.all([
    getMyProjects(
      pageSize,
      (pageNumber - 1) * pageSize,
      user.id,
      departmentId,
      startDate,
      endDate,
      user.role === 'admin'
    ),
    getAllDepartmentsWithCount(),
    getAllFundingSources()
  ]);
  
  // If projects can't be loaded, display a friendly message
  if (!projects || !projects.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-xl font-semibold mb-4">אין פרוייקטים זמינים</h2>
        <p>לא נמצאו פרוייקטים שמתאימים לחיפוש שלך</p>
      </div>
    );
  }
  
  return (
    <ProjectPage
      prop_sort_by={currentSorting as any} 
      prop_departments={departments || []}
      prop_department_id={departmentId ? parseInt(departmentId) : undefined}
      prop_funder_id={funderId ? parseInt(funderId) : undefined}
      prop_funding_sources={fundingSources || []}
      projects={projects.data}
      count={projects.count}
      start_date={startDate}
      end_date={endDate}
    />
  );
}
