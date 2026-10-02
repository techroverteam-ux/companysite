'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type Me, type Project, type StaffUser, type TimeLog } from './lib'

type Notify = (message: string, type?: 'success' | 'error') => void

type Ctx = {
  me: Me
  users: StaffUser[]
  userMap: Map<string, StaffUser>
  projects: Project[]
  projectMap: Map<string, Project>
  refreshUsers: () => Promise<void>
  refreshProjects: () => Promise<void>
  timer: TimeLog | null
  startTimer: (opts: { task?: string | null; project?: string; note?: string }) => Promise<void>
  stopTimer: (note?: string) => Promise<void>
  /** Bumped whenever tasks or time change so open screens reload. */
  version: number
  bump: () => void
  notify: Notify
  openTask: (id: string) => void
  openNewTask: (defaults?: { project?: string; status?: string; assignees?: string[] }) => void
  taskDrawer: { id: string | null; create: null | { project?: string; status?: string; assignees?: string[] } }
  closeTaskDrawer: () => void
}

const WorkspaceContext = createContext<Ctx | null>(null)

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>')
  return ctx
}

export function WorkspaceProvider({ me, notify, children }: { me: Me; notify: Notify; children: ReactNode }) {
  const [users, setUsers] = useState<StaffUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [timer, setTimer] = useState<TimeLog | null>(null)
  const [version, setVersion] = useState(0)
  const [taskDrawer, setTaskDrawer] = useState<Ctx['taskDrawer']>({ id: null, create: null })

  const refreshUsers = useCallback(async () => {
    const res = await api<{ users: StaffUser[] }>('/api/admin/users')
    setUsers(res.users)
  }, [])
  const refreshProjects = useCallback(async () => {
    const res = await api<{ projects: Project[] }>('/api/admin/projects')
    setProjects(res.projects)
  }, [])
  const bump = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    refreshUsers().catch((e) => notify(e.message, 'error'))
    refreshProjects().catch((e) => notify(e.message, 'error'))
    api<{ timer: TimeLog | null }>('/api/admin/time/timer')
      .then((r) => setTimer(r.timer))
      .catch(() => {})
  }, [refreshUsers, refreshProjects, notify])

  // Refresh project stats whenever work changes.
  useEffect(() => {
    if (version) refreshProjects().catch(() => {})
  }, [version, refreshProjects])

  const startTimer = useCallback<Ctx['startTimer']>(
    async (opts) => {
      try {
        const res = await api<{ timer: TimeLog; stopped: TimeLog | null }>('/api/admin/time/timer', { method: 'POST', body: { action: 'start', ...opts } })
        setTimer(res.timer)
        notify(res.stopped ? 'Previous timer saved. New timer started.' : 'Timer started.')
        bump()
      } catch (e: any) {
        notify(e.message, 'error')
      }
    },
    [notify, bump]
  )
  const stopTimer = useCallback<Ctx['stopTimer']>(
    async (note) => {
      try {
        const res = await api<{ stopped: TimeLog | null }>('/api/admin/time/timer', { method: 'POST', body: { action: 'stop', ...(note !== undefined ? { note } : {}) } })
        setTimer(null)
        if (res.stopped) notify(`Logged ${Math.round(res.stopped.minutes)} min.`)
        bump()
      } catch (e: any) {
        notify(e.message, 'error')
      }
    },
    [notify, bump]
  )

  const value = useMemo<Ctx>(
    () => ({
      me,
      users,
      userMap: new Map(users.map((u) => [u.id, u])),
      projects,
      projectMap: new Map(projects.map((p) => [p.id, p])),
      refreshUsers,
      refreshProjects,
      timer,
      startTimer,
      stopTimer,
      version,
      bump,
      notify,
      openTask: (id) => setTaskDrawer({ id, create: null }),
      openNewTask: (defaults) => setTaskDrawer({ id: null, create: defaults ?? {} }),
      taskDrawer,
      closeTaskDrawer: () => setTaskDrawer({ id: null, create: null }),
    }),
    [me, users, projects, refreshUsers, refreshProjects, timer, startTimer, stopTimer, version, bump, notify, taskDrawer]
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
