// db/schema.ts
import { fundingSources } from "@/db/schema";

export type FundingSource = typeof fundingSources.$inferSelect;
export type NewFundingSource = typeof fundingSources.$inferInsert;