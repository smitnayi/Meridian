"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  TrendingUpIcon, CheckIcon, ZapIcon,
  DownloadIcon, MoreHorizontalIcon,
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

// --- Sample Analytics Data ---
const weeklyData = [
  { week: 'W28', completed: 67, added: 48 },
  { week: 'W29', completed: 74, added: 61 },
  { week: 'W30', completed: 89, added: 55 },
  { week: 'W31', completed: 71, added: 72 },
  { week: 'W32', completed: 94, added: 49 },
  { week: 'W33', completed: 82, added: 58 },
  { week: 'W34', completed: 78, added: 63 },
  { week: 'W35', completed: 103, added: 44 },
]

const maxVal = 120

const projectDist = [
  { name: 'Auth Service', value: 34, color: '#6366f1' },
  { name: 'Payment Gateway', value: 22, color: '#10b981' },
  { name: 'Customer Portal', value: 18, color: '#f59e0b' },
  { name: 'Mobile App v2', value: 15, color: '#ef4444' },
  { name: 'Analytics Dashboard', value: 11, color: '#8b5cf6' },
]

const members = [
  { name: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', tasks: 32, completed: 28, rate: 87 },
  { name: 'Sarah Chen', initials: 'SC', color: '#6366f1', tasks: 29, completed: 24, rate: 82 },
  { name: 'Marcus Webb', initials: 'MW', color: '#10b981', tasks: 24, completed: 21, rate: 87 },
  { name: 'Priya Nair', initials: 'PN', color: '#f59e0b', tasks: 22, completed: 17, rate: 77 },
  { name: 'Kai Okafor', initials: 'KO', color: '#ef4444', tasks: 19, completed: 14, rate: 73 },
]

// Matching glassmorphic card style from your Dashboard
const Card = ({ children, className = '' }) => (
  <div className={`rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] transition-transform hover:-translate-y-0.5 ${className}`}>
    {children}
  </div>
)

// --- Helper SVG Charts ---
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = 60
  const cx = 80
  const cy = 80
  const circumference = 2 * Math.PI * r

  const slices = data.map((d, i) => {
    const prevTotal = data.slice(0, i).reduce((sum, item) => sum + item.value, 0)
    const runningOffset = total > 0 ? (prevTotal / total) * circumference : 0
    const dasharray = total > 0 ? (d.value / total) * circumference : 0
    const dashoffset = circumference - runningOffset
    return { ...d, dasharray, dashoffset }
  })

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeOpacity={0.5} strokeWidth={22} />
      {slices.map((d, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={d.color}
          strokeWidth={22}
          strokeDasharray={`${d.dasharray} ${circumference - d.dasharray}`}
          strokeDashoffset={d.dashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out origin-center -rotate-90"
        />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" className="text-xl font-bold fill-slate-900 font-sans">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="text-[10px] fill-slate-400 font-medium font-sans">
        tasks total
      </text>
    </svg>
  )
}

function AreaChart() {
  const w = 560
  const h = 140
  const pad = { top: 10, right: 10, bottom: 28, left: 32 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom
  const xStep = chartW / (weeklyData.length - 1)

  const toX = (i) => pad.left + i * xStep
  const toY = (v) => pad.top + chartH - (v / maxVal) * chartH

  const completedPath = weeklyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.completed)}`).join(' ')
  const addedPath = weeklyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.added)}`).join(' ')

  const completedArea = completedPath + ` L ${toX(weeklyData.length - 1)} ${pad.top + chartH} L ${pad.left} ${pad.top + chartH} Z`
  const addedArea = addedPath + ` L ${toX(weeklyData.length - 1)} ${pad.top + chartH} L ${pad.left} ${pad.top + chartH} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="gradAdded" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = pad.top + chartH * frac
        return (
          <g key={frac}>
            <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} stroke="#e2e8f0" strokeOpacity={0.6} strokeWidth="1" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
              {Math.round(maxVal * (1 - frac))}
            </text>
          </g>
        )
      })}

      <path d={addedArea} fill="url(#gradAdded)" />
      <path d={completedArea} fill="url(#gradCompleted)" />
      <path d={addedPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={completedPath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {weeklyData.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.completed)} r="3.5" fill="#6366f1" />
          <circle cx={toX(i)} cy={toY(d.added)} r="3" fill="#10b981" />
          <text x={toX(i)} y={h - 4} textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
            {d.week}
          </text>
        </g>
      ))}
    </svg>
  )
}

// --- Main Analytics Component ---
export default function Analytics() {
  const [range, setRange] = useState('8 Weeks')

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        {/* 1. Sidebar Component */}
        <Sidebar />

        {/* 2. Main Analytics Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col items-stretch justify-between gap-3 mb-7 sm:flex-row sm:items-start sm:gap-3">
          <div>
            <div className="text-[21px] sm:text-[26px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Analytics & Insights
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Team throughput, performance metrics, and task velocity
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Range Selector */}
            <div className="flex p-1 bg-white/80 border border-slate-200/80 rounded-xl shadow-xs">
              {['4 Weeks', '8 Weeks', '3 Months'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    range === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={() => toast.success('Analytics report exported!')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-[13.5px] font-medium text-slate-600 hover:bg-white transition-colors cursor-pointer"
            >
              <DownloadIcon size={15} />
              Export
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Completion Rate', value: '78.4%', delta: '↑ 6.2% vs last period', color: '#6366f1', bg: '#eef2ff', icon: <CheckIcon size={20} /> },
            { label: 'Avg Sprint Velocity', value: '88 pts', delta: '↑ 12 pts vs baseline', color: '#10b981', bg: '#d1fae5', icon: <TrendingUpIcon size={20} /> },
            { label: 'Tasks / Day (avg)', value: '11.4', delta: 'Best: 14.7 on Wed', color: '#f59e0b', bg: '#fef3c7', icon: <ZapIcon size={20} /> },
          ].map((s) => (
            <Card key={s.label} className="p-5">
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
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-5">
          {/* Main Area Chart Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2.5 mb-6">
              <div>
                <div className="text-[15px] font-semibold text-slate-900">Task Throughput</div>
                <div className="text-[12.5px] text-slate-400 mt-0.5">Completed vs added tasks per week</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>Added</span>
                </div>
              </div>
            </div>
            <AreaChart />
          </Card>

          {/* Distribution Donut Card */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900 mb-2">Task Distribution</div>
              <div className="flex justify-center my-2">
                <DonutChart data={projectDist} />
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {projectDist.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 flex-1 truncate">{d.name}</span>
                  <span className="text-slate-400 font-mono font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Performance Section */}
        <Card className="p-0! overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/60">
            <div className="text-[15px] font-semibold text-slate-900">Team Performance</div>
            <div className="text-[12.5px] text-slate-400 mt-0.5">Individual completion rates & task volume</div>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((m) => (
              <div
                key={m.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-4 hover:bg-indigo-50/20 transition-colors"
              >
                {/* Member Info */}
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{m.name}</h3>
                    <p className="text-xs text-slate-400">{m.completed} of {m.tasks} tasks completed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-4 flex-1 max-w-xs">
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400">Completion</span>
                      <span
                        className={`font-mono font-semibold ${
                          m.rate >= 85 ? 'text-emerald-600' : m.rate >= 75 ? 'text-amber-600' : 'text-rose-600'
                        }`}
                      >
                        {m.rate}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.rate >= 85 ? 'bg-emerald-500' : m.rate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${m.rate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full text-center ${
                      m.rate >= 85
                        ? 'bg-emerald-50 text-emerald-600'
                        : m.rate >= 75
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {m.rate >= 85 ? 'Excellent' : m.rate >= 75 ? 'Good' : 'Below avg'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  )
}