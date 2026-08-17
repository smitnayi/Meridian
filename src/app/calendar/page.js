"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon,
  ClockIcon, ShareIcon, ArrowUpRightIcon, VideoIcon, CheckCircleIcon,
  PaletteIcon, UsersIcon, CalendarIcon, MoreHorizontalIcon, FilterIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const scheduleEvents = [
  {
    id: 'evt-1',
    day: 17,
    dayLabel: 'Mon',
    time: '9:25 - 11:15',
    title: 'Calling Customer',
    subtitle: 'Sprint retrospective sync',
    category: 'Sales',
    lead: 'Jane Cooper',
    leadInitials: 'JC',
    leadColor: '#f59e0b',
    color: '#FEF9C3',
    border: '#FEF08A',
    textColor: '#78350f',
    type: 'call',
    location: 'Phone Call',
    status: 'Completed'
  },
  {
    id: 'evt-2',
    day: 17,
    dayLabel: 'Mon',
    time: '9:30 - 12:30',
    title: 'Design Review',
    subtitle: 'Bank App .fig inspection',
    category: 'Design',
    lead: 'Jane Cooper',
    leadInitials: 'JC',
    leadColor: '#0284c7',
    color: '#E0F2FE',
    border: '#BAE6FD',
    textColor: '#0369a1',
    type: 'design',
    location: 'Figma Live',
    status: 'Completed'
  },
  {
    id: 'evt-3',
    day: 18,
    dayLabel: 'Tue',
    time: '10:30 - 14:20',
    title: 'Design Meet: UI System Audit',
    subtitle: 'High-contrast tokens & component review',
    category: 'Design',
    lead: 'Sarah Chen',
    leadInitials: 'SC',
    leadColor: '#8b5cf6',
    color: '#EDE9FE',
    border: '#DDD6FE',
    textColor: '#6d28d9',
    type: 'meet',
    location: 'Google Meet',
    status: 'In Progress',
    attendees: ['SC', 'MW', 'PN', '+3']
  },
  {
    id: 'evt-4',
    day: 19,
    dayLabel: 'Wed',
    time: '9:30 - 12:30',
    title: 'Sprint Review & Demo',
    subtitle: 'Completed: 2/4 milestones',
    category: 'Management',
    lead: 'Alex Johnson',
    leadInitials: 'AJ',
    leadColor: '#f43f5e',
    color: '#FFE4E6',
    border: '#FECDD3',
    textColor: '#be123c',
    type: 'sprint',
    location: 'Conference Room B',
    status: 'Upcoming'
  },
  {
    id: 'evt-5',
    day: 20,
    dayLabel: 'Thu',
    time: '11:30 - 13:05',
    title: 'Business Dinner & Advisory',
    subtitle: 'Downtown Bistro Cafe',
    category: 'Commercial',
    lead: 'Marcus Webb',
    leadInitials: 'MW',
    leadColor: '#10b981',
    color: '#DCFCE7',
    border: '#BBF7D0',
    textColor: '#15803D',
    type: 'dinner',
    location: 'Downtown Bistro',
    status: 'Upcoming'
  },
]

