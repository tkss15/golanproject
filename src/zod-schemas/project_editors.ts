// db/schema.ts
import { projectEditors } from "@/db/schema";

export type ProjectEditor = typeof projectEditors.$inferSelect;
export type NewProjectEditor = typeof projectEditors.$inferInsert;