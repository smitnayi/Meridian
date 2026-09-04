"use client"

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon,
  ClockIcon, ShareIcon, ArrowUpRightIcon, VideoIcon, CheckCircleIcon,
  PaletteIcon, UsersIcon, CalendarIcon, MoreHorizontalIcon, FilterIcon,
  CheckIcon, PlayIcon, PauseIcon, CoffeeIcon,
  GoogleMeetIcon, ZoomIcon, FigmaIcon, NotionIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// ─── Data for Card & Table Views ─────────────────────────────────
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

// ─── Data for Block View (New Editorial Calendar UI) ─────────────
const initialDaySchedules = [
  {
    dayNumber: '03',
    dayName: 'We',
    isToday: true,
    events: [
      {
        id: 'evt-301',
        timeStart: '10:00',
        timeEnd: '17:30',
        category: 'Learn Design',
        title: 'Design meeting check product',
        accentColor: '#10B981',
        type: 'call',
        linkText: 'Call Detile',
        platform: 'Google Meet',
        platformIcon: GoogleMeetIcon,
        attendees: [
          { name: 'Alex', initials: 'AJ', color: '#8B5CF6' },
          { name: 'Sarah', initials: 'SC', color: '#6366F1' },
          { name: 'Marcus', initials: 'MW', color: '#10B981' }
        ]
      },
      {
        id: 'evt-302',
        timeStart: '18:00',
        timeEnd: '20:30',
        category: 'Design Meeting',
        title: 'Make daily schedule design',
        accentColor: '#8B5CF6',
        type: 'meet',
        linkText: 'Live Stream',
        platform: 'Figma Live',
        platformIcon: FigmaIcon,
        attendees: [
          { name: 'Kacie', initials: 'KV', color: '#F43F5E' },
          { name: 'Alex', initials: 'AJ', color: '#8B5CF6' }
        ]
      }
    ]
  },
  {
    dayNumber: '04',
    dayName: 'Th',
    isToday: false,
    events: []
  },
  {
    dayNumber: '05',
    dayName: 'Fr',
    isToday: false,
    events: [
      {
        id: 'evt-501',
        timeStart: '13:00',
        timeEnd: '14:30',
        category: 'Focus Block',
        title: 'Component Architecture Sync & Refactor',
        accentColor: '#F59E0B',
        type: 'dev',
        platform: 'Zoom',
        platformIcon: ZoomIcon,
        attendees: [
          { name: 'Marcus', initials: 'MW', color: '#10B981' },
          { name: 'Sarah', initials: 'SC', color: '#6366F1' }
        ]
      }
    ]
  }
]

const initialDailyTasks = [
  { id: 'tsk-1', title: 'Learn design', done: true },
  { id: 'tsk-2', title: 'Design meeting check product', done: false },
  { id: 'tsk-3', title: 'Call client about project', done: false },
  { id: 'tsk-4', title: 'Update design system tokens', done: false }
]

const initialEventsList = [
  { id: 'ev-1', name: 'Design meeting', time: '10:00 - 17:30', color: '#10B981', initials: 'SC' },
  { id: 'ev-2', name: 'Sprint review', time: '18:00 - 20:30', color: '#8B5CF6', initials: 'AJ' }
]

