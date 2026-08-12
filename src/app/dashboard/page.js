"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import {
  TrendingUpIcon, CheckIcon, ZapIcon, PlusIcon,
  CalendarIcon, ChevronRightIcon, MoreHorizontalIcon,
} from '@/components/Icons'
import { toast } from 'react-hot-toast';

const stats = [
  { label: 'Active Projects', value: '24', delta: '+3 this month', color: '#6366f1', bg: '#eef2ff', icon: <ZapIcon size={20} /> },
  { label: 'Total Tasks', value: '187', delta: '42 completed today', color: '#10b981', bg: '#d1fae5', icon: <CheckIcon size={20} /> },
  { label: 'Sprint Velocity', value: '94 pts', delta: '↑ 12% vs last sprint', color: '#f59e0b', bg: '#fef3c7', icon: <TrendingUpIcon size={20} /> },
  { label: 'Completion Rate', value: '78%', delta: 'On track for Q3', color: '#8b5cf6', bg: '#ede9fe', icon: <TrendingUpIcon size={20} /> },
]

const activity = [
  { user: 'Sarah Chen', avatar: '#6366f1', action: 'completed', item: 'User Auth Flow redesign', time: '4m ago', type: 'success' },
  { user: 'Marcus Webb', avatar: '#10b981', action: 'commented on', item: 'Payment Gateway API', time: '12m ago', type: 'comment' },
  { user: 'Priya Nair', avatar: '#f59e0b', action: 'moved', item: 'Database Migration to Review', time: '28m ago', type: 'move' },
  { user: 'Kai Okafor', avatar: '#ef4444', action: 'created', item: 'Sprint 14 Planning doc', time: '1h ago', type: 'create' },
  { user: 'Alex Johnson', avatar: '#8b5cf6', action: 'resolved', item: '3 critical bugs in prod', time: '2h ago', type: 'success' },
  { user: 'Jordan Lee', avatar: '#0ea5e9', action: 'assigned', item: 'Mobile App auth task to Priya', time: '3h ago', type: 'assign' },
]

const deadlines = [
  { project: 'Authentication Service', task: 'OAuth2 Integration', due: 'Tomorrow', priority: 'Critical', color: '#ef4444' },
  { project: 'Payment Gateway', task: 'Stripe Webhook Setup', due: 'Aug 10', priority: 'High', color: '#f59e0b' },
  { project: 'Customer Portal', task: 'Dashboard v2 Launch', due: 'Aug 14', priority: 'High', color: '#f59e0b' },
  { project: 'Mobile App v2', task: 'Push Notifications', due: 'Aug 18', priority: 'Medium', color: '#6366f1' },
]

const weekData = [65, 80, 72, 90, 85, 78, 94]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dotColor = {
  success: 'bg-emerald-500',
  comment: 'bg-indigo-500',
  move: 'bg-amber-500',
}

const Card = ({ children, className = '' }) => (
  <div className={`rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] transition-transform hover:-translate-y-0.5 ${className}`}>
    {children}
  </div>
)

