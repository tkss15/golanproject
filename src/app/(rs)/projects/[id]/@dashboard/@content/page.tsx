
import ProjectContent from "./contentpage";
import { getProject } from "@/lib/queries/projects/getProject";
export default async function ContentPage({params}: {params: {id: string}}) {
    const {id} = await params;
    const project = await getProject(Number(id));
    return (
        <ProjectContent project={project} />
    )
}