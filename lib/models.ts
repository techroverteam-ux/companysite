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
export const PROJECT_STAGES = ['onboarding', 'development', 'qa_uat', 'delivery', 'support', 'closed'] as const
export const PROJECT_HEALTH = ['on_track', 'at_risk', 'blocked'] as const
export const TASK_TYPES = ['feature', 'bug', 'chore', 'change'] as const
export const CLIENT_STATUSES = ['Lead', 'Onboarding', 'Active', 'Past Client'] as const
export const PROPOSAL_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'] as const
export const MILESTONE_STATUSES = ['pending', 'in_progress', 'ready_for_uat', 'approved', 'changes_requested'] as const
export const CHANGE_STATUSES = ['submitted', 'estimated', 'approved', 'rejected', 'done'] as const
export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'cancelled'] as const
export const REVIEW_STATUSES = ['pending', 'published', 'private', 'rejected'] as const
export const LEAVE_TYPES = ['casual', 'sick', 'earned', 'unpaid', 'wfh'] as const
export const LEAVE_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'] as const
export const ACCESS_KINDS = ['portal', 'proposal', 'review'] as const

export const DEFAULT_ONBOARDING = [
  { key: 'agreement', label: 'Signed agreement / accepted proposal' },
  { key: 'advance', label: 'Advance invoice paid' },
  { key: 'kickoff', label: 'Kickoff call held' },
  { key: 'access', label: 'Access to domain, hosting, accounts (in password vault)' },
  { key: 'assets', label: 'Brand assets and content received' },
  { key: 'contact', label: 'Single point of contact confirmed' },
]

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
    clientRef: { type: ObjectId, ref: 'Client' },
    stage: { type: String, enum: PROJECT_STAGES, default: 'onboarding' },
    health: { type: String, enum: PROJECT_HEALTH, default: 'on_track' },
    value: { type: Number, default: 0, min: 0 }, // contract value in INR (before GST)
    onboarding: [
      {
        _id: false,
        key: String,
        label: String,
        done: { type: Boolean, default: false },
        doneAt: Date,
        doneBy: { type: ObjectId, ref: 'User' },
      },
    ],
    deliveredAt: { type: Date },
    warrantyEndsAt: { type: Date },
    stagingUrl: { type: String, default: '' },
    proposal: { type: ObjectId, ref: 'Proposal' },
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
    number: { type: Number, index: true }, // TR-<number>, used in commit messages
    type: { type: String, enum: TASK_TYPES, default: 'feature' },
    milestone: { type: ObjectId, ref: 'Milestone' },
    changeRequest: { type: ObjectId, ref: 'ChangeRequest' },
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
    user: { type: ObjectId, ref: 'User' }, // empty for automatic comments (e.g. GitHub)
    authorName: { type: String, default: '' },
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
    followUpAt: { type: Date },
    client: { type: ObjectId, ref: 'Client' },
    notes: { type: String, default: '' },
    ip: { type: String, select: false },
  },
  { timestamps: true }
)
leadSchema.index({ type: 1, meetingDate: 1, meetingTime: 1 })

/* ------------------------------------------------------------------ */
/* Sequence counters (TR-12, TR-Q-0004, TR-INV-0009)                   */
/* ------------------------------------------------------------------ */
const counterSchema = new Schema({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } })

