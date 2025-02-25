import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Department } from "../columns"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FundingSource } from "@/zod-schemas/funding-source";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
export function SelectDepartment({ departments, selectedDep
 }: { departments: Department[], selectedDep: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(selectedDep.toString());
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("בחר מחלקה");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    setSelectedDepartment(selectedDep.toString());
    const department = departments.find(d => d.id === selectedDep);
    if (department) {
      setSelectedDepartmentName(department.department_name + " " + department.project_type);
    }
  }, [selectedDep]);

  const handleValueChange = (value: string) => {
    setSelectedDepartment(value);
    const department = departments.find(d => d.id.toString() === value);
    if (department) {
      setSelectedDepartmentName(department.department_name + " " + department.project_type  );
    }
    const params = new URLSearchParams(searchParams);
    params.set("department_id", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
      <Select open={isOpen} onOpenChange={setIsOpen} value={selectedDepartment} onValueChange={handleValueChange}>
        <SelectTrigger dir="rtl" className="w-full ">
          <SelectValue placeholder="בחר מחלקה">
            {selectedDepartmentName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup dir="rtl">
            {departments.sort((a, b) => a.department_name.localeCompare(b.department_name)).map((department) => (
              <SelectItem 
                dir="rtl" 
                key={department.id} 
                value={department.id.toString()}
              >
                {department.department_name} {department.project_type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}
export function SelectFunder({ fundingSources, selectedDep
 }: { fundingSources: FundingSource[], selectedDep: number }) {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(selectedDep.toString());
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("בחר מקור מימון");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    setSelectedDepartment(selectedDep.toString());
    const department = fundingSources.find(d => d.id === selectedDep);
    if (department) {
      setSelectedDepartmentName(department.source_name);
    }
  }, [selectedDep, fundingSources]);

  const handleValueChange = (value: string) => {
    setSelectedDepartment(value);
    const department = fundingSources.find(d => d.id.toString() === value);
    if (department) {
      setSelectedDepartmentName(department.source_name);
    }
    const params = new URLSearchParams(searchParams);
    params.set("funder_id", value);
    router.push(`${pathname}?${params.toString()}`);
  };


  return (
      <Select value={selectedDepartment} onValueChange={handleValueChange}>
        <SelectTrigger dir="rtl" className="w-full">
          <SelectValue placeholder="בחר מקור מימון">
            {selectedDepartmentName}
          </SelectValue>

        </SelectTrigger>
        <SelectContent>
          <SelectGroup dir="rtl">
            {fundingSources.sort((a, b) => a.source_name.localeCompare(b.source_name)).map((fundingSource) => (
              <SelectItem 
                dir="rtl" 
                key={fundingSource.id} 
                value={fundingSource.id.toString()}
              >
                {fundingSource.source_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}

