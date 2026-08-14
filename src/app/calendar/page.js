"use client"

import { useState, useMemo } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  ChevronRightIcon, PlusIcon, CalendarIcon, ClockIcon,
  FilterIcon, SearchIcon, UsersIcon, CheckIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const ChevronLeftIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const eventTypeConfig = {
  meeting: {
    label: 'Meeting',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: '👥'
  },
  deadline: {
    label: 'Deadline',
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
    badge: 'bg-rose-100 text-rose-700',
    icon: '⚑'
  },
  release: {
    label: 'Release',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: '🚀'
  },
  task: {
    label: 'Task Due',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    badge: 'bg-sky-100 text-sky-700',
    icon: '✓'
  },
  milestone: {
    label: 'Milestone',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🏆'
  }
}

const initialEvents = [
  {
    id: 'e1',
    title: 'Sprint 14 Review & Retrospective',
    day: 9,
    month: 7, // August (0-indexed)
    year: 2026,
    time: '3:00 PM - 4:00 PM',
    type: 'meeting',
    project: 'Auth Service',
    description: 'Review Sprint 14 velocity and demonstrate completed OAuth2 flows.'
  },
  {
    id: 'e2',
    title: 'OAuth Integration Hard Deadline',
    day: 8,
    month: 7,
    year: 2026,
    time: '5:00 PM',
    type: 'deadline',
    project: 'Auth Service',
    description: 'Finalize Google and GitHub social authentication providers.'
  },
  {
    id: 'e3',
    title: 'Stripe Webhook Setup & Sandbox Tests',
    day: 10,
    month: 7,
    year: 2026,
    time: '2:30 PM',
    type: 'deadline',
    project: 'Payment Gateway',
    description: 'Verify signature check and payment intent success handlers.'
  },
  {
    id: 'e4',
    title: 'Design System & Component Library Sync',
    day: 11,
    month: 7,
    year: 2026,
    time: '10:00 AM - 11:00 AM',
    type: 'meeting',
    project: 'Customer Portal',
    description: 'Align on design tokens, spacing scales, and dark mode variants.'
  },
  {
    id: 'e5',
    title: 'Customer Portal Beta Launch',
    day: 14,
    month: 7,
    year: 2026,
    time: 'All Day',
    type: 'release',
    project: 'Customer Portal',
    description: 'Deploy public beta to staging environment and notify early access users.'
  },
  {
    id: 'e6',
    title: 'Weekly 1:1 with Engineering Lead',
    day: 12,
    month: 7,
    year: 2026,
    time: '2:00 PM - 2:30 PM',
    type: 'meeting',
    project: 'General',
    description: 'Discuss technical roadmap, blockers, and architecture proposals.'
  },
  {
    id: 'e7',
    title: 'Mobile App v2 Demo with Stakeholders',
    day: 15,
    month: 7,
    year: 2026,
    time: '4:00 PM - 5:00 PM',
    type: 'meeting',
    project: 'Mobile App v2',
    description: 'Showcase offline sync capabilities and push notifications.'
  },
  {
    id: 'e8',
    title: 'Backend Refactor PR Review',
    day: 13,
    month: 7,
    year: 2026,
    time: '1:00 PM',
    type: 'task',
    project: 'Analytics Dashboard',
    description: 'Review database indexes and query optimization for high-traffic endpoints.'
  },
  {
    id: 'e9',
    title: 'Q3 Product Strategy Planning',
    day: 18,
    month: 7,
    year: 2026,
    time: '9:00 AM - 11:30 AM',
    type: 'meeting',
    project: 'General',
    description: 'Define OKRs and key deliverables for the upcoming quarter.'
  },
  {
    id: 'e10',
    title: 'Push Notification Final Submission',
    day: 18,
    month: 7,
    year: 2026,
    time: '6:00 PM',
    type: 'deadline',
    project: 'Mobile App v2',
    description: 'Submit mobile release build to App Store and Google Play console.'
  },
  {
    id: 'e11',
    title: 'Production Release v2.4.0',
    day: 21,
    month: 7,
    year: 2026,
    time: '12:00 PM',
    type: 'release',
    project: 'Payment Gateway',
    description: 'Deploy zero-downtime release to multi-region Kubernetes clusters.'
  },
  {
    id: 'e12',
    title: 'SOC2 Security Audit Compliance Meeting',
    day: 22,
    month: 7,
    year: 2026,
    time: '10:00 AM - 12:00 PM',
    type: 'meeting',
    project: 'Security',
    description: 'Review penetration testing findings and access logs.'
  },
  {
    id: 'e13',
    title: 'API Rate Limiting & Edge Caching Check',
    day: 25,
    month: 7,
    year: 2026,
    time: '3:00 PM',
    type: 'task',
    project: 'Auth Service',
    description: 'Configure Cloudflare edge workers for DDoS mitigation.'
  },
  {
    id: 'e14',
    title: 'Sprint 15 Kickoff & Backlog Grooming',
    day: 28,
    month: 7,
    year: 2026,
    time: '2:00 PM - 3:30 PM',
    type: 'meeting',
    project: 'General',
    description: 'Story point estimations and commitment for Sprint 15.'
  },
]

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekHours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']

