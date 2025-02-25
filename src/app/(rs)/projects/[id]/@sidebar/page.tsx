import { getProject } from "@/lib/queries/projects/getProject";

import { Sidebar } from "../components/sidebar";

export default async function ProjectDetailsPage({
    params,
  }: {
    params: { id?: string };
  }) {
    try {
      const { id:project_id } = await params;
  
      if (project_id) {
        const project = await getProject(parseInt(project_id));
  
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
              <Sidebar project={project} />
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
  