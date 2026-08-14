"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import {
  UsersIcon, SettingsIcon, CreditCardIcon, MessageIcon,
  CheckIcon, GridIcon, CalendarIcon, ZapIcon, ShieldIcon,
  BellIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const LogoutIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const MapPinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const skills = [
  'React 19', 'Next.js 16', 'TypeScript', 'Node.js', 'PostgreSQL',
  'Tailwind CSS', 'System Architecture', 'CI/CD Pipelines', 'GraphQL'
]

const recentActivity = [
  { action: 'Merged PR #142', title: 'OAuth2 Authentication Flow with Google & GitHub', time: '2 hours ago', icon: '🚀', tag: 'Auth Service' },
  { action: 'Completed task', title: 'Configure Redis session cache for fast lookup', time: 'Yesterday at 4:15 PM', icon: '✓', tag: 'Backend' },
  { action: 'Reviewed design tokens', title: 'Meridian Design System v2.1 Color Tokens', time: 'Aug 6, 2026', icon: '🎨', tag: 'Customer Portal' },
  { action: 'Deployed release', title: 'Staging release v1.8.4 zero-downtime cluster', time: 'Aug 5, 2026', icon: '📦', tag: 'DevOps' },
]

const assignedProjects = [
  { name: 'Auth Service', role: 'Tech Lead', color: '#6366f1', progress: 82, tasks: '14/18 done' },
  { name: 'Payment Gateway', role: 'Reviewer', color: '#10b981', progress: 61, tasks: '8/12 done' },
  { name: 'Customer Portal', role: 'Contributor', color: '#f59e0b', progress: 45, tasks: '5/11 done' },
]

export default function Profile() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [bio, setBio] = useState('Senior Product Engineer leading core infrastructure & full-stack development across Meridian cloud services.')
  const [isEditingBio, setIsEditingBio] = useState(false)

  const userName = user?.name || 'Alex Johnson'
  const userRole = user?.role || 'Lead Product Engineer'
  const userEmail = user?.email || 'alex.johnson@meridian.io'
  const userInitials = user?.initials || userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    toast.success('Successfully signed out')
    router.push('/')
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#f4f6fb] text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Profile Layout */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/10 mb-6 relative overflow-hidden">
            {/* Background ambient pattern */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute right-32 top-0 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Large Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl">
                    {userInitials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-3 border-indigo-700" title="Active Online" />
                </div>

                {/* Identity Info */}
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {userName}
                    </h1>
                    <span className="rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-0.5 text-xs font-semibold text-white">
                      Pro Member
                    </span>
                  </div>

                  <p className="text-sm text-indigo-100 font-medium mt-1">
                    {userRole} · <span className="font-mono text-xs">{userEmail}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-indigo-200 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon size={14} /> San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon size={14} /> PST (UTC-8)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon size={14} /> Member since Jan 2024
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
                <button
                  onClick={() => router.push('/settings')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold transition-all"
                >
                  <SettingsIcon size={15} /> Edit Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <LogoutIcon size={15} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Performance Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Completed Tasks', value: '142', delta: '+18 this month', color: 'text-indigo-600' },
              { label: 'Active Tasks', value: '24', delta: '4 in review', color: 'text-emerald-600' },
              { label: 'Sprint Velocity', value: '98%', delta: 'Top 5% performer', color: 'text-amber-600' },
              { label: 'Code Reviews', value: '38', delta: '100% on-time', color: 'text-purple-600' },
            ].map((st, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="text-xs font-semibold text-slate-400 mb-1">{st.label}</div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${st.color}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {st.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">{st.delta}</div>
              </div>
            ))}
          </div>

          {/* 2-Column Responsive Body Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Bio, Skills & Connected Accounts (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* About & Bio Card */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    About & Bio
                  </h3>
                  {!isEditingBio ? (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditingBio(false)
                        toast.success('Bio saved')
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Save
                    </button>
                  )}
                </div>

                {!isEditingBio ? (
                  <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
                ) : (
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                    autoFocus
                  />
                )}

                {/* Skills */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Skills & Technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Connected Accounts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                        <GithubIcon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">GitHub</div>
                        <div className="text-[11px] text-slate-400 font-mono">@alex-johnson-dev</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Google Workspace</div>
                        <div className="text-[11px] text-slate-400 font-mono">{userEmail}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Assigned Projects & Recent Activity (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Assigned Projects */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Active Project Involvements
                  </h3>
                  <button
                    onClick={() => router.push('/kanban')}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    View Boards →
                  </button>
                </div>

                <div className="space-y-3">
                  {assignedProjects.map(p => (
                    <div
                      key={p.name}
                      onClick={() => router.push('/kanban')}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {p.role}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">{p.progress}%</span>
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
              </div>

              {/* Recent Activity Timeline */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Recent Work & Contributions
                  </h3>
                  <span className="text-xs text-slate-400">Past 7 days</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm shrink-0">
                        {act.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{act.action}</span>
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                            {act.tag}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 truncate">{act.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}