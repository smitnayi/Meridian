"use client;"

import { useState } from 'react'

const ASSIGNEES = [
  { initials: 'AJ', name: 'Alex Johnson', color: '#8b5cf6' },
  { initials: 'SC', name: 'Sarah Chen', color: '#6366f1' },
  { initials: 'MW', name: 'Marcus Webb', color: '#10b981' },
  { initials: 'PN', name: 'Priya Nair', color: '#f59e0b' },
  { initials: 'KO', name: 'Kai Okafor', color: '#ef4444' },
  { initials: 'JL', name: 'Jordan Lee', color: '#0ea5e9' },
  { initials: 'NK', name: 'Nadia Kowalski', color: '#ec4899' },
  { initials: 'TR', name: 'Tomás Rivera', color: '#f97316' },
]

const ALL_TAGS = ['Auth', 'Backend', 'Frontend', 'Design', 'Payments', 'Security', 'Mobile', 'Infra', 'DevOps', 'Testing', 'API', 'Management']

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
]

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const PRIORITY_STYLES = {
  Critical: { border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
  High:     { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  Medium:   { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  Low:      { border: 'border-slate-400', bg: 'bg-slate-100', text: 'text-slate-600' },
}

export default function CreateTaskModal({ open, defaultColumnId, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [columnId, setColumnId] = useState(defaultColumnId)
  const [assigneeIdx, setAssigneeIdx] = useState(0)
  const [due, setDue] = useState('')
  const [tags, setTags] = useState([])
  const [titleErr, setTitleErr] = useState(false)

  if (!open) return null

  const handleAdd = () => {
    if (!title.trim()) {
      setTitleErr(true)
      return
    }

    const a = ASSIGNEES[assigneeIdx]
    const colMap = {
      backlog: 'Backlog',
      inprogress: 'In Progress',
      review: 'In Review',
      done: 'Done',
    }

    const task = {
      id: `task-${Date.now()}`,
      taskId: `MRD-${Math.floor(Math.random() * 900) + 100}`,
      title: title.trim(),
      description,
      priority,
      status: colMap[columnId] || 'Backlog',
      tags,
      assignee: a.initials,
      assigneeName: a.name,
      assigneeColor: a.color,
      due: due || undefined,
    }

    onAdd?.(task, columnId)

    // Reset Form
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setColumnId(defaultColumnId)
    setAssigneeIdx(0)
    setDue('')
    setTags([])
    setTitleErr(false)
    onClose?.()
  }

  const toggleTag = (t) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-[901] w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Create Task
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a new task to your project board
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleErr(false)
              }}
              placeholder="e.g. Implement user authentication flow"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-all ${
                titleErr
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
              }`}
            />
            {titleErr && (
              <p className="mt-1 text-xs text-rose-500 font-medium">⚠ Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-y"
            />
          </div>

          {/* Priority & Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Priority
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map((p) => {
                  const active = priority === p
                  const style = PRIORITY_STYLES[p]
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-all ${
                        active
                          ? `${style.border} ${style.bg} ${style.text} font-bold`
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Assignee
              </label>
              <select
                value={assigneeIdx}
                onChange={(e) => setAssigneeIdx(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              >
                {ASSIGNEES.map((a, i) => (
                  <option key={a.initials} value={i}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Due Date
              </label>
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((t) => {
                const active = tags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-all ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-semibold'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="mt-2 flex items-center gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-[2] rounded-xl bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-600 active:scale-95"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}