/* ------------------------------------------------------------------ */
/* Client account                                                      */
/* ------------------------------------------------------------------ */
const clientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // company
    contactPerson: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
    country: { type: String, default: '' },
    region: { type: String, default: '' },
    industry: { type: String, default: '' },
    accountStatus: { type: String, enum: CLIENT_STATUSES, default: 'Lead' },
    services: [{ type: String }],
    description: { type: String, default: '' },
    billingAddress: { type: String, default: '' },
    gstin: { type: String, default: '' },
    slaTier: { type: String, default: '' },
    contractEnd: { type: String, default: '' },
    testimonial: { type: String, default: '' },
    legacyId: { type: String, index: true }, // id from data/clients.json
    extra: { type: Schema.Types.Mixed, default: {} }, // other fields the CRM screen keeps (notes, links…)
    lead: { type: ObjectId, ref: 'Lead' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Proposal / quote                                                    */
/* ------------------------------------------------------------------ */
const lineItem = new Schema(
  { description: { type: String, required: true }, quantity: { type: Number, default: 1, min: 0 }, rate: { type: Number, default: 0, min: 0 } },
  { _id: false }
)
const proposalSchema = new Schema(
  {
    number: { type: String, index: true },
    client: { type: ObjectId, ref: 'Client', required: true },
    lead: { type: ObjectId, ref: 'Lead' },
    title: { type: String, required: true },
    summary: { type: String, default: '' }, // scope, deliverables
    items: [lineItem],
    discount: { type: Number, default: 0, min: 0 },
    gstPercent: { type: Number, default: 18, min: 0, max: 28 },
    timelineWeeks: { type: Number, default: 0 },
    milestones: [{ _id: false, title: String, percent: Number, weeksFromStart: Number }],
    terms: { type: String, default: '' },
    validUntil: { type: Date },
    status: { type: String, enum: PROPOSAL_STATUSES, default: 'draft', index: true },
    version: { type: Number, default: 1 },
    sentAt: Date,
    decidedAt: Date,
    decidedByName: String,
    decisionNote: String,
    decidedIp: String,
    project: { type: ObjectId, ref: 'Project' },
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Milestone                                                           */
/* ------------------------------------------------------------------ */
const milestoneSchema = new Schema(
  {
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: Date,
    percent: { type: Number, default: 0, min: 0, max: 100 }, // share of contract value billed
    status: { type: String, enum: MILESTONE_STATUSES, default: 'pending' },
    order: { type: Number, default: 0 },
    clientDecisionAt: Date,
    clientDecisionBy: String,
    clientNote: String,
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Change request                                                      */
/* ------------------------------------------------------------------ */
const changeRequestSchema = new Schema(
  {
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    source: { type: String, enum: ['client', 'staff'], default: 'staff' },
    requesterName: { type: String, default: '' },
    estimateHours: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    daysAdded: { type: Number, default: 0 },
    status: { type: String, enum: CHANGE_STATUSES, default: 'submitted', index: true },
    decidedAt: Date,
    decidedBy: String,
    task: { type: ObjectId, ref: 'Task' },
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Invoice                                                             */
/* ------------------------------------------------------------------ */
const invoiceSchema = new Schema(
  {
    number: { type: String, index: true },
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    client: { type: ObjectId, ref: 'Client' },
    milestone: { type: ObjectId, ref: 'Milestone' },
    items: [lineItem],
    gstPercent: { type: Number, default: 18 },
    subtotal: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: INVOICE_STATUSES, default: 'draft', index: true },
    issueDate: Date,
    dueDate: Date,
    paymentLink: { type: String, default: '' },
    razorpayLinkId: String,
    paidAt: Date,
    paymentRef: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Project file (links to Drive, Figma, builds, documents)             */
/* ------------------------------------------------------------------ */
const projectFileSchema = new Schema(
  {
    project: { type: ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    kind: { type: String, enum: ['brief', 'design', 'build', 'document', 'other'], default: 'document' },
    visibleToClient: { type: Boolean, default: false },
    stored: { type: Boolean, default: false }, // uploaded to Vercel Blob (vs. an external link)
    size: { type: Number, default: 0 },
    contentType: { type: String, default: '' },
    addedBy: { type: ObjectId, ref: 'User' },
    addedByClient: { type: String, default: '' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Secure links for clients (portal, proposal, review)                 */
/* Only a SHA-256 hash of the token is stored.                         */
/* ------------------------------------------------------------------ */
const accessLinkSchema = new Schema(
  {
    kind: { type: String, enum: ACCESS_KINDS, required: true },
    tokenHash: { type: String, required: true, unique: true },
    project: { type: ObjectId, ref: 'Project' },
    proposal: { type: ObjectId, ref: 'Proposal' },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    expiresAt: { type: Date, required: true },
    usedAt: Date,
    revokedAt: Date,
    lastSeenAt: Date,
    createdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Client review                                                       */
/* ------------------------------------------------------------------ */
const reviewSchema = new Schema(
  {
    project: { type: ObjectId, ref: 'Project' },
    client: { type: ObjectId, ref: 'Client' },
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, required: true },
    whatWeBuilt: { type: String, default: '' },
    text: { type: String, default: '' }, // what went well
    improve: { type: String, default: '' }, // private feedback
    consent: { type: Boolean, default: false },
    status: { type: String, enum: REVIEW_STATUSES, default: 'pending', index: true },
    verified: { type: Boolean, default: false }, // came through a client link
    approvedBy: { type: ObjectId, ref: 'User' },
    publishedAt: Date,
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* In-app notification for a staff member                              */
/* ------------------------------------------------------------------ */
const notificationSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    tab: { type: String, default: '' }, // where to open in the admin
    task: { type: ObjectId, ref: 'Task' },
    project: { type: ObjectId, ref: 'Project' },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

/* ------------------------------------------------------------------ */
/* Attendance (one row per person per day)                             */
/* ------------------------------------------------------------------ */
const attendanceSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD (IST)
    checkIn: Date,
    checkOut: Date,
    plan: { type: String, default: '' }, // what I will do today
    summary: { type: String, default: '' }, // what I did / blockers
    mode: { type: String, enum: ['office', 'remote'], default: 'office' },
  },
  { timestamps: true }
)
attendanceSchema.index({ user: 1, date: 1 }, { unique: true })

/* ------------------------------------------------------------------ */
/* Leave request                                                       */
/* ------------------------------------------------------------------ */
const leaveSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    from: { type: String, required: true }, // YYYY-MM-DD
    to: { type: String, required: true },
    type: { type: String, enum: LEAVE_TYPES, default: 'casual' },
    halfDay: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    status: { type: String, enum: LEAVE_STATUSES, default: 'pending', index: true },
    decidedBy: { type: ObjectId, ref: 'User' },
    decidedAt: Date,
    decisionNote: { type: String, default: '' },
  },
  { timestamps: true }
)

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
export const Counter = model('Counter', counterSchema)
export const Client = model('Client', clientSchema)
export const Proposal = model('Proposal', proposalSchema)
export const Milestone = model('Milestone', milestoneSchema)
export const ChangeRequest = model('ChangeRequest', changeRequestSchema)
export const Invoice = model('Invoice', invoiceSchema)
export const ProjectFile = model('ProjectFile', projectFileSchema)
export const AccessLink = model('AccessLink', accessLinkSchema)
export const Review = model('Review', reviewSchema)
export const Notification = model('Notification', notificationSchema)
export const Attendance = model('Attendance', attendanceSchema)
export const Leave = model('Leave', leaveSchema)

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId }
