"use client"
import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import { PlusIcon, MoreHorizontalIcon, ClockIcon, FilterIcon } from '@/components/Icons'
import { toast } from 'react-hot-toast'
import CreateTaskModal from '@/components/CreateTaskModal'

const priorityConfig = {
  Critical: { text: 'text-rose-500', bg: 'bg-rose-50' },
  High:     { text: 'text-amber-500', bg: 'bg-amber-50' },
  Medium:   { text: 'text-indigo-500', bg: 'bg-indigo-50' },
  Low:      { text: 'text-slate-400', bg: 'bg-slate-50' },
}

console.log({ Sidebar, CreateTaskModal, PlusIcon, FilterIcon, ClockIcon })

const tagColors = {
  Auth:       'text-indigo-500 bg-indigo-50',
  Backend:    'text-sky-500 bg-sky-50',
  Frontend:   'text-emerald-500 bg-emerald-50',
  Design:     'text-amber-500 bg-amber-50',
  Payments:   'text-purple-500 bg-purple-50',
  Security:   'text-rose-500 bg-rose-50',
  Mobile:     'text-orange-500 bg-orange-50',
  Infra:      'text-slate-500 bg-slate-100',
  Testing:    'text-emerald-500 bg-emerald-50',
}

const defaultColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#94a3b8',
    tasks: [
      { id: '1', taskId: 'MRD-041', title: 'Redis cache layer for session management', priority: 'High', tags: ['Backend'], assignee: 'SC', assigneeColor: '#818cf8', due: 'Aug 20', subtasks: { done: 0, total: 5 } },
      { id: '2', taskId: 'MRD-042', title: 'Implement RBAC permission system', priority: 'Medium', tags: ['Security', 'Backend'], assignee: 'MW', assigneeColor: '#10b981', due: 'Aug 25' },
      { id: '3', taskId: 'MRD-043', title: 'Mobile push notification integration', priority: 'Medium', tags: ['Mobile'], assignee: 'AJ', assigneeColor: '#6366f1' },
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#6366f1',
    tasks: [
      { id: '4', taskId: 'MRD-032', title: 'OAuth2 social login integration', priority: 'Critical', tags: ['Auth'], assignee: 'AJ', assigneeColor: '#8b5cf6', comments: 3, attachments: 1, due: 'Aug 8', subtasks: { done: 3, total: 6 } },
      { id: '5', taskId: 'MRD-033', title: 'Stripe webhook event handling', priority: 'High', tags: ['Payments', 'Backend'], assignee: 'SC', assigneeColor: '#6366f1', due: 'Aug 10', subtasks: { done: 2, total: 4 } },
      { id: '6', taskId: 'MRD-034', title: 'Dashboard analytics charts', priority: 'High', tags: ['Frontend'], assignee: 'JL', assigneeColor: '#0ea5e9' },
    ]
  },
  {
    id: 'in-review',
    title: 'In Review',
    color: '#f59e0b',
    tasks: [
      { id: '7', taskId: 'MRD-028', title: 'Homepage redesign & responsive layout', priority: 'High', tags: ['Design', 'Frontend'], assignee: 'JL', assigneeColor: '#0ea5e9', comments: 5, due: 'Aug 9', subtasks: { done: 8, total: 9 } },
      { id: '8', taskId: 'MRD-029', title: 'Email notification templates', priority: 'Medium', tags: ['Backend', 'Design'], assignee: 'KO', assigneeColor: '#ef4444', due: 'Aug 11' },
      { id: '9', taskId: 'MRD-030', title: 'Unit tests for auth service', priority: 'Medium', tags: ['Testing'], assignee: 'MW', assigneeColor: '#10b981' },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981',
    tasks: [
      { id: '10', taskId: 'MRD-011', title: 'Project scaffolding & monorepo setup', priority: 'High', tags: ['Infra'], assignee: 'AJ', assigneeColor: '#8b5cf6' },
      { id: '11', taskId: 'MRD-012', title: 'Design system foundations', priority: 'High', tags: ['Design'], assignee: 'SC', assigneeColor: '#818cf8' },
      { id: '12', taskId: 'MRD-013', title: 'Database schema v1', priority: 'Critical', tags: ['Backend'], assignee: 'MW', assigneeColor: '#10b981' },
    ]
  }
]

