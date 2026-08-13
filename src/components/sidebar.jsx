"use client"

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon, GridIcon, BarChartIcon, UsersIcon, MessageIcon,
  CreditCardIcon, SettingsIcon, BellIcon, SearchIcon, ChevronDownIcon,
  ZapIcon, FolderIcon, CalendarIcon, PlusIcon
} from './Icons'
import toast from 'react-hot-toast'

const CollapseIcon = ({ collapsed }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { id: 'kanban', label: 'Kanban Board', href: '/kanban', icon: <GridIcon />, badge: 4 },
  { id: 'calendar', label: 'Calendar', href: '/calander', icon: <CalendarIcon /> },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <BarChartIcon /> },
  { id: 'team', label: 'Team', href: '/team', icon: <UsersIcon /> },
  { id: 'chat', label: 'Messages', href: '/messages', icon: <MessageIcon />, badge: 7 },
  { id: 'billing', label: 'Billing', href: '/billing', icon: <CreditCardIcon /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
]

const projects = [
  { name: 'Auth Service', color: '#6366f1', progress: 82 },
  { name: 'Payment Gateway', color: '#10b981', progress: 61 },
  { name: 'Analytics Dashboard', color: '#f59e0b', progress: 45 },
  { name: 'Mobile App v2', color: '#ef4444', progress: 28 },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [notifHover, setNotifHover] = useState(false)
  const w = collapsed ? 68 : 248

  return (
    <aside style={{
      width: w, minWidth: w, maxWidth: w, height: '100vh', maxHeight: '100vh',
      display: 'flex', flexDirection: 'column', flexShrink: 0, boxSizing: 'border-box',
      background: 'rgba(255, 255, 255, 0.72)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '4px 0 28px rgba(99, 102, 241, 0.07)',
      zIndex: 10, overflow: 'hidden',
      transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1), min-width 0.25s cubic-bezier(0.16,1,0.3,1), max-width 0.25s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Logo + collapse */}
      <div style={{ padding: '20px 14px 16px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', flexShrink: 0 }}>
          <ZapIcon size={16} strokeWidth={2} />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Meridian</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>WORKSPACE</div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(226,232,240,0.7)', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexShrink: 0, transition: 'all 0.15s' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <CollapseIcon collapsed={!collapsed} />
        </button>
      </div>

      {/* Search / Command palette */}
      {!collapsed && (
        <div style={{ padding: '0 12px 12px' }}>
          <button type="button" onClick={() => toast.info('Command palette opened')} aria-label="Open command palette" style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            background: 'rgba(241, 245, 249, 0.8)', borderRadius: 10, padding: '7px 12px',
            border: '1px solid rgba(226, 232, 240, 0.8)', cursor: 'pointer', textAlign: 'left',
          }}>
            <SearchIcon size={14} />
            <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 400, flex: 1 }}>Search anything...</span>
            <span style={{ fontSize: 10, color: '#cbd5e1', background: 'white', padding: '1px 5px', borderRadius: 5, border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>⌘K</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav aria-label="Main navigation" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 8px' }}>
        {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', padding: '4px 12px 6px', letterSpacing: '0.08em' }}>NAVIGATION</div>}
        {navItems.map(item => {
          // Determine active: pathname starts with item href
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <div key={item.id} className="tooltip" data-tip={collapsed ? item.label : undefined} style={{ position: 'relative', marginBottom: 1 }}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className={`nav-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  width: '100%', padding: collapsed ? '9px' : '8px 12px',
                  borderRadius: 10, border: 'none',
                  background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: active ? '#6366f1' : '#475569',
                  fontFamily: 'Inter, sans-serif', fontSize: 13.5,
                  fontWeight: active ? 600 : 400, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ opacity: active ? 1 : 0.65, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span style={{ background: active ? '#6366f1' : 'rgba(99,102,241,0.15)', color: active ? 'white' : '#6366f1', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          )
        })}

        {/* Projects */}
        {!collapsed && (
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setProjectsOpen(p => !p)}
              aria-expanded={projectsOpen}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                padding: '4px 12px 6px', background: 'none', border: 'none',
                fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', cursor: 'pointer',
              }}>
              <FolderIcon size={11} />
              <span>PROJECTS</span>
              <span style={{ marginLeft: 'auto', transform: `rotate(${projectsOpen ? 180 : 0}deg)`, transition: 'transform 0.2s ease' }}>
                <ChevronDownIcon size={11} />
              </span>
            </button>
            {projectsOpen && projects.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => router.push('/kanban')}
                aria-label={`Open ${p.name}, ${p.progress}% complete`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '6px 12px',
                  background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 400, flex: 1, textAlign: 'left' }}>{p.name}</span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{p.progress}%</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => toast('Create Project dialog opened')}
              aria-label="Create new project"
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 12px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 12.5 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <PlusIcon size={12} /> New Project
            </button>
          </div>
        )}
      </nav>

      {/* Notification bell when collapsed */}
      {collapsed && (
        <div style={{ padding: '8px', position: 'relative' }}>
          <button type="button" onClick={() => toast.info('Notifications clicked')} aria-label="View notifications" style={{ width: 44, height: 44, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', position: 'relative', margin: '0 auto' }}>
            <BellIcon size={18} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid white' }} />
          </button>
        </div>
      )}

      {/* User */}
      <div style={{ padding: collapsed ? '8px' : '12px 12px 16px', borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => toast.info('Notifications clicked')}
              onMouseEnter={() => setNotifHover(true)}
              onMouseLeave={() => setNotifHover(false)}
              aria-label="View notifications"
              style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, background: notifHover ? 'rgba(99,102,241,0.1)' : 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <BellIcon size={16} />
              <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid white' }} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => router.push('/profile')}
          aria-label="Open profile menu for Alex Johnson"
          title={collapsed ? 'Alex Johnson' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '6px' : '8px 8px', borderRadius: 10, cursor: 'pointer',
            background: 'transparent', border: 'none', width: '100%', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>AJ</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#10b981', border: '2px solid white' }} />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alex Johnson</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>Engineering Lead</div>
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}