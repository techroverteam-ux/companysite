'use client'

import { useState } from 'react'
import { useWorkspace } from './context'
import { isManager } from './lib'
import { AttendanceView } from './attendance'
import { InvoicesView } from './invoices-view'
import { LeadsInbox } from './leads-inbox'
import { MyWork } from './my-work'
import { ProjectDetail } from './project-detail'
import { ProjectsView } from './projects-view'
import { ProposalsView } from './proposals'
import { ReviewsView } from './reviews-view'
import { TaskBoard } from './task-board'
import { TaskDrawer } from './task-drawer'
import { TeamManager } from './team-manager'
import { TimerBar } from './timer-bar'
import { Timesheets } from './timesheets'

export const WORKSPACE_TABS = ['my-work', 'tasks', 'projects', 'timesheets', 'attendance', 'staff', 'proposals', 'invoices', 'client-reviews']
/** Tabs that use the dark Workspace look (everything except the old website-content editors). */
export const DARK_TABS = [...WORKSPACE_TABS, 'clients', 'contacts', 'schedule']

/** Renders the Workspace tab that is active, plus the shared timer bar, task drawer and project drawer. */
export function WorkspaceScreens({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  const { me } = useWorkspace()
  const [boardProject, setBoardProject] = useState('')
  const [boardAssignee, setBoardAssignee] = useState('')
  const [sheetUser, setSheetUser] = useState('')
  const [openProject, setOpenProject] = useState<string | null>(null)
  const [proposalPreset, setProposalPreset] = useState<{ client: string; lead?: string; title?: string } | null>(null)
  const manager = isManager(me)

  const showBoard = (opts: { project?: string; assignee?: string }) => {
    setOpenProject(null)
    setBoardProject(opts.project ?? '')
    setBoardAssignee(opts.assignee ?? '')
    setActiveTab('tasks')
  }
  const showSheet = (user: string) => {
    setSheetUser(user)
    setActiveTab('timesheets')
  }
  const propose = (client: string, lead?: string, title?: string) => {
    setProposalPreset({ client, lead, title })
    setActiveTab('proposals')
  }

  return (
    <>
      {DARK_TABS.includes(activeTab) && <TimerBar />}
      {activeTab === 'my-work' && <MyWork onShowTeamMember={(id) => showBoard({ assignee: id })} onShowUnassigned={() => showBoard({ assignee: 'none' })} />}
      {activeTab === 'tasks' && <TaskBoard initialProject={boardProject} initialAssignee={boardAssignee} />}
      {activeTab === 'projects' && <ProjectsView onOpenBoard={(id) => showBoard({ project: id })} onOpenProject={setOpenProject} />}
      {activeTab === 'timesheets' && <Timesheets initialUser={sheetUser} />}
      {activeTab === 'attendance' && <AttendanceView />}
      {activeTab === 'staff' && manager && <TeamManager onViewTimesheet={showSheet} onViewTasks={(id) => showBoard({ assignee: id })} />}
      {activeTab === 'contacts' && manager && <LeadsInbox onCreateProposal={propose} />}
      {activeTab === 'schedule' && manager && <LeadsInbox meetingsOnly onCreateProposal={propose} />}
      {activeTab === 'proposals' && manager && <ProposalsView preset={proposalPreset} onPresetUsed={() => setProposalPreset(null)} onOpenProject={(id) => { setActiveTab('projects'); setOpenProject(id) }} />}
      {activeTab === 'invoices' && manager && <InvoicesView onOpenProject={setOpenProject} />}
      {activeTab === 'client-reviews' && manager && <ReviewsView />}
      <ProjectDetail projectId={openProject} onClose={() => setOpenProject(null)} onOpenBoard={(id) => showBoard({ project: id })} />
      <TaskDrawer />
    </>
  )
}