function TaskCard({ task, onClick }) {
  const pc = priorityConfig[task.priority] || priorityConfig.Low

  return (
    <div
      onClick={onClick}
      className="group relative mb-3 cursor-pointer rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(99,102,241,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.12)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${pc.text}`}>
            {task.priority}
          </span>
          {task.taskId && (
            <span className="font-mono text-[11px] font-medium text-slate-400">
              {task.taskId}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            toast.info('Task options menu')
          }}
          className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-600"
        >
          <MoreHorizontalIcon size={14} />
        </button>
      </div>

      <div className="mb-2 text-[13px] font-semibold leading-snug text-slate-800">
        {task.title}
      </div>

      {task.subtasks && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-400">
            <span>{task.subtasks.done}/{task.subtasks.total} subtasks</span>
            <span className="font-mono">
              {Math.round((task.subtasks.done / task.subtasks.total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(task.subtasks.done / task.subtasks.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-1">
        {task.tags?.map((tag) => {
          const styleClass = tagColors[tag] || 'text-slate-500 bg-slate-100'
          return (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styleClass}`}
            >
              {tag}
            </span>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-xs"
            style={{ backgroundColor: task.assigneeColor || '#6366f1' }}
          >
            {task.assignee}
          </div>
          {(task.comments || task.attachments) && (
            <div className="flex gap-2">
              {task.comments && <span>💬 {task.comments}</span>}
              {task.attachments && <span>📎 {task.attachments}</span>}
            </div>
          )}
        </div>
        {task.due && (
          <div className="flex items-center gap-1 font-medium">
            <ClockIcon size={12} />
            <span>{task.due}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Kanban({
  columns = defaultColumns,
  onTaskClick,
  onAddTask,
  navigate,
  currentPage = 'kanban'
}) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultCol, setDefaultCol] = useState('backlog')

  const totalTasks = columns.reduce((acc, c) => acc + (c.tasks?.length || 0), 0)

  const filterTasks = (tasks = []) => {
    if (activeFilter === 'Mine') return tasks.filter((t) => t.assignee === 'AJ')
    if (activeFilter === 'Critical') return tasks.filter((t) => t.priority === 'Critical')
    return tasks
  }

  const openModal = (colId = 'backlog') => {
    setDefaultCol(colId)
    setModalOpen(true)
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f0f3ff] text-slate-800">
      {/* Integrated Sidebar */}
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onNotificationClick={() => toast.info('Notifications clicked')}
        onProfileClick={() => toast.info('Profile clicked')}
        onCommandPalette={() => toast.info('Command Palette opened')}
      />

      {/* Main Board Content */}
      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Authentication Service
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                Active
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Sprint 14 · Aug 1 – Aug 14, 2026 · {totalTasks} tasks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-0.5 rounded-xl border border-slate-200/60 bg-white p-1 shadow-xs">
              {['All', 'Mine', 'Critical'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeFilter === f
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast.info('Advanced filter panel')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-xs transition-colors hover:bg-slate-50"
            >
              <FilterIcon size={14} /> Filter
            </button>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-600"
            >
              <PlusIcon size={14} strokeWidth={2.5} /> Add Task
            </button>
          </div>
        </div>

        {/* Filter Indicator Badge */}
        {activeFilter !== 'All' && (
          <div className="mb-4 flex items-center gap-2 text-xs">
            <span className="font-medium text-indigo-600">Showing:</span>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-semibold text-indigo-600">
              {activeFilter}
            </span>
            <button
              onClick={() => setActiveFilter('All')}
              className="text-slate-400 transition-colors hover:text-slate-600"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Columns Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {columns.map((col) => {
            const visible = filterTasks(col.tasks)
            return (
              <div key={col.id} className="flex flex-col min-w-0">
                {/* Column Card Header */}
                <div className="mb-3 flex items-center justify-between rounded-xl border border-white bg-white/80 p-3 backdrop-blur-md shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {col.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
                      {visible.length}
                    </span>
                    <button
                      onClick={() => openModal(col.id)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </div>

                {/* Column Cards Container */}
                <div>
                  {visible.length === 0 && activeFilter !== 'All' && (
                    <div className="rounded-2xl border border-dashed border-slate-300 py-6 text-center text-xs text-slate-400">
                      No {activeFilter === 'Mine' ? 'assigned' : 'critical'} tasks
                    </div>
                  )}

                  {visible.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <CreateTaskModal
        open={modalOpen}
        defaultColumnId={defaultCol}
        onClose={() => setModalOpen(false)}
        onAdd={(task, colId) => {
          onAddTask?.(task, colId)
          toast.success(
            `"${task.title}" added to ${
              columns.find((c) => c.id === colId)?.title || colId
            }`
          )
        }}
      />
    </div>
  )
}