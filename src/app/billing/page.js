"use client"

import { useState } from 'react'
import Sidebar from '../../components/sidebar' // or '../components/Sidebar'
import { CheckIcon, DownloadIcon, ZapIcon, ShieldIcon } from '@/components/Icons'
import { toast } from 'react-hot-toast'

const invoices = [
  { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: '$79.00', status: 'Paid', period: 'Aug 2026' },
  { id: 'INV-2026-007', date: 'Jul 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jul 2026' },
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jun 2026' },
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$79.00', status: 'Paid', period: 'May 2026' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$79.00', status: 'Paid', period: 'Apr 2026' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$79.00', status: 'Paid', period: 'Mar 2026' },
]

const usage = [
  { label: 'Team Members', used: 12, limit: 20, unit: 'seats', color: '#6366f1' },
  { label: 'Projects', used: 24, limit: 999, unit: 'projects', color: '#10b981' },
  { label: 'Storage', used: 4.2, limit: 10, unit: 'GB', color: '#f59e0b' },
  { label: 'API Calls', used: 18400, limit: 50000, unit: '/mo', color: '#8b5cf6' },
]

const plans = [
  {
    name: 'Starter', price: '$29', period: '/month', current: false, color: '#64748b',
    features: ['Up to 5 members', '10 projects', '5 GB storage', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro', price: '$79', period: '/month', current: true, color: '#6366f1',
    features: ['Up to 20 members', 'Unlimited projects', '10 GB storage', 'Advanced analytics', 'Priority support', 'Custom integrations', 'Audit logs'],
    badge: 'Current Plan',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', current: false, color: '#0f172a',
    features: ['Unlimited members', 'Unlimited projects', '100 GB storage', 'Custom analytics', 'Dedicated support', 'SSO & SAML', 'SLA guarantee', 'Custom contracts'],
    badge: 'Contact Sales',
  },
]

function UsageMeter({ item }) {
  const pct = item.limit === 999 ? 24 : Math.round((item.used / item.limit) * 100)
  const isHigh = pct > 70
  const color = isHigh ? '#f59e0b' : item.color

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a' }}>{item.label}</span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
            {typeof item.used === 'number' && item.used > 1000
              ? `${(item.used / 1000).toFixed(1)}k`
              : item.used}
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {' / '}{item.limit === 999 ? '∞' : `${item.limit} ${item.unit}`}
          </span>
        </div>
      </div>
      <div style={{ height: 7, borderRadius: 99, background: 'rgba(226,232,240,0.8)' }}>
        <div className="progress-fill" style={{
          height: '100%', borderRadius: 99,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          width: `${item.limit === 999 ? 24 : pct}%`,
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
      {isHigh && (
        <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 5, fontWeight: 500 }}>
          ⚠️ Approaching limit — consider upgrading
        </div>
      )}
    </div>
  )
}