export default function Dashboard({ navigate, onNewTask, currentPage = 'dashboard' }) {
  const [activeDay] = useState(6)

  return (
    <div className="flex min-h-screen w-full">
      {/* 1. Sidebar Component */}
      <Sidebar 
        currentPage={currentPage} 
        navigate={navigate} 
        onNotificationClick={() => toast.info('Notifications clicked')}
        onProfileClick={() => toast.info('Profile clicked')}
        onCommandPalette={() => toast.info('Command Palette opened')}
      />

      {/* 2. Main Dashboard Layout */}
      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col items-stretch justify-between gap-3 mb-7 sm:flex-row sm:items-start sm:gap-3">
          <div>
            <div className="text-[21px] sm:text-[26px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Good morning, Alex 👋
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Thursday, August 7, 2026 · Sprint 14 is ending in 3 days
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate?.('analytics')}
              className="flex-1 sm:flex-none justify-center px-4.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-[13.5px] font-medium text-slate-600 hover:bg-white transition-colors cursor-pointer"
            >
              View Analytics
            </button>
            <button
              onClick={() => onNewTask?.()}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-none bg-gradient-to-br from-indigo-500 to-indigo-400 text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_18px_rgba(99,102,241,0.45)] transition-shadow cursor-pointer"
            >
              <PlusIcon size={15} strokeWidth={2.5} />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {stats.map(s => (
            <div key={s.label} className="rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-5 transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <MoreHorizontalIcon size={16} />
              </div>
              <div className="text-[28px] font-bold text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {s.value}
              </div>
              <div className="text-[12.5px] text-slate-500 mt-1">{s.label}</div>
              <div className="text-[11.5px] mt-1.5 font-medium" style={{ color: s.color }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Main content: chart + deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-5">
          {/* Weekly chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2.5 mb-6">
              <div>
                <div className="text-[15px] font-semibold text-slate-900">Weekly Progress</div>
                <div className="text-[12.5px] text-slate-400 mt-0.5">Tasks completed per day this week</div>
              </div>
              <select className="text-[12.5px] px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white/80 text-slate-600 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="flex items-end gap-3 h-[140px]">
              {weekData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className={`text-[11px] font-mono ${i === activeDay ? 'text-indigo-500 font-semibold' : 'text-slate-400 font-normal'}`}>{v}</span>
                  <div
                    className="bar-animate w-full max-w-[36px] rounded-lg"
                    style={{
                      height: `${(v / 100) * 110}px`,
                      background: i === activeDay
                        ? 'linear-gradient(to top, #6366f1, #818cf8)'
                        : 'linear-gradient(to top, rgba(99,102,241,0.25), rgba(129,140,248,0.1))',
                      boxShadow: i === activeDay ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                  <span className={`text-[11px] ${i === activeDay ? 'text-indigo-500 font-semibold' : 'text-slate-400 font-normal'}`}>{days[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-slate-200/50">
              {[{ l: 'Avg Daily', v: '81 tasks' }, { l: 'Best Day', v: 'Thu 94' }, { l: 'Trend', v: '↑ 14%' }].map(m => (
                <div key={m.l}>
                  <div className="text-[11px] text-slate-400">{m.l}</div>
                  <div className="text-sm font-semibold text-slate-900 font-mono">{m.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Deadlines */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-semibold text-slate-900">Upcoming Deadlines</div>
              <CalendarIcon size={16} />
            </div>
            <div className="flex flex-col gap-2.5">
              {deadlines.map((d, i) => (
                <div
                  key={i}
                  className="px-3.5 py-3 rounded-xl bg-slate-50/80 border border-slate-200/50 cursor-pointer transition-colors hover:bg-indigo-500/[0.06]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-[12.5px] font-semibold text-slate-900">{d.task}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.project}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold" style={{ color: d.color }}>{d.due}</div>
                      <span
                        className="text-[9.5px] px-1.5 py-0.5 rounded-md font-semibold"
                        style={{ background: `${d.color}18`, color: d.color }}
                      >
                        {d.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate?.('kanban')}
              className="w-full mt-3 py-2.5 border border-dashed border-indigo-500/30 rounded-[10px] bg-transparent text-indigo-500 text-[12.5px] font-medium cursor-pointer hover:bg-indigo-500/[0.06] transition-colors"
            >
              View all tasks →
            </button>
          </Card>
        </div>

        {/* Activity + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          {/* Activity feed */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-semibold text-slate-900">Team Activity</div>
              <button className="text-xs text-indigo-500 bg-transparent border-none cursor-pointer font-medium hover:underline">View all</button>
            </div>
            <div className="flex flex-col">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50/80 transition-colors">
                  <div
                    className="w-8 h-8 rounded-[9px] flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: a.avatar }}
                  >
                    {a.user.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12.5px] text-slate-900 leading-relaxed">
                      <span className="font-semibold">{a.user}</span>
                      <span className="text-slate-500 font-normal"> {a.action} </span>
                      <span className="font-medium">{a.item}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor[a.type] ?? 'bg-slate-400'}`} />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions + project overview */}
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <div className="text-[15px] font-semibold text-slate-900 mb-3.5">Quick Actions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'New Task', color: '#6366f1', bg: '#eef2ff', onClick: () => onNewTask?.() },
                  { label: 'Invite Member', color: '#10b981', bg: '#d1fae5', onClick: () => { navigate?.('team'); toast.info('Invite members from the Team page') } },
                  { label: 'New Sprint', color: '#f59e0b', bg: '#fef3c7', onClick: () => { navigate?.('kanban'); toast.info('Sprint planning opened') } },
                  { label: 'View Reports', color: '#8b5cf6', bg: '#ede9fe', onClick: () => navigate?.('analytics') },
                ].map(a => (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className="px-2.5 py-3 rounded-xl border-none text-[12.5px] font-semibold cursor-pointer transition-transform hover:scale-[1.02]"
                    style={{ background: a.bg, color: a.color }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="text-[15px] font-semibold text-slate-900">Project Progress</div>
                <ChevronRightIcon size={16} />
              </div>
              {[
                { name: 'Auth Service', p: 82, color: '#6366f1' },
                { name: 'Payment Gateway', p: 61, color: '#10b981' },
                { name: 'Customer Portal', p: 45, color: '#f59e0b' },
              ].map(pr => (
                <div key={pr.name} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12.5px] text-slate-900 font-medium">{pr.name}</span>
                    <span className="text-[11.5px] text-slate-400 font-mono">{pr.p}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200/80">
                    <div
                      className="progress-fill h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${pr.color}, ${pr.color}99)`, width: `${pr.p}%` }}
                    />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}