const blockHours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(18)
  const [viewMode, setViewMode] = useState('card') // 'card' | 'block' | 'table'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = scheduleEvents.filter(e => {
    if (!searchQuery.trim()) return true
    return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Main Content (Dual-Pane) */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          {/* Dynamic Top Header */}
          <DynamicHeader
            onOpenNewTask={() => toast.success('Open New Event Modal')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* ── Main Dual-Pane Grid (Ref 5 "Flentesy") ── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">

            {/* ── LEFT / CENTER: Light Warm Calendar Canvas (8 cols) ── */}
            <div className="xl:col-span-8 flex flex-col gap-6">

              {/* Header Bar */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight font-serif">
                      Schedule & <em className="italic font-serif font-normal text-stone-900">Sprint Timelines</em>
                    </h1>

                    {/* View Switcher Capsule (Card | Block | Table) */}
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl ml-2">
                      <button
                        onClick={() => setViewMode('card')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'card' ? 'bg-[#111318] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                      >
                        Card
                      </button>
                      <button
                        onClick={() => setViewMode('block')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'block' ? 'bg-[#111318] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                      >
                        Block
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#111318] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                      >
                        Table
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200/60">
                      Show: 1 Week ▾
                    </span>
                    <button
                      onClick={() => toast.success('Calendar link copied to clipboard!')}
                      className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <ShareIcon size={12} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar in Calendar */}
                <div className="pt-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-400 flex-1">
                    <SearchIcon size={14} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search event, tasks, meeting..."
                      className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-sans"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                    <ClockIcon size={12} />
                    <span>30 minutes ago · Frank</span>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 1: CARD VIEW (Weekly Schedule Columns)               */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'card' && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs relative overflow-x-auto">

                  {/* Days Header */}
                  <div className="grid grid-cols-5 gap-3 mb-6 min-w-[600px]">
                    {[
                      { day: 17, label: 'Mon' },
                      { day: 18, label: 'Tue', active: true },
                      { day: 19, label: 'Wed' },
                      { day: 20, label: 'Thu' },
                      { day: 21, label: 'Fri' },
                    ].map(d => (
                      <div
                        key={d.day}
                        onClick={() => setSelectedDay(d.day)}
                        className={`text-center py-2 rounded-2xl cursor-pointer transition-all ${selectedDay === d.day
                            ? 'bg-[#111318] text-white shadow-md'
                            : 'hover:bg-stone-100 text-stone-700'
                          }`}
                      >
                        <span className="text-2xl font-extrabold stat-number block leading-none">{d.day}</span>
                        <span className={`text-[11px] font-bold ${selectedDay === d.day ? 'text-stone-300' : 'text-stone-400'}`}>/{d.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Event Schedule Columns */}
                  <div className="grid grid-cols-5 gap-3 relative min-w-[600px] min-h-[460px]">

                    {/* Column 1 (Mon 17) */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] shadow-2xs hover:shadow-xs transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center">
                            JC
                          </div>
                          <span className="text-[10px] font-mono text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                            9:25 - 11:15
                          </span>
                        </div>
                        <div className="text-xs font-bold text-amber-950">Calling Customer</div>
                        <div className="text-[10px] text-amber-800 mt-1">Sprint retrospective sync</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] shadow-2xs hover:shadow-xs transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-sky-950">Design Review</span>
                          <span className="text-[10px] font-mono text-sky-700">9:30 - 12:30</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-sky-200 text-[11px] font-medium text-sky-900 flex items-center gap-1.5">
                          <PaletteIcon size={13} className="text-sky-700" />
                          <span>Bank App .fig</span>
                        </div>
                        <div className="mt-2 text-[10px] text-sky-700 font-mono">Jane Cooper (Lead)</div>
                      </div>
                    </div>

                    {/* Column 2 (Tue 18 - Active Focus Day) */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-violet-950">Design Meet</div>
                          <span className="text-[10px] font-mono text-violet-700 font-bold">10:30 - 14:20</span>
                        </div>
                        <div className="w-full h-20 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-inner mb-3">
                          UI System Audit
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            <div className="w-5 h-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">SC</div>
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">MW</div>
                            <div className="w-5 h-5 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">PN</div>
                            <div className="w-5 h-5 rounded-full bg-slate-700 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white">+3</div>
                          </div>
                          <span className="text-[10px] font-mono text-violet-700">Google Meet</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 (Wed 19) */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] shadow-2xs hover:shadow-xs transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-rose-950">Sprint Review</div>
                          <span className="text-[10px] font-mono text-rose-700">9:30 - 12:30</span>
                        </div>
                        <div className="text-[11px] font-bold text-rose-900 mb-2">Completed: 2/4</div>
                        <div className="space-y-1 text-[10px] text-rose-800">
                          <div className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">✓</span> Wireframes</div>
                          <div className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">✓</span> Prototypes</div>
                          <div className="flex items-center gap-1.5"><span className="text-rose-400">○</span> UI/UX Design</div>
                          <div className="flex items-center gap-1.5"><span className="text-rose-400">○</span> Design System</div>
                        </div>
                      </div>
                    </div>

                    {/* Column 4 (Thu 20) */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] shadow-2xs hover:shadow-xs transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-emerald-950">Business Dinner</span>
                          <span className="text-[10px] font-mono text-emerald-700">11:30 - 13:05</span>
                        </div>
                        <div className="text-[11px] text-emerald-900 font-medium">Downtown Bistro Cafe</div>
                        <div className="mt-2 text-[10px] text-emerald-700 font-mono">Client Advisory Team</div>
                      </div>
                    </div>

                    {/* Column 5 (Fri 21) */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200/80 border-dashed text-center">
                        <span className="text-xs font-bold text-stone-500 block mb-1">Focus Time</span>
                        <span className="text-[10px] text-stone-400">No scheduled meetings</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 2: BLOCK VIEW (Time-Blocking Hour Schedule Grid)     */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'block' && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                    <div>
                      <h2 className="text-base font-bold text-stone-900 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                        Day Time-Blocking · Tuesday, 18 May
                      </h2>
                      <p className="text-xs text-stone-400">Live timeline grid with synchronous hour allocations</p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-lime-100 text-lime-800 font-mono">
                      ● Current: 11:45 AM
                    </span>
                  </div>

                  {/* Hourly Timeline Rows */}
                  <div className="space-y-3 relative">
                    {blockHours.map((hour, idx) => {
                      const hasEvent = hour === '10:00' || hour === '11:00' || hour === '14:00'
                      return (
                        <div key={hour} className="flex items-start gap-4 text-xs py-1 border-b border-stone-50">
                          {/* Hour Label */}
                          <div className="w-14 font-mono font-bold text-stone-400 shrink-0 pt-1">
                            {hour}
                          </div>

                          {/* Block Slot */}
                          <div className="flex-1 min-h-[48px] rounded-2xl bg-stone-50/60 p-2.5 border border-stone-100 hover:border-stone-300 transition-all flex items-center justify-between">
                            {hour === '10:00' ? (
                              <div className="w-full p-2.5 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#6d28d9] flex items-center justify-between shadow-2xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                                  <span className="font-bold">Design Meet: UI System Audit (Sarah Chen & Team)</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-full">
                                  10:30 - 14:20
                                </span>
                              </div>
                            ) : hour === '14:00' ? (
                              <div className="w-full p-2.5 rounded-xl bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C] flex items-center justify-between shadow-2xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                                  <span className="font-bold">Designers Sprint Handoff (meet.google.com/mzh)</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-full">
                                  14:30 - 16:10
                                </span>
                              </div>
                            ) : hour === '17:00' ? (
                              <div className="w-full p-2.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369a1] flex items-center justify-between shadow-2xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                                  <span className="font-bold">Weekly Velocity Report Generation (19 People)</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-full">
                                  17:00 - 18:00
                                </span>
                              </div>
                            ) : (
                              <span className="text-stone-300 font-mono text-[11px]">Available Slot · Click to block</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 3: TABLE VIEW (Detailed Agenda Table)                */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                    <div>
                      <h2 className="text-base font-bold text-stone-900 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                        All Scheduled Events & Meetings Agenda
                      </h2>
                      <p className="text-xs text-stone-400">Structured data view with direct meeting join shortcuts</p>
                    </div>

                    <span className="text-xs font-bold text-stone-400 font-mono">
                      {filteredEvents.length} events
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3 pl-3">Day & Time</th>
                          <th className="pb-3">Event Title</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Lead / Attendees</th>
                          <th className="pb-3">Platform</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredEvents.map(evt => (
                          <tr key={evt.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3.5 pl-3">
                              <div className="font-bold text-stone-900">{evt.dayLabel} {evt.day} May</div>
                              <div className="text-[11px] text-stone-400 font-mono">{evt.time}</div>
                            </td>

                            <td className="py-3.5">
                              <div className="font-bold text-stone-900 text-xs">{evt.title}</div>
                              <div className="text-[11px] text-stone-400">{evt.subtitle}</div>
                            </td>

                            <td className="py-3.5">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                {evt.category}
                              </span>
                            </td>

                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-2xs"
                                  style={{ backgroundColor: evt.leadColor }}
                                >
                                  {evt.leadInitials}
                                </div>
                                <span className="font-medium text-stone-700 text-[11px]">{evt.lead}</span>
                              </div>
                            </td>

                            <td className="py-3.5 text-stone-600 font-mono text-[11px]">
                              {evt.location}
                            </td>

                            <td className="py-3.5">
                              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${evt.status === 'In Progress' ? 'bg-violet-100 text-violet-800' :
                                  evt.status === 'Completed' ? 'bg-lime-100 text-lime-800' :
                                    'bg-stone-100 text-stone-600'
                                }`}>
                                {evt.status}
                              </span>
                            </td>

                            <td className="py-3.5 pr-3 text-right">
                              <button
                                onClick={() => toast.success(`Opening ${evt.title}...`)}
                                className="px-3 py-1 rounded-xl bg-[#111318] hover:bg-black text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                Join
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT: Deep Obsidian Dark Command Dock (4 cols - Ref Image 3) ── */}
            <div className="xl:col-span-4 dark-dock p-6 flex flex-col justify-between space-y-6">

              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lime-400 text-xs">●</span>
                    <span className="text-xs font-mono text-stone-400">Today, 18 May 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['Design', 'Copyright', 'Dev'].map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-normal text-white tracking-tight font-serif">
                    Urgent <em className="italic font-serif font-normal text-lime-400">Tasks</em> (5)
                  </h2>
                  <span className="text-xs font-mono text-lime-400">Active</span>
                </div>

                {/* Dark Urgent Task Cards (Image 3 Top) */}
                <div className="space-y-3 mb-6">

                  {/* Card 1: Design System (Peach/Coral Accent) */}
                  <div className="p-4 rounded-2xl bg-[#1E2028] border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between text-xs text-rose-400 font-mono mb-1">
                      <span>Time: 9:00 - 13:00</span>
                      <ArrowUpRightIcon size={12} className="text-white" />
                    </div>
                    <div className="text-sm font-bold text-white mb-2 font-sans">Design System 2.0 Components</div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">SC</div>
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center">AJ</div>
                      </div>
                      <span className="font-extrabold text-lime-400 stat-number">67% complete</span>
                    </div>
                  </div>

                  {/* Card 2: Designers Meeting (Violet Accent) */}
                  <div className="p-4 rounded-2xl bg-[#1E2028] border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between text-xs text-violet-400 font-mono mb-1">
                      <span>Time: 14:30 - 16:10</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Important
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mb-2 font-sans">Designers Sprint Handoff</div>
                    <div className="flex items-center justify-between gap-2 mt-3">
                      <div className="text-[10px] text-stone-400 font-mono truncate">meet.google.com/mzh-m...</div>
                      <button
                        onClick={() => toast.success('Joining Designer Room...')}
                        className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Join Meeting
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Make Report (Cyan Accent) */}
                  <div className="p-4 rounded-2xl bg-[#1E2028] border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between text-xs text-sky-400 font-mono mb-1">
                      <span>Time: 17:00 - 18:00</span>
                      <ArrowUpRightIcon size={12} className="text-white" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1 font-sans">Make Weekly Velocity Report</div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>19 People</span>
                      <span className="text-lime-400 font-extrabold stat-number">81 Tasks</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Dark Data Viz Widgets (Ref Image 3 Bottom) ── */}
              <div className="space-y-4 pt-4 border-t border-white/10">

                {/* Radial Speedometer Widget: Task Statistics */}
                <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white font-sans">Task Statistics</span>
                    <span className="text-[10px] font-mono text-stone-400">All Time ▾</span>
                  </div>

                  {/* Radial Gauge SVG */}
                  <div className="relative flex flex-col items-center py-2">
                    <svg viewBox="0 0 100 55" className="w-36 overflow-visible">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#2D313F"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 70 15"
                        fill="none"
                        stroke="url(#speedometerGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="speedometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F43F5E" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#84CC16" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute top-7 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-lime-400 bg-lime-950/80 px-2.5 py-0.5 rounded-full border border-lime-500/30 flex items-center gap-1">
                        <CheckCircleIcon size={11} />
                        <span>Great Result</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 text-center pt-2 border-t border-white/5">
                    <div>
                      <div className="text-2xl font-extrabold text-white stat-number">75%</div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">Completed Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-stone-400 stat-number">25%</div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">Unfulfilled Tasks</div>
                    </div>
                  </div>
                </div>

                {/* Bubble Chart: Task Type Distribution */}
                <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white font-sans">Task Type Allocation</span>
                    <span className="text-[10px] font-mono text-stone-400">All Time ▾</span>
                  </div>

                  {/* Overlapping Bubble Circles */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div className="w-16 h-16 rounded-full bg-[#FEF08A] text-stone-950 flex flex-col items-center justify-center font-bold shadow-md">
                      <span className="text-sm font-extrabold stat-number leading-none">72%</span>
                      <span className="text-[9px] font-sans">Learning</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#C4B5FD] text-violet-950 flex flex-col items-center justify-center font-bold shadow-md -ml-4">
                      <span className="text-xs font-extrabold stat-number leading-none">18%</span>
                      <span className="text-[8px] font-sans">Design</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#A7F3D0] text-emerald-950 flex flex-col items-center justify-center font-bold shadow-md -ml-3">
                      <span className="text-[10px] font-extrabold stat-number leading-none">10%</span>
                      <span className="text-[7px] font-sans">Biz</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  )
}