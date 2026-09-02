"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import OrgOnboarding from '@/components/OrgOnboarding'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import {
  CheckIcon, ClockIcon, UsersIcon, BarChartIcon,
  ChevronRightIcon, PlusIcon, MoreHorizontalIcon, FilterIcon,
  ArrowUpRightIcon, SearchIcon, SparklesIcon, ZapIcon, CheckCircleIcon,
  ClipboardIcon, TargetIcon, RocketIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'


// Pastel Bento KPIs
const bentoKPIs = [
  {
    id: 'tasks',
    label: 'Total Tasks',
    value: '137',
    delta: '+20% vs last month',
    bg: 'bg-[#EDE9FE]',
    text: 'text-[#6D28D9]',
    border: 'border-[#DDD6FE]',
    icon: <ClipboardIcon size={18} className="text-[#6D28D9]" />,
    sparkline: [30, 45, 60, 55, 80, 95, 137]
  },
  {
    id: 'efficiency',
    label: 'Efficiency Score',
    value: '8.6',
    delta: '+0.5 vs last month',
    bg: 'bg-[#FFEDD5]',
    text: 'text-[#C2410C]',
    border: 'border-[#FDBA74]',
    icon: <ZapIcon size={18} className="text-[#C2410C]" />,
    sparkline: [6.8, 7.2, 7.5, 7.9, 8.1, 8.4, 8.6]
  },
  {
    id: 'completion',
    label: 'Sprint Completion',
    value: '74%',
    delta: '+10% vs last month',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0369A1]',
    border: 'border-[#BAE6FD]',
    icon: <TargetIcon size={18} className="text-[#0369A1]" />,
    sparkline: [40, 52, 58, 62, 68, 70, 74]
  },
  {
    id: 'velocity',
    label: 'Team Velocity',
    value: '94%',
    delta: 'Top 5% speed',
    bg: 'bg-[#ECFCCB]',
    text: 'text-[#3F6212]',
    border: 'border-[#D9F99D]',
    icon: <RocketIcon size={18} className="text-[#3F6212]" />,
    sparkline: [50, 60, 75, 80, 88, 91, 94]
  },
]

const initialLineUp = [
  {
    id: 'lu-1',
    taskId: 'MRD-012',
    category: 'Commercial',
    title: 'Financial Mobile Banking App UI Kit',
    pct: 68,
    timeSpent: '14:20:00',
    color: '#f97316',
    border: 'border-orange-200',
    bg: 'bg-orange-50/50',
    assignees: [
      { name: 'Sarah Chen', color: '#6366f1' },
      { name: 'Alex Johnson', color: '#8b5cf6' }
    ]
  },
  {
    id: 'lu-2',
    taskId: 'MRD-014',
    category: 'Publications',
    title: 'Design System 2.0 Typography & Tokens',
    pct: 92,
    timeSpent: '28:45:10',
    color: '#8b5cf6',
    border: 'border-violet-200',
    bg: 'bg-violet-50/50',
    assignees: [
      { name: 'Kacie Velasquez', color: '#f43f5e' }
    ]
  }
]