export default function Billing({ navigate, currentPage = 'billing' }) {
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onNotificationClick={() => toast.info('Notifications clicked')}
        onProfileClick={() => toast.info('Profile clicked')}
        onCommandPalette={() => toast.info('Command Palette opened')}
      />

      {/* Main Billing Content */}
      <main className="page-content flex-1 min-w-0 overflow-y-auto" style={{ minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 26, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Billing</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your plan, usage, and payment history</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 10, background: '#ecfdf5', border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <ShieldIcon size={14} />
            <span style={{ fontSize: 12.5, color: '#10b981', fontWeight: 600 }}>Payments secured by Stripe</span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 4, border: '1px solid rgba(226,232,240,0.8)', width: 'fit-content', marginBottom: 28 }}>
          {['overview', 'plans', 'invoices'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 20px', borderRadius: 9, border: 'none',
              background: tab === t ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
              color: tab === t ? 'white' : '#64748b',
              fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="dash-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            <div>
              {/* Current plan card */}
              <div className="glass" style={{
                borderRadius: 20, padding: 28, marginBottom: 20,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(129,140,248,0.04))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ZapIcon size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a' }}>Pro Plan</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>Renews September 1, 2026</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 32, fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1 }}>$79</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>/month · billed monthly</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setTab('plans')} style={{
                    padding: '10px 22px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
                    fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                  }}>Upgrade to Enterprise</button>
                  <button style={{
                    padding: '10px 22px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)',
                    background: 'rgba(255,255,255,0.7)', color: '#6366f1',
                    fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  }}>Manage Plan</button>
                </div>
              </div>

              {/* Usage */}
              <div className="glass" style={{ borderRadius: 20, padding: '20px 24px' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Usage This Cycle</div>
                <div style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 4 }}>Aug 1 – Aug 31, 2026</div>
                {usage.map(u => <UsageMeter key={u.label} item={u} />)}
              </div>
            </div>

            {/* Payment info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass" style={{ borderRadius: 20, padding: 22 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Payment Method</div>
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b, #334155)',
                  borderRadius: 14, padding: '18px 20px', marginBottom: 14,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ width: 36, height: 24, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: 4 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>VISA</span>
                  </div>
                  <div style={{ fontSize: 15, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', marginBottom: 10 }}>
                    •••• •••• •••• 4242
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 2 }}>CARDHOLDER</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Alex Johnson</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 2 }}>EXPIRES</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>09/29</div>
                    </div>
                  </div>
                </div>
                <button style={{
                  width: '100%', padding: '9px', borderRadius: 10,
                  border: '1px dashed rgba(99,102,241,0.3)', background: 'transparent',
                  color: '#6366f1', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>Change Payment Method</button>
              </div>

              <div className="glass" style={{ borderRadius: 20, padding: 22 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>Billing Contact</div>
                {[
                  { label: 'Email', value: 'alex@meridian.io' },
                  { label: 'Company', value: 'Meridian Labs Inc.' },
                  { label: 'Tax ID', value: 'US 12-3456789' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(226,232,240,0.4)' }}>
                    <span style={{ fontSize: 12.5, color: '#64748b' }}>{f.label}</span>
                    <span style={{ fontSize: 12.5, color: '#0f172a', fontWeight: 500 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'plans' && (
          <div className="analytics-grid-3" style={{ gap: 20 }}>
            {plans.map(plan => (
              <div key={plan.name} className={plan.current ? 'glass-strong' : 'glass'} style={{
                borderRadius: 22, padding: 28,
                border: plan.current ? '2px solid rgba(99,102,241,0.35)' : undefined,
                position: 'relative', overflow: 'hidden',
              }}>
                {plan.current && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
                    fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  }}>Current</div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ fontSize: 36, fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: plan.color, letterSpacing: '-0.04em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{plan.period}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 6, background: plan.current ? '#eef2ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckIcon size={11} />
                      </div>
                      <span style={{ fontSize: 13, color: '#475569' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%', padding: '11px', borderRadius: 11, border: 'none',
                  background: plan.current
                    ? 'rgba(226,232,240,0.8)'
                    : plan.name === 'Enterprise'
                    ? '#0f172a'
                    : 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: plan.current ? '#94a3b8' : 'white',
                  fontSize: 13.5, fontWeight: 600, cursor: plan.current ? 'default' : 'pointer',
                  boxShadow: !plan.current && plan.name !== 'Enterprise' ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                }}>
                  {plan.current ? 'Current Plan' : plan.badge || `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'invoices' && (
          <div className="glass" style={{ borderRadius: 20, overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Payment History</div>
              <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>All past invoices for your account</div>
            </div>
            {invoices.map((inv, i) => (
              <div key={inv.id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                borderBottom: i < invoices.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>{inv.id}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{inv.period} · {inv.date}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>{inv.amount}</div>
                <span style={{
                  fontSize: 11.5, padding: '3px 10px', borderRadius: 20,
                  background: '#ecfdf5', color: '#10b981', fontWeight: 600,
                }}>{inv.status}</span>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8,
                  border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)',
                  fontSize: 12.5, color: '#475569', cursor: 'pointer',
                }}>
                  <DownloadIcon size={13} /> PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}