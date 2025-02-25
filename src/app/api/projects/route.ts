// /pages/api/projects.ts
import { getProjectsByDepartmentAndSettlement } from '@/lib/queries/getProjectsByDepartment';
import { NextRequest, NextResponse } from 'next/server';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindId } from '@/lib/queries/users/getUser';
import { createProject } from '@/lib/queries/projects/createProject';
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const departmentId = searchParams.get('departmentId')

  if (!departmentId) {
    return NextResponse.json({ error: 'Missing departmentId' }, {status: 400})
  }

  // Simulate fetching projects for the department
  // const projects = await getProjectsByDepartment(departmentId);
  // const projects = await getProjectsByDepartmentAndSettlement(departmentId);

  // return NextResponse.json(projects)
  return NextResponse.json({message: "Projects fetched successfully"});
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { project, editors, settlement } = body;
  const {getUser} = await getKindeServerSession();
  const user = await getUser();
  const userKinde = await getUserByKindId(user.id);
  console.log(project, editors, settlement);

  const projectToCreate = {
    project_name: project.project_name,
    owner_id: userKinde.id,
    description: project.description,
    budget: project.budget,
    start_date: new Date(project.start_date),
    end_date: new Date(project.end_date),
    status: project.status,
    priority: project.priority,
    department_id: project.department_id,
    contact_email: project.contact_email,
    contact_phone: project.contact_phone,
    created_at: new Date(),
    updated_at: new Date(),
  }
  try {
    const createdProject = await createProject(projectToCreate, editors, settlement, userKinde);
    return NextResponse.json({message: "Project created successfully", project: createdProject});
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({error: "Project creation failed"}, {status: 500});
  }
}
