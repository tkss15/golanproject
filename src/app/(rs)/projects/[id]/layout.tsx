'use client'
import { ProjectProvider } from "@/components/ProjectContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRef, useState } from "react";
import { ProjectTourGuide } from './tour-guide'


export default function DashboardLayout({
    children,
    header,
    dashboard,
    settings,
    activity,
    documents,
    sidebar,
}: Readonly<{
    children: React.ReactNode
    dashboard: React.ReactNode
    header: React.ReactNode
    settings: React.ReactNode
    activity: React.ReactNode
    documents: React.ReactNode
    sidebar: React.ReactNode
}>) {
    const [tab, setTab] = useState('overview');
    return (
        <ProjectProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {header}
                    <div className="flex flex-col h-full lg:grid lg:grid-cols-4 mt-8 gap-3">
                        <div className="pt-0 h-full rounded-lg lg:col-span-3">
                            <Tabs
                                className="flex h-full flex-col justify-start w-full"
                                onValueChange={(value) => {
                                    setTab(value);
                                }}

                                defaultValue="overview"
                                dir="rtl"
                            >
                                <TabsList className="w-full justify-start">
                                    <TabsTrigger value="overview" className="flex-1" data-tg-tour="סקירה כללית">סקירה כללית</TabsTrigger>
                                    <TabsTrigger value="documents" className="flex-1" data-tg-tour="מסמכים">מסמכים</TabsTrigger>
                                    <TabsTrigger value="activity" className="flex-1" data-tg-tour="יומן פעילות">יומן פעילות</TabsTrigger>
                                    <TabsTrigger value="settings" className="flex-1" data-tg-tour="הגדרות">הגדרות</TabsTrigger>
                                </TabsList>
                                <TabsContent className="h-full text-right flex-1" value={tab}>
                                        {tab === 'overview' ? dashboard : 
                                         tab === 'settings' ? settings : 
                                         tab === 'activity' ? activity : 
                                         tab === 'documents' ? documents : 
                                         children}
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="h-full justify-self-end w-full">
                            {sidebar}
                        </div>
                    </div>
                </div>
            </div>
            <ProjectTourGuide setTab={setTab}/>
        </ProjectProvider>
    )
}