import mongoose, { Schema, Types, type InferSchemaType, type Model } from 'mongoose'

/* ------------------------------------------------------------------ */
/* Enumerations shared by API and UI                                   */
/* ------------------------------------------------------------------ */
export const ROLES = ['owner', 'manager', 'member'] as const
export type Role = (typeof ROLES)[number]

export const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'] as const
export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'qa', 'done'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export const LEAD_TYPES = ['contact', 'meeting', 'hire_team', 'collaboration'] as const
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'] as const

const { ObjectId } = Schema.Types

/* ------------------------------------------------------------------ */
/* Staff user                                                          */
/* ------------------------------------------------------------------ */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'member' },
    title: { type: String, trim: true, default: '' }, // e.g. "Frontend Developer"
    hourlyRate: { type: Number, default: 0, min: 0 }, // INR per hour, used for cost reports
    weeklyCapacityHours: { type: Number, default: 40, min: 0, max: 80 },
    color: { type: String, default: '#6366f1' },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Project                                                             */
/* ------------------------------------------------------------------ */
const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    client: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: PROJECT_STATUSES, default: 'active' },
    startDate: { type: Date },
    dueDate: { type: Date },
    budgetHours: { type: Number, default: 0, min: 0 },
    lead: { type: ObjectId, ref: 'User' },
    members: [{ type: ObjectId, ref: 'User' }],
    repoUrl: { type: String, default: '' },
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Task                                                                */
/* ------------------------------------------------------------------ */
const taskSchema = new Schema(
  {
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '' },
    status: { type: String, enum: TASK_STATUSES, default: 'todo', index: true },
    priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
    assignees: [{ type: ObjectId, ref: 'User', index: true }],
    dueDate: { type: Date },
    estimateHours: { type: Number, default: 0, min: 0 },
    labels: [{ type: String, trim: true }],
    link: { type: String, default: '' }, // GitHub issue / PR / Figma link
    position: { type: Number, default: 0 },
    completedAt: { type: Date },
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Time log (manual entries and running timers)                        */
/* ------------------------------------------------------------------ */
const timeLogSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    task: { type: ObjectId, ref: 'Task', index: true },
    date: { type: Date, required: true, index: true }, // day the work happened (00:00 UTC)
    minutes: { type: Number, default: 0, min: 0, max: 24 * 60 },
    note: { type: String, default: '', maxlength: 500 },
    billable: { type: Boolean, default: true },
    running: { type: Boolean, default: false },
    startedAt: { type: Date },
    endedAt: { type: Date },
  },
  { timestamps: true }
)
timeLogSchema.index({ user: 1, running: 1 })

/* ------------------------------------------------------------------ */
/* Task comment                                                        */
/* ------------------------------------------------------------------ */
const commentSchema = new Schema(
  {
    task: { type: ObjectId, ref: 'Task', required: true, index: true },
    user: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Activity log (audit trail)                                          */
/* ------------------------------------------------------------------ */
const activitySchema = new Schema(
  {
    actor: { type: ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g. task.created
    entityType: { type: String, required: true },
    entityId: { type: ObjectId },
    project: { type: ObjectId, ref: 'Project', index: true },
    summary: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

/* ------------------------------------------------------------------ */
/* Lead (all public form submissions)                                  */
/* ------------------------------------------------------------------ */
const leadSchema = new Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true, index: true },
    name: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    message: { type: String, default: '' },
    details: { type: Schema.Types.Mixed, default: {} }, // form-specific fields
    meetingDate: { type: String }, // YYYY-MM-DD, meetings only
    meetingTime: { type: String }, // HH:mm, meetings only
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    owner: { type: ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    ip: { type: String, select: false },
  },
  { timestamps: true }
)
leadSchema.index({ type: 1, meetingDate: 1, meetingTime: 1 })

/* ------------------------------------------------------------------ */
/* Model registration (safe for hot reload)                            */
/* ------------------------------------------------------------------ */
function model<T extends Schema>(name: string, schema: T) {
  return (mongoose.models[name] as Model<InferSchemaType<T>>) || mongoose.model(name, schema)
}

export const User = model('User', userSchema)
export const Project = model('Project', projectSchema)
export const Task = model('Task', taskSchema)
export const TimeLog = model('TimeLog', timeLogSchema)
export const Comment = model('Comment', commentSchema)
export const Activity = model('Activity', activitySchema)
export const Lead = model('Lead', leadSchema)

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId }
