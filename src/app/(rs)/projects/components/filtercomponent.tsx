import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { SlidersHorizontal } from "lucide-react"
import { SelectDepartment } from "./selectdepartment"
import { Badge } from "@/components/ui/badge"
export default function FilterComponent({departments, selectedDep}: {departments: any[], selectedDep: number}) {
    return (
        <Drawer>
            <DrawerTrigger asChild className="md:hidden">
                <Button>
                   <SlidersHorizontal/>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div  className="h-[70vh]">
                    <DrawerHeader>
                        <DrawerTitle>Filter</DrawerTitle>
                </DrawerHeader>
                    <div className="flex flex-col gap-2">
                        <p>מחלקה</p>
                        <SelectDepartment departments={departments} selectedDep={selectedDep} />
                    </div>
                    <div>
                        <p>מקור מימון</p>
                        <Badge>
                            <p>מקור מימון</p>
                        </Badge>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
