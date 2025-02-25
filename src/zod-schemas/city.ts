import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { settlement_statistics, settlements } from '@/db/schema';

export const insertSettlementSchema = createInsertSchema(settlements, {
    settlement_id: (schema) => schema.settlement_id.positive("id must be postive.").nullish(),
    name: (schema) => schema.name.min(1, 'City name must have atleast 1 character.'),
})

export const insertStatisticsSchema = createInsertSchema(settlement_statistics, {
    id: (schema) => schema.id.positive("id must be postive."),
    settlement_id: (schema) => schema.settlement_id.positive('settlement id must be postive'),
    updatedAt: (schema) => schema.updatedAt.default(new Date()), // Automatically set to the current date
    households: (schema) => schema.households.min(1, "Households must be at least 1"),
    population: (schema) => schema.population.min(1, "Population must be at least 1"),
    population_2030: (schema) =>
        schema.population_2030.min(1, "Population for 2030 must be at least 1"),
    growth_rate: (schema) =>
        schema.growth_rate.min(0, "Growth rate must be a non-negative number"),
})

export const selectStatisticsSchema = createSelectSchema(settlement_statistics)
export const selectSettlementSchema = createSelectSchema(settlements)

export type insertSettlementSchemaType = typeof insertSettlementSchema._type
export type selectSettlementSchemaType = typeof selectSettlementSchema._type
export type insertStatisticsSchemaType = typeof insertStatisticsSchema._type
export type selectStatisticsSchemaType = typeof selectStatisticsSchema._type