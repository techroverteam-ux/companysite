import { z } from 'zod'
import { zId } from '@/lib/api'
import { PROJECT_HEALTH, PROJECT_STAGES, PROJECT_STATUSES, TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/lib/models'

/*
 * Each entity has a field set WITHOUT defaults (used for PATCH, so untouched fields stay as they are)
 * and a create schema that adds defaults. Never use `.partial()` on a schema with defaults:
 * the defaults would overwrite existing values on every edit.
 */
const optionalDate = z.string().date().nullable().optional()
const url = z.union([z.string().url(), z.literal('')])

/* ---------------- Projects ---------------- */
const projectFields = {
  name: z.string().trim().min(2).max(140),
  client: z.string().trim().max(140),
  description: z.string().max(5000),
  status: z.enum(PROJECT_STATUSES),
  startDate: optionalDate,
  dueDate: optionalDate,
  budgetHours: z.coerce.number().min(0).max(100000),
  lead: zId.nullable().optional(),
  members: z.array(zId).max(100),
  repoUrl: url,
  clientRef: zId.nullable().optional(),
  stage: z.enum(PROJECT_STAGES),
  health: z.enum(PROJECT_HEALTH),
  value: z.coerce.number().min(0).max(1e9),
  stagingUrl: url,
}
export const projectInput = z.object({
  ...projectFields,
  client: projectFields.client.default(''),
  description: projectFields.description.default(''),
  status: projectFields.status.default('active'),
  budgetHours: projectFields.budgetHours.default(0),
  members: projectFields.members.default([]),
  repoUrl: projectFields.repoUrl.default(''),
  stage: projectFields.stage.default('onboarding'),
  health: projectFields.health.default('on_track'),
  value: projectFields.value.default(0),
  stagingUrl: projectFields.stagingUrl.default(''),
})
export const projectPatch = z.object(projectFields).partial()

/* ---------------- Tasks ---------------- */
const taskFields = {
  project: zId,
  title: z.string().trim().min(2).max(200),
  description: z.string().max(10000),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  assignees: z.array(zId).max(20),
  dueDate: optionalDate,
  estimateHours: z.coerce.number().min(0).max(1000),
  labels: z.array(z.string().trim().min(1).max(30)).max(10),
  link: url,
  type: z.enum(TASK_TYPES),
  milestone: zId.nullable().optional(),
}
export const taskInput = z.object({
  ...taskFields,
  description: taskFields.description.default(''),
  status: taskFields.status.default('todo'),
  priority: taskFields.priority.default('medium'),
  assignees: taskFields.assignees.default([]),
  estimateHours: taskFields.estimateHours.default(0),
  labels: taskFields.labels.default([]),
  link: taskFields.link.default(''),
  type: taskFields.type.default('feature'),
})
export const taskPatch = z.object(taskFields).partial()

/* ---------------- Time entries ---------------- */
const timeFields = {
  project: zId.optional(),
  task: zId.nullable().optional(),
  date: z.string().date(),
  minutes: z.coerce.number().int().min(1, 'Log at least 1 minute.').max(24 * 60),
  note: z.string().max(500),
  billable: z.boolean(),
}
export const timeInput = z.object({
  ...timeFields,
  note: timeFields.note.default(''),
  billable: timeFields.billable.default(true),
  user: zId.optional(), // managers may log on behalf of someone
})
export const timePatch = z.object(timeFields).partial()

/* ---------------- Money documents ---------------- */
export const lineItems = z
  .array(z.object({ description: z.string().trim().min(1).max(300), quantity: z.coerce.number().min(0).max(100000), rate: z.coerce.number().min(0).max(1e8) }))
  .max(50)

const proposalFields = {
  client: zId,
  lead: zId.nullable().optional(),
  title: z.string().trim().min(2).max(200),
  summary: z.string().max(20000),
  items: lineItems,
  discount: z.coerce.number().min(0).max(1e9),
  gstPercent: z.coerce.number().min(0).max(28),
  timelineWeeks: z.coerce.number().min(0).max(520),
  milestones: z
    .array(z.object({ title: z.string().trim().min(1).max(200), percent: z.coerce.number().min(0).max(100), weeksFromStart: z.coerce.number().min(0).max(520) }))
    .max(20)
    .refine((m) => !m.length || Math.round(m.reduce((s, x) => s + x.percent, 0)) === 100, 'Milestone percentages must add up to 100.'),
  terms: z.string().max(10000),
  validUntil: z.string().date().nullable().optional(),
}
export const proposalInput = z.object({
  ...proposalFields,
  summary: proposalFields.summary.default(''),
  discount: proposalFields.discount.default(0),
  gstPercent: proposalFields.gstPercent.default(18),
  timelineWeeks: proposalFields.timelineWeeks.default(0),
  milestones: proposalFields.milestones.default([]),
  terms: proposalFields.terms.default(''),
})
export const proposalPatch = z.object(proposalFields).partial()

const invoiceFields = {
  project: zId,
  milestone: zId.nullable().optional(),
  items: lineItems,
  gstPercent: z.coerce.number().min(0).max(28),
  dueDate: z.string().date().nullable().optional(),
  notes: z.string().max(5000),
}
export const invoiceInput = z.object({
  ...invoiceFields,
  items: invoiceFields.items.default([]),
  gstPercent: invoiceFields.gstPercent.default(18),
  notes: invoiceFields.notes.default(''),
})
export const invoicePatch = z.object(invoiceFields).omit({ project: true }).partial()
