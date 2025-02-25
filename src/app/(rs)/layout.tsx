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
            </div>
        </div>
    )
}