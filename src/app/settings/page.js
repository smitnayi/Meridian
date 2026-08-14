"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import {
  UsersIcon, SettingsIcon, CreditCardIcon, MessageIcon,
  CheckIcon, ZapIcon, ShieldIcon, BellIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'My Profile', icon: <UsersIcon size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon size={16} /> },
  { id: 'security', label: 'Security & 2FA', icon: <ShieldIcon size={16} /> },
  { id: 'workspace', label: 'Workspace', icon: <ZapIcon size={16} /> },
]

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Johnson')
  const [email, setEmail] = useState(user?.email || 'alex.johnson@meridian.io')
  const [title, setTitle] = useState('Lead Product Engineer')
  const [avatarInitials, setAvatarInitials] = useState('AJ')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [slackNotifs, setSlackNotifs] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [language, setLanguage] = useState('English (US)')
  const [timezone, setTimezone] = useState('PST (UTC-8)')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setAvatarInitials(`${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'AJ')
    toast.success('Account settings saved successfully!')
  }

  const handleUploadPhoto = () => {
    toast.success('Avatar updated to latest snapshot!')
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#f4f6fb] text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Settings Layout */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Account & Workspace Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage your personal credentials, security keys, notification preferences, and team defaults
            </p>
          </div>

          {/* Settings Container: Tab Rail + Active Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Tabs Navigation (3 cols on desktop, horizontal bar on mobile) */}
            <div className="lg:col-span-3 bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200/80 shadow-xs">
              <div className="flex lg:flex-col gap-1 overflow-x-auto">
                {tabs.map(t => {
                  const isActive = activeTab === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Settings Body (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* ── 1. Profile Tab ── */}
              {activeTab === 'profile' && (
                <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                  <div className="pb-4 border-b border-slate-100 mb-6">
                    <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Profile Information
                    </h2>
                    <p className="text-xs text-slate-400">Update your avatar, full name, and workspace contact details</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Avatar Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                        {avatarInitials}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900 mb-0.5">Profile Photo</div>
                        <div className="text-[11px] text-slate-400 mb-2.5">JPG, GIF or PNG. Max file size 2MB.</div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleUploadPhoto}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs"
                          >
                            Upload New Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.info('Default avatar selected')}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── 2. Notifications Tab ── */}
              {activeTab === 'notifications' && (
                <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-slate-400">Choose what updates you want to receive and where</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Email Digest Notifications</div>
                        <div className="text-[11px] text-slate-500">Receive daily sprint updates, review requests, and task assignments</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailNotifs(p => !p)
                          toast.success(`Email notifications ${!emailNotifs ? 'enabled' : 'disabled'}`)
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          emailNotifs ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          emailNotifs ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Slack & Real-time Webhook Alerts</div>
                        <div className="text-[11px] text-slate-500">Post instant notifications into your company Slack channels</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSlackNotifs(p => !p)
                          toast.success(`Slack alerts ${!slackNotifs ? 'enabled' : 'disabled'}`)
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          slackNotifs ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          slackNotifs ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. Security Tab ── */}
              {activeTab === 'security' && (
                <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Security & Two-Factor Authentication
                    </h2>
                    <p className="text-xs text-slate-400">Keep your account safe with multi-factor authentication and active session management</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-slate-500">Require an authenticator app code (TOTP) when logging in</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactor(p => !p)
                        toast.success(`Two-factor authentication ${!twoFactor ? 'enabled' : 'disabled'}`)
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        twoFactor
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}
                    >
                      {twoFactor ? '✓ 2FA Enabled' : 'Enable 2FA'}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-900 mb-2">Active Sessions</div>
                    <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center">
                          💻
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Chrome on macOS (Current Session)</div>
                          <div className="text-[10px] text-slate-400">San Francisco, US · IP 192.168.1.1</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Active Now
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. Workspace Tab ── */}
              {activeTab === 'workspace' && (
                <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Workspace Localization & Preferences
                    </h2>
                    <p className="text-xs text-slate-400">Configure default timezone, language, and workspace sprint cadence</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Display Language</label>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="English (UK)">English (UK)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="French">French (Français)</option>
                        <option value="German">German (Deutsch)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                      <select
                        value={timezone}
                        onChange={e => setTimezone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
                      >
                        <option value="PST (UTC-8)">PST (Pacific Standard Time, UTC-8)</option>
                        <option value="EST (UTC-5)">EST (Eastern Standard Time, UTC-5)</option>
                        <option value="UTC (UTC+0)">UTC (Coordinated Universal Time)</option>
                        <option value="CET (UTC+1)">CET (Central European Time, UTC+1)</option>
                        <option value="IST (UTC+5:30)">IST (India Standard Time, UTC+5:30)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toast.success('Workspace preferences updated!')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}