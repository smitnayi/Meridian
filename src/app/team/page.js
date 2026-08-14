"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  PlusIcon, SearchIcon, MoreHorizontalIcon, UsersIcon,
  MessageIcon, CheckIcon, SettingsIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import InviteModal from '@/components/InviteModal'

const MailIcon2 = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)

const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const initialMembers = [
  { id: 'mem_1', name: 'Alex Johnson', role: 'Engineering Lead', email: 'alex@meridian.io', initials: 'AJ', color: '#8b5cf6', status: 'online', projects: 8, tasks: 32, joined: 'Jan 2024' },
  { id: 'mem_2', name: 'Sarah Chen', role: 'Senior Full-Stack', email: 'sarah@meridian.io', initials: 'SC', color: '#6366f1', status: 'online', projects: 6, tasks: 29, joined: 'Mar 2024' },
  { id: 'mem_3', name: 'Marcus Webb', role: 'Backend Engineer', email: 'marcus@meridian.io', initials: 'MW', color: '#10b981', status: 'online', projects: 5, tasks: 24, joined: 'Feb 2024' },
  { id: 'mem_4', name: 'Priya Nair', role: 'Product Designer', email: 'priya@meridian.io', initials: 'PN', color: '#f59e0b', status: 'away', projects: 7, tasks: 22, joined: 'Apr 2024' },
  { id: 'mem_5', name: 'Kai Okafor', role: 'DevOps Engineer', email: 'kai@meridian.io', initials: 'KO', color: '#ef4444', status: 'offline', projects: 4, tasks: 19, joined: 'May 2024' },
  { id: 'mem_6', name: 'Jordan Lee', role: 'Frontend Engineer', email: 'jordan@meridian.io', initials: 'JL', color: '#0ea5e9', status: 'online', projects: 5, tasks: 21, joined: 'Jun 2024' },
  { id: 'mem_7', name: 'Nadia Kowalski', role: 'QA Engineer', email: 'nadia@meridian.io', initials: 'NK', color: '#ec4899', status: 'away', projects: 6, tasks: 18, joined: 'Jul 2024' },
  { id: 'mem_8', name: 'Tomás Rivera', role: 'Mobile Engineer', email: 'tomas@meridian.io', initials: 'TR', color: '#f97316', status: 'online', projects: 3, tasks: 15, joined: 'Jul 2024' },
]

const statusConfig = {
  online:  { color: '#10b981', label: 'Online' },
  away:    { color: '#f59e0b', label: 'Away' },
  offline: { color: '#94a3b8', label: 'Offline' },
}

