'use client'

import { useState } from 'react'
import { useWorkspace } from './context'
import { isManager } from './lib'
import { LeadsInbox } from './leads-inbox'
import { MyWork } from './my-work'
import { ProjectsView } from './projects-view'
import { TaskBoard } from './task-board'
import { TaskDrawer } from './task-drawer'
import { TeamManager } from './team-manager'
import { TimerBar } from './timer-bar'
import { Timesheets } from './timesheets'

export const WORKSPACE_TABS = ['my-work', 'tasks', 'projects', 'timesheets', 'staff']

/** Renders the Workspace tab that is active, plus the shared timer bar and task drawer. */
export function WorkspaceScreens({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  const { me } = useWorkspace()
  const [boardProject, setBoardProject] = useState('')
  const [boardAssignee, setBoardAssignee] = useState('')
  const [sheetUser, setSheetUser] = useState('')
  const manager = isManager(me)

  const showBoard = (opts: { project?: string; assignee?: string }) => {
    setBoardProject(opts.project ?? '')
    setBoardAssignee(opts.assignee ?? '')
    setActiveTab('tasks')
  }
  const showSheet = (user: string) => {
    setSheetUser(user)
    setActiveTab('timesheets')
  }

  const inWorkspace = WORKSPACE_TABS.includes(activeTab) || activeTab === 'contacts' || activeTab === 'schedule'

  return (
    <>
      {inWorkspace && <TimerBar />}
      {activeTab === 'my-work' && <MyWork onShowTeamMember={(id) => showBoard({ assignee: id })} onShowUnassigned={() => showBoard({ assignee: 'none' })} />}
      {activeTab === 'tasks' && <TaskBoard initialProject={boardProject} initialAssignee={boardAssignee} />}
      {activeTab === 'projects' && <ProjectsView onOpenBoard={(id) => showBoard({ project: id })} />}
      {activeTab === 'timesheets' && <Timesheets initialUser={sheetUser} />}
      {activeTab === 'staff' && manager && <TeamManager onViewTimesheet={showSheet} onViewTasks={(id) => showBoard({ assignee: id })} />}
      {activeTab === 'contacts' && manager && <LeadsInbox />}
      {activeTab === 'schedule' && manager && <LeadsInbox meetingsOnly />}
      <TaskDrawer />
    </>
  )
}
