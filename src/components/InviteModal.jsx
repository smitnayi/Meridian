"use client"

import React, { useState } from 'react'
import { PlusIcon, UsersIcon, CheckIcon } from './Icons'
import { toast } from 'react-hot-toast'

const ROLES = [
  'Engineering Lead',
  'Senior Full-Stack',
  'Backend Engineer',
  'Frontend Engineer',
  'Product Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Mobile Engineer',
  'Product Manager',
]

const AVATAR_COLORS = [
  '#f43f5e', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#f97316',
]

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

export default function InviteModal({ open, onClose, onInvite }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES[0])
  const [nameErr, setNameErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const validate = () => {
    let valid = true
    if (!name.trim()) { setNameErr('Name is required'); valid = false }
    else setNameErr('')
    if (!email.trim()) { setEmailErr('Email is required'); valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr('Enter a valid email'); valid = false }
    else setEmailErr('')
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const colorIdx = Math.floor(Math.random() * AVATAR_COLORS.length)
      if (onInvite) {
        onInvite({
          name: name.trim(),
          email: email.trim(),
          role,
          initials: getInitials(name.trim()),
          color: AVATAR_COLORS[colorIdx],
          status: 'online',
          projects: 1,
          tasks: 0,
          timeLogged: '00:00:00',
        })
      }
      setLoading(false)
      toast.success(`Invitation sent to ${email.trim()}!`)
      setName('')
      setEmail('')
      setRole(ROLES[0])
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF8F5] p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-xs">
              <UsersIcon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-none" style={{ fontFamily: 'var(--font-didot)' }}>
                Invite Teammate
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Send email invite with workspace permissions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Mya Guzman"
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (nameErr) setNameErr('')
              }}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none"
            />
            {nameErr && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">{nameErr}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. mya@meridian.io"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (emailErr) setEmailErr('')
              }}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none"
            />
            {emailErr && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">{emailErr}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Role / Department</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Quick link */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200/60 flex items-center justify-between text-xs">
            <span className="text-stone-400 font-mono text-[11px] truncate">https://meridian.io/join/ws_pro</span>
            <button
              type="button"
              onClick={() => toast.success('Invite link copied!')}
              className="font-bold text-violet-700 hover:text-violet-900 shrink-0 ml-2"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-stone-200/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusIcon size={14} strokeWidth={2.5} />
            <span>{loading ? 'Sending...' : 'Send Invitation'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
