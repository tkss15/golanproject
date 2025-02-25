export default async function ProjectsLayout({
    children,
    modal,
}: {
    modal: React.ReactNode
    children: React.ReactNode
})
{
    return (
        <>
            {modal}
            {children}
        </>
    )
}