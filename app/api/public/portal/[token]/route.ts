import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, clientIp, parseBody, rateLimit, route, zId } from '@/lib/api'
import { ChangeRequest, Client, Milestone, Project, ProjectFile, Task } from '@/lib/models'
import { isBlobUrl } from '@/lib/blob'
import { changeToTask, milestonesWithStats, projectFiles, projectInvoices, serializeChange } from '@/lib/delivery'
import { findAccessLink, managerIds, notify } from '@/lib/workflow'

type Ctx = { params: Promise<{ token: string }> }

const STAGE_LABEL: Record<string, string> = {
  onboarding: 'Onboarding', development: 'Development', qa_uat: 'Testing (QA & UAT)', delivery: 'Delivery', support: 'Live — support period', closed: 'Closed',
}

async function load(token: string) {
  const link = await findAccessLink(token, 'portal')
  if (!link?.project) throw new ApiError(404, 'This link is not valid any more. Please ask TechRover for a new one.')
  const project = await Project.findById(link.project)
  if (!project) throw new ApiError(404, 'Project not found.')
  return { link, project }
}

export const GET = route<Ctx>(async (req, { params }) => {
  rateLimit(`pub:${clientIp(req)}`, 60, 60_000)
  const { link, project } = await load((await params).token)
  link.lastSeenAt = new Date()
  await link.save()
  const [client, milestones, changes, invoices, files, taskRows] = await Promise.all([
    project.clientRef ? Client.findById(project.clientRef, { name: 1 }).lean() : null,
    milestonesWithStats(project._id),
    ChangeRequest.find({ project: project._id }).sort({ createdAt: -1 }).lean(),
    projectInvoices(project._id, true),
    projectFiles(project._id, true),
    Task.find({ project: project._id }, { status: 1 }).lean(),
  ])
  const done = taskRows.filter((t) => t.status === 'done').length
  return NextResponse.json({
    viewer: { name: link.name },
    project: {
      name: project.name,
      client: client?.name ?? project.client,
      stage: project.stage,
      stageLabel: STAGE_LABEL[project.stage ?? 'onboarding'],
      startDate: project.startDate ?? null,
      dueDate: project.dueDate ?? null,
      stagingUrl: project.stagingUrl ?? '',
      deliveredAt: project.deliveredAt ?? null,
      warrantyEndsAt: project.warrantyEndsAt ?? null,
      progress: taskRows.length ? Math.round((done / taskRows.length) * 100) : 0,
      tasksDone: done,
      tasksTotal: taskRows.length,
      onboarding: (project.onboarding ?? []).map((o) => ({ label: o.label, done: !!o.done })),
    },
    milestones,
    changes: changes.map((c) => {
      const s = serializeChange(c)
      return { id: s.id, title: s.title, description: s.description, status: s.status, cost: s.cost, daysAdded: s.daysAdded, estimateHours: s.estimateHours, source: s.source, createdAt: s.createdAt }
    }),
    invoices: invoices.map((i) => ({ id: i.id, number: i.number, total: i.total, status: i.status, dueDate: i.dueDate, paidAt: i.paidAt, paymentLink: i.paymentLink, items: i.items, gstPercent: i.gstPercent, subtotal: i.subtotal, gstAmount: i.gstAmount })),
    files: files.map((f) => ({ id: f.id, title: f.title, url: f.url, kind: f.kind, size: f.size, fromClient: !!f.addedByClient, createdAt: f.createdAt })),
    uploadsEnabled: !!process.env.BLOB_READ_WRITE_TOKEN,
    projectId: String(project._id),
  })
})

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('milestone'), id: zId, decision: z.enum(['approve', 'changes']), name: z.string().trim().min(2).max(120), note: z.string().max(3000).default('') }),
  z.object({ action: z.literal('change_request'), title: z.string().trim().min(3).max(200), description: z.string().max(5000).default(''), name: z.string().trim().min(2).max(120) }),
  z.object({ action: z.literal('change_decision'), id: zId, decision: z.enum(['approve', 'reject']), name: z.string().trim().min(2).max(120) }),
  z.object({ action: z.literal('delivery_signoff'), name: z.string().trim().min(2).max(120), note: z.string().max(3000).default('') }),
  z.object({ action: z.literal('file'), name: z.string().trim().min(2).max(120), title: z.string().trim().min(1).max(200), url: z.string().url(), size: z.coerce.number().min(0).default(0), contentType: z.string().max(200).default('') }),
])

