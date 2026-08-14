"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon, GridIcon, BarChartIcon, UsersIcon, MessageIcon,
  CreditCardIcon, SettingsIcon, BellIcon, SearchIcon, ChevronDownIcon,
  ZapIcon, FolderIcon, CalendarIcon, PlusIcon
} from './Icons'
import toast from 'react-hot-toast'
import CommandPalette from './CommandPalette'

const CollapseIcon = ({ collapsed }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const MenuIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { id: 'kanban', label: 'Kanban Board', href: '/kanban', icon: <GridIcon />, badge: 4 },
  { id: 'calendar', label: 'Calendar', href: '/calendar', icon: <CalendarIcon /> },
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [notifHover, setNotifHover] = useState(false)

  // Global shortcut (Cmd+K / Ctrl+K) listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (href) => {
    router.push(href)
    setMobileOpen(false)
  }

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[256px]'

  return (
    <>
      {/* ── Mobile Top Floating Navigation Bar (< lg screens) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Open navigation menu"
          >
            <MenuIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ZapIcon size={14} strokeWidth={2} />
            </div>
            <span className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Meridian
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <SearchIcon size={16} />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Profile link */}
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center"
          >
            AJ
          </button>
        </div>
      </div>

      {/* ── Mobile Backdrop Overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main Sidebar (Desktop Flex + Mobile Off-Canvas Drawer) ── */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 lg:static flex flex-col shrink-0 h-screen max-h-screen box-border
          bg-white/85 backdrop-blur-2xl border-r border-slate-200/80 shadow-[4px_0_24px_rgba(99,102,241,0.05)]
          transition-all duration-300 ease-in-out overflow-hidden
          ${mobileOpen ? 'translate-x-0 w-[270px]' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidth}
        `}
      >
        {/* Logo & Header */}
        <div className="p-4 flex items-center justify-between gap-3 overflow-hidden border-b border-slate-100/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 text-white">
              <ZapIcon size={16} strokeWidth={2.5} />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-sm text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Meridian
                </div>
                <div className="text-[9.5px] text-slate-400 font-bold tracking-wider mt-1">
                  WORKSPACE
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-slate-200 bg-white items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon collapsed={!collapsed} />
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Working Search Button in Sidebar */}
        {(!collapsed || mobileOpen) ? (
          <div className="px-3 py-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open command palette"
              className="group flex items-center gap-2 w-full bg-slate-100/90 hover:bg-indigo-50/70 rounded-xl px-3 py-2 border border-slate-200/70 hover:border-indigo-200 transition-all text-left shadow-xs"
            >
              <SearchIcon size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs text-slate-400 group-hover:text-slate-600 font-medium flex-1">
                Search anything...
              </span>
              <span className="text-[10px] text-slate-400 bg-white group-hover:bg-indigo-600 group-hover:text-white px-1.5 py-0.5 rounded border border-slate-200 font-mono transition-colors">
                ⌘K
              </span>
            </button>
          </div>
        ) : (
          <div className="px-2 py-2 flex justify-center">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              title="Search anything (⌘K)"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-colors"
            >
              <SearchIcon size={16} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-1 space-y-1">
          {(!collapsed || mobileOpen) && (
            <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 tracking-wider uppercase">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={`
                    flex items-center gap-3 w-full rounded-xl transition-all font-medium text-xs
                    ${collapsed && !mobileOpen ? 'p-2.5 justify-center' : 'px-3 py-2 justify-start'}
                    ${active
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'}
                  `}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <span className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>

                  {(!collapsed || mobileOpen) && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {(!collapsed || mobileOpen) && item.badge && (
                    <span className={`
                      text-[10px] font-bold px-1.5 py-0.5 rounded-full
                      ${active ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-700'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}

          {/* Projects Section */}
          {(!collapsed || mobileOpen) && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setProjectsOpen(p => !p)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase hover:text-slate-600"
              >
                <div className="flex items-center gap-1.5">
                  <FolderIcon size={12} />
                  <span>Projects</span>
                </div>
                <span className={`transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon size={12} />
                </span>
              </button>

              {projectsOpen && (
                <div className="space-y-0.5 mt-1">
                  {projects.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleNavClick('/kanban')}
                      className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="flex-1 text-left truncate">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.progress}%</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => toast.success('Create new project modal')}
                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors mt-1"
                  >
                    <PlusIcon size={13} />
                    <span>New Project</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer: User Profile & Notification */}
        <div className="p-3 border-t border-slate-100/80 bg-slate-50/50">
          <button
            type="button"
            onClick={() => handleNavClick('/profile')}
            className={`
              flex items-center gap-2.5 w-full rounded-xl p-1.5 hover:bg-white hover:shadow-xs transition-all
              ${collapsed && !mobileOpen ? 'justify-center' : 'justify-start'}
            `}
            title={collapsed && !mobileOpen ? 'Alex Johnson (Engineering Lead)' : undefined}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AJ
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {(!collapsed || mobileOpen) && (
              <div className="flex-1 min-w-0 text-left">
                <div className="text-xs font-bold text-slate-900 truncate">Alex Johnson</div>
                <div className="text-[10px] text-slate-400 truncate">Product Lead</div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Global Interactive Command Palette */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}