"use client"

import { useState } from 'react'
import Sidebar from '../../components/sidebar'
import { UserIcon, LockIcon, GlobeIcon, BellIcon, ShieldIcon } from '../../components/Icons'

const tabs = [
  { id: 'profile', label: 'Profile', icon: <UserIcon size={15} /> },
  { id: 'workspace', label: 'Workspace', icon: <GlobeIcon size={15} /> },
  { id: 'security', label: 'Security', icon: <LockIcon size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon size={15} /> },
]

function Field({ label, type = 'text', value, hint, readOnly }) {
  const [val, setVal] = useState(value)
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6, letterSpacing: '0.01em' }}>{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        readOnly={readOnly}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          border: '1px solid rgba(226,232,240,0.8)',
          background: readOnly ? 'rgba(248,250,252,0.8)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          fontSize: 13.5, color: readOnly ? '#94a3b8' : '#0f172a',
          outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
          fontFamily: 'Inter, sans-serif',
          boxSizing: 'border-box',
        }}
        onFocus={e => { if (!readOnly) { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'; e.currentTarget.style.boxShadow = 'none' }}
      />
      {hint && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 5 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, description, defaultOn }) {
  const [on, setOn] = useState(defaultOn ?? false)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(226,232,240,0.4)', gap: 16 }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{description}</div>
      </div>
      <button
        onClick={() => setOn(o => !o)}
        style={{
          width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: on ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(226,232,240,0.8)',
          position: 'relative', transition: 'background 0.2s',
          boxShadow: on ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

export default function Settings({ currentPage = 'settings', navigate }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} navigate={navigate} />

      <main className="page-content settings-page flex-1 min-w-0 overflow-y-auto">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Settings</div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your account and workspace preferences</div>
        </div>

        <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Tabs sidebar */}
          <div className="glass settings-sidebar-panel" style={{ borderRadius: 18, padding: 8, alignSelf: 'start' }}>
            {tabs.map(t => (
              <button key={t.id} className="settings-tab-btn" onClick={() => setActiveTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none',
                background: activeTab === t.id ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.06))' : 'transparent',
                color: activeTab === t.id ? '#6366f1' : '#475569',
                fontSize: 13.5, fontWeight: activeTab === t.id ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', marginBottom: 2,
                transition: 'background 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
              }}
                onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.background = 'rgba(99,102,241,0.05)' }}
                onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ opacity: activeTab === t.id ? 1 : 0.6 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="glass settings-content-panel" style={{ borderRadius: 20, padding: 32 }}>
            {activeTab === 'profile' && (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Profile Information</div>
                {/* Avatar */}
                <div className="settings-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: 20, background: 'rgba(248,250,252,0.8)', borderRadius: 14 }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: 18,
                    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 700, color: 'white',
                    boxShadow: '0 6px 18px rgba(99,102,241,0.3)',
                    flexShrink: 0,
                  }}>AJ</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Alex Johnson</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>JPG, PNG or GIF · Max 2MB</div>
                    <button style={{
                      padding: '7px 16px', borderRadius: 8, fontSize: 12.5,
                      border: '1px solid rgba(226,232,240,0.8)',
                      background: 'rgba(255,255,255,0.9)', color: '#475569',
                      fontWeight: 500, cursor: 'pointer',
                    }}>Upload Photo</button>
                  </div>
                </div>

                <div className="settings-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <Field label="First Name" value="Alex" />
                  <Field label="Last Name" value="Johnson" />
                </div>
                <Field label="Email Address" type="email" value="alex@meridian.io" hint="Changing your email will require verification." />
                <Field label="Role / Title" value="Engineering Lead" />
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Bio</label>
                  <textarea
                    defaultValue="Engineering Lead at Meridian Labs. Building scalable systems that help teams ship faster."
                    rows={3}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      border: '1px solid rgba(226,232,240,0.8)',
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                      fontSize: 13.5, color: '#0f172a', outline: 'none', resize: 'vertical',
                      fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <Field label="Timezone" value="America/New_York (UTC-5)" />
              </div>
            )}

            {activeTab === 'workspace' && (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Workspace Settings</div>
                <Field label="Workspace Name" value="Meridian Labs" />
                <Field label="Workspace URL" value="meridian-labs.meridian.io" hint="This is your unique workspace URL. Changing it will break existing links." />
                <Field label="Team Size" value="8–25 employees" />
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Default Project View</label>
                  <select style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1px solid rgba(226,232,240,0.8)',
                    background: 'rgba(255,255,255,0.9)', fontSize: 13.5, color: '#0f172a', outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                  }}>
                    <option>Kanban Board</option>
                    <option>List View</option>
                    <option>Timeline</option>
                    <option>Calendar</option>
                  </select>
                </div>
                <div style={{ borderTop: '1px solid rgba(226,232,240,0.5)', paddingTop: 24, marginTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>Danger Zone</div>
                  <div style={{ background: 'rgba(254,242,242,0.8)', borderRadius: 12, padding: 16, border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a', marginBottom: 4 }}>Delete Workspace</div>
                    <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 12 }}>This will permanently delete all projects, tasks, and data. This action cannot be undone.</div>
                    <button style={{
                      padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                      background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>Delete Workspace</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Security Settings</div>
                <Field label="Current Password" type="password" value="••••••••••••" />
                <Field label="New Password" type="password" value="" hint="Must be at least 12 characters with uppercase, numbers, and symbols." />
                <Field label="Confirm New Password" type="password" value="" />

                <div style={{ borderTop: '1px solid rgba(226,232,240,0.5)', paddingTop: 24, marginTop: 8, marginBottom: 24 }}>
                  <div className="settings-2fa-header" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <ShieldIcon size={18} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Two-Factor Authentication</div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#ecfdf5', color: '#10b981', fontWeight: 700 }}>Enabled</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Your account is protected with 2FA using an authenticator app.</div>
                  <button style={{
                    padding: '9px 18px', borderRadius: 10, border: '1px solid rgba(226,232,240,0.8)',
                    background: 'rgba(255,255,255,0.8)', fontSize: 13, color: '#475569', fontWeight: 500, cursor: 'pointer',
                  }}>Manage 2FA</button>
                </div>

                <div style={{ borderTop: '1px solid rgba(226,232,240,0.5)', paddingTop: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>Active Sessions</div>
                  {[
                    { device: 'MacBook Pro 14" (M3 Max)', location: 'New York, USA', time: 'Current session', current: true },
                    { device: 'iPhone 16 Pro', location: 'New York, USA', time: '2 hours ago', current: false },
                    { device: 'Chrome on Windows', location: 'Chicago, USA', time: 'Yesterday at 4:22 PM', current: false },
                  ].map(s => (
                    <div key={s.device} className="settings-session-row" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 10, marginBottom: 8, gap: 12,
                      background: s.current ? 'rgba(99,102,241,0.06)' : 'rgba(248,250,252,0.8)',
                      border: s.current ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(226,232,240,0.5)',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{s.device}</div>
                        <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{s.location} · {s.time}</div>
                      </div>
                      {s.current ? (
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#ecfdf5', color: '#10b981', fontWeight: 600, flexShrink: 0 }}>Active</span>
                      ) : (
                        <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Notification Preferences</div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', marginBottom: 12, letterSpacing: '0.02em' }}>TASK NOTIFICATIONS</div>
                  <Toggle label="Task assigned to you" description="Get notified when you're assigned a new task" defaultOn />
                  <Toggle label="Task due date reminder" description="Reminder 24 hours before a task is due" defaultOn />
                  <Toggle label="Task comments" description="When someone comments on your tasks" defaultOn />
                  <Toggle label="Subtask completed" description="When a subtask you own is completed" />
                </div>
                <div style={{ marginBottom: 20, paddingTop: 8 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', marginBottom: 12, letterSpacing: '0.02em' }}>TEAM & PROJECT</div>
                  <Toggle label="New team member joined" description="When someone joins your workspace" defaultOn />
                  <Toggle label="Sprint started or ended" description="Sprint lifecycle notifications" defaultOn />
                  <Toggle label="Project status changes" description="When a project moves to a new status" />
                  <Toggle label="Weekly digest" description="Summary of your team's progress every Monday" defaultOn />
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', marginBottom: 12, letterSpacing: '0.02em' }}>CHANNELS</div>
                  <Toggle label="Email notifications" description="Send notifications to alex@meridian.io" defaultOn />
                  <Toggle label="Slack integration" description="Forward notifications to Slack" />
                  <Toggle label="Mobile push notifications" description="Push to your iOS and Android devices" defaultOn />
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="settings-save-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(226,232,240,0.5)', flexWrap: 'wrap' }}>
              {saved && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#10b981', fontWeight: 500,
                  animation: 'pageFadeIn 0.2s ease both',
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✓
                  </div>
                  Saved successfully
                </div>
              )}
              <button style={{
                padding: '10px 22px', borderRadius: 11, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                transition: 'all 0.15s',
              }}
                onClick={handleSave}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .settings-page { padding: 24px; }

        /* Tablet: tighten padding, keep the 220px tab rail but shrink content padding */
        @media (max-width: 900px) {
          .settings-page { padding: 18px; }
          .settings-content-panel { padding: 24px !important; }
        }

        /* Phone: tab rail becomes a horizontally scrollable strip above the content,
           instead of a fixed-width left column that would crush the page */
        @media (max-width: 640px) {
          .settings-page { padding: 14px; }
          .settings-layout { display: flex !important; flex-direction: column; gap: 16px !important; }
          .settings-sidebar-panel {
            display: flex !important;
            flex-direction: row !important;
            gap: 4px;
            overflow-x: auto;
            padding: 6px !important;
          }
          .settings-tab-btn { width: auto !important; }
          .settings-content-panel { padding: 18px !important; border-radius: 16px !important; }
          .settings-name-grid { grid-template-columns: 1fr !important; }
          .settings-avatar-row { flex-wrap: wrap; }
          .settings-session-row { flex-wrap: wrap; }
          .settings-save-row { justify-content: stretch !important; }
          .settings-save-row button { flex: 1; }
        }
      `}</style>
    </div>
  )
}