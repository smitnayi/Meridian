"use client"

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  SearchIcon, HomeIcon, GridIcon, CalendarIcon, BarChartIcon,
  UsersIcon, MessageIcon, CreditCardIcon, SettingsIcon, ZapIcon,
  CheckIcon
} from './Icons'

const searchItems = [
  // Navigation
  { id: 'nav-dashboard', category: 'Navigation', title: 'Dashboard', sub: 'Overview, velocity, active sprint metrics', href: '/dashboard', icon: <HomeIcon size={16} /> },
  { id: 'nav-kanban', category: 'Navigation', title: 'Kanban Board', sub: 'Backlog, In Progress, In Review, Done', href: '/kanban', icon: <GridIcon size={16} /> },
  { id: 'nav-calendar', category: 'Navigation', title: 'Calendar', sub: 'Month, week, day views & deadlines', href: '/calendar', icon: <CalendarIcon size={16} /> },
  { id: 'nav-analytics', category: 'Navigation', title: 'Analytics & Insights', sub: 'Sprint throughput & member productivity', href: '/analytics', icon: <BarChartIcon size={16} /> },
  { id: 'nav-team', category: 'Navigation', title: 'Team Members', sub: 'Manage team, roles & invitations', href: '/team', icon: <UsersIcon size={16} /> },
  { id: 'nav-messages', category: 'Navigation', title: 'Messages & Channels', sub: '#general, #engineering, #design', href: '/messages', icon: <MessageIcon size={16} /> },
  { id: 'nav-billing', category: 'Navigation', title: 'Billing & Plans', sub: 'Subscription tier, usage & invoices', href: '/billing', icon: <CreditCardIcon size={16} /> },
  { id: 'nav-settings', category: 'Navigation', title: 'Workspace Settings', sub: 'Profile, security & notifications', href: '/settings', icon: <SettingsIcon size={16} /> },
  { id: 'nav-profile', category: 'Navigation', title: 'My Profile', sub: 'View and edit your personal profile', href: '/profile', icon: <UsersIcon size={16} /> },

  // Projects
  { id: 'proj-1', category: 'Projects', title: 'Authentication Service', sub: 'OAuth2, JWT session tokens & Redis', href: '/kanban', icon: <ZapIcon size={16} color="#6366f1" /> },
  { id: 'proj-2', category: 'Projects', title: 'Payment Gateway', sub: 'Stripe webhooks & subscription billing', href: '/kanban', icon: <ZapIcon size={16} color="#10b981" /> },
  { id: 'proj-3', category: 'Projects', title: 'Customer Portal', sub: 'Client dashboard & activity feeds', href: '/kanban', icon: <ZapIcon size={16} color="#f59e0b" /> },
  { id: 'proj-4', category: 'Projects', title: 'Mobile App v2', sub: 'Push notifications & offline sync', href: '/kanban', icon: <ZapIcon size={16} color="#ef4444" /> },

  // Tasks
  { id: 'task-1', category: 'Tasks', title: 'MRD-032: OAuth2 Social Login Integration', sub: 'In Progress · Assigned to Alex Johnson', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-2', category: 'Tasks', title: 'MRD-033: Stripe Webhook Event Handling', sub: 'In Progress · Assigned to Sarah Chen', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-3', category: 'Tasks', title: 'MRD-041: Redis Cache Layer for Sessions', sub: 'Backlog · Priority High', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-4', category: 'Tasks', title: 'MRD-028: Homepage Redesign & Layout', sub: 'In Review · Assigned to Jordan Lee', href: '/kanban', icon: <CheckIcon size={16} /> },

  // Team
  { id: 'team-1', category: 'Team Members', title: 'Alex Johnson', sub: 'Engineering Lead · alex@meridian.io', href: '/team', icon: <UsersIcon size={16} /> },
  { id: 'team-2', category: 'Team Members', title: 'Sarah Chen', sub: 'Senior Full-Stack · sarah@meridian.io', href: '/team', icon: <UsersIcon size={16} /> },
  { id: 'team-3', category: 'Team Members', title: 'Marcus Webb', sub: 'Backend Engineer · marcus@meridian.io', href: '/team', icon: <UsersIcon size={16} /> },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef(null)

  if (!open) return null

  const filteredItems = searchItems.filter(item => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const handleSelect = (item) => {
    if (item && item.href) {
      router.push(item.href)
      setQuery('')
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex])
      }
    }
  }

  // Group by category
  const categories = Array.from(new Set(filteredItems.map(i => i.category)))

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => {
        setQuery('')
        onClose()
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <SearchIcon size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search pages, tasks, projects, or team members..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSelectedIndex(0)
              }}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-md hover:bg-slate-200"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="text-2xl mb-1">🔍</div>
              <p className="text-xs font-medium">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            categories.map(cat => {
              const catItems = filteredItems.filter(i => i.category === cat)
              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cat}
                  </div>
                  {catItems.map(item => {
                    const globalIdx = filteredItems.indexOf(item)
                    const isSelected = globalIdx === selectedIndex
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 shadow-xs'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate leading-tight">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {item.sub}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0 ml-2">
                          Jump →
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↑</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↵</kbd></span>
          </div>
          <span>Meridian Quick Finder</span>
        </div>
      </div>
    </div>
  )
}