/* ── Member Action Menu Modal ── */
function MemberActionModal({ member, onClose, onUpdateRole, onUpdateStatus, onDeleteMember, onMessageMember }) {
  const [editingRole, setEditingRole] = useState(false)
  const [roleInput, setRoleInput] = useState(member.role)
  const sc = statusConfig[member.status] || statusConfig.online

  const handleSaveRole = () => {
    if (roleInput.trim()) {
      onUpdateRole(member.id, roleInput.trim())
      setEditingRole(false)
      toast.success(`Role updated for ${member.name}`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-xs"
              style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}99)` }}
            >
              {member.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{member.name}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{member.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Body Options */}
        <div className="py-4 space-y-3">
          {/* Direct Message Option */}
          <button
            onClick={() => {
              onMessageMember(member)
              onClose()
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <MessageIcon size={15} />
            </div>
            <div>
              <div className="font-bold">Send Direct Message</div>
              <div className="text-[11px] text-slate-400 font-normal">Chat in real-time on #messages</div>
            </div>
          </button>

          {/* Role Editor */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Team Role</span>
              {!editingRole ? (
                <button
                  onClick={() => setEditingRole(true)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Edit Role
                </button>
              ) : (
                <button
                  onClick={handleSaveRole}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Save
                </button>
              )}
            </div>

            {!editingRole ? (
              <div className="text-xs font-semibold text-slate-800">{member.role}</div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Status Switcher */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Presence Status
            </span>
            <div className="flex items-center gap-1.5">
              {['online', 'away', 'offline'].map(st => (
                <button
                  key={st}
                  onClick={() => {
                    onUpdateStatus(member.id, st)
                    toast.success(`${member.name} marked as ${st}`)
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    member.status === st
                      ? 'bg-white border-slate-300 text-slate-900 shadow-xs font-bold'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                    style={{ backgroundColor: statusConfig[st].color }}
                  />
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Remove member */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onDeleteMember(member.id)
              onClose()
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <TrashIcon size={14} />
            <span>Remove from Team</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const router = useRouter()
  const [members, setMembers] = useState(initialMembers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [activeMemberModal, setActiveMemberModal] = useState(null)

  const filtered = members.filter(m =>
    (filter === 'All' || m.status === filter.toLowerCase()) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
  )

  const handleInvite = (member) => {
    const newMember = {
      id: `mem_${Date.now()}`,
      name: member.name,
      role: member.role || 'Contributor',
      email: member.email,
      initials: member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      color: '#6366f1',
      status: 'online',
      projects: 1,
      tasks: 0,
      joined: 'Just now'
    }
    setMembers(prev => [newMember, ...prev])
    toast.success(`Invitation sent to ${member.name}! They've been added to your team.`)
  }

  const handleUpdateRole = (id, newRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m))
    if (activeMemberModal && activeMemberModal.id === id) {
      setActiveMemberModal(prev => ({ ...prev, role: newRole }))
    }
  }

  const handleUpdateStatus = (id, newStatus) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
    if (activeMemberModal && activeMemberModal.id === id) {
      setActiveMemberModal(prev => ({ ...prev, status: newStatus }))
    }
  }

  const handleDeleteMember = (id) => {
    const target = members.find(m => m.id === id)
    setMembers(prev => prev.filter(m => m.id !== id))
    toast.success(`${target ? target.name : 'Member'} removed from workspace`)
  }

  const handleMessageMember = (member) => {
    toast.success(`Opening chat with ${member.name}`)
    router.push('/messages')
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        {/* 1. Sidebar Component */}
        <Sidebar />

        {/* 2. Main Team Content Area */}
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          {/* Header */}
          <div className="flex flex-col items-stretch justify-between gap-3 mb-5 sm:mb-7 sm:flex-row sm:items-start">
            <div>
              <div className="text-xl sm:text-[26px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Team Members
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                {members.length} active contributors across 5 time zones
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
                placeholder="Search members by name, role or email..."
                className="border-none bg-transparent text-xs sm:text-sm text-slate-900 outline-none w-full placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-10">
            {filtered.map(m => {
              const sc = statusConfig[m.status] || statusConfig.online
              const workload = m.tasks > 28 ? 'High' : m.tasks > 20 ? 'Med' : 'Low'

              return (
                <div
                  key={m.id || m.email}
                  className="rounded-[20px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
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
                        {/* Direct Email Button */}
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${m.email}`
                            toast.success(`Opening email to ${m.name}`)
                          }}
                          title={`Email ${m.email}`}
                          className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white/80 flex items-center justify-center cursor-pointer text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                        >
                          <MailIcon2 size={14} />
                        </button>

                        {/* Working More Options (...) Button */}
                        <button
                          onClick={() => setActiveMemberModal(m)}
                          title={`Options for ${m.name}`}
                          className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white/80 flex items-center justify-center cursor-pointer text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
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

        {/* Working Member Actions Modal */}
        {activeMemberModal && (
          <MemberActionModal
            member={activeMemberModal}
            onClose={() => setActiveMemberModal(null)}
            onUpdateRole={handleUpdateRole}
            onUpdateStatus={handleUpdateStatus}
            onDeleteMember={handleDeleteMember}
            onMessageMember={handleMessageMember}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}