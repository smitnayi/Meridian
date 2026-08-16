"use client"

import React, { useState, useEffect } from 'react'
import {
  SearchIcon, BellIcon, PlusIcon, VideoIcon, ClockIcon, SparklesIcon
} from './Icons'
import { toast } from 'react-hot-toast'

export default function DynamicHeader({ onOpenNewTask, onOpenSearch, title = "Workspace" }) {
  const [meetingActive, setMeetingActive] = useState(true)
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60 + 42) // 18m 42s
  const [inCall, setInCall] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <header className="w-full mb-6">
      {/* Top Floating Dynamic Island Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Dynamic Island Capsule */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#111318] text-white rounded-full shadow-lg shadow-black/10 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
              <span className="text-lime-400 uppercase text-[10px] font-mono font-bold bg-lime-950/80 px-2 py-0.5 rounded-full border border-lime-500/30">
                Live Sprint 14
              </span>
              <span className="text-slate-200 hidden sm:inline">2:00 PM Design Review & Standup</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Participant Avatars */}
            <div className="flex -space-x-2 overflow-hidden items-center">
              <div className="w-6 h-6 rounded-full bg-violet-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#111318]">SC</div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#111318]">MW</div>
              <div className="w-6 h-6 rounded-full bg-amber-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#111318]">PN</div>
              <div className="w-6 h-6 rounded-full bg-slate-700 text-[9px] font-bold flex items-center justify-center text-slate-200 ring-2 ring-[#111318]">+3</div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-1 rounded-full">
              <ClockIcon size={12} className="text-lime-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                setInCall(!inCall)
                if (!inCall) {
                  toast.success('Connecting to Google Meet room...')
                } else {
                  toast('Left sprint meeting room', { icon: '👋' })
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                inCall
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-xs'
              }`}
            >
              <VideoIcon size={12} strokeWidth={2.5} />
              <span>{inCall ? 'End Call' : 'Join'}</span>
            </button>
          </div>
        </div>

        {/* Global Search & Quick Actions */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white border border-black/5 text-slate-500 hover:text-slate-800 hover:bg-white/90 shadow-xs transition-all cursor-pointer text-xs font-medium"
          >
            <SearchIcon size={15} />
            <span className="hidden sm:inline">Search anything...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-stone-100 rounded-md border border-stone-200">
              ⌘K
            </kbd>
          </button>

          {/* New Task Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#111318] text-white hover:bg-black font-semibold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <PlusIcon size={15} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  )
}
