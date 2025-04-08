import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, departments, settlements, users, projectSettlements } from "@/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import ExcelJS from "exceljs";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get("department_id");
    const settlementId = searchParams.get("settlement_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Build filter conditions
    let conditions = [];

    if (departmentId) {
      conditions.push(eq(projects.department_id, parseInt(departmentId)));
    }

    if (startDate) {
      conditions.push(gte(projects.start_date, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(projects.start_date, new Date(endDate)));
    }

    // First get all projects based on department and date filters
    let projectsData = await db
      .select({
        id: projects.id,
        project_name: projects.project_name,
        description: projects.description,
        budget: projects.budget,
        start_date: projects.start_date,
        end_date: projects.end_date,
        status: projects.status,
        priority: projects.priority,
        department_id: projects.department_id,
        department_name: departments.department_name,
        project_type: departments.project_type,
        contact_email: projects.contact_email,
        contact_phone: projects.contact_phone,
        owner_id: projects.owner_id,
        owner_first_name: users.first_name,
        owner_last_name: users.last_name,
        created_at: projects.created_at,
        updated_at: projects.updated_at,
      })
      .from(projects)
      .leftJoin(departments, eq(projects.department_id, departments.id))
      .leftJoin(users, eq(projects.owner_id, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // If settlement filter is applied, filter the projects
    if (settlementId) {
      // Get all project IDs that are associated with the selected settlement
      const projectSettlementsData = await db
        .select({
          project_id: projectSettlements.project_id,
        })
        .from(projectSettlements)
        .where(eq(projectSettlements.settlement_id, parseInt(settlementId)));

      const projectIds = projectSettlementsData.map((ps) => ps.project_id);
      
      // Filter the projects by the IDs that match the settlement
      if (projectIds.length > 0) {
        projectsData = projectsData.filter((p) => projectIds.includes(p.id));
      } else {
        projectsData = []; // No projects associated with the settlement
      }
    }

    // Now fetch all settlement data for these projects
    const projectIds = projectsData.map((p) => p.id);
    
    let settlementData: {
      project_id: number;
      settlement_id: number;
      name: string;
      is_main_settlement: boolean;
    }[] = [];
    
    if (projectIds.length > 0) {
      settlementData = await db
        .select({
          project_id: projectSettlements.project_id,
          settlement_id: projectSettlements.settlement_id,
          name: settlements.name,
          is_main_settlement: projectSettlements.is_main_settlement,
        })
        .from(projectSettlements)
        .leftJoin(settlements, eq(projectSettlements.settlement_id, settlements.settlement_id))
        .where(inArray(projectSettlements.project_id, projectIds));
    }

    // Group settlements by project ID
    const projectSettlementsMap = settlementData.reduce((acc, curr) => {
      if (!acc[curr.project_id]) {
        acc[curr.project_id] = [];
      }
      acc[curr.project_id].push(curr);
      return acc;
    }, {} as Record<number, typeof settlementData>);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Golan Project System";
    workbook.created = new Date();

    // Add a worksheet
    const worksheet = workbook.addWorksheet("Projects");

    // Add columns (Hebrew RTL)
    worksheet.columns = [
      { header: "מזהה פרויקט", key: "id", width: 12 },
      { header: "שם פרויקט", key: "project_name", width: 30 },
      { header: "תיאור", key: "description", width: 40 },
      { header: "תקציב", key: "budget", width: 15 },
      { header: "תאריך התחלה", key: "start_date", width: 15 },
      { header: "תאריך סיום", key: "end_date", width: 15 },
      { header: "סטטוס", key: "status", width: 12 },
      { header: "עדיפות", key: "priority", width: 10 },
      { header: "מחלקה", key: "department", width: 25 },
      { header: "דוא״ל ליצירת קשר", key: "contact_email", width: 25 },
      { header: "טלפון ליצירת קשר", key: "contact_phone", width: 15 },
      { header: "בעלים", key: "owner", width: 25 },
      { header: "ישובים", key: "settlements", width: 35 },
      { header: "ישוב ראשי", key: "main_settlement", width: 20 },
      { header: "תאריך יצירה", key: "created_at", width: 15 },
      { header: "תאריך עדכון אחרון", key: "updated_at", width: 15 },
    ];

    // Set RTL direction
    worksheet.views = [{ rightToLeft: true }];

    // Make the header row bold and add background color
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F0FF" },
    };

    // Add the data
    projectsData.forEach((project) => {
      // Get settlements for this project
      const projectSettlements = projectSettlementsMap[project.id] || [];
      const settlementNames = projectSettlements.map((s) => s.name).join(", ");
      const mainSettlement = projectSettlements.find((s) => s.is_main_settlement)?.name || "";

      // Format priority value
      let priorityText = "";
      if (project.priority === 1) priorityText = "נמוך";
      else if (project.priority === 2) priorityText = "בינונית";
      else if (project.priority === 3) priorityText = "גבוהה";

      // Format dates
      const startDate = project.start_date 
        ? format(new Date(project.start_date), "dd/MM/yyyy")
        : "";
      const endDate = project.end_date 
        ? format(new Date(project.end_date), "dd/MM/yyyy") 
        : "";
      const createdAt = project.created_at 
        ? format(new Date(project.created_at), "dd/MM/yyyy") 
        : "";
      const updatedAt = project.updated_at 
        ? format(new Date(project.updated_at), "dd/MM/yyyy") 
        : "";

      // Add a row to the worksheet
      worksheet.addRow({
        id: project.id,
        project_name: project.project_name,
        description: project.description,
        budget: project.budget,
        start_date: startDate,
        end_date: endDate,
        status: project.status,
        priority: priorityText,
        department: `${project.department_name} ${project.project_type || ""}`,
        contact_email: project.contact_email,
        contact_phone: project.contact_phone,
        owner: `${project.owner_first_name || ""} ${project.owner_last_name || ""}`,
        settlements: settlementNames,
        main_settlement: mainSettlement,
        created_at: createdAt,
        updated_at: updatedAt,
      });
    });

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="projects-report-${format(new Date(), "yyyy-MM-dd")}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting projects to Excel:", error);
    return NextResponse.json(
      { error: "Failed to export projects" },
      { status: 500 }
    );
  }
}