export default function DashboardLayout({
    teammemebers,
    milestones,
    contact,
    content,
}: Readonly<{
    teammemebers: React.ReactNode
    documents: React.ReactNode
    milestones: React.ReactNode
    contact: React.ReactNode
    content: React.ReactNode,
    children: React.ReactNode
}>) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4 w-full">
                <div data-tg-tour="כאן תוכל לראות ולערוך את תיאור הפרויקט">
                    {content}
                </div>
                <div data-tg-tour="נהל את חברי הצוות בפרויקט - הוסף או הסר משתתפים">
                    {teammemebers}
                </div>
                <div data-tg-tour="צפה ונהל את מקורות המימון החיצוניים של הפרויקט">
                    {contact}
                </div>
                <div data-tg-tour="עקוב אחר אבני הדרך של הפרויקט וההתקדמות שלו">
                    {milestones}
                </div>
            </div>
        </>
    )
}