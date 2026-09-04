"use client"

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  SearchIcon, PlusIcon, ShareIcon, CheckIcon,
  CalendarIcon, PlayIcon, PauseIcon, CoffeeIcon,
  GoogleMeetIcon, ZoomIcon, FigmaIcon, NotionIcon,
  ClockIcon, VideoIcon, MoreHorizontalIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

// Mock Schedule Data for the Giant Timeline (Inheriting Exact SAI Reference)
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
        timeStart: '13:30',
        timeEnd: '17:30',
        category: 'Working',
        title: 'Design meeting check product',
        accentColor: '#F59E0B',
        type: 'meet',
        platform: 'Google Meet',
        platformIcon: GoogleMeetIcon,
        attendees: [
          { name: 'Alex', initials: 'AJ', color: '#8B5CF6' }
        ]
      },
      {
        id: 'evt-303',
        timeStart: '17:30',
        timeEnd: '17:45',
        category: 'Coffe time',
        title: 'Async team sync & coffee break',
        accentColor: '#0EA5E9',
        type: 'break',
        isBreak: true
      },
      {
        id: 'evt-304',
        timeStart: '18:00',
        timeEnd: '18:30',
        category: 'Design Seeng',
        title: 'Design meeting check product',
        accentColor: '#3B82F6',
        type: 'zoom',
        platform: 'Zoom',
        platformIcon: ZoomIcon
      }
    ]
  },
  {
    dayNumber: '04',
    dayName: 'Th',
    isToday: false,
    events: [
      {
        id: 'evt-401',
        timeStart: '18:30',
        timeEnd: '21:30',
        category: 'Reed Book',
        title: 'Design meeting check product',
        accentColor: '#EF4444',
        type: 'meet',
        platform: 'Google Meet',
        platformIcon: GoogleMeetIcon
      }
    ]
  },
  {
    dayNumber: '05',
    dayName: 'Ft',
    isToday: false,
    events: [] // Empty state matching reference
  }
]

// Left Panel Upcoming Events
const initialEventsList = [
  { id: 'ev-1', name: 'Jaroslav Brabec', time: '11:00', initials: 'JB', color: '#8B5CF6' },
  { id: 'ev-2', name: 'Paulina Gayoso', time: '12:15', initials: 'PG', color: '#F43F5E' },
  { id: 'ev-3', name: 'Trashae Hubbard', time: '13:20', initials: 'TH', color: '#F59E0B' },
  { id: 'ev-4', name: 'Mathijn Agter', time: '20:00', initials: 'MA', color: '#10B981' }
]

// Left Panel Daily Tasks
const initialDailyTasks = [
  { id: 'tsk-1', title: 'Buy Sunlite', done: false },
  { id: 'tsk-2', title: 'to Hallie Alvarado', done: false },
  { id: 'tsk-3', title: 'Get radi', done: false },
  { id: 'tsk-4', title: 'Go to mouvi', done: false }
]

