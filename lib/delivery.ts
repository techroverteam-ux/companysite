import { Types } from 'mongoose'
import { ChangeRequest, Invoice, Milestone, ProjectFile, Task } from '@/lib/models'
import { nextSeq } from '@/lib/workflow'

export const serializeMilestone = (m: any, stats?: { tasks: number; done: number }) => ({
  id: String(m._id),
  project: String(m.project),
  title: m.title,
  description: m.description ?? '',
  dueDate: m.dueDate ?? null,
  percent: m.percent ?? 0,
  status: m.status,
  order: m.order ?? 0,
  clientDecisionAt: m.clientDecisionAt ?? null,
  clientDecisionBy: m.clientDecisionBy ?? '',
  clientNote: m.clientNote ?? '',
  tasks: stats?.tasks ?? 0,
  tasksDone: stats?.done ?? 0,
})

export const serializeChange = (c: any) => ({
  id: String(c._id),
  project: String(c.project),
  title: c.title,
  description: c.description ?? '',
  source: c.source,
  requesterName: c.requesterName ?? '',
  estimateHours: c.estimateHours ?? 0,
  cost: c.cost ?? 0,
  daysAdded: c.daysAdded ?? 0,
  status: c.status,
  decidedAt: c.decidedAt ?? null,
  decidedBy: c.decidedBy ?? '',
  task: c.task ? String(c.task) : null,
  createdAt: c.createdAt,
})

export const serializeInvoice = (i: any) => ({
  id: String(i._id),
  number: i.number,
  project: String(i.project),
  client: i.client ? String(i.client) : null,
  milestone: i.milestone ? String(i.milestone) : null,
  items: (i.items ?? []).map((x: any) => ({ description: x.description, quantity: x.quantity, rate: x.rate })),
  gstPercent: i.gstPercent,
  subtotal: i.subtotal,
  gstAmount: i.gstAmount,
  total: i.total,
  status: i.status,
  issueDate: i.issueDate ?? null,
  dueDate: i.dueDate ?? null,
  paymentLink: i.paymentLink ?? '',
  paidAt: i.paidAt ?? null,
  paymentRef: i.paymentRef ?? '',
  notes: i.notes ?? '',
  createdAt: i.createdAt,
})

export const serializeFile = (f: any) => ({
  id: String(f._id),
  project: String(f.project),
  title: f.title,
  url: f.url,
  kind: f.kind,
  visibleToClient: !!f.visibleToClient,
  stored: !!f.stored,
  size: f.size ?? 0,
  contentType: f.contentType ?? '',
  addedByClient: f.addedByClient ?? '',
  addedBy: f.addedBy ? String(f.addedBy) : null,
  createdAt: f.createdAt,
})

export async function milestonesWithStats(projectId: Types.ObjectId) {
  const [ms, tasks] = await Promise.all([
    Milestone.find({ project: projectId }).sort({ order: 1, dueDate: 1 }).lean(),
    Task.find({ project: projectId, milestone: { $ne: null } }, { milestone: 1, status: 1 }).lean(),
  ])
  const stats = new Map<string, { tasks: number; done: number }>()
  for (const t of tasks) {
    const k = String(t.milestone)
    const s = stats.get(k) ?? { tasks: 0, done: 0 }
    s.tasks += 1
    if (t.status === 'done') s.done += 1
    stats.set(k, s)
  }
  return ms.map((m) => serializeMilestone(m, stats.get(String(m._id))))
}

/** An approved change request becomes a task on the board. */
export async function changeToTask(changeId: Types.ObjectId, createdBy?: Types.ObjectId) {
  const cr = await ChangeRequest.findById(changeId)
  if (!cr || cr.task) return cr?.task
  const task = await Task.create({
    project: cr.project,
    title: `Change: ${cr.title}`,
    description: cr.description,
    type: 'change',
    estimateHours: cr.estimateHours,
    changeRequest: cr._id,
    number: await nextSeq('task'),
    position: Date.now(),
    createdBy,
  })
  cr.task = task._id
  await cr.save()
  return task._id
}

export async function projectFiles(projectId: Types.ObjectId, clientOnly = false) {
  const files = await ProjectFile.find({ project: projectId, ...(clientOnly ? { visibleToClient: true } : {}) }).sort({ createdAt: -1 }).lean()
  return files.map(serializeFile)
}

export async function projectInvoices(projectId: Types.ObjectId, clientOnly = false) {
  const list = await Invoice.find({ project: projectId, ...(clientOnly ? { status: { $in: ['sent', 'paid'] } } : {}) }).sort({ createdAt: 1 }).lean()
  return list.map(serializeInvoice)
}
