'use client'
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Settings2Icon } from "lucide-react";
import { EditButtonMobile } from "./EditButton";
import FileUploadDialog from "@/components/file-upload-dialog";
import ExportFile from "./exportFile";
import { useState } from "react";
export default function FastActions({project}: {project: any}) {
    const [open, setOpen] = useState(false)
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="w-10 h-10 rounded-full justify-center items-center md:hidden">
                    <Settings2Icon className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        פעולות מהירות
                    </DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4 m-2">
                    <EditButtonMobile hanldeClose={() => setOpen(false)} />
                    <FileUploadDialog project_id={project.id} mobile={true}/>
                    <ExportFile project={project} mobile={true}/>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
