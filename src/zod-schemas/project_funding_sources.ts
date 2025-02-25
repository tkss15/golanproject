// db/schema.ts
import { projectFundingSources } from "@/db/schema";

export type ProjectFundingSource = typeof projectFundingSources.$inferSelect;
export type NewProjectFundingSource = typeof projectFundingSources.$inferInsert;