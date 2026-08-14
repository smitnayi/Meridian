"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  CheckIcon, ClockIcon, UsersIcon, BarChartIcon,
  ChevronRightIcon, PlusIcon, MoreHorizontalIcon, FilterIcon
} from '@/components/Icons'
import CreateTaskModal from '@/components/CreateTaskModal'
import { toast } from 'react-hot-toast'

const stats = [
  { label: 'Active Tasks', value: '47', delta: '+12%', sub: 'vs last week', color: '#6366f1', bg: '#eef2ff', icon: <CheckIcon size={20} />, href: '/kanban' },
  { label: 'Hours Tracked', value: '184h', delta: '+8%', sub: 'this sprint', color: '#10b981', bg: '#ecfdf5', icon: <ClockIcon size={20} />, href: '/analytics' },
  { label: 'Team Velocity', value: '94%', delta: '+5%', sub: 'efficiency', color: '#f59e0b', bg: '#fffbeb', icon: <BarChartIcon size={20} />, href: '/analytics' },
  { label: 'Active Members', value: '12', delta: '+2', sub: 'online now', color: '#8b5cf6', bg: '#f5f3ff', icon: <UsersIcon size={20} />, href: '/team' },
]

const weekData = [45, 68, 85, 92, 78, 60, 40]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const initialActivity = [
  { user: 'Sarah Chen', avatar: '#6366f1', action: 'moved task to In Review', item: 'MRD-032 OAuth2 Social Login', time: '8m ago', type: 'task' },
  { user: 'Marcus Webb', avatar: '#10b981', action: 'completed subtask', item: 'Verify Stripe webhook signatures', time: '24m ago', type: 'task' },
  { user: 'Jordan Lee', avatar: '#0ea5e9', action: 'deployed to staging', item: 'Homepage Redesign v2', time: '1h ago', type: 'deploy' },
  { user: 'Priya Nair', avatar: '#f59e0b', action: 'commented on', item: 'MRD-028 Design System components', time: '2h ago', type: 'comment' },
  { user: 'Kai Okafor', avatar: '#ef4444', action: 'merged pull request #148', item: 'fix: auth token expiry check', time: '3h ago', type: 'deploy' },
]

const deadlines = [
  { title: 'Sprint 14 Review', project: 'Auth Service', due: 'Tomorrow, 3pm', priority: 'Critical', color: '#ef4444' },
  { title: 'Stripe Integration QA', project: 'Payment Gateway', due: 'Friday, EOD', priority: 'High', color: '#f59e0b' },
  { title: 'Customer Portal Beta', project: 'Customer Portal', due: 'Aug 14', priority: 'Medium', color: '#6366f1' },
]

const dotColor = {
  task: 'bg-indigo-500',
  deploy: 'bg-emerald-500',
  comment: 'bg-amber-500',
}