/** What a client can do from the portal. Every decision records name, time and IP. */
export const POST = route<Ctx>(async (req, { params }) => {
  const ip = clientIp(req)
  rateLimit(`pub-post:${ip}`, 20, 60_000)
  const { project } = await load((await params).token)
  const input = await parseBody(req, schema)
  const managers = [...(await managerIds()), ...(project.lead ? [String(project.lead)] : [])]
  const who = `${input.name} (client, ${ip})`

  if (input.action === 'milestone') {
    const m = await Milestone.findOne({ _id: input.id, project: project._id })
    if (!m) throw new ApiError(404, 'Milestone not found.')
    if (m.status !== 'ready_for_uat') throw new ApiError(400, 'This milestone is not waiting for your review.')
    m.status = input.decision === 'approve' ? 'approved' : 'changes_requested'
    m.clientDecisionAt = new Date()
    m.clientDecisionBy = who
    m.clientNote = input.note
    await m.save()
    await notify(managers, { title: `${project.name}: client ${input.decision === 'approve' ? 'APPROVED' : 'requested changes to'} “${m.title}”`, body: input.note, tab: 'projects', project: project._id }, { email: true })
  } else if (input.action === 'change_request') {
    await ChangeRequest.create({ project: project._id, title: input.title, description: input.description, source: 'client', requesterName: who, status: 'submitted' })
    await notify(managers, { title: `${project.name}: new change request from ${input.name}`, body: input.title, tab: 'projects', project: project._id }, { email: true })
  } else if (input.action === 'change_decision') {
    const cr = await ChangeRequest.findOne({ _id: input.id, project: project._id })
    if (!cr) throw new ApiError(404, 'Change request not found.')
    if (cr.status !== 'estimated') throw new ApiError(400, 'This change is not waiting for your decision.')
    cr.status = input.decision === 'approve' ? 'approved' : 'rejected'
    cr.decidedAt = new Date()
    cr.decidedBy = who
    await cr.save()
    if (cr.status === 'approved') await changeToTask(cr._id)
    await notify(managers, { title: `${project.name}: client ${input.decision === 'approve' ? 'approved' : 'declined'} change “${cr.title}”`, body: cr.cost ? `₹${cr.cost.toLocaleString('en-IN')}` : '', tab: 'projects', project: project._id }, { email: true })
  } else if (input.action === 'file') {
    if (!isBlobUrl(input.url) || !new URL(input.url).pathname.includes(`/projects/${project._id}/client/`)) throw new ApiError(400, 'Please upload the file again.')
    await ProjectFile.create({ project: project._id, title: input.title, url: input.url, kind: 'brief', visibleToClient: true, stored: true, size: input.size, contentType: input.contentType, addedByClient: input.name })
    await notify(managers, { title: `${project.name}: ${input.name} uploaded “${input.title}”`, body: 'See the Files tab on the project.', tab: 'projects', project: project._id })
  } else {
    if (project.stage !== 'delivery') throw new ApiError(400, 'Delivery sign-off opens when the project reaches the Delivery stage.')
    project.stage = 'support'
    project.deliveredAt = new Date()
    project.warrantyEndsAt = new Date(Date.now() + Number(process.env.WARRANTY_DAYS || 90) * 864e5)
    await project.save()
    await notify(managers, { title: `${project.name}: delivery signed off by ${input.name}`, body: input.note || 'Support period has started. Send a review link!', tab: 'projects', project: project._id }, { email: true })
  }
  return NextResponse.json({ ok: true })
})
