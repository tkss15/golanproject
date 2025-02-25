import { pgTable, serial, varchar, boolean, timestamp, jsonb, real, integer, text, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
   
export const settlements = pgTable('settlements', {
    settlement_id: serial('settlement_id').primaryKey(),
    name: varchar('settlement_name').notNull()
}) 
export const settlement_statistics = pgTable('settlement_statistics', {
  id: serial('id').primaryKey(),
  settlement_id: integer('settlement_id').notNull().references(() => settlements.settlement_id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  households: integer('house_holds').notNull(),
  population: integer('population').notNull(),
  population_2030: integer('population_2030').notNull(),
  growth_rate: real('growth_rate').notNull(),
  topics_of_interest: text('topics_of_interest').array(),
  nearby_projects: text('nearby_projects').array()
})

export const projectSettlements = pgTable('project_settlements', {
  project_id: integer('project_id').notNull().references(() => projects.id),
  settlement_id: integer('settlement_id').notNull().references(() => settlements.settlement_id),
  is_main_settlement: boolean('is_main_settlement').default(true),
  budget_allocation: decimal('budget_allocation', { precision: 10, scale: 2 }),
  specific_goals: jsonb('specific_goals'),
  settlement_status: varchar('settlement_status'),
  milestones: jsonb('milestones'), // Array of milestone objects with title, description, due_date
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  timeline_status: varchar('timeline_status'), // e.g., 'on_track', 'delayed', 'completed'
  actual_completion_date: timestamp('actual_completion_date'),
  milestone_progress: jsonb('milestone_progress'), // Track progress of each milestone
  last_updated: timestamp('last_updated').defaultNow()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  kinde_id: varchar('kinde_id').notNull().unique(),
  email: varchar('email').notNull().unique(),
  first_name: varchar('first_name'),
  last_name: varchar('last_name'),
  picture: text('picture'),
  role: varchar('role').notNull().default('user'), // 'admin', 'manager', 'user'
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login'),
  is_suspended: boolean('is_suspended').default(false),
  is_active: boolean('is_active').default(true)
});

// Project editors table
export const projectEditors = pgTable('project_editors', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  editor_id: integer('editor_id')
    .notNull()
    .references(() => users.id),
  added_at: timestamp('added_at').defaultNow(),
  added_by: integer('added_by')
    .notNull()
    .references(() => users.id),  // Must be the project owner
  is_active: boolean('is_active').default(true)
});

// Relations

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  department_name: varchar('department_name').notNull(),
  project_type: varchar('project_type').notNull(),
});


export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  project_name: varchar('project_name').notNull(),
  owner_id: integer('owner_id').notNull().references(() => users.id),
  description: text('description'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'),
  status: varchar('status').notNull(),
  priority: integer('priority'),
  department_id: integer('department_id').notNull().references(() => departments.id),  // New column linking to departments
  contact_email: varchar('contact_email'),
  contact_phone: varchar('contact_phone'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const fundingSources = pgTable('funding_sources', {
  id: serial('id').primaryKey(),
  source_name: varchar('source_name').notNull(),
  source_type: varchar('source_type'), // למשל: תרומה, קרן קיימת, תקציב מועצה
  contact_details: text('contact_details')
});

export const projectFundingSources = pgTable('project_funding_sources', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').notNull().references(() => projects.id),
  funding_source_id: integer('funding_source_id').notNull().references(() => fundingSources.id),
  allocated_amount: decimal('allocated_amount', { precision: 10, scale: 2 }),
  allocation_date: timestamp('allocation_date').defaultNow()
});

// יחסים
export const projectFundingSourcesRelations = relations(projectFundingSources, ({ one }) => ({
  project: one(projects, {
    fields: [projectFundingSources.project_id],
    references: [projects.id]
  }),
  funding_source: one(fundingSources, {
    fields: [projectFundingSources.funding_source_id],
    references: [fundingSources.id]
  })
}));

// In your schema.ts
export const projectFiles = pgTable('project_files', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  file_name: varchar('file_name').notNull(),
  file_path: text('file_path').notNull(),
  file_size: integer('file_size').notNull(), // in bytes
  file_type: varchar('file_type').notNull(), // mime type
  uploaded_by: integer('uploaded_by')
    .notNull()
    .references(() => users.id),
  upload_date: timestamp('upload_date').defaultNow(),
  description: text('description'),
  is_active: boolean('is_active').default(true)
});


export const projectLogs = pgTable('project_logs', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id),
  action_type: varchar('action_type').notNull(), // סוג הפעולה - עדכון, יצירה, מחיקה וכו
  module: varchar('module').notNull(), // המודול שבו בוצע השינוי - פרטי פרויקט, תקציב, ישובים וכו
  description: text('description').notNull(), // תיאור הפעולה
  previous_state: jsonb('previous_state'), // המצב לפני השינוי
  new_state: jsonb('new_state'), // המצב אחרי השינוי
  created_at: timestamp('created_at').defaultNow(),
  metadata: jsonb('metadata') // מידע נוסף שיכול להיות רלוונטי
});

// יחסים עם טבלאות אחרות
export const projectLogsRelations = relations(projectLogs, ({ one }) => ({
  project: one(projects, {
    fields: [projectLogs.project_id],
    references: [projects.id]
  }),
  user: one(users, {
    fields: [projectLogs.user_id],
    references: [users.id]
  })
}));

export const settlementRelation = relations(settlements, ({ many }) => ({
  settlement_statistics: many(settlement_statistics)
}))


export const usersRelations = relations(users, 
  ({ many }) => ({
    owned_projects: many(projects, { 
      relationName: 'manager_id' 
    }),
    editable_projects: many(projectEditors, { relationName: 'project_editor' })
  })
);

export const statisticsRelation = relations(settlement_statistics, ({one}) => ({
  settlement: one(settlements, {
    fields: [settlement_statistics.settlement_id],
    references: [settlements.settlement_id]
  })
}))
// Relations
export const projectsRelations = relations(projects, ({ one }) => ({
  department: one(departments, {
    fields: [projects.department_id],
    references: [departments.id]
  }),
  owner: one(users, {
    fields: [projects.owner_id],
    references: [users.id],
    relationName: 'project_owner'
  }),
  // editors: many(projectEditors)
}));
// // יחסים מטבלת projects
// export const projectsRelations = relations(projects, ({ many }) => ({
//   project_settlements: many(projectSettlements)
// }));

// // יחסים מטבלת settlements
// export const settlementsRelations = relations(settlements, ({ many }) => ({
//   project_settlements: many(projectSettlements)
// }));

// // יחסים מטבלת project_settlements
// export const projectSettlementsRelations = relations(projectSettlements, ({ one }) => ({
//   project: one(projects, {
//     fields: [projectSettlements.project_id],
//     references: [projects.id]
//   }),
//   settlement: one(settlements, {
//     fields: [projectSettlements.settlement_id],
//     references: [settlements.settlement_id]
//   })
// }));