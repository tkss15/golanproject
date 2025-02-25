
import { getProjectFundings } from "@/lib/queries/funding/getProjectFundings";
import ProjectContact from "./contactpage";
import { getProject } from "@/lib/queries/projects/getProject";
import { Button } from "@/components/ui/button";

export default async function ContentPage({params}: {params: {id: string}}) {
    const {id} = await params;
    const project = await getProject(Number(id));
    const fundings = await getProjectFundings(Number(id));
    return (
        <ProjectContact project={project} fundings={fundings} />
    )

}