/* ── Event Detail Modal ── */
function EventModal({ event, onClose, onDelete }) {
  if (!event) return null
  const conf = eventTypeConfig[event.type] || eventTypeConfig.meeting

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${conf.badge}`}>
            <span>{conf.icon}</span>
            <span>{conf.label}</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {event.title}
        </h3>

        <div className="space-y-2.5 my-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 w-16">Date:</span>
            <span className="font-medium text-slate-800">
              {monthsList[event.month]} {event.day}, {event.year}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 w-16">Time:</span>
            <span className="font-medium text-slate-800">{event.time || 'All Day'}</span>
          </div>
          {event.project && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 w-16">Project:</span>
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                📁 {event.project}
              </span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {event.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => onDelete(event.id)}
            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Delete Event
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Add Event Modal ── */
function AddEventModal({ open, defaultDay, defaultMonth, defaultYear, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('meeting')
  const [day, setDay] = useState(defaultDay || 7)
  const [time, setTime] = useState('10:00 AM')
  const [project, setProject] = useState('Auth Service')
  const [description, setDescription] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter an event title')
      return
    }

    const newEvent = {
      id: `evt_${Date.now()}`,
      title: title.trim(),
      type,
      day: parseInt(day, 10),
      month: defaultMonth,
      year: defaultYear,
      time,
      project,
      description
    }

    onAdd(newEvent)
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Schedule New Event or Deadline
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Sprint Planning, Security Audit, Stripe Go-Live..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Type & Project */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
              >
                <option value="meeting">👥 Meeting</option>
                <option value="deadline">⚑ Hard Deadline</option>
                <option value="task">✓ Task Due</option>
                <option value="release">🚀 Product Release</option>
                <option value="milestone">🏆 Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Project</label>
              <select
                value={project}
                onChange={e => setProject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
              >
                <option value="Auth Service">Auth Service</option>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Customer Portal">Customer Portal</option>
                <option value="Mobile App v2">Mobile App v2</option>
                <option value="Analytics Dashboard">Analytics Dashboard</option>
                <option value="General">General / All Teams</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Month</label>
              <input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Range</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g., 2:00 PM - 3:00 PM or All Day"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key deliverables, meeting agenda, or zoom links..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              Add to Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Main Calendar Page ── */
export default function CalendarPage() {
  const [view, setView] = useState('month') // 'month' | 'week' | 'day' | 'agenda'
  const [month, setMonth] = useState(7) // August 2026 (0-indexed)
  const [year, setYear] = useState(2026)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [projectFilter, setProjectFilter] = useState('All'  )
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [activeDayModal, setActiveDayModal] = useState(7)
  const [allEvents, setAllEvents] = useState(initialEvents)

  const today = 7

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const day = i - firstDayIndex + 1
      return day > 0 && day <= daysInMonth ? day : null
    })
  }, [firstDayIndex, daysInMonth])

  // Filtered events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      // Month & Year check
      if (ev.month !== month || ev.year !== year) return false

      // Type filter
      if (filterType !== 'All') {
        if (filterType === 'Meetings' && ev.type !== 'meeting') return false
        if (filterType === 'Deadlines' && ev.type !== 'deadline') return false
        if (filterType === 'Releases' && ev.type !== 'release') return false
        if (filterType === 'Tasks' && ev.type !== 'task') return false
      }

      // Project filter
      if (projectFilter !== 'All' && ev.project !== projectFilter) return false

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = ev.title.toLowerCase().includes(q)
        const matchProj = ev.project?.toLowerCase().includes(q)
        if (!matchTitle && !matchProj) return false
      }

      return true
    })
  }, [allEvents, month, year, filterType, projectFilter, searchQuery])

  const upcomingDeadlines = useMemo(() => {
    return allEvents
      .filter(e => e.type === 'deadline' || e.type === 'release')
      .sort((a, b) => a.day - b.day)
      .slice(0, 4)
  }, [allEvents])

  const handleAddEvent = (newEvent) => {
    setAllEvents(prev => [newEvent, ...prev])
    toast.success(`"${newEvent.title}" scheduled successfully`)
  }

  const handleDeleteEvent = (id) => {
    setAllEvents(prev => prev.filter(e => e.id !== id))
    setSelectedEvent(null)
    toast.success('Event deleted')
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  const handleTodayJump = () => {
    setMonth(7)
    setYear(2026)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#f4f6fb] text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Calendar Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Smart Workspace Calendar
                  </h1>
                  <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-xs font-bold text-indigo-700">
                    {filteredEvents.length} Events
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                  Unified schedule for project deliverables, sprint deadlines, release milestones, and team syncs
                </p>
              </div>

              {/* Add Event Button */}
              <button
                onClick={() => {
                  setActiveDayModal(today)
                  setModalOpen(true)
                }}
                className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 shrink-0"
              >
                <PlusIcon size={15} strokeWidth={2.5} />
                <span>Schedule Event</span>
              </button>
            </div>

            {/* Controls Bar: Search & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-2.5 rounded-2xl border border-slate-200/70 shadow-xs backdrop-blur-md">
              {/* View Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs">
                {['month', 'week', 'day', 'agenda'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                      view === v
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex items-center w-full sm:w-60">
                <SearchIcon size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Sub-Filters Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white/80 p-3 rounded-2xl border border-slate-200/70 shadow-xs backdrop-blur-md">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
              {['All', 'Meetings', 'Deadlines', 'Releases', 'Tasks'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    filterType === t
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Project dropdown & Month nav */}
            <div className="flex items-center gap-3">
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none hover:border-indigo-400"
              >
                <option value="All">All Projects</option>
                <option value="Auth Service">Auth Service</option>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Customer Portal">Customer Portal</option>
                <option value="Mobile App v2">Mobile App v2</option>
                <option value="Analytics Dashboard">Analytics Dashboard</option>
              </select>

              {/* Month Selector Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Previous month"
                >
                  <ChevronLeftIcon size={14} />
                </button>
                <button
                  onClick={handleTodayJump}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Next month"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Layout Area: Calendar Grid + Upcoming Deadlines Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Center: Calendar Views (Month, Week, Day, Agenda) */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Month Navigation Title */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {monthsList[month]} {year}
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    {filteredEvents.length} scheduled items
                  </span>
                </div>
              </div>

              {/* ─── 1. MONTH VIEW ─── */}
              {view === 'month' && (
                <div className="overflow-x-auto">
                  <div className="min-w-[680px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80 text-center">
                      {daysOfWeek.map((d) => (
                        <div key={d} className="py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Day Grid */}
                    <div className="grid grid-cols-7">
                      {cells.map((day, i) => {
                        const isToday = day === today && month === 7 && year === 2026
                        const dayEvents = day ? filteredEvents.filter(e => e.day === day) : []
                        const isWeekend = i % 7 === 0 || i % 7 === 6

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (day) {
                                setActiveDayModal(day)
                                setModalOpen(true)
                              }
                            }}
                            className={`min-h-[115px] p-2 border-r border-b border-slate-100 transition-colors ${
                              !day ? 'bg-slate-50/30' : isWeekend ? 'bg-slate-50/40 hover:bg-indigo-50/30 cursor-pointer' : 'bg-white hover:bg-indigo-50/30 cursor-pointer'
                            }`}
                          >
                            {day && (
                              <>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                      isToday
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {day}
                                  </span>
                                  {dayEvents.length > 0 && (
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {dayEvents.length}
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1">
                                  {dayEvents.slice(0, 3).map((ev) => {
                                    const conf = eventTypeConfig[ev.type] || eventTypeConfig.meeting
                                    return (
                                      <div
                                        key={ev.id}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedEvent(ev)
                                        }}
                                        className="group flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium border transition-all hover:scale-[1.02]"
                                        style={{
                                          backgroundColor: conf.bg,
                                          borderColor: conf.border,
                                          color: conf.color
                                        }}
                                      >
                                        <span className="text-[10px] shrink-0">{conf.icon}</span>
                                        <span className="truncate font-semibold">{ev.title}</span>
                                      </div>
                                    )
                                  })}
                                  {dayEvents.length > 3 && (
                                    <div className="text-[10px] font-semibold text-slate-400 pl-1">
                                      +{dayEvents.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 2. WEEK VIEW ─── */}
              {view === 'week' && (
                <div className="p-6 space-y-4">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Hourly schedule for current sprint week (Aug 3 - Aug 9, 2026)
                  </div>
                  <div className="space-y-3">
                    {weekHours.map((hr, idx) => {
                      const matched = filteredEvents.filter(e => e.time?.includes(hr.split(' ')[0]))
                      return (
                        <div key={idx} className="flex items-start gap-4 py-2 border-b border-slate-100">
                          <span className="w-16 text-xs font-bold text-slate-400 shrink-0">{hr}</span>
                          <div className="flex-1 flex flex-wrap gap-2">
                            {matched.length === 0 ? (
                              <span className="text-xs text-slate-300 italic">No scheduled events</span>
                            ) : (
                              matched.map(ev => {
                                const conf = eventTypeConfig[ev.type] || eventTypeConfig.meeting
                                return (
                                  <div
                                    key={ev.id}
                                    onClick={() => setSelectedEvent(ev)}
                                    className="cursor-pointer rounded-xl p-2.5 border text-xs font-medium flex items-center gap-2 hover:shadow-xs transition-shadow"
                                    style={{ backgroundColor: conf.bg, borderColor: conf.border, color: conf.color }}
                                  >
                                    <span>{conf.icon}</span>
                                    <span className="font-bold">{ev.title}</span>
                                    <span className="text-[11px] opacity-80">· {ev.time}</span>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── 3. DAY VIEW ─── */}
              {view === 'day' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Thursday, August {today}, 2026
                      </h3>
                      <span className="text-xs text-slate-500">Today&apos;s Focus & Milestones</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveDayModal(today)
                        setModalOpen(true)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                      + Add Task / Meeting
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredEvents
                      .filter(e => e.day === today || e.day === today + 1)
                      .map(ev => {
                        const conf = eventTypeConfig[ev.type] || eventTypeConfig.meeting
                        return (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="cursor-pointer p-4 rounded-xl border bg-white shadow-xs hover:border-indigo-300 transition-all flex items-start justify-between"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{conf.icon}</span>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{ev.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${conf.badge}`}>
                                    {conf.label}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400">🕒 {ev.time}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                              {ev.project}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* ─── 4. AGENDA / LIST VIEW ─── */}
              {view === 'agenda' && (
                <div className="p-6 divide-y divide-slate-100">
                  {filteredEvents
                    .sort((a, b) => a.day - b.day)
                    .map(ev => {
                      const conf = eventTypeConfig[ev.type] || eventTypeConfig.meeting
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 font-bold text-slate-800">
                              <span className="text-[10px] uppercase text-slate-400 font-medium">AUG</span>
                              <span className="text-base leading-none">{ev.day}</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{ev.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {ev.time} · <span className="font-semibold text-indigo-600">{ev.project}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${conf.badge}`}>
                            {conf.label}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Right: Upcoming Deadlines & Mini Calendar Widget */}
            <div className="lg:col-span-3 space-y-5">
              {/* Upcoming Deadlines Widget */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    🚨 Critical Deadlines
                  </h3>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Sprint 14
                  </span>
                </div>

                <div className="space-y-3">
                  {upcomingDeadlines.map(d => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedEvent(d)}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-900 truncate mr-2">{d.title}</span>
                        <span className="text-rose-600 shrink-0">Aug {d.day}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{d.project}</span>
                        <span className="font-semibold text-slate-600">{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend Box */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Color Legend
                </h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(eventTypeConfig).map(([key, item]) => (
                    <div key={key} className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Event Modal */}
        <AddEventModal
          open={modalOpen}
          defaultDay={activeDayModal}
          defaultMonth={month}
          defaultYear={year}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddEvent}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}