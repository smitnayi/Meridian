"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  PlusIcon, MoreHorizontalIcon, ClockIcon, FilterIcon,
  SearchIcon, CheckIcon, UsersIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import CreateTaskModal from '@/components/CreateTaskModal'

const priorityConfig = {
  Critical: { text: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  High:     { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  Medium:   { text: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  Low:      { text: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
}

const tagColors = {
  Auth:       'text-indigo-600 bg-indigo-50 border-indigo-100',
  Backend:    'text-sky-600 bg-sky-50 border-sky-100',
  Frontend:   'text-emerald-600 bg-emerald-50 border-emerald-100',
  Design:     'text-amber-600 bg-amber-50 border-amber-100',
  Payments:   'text-purple-600 bg-purple-50 border-purple-100',
  Security:   'text-rose-600 bg-rose-50 border-rose-100',
  Mobile:     'text-orange-600 bg-orange-50 border-orange-100',
  Infra:      'text-slate-600 bg-slate-100 border-slate-200',
  Testing:    'text-teal-600 bg-teal-50 border-teal-100',
}

const defaultColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    badgeColor: '#64748b',
    headerBg: 'bg-slate-100/80',
    description: 'Upcoming tasks queued for triage & refinement',
    tasks: [
      {
        id: '1',
        taskId: 'MRD-041',
        title: 'Redis cache layer for session management',
        description: 'Implement distributed session caching using Redis to reduce database read overhead on authenticated endpoints.',
        priority: 'High',
        tags: ['Backend', 'Infra'],
        assignee: 'SC',
        assigneeName: 'Sarah Chen',
        assigneeColor: '#818cf8',
        due: 'Aug 20, 2026',
        subtasks: [
          { text: 'Benchmark baseline latency', done: false },
          { text: 'Setup Redis cluster client', done: false },
          { text: 'Add token invalidation hook', done: false }
        ]
      },
      {
        id: '2',
        taskId: 'MRD-042',
        title: 'Implement RBAC permission system',
        description: 'Create fine-grained Role Based Access Control middleware for Admin, Manager, and Contributor roles.',
        priority: 'Medium',
        tags: ['Security', 'Backend'],
        assignee: 'MW',
        assigneeName: 'Marcus Webb',
        assigneeColor: '#10b981',
        due: 'Aug 25, 2026',
        subtasks: [
          { text: 'Define permission matrix', done: true },
          { text: 'Write route middleware', done: false }
        ]
      },
      {
        id: '3',
        taskId: 'MRD-043',
        title: 'Mobile push notification integration',
        description: 'Setup FCM and APNS delivery handlers for urgent task assignment notifications.',
        priority: 'Medium',
        tags: ['Mobile'],
        assignee: 'AJ',
        assigneeName: 'Alex Johnson',
        assigneeColor: '#6366f1',
        due: 'Aug 28, 2026',
        subtasks: []
      },
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    badgeColor: '#6366f1',
    headerBg: 'bg-indigo-50/80',
    description: 'Tasks actively being built and developed',
    tasks: [
      {
        id: '4',
        taskId: 'MRD-032',
        title: 'OAuth2 social login integration (Google & GitHub)',
        description: 'Complete authorization code flow and JWT session exchange for single sign-on providers.',
        priority: 'Critical',
        tags: ['Auth'],
        assignee: 'AJ',
        assigneeName: 'Alex Johnson',
        assigneeColor: '#8b5cf6',
        comments: 3,
        attachments: 1,
        due: 'Aug 8, 2026',
        subtasks: [
          { text: 'Google OAuth callback', done: true },
          { text: 'GitHub OAuth handler', done: true },
          { text: 'Profile sync on first login', done: true },
          { text: 'Error boundary handling', done: false },
          { text: 'Unit test coverage', done: false }
        ]
      },
      {
        id: '5',
        taskId: 'MRD-033',
        title: 'Stripe webhook event handling & subscription tiering',
        description: 'Secure idempotent webhook endpoint with signature verification for checkout.session.completed.',
        priority: 'High',
        tags: ['Payments', 'Backend'],
        assignee: 'SC',
        assigneeName: 'Sarah Chen',
        assigneeColor: '#6366f1',
        due: 'Aug 10, 2026',
        subtasks: [
          { text: 'Signature verification', done: true },
          { text: 'Customer DB sync', done: true },
          { text: 'Invoice email trigger', done: false }
        ]
      },
      {
        id: '6',
        taskId: 'MRD-034',
        title: 'Dashboard analytics interactive charts',
        description: 'Render SVG velocity trends, completion metrics, and sprint throughput with responsive tooltip bars.',
        priority: 'High',
        tags: ['Frontend'],
        assignee: 'JL',
        assigneeName: 'Jordan Lee',
        assigneeColor: '#0ea5e9',
        due: 'Aug 12, 2026',
        subtasks: []
      },
    ]
  },
  {
    id: 'in-review',
    title: 'In Review',
    badgeColor: '#f59e0b',
    headerBg: 'bg-amber-50/80',
    description: 'Code reviews, QA verification, and stakeholder approval',
    tasks: [
      {
        id: '7',
        taskId: 'MRD-028',
        title: 'Homepage redesign & responsive typography',
        description: 'Polished marketing landing view, responsive breakpoints, and glassmorphism elements.',
        priority: 'High',
        tags: ['Design', 'Frontend'],
        assignee: 'JL',
        assigneeName: 'Jordan Lee',
        assigneeColor: '#0ea5e9',
        comments: 5,
        due: 'Aug 9, 2026',
        subtasks: [
          { text: 'Hero banner layout', done: true },
          { text: 'Feature grid responsiveness', done: true },
          { text: 'Lighthouse speed test', done: true }
        ]
      },
      {
        id: '8',
        taskId: 'MRD-029',
        title: 'Email notification templates & Brevo integration',
        description: 'Responsive HTML templates for invite links, task assignments, and password resets.',
        priority: 'Medium',
        tags: ['Backend', 'Design'],
        assignee: 'KO',
        assigneeName: 'Kai Okafor',
        assigneeColor: '#ef4444',
        due: 'Aug 11, 2026',
        subtasks: []
      },
      {
        id: '9',
        taskId: 'MRD-030',
        title: 'Unit tests for auth service & token helpers',
        description: 'Ensure 95%+ branch coverage on token generation, verification, and expiration scenarios.',
        priority: 'Medium',
        tags: ['Testing'],
        assignee: 'MW',
        assigneeName: 'Marcus Webb',
        assigneeColor: '#10b981',
        due: 'Aug 12, 2026',
        subtasks: []
      },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    badgeColor: '#10b981',
    headerBg: 'bg-emerald-50/80',
    description: 'Completed and deployed to staging/production',
    tasks: [
      {
        id: '10',
        taskId: 'MRD-011',
        title: 'Project scaffolding & Next.js 16 setup',
        description: 'Repository structure, CSS design tokens, and modular directory organization.',
        priority: 'High',
        tags: ['Infra'],
        assignee: 'AJ',
        assigneeName: 'Alex Johnson',
        assigneeColor: '#8b5cf6',
        due: 'Aug 1, 2026',
        subtasks: []
      },
      {
        id: '11',
        taskId: 'MRD-012',
        title: 'Design system foundations & icon library',
        description: 'Created coherent icons, theme tokens, color palettes, and glass cards.',
        priority: 'High',
        tags: ['Design'],
        assignee: 'SC',
        assigneeName: 'Sarah Chen',
        assigneeColor: '#818cf8',
        due: 'Aug 3, 2026',
        subtasks: []
      },
      {
        id: '12',
        taskId: 'MRD-013',
        title: 'Database schema v1 & relational constraints',
        description: 'Defined Users, Projects, Tasks, Subtasks, Comments, and Channels schema.',
        priority: 'Critical',
        tags: ['Backend'],
        assignee: 'MW',
        assigneeName: 'Marcus Webb',
        assigneeColor: '#10b981',
        due: 'Aug 5, 2026',
        subtasks: []
      },
    ]
  }
]

/* ── Task Card Component ── */
function TaskCard({ task, currentColumnId, columns, onMoveTask, onClickTask }) {
  const pc = priorityConfig[task.priority] || priorityConfig.Low
  const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <div
      onClick={() => onClickTask(task, currentColumnId)}
      className="group relative mb-3 cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200"
    >
      {/* Priority & Task ID */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${pc.text} ${pc.bg}`}>
            {task.priority}
          </span>
          {task.taskId && (
            <span className="font-mono text-[11px] font-medium text-slate-400">
              {task.taskId}
            </span>
          )}
        </div>

        {/* Quick Column Switcher Dropdown */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <select
            value={currentColumnId}
            onChange={(e) => onMoveTask(task.id, currentColumnId, e.target.value)}
            className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 outline-none hover:border-indigo-400 hover:bg-white transition-colors"
            title="Move to another status"
          >
            {columns.map(c => (
              <option key={c.id} value={c.id}>
                → {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="mb-2 text-[13.5px] font-semibold leading-snug text-slate-800 group-hover:text-indigo-600 transition-colors">
        {task.title}
      </div>

      {/* Description Preview */}
      {task.description && (
        <p className="mb-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-400">
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            <span className="font-mono">
              {Math.round((completedSubtasks / totalSubtasks) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => {
            const styleClass = tagColors[tag] || 'text-slate-600 bg-slate-100 border-slate-200'
            return (
              <span
                key={tag}
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-medium ${styleClass}`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-xs"
            style={{ backgroundColor: task.assigneeColor || '#6366f1' }}
            title={task.assigneeName || task.assignee}
          >
            {task.assignee}
          </div>
          {(task.comments || task.attachments) && (
            <div className="flex gap-2 text-slate-400">
              {task.comments && <span>💬 {task.comments}</span>}
              {task.attachments && <span>📎 {task.attachments}</span>}
            </div>
          )}
        </div>
        {task.due && (
          <div className="flex items-center gap-1 font-medium text-slate-500">
            <ClockIcon size={12} />
            <span>{task.due}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Task Detail Modal / Drawer ── */
function TaskDetailModal({ task, columnId, columns, onClose, onUpdateSubtask, onMove, onDelete }) {
  if (!task) return null

  const pc = priorityConfig[task.priority] || priorityConfig.Low

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${pc.text} ${pc.bg}`}>
                {task.priority}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-400">
                {task.taskId || 'TASK'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Move status */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-xs font-semibold text-slate-600">Current Status:</span>
            <select
              value={columnId}
              onChange={(e) => {
                onMove(task.id, columnId, e.target.value)
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-600 outline-none hover:border-indigo-400"
            >
              {columns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {task.description || 'No detailed description provided for this task.'}
            </p>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Subtasks ({task.subtasks?.filter(s => s.done).length || 0}/{task.subtasks?.length || 0})
            </h4>
            {(!task.subtasks || task.subtasks.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No subtasks created.</p>
            ) : (
              <div className="space-y-1.5">
                {task.subtasks.map((st, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${
                      st.done ? 'bg-indigo-50/40 border-indigo-100 text-slate-500 line-through' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={st.done}
                      onChange={() => onUpdateSubtask(task.id, columnId, idx)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium">{st.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Assignee</span>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                  style={{ backgroundColor: task.assigneeColor || '#6366f1' }}
                >
                  {task.assignee}
                </div>
                <span className="text-xs font-medium text-slate-800">{task.assigneeName || 'Team Member'}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                <ClockIcon size={14} className="text-slate-400" />
                <span>{task.due || 'No deadline'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onDelete(task.id, columnId)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Kanban Component ── */
export default function Kanban() {
  const [columns, setColumns] = useState(defaultColumns)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultCol, setDefaultCol] = useState('backlog')
  const [selectedTaskData, setSelectedTaskData] = useState(null)

  const totalTasks = columns.reduce((acc, c) => acc + (c.tasks?.length || 0), 0)

  // Filter tasks by Priority, Assignee, Tag, or Search query
  const filterTasks = (tasks = []) => {
    return tasks.filter((t) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = t.title.toLowerCase().includes(q)
        const matchDesc = t.description?.toLowerCase().includes(q)
        const matchId = t.taskId?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchId) return false
      }

      // Tab filter
      if (activeFilter === 'Mine') return t.assignee === 'AJ'
      if (activeFilter === 'Critical') return t.priority === 'Critical'
      if (activeFilter === 'High') return t.priority === 'High'
      if (activeFilter === 'Backend') return t.tags?.includes('Backend')
      if (activeFilter === 'Frontend') return t.tags?.includes('Frontend')

      return true
    })
  }

  const openModal = (colId = 'backlog') => {
    setDefaultCol(colId)
    setModalOpen(true)
  }

  const handleAddTask = (task, colId) => {
    const formattedTask = {
      id: `task_${Date.now()}`,
      taskId: `MRD-0${Math.floor(Math.random() * 90) + 10}`,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      tags: task.tags || ['Frontend'],
      assignee: task.assignee || 'AJ',
      assigneeName: task.assigneeName || 'Alex Johnson',
      assigneeColor: '#6366f1',
      due: task.due || 'Aug 20, 2026',
      subtasks: task.subtasks?.map(s => ({ text: s, done: false })) || []
    }

    setColumns(prev => prev.map(col =>
      col.id === colId
        ? { ...col, tasks: [formattedTask, ...col.tasks] }
        : col
    ))

    const colTitle = columns.find((c) => c.id === colId)?.title || colId
    toast.success(`"${task.title}" added to ${colTitle}`)
  }

  const handleMoveTask = (taskId, sourceColId, targetColId) => {
    if (sourceColId === targetColId) return

    let movedTask = null
    const updated = columns.map(col => {
      if (col.id === sourceColId) {
        const remaining = col.tasks.filter(t => {
          if (t.id === taskId) {
            movedTask = t
            return false
          }
          return true
        })
        return { ...col, tasks: remaining }
      }
      return col
    })

    if (movedTask) {
      const finalCols = updated.map(col => {
        if (col.id === targetColId) {
          return { ...col, tasks: [movedTask, ...col.tasks] }
        }
        return col
      })
      setColumns(finalCols)
      const targetTitle = columns.find(c => c.id === targetColId)?.title
      toast.success(`Moved to ${targetTitle}`)

      if (selectedTaskData && selectedTaskData.task.id === taskId) {
        setSelectedTaskData({ task: movedTask, columnId: targetColId })
      }
    }
  }

  const handleToggleSubtask = (taskId, colId, subtaskIndex) => {
    setColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          tasks: col.tasks.map(t => {
            if (t.id === taskId) {
              const updatedSubtasks = [...t.subtasks]
              updatedSubtasks[subtaskIndex] = {
                ...updatedSubtasks[subtaskIndex],
                done: !updatedSubtasks[subtaskIndex].done
              }
              const updatedTask = { ...t, subtasks: updatedSubtasks }
              if (selectedTaskData && selectedTaskData.task.id === taskId) {
                setSelectedTaskData({ task: updatedTask, columnId: colId })
              }
              return updatedTask
            }
            return t
          })
        }
      }
      return col
    }))
  }

  const handleDeleteTask = (taskId, colId) => {
    setColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
      }
      return col
    }))
    setSelectedTaskData(null)
    toast.success('Task removed from board')
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#f4f6fb] text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Board Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-4">
            {/* Top Row: Title + Primary Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Project Kanban Board
                  </h1>
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700">
                    Sprint 14 Active
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                  Live task flow across Backlog, In Progress, In Review, and Done · {totalTasks} Total Tasks
                </p>
              </div>

              {/* Add Task Button (Always locked in top-right without wrapping) */}
              <button
                onClick={() => openModal('backlog')}
                className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 shrink-0"
              >
                <PlusIcon size={15} strokeWidth={2.5} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Sub-Toolbar: Filter Pills + Search input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-2.5 rounded-2xl border border-slate-200/70 shadow-xs backdrop-blur-md">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Filter:</span>
                {['All', 'Mine', 'Critical', 'Backend', 'Frontend'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      activeFilter === f
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative flex items-center w-full sm:w-64">
                <SearchIcon size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter tasks by name or ID..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-7 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Columns Grid Layout (4 Core Columns) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 items-start pb-10">
            {columns.map((col) => {
              const visible = filterTasks(col.tasks)
              return (
                <div
                  key={col.id}
                  className="flex flex-col min-w-0 rounded-2xl bg-slate-200/50 p-3 border border-slate-200/70"
                >
                  {/* Column Header */}
                  <div className={`mb-3 flex items-center justify-between rounded-xl border border-white bg-white/90 p-3 backdrop-blur-md shadow-xs ${col.headerBg}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: col.badgeColor }}
                      />
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {col.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-xs">
                        {visible.length}
                      </span>
                      <button
                        onClick={() => openModal(col.id)}
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white hover:text-indigo-600"
                        title={`Add task to ${col.title}`}
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Tasks List inside this Column */}
                  <div className="min-h-[140px] space-y-2">
                    {visible.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/40 py-8 text-center px-4">
                        <span className="text-xs font-medium text-slate-400">
                          {searchQuery ? 'No matching tasks' : 'No tasks in this stage'}
                        </span>
                        <button
                          onClick={() => openModal(col.id)}
                          className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          + Create task
                        </button>
                      </div>
                    ) : (
                      visible.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          currentColumnId={col.id}
                          columns={columns}
                          onMoveTask={handleMoveTask}
                          onClickTask={(t, cId) => setSelectedTaskData({ task: t, columnId: cId })}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* Create Task Modal */}
        <CreateTaskModal
          open={modalOpen}
          defaultColumnId={defaultCol}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddTask}
        />

        {/* Task Detail Modal */}
        {selectedTaskData && (
          <TaskDetailModal
            task={selectedTaskData.task}
            columnId={selectedTaskData.columnId}
            columns={columns}
            onClose={() => setSelectedTaskData(null)}
            onUpdateSubtask={handleToggleSubtask}
            onMove={handleMoveTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}