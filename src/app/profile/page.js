"use client"

import { useRouter } from 'next/navigation'
import Sidebar from '../../components/sidebar'
import { UserIcon, SettingsIcon, LockIcon, CreditCardIcon, ShieldIcon } from '../../components/Icons'
import { toast } from 'react-hot-toast'

const HelpIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const KeyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
)
const LogoutIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

// Route map for this app's page keys — adjust if your folder names differ
// (e.g. your screenshot shows "calander" rather than "calendar")
const ROUTES = {
  dashboard: '/dashboard',
  analytics: '/analytics',
  kanban: '/kanban',
  chat: '/messages',
  team: '/team',
  billing: '/billing',
  settings: '/settings',
  calendar: '/calander',
  profile: '/profile',
}

export default function Profile() {
  const router = useRouter()
  const navigate = (page) => router.push(ROUTES[page] || `/${page}`)

  const handleLogout = () => {
    // Wire this up to your real auth sign-out call
    toast.success('Signed out')
    router.push('/login')
  }

  const items = [
    { label: 'Account Settings', description: 'Name, email, role, and bio', icon: <SettingsIcon size={17} />, action: () => navigate('settings') },
    { label: 'Security', description: 'Password and two-factor authentication', icon: <LockIcon size={17} />, action: () => navigate('settings') },
    { label: 'Billing & Plans', description: 'Manage your subscription and invoices', icon: <CreditCardIcon size={17} />, action: () => navigate('billing') },
    { label: 'Keyboard Shortcuts', description: 'Press ⌘K to open the command palette', icon: <KeyIcon size={17} />, action: () => toast.info('Press ⌘K to open command palette') },
    { label: 'Help & Support', description: 'Docs, guides, and contact support', icon: <HelpIcon size={17} />, action: () => toast.info('Opening help center...') },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage="profile" navigate={navigate} />

      <main className="page-content profile-page flex-1 min-w-0 overflow-y-auto">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Profile</div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Your account, plan, and quick links</div>
        </div>

        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Profile summary card */}
          <div className="glass" style={{ borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{
              width: 76, height: 76, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 27, fontWeight: 700, color: 'white',
              boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
            }}>AJ</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Alex Johnson</div>
            <div style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>alex@meridian.io</div>
            <span style={{ fontSize: 11.5, padding: '4px 12px', borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', fontWeight: 600, display: 'inline-block', marginBottom: 20 }}>Pro Plan</span>

            <button
              onClick={() => navigate('settings')}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 10, marginBottom: 8,
                border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.9)',
                color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <UserIcon size={15} /> Edit Profile
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 10,
                border: '1px solid rgba(239,68,68,0.25)', background: 'transparent',
                color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <LogoutIcon size={15} /> Sign Out
            </button>
          </div>

          {/* Quick links */}
          <div className="glass" style={{ borderRadius: 20, padding: 12 }}>
            {items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className="profile-link-row"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.12s',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(99,102,241,0.08)', color: '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .profile-page { padding: 24px; }

        @media (max-width: 900px) {
          .profile-page { padding: 18px; }
        }

        @media (max-width: 640px) {
          .profile-page { padding: 14px; }
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}