const myWorkInitial = [
  {
    id: 'mw-1',
    taskId: 'MRD-021',
    path: 'Publications / Shots',
    title: 'Design 3 variations for iOS widget card mockup',
    subtasksCompleted: 3,
    subtasksTotal: 5,
    due: 'Today 5pm',
    tab: 'todo',
    priority: 'High',
    assignees: [{ initials: 'SC', color: '#6366f1' }, { initials: 'AJ', color: '#8b5cf6' }],
    description: 'Deliverable required for marketing hero shots on Dribbble and social publication channels.',
    subtasks: [
      { text: 'Dark mode contrast audit', done: true },
      { text: 'Export PNG assets @2x and @3x', done: true },
      { text: 'Create motion preview in AfterEffects', done: true },
      { text: 'Figma review with team lead', done: false },
      { text: 'Client signoff', done: false }
    ]
  },
  {
    id: 'mw-2',
    taskId: 'MRD-022',
    path: 'Commercial / Portals',
    title: 'Implement OAuth2 token refresh & user session handler',
    subtasksCompleted: 4,
    subtasksTotal: 5,
    due: 'Tomorrow',
    tab: 'todo',
    priority: 'Critical',
    assignees: [{ initials: 'MW', color: '#10b981' }],
    description: 'Secure JWT rotation with Redis distributed cache for fast token validation.',
    subtasks: [
      { text: 'Write Redis session adapter', done: true },
      { text: 'Setup cookie encryption', done: true },
      { text: 'Write unit tests for token expiration', done: true },
      { text: 'Security penetration test', done: true },
      { text: 'Deploy to staging cluster', done: false }
    ]
  },
  {
    id: 'mw-3',
    taskId: 'MRD-038',
    path: 'Design Internal / Exploration',
    title: 'Explore responsive tablet layouts for task board view',
    subtasksCompleted: 1,
    subtasksTotal: 2,
    due: 'July 30',
    tab: 'todo',
    priority: 'Medium',
    assignees: [{ initials: 'KV', color: '#f43f5e' }],
    description: 'Provide seamless touch gestures and drag-and-drop column handling for iPad Pro and Galaxy Tab.',
    subtasks: [
      { text: 'Touch drag gesture prototypes', done: true },
      { text: 'Test on Safari Mobile', done: false }
    ]
  },
  {
    id: 'mw-4',
    taskId: 'MRD-044',
    path: 'Commercial / Portals',
    title: 'Client Review & Feedback on v2 redesign',
    subtasksCompleted: 1,
    subtasksTotal: 1,
    due: 'July 28',
    tab: 'done',
    priority: 'Low',
    assignees: [{ initials: 'SC', color: '#6366f1' }],
    description: 'Signed off by enterprise stakeholder committee.',
    subtasks: [
      { text: 'Final client signoff', done: true }
    ]
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [workTab, setWorkTab] = useState('todo')
  const [searchQuery, setSearchQuery] = useState('')
  const [myWork, setMyWork] = useState(myWorkInitial)
  const [hoveredBar, setHoveredBar] = useState(null)
  const {fullName, initials} = useCurrentUser();
  const { userState, activeOrg, unseenNotifications, openOrgFromNotification } = useOrg()

  const filteredWork = myWork.filter(w => {
    if (workTab === 'todo') return w.tab === 'todo'
    if (workTab === 'done') return w.tab === 'done'
    return true
  }).filter(w => {
    if (!searchQuery.trim()) return true
    return w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.path.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const toggleTaskDone = (e, id) => {
    e.stopPropagation()
    setMyWork(prev => prev.map(t => {
      if (t.id === id) {
        const nextTab = t.tab === 'done' ? 'todo' : 'done'
        toast.success(nextTab === 'done' ? 'Task moved to Done' : 'Task restored to Active')
        return { ...t, tab: nextTab }
      }
      return t
    }))
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Executive Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          {/* Dynamic Top Header & Schedule Island */}
          <DynamicHeader
            onOpenNewTask={() => setModalOpen(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Approval Notification Banner */}
          {unseenNotifications.map(notif => (
            <div
              key={notif.id}
              className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckIcon size={16} strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-emerald-900">
                  You&apos;ve been approved to join <strong>{notif.orgName}</strong>!
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Welcome aboard — your request was accepted by the organization leader.
                </div>
              </div>
              <button
                onClick={() => openOrgFromNotification(notif.id, notif.orgId)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Open →
              </button>
            </div>
          ))}

          {userState !== 'active' ? (
            <OrgOnboarding />
          ) : (
            <>
              {/* ── Greeting & Top Headline with Instrument Serif Italic ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif leading-tight">
                      Good morning, <em className="italic font-serif font-normal text-stone-900">{fullName || 'there'}</em>
                    </h1>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-200 text-lime-900 font-mono shadow-2xs">
                      {activeOrg?.name || 'Sprint 14 Active'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-stone-600 font-medium mt-1.5">
                    Command center for <em className="font-serif italic font-normal text-stone-800 text-base sm:text-lg">{activeOrg?.name || 'high-velocity'}</em> sprint execution · 3 priorities queued
                  </p>
                </div>

                {/* Quick Summary Pill Badge */}
                <div className="flex items-center gap-3.5 bg-white px-5 py-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block font-mono">Tasks done</span>
                    <span className="text-lg font-extrabold text-stone-950 stat-number">2,543</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                    <ArrowUpRightIcon size={16} />
                  </div>
                </div>
              </div>

              {/* ── 1. Bento KPI Metric Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {bentoKPIs.map(kpi => (
                  <div
                    key={kpi.id}
                    onClick={() => router.push(kpi.id === 'tasks' ? '/kanban' : '/Analytics')}
                    className={`rounded-3xl p-6 border ${kpi.border} ${kpi.bg} bento-card-interactive cursor-pointer relative overflow-hidden group shadow-2xs`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="p-2.5 rounded-2xl bg-white/85 backdrop-blur-xs shadow-2xs">
                        {kpi.icon}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-stone-700 shadow-2xs font-mono">
                        {kpi.delta}
                      </span>
                    </div>

                    <div className="text-4xl sm:text-5xl font-extrabold text-stone-950 tracking-tight mb-1 stat-number">
                      {kpi.value}
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-stone-700">
                      {kpi.label}
                    </div>

                    {/* Micro sparkline visualizer */}
                    <div className="mt-3.5 flex items-end gap-1 h-6 pt-1">
                      {kpi.sparkline.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-stone-900/20 rounded-full transition-all duration-300 group-hover:bg-stone-900/40"
                          style={{ height: `${(val / Math.max(...kpi.sparkline)) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

          {/* ── 2. Middle Grid: LineUp + Working Activity Schedule ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Left 2 Cols: LineUp & Trending Section */}
            <div className="lg:col-span-2 space-y-6">

              {/* LineUp Cards */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                      LineUp & <em className="italic font-serif font-normal text-stone-800">Focal Points</em>
                    </h2>
                    <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">2 active</span>
                  </div>

                  <button
                    onClick={() => router.push('/kanban')}
                    className="text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all board</span>
                    <ArrowUpRightIcon size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {initialLineUp.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedTask({
                          id: item.id,
                          taskId: item.taskId,
                          title: item.title,
                          priority: 'High',
                          due: 'Today 5pm',
                          assigneeName: fullName || 'Team Lead',
                          assigneeColor: item.color,
                          tags: ['Design', item.category],
                          description: 'Active sprint focal point deliverable with live timer sync.'
                        })
                      }}
                      className={`p-5 rounded-2xl border ${item.border} ${item.bg} hover:shadow-xs transition-all cursor-pointer group`}
                    >
                      <div className="flex items-start justify-between mb-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                          {item.category}
                        </span>
                        <span className="text-2xl font-extrabold text-stone-900 stat-number">
                          {item.pct}%
                        </span>
                      </div>

                      <div className="text-sm font-bold text-stone-900 group-hover:text-stone-700 leading-snug mb-3.5">
                        {item.title}
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500 pt-2.5 border-t border-stone-900/5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <ClockIcon size={13} className="text-stone-400" />
                          <span className="stat-number font-mono">{item.timeSpent}</span>
                        </div>

                        <div className="flex -space-x-1.5 overflow-hidden">
                          {item.assignees.map((a, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full ring-1 ring-white text-[10px] font-bold text-white flex items-center justify-center"
                              style={{ backgroundColor: a.color }}
                            >
                              {a.name[0]}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Projects Strip */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-2xl font-normal text-stone-950 font-serif tracking-tight">
                      Trending <em className="italic font-serif font-normal text-stone-800">Initiatives</em>
                    </h3>
                    <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">3 total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">Dribbble</div>
                    <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">Banking App Animation</div>
                    <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">12%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">Behance</div>
                    <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">AI chat app case study</div>
                    <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">36%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">Design Internal</div>
                    <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">Logotype & Token Specs</div>
                    <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">98%</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Working Activity Timeline Schedule */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                    Working <em className="italic font-serif font-normal text-stone-800">Activity</em>
                  </h2>
                  <span className="text-[11px] font-bold text-stone-500 font-mono bg-stone-100 px-2.5 py-0.5 rounded-md">
                    July 24 – 28
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mb-6 font-medium">Sprint hours logged across active days</p>

                {/* Day Labels */}
                <div className="grid grid-cols-5 text-center text-xs font-bold text-stone-600 mb-3">
                  <div>Wed<span className="block text-stone-400 stat-number text-[11px] mt-0.5">24</span></div>
                  <div>Thu<span className="block text-stone-400 stat-number text-[11px] mt-0.5">25</span></div>
                  <div className="text-stone-900">Fri<span className="block text-rose-600 font-bold stat-number text-[11px] mt-0.5">26</span></div>
                  <div>Sat<span className="block text-stone-400 stat-number text-[11px] mt-0.5">27</span></div>
                  <div>Sun<span className="block text-stone-400 stat-number text-[11px] mt-0.5">28</span></div>
                </div>

                {/* Multi-Colored Vertical Time Blocks */}
                <div className="grid grid-cols-5 gap-2.5 h-44 items-end relative py-2 border-b border-stone-100">
                  <div className="flex flex-col gap-1.5 h-full justify-end">
                    <div className="w-full h-8 bg-rose-200 rounded-lg" />
                    <div className="w-full h-14 bg-orange-400 rounded-lg" />
                  </div>

                  <div className="flex flex-col gap-1.5 h-full justify-end">
                    <div className="w-full h-12 bg-lime-400 rounded-lg" />
                    <div className="w-full h-16 bg-orange-500 rounded-lg" />
                  </div>

                  <div
                    className="flex flex-col gap-1.5 h-full justify-end relative cursor-pointer group"
                    onMouseEnter={() => setHoveredBar('fri')}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === 'fri' && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111318] text-white text-xs font-mono px-3 py-1 rounded-xl shadow-lg whitespace-nowrap z-20">
                        10:59:16 Banking App
                      </div>
                    )}
                    <div className="w-full h-6 bg-pink-400 rounded-lg" />
                    <div className="w-full h-16 striped-bar-orange rounded-lg shadow-xs ring-2 ring-stone-900" />
                    <div className="w-full h-8 bg-lime-300 rounded-lg" />
                  </div>

                  <div className="flex flex-col gap-1.5 h-full justify-end">
                    <div className="w-full h-10 bg-lime-400 rounded-lg" />
                    <div className="w-full h-6 bg-violet-300 rounded-lg" />
                  </div>

                  <div className="flex flex-col gap-1.5 h-full justify-end">
                    <div className="w-full h-8 bg-pink-300 rounded-lg" />
                    <div className="w-full h-14 bg-orange-400 rounded-lg" />
                    <div className="w-full h-6 bg-lime-400 rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 text-xs sm:text-sm font-semibold text-stone-600">
                <span>Total sprint logged:</span>
                <span className="text-stone-950 font-bold stat-number text-base sm:text-lg">24.5 hours</span>
              </div>
            </div>

          </div>

          {/* ── 3. "My Work" Interactive Filter Table ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs mb-10">

            {/* Header & Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                  My <em className="italic font-serif font-normal text-stone-800">Work</em> & Deliverables
                </h2>
                <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">({filteredWork.length})</span>
              </div>


              {/* Segmented Control Pills */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
                <button
                  onClick={() => setWorkTab('todo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${workTab === 'todo'
                    ? 'bg-[#111318] text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                  To do ({myWork.filter(w => w.tab === 'todo').length})
                </button>
                <button
                  onClick={() => setWorkTab('done')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${workTab === 'done'
                    ? 'bg-[#111318] text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                  Done ({myWork.filter(w => w.tab === 'done').length})
                </button>
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-2">
              {filteredWork.map(task => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/70 hover:bg-stone-100/80 border border-stone-200/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={(e) => toggleTaskDone(e, task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${task.tab === 'done'
                        ? 'bg-lime-500 border-lime-600 text-white'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                        }`}
                    >
                      {task.tab === 'done' && <CheckIcon size={12} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <div className="text-[10px] text-stone-400 font-mono tracking-tight">
                        {task.path}
                      </div>
                      <div className={`text-xs font-bold text-stone-900 group-hover:text-stone-700 truncate ${task.tab === 'done' ? 'line-through text-stone-400' : ''
                        }`}>
                        {task.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Subtask Ratio */}
                    <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">
                      <span>✓</span>
                      <span className="stat-number">{task.subtasksCompleted}/{task.subtasksTotal}</span>
                    </div>

                    {/* Assignee Avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {task.assignees.map((a, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full ring-1 ring-white text-[9px] font-bold text-white flex items-center justify-center"
                          style={{ backgroundColor: a.color }}
                        >
                          {a.initials}
                        </div>
                      ))}
                    </div>

                    {/* Due Date */}
                    <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                      {task.due}
                    </span>

                    <button className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                      <MoreHorizontalIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

            </>
          )}

        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(newTask) => {
          setMyWork(prev => [
            {
              id: newTask.id,
              taskId: newTask.taskId,
              path: 'Internal / Tasks',
              title: newTask.title,
              subtasksCompleted: 0,
              subtasksTotal: 2,
              due: newTask.due,
              tab: 'todo',
              priority: newTask.priority,
              assignees: [{ initials: newTask.assignee, color: newTask.assigneeColor }],
              description: newTask.description,
              subtasks: newTask.subtasks
            },
            ...prev
          ])
          toast.success('Task created successfully!')
        }}
      />

      {/* Task Inspection Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={(updated) => {
          setMyWork(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t))
        }}
        onDeleteTask={(id) => {
          setMyWork(prev => prev.filter(t => t.id !== id))
        }}
      />
    </ProtectedRoute>
  )
}