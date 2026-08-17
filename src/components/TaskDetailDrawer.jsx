"use client"

import React, { useState } from 'react'
import {
  CheckIcon, ClockIcon, UsersIcon, TagIcon, PlusIcon,
  SmileIcon, AttachIcon, SendIcon, TrashIcon, AlertIcon
} from './Icons'
import { toast } from 'react-hot-toast'

export default function TaskDetailDrawer({ task, open, onClose, onUpdateTask, onDeleteTask }) {
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSubtask, setNewSubtask] = useState('')
  const [comments, setComments] = useState([
    { id: 'c1', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '1 hour ago', text: 'Completed initial endpoint mocks for this task. Ready for testing!' },
    { id: 'c2', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '30m ago', text: 'Reviewed PR. Left 2 minor comments on caching strategy.' }
  ])
  const [commentInput, setCommentInput] = useState('')
  const [priority, setPriority] = useState(task?.priority || 'Medium')
  const [tags, setTags] = useState(task?.tags || ['Design', 'Frontend'])

  if (!open || !task) return null

  const toggleSubtask = (idx) => {
    const updated = [...subtasks]
    updated[idx].done = !updated[idx].done
    setSubtasks(updated)
    if (onUpdateTask) onUpdateTask({ ...task, subtasks: updated })
    toast.success(updated[idx].done ? 'Subtask completed!' : 'Subtask marked pending')
  }

  const addSubtask = (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    const updated = [...subtasks, { text: newSubtask.trim(), done: false }]
    setSubtasks(updated)
    setNewSubtask('')
    if (onUpdateTask) onUpdateTask({ ...task, subtasks: updated })
    toast.success('Subtask added')
  }

  const handleSendComment = (e) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: 'Alex Johnson (You)',
        initials: 'AJ',
        color: '#111318',
        time: 'Just now',
        text: commentInput.trim()
      }
    ])
    setCommentInput('')
    toast.success('Comment posted')
  }

  const priorityColors = {
    Critical: 'bg-rose-100 text-rose-700 border-rose-200',
    High: 'bg-amber-100 text-amber-800 border-amber-200',
    Medium: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Low: 'bg-stone-100 text-stone-700 border-stone-200'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-stone-200/80 flex flex-col animate-in slide-in-from-right duration-300">

          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200/70 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                {task.taskId || 'MRD-032'}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${priorityColors[priority] || priorityColors.Medium}`}>
                {priority}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (onDeleteTask) onDeleteTask(task.id)
                  toast.success('Task removed')
                  onClose()
                }}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete task"
              >
                <TrashIcon size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight font-serif leading-tight">
                {task.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2.5 leading-relaxed font-medium">
                {task.description || 'No detailed description provided for this task.'}
              </p>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/60 shadow-xs text-xs">
              <div>
                <span className="text-stone-400 block mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: task.assigneeColor || '#6366f1' }}
                  >
                    {task.assignee || 'SC'}
                  </div>
                  <span className="font-semibold text-stone-800">{task.assigneeName || 'Sarah Chen'}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block mb-1">Due Date</span>
                <div className="flex items-center gap-1.5 font-medium text-stone-700">
                  <ClockIcon size={13} className="text-stone-400" />
                  <span>{task.due || 'Aug 25, 2026'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <TagIcon size={13} />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100/70 text-violet-700 border border-violet-200/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700">
                  Subtasks ({subtasks.filter(s => s.done).length}/{subtasks.length})
                </span>
                <span className="text-[11px] font-semibold text-stone-500 font-mono">
                  {subtasks.length > 0 ? Math.round((subtasks.filter(s => s.done).length / subtasks.length) * 100) : 0}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-lime-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${subtasks.length > 0 ? (subtasks.filter(s => s.done).length / subtasks.length) * 100 : 0}%` }}
                />
              </div>

              {/* List */}
              <div className="space-y-1.5">
                {subtasks.map((st, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSubtask(i)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${st.done
                        ? 'bg-lime-50/60 border-lime-200 text-stone-400 line-through'
                        : 'bg-white border-stone-200/70 text-stone-800 hover:border-stone-300'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${st.done ? 'bg-lime-500 border-lime-600 text-white' : 'border-stone-300 bg-white'
                      }`}>
                      {st.done && <CheckIcon size={11} strokeWidth={3} />}
                    </div>
                    <span className="text-xs font-medium select-none">{st.text}</span>
                  </div>
                ))}
              </div>

              {/* Add subtask */}
              <form onSubmit={addSubtask} className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-400 font-sans"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#111318] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Comments Stream */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-3">Activity & Comments</span>
              <div className="space-y-3 mb-3">
                {comments.map(c => (
                  <div key={c.id} className="p-3 rounded-2xl bg-white border border-stone-200/60 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.initials}
                        </div>
                        <span className="text-xs font-bold text-stone-800">{c.author}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-stone-600 pl-7">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Box */}
              <form onSubmit={handleSendComment} className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#111318] text-white hover:bg-black transition-colors cursor-pointer"
                >
                  <SendIcon size={13} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
