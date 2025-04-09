import { getAllDepartmentsWithCount } from "@/lib/queries/getAllDepartments";
import { deleteProject, getProject } from "@/lib/queries/projects/getProject";
import { getAllUsers } from "@/lib/queries/users/getAllUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectNameCard } from "./components/ProjectNameCard"
import { ProjectBudgetCard } from "./components/ProjectBudgetCard"
import { ProjectDepartmentsCard } from "./components/ProjectDepartmentsCard"
import { ProjectAdminCard } from "./components/ProjectAdminCard"
import { ProjectManagerCard } from "./components/ProjectManagerCard"
import { updateProject } from "@/lib/queries/projects/updateProject";
import { revalidatePath, revalidateTag } from "next/cache";
import { ProjectStatusCard } from "./components/ProjectStatusCard";
import { createLog } from "@/lib/logs";
import { statusNames } from "@/zod-schemas/projects";
import { redirect } from "next/navigation";
import { getAllProjectManagers } from "@/lib/queries/projects/getProjectManagers";
import { updateProjectManager } from "./actions";

// Server Actions
async function updateProjectName(projectId: number, name: string) {
  'use server'
  const currentData = await getProject(projectId);
  if (!currentData) {
    throw new Error("Project not found");
  }
  if(currentData.project_name === name) {
    throw new Error("שם הפרויקט כבר קיים");
  }
  await updateProject(projectId, { project_name: name });
  createLog(projectId, "שינוי שם פרויקט", "פרויקט", `שם הפרויקט שונה ל${name}`, currentData.project_name, name);
  revalidatePath(`/projects/${projectId}`);
}   

async function updateProjectBudget(projectId: number, budget: number) {
  'use server'
  const currentData = await getProject(projectId);
  if (!currentData) {
    throw new Error("Project not found");
  }
  if(currentData.budget === budget) {
    throw new Error("לא בוצע שינוי בתקציב");
  }
  await updateProject(projectId, { budget: budget });
  createLog(projectId, "שינוי תקציב פרויקט", "פרויקט", `תקציב הפרויקט שונה ל${budget}`, currentData.budget.toString(), budget.toString());
  revalidatePath(`/projects/${projectId}`);
}


async function updateProjectDepartments(projectId: number, department_id: number) {
  'use server'
  const currentData = await getProject(projectId);
  if (!currentData) {
    throw new Error("Project not found");
  }
  if(currentData.department_id === department_id) {
    throw new Error("המחלקה כבר קיימת");
  }
  await updateProject(projectId, { department_id: department_id });
  createLog(projectId, "שינוי מחלקה פרויקט", "פרויקט", `המחלקה שונה ל${department_id}`, currentData.department_id.toString(), department_id.toString());
  revalidatePath(`/projects/${projectId}`);
}

async function updateProjectStatus(projectId: number, status: string, reason: string | undefined) {
  'use server'
  const currentData = await getProject(projectId);
  if (!currentData) {
    throw new Error("Project not found");
  }
  const statusNumber = parseInt(status);
  if(currentData.status === statusNumber) {
    throw new Error("הסטטוס כבר קיים");
  }
  await updateProject(projectId, { status: statusNumber });
  
  // Create metadata object with status change reason if provided
  const metadata = reason ? { update_reason: reason } : undefined;
  
  // Create previous and new state objects for the log
  const previousState = { status: statusNames[currentData.status] };
  const newState = { status: statusNames[statusNumber] };
  
  // Create the log with reason in metadata
  createLog(
    projectId, 
    "עדכון_פרטים", 
    "פרויקט", 
    `הסטטוס שונה ל${statusNames[statusNumber]}${reason ? " עם הסבר" : ""}`, 
    previousState, 
    newState, 
    metadata
  );
  
  revalidateTag('projects') // Update cached posts
}



export default async function ProjectSettings({params}: {params: {id: string}}) {
    const {id} = await params;
    const projectId = Number(id);
    const projectData = await getProject(projectId);
    const departments = await getAllDepartmentsWithCount();
    const projectManagers = await getAllProjectManagers();
    
    // Bind server actions to project ID
    const boundUpdateName = updateProjectName.bind(null, projectId);
    const boundUpdateBudget = updateProjectBudget.bind(null, projectId);
    const boundUpdateDepartments = updateProjectDepartments.bind(null, projectId);
    const boundUpdateStatus = updateProjectStatus.bind(null, projectId);
    const boundUpdateManager = updateProjectManager.bind(null, projectId);
    
    return (
            <div dir="rtl" className="flex overflow-y-hidden flex-col gap-4 pb-4">
                <ProjectNameCard 
                    initialName={projectData?.project_name} 
                    onUpdate={boundUpdateName}
                />

                <ProjectBudgetCard 
                    initialBudget={projectData?.budget}
                    onUpdate={boundUpdateBudget}
                />

                <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
                    <ProjectDepartmentsCard 
                        currentDepartment={projectData?.department_id.toString()}
                        departments={departments}
                        onUpdate={boundUpdateDepartments}
                    />
                    <ProjectStatusCard
                        projectId={id}
                        onUpdate={boundUpdateStatus}
                    />
                </div>

                {/* Project Manager Card */}
                <ProjectManagerCard
                    projectManagers={projectManagers}
                    currentManagerId={projectData?.manager_id}
                    onUpdate={boundUpdateManager}
                />

                <ProjectAdminCard
                    project_id={projectData}
                    project_name={projectData?.project_name}
                />
            </div>
    )
}
