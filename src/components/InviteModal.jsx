"use client"

import { useState } from 'react'

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
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#0ea5e9', '#ec4899', '#f97316',
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
      onInvite({
        name: name.trim(),
        email: email.trim(),
        role,
        initials: getInitials(name.trim()),
        color: AVATAR_COLORS[colorIdx],
        status: 'offline',
        joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      })
      setName('')
      setEmail('')
      setRole(ROLES[0])
      setLoading(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-[901] w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Invite Team Member
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Send an invitation to join your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); setNameErr('') }}
              placeholder="e.g. Jordan Lee"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all ${
                nameErr
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
              }`}
            />
            {nameErr && <p className="mt-1 text-xs text-rose-500 font-medium">⚠ {nameErr}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailErr('') }}
              placeholder="colleague@company.com"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all ${
                emailErr
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
              }`}
            />
            {emailErr && <p className="mt-1 text-xs text-rose-500 font-medium">⚠ {emailErr}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-[2] rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all ${
                loading
                  ? 'bg-indigo-400 cursor-wait'
                  : 'bg-indigo-500 shadow-indigo-500/20 hover:bg-indigo-600 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