function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeDay] = useState(3) // Thu
  const [activityFilter, setActivityFilter] = useState('all') // 'all' | 'task' | 'deploy' | 'comment'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filteredActivity = initialActivity.filter(a => {
    if (activityFilter === 'all') return true
    return a.type === activityFilter
  })

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        {/* 1. Sidebar Component */}
        <Sidebar />

        {/* 2. Main Dashboard Layout */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
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
                onClick={() => router.push('/analytics')}
                className="flex-1 sm:flex-none justify-center px-4.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-[13.5px] font-medium text-slate-600 hover:bg-white transition-colors cursor-pointer"
              >
                View Analytics
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-none bg-gradient-to-br from-indigo-500 to-indigo-400 text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_18px_rgba(99,102,241,0.45)] transition-shadow cursor-pointer"
              >
                <PlusIcon size={15} strokeWidth={2.5} />
                New Task
              </button>
            </div>
          </div>

          {/* Stats Cards with Working Action Menus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {stats.map(s => (
              <div
                key={s.label}
                onClick={() => router.push(s.href)}
                className="rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-5 transition-transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs" style={{ background: s.bg, color: s.color }}>
                    {s.icon}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(s.href)
                      toast.info(`Opening ${s.label} view`)
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontalIcon size={16} />
                  </button>
                </div>
                <div className="text-[28px] font-bold text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[13px] font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">{s.label}</span>
                  <span className="text-[11.5px] font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {s.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Middle: Velocity Chart + Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Chart */}
            <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Sprint 14 Throughput
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Story points delivered per day vs target (80 pts)</div>
                </div>
                <button
                  onClick={() => router.push('/analytics')}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-transparent border-none cursor-pointer hover:underline p-0"
                >
                  Full Report <ChevronRightIcon size={13} />
                </button>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end gap-3 sm:gap-6 h-36 px-2 pb-2">
                {weekData.map((val, i) => {
                  const h = Math.round((val / 100) * 120)
                  const isCur = i === activeDay
                  return (
                    <div
                      key={days[i]}
                      onClick={() => toast.info(`${days[i]}: ${val} story points delivered`)}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                    >
                      <span className="text-[11px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isCur
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                            : 'bg-indigo-100 group-hover:bg-indigo-200'
                        }`}
                        style={{ height: `${h}px` }}
                      />
                      <span className={`text-xs font-medium ${isCur ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                        {days[i]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Upcoming Deadlines
                </div>
                <button
                  onClick={() => router.push('/calendar')}
                  className="text-xs text-indigo-600 font-semibold bg-transparent border-none cursor-pointer hover:underline p-0"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {deadlines.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/calendar')}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">{d.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{d.project}</div>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: d.priority === 'Critical' ? '#fee2e2' : '#fef3c7',
                        color: d.priority === 'Critical' ? '#ef4444' : '#d97706',
                      }}
                    >
                      {d.due}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Bottom: Activity Feed + Active Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Activity Feed */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-5 relative">
                <div>
                  <div className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Team Activity
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Real-time updates from your workspace</div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(p => !p)}
                    className="text-xs text-slate-600 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FilterIcon size={12} />
                    <span className="capitalize">{activityFilter === 'all' ? 'All Activity' : activityFilter}</span>
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 top-9 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in">
                      {['all', 'task', 'deploy', 'comment'].map(f => (
                        <button
                          key={f}
                          onClick={() => {
                            setActivityFilter(f)
                            setShowFilterDropdown(false)
                            toast.success(`Filter: ${f}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-slate-50 ${
                            activityFilter === f ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
                          }`}
                        >
                          {f === 'all' ? 'All Activity' : f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {filteredActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                      style={{ background: a.avatar }}
                    >
                      {a.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-slate-800 leading-tight truncate">
                        <strong className="font-semibold text-slate-900">{a.user}</strong> {a.action}{' '}
                        <span className="font-medium text-slate-700">{a.item}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[a.type] || 'bg-slate-300'}`} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Projects Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Project Status
                </div>
                <button
                  onClick={() => router.push('/kanban')}
                  className="text-xs text-indigo-600 font-semibold bg-transparent border-none cursor-pointer hover:underline p-0"
                >
                  Boards
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { name: 'Auth Service', color: '#6366f1', progress: 82, badge: 'Sprint 14' },
                  { name: 'Payment Gateway', color: '#10b981', progress: 61, badge: 'Staging' },
                  { name: 'Analytics Dashboard', color: '#f59e0b', progress: 45, badge: 'In Dev' },
                  { name: 'Mobile App v2', color: '#ef4444', progress: 28, badge: 'Design' },
                ].map((p) => (
                  <div
                    key={p.name}
                    onClick={() => router.push('/kanban')}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">
                        {p.badge}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>

        {/* Create Task Modal */}
        <CreateTaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreateTask={() => {
            setModalOpen(false)
            toast.success('Task created successfully')
            router.push('/kanban')
          }}
        />
      </div>
    </ProtectedRoute>
  )
}