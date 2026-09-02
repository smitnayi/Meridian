"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal from '@/components/CreateTaskModal'
import { useOrg } from '@/context/OrgContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  BuildingIcon, UsersIcon, ShieldIcon, CopyIcon, CheckIcon,
  SendIcon, PlusIcon, SparklesIcon, CheckCircleIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

export default function OrganizationPage() {
  const { activeOrg, openCreateModal, openJoinModal } = useOrg()
  const { fullName, initials } = useCurrentUser()
  const [modalOpen, setModalOpen] = useState(false)

  // Invite by email form
  const [inviteEmail, setInviteEmail] = useState('')
  const [sendingInvite, setSendingInvite] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleSendEmailInvite = (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setSendingInvite(true)
    setTimeout(() => {
      setSendingInvite(false)
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
    }, 600)
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard?.writeText(activeOrg?.code || '123456')
    setCopiedCode(true)
    toast.success('Invite code copied to clipboard!')
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const membersList = activeOrg?.members || [
    { id: 'm1', name: fullName || 'Nitya Gandhi', role: 'Owner / Leader', email: 'nitya@meridian.io', avatarColor: '#8b5cf6', initials: initials || 'NG' },
    { id: 'm2', name: 'Rahul Patel', role: 'Member', email: 'rahul@meridian.io', avatarColor: '#6366f1', initials: 'RP' },
    { id: 'm3', name: 'Priya Shah', role: 'Member', email: 'priya@meridian.io', avatarColor: '#10b981', initials: 'PS' },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Workspace Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => setModalOpen(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
                  Organization <em className="italic font-serif font-normal text-stone-900">Workspace</em>
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-200 text-lime-900 font-mono shadow-2xs">
                  {activeOrg?.role || 'Owner / Leader'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5">
                Overview, team roster, role permissions, and invitation management
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 rounded-2xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                + New Org
              </button>
              <button
                type="button"
                onClick={openJoinModal}
                className="px-4 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Join Org
              </button>
            </div>
          </div>

          {/* ── 1. Overview Section ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#111318] text-lime-400 flex items-center justify-center shadow-md">
                  <BuildingIcon size={22} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight">
                    {activeOrg?.name || 'Meridian Technologies'}
                  </h2>
                  <div className="text-xs text-stone-500 font-medium">
                    Company: <strong className="text-stone-800">{activeOrg?.companyName || 'Meridian Tech Inc.'}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">Your Role</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#111318] text-lime-400 shadow-2xs mt-0.5">
                  {activeOrg?.role || 'Owner / Leader'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Workspace Description</h3>
                <p className="text-sm text-stone-700 font-medium leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60">
                  {activeOrg?.description || 'Primary product development workspace for Meridian SaaS. Central hub for engineering, product design, and executive sprint planning.'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Workspace Metadata</h3>
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60 space-y-2 text-xs font-medium">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Total Members:</span>
                    <strong className="text-stone-950 font-bold">{membersList.length} members</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Invite Code:</span>
                    <strong className="font-mono text-stone-950 font-bold">{activeOrg?.code || '123456'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Plan Tier:</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-lime-200 text-lime-900 rounded-full">ENTERPRISE PRO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Members Section ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight">
                  Organization <em className="italic font-serif font-normal text-stone-800">Members</em>
                </h2>
                <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2.5 py-0.5 rounded-md">
                  {membersList.length} Total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {membersList.map(member => (
                <div
                  key={member.id || member.email}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-2xs flex items-center justify-between hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: member.avatarColor || '#8b5cf6' }}
                    >
                      {member.initials}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-stone-900 leading-snug">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono shrink-0 ${
                      member.role?.includes('Owner') || member.role?.includes('Leader')
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. Invite Members Section ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs mb-10">
            <div className="mb-6 pb-4 border-b border-stone-100">
              <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight">
                Invite <em className="italic font-serif font-normal text-stone-800">Members</em>
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Expand your workspace by sending email invites or sharing your 6-digit organization code
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Option A: Invite by Email */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#111318] text-lime-400 flex items-center justify-center">
                      <SendIcon size={14} />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">Invite by Email</h3>
                  </div>

                  <p className="text-xs text-stone-500 font-medium mb-4">
                    Send a direct email invitation with workspace access link.
                  </p>

                  <form onSubmit={handleSendEmailInvite} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="teammate@company.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-medium bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sendingInvite}
                      className="w-full py-2.5 rounded-xl bg-[#111318] hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {sendingInvite ? 'Sending...' : 'Send Invitation'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Option B: Invite by Code */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#111318] text-lime-400 flex items-center justify-center">
                      <CopyIcon size={14} />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">Invite by Code</h3>
                  </div>

                  <p className="text-xs text-stone-500 font-medium mb-4">
                    Share your static 6-digit organization code for instant onboarding verification.
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 mb-4">
                    <div className="text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Invite Code</div>
                    <div className="font-mono text-3xl font-black text-stone-900 tracking-widest">
                      {activeOrg?.code || '123456'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyInviteCode}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <CheckIcon size={14} className="text-emerald-600" strokeWidth={3} />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={14} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={() => toast.success('Task created!')}
      />
    </ProtectedRoute>
  )
}