// Mini Month Calendar Matrix (May 2025)
const calendarMatrix = [
  { day: 31, isPrev: true, dots: [] },
  { day: 1, isPrev: false, dots: [] },
  { day: 2, isPrev: false, dots: ['#F59E0B'] },
  { day: 3, isPrev: false, isSelected: true, dots: ['#EF4444', '#10B981'] },
  { day: 4, isPrev: false, dots: ['#3B82F6', '#8B5CF6'] },
  { day: 5, isPrev: false, dots: [] },
  { day: 6, isPrev: false, dots: ['#10B981'] },
  { day: 7, isPrev: false, dots: ['#EF4444'] },
  { day: 8, isPrev: false, dots: [] },
  { day: 9, isPrev: false, dots: ['#F59E0B'] },
  { day: 10, isPrev: false, dots: ['#3B82F6'] },
  { day: 11, isPrev: false, dots: ['#8B5CF6', '#10B981'] },
  { day: 12, isPrev: false, dots: [] },
  { day: 13, isPrev: false, dots: ['#F43F5E'] },
  { day: 14, isPrev: false, dots: [] },
  { day: 15, isPrev: false, dots: ['#F59E0B'] },
  { day: 16, isPrev: false, dots: [] },
  { day: 17, isPrev: false, dots: ['#10B981'] },
  { day: 18, isPrev: false, dots: ['#8B5CF6'] },
  { day: 19, isPrev: false, dots: ['#EF4444'] },
  { day: 20, isPrev: false, dots: [] },
  { day: 21, isPrev: false, dots: [] },
  { day: 22, isPrev: false, dots: ['#3B82F6'] },
  { day: 23, isPrev: false, dots: ['#F59E0B'] },
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
  const [selectedDay, setSelectedDay] = useState(3)
  const [tasks, setTasks] = useState(initialDailyTasks)
  const [events, setEvents] = useState(initialEventsList)
  const [schedules, setSchedules] = useState(initialDaySchedules)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(19) // 0:19
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

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-7 py-5 overflow-y-auto pt-16 lg:pt-5">
          {/* Dynamic Top Header */}
          <DynamicHeader
            onOpenNewTask={() => setNewMeetingModal(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* ══════════════════════════════════════════════════════════ */}
          {/* EDITORIAL WORKOS 3-COLUMN CALENDAR CANVAS                 */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="rounded-[32px] bg-[#ECE7DE] border border-stone-300/70 p-3 sm:p-5 shadow-xs mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* ────────────────────────────────────────────────────────── */}
              {/* COLUMN 1: LEFT PANEL (Mini Month + Events + Tasks)       */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-3 rounded-[28px] bg-[#E2DDCF] p-5 border border-stone-300/60 flex flex-col justify-between space-y-6">

                {/* Calendar Title & Search Header */}
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
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-medium text-stone-400 mb-2 font-sans">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Matrix Numbers */}
                    <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-futura">
                      {calendarMatrix.map((item, idx) => {
                        const isCurrentActive = item.day === selectedDay && !item.isPrev && !item.isNext
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!item.isPrev && !item.isNext) {
                                setSelectedDay(item.day)
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
                            {/* Event indicator dots */}
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
                      AJ
                    </div>
                  </div>
                  <button
                    onClick={() => setNewMeetingModal(true)}
                    className="w-7 h-7 rounded-full bg-stone-900 hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    <PlusIcon size={13} />
                  </button>
                </div>

              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* COLUMN 2: CENTER MAIN TIMELINE STAGE (Pure Editorial SAI)  */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-6 rounded-[28px] bg-[#FAF8F5] p-5 sm:p-8 border border-stone-300/60 shadow-2xs space-y-6">

                {/* Top Control Bar: Month Title & Share Action */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 font-sans">
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight font-sans">
                      May
                    </h2>
                    <span className="text-2xl sm:text-3xl font-light text-stone-400 font-futura">
                      2025
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success('Link copied to clipboard')}
                      className="px-4 py-1.5 rounded-full bg-stone-950 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer font-sans"
                    >
                      <ShareIcon size={12} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Top Dashed Ruler Bar */}
                <div className="border-t border-dashed border-stone-300 pt-1" />

                {/* ── Giant Typography Day Blocks Stream ── */}
                <div className="space-y-10">
                  {schedules.map((dayItem) => (
                    <div
                      key={dayItem.dayNumber}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start pt-6 border-t border-stone-200 first:border-t-0 first:pt-0"
                    >
                      {/* Left: Giant Display Number with Red Superscript (Futura Font) */}
                      <div className="sm:col-span-4 flex items-start font-sans">
                        <div className="flex items-start select-none">
                          <span
                            className="text-7xl sm:text-8xl lg:text-[88px] font-black text-stone-950 leading-none tracking-[-0.03em] font-futura stat-number"
                          >
                            {dayItem.dayNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#E63946] -translate-y-2 ml-1 select-none font-sans">
                            {dayItem.dayName}
                          </span>
                        </div>
                      </div>

                      {/* Right: Editorial Event Stream Rows */}
                      <div className="sm:col-span-8 space-y-4">
                        {dayItem.events.length === 0 ? (
                          /* Empty Free Day State matching reference */
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
                                {/* Red Live Needle Ruler positioned over active slot */}
                                {isFirstLive && (
                                  <div className="relative flex items-center my-2 -mt-1 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#E63946] relative z-10" />
                                    <div className="flex-1 h-[1.5px] bg-[#E63946]" />
                                  </div>
                                )}

                                <div className="flex items-start justify-between gap-3 text-xs group">
                                  {/* Time Column - Futura Sans */}
                                  <div className="w-28 shrink-0 flex items-baseline pt-0.5 select-none font-futura">
                                    <span className="font-bold text-[13px] text-stone-900 tracking-tight">{ev.timeStart}</span>
                                    <span className="text-[12px] text-stone-400 font-normal ml-0.5">-{ev.timeEnd}</span>
                                  </div>

                                  {/* Vertical Accent Color Line */}
                                  <div
                                    className="w-[2px] self-stretch shrink-0 rounded-full my-0.5"
                                    style={{ backgroundColor: ev.accentColor }}
                                  />

                                  {/* Event Content Details */}
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

                                  {/* Right Attendees Stack */}
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

              {/* ────────────────────────────────────────────────────────── */}
              {/* COLUMN 3: RIGHT PANEL (AI Assistant & Focus Command)     */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-3 rounded-[28px] bg-[#E2DDCF] p-5 border border-stone-300/60 flex flex-col justify-between space-y-5 font-sans">

                {/* AI Assistant Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-sm tracking-tight text-stone-900">
                      Ai Assistant
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[9px] text-stone-500">
                      ◷
                    </span>
                  </div>

                  {/* 1. AI Audio Summary & Waveform Widget */}
                  <div className="p-4 rounded-2xl bg-[#D6D0C2] border border-stone-300/70 mb-4">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-stone-900">
                        Ai Sumari
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mb-2">
                      All Massage
                    </div>

                    {/* Interactive Animated Waveform */}
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

                    {/* Audio Player Controls */}
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

                  {/* 2. Focus & Meeting Dial Timer Widget */}
                  <div className="p-4 rounded-2xl bg-[#E2DDCF] border border-stone-300/80 mb-4 shadow-2xs">
                    <div className="text-xs font-bold text-stone-900 mb-1">
                      Timer
                    </div>

                    {/* Circular Arc Countdown Meter */}
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
                        <span className="text-[8px] text-stone-400 font-medium font-sans">Before the start</span>
                      </div>
                    </div>

                    {/* Yellow High-Impact Meeting Card */}
                    <div className="mt-3 p-3.5 rounded-xl bg-[#FACC15] text-stone-950 shadow-xs font-sans">
                      <div className="flex items-center justify-between text-[9px] font-bold mb-0.5">
                        <span>You Have a Meeting</span>
                        <span className="text-[10px] text-stone-700 font-medium font-futura">11:34</span>
                      </div>
                      <div className="text-3xl font-black tracking-tight leading-tight font-futura stat-number">
                        09:56
                      </div>
                      <div className="text-xs font-bold text-stone-950 mt-0.5">
                        Development call
                      </div>
                      <div className="text-[10px] text-stone-800 font-medium mt-1 leading-snug">
                        to Hallie Alvarado<br />Your trip with Gojek on Wednesday
                      </div>
                    </div>
                  </div>

                  {/* 3. Connected Tool Integrations */}
                  <div className="pt-2 border-t border-stone-300/60">
                    <span className="text-[11px] font-bold text-stone-900 block mb-2">
                      Connect
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

                {/* Bottom Tag */}
                <div className="text-[10px] font-semibold text-stone-500 text-center">
                  Work OS · SAI
                </div>

              </div>

            </div>
          </div>

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