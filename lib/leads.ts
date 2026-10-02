import { z } from 'zod'

const text = (max: number) => z.string().trim().max(max).default('')
const email = z.string().trim().toLowerCase().email('Please enter a valid email address.')
const phone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d\s()-]*$/, 'Please enter a valid phone number.')
  .default('')
// Hidden "website" field: real people leave it empty, bots fill it.
const honeypot = { website: z.string().max(0).optional() }

export const contactLead = z.object({
  firstName: z.string().trim().min(1, 'Please enter your name.').max(80),
  lastName: text(80),
  email,
  company: text(140),
  service: text(100),
  message: z.string().trim().min(5, 'Please tell us a little more.').max(5000),
  ...honeypot,
})

export const meetingLead = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email,
  phone,
  company: text(140),
  message: text(3000),
  meetingType: z.string().trim().min(1, 'Please choose a meeting type.').max(60),
  date: z.string().date('Please choose a date.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Please choose a time.'),
  ...honeypot,
})

export const hireTeamLead = z.object({
  projectTitle: z.string().trim().min(2, 'Please add a project title.').max(200),
  description: text(5000),
  budget: text(80),
  timeline: text(80),
  contactName: z.string().trim().min(2, 'Please enter your name.').max(120),
  email,
  phone,
  selectedRoles: z.array(z.string().trim().max(80)).max(30).default([]),
  ...honeypot,
})

export const collaborationLead = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email,
  phone,
  experience: text(200),
  collaborationType: text(100),
  idea: z.string().trim().min(5, 'Please describe your idea.').max(5000),
  portfolio: text(300),
  ...honeypot,
})