const calendarMatrix = [
  { day: 27, isPrev: true, dots: [] },
  { day: 28, isPrev: true, dots: [] },
  { day: 29, isPrev: true, dots: [] },
  { day: 30, isPrev: true, dots: [] },
  { day: 1, isPrev: false, dots: [] },
  { day: 2, isPrev: false, dots: [] },
  { day: 3, isPrev: false, dots: ['#E63946'] },
  { day: 4, isPrev: false, dots: [] },
  { day: 5, isPrev: false, dots: [] },
  { day: 6, isPrev: false, dots: [] },
  { day: 7, isPrev: false, dots: [] },
  { day: 8, isPrev: false, dots: [] },
  { day: 9, isPrev: false, dots: [] },
  { day: 10, isPrev: false, dots: [] },
  { day: 11, isPrev: false, dots: [] },
  { day: 12, isPrev: false, dots: [] },
  { day: 13, isPrev: false, dots: [] },
  { day: 14, isPrev: false, dots: [] },
  { day: 15, isPrev: false, dots: [] },
  { day: 16, isPrev: false, dots: [] },
  { day: 17, isPrev: false, dots: ['#F59E0B'] },
  { day: 18, isPrev: false, dots: ['#10B981', '#8B5CF6'] },
  { day: 19, isPrev: false, dots: ['#F43F5E'] },
  { day: 20, isPrev: false, dots: ['#3B82F6'] },
  { day: 21, isPrev: false, dots: [] },
  { day: 22, isPrev: false, dots: [] },
  { day: 23, isPrev: false, dots: [] },
  { day: 24, isPrev: false, dots: [] },
  { day: 25, isPrev: false, dots: ['#10B981'] },
  { day: 26, isPrev: false, dots: [] },
  { day: 27, isPrev: false, dots: ['#8B5CF6'] },
  { day: 28, isPrev: false, dots: [] },
  { day: 29, isPrev: false, dots: ['#EF4444'] },
  { day: 30, isPrev: false, dots: [] },
  { day: 1, isNext: true, dots: [] },
  { day: 2, isNext: true, dots: [] },
  { day: 3, isNext: true, dots: [] },
  { day: 4, isNext: true, dots: [] }
]

