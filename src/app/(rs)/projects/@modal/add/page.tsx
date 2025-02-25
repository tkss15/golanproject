import { getAllDepartmentsWithCount } from "@/lib/queries/getAllDepartments";
import DialogAddProject from "../../components/dialog-add-project"
import { getAllSettlements } from "@/lib/queries/getAllSettlements";
// import { getDepartments } from "@/lib/data" // תצטרך ליצור פונקציה זו

export default async function AddProjectModal() {
//   const departments = await getDepartments()
  const departments: Array<{
    id: number;
    department_name: string;
    project_type: string;
    project_count: number;
  }> =  await getAllDepartmentsWithCount();
  const settlements = await getAllSettlements();
  return <DialogAddProject departments={departments} settlements={settlements} />
} 