import { readFile } from 'fs/promises'
import { join } from 'path'
import { Types } from 'mongoose'
import { Client, Project } from '@/lib/models'

/** Fields stored as real columns; anything else the CRM screen sends is kept in `extra`. */
const KNOWN = [
  'name', 'contactPerson', 'email', 'phone', 'website', 'logo', 'country', 'region', 'industry',
  'accountStatus', 'services', 'description', 'billingAddress', 'gstin', 'slaTier', 'contractEnd', 'testimonial',
] as const
const STATUSES = ['Lead', 'Onboarding', 'Active', 'Past Client']

export function splitClient(input: Record<string, any>) {
  const known: Record<string, any> = {}
  const extra: Record<string, any> = {}
  for (const [k, v] of Object.entries(input)) {
    if (k === 'id' || k === '_id' || k === 'activeProjectsCount' || k === 'projectsCompleted') continue
    if ((KNOWN as readonly string[]).includes(k)) known[k] = v
    else extra[k] = v
  }
  known.name = String(known.name ?? '').trim() || 'Unnamed client'
  if (!STATUSES.includes(known.accountStatus)) known.accountStatus = 'Lead'
  if (known.services && !Array.isArray(known.services)) known.services = []
  for (const k of KNOWN) if (k !== 'services' && known[k] != null && typeof known[k] !== 'string') known[k] = String(known[k])
  return { known, extra }
}

/** One-time import of data/clients.json the first time the clients list is opened. */
export async function seedClientsFromJson() {
  if ((await Client.estimatedDocumentCount()) > 0) return
  try {
    const raw = JSON.parse(await readFile(join(process.cwd(), 'data', 'clients.json'), 'utf8'))
    const list: any[] = Array.isArray(raw) ? raw : []
    for (const c of list) {
      const { known, extra } = splitClient(c)
      await Client.updateOne({ legacyId: String(c.id) }, { $setOnInsert: { ...known, extra, legacyId: String(c.id), accountStatus: 'Active' } }, { upsert: true })
    }
  } catch (err) {
    console.error('[clients] seed failed', err)
  }
}

export async function listClients() {
  await seedClientsFromJson()
  const [clients, projects] = await Promise.all([
    Client.find().sort({ name: 1 }).lean(),
    Project.find({ clientRef: { $ne: null } }, { clientRef: 1, status: 1, value: 1 }).lean(),
  ])
  const stats = new Map<string, { active: number; done: number; value: number }>()
  for (const p of projects) {
    const k = String(p.clientRef)
    const s = stats.get(k) ?? { active: 0, done: 0, value: 0 }
    if (p.status === 'completed') s.done += 1
    else if (p.status !== 'cancelled') s.active += 1
    s.value += p.value ?? 0
    stats.set(k, s)
  }
  return clients.map((c) => {
    const s = stats.get(String(c._id))
    const extra = (c.extra ?? {}) as Record<string, any>
    return {
      ...extra,
      id: String(c._id),
      name: c.name,
      contactPerson: c.contactPerson,
      email: c.email,
      phone: c.phone,
      website: c.website,
      logo: c.logo,
      country: c.country,
      region: c.region,
      industry: c.industry,
      accountStatus: c.accountStatus,
      services: c.services ?? [],
      description: c.description,
      billingAddress: c.billingAddress,
      gstin: c.gstin,
      slaTier: c.slaTier,
      contractEnd: c.contractEnd,
      testimonial: c.testimonial,
      projectsCompleted: s ? s.done : Number(extra.projectsCompleted ?? 0) || 0,
      activeProjectsCount: s?.active ?? 0,
      totalValue: s && s.value ? `₹${Math.round(s.value).toLocaleString('en-IN')}` : extra.totalValue ?? '',
    }
  })
}

export const isObjectId = (id: unknown) => typeof id === 'string' && Types.ObjectId.isValid(id) && /^[a-f\d]{24}$/i.test(id)