export default function CalendarPage() {
  const { fullName, initials } = useCurrentUser()

  // View state: 'card' | 'block' | 'table'
  const [viewMode, setViewMode] = useState('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCardDay, setSelectedCardDay] = useState(18)

  // Block View (New Editorial Calendar) states
  const [selectedMatrixDay, setSelectedMatrixDay] = useState(3)
  const [tasks, setTasks] = useState(initialDailyTasks)
  const [events, setEvents] = useState(initialEventsList)
  const [schedules, setSchedules] = useState(initialDaySchedules)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(19)
  const [newMeetingModal, setNewMeetingModal] = useState(false)
  const [newMeetingTitle, setNewMeetingTitle] = useState('')
  const [newMeetingTime, setNewMeetingTime] = useState('15:00 - 16:00')

  // Audio Waveform playback simulator
  useEffect(() => {
    let interval
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => (prev >= 45 ? 0 : prev + 1))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlayingAudio])

  const dynamicScheduleEvents = scheduleEvents.map(e =>
    e.id === 'evt-4'
      ? { ...e, lead: fullName || e.lead, leadInitials: initials || e.leadInitials }
      : e
  )

  const filteredEvents = dynamicScheduleEvents.filter(e => {
    if (!searchQuery.trim()) return true
    return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    )
    toast.success('Task status updated')
  }

  const handleAddNewTask = () => {
    const title = prompt('Enter new task name:')
    if (title && title.trim()) {
      const newTask = {
        id: `tsk-${Date.now()}`,
        title: title.trim(),
        done: false
      }
      setTasks(prev => [...prev, newTask])
      toast.success('Task added')
    }
  }

  const handleCreateMeeting = (e) => {
    e.preventDefault()
    if (!newMeetingTitle.trim()) return
    const newEvt = {
      id: `evt-${Date.now()}`,
      timeStart: newMeetingTime.split('-')[0]?.trim() || '15:00',
      timeEnd: newMeetingTime.split('-')[1]?.trim() || '16:00',
      category: 'Working',
      title: newMeetingTitle.trim(),
      accentColor: '#8B5CF6',
      type: 'meet',
      platform: 'Google Meet',
      platformIcon: GoogleMeetIcon
    }

    setSchedules(prev =>
      prev.map(d =>
        d.dayNumber === '03'
          ? { ...d, events: [...d.events, newEvt] }
          : d
      )
    )
    setNewMeetingTitle('')
    setNewMeetingModal(false)
    toast.success('New meeting scheduled!')
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5] text-stone-900 selection:bg-stone-900 selection:text-white">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-7 py-5 overflow-y-auto pt-16 lg:pt-5">
          {/* Dynamic Top Header */}
          <DynamicHeader
            onOpenNewTask={() => setNewMeetingModal(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* ── Top Header Navigation & View Switcher Bar ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-950 tracking-tight font-serif">
                  Schedule & <em className="italic font-serif font-normal text-stone-900">Sprint Timelines</em>
                </h1>

                {/* View Switcher Capsule (Card | Block | Table) */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl sm:ml-2">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'card'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setViewMode('block')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'block'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Block
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  Show: 1 Week ▾
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href)
                    toast.success('Calendar link copied to clipboard!')
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <ShareIcon size={12} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Search Bar for Card and Table views */}
            {viewMode !== 'block' && (
              <div className="pt-3 flex items-center justify-between gap-3 text-xs">
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
                <div className="flex items-center gap-2 text-stone-400 text-[11px] font-mono hidden sm:flex">
                  <ClockIcon size={12} />
                  <span>30 minutes ago · Active</span>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1: BLOCK VIEW -> POWERED BY NEW CALENDAR CANVAS     */}
          {/* ══════════════════════════════════════════════════════════ */}
          {viewMode === 'block' && (
            <div className="rounded-[32px] bg-[#ECE7DE] border border-stone-300/70 p-3 sm:p-5 shadow-xs mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* ── COLUMN 1: LEFT PANEL (Mini Month + Events + Tasks) ── */}
                <div className="lg:col-span-3 rounded-[28px] bg-[#E2DDCF] p-5 border border-stone-300/60 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-[11px]">
                          M
                        </div>
                        <span className="font-bold text-sm tracking-tight text-stone-900">
                          Calendar
                        </span>
                      </div>
                      <button
                        onClick={() => toast.success('Search calendar')}
                        className="text-stone-600 hover:text-stone-900 p-1 rounded-md transition-colors cursor-pointer"
                      >
                        <SearchIcon size={14} />
                      </button>
                    </div>

                    {/* Month Matrix Grid */}
                    <div className="mb-6">
                      <div className="grid grid-cols-7 text-center text-[10px] font-medium text-stone-400 mb-2 font-sans">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-futura">
                        {calendarMatrix.map((item, idx) => {
                          const isCurrentActive = item.day === selectedMatrixDay && !item.isPrev && !item.isNext
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (!item.isPrev && !item.isNext) {
                                  setSelectedMatrixDay(item.day)
                                  toast.success(`Selected May ${item.day}`)
                                }
                              }}
                              className="flex flex-col items-center justify-center cursor-pointer group"
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] transition-all font-futura ${
                                  isCurrentActive
                                    ? 'bg-[#E63946] text-white font-bold shadow-xs'
                                    : item.isPrev || item.isNext
                                    ? 'text-stone-400 font-normal'
                                    : 'text-stone-700 hover:bg-stone-300/60 font-semibold'
                                }`}
                              >
                                {item.day}
                              </span>
                              <div className="flex items-center gap-0.5 mt-0.5 h-1">
                                {item.dots.map((dotColor, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="w-1 h-1 rounded-full"
                                    style={{ backgroundColor: dotColor }}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events Section */}
                  <div className="pt-3 border-t border-stone-300/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-stone-900 tracking-tight font-sans">
                        Events
                      </span>
                      <button
                        onClick={() => setNewMeetingModal(true)}
                        className="text-stone-500 hover:text-stone-900 p-0.5 rounded cursor-pointer"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {events.map(ev => (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between text-xs group cursor-pointer hover:bg-stone-300/40 p-1.5 rounded-xl transition-colors font-sans"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full text-white text-[8px] font-bold flex items-center justify-center shadow-2xs font-sans"
                              style={{ backgroundColor: ev.color }}
                            >
                              {ev.initials}
                            </div>
                            <span className="font-medium text-stone-800 text-[12px]">
                              {ev.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-normal font-futura">
                            {ev.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Tasks Checklist */}
                  <div className="pt-3 border-t border-stone-300/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-stone-900 tracking-tight font-sans">
                        Tasks
                      </span>
                      <button
                        onClick={handleAddNewTask}
                        className="text-stone-500 hover:text-stone-900 p-0.5 rounded cursor-pointer"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>

                    <div className="space-y-2 font-sans">
                      {tasks.map(tsk => (
                        <div
                          key={tsk.id}
                          onClick={() => toggleTask(tsk.id)}
                          className="flex items-center justify-between text-xs cursor-pointer group p-1 rounded-lg hover:bg-stone-300/40 transition-colors"
                        >
                          <span
                            className={`text-[12px] font-normal transition-all ${
                              tsk.done
                                ? 'line-through text-stone-400'
                                : 'text-stone-700'
                            }`}
                          >
                            {tsk.title}
                          </span>

                          <div
                            className={`w-3.5 h-3.5 rounded-full border border-dashed flex items-center justify-center transition-all ${
                              tsk.done
                                ? 'bg-stone-900 border-stone-900 text-white'
                                : 'border-stone-400 bg-transparent group-hover:border-stone-700'
                            }`}
                          >
                            {tsk.done && <CheckIcon size={8} strokeWidth={3} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Profile Dot */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[10px] font-sans">
                        {initials || 'AJ'}
                      </div>
                      <span className="text-xs font-semibold text-stone-800">{fullName || 'Alex'}</span>
                    </div>
                    <button
                      onClick={() => setNewMeetingModal(true)}
                      className="w-7 h-7 rounded-full bg-stone-900 hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                      title="Schedule meeting"
                    >
                      <PlusIcon size={13} />
                    </button>
                  </div>
                </div>

                {/* ── COLUMN 2: CENTER MAIN TIMELINE STAGE ── */}
                <div className="lg:col-span-6 rounded-[28px] bg-[#FAF8F5] p-5 sm:p-8 border border-stone-300/60 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 font-sans">
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight font-sans">
                        May
                      </h2>
                      <span className="text-2xl sm:text-3xl font-light text-stone-400 font-futura">
                        2026
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href)
                          toast.success('Link copied to clipboard')
                        }}
                        className="px-4 py-1.5 rounded-full bg-stone-950 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer font-sans"
                      >
                        <ShareIcon size={12} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-stone-300 pt-1" />

                  {/* Giant Typography Day Blocks Stream */}
                  <div className="space-y-10">
                    {schedules.map((dayItem) => (
                      <div
                        key={dayItem.dayNumber}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start pt-6 border-t border-stone-200 first:border-t-0 first:pt-0"
                      >
                        <div className="sm:col-span-4 flex items-start font-sans">
                          <div className="flex items-start select-none">
                            <span className="text-7xl sm:text-8xl lg:text-[88px] font-black text-stone-950 leading-none tracking-[-0.03em] font-futura stat-number">
                              {dayItem.dayNumber}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#E63946] -translate-y-2 ml-1 select-none font-sans">
                              {dayItem.dayName}
                            </span>
                          </div>
                        </div>

                        <div className="sm:col-span-8 space-y-4">
                          {dayItem.events.length === 0 ? (
                            <div className="p-4 rounded-2xl bg-stone-100/60 border border-stone-200/80 flex items-center gap-3 text-stone-400 font-sans">
                              <div className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center text-stone-400 shadow-2xs">
                                <CalendarIcon size={13} />
                              </div>
                              <span className="text-xs font-medium">
                                There is no meeting yet
                              </span>
                            </div>
                          ) : (
                            dayItem.events.map((ev, eIdx) => {
                              const PlatIcon = ev.platformIcon
                              const isFirstLive = dayItem.isToday && eIdx === 0

                              return (
                                <div key={ev.id} className="relative font-sans">
                                  {isFirstLive && (
                                    <div className="relative flex items-center my-2 -mt-1 mb-3">
                                      <div className="w-2 h-2 rounded-full bg-[#E63946] relative z-10" />
                                      <div className="flex-1 h-[1.5px] bg-[#E63946]" />
                                    </div>
                                  )}

                                  <div className="flex items-start justify-between gap-3 text-xs group">
                                    <div className="w-28 shrink-0 flex items-baseline pt-0.5 select-none font-futura">
                                      <span className="font-bold text-[13px] text-stone-900 tracking-tight">{ev.timeStart}</span>
                                      <span className="text-[12px] text-stone-400 font-normal ml-0.5">-{ev.timeEnd}</span>
                                    </div>

                                    <div
                                      className="w-[2px] self-stretch shrink-0 rounded-full my-0.5"
                                      style={{ backgroundColor: ev.accentColor }}
                                    />

                                    <div className="flex-1 min-w-0 space-y-0.5 font-sans">
                                      <div
                                        className="text-[11px] font-bold tracking-tight"
                                        style={{ color: ev.accentColor }}
                                      >
                                        {ev.category}
                                      </div>
                                      <div className="text-[13px] font-bold text-stone-900 tracking-tight leading-snug">
                                        {ev.title}
                                      </div>
                                      {ev.linkText && (
                                        <div className="text-[11px] text-stone-400 font-medium flex items-center gap-1 pt-0.5">
                                          <span>≡</span>
                                          <span>{ev.linkText}</span>
                                        </div>
                                      )}
                                      {ev.platform && (
                                        <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 pt-0.5">
                                          {PlatIcon && <PlatIcon size={12} className="text-stone-600" />}
                                          <span>{ev.platform}</span>
                                        </div>
                                      )}
                                    </div>

                                    {ev.attendees && (
                                      <div className="flex -space-x-1 shrink-0 pt-0.5">
                                        {ev.attendees.map((att, aIdx) => (
                                          <div
                                            key={aIdx}
                                            className="w-4 h-4 rounded-full text-white text-[7px] font-bold flex items-center justify-center ring-1 ring-white shadow-2xs font-sans"
                                            style={{ backgroundColor: att.color }}
                                          >
                                            {att.initials}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── COLUMN 3: RIGHT PANEL (AI Assistant & Focus Command) ── */}
                <div className="lg:col-span-3 rounded-[28px] bg-[#E2DDCF] p-5 border border-stone-300/60 flex flex-col justify-between space-y-5 font-sans">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-sm tracking-tight text-stone-900">
                        Ai Assistant
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[9px] text-stone-500">
                        ◷
                      </span>
                    </div>

                    {/* AI Audio Summary Widget */}
                    <div className="p-4 rounded-2xl bg-[#D6D0C2] border border-stone-300/70 mb-4">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-stone-900">
                          Ai Summary
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mb-2">
                        Sprint Voice Brief
                      </div>

                      <div className="flex items-end gap-1 h-7 my-2 px-0.5">
                        {[10, 22, 16, 28, 14, 26, 30, 18, 9, 20, 27, 29, 15, 22, 17, 25, 28, 12].map((height, wIdx) => (
                          <div
                            key={wIdx}
                            className={`flex-1 rounded-full transition-all duration-200 ${
                              isPlayingAudio ? 'bg-stone-950 animate-pulse' : 'bg-stone-800'
                            }`}
                            style={{
                              height: isPlayingAudio
                                ? `${Math.max(4, (height * (1 + Math.sin(wIdx + audioProgress))) % 28)}px`
                                : `${height}px`
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setIsPlayingAudio(!isPlayingAudio)
                            toast.success(isPlayingAudio ? 'Voice brief paused' : 'Playing AI Voice Brief')
                          }}
                          className="w-6 h-6 rounded-full bg-stone-900 hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                        >
                          {isPlayingAudio ? <PauseIcon size={10} /> : <PlayIcon size={10} />}
                        </button>
                        <span className="text-[11px] font-bold text-stone-800 tracking-tight font-futura">
                          0:{audioProgress < 10 ? `0${audioProgress}` : audioProgress}
                        </span>
                      </div>
                    </div>

                    {/* Timer Widget */}
                    <div className="p-4 rounded-2xl bg-[#E2DDCF] border border-stone-300/80 mb-4 shadow-2xs">
                      <div className="text-xs font-bold text-stone-900 mb-1">
                        Focus Timer
                      </div>

                      <div className="relative flex flex-col items-center justify-center py-1">
                        <svg viewBox="0 0 100 55" className="w-28 overflow-visible">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#CFC8B8"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 50 A 40 40 0 0 1 65 18"
                            fill="none"
                            stroke="#E63946"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-4 flex flex-col items-center">
                          <span className="text-[10px] text-stone-400 font-medium font-sans">min</span>
                          <span className="text-xl font-black text-stone-950 tracking-tight font-futura stat-number">
                            00:15
                          </span>
                          <span className="text-[8px] text-stone-400 font-medium font-sans">Before start</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3.5 rounded-xl bg-[#FACC15] text-stone-950 shadow-xs font-sans">
                        <div className="flex items-center justify-between text-[9px] font-bold mb-0.5">
                          <span>Upcoming Meeting</span>
                          <span className="text-[10px] text-stone-700 font-medium font-futura">11:34</span>
                        </div>
                        <div className="text-3xl font-black tracking-tight leading-tight font-futura stat-number">
                          09:56
                        </div>
                        <div className="text-xs font-bold text-stone-950 mt-0.5">
                          Development call
                        </div>
                        <div className="text-[10px] text-stone-800 font-medium mt-1 leading-snug">
                          UI System Sync & Review
                        </div>
                      </div>
                    </div>

                    {/* Connected Tools */}
                    <div className="pt-2 border-t border-stone-300/60">
                      <span className="text-[11px] font-bold text-stone-900 block mb-2">
                        Connected Tools
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <button
                          onClick={() => toast.success('Google Meet connected')}
                          className="p-1.5 rounded-xl bg-white border border-stone-200/80 hover:bg-stone-50 flex items-center justify-center text-stone-800 shadow-2xs transition-colors cursor-pointer"
                          title="Google Meet"
                        >
                          <GoogleMeetIcon size={14} />
                        </button>
                        <button
                          onClick={() => toast.success('Zoom connected')}
                          className="p-1.5 rounded-xl bg-white border border-stone-200/80 hover:bg-stone-50 flex items-center justify-center text-stone-800 shadow-2xs transition-colors cursor-pointer"
                          title="Zoom"
                        >
                          <ZoomIcon size={14} />
                        </button>
                        <button
                          onClick={() => toast.success('Figma workspace synced')}
                          className="p-1.5 rounded-xl bg-white border border-stone-200/80 hover:bg-stone-50 flex items-center justify-center text-stone-800 shadow-2xs transition-colors cursor-pointer"
                          title="Figma"
                        >
                          <FigmaIcon size={14} />
                        </button>
                        <button
                          onClick={() => toast.success('Notion workspace synced')}
                          className="p-1.5 rounded-xl bg-white border border-stone-200/80 hover:bg-stone-50 flex items-center justify-center text-stone-800 shadow-2xs transition-colors cursor-pointer"
                          title="Notion"
                        >
                          <NotionIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-semibold text-stone-500 text-center">
                    Work OS · Editorial Calendar
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTIONS 2 & 3: CARD & TABLE VIEWS (Dual-Pane with Dock)   */}
          {/* ══════════════════════════════════════════════════════════ */}
          {viewMode !== 'block' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">

              {/* ── LEFT / CENTER CONTENT (8 cols) ── */}
              <div className="xl:col-span-8 flex flex-col gap-6">

                {/* VIEW MODE: CARD */}
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
                          onClick={() => setSelectedCardDay(d.day)}
                          className={`text-center py-2 rounded-2xl cursor-pointer transition-all ${
                            selectedCardDay === d.day
                              ? 'bg-[#111318] text-white shadow-md'
                              : 'hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          <span className="text-2xl font-extrabold stat-number block leading-none">{d.day}</span>
                          <span className={`text-[11px] font-bold ${selectedCardDay === d.day ? 'text-stone-300' : 'text-stone-400'}`}>/{d.label}</span>
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

                {/* VIEW MODE: TABLE */}
                {viewMode === 'table' && (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                      <div>
                        <h2 className="text-base font-bold text-stone-900 font-serif">
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
                                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                                  evt.status === 'In Progress' ? 'bg-violet-100 text-violet-800' :
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

              {/* ── RIGHT DOCK: DEEP OBSIDIAN COMMAND PANEL (4 cols) ── */}
              <div className="xl:col-span-4 dark-dock p-6 flex flex-col justify-between space-y-6">
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

                  {/* Dark Urgent Task Cards */}
                  <div className="space-y-3 mb-6">
                    {/* Card 1 */}
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

                    {/* Card 2 */}
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

                    {/* Card 3 */}
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

                {/* Dark Data Viz Widgets */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {/* Radial Speedometer Widget */}
                  <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white font-sans">Task Statistics</span>
                      <span className="text-[10px] font-mono text-stone-400">All Time ▾</span>
                    </div>

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

                  {/* Bubble Chart Widget */}
                  <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white font-sans">Task Type Allocation</span>
                      <span className="text-[10px] font-mono text-stone-400">All Time ▾</span>
                    </div>

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
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* QUICK CREATE MEETING MODAL                                 */}
          {/* ══════════════════════════════════════════════════════════ */}
          {newMeetingModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-lg font-bold text-stone-950">
                    Schedule New Meeting
                  </h3>
                  <button
                    onClick={() => setNewMeetingModal(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateMeeting} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design System Review"
                      value={newMeetingTitle}
                      onChange={e => setNewMeetingTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15:00 - 16:00"
                      value={newMeetingTime}
                      onChange={e => setNewMeetingTime(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setNewMeetingModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  )
}