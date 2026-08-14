"use client"

import { useState, useRef } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  HashIcon, SearchIcon, PlusIcon, SmileIcon, AttachIcon, SendIcon, MoreHorizontalIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const initialChannels = [
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
  engineering: [
    { id: 'me1', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '11:00 AM', text: 'Database indexes have been applied to MySQL production replica.' },
    { id: 'me2', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '11:05 AM', text: 'Great! Latency down by 42% on task queries.' }
  ]
}

const onlineUsers = [
  { initials: 'AJ', color: '#8b5cf6', name: 'Alex Johnson', role: 'Engineering Lead' },
  { initials: 'SC', color: '#6366f1', name: 'Sarah Chen', role: 'Full-Stack' },
  { initials: 'MW', color: '#10b981', name: 'Marcus Webb', role: 'Backend' },
  { initials: 'JL', color: '#0ea5e9', name: 'Jordan Lee', role: 'Frontend' },
  { initials: 'TR', color: '#f97316', name: 'Tomás Rivera', role: 'Mobile' },
]

const quickEmojis = ['👍', '❤️', '🔥', '🚀', '👏', '🎉', '✅', '💡', '👀']

export default function Messages() {
  const [channels, setChannels] = useState(initialChannels)
  const [activeChannel, setActiveChannel] = useState('general')
  const [draft, setDraft] = useState('')
  const [msgs, setMsgs] = useState(initialMessages)
  const [mobileView, setMobileView] = useState('channels')
  const [searchChannel, setSearchChannel] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const [newChannelModal, setNewChannelModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const fileInputRef = useRef(null)

  const send = () => {
    if (!draft.trim() && !attachedFile) return
    const newMsg = {
      id: `m_${Date.now()}`,
      author: 'Alex Johnson',
      initials: 'AJ',
      color: '#8b5cf6',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      text: draft.trim(),
      attachment: attachedFile ? attachedFile.name : null
    }
    setMsgs(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }))
    setDraft('')
    setAttachedFile(null)
    setShowEmojiPicker(false)
  }

  const handleAddEmoji = (emoji) => {
    setDraft(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleCreateChannel = (e) => {
    e.preventDefault()
    if (!newChannelName.trim()) return
    const cleanName = newChannelName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    const newChan = { id: cleanName, name: cleanName, unread: 0 }
    setChannels(prev => [...prev, newChan])
    setActiveChannel(cleanName)
    setNewChannelName('')
    setNewChannelModal(false)
    toast.success(`Created #${cleanName}`)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
      toast.success(`Attached: ${file.name}`)
    }
  }

  const handleReaction = (msgId, emoji) => {
    setMsgs(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(m => {
        if (m.id === msgId) {
          const reactions = m.reactions ? [...m.reactions] : []
          const existing = reactions.find(r => r.emoji === emoji)
          if (existing) {
            existing.count += 1
          } else {
            reactions.push({ emoji, count: 1 })
          }
          return { ...m, reactions }
        }
        return m
      })
    }))
  }

  const channelMsgs = msgs[activeChannel] || []
  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchChannel.toLowerCase()))

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Messages Main Workspace Container */}
        <main className="flex-1 min-w-0 flex h-full overflow-hidden bg-slate-50/50 pt-14 lg:pt-0">
          {/* Channel list panel */}
          <div
            className={`w-[240px] shrink-0 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/60 py-6 ${
              mobileView === 'channels' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Header & Search */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Messages
                </div>
                <button
                  onClick={() => setNewChannelModal(true)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  title="Create Channel"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200/60">
                <SearchIcon size={14} className="text-slate-400" />
                <input
                  value={searchChannel}
                  onChange={e => setSearchChannel(e.target.value)}
                  placeholder="Filter channels..."
                  className="border-none bg-transparent text-xs outline-none w-full text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Channels Section */}
            <div className="px-2 flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 tracking-wider uppercase mb-1">
                Channels
              </div>

              {filteredChannels.map(c => {
                const isActive = activeChannel === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChannel(c.id)
                      setMobileView('chat')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mb-0.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <HashIcon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.unread > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {c.unread}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Direct message online peers */}
            <div className="px-3 pt-3 border-t border-slate-200/60">
              <div className="text-[10px] font-bold text-slate-400 px-1 py-1 tracking-wider uppercase mb-1">
                Active Teammates
              </div>
              <div className="space-y-1">
                {onlineUsers.slice(0, 4).map(u => (
                  <div
                    key={u.name}
                    onClick={() => toast.info(`Direct chat with ${u.name}`)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-xs text-slate-700"
                  >
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: u.color }}>
                        {u.initials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <span className="truncate font-medium">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Chat Main Area */}
          <div
            className={`flex-1 flex flex-col bg-white overflow-hidden ${
              mobileView === 'chat' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-slate-200/70 flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('channels')}
                  className="md:hidden p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  ←
                </button>
                <div>
                  <div className="flex items-center gap-1.5 text-base font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <HashIcon size={16} className="text-indigo-600" />
                    <span>{activeChannel}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Real-time team channel · {channelMsgs.length} messages
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.info(`Options for #${activeChannel}`)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <MoreHorizontalIcon size={16} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {channelMsgs.map(m => (
                <div key={m.id} className="flex items-start gap-3 group">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{m.author}</span>
                      <span className="text-[10px] text-slate-400">{m.time}</span>
                    </div>
                    <div className="text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100 inline-block max-w-2xl">
                      {m.text}
                      {m.attachment && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 bg-white p-2 rounded-xl border border-indigo-100">
                          <span>📎 {m.attachment}</span>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {m.reactions?.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleReaction(m.id, r.emoji)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 bg-white text-[11px] hover:border-indigo-300 transition-colors cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-bold text-slate-600">{r.count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleReaction(m.id, '❤️')}
                        className="opacity-0 group-hover:opacity-100 p-1 text-xs text-slate-400 hover:text-rose-500 transition-opacity"
                        title="React with heart"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={() => handleReaction(m.id, '👍')}
                        className="opacity-0 group-hover:opacity-100 p-1 text-xs text-slate-400 hover:text-indigo-500 transition-opacity"
                        title="React with thumbs up"
                      >
                        👍
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200/70 bg-white relative">
              {/* Attachment Preview Chip */}
              {attachedFile && (
                <div className="mb-2 flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-xl w-fit">
                  <span>📎 {attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-indigo-400 hover:text-indigo-700">✕</button>
                </div>
              )}

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-16 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 flex gap-1.5 z-20 animate-in fade-in zoom-in-95">
                  {quickEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleAddEmoji(emoji)}
                      className="p-1.5 text-base hover:bg-slate-100 rounded-lg transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-slate-50 rounded-2xl p-2.5 pl-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder={`Message #${activeChannel}...`}
                  className="flex-1 border-none bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <AttachIcon size={16} />
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(p => !p)}
                    title="Pick emoji"
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <SmileIcon size={16} />
                  </button>
                  <button
                    onClick={send}
                    disabled={!draft.trim() && !attachedFile}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none ${
                      draft.trim() || attachedFile
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <SendIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Create Channel Modal */}
        {newChannelModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
            onClick={() => setNewChannelModal(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Create New Channel
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Channels are where your team discusses projects and topics.
              </p>

              <form onSubmit={handleCreateChannel}>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Name</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
                    <span className="text-slate-400 font-bold text-xs">#</span>
                    <input
                      autoFocus
                      value={newChannelName}
                      onChange={e => setNewChannelName(e.target.value)}
                      placeholder="e.g. backend-dev, mobile-sprint..."
                      className="bg-transparent border-none outline-none text-xs text-slate-900 w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewChannelModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
                  >
                    Create Channel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}