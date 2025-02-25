'use client'
import { Button } from "@/components/ui/button";
import ExcelJS from 'exceljs';
import { Download } from "lucide-react";
const exportProject = async (project: getProjectProp) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Project Data');

    // Define columns with specific widths and headers
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Project Name', key: 'project_name', width: 30 },
        { header: 'Owner ID', key: 'owner_id', width: 10 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Start Date', key: 'start_date', width: 20 },
        { header: 'End Date', key: 'end_date', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Priority', key: 'priority', width: 10 },
        { header: 'Department ID', key: 'department_id', width: 15 },
        { header: 'Contact Email', key: 'contact_email', width: 25 },
        { header: 'Contact Phone', key: 'contact_phone', width: 20 },
        { header: 'Created At', key: 'created_at', width: 20 },
        { header: 'Updated At', key: 'updated_at', width: 20 }
    ];

    // Add data row
    worksheet.addRow({
        id: project.id,
        project_name: project.project_name,
        owner_id: project.owner_id,
        description: project.description,
        budget: project.budget,
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status,
        priority: project.priority,
        department_id: project.department_id,
        contact_email: project.contact_email,
        contact_phone: project.contact_phone,
        created_at: project.created_at,
        updated_at: project.updated_at
    });

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' }
        };
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
    });

    // Style data cells
    const dataRow = worksheet.getRow(2);
    dataRow.eachCell((cell) => {
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
        };
        
        // Format date cells
        if (cell.value instanceof Date) {
            cell.numFmt = 'yyyy-mm-dd hh:mm:ss';
        }
        
        // Format budget cell
        if (cell.col === 5) { // Budget column
            cell.numFmt = '#,##0.00';
        }
    });

    // Add borders to all cells
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });

    // Auto-fit row heights
    worksheet.eachRow((row) => {
        row.height = 25;
    });

    try {
        // Generate buffer and create download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.project_name}_data.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting file:', error);
    }
};

export default function ExportFile({project, mobile}: {project: getProjectProp, mobile?: boolean}) {

    return (
        <Button variant={mobile ? "outline" : "default"} className={`flex justify-start ${mobile ? "md:hidden" : ""}`} onClick={() => exportProject(project)}>
            <Download className="mr-2 h-4 w-4" />
            יצוא קובץ לאקסל
        </Button>
    )
}
