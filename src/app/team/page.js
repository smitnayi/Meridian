"use client"

import { useState } from 'react'
import Sidebar from '../../components/sidebar' // or '../components/Sidebar'
import { PlusIcon, SearchIcon, MoreHorizontalIcon } from '../../components/Icons'
import { toast } from 'react-hot-toast'
import InviteModal from '../../components/InviteModal'

const MailIcon2 = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)

const initialMembers = [
  { name: 'Alex Johnson', role: 'Engineering Lead', email: 'alex@meridian.io', initials: 'AJ', color: '#8b5cf6', status: 'online', projects: 8, tasks: 32, joined: 'Jan 2024' },
  { name: 'Sarah Chen', role: 'Senior Full-Stack', email: 'sarah@meridian.io', initials: 'SC', color: '#6366f1', status: 'online', projects: 6, tasks: 29, joined: 'Mar 2024' },
  { name: 'Marcus Webb', role: 'Backend Engineer', email: 'marcus@meridian.io', initials: 'MW', color: '#10b981', status: 'online', projects: 5, tasks: 24, joined: 'Feb 2024' },
  { name: 'Priya Nair', role: 'Product Designer', email: 'priya@meridian.io', initials: 'PN', color: '#f59e0b', status: 'away', projects: 7, tasks: 22, joined: 'Apr 2024' },
  { name: 'Kai Okafor', role: 'DevOps Engineer', email: 'kai@meridian.io', initials: 'KO', color: '#ef4444', status: 'offline', projects: 4, tasks: 19, joined: 'May 2024' },
  { name: 'Jordan Lee', role: 'Frontend Engineer', email: 'jordan@meridian.io', initials: 'JL', color: '#0ea5e9', status: 'online', projects: 5, tasks: 21, joined: 'Jun 2024' },
  { name: 'Nadia Kowalski', role: 'QA Engineer', email: 'nadia@meridian.io', initials: 'NK', color: '#ec4899', status: 'away', projects: 6, tasks: 18, joined: 'Jul 2024' },
  { name: 'Tomás Rivera', role: 'Mobile Engineer', email: 'tomas@meridian.io', initials: 'TR', color: '#f97316', status: 'online', projects: 3, tasks: 15, joined: 'Jul 2024' },
]

const statusConfig = {
  online:  { color: '#10b981', label: 'Online' },
  away:    { color: '#f59e0b', label: 'Away' },
  offline: { color: '#94a3b8', label: 'Offline' },
}

export default function Team({ navigate, currentPage = 'team' }) {
  const [members, setMembers] = useState(initialMembers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [inviteOpen, setInviteOpen] = useState(false)

  const filtered = members.filter(m =>
    (filter === 'All' || m.status === filter.toLowerCase()) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
  )

  const handleInvite = (member) => {
    setMembers(prev => [...prev, { ...member, projects: 0, tasks: 0, joined: member.joined }])
    toast.success(`Invitation sent to ${member.name}! They've been added to your team.`)
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      {/* 1. Sidebar Component */}
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onNotificationClick={() => toast.info('Notifications clicked')}
        onProfileClick={() => toast.info('Profile clicked')}
        onCommandPalette={() => toast.info('Command Palette opened')}
      />

      {/* 2. Main Team Content Area */}
      <main className="flex-1 min-w-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col items-stretch justify-between gap-3 mb-5 sm:mb-7 sm:flex-row sm:items-start">
          <div>
            <div className="text-xl sm:text-[26px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Team
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              {members.length} members across 5 time zones
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 sm:px-[18px] py-2.5 rounded-xl border-none bg-gradient-to-br from-indigo-500 to-indigo-400 text-[13px] sm:text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_18px_rgba(99,102,241,0.45)] transition-shadow cursor-pointer"
          >
            <PlusIcon size={15} strokeWidth={2.5} />
            Invite Member
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-6">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 flex-1 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm">
            <SearchIcon size={16} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="border-none bg-transparent text-xs sm:text-sm text-slate-900 outline-none w-full placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex p-1 bg-white/80 border border-slate-200/80 rounded-xl shadow-sm overflow-x-auto self-start sm:self-auto">
            {['All', 'Online', 'Away', 'Offline'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border-none whitespace-nowrap ${
                  filter === f
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(m => {
            const sc = statusConfig[m.status]
            const workload = m.tasks > 28 ? 'High' : m.tasks > 20 ? 'Med' : 'Low'

            return (
              <div
                key={m.email}
                className="rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-4 sm:p-5 transition-transform hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar & Card Action Buttons */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div
                        className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-2xl flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${m.color}, ${m.color}99)`,
                          boxShadow: `0 4px 12px ${m.color}35`,
                        }}
                      >
                        {m.initials}
                      </div>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: sc.color }}
                      />
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toast.info(`Email sent to ${m.email}`)}
                        className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white/80 flex items-center justify-center cursor-pointer text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        <MailIcon2 size={14} />
                      </button>
                      <button
                        onClick={() => toast.info(`Profile options for ${m.name}`)}
                        className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white/80 flex items-center justify-center cursor-pointer text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        <MoreHorizontalIcon size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="mb-3.5">
                    <div className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {m.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{m.role}</div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5 truncate">{m.email}</div>
                  </div>

                  {/* Status & Joined Badge */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                      className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: `${sc.color}18`, color: sc.color }}
                    >
                      {sc.label}
                    </span>
                    <span className="text-[11px] text-slate-400">Joined {m.joined}</span>
                  </div>
                </div>

                {/* Bottom Stats Breakdown */}
                <div className="grid grid-cols-3 gap-1 pt-3.5 border-t border-slate-200/50">
                  <div className="text-center border-r border-slate-200/50 pr-1">
                    <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {m.projects}
                    </div>
                    <div className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5">Projects</div>
                  </div>
                  <div className="text-center border-r border-slate-200/50 px-1">
                    <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {m.tasks}
                    </div>
                    <div className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5">Tasks</div>
                  </div>
                  <div className="text-center pl-1">
                    <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {workload}
                    </div>
                    <div className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5">Workload</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Invite Modal */}
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />
    </div>
  )
}