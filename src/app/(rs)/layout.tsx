// import { ProjectTourGuide } from "./projects/[id]/tour-guide"
// import HelpButton from "@/components/help-button"

export default async function RSLayout({
    children,
}: {
    children: React.ReactNode
})

{
    return (
        <div className="mx-auto">
            <div className="md:px-4 md:py-2">
                {children}
                {/* <ProjectTourGuide /> */}
            </div>
            {/* <HelpButton/> */}
        </div>
    )
}