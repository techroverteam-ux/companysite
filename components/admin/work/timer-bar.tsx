'use client'

import { useEffect, useState } from 'react'
import { Square, Timer } from 'lucide-react'
import { useWorkspace } from './context'

function elapsed(startedAt: string | null) {
  if (!startedAt) return '0:00:00'
  const s = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/** Shows the running timer everywhere in the Workspace, with a Stop button. */
export function TimerBar() {
  const { timer, stopTimer, projectMap, openTask } = useWorkspace()
  const [, tick] = useState(0)
  useEffect(() => {
    if (!timer) return
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [timer])
  if (!timer) return null
  const project = projectMap.get(timer.project)
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-800/70 bg-emerald-950/40 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <Timer className="h-4 w-4 text-emerald-300" />
        <span className="font-mono text-sm font-semibold text-emerald-200">{elapsed(timer.startedAt)}</span>
        <button
          className="truncate text-left text-sm text-zinc-200 hover:underline"
          onClick={() => timer.task && openTask(timer.task)}
          disabled={!timer.task}
        >
          {project?.name ?? 'Project'}
          {timer.note ? ` · ${timer.note}` : ''}
          {timer.task && <span className="ml-2 text-xs text-emerald-300/80">View task →</span>}
        </button>
      </div>
      <button
        onClick={() => stopTimer()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
      >
        <Square className="h-3 w-3 fill-current" /> Stop &amp; log
      </button>
    </div>
  )
}
