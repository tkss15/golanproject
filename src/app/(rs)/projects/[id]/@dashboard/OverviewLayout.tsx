"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OverviewLayout({
    header,
    children,
}: Readonly<{
    header: React.ReactNode | string
    children: React.ReactNode
}>) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    {header}
                </CardTitle>
            </CardHeader>
            <CardContent >
                {children}
            </CardContent>
        </Card>
    )
}   