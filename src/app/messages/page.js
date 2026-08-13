"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import {
  HashIcon, SearchIcon, PlusIcon, SmileIcon, AttachIcon, SendIcon, MoreHorizontalIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const channels = [
  { id: 'general', name: 'general', unread: 3, pinned: true },
  { id: 'engineering', name: 'engineering', unread: 0 },
  { id: 'design', name: 'design', unread: 1 },
  { id: 'product', name: 'product', unread: 7 },
  { id: 'releases', name: 'releases', unread: 0 },
  { id: 'random', name: 'random', unread: 0 },
]

const initialMessages = {
  general: [
    { id: 'm1', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '9:02 AM', text: 'Morning everyone 👋 Quick reminder that Sprint 14 review is this Friday at 3pm. Please make sure your tasks are updated in the board before then.' },
    { id: 'm2', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '9:08 AM', text: "On it! OAuth2 integration is almost wrapped up. Just finishing the GitHub provider — should be done by EOD today.", reactions: [{ emoji: '🔥', count: 4 }, { emoji: '👏', count: 2 }] },
    { id: 'm3', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '9:15 AM', text: 'Stripe webhook handlers are deployed to staging. Need someone from QA to run through the payment flows. @Nadia can you pick this up today?' },
    { id: 'm4', author: 'Nadia Kowalski', initials: 'NK', color: '#ec4899', time: '9:17 AM', text: "Sure! I'll get to it after standup. Should have a report ready by 2pm 🎯", reactions: [{ emoji: '✅', count: 1 }] },
    { id: 'm5', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '9:31 AM', text: 'Just pushed the updated design specs for the Customer Portal dashboard to Figma. Would love some feedback before I start handoff. Link in #design.' },
    { id: 'm6', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '9:44 AM', text: 'Heads up — deployed a fix for the auth service memory leak we spotted yesterday. Monitor is green ✅. Tagging this for the post-mortem doc.' },
    { id: 'm7', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '10:03 AM', text: 'The new landing page is live on staging! Can everyone take a quick look? Performance scores are looking really solid — 97 on Lighthouse 🚀', reactions: [{ emoji: '🚀', count: 6 }, { emoji: '❤️', count: 3 }] },
    { id: 'm8', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '10:11 AM', text: "Fantastic work Jordan. That's a big jump from where we were last week. Let's use this as the benchmark going forward." },
  ],
}

const onlineUsers = [
  { initials: 'AJ', color: '#8b5cf6', name: 'Alex Johnson' },
  { initials: 'SC', color: '#6366f1', name: 'Sarah Chen' },
  { initials: 'MW', color: '#10b981', name: 'Marcus Webb' },
  { initials: 'JL', color: '#0ea5e9', name: 'Jordan Lee' },
  { initials: 'TR', color: '#f97316', name: 'Tomás Rivera' },
]

export default function Messages() {
  const [activeChannel, setActiveChannel] = useState('general')
  const [draft, setDraft] = useState('')
  const [msgs, setMsgs] = useState(initialMessages)
  const [mobileView, setMobileView] = useState('channels')

  const send = () => {
    if (!draft.trim()) return
    const newMsg = {
      id: `m${Date.now()}`,
      author: 'Alex Johnson',
      initials: 'AJ',
      color: '#8b5cf6',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      text: draft.trim(),
    }
    setMsgs(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }))
    setDraft('')
  }

  const selectChannel = (id) => {
    setActiveChannel(id)
    setMobileView('chat')
  }

  const channelMsgs = msgs[activeChannel] || []

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Messages Main Workspace Container */}
      <main className="flex-1 min-w-0 flex h-full overflow-hidden bg-slate-50/50">

        {/* Channel list panel */}
        <div
          className={`w-[240px] shrink-0 flex flex-col bg-white/70 backdrop-blur-xl border-r border-slate-200/60 py-6 ${
            mobileView === 'channels' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Header & Search */}
          <div className="px-4 mb-4">
            <div className="text-base font-bold text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Messages
            </div>
            <div className="flex items-center gap-2 bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200/60">
              <SearchIcon size={14} className="text-slate-400" />
              <input
                placeholder="Search messages..."
                className="border-none bg-transparent text-xs outline-none w-full text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Channels Section */}
          <div className="px-2 flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 px-2 py-1 tracking-wider uppercase mb-1">
              Channels
            </div>

            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => selectChannel(ch.id)}
                className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-xl border-none text-xs font-medium cursor-pointer transition-colors ${
                  activeChannel === ch.id
                    ? 'bg-indigo-500/10 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-indigo-500/5 hover:text-slate-900'
                }`}
              >
                <HashIcon size={14} />
                <span className="flex-1 text-left truncate">{ch.name}</span>
                {ch.unread > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => toast.info('Add Channel modal opened')}
              className="flex items-center gap-2 w-full px-2.5 py-2 border-none bg-transparent text-slate-400 hover:text-indigo-600 text-xs font-medium cursor-pointer transition-colors mt-1"
            >
              <PlusIcon size={14} /> Add channel
            </button>
          </div>

          {/* Online Members Footer */}
          <div className="mt-auto px-4 pt-3 border-t border-slate-200/60">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              Online Now
            </div>
            <div className="flex flex-col gap-2">
              {onlineUsers.map(u => (
                <div key={u.name} className="flex items-center gap-2.5">
                  <div className="relative">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: u.color }}
                    >
                      {u.initials}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium truncate">{u.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Thread view */}
        <div
          className={`flex-1 flex flex-col min-w-0 bg-white/40 ${
            mobileView === 'chat' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Thread Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('channels')}
                className="md:hidden w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 mr-1"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
              </button>

              <HashIcon size={20} className="text-slate-700" />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {activeChannel}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {onlineUsers.length} members online · {channelMsgs.length} messages today
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success(`Pinned #${activeChannel}`)}
                className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Pin
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white text-slate-600 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                <MoreHorizontalIcon size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1">
            {channelMsgs.map((msg, i) => {
              const isFirst = i === 0 || channelMsgs[i - 1].author !== msg.author
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 px-2 py-1 rounded-xl hover:bg-slate-100/50 transition-colors items-start ${
                    isFirst && i > 0 ? 'mt-3' : ''
                  }`}
                >
                  {isFirst ? (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                      style={{ background: msg.color }}
                    >
                      {msg.initials}
                    </div>
                  ) : (
                    <div className="w-9 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {isFirst && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-900">{msg.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                      </div>
                    )}

                    <div className="text-xs text-slate-700 leading-relaxed">{msg.text}</div>

                    {msg.reactions && (
                      <div className="flex gap-1.5 mt-1.5">
                        {msg.reactions.map(r => (
                          <button
                            key={r.emoji}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs cursor-pointer hover:bg-indigo-100 transition-colors"
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[10px] text-indigo-600 font-bold">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            <div className="flex gap-3 px-2 py-2 items-center">
              <div className="w-9 shrink-0" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(d => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
                      style={{ animationDelay: `${d * 200}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">Marcus is typing...</span>
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-200/60 bg-white/60 backdrop-blur-md">
            <div className="bg-white rounded-2xl p-2.5 pl-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder={`Message #${activeChannel}`}
                className="flex-1 border-none bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors">
                  <AttachIcon size={16} />
                </button>
                <button className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors">
                  <SmileIcon size={16} />
                </button>
                <button
                  onClick={send}
                  disabled={!draft.trim()}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none ${
                    draft.trim()
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <SendIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}