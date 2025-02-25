import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { projects } from '@/db/schema';
import { z } from 'zod';


export const insertProjectSchema = createInsertSchema(projects, {
    project_name: (schema) => schema.project_name.min(1, "Project name is required"),
    description: (schema) => schema.description.optional(),
    owner_id: (schema) => schema.owner_id.min(1, "Owner ID is required"),
    status: (schema) => schema.status.min(1, "Status is required"),
    department_id: (schema) => schema.department_id.min(1, "Department ID is required"),
    contact_email: (schema) => schema.contact_email.email("Invalid email address").optional(),
    contact_phone: (schema) => schema.contact_phone.regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format. Use XXX-XXX-XXXX").optional(),
    budget: (schema) => schema.budget.min(0, "Budget must be non-negative").optional(),
    priority: (schema) => schema.priority.min(1).max(5, "Priority must be between 1 and 5").optional(),
    start_date: (schema) => schema.start_date,
    end_date: (schema) => schema.end_date.optional()
  });

export const selectProjecSchema = createSelectSchema(projects)

export type insertProjecSchemaType = typeof insertProjectSchema._type
export type selectProjecSchemaType = typeof selectProjecSchema._type

export const statusNames: Record<number, string> = {
    1: "פעיל",
    2: "בתכנון",
    3: "מעוכב",
    4: "סגור"
}

