import { getProject } from "@/lib/queries/projects/getProject";
import { getUserProjectRole } from "@/lib/queries/projects/editors/updateUserRole";
import { Sidebar } from "../components/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindId } from "@/lib/queries/users/getUser";

export default async function ProjectDetailsPage({
    params,
  }: {
    params: { id?: string };
  }) {
    try {
      const { id:project_id } = await params;
  
      if (project_id) {
        const project = await getProject(parseInt(project_id));
        const { getUser } = await getKindeServerSession();
        const userResult = await getUser();
        const user = userResult ? userResult : { id: null };
        const userKinde = await getUserByKindId(user.id);
        const permission = await getUserProjectRole(project_id, user.id);
        console.log(permission)
        if (!project) {
          return (
            <>
              {/* <Header /> */}
              <div>Project ID #{project_id} not found</div>
            </>
          );
        }
  
        return (
          <>
              <Sidebar project={project} permission={permission} />
          </>
        );
      } else {
        return (
          <>
            {/* <Header /> */}
            <div>No project ID provided</div>
          </>
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  