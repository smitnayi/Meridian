"use client"

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CheckIcon, DownloadIcon, ZapIcon, ShieldIcon, PlusIcon, CreditCardIcon } from '@/components/Icons'
import { toast } from 'react-hot-toast'

const initialInvoices = [
  { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: '$79.00', status: 'Paid', period: 'Aug 2026' },
  { id: 'INV-2026-007', date: 'Jul 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jul 2026' },
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jun 2026' },
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$79.00', status: 'Paid', period: 'May 2026' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$79.00', status: 'Paid', period: 'Apr 2026' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$79.00', status: 'Paid', period: 'Mar 2026' },
]

const usageData = [
  { label: 'Team Members', used: 12, limit: 20, unit: 'seats', color: '#6366f1' },
  { label: 'Projects', used: 24, limit: 999, unit: 'projects', color: '#10b981' },
  { label: 'Storage', used: 4.2, limit: 10, unit: 'GB', color: '#f59e0b' },
  { label: 'API Calls', used: 18400, limit: 50000, unit: '/mo', color: '#8b5cf6' },
]

const plansList = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    color: '#64748b',
    features: ['Up to 5 members', '10 projects', '5 GB storage', 'Basic analytics', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    period: '/month',
    color: '#6366f1',
    features: ['Up to 20 members', 'Unlimited projects', '10 GB storage', 'Advanced analytics', 'Priority support', 'Custom integrations', 'Audit logs'],
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    color: '#0f172a',
    features: ['Unlimited members', 'Unlimited projects', '100 GB storage', 'Custom analytics', 'Dedicated support', 'SSO & SAML', 'SLA guarantee', 'Custom contracts'],
    badge: 'Custom Terms',
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
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function Billing() {
  const [tab, setTab] = useState('overview')
  const [currentPlanId, setCurrentPlanId] = useState('pro')
  const [invoices, setInvoices] = useState(initialInvoices)
  const [paymentModal, setPaymentModal] = useState(false)
  const [cardLast4, setCardLast4] = useState('4242')
  const [expiry, setExpiry] = useState('08/28')

  const currentPlan = plansList.find(p => p.id === currentPlanId) || plansList[1]

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlanId) {
      toast.info(`You are currently on the ${plan.name} plan.`)
      return
    }
    setCurrentPlanId(plan.id)
    toast.success(`Successfully switched to ${plan.name} Plan! Features updated.`)
  }

  const handleDownloadInvoice = (inv) => {
    toast.success(`Downloaded ${inv.id}.pdf (${inv.amount} receipt)`)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Billing Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div style={{ fontSize: 26, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Billing & Subscription
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                Manage your workspace plan, limits, and payment methods
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 12, background: '#ecfdf5', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <ShieldIcon size={14} />
              <span style={{ fontSize: 12.5, color: '#10b981', fontWeight: 600 }}>Payments secured by Stripe</span>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 4, border: '1px solid rgba(226,232,240,0.8)', width: 'fit-content', marginBottom: 28 }}>
            {['overview', 'plans', 'invoices'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '7px 20px', borderRadius: 9, border: 'none',
                  background: tab === t ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                  color: tab === t ? 'white' : '#64748b',
                  fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                {/* Current plan card */}
                <div className="rounded-2xl p-7 bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-sm" style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(129,140,248,0.04))',
                }}>
                  <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                        <ZapIcon size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {currentPlan.name} Plan
                        </div>
                        <div className="text-xs text-slate-400">Renews September 1, 2026 · Auto-renew enabled</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {currentPlan.price}
                      </div>
                      <div className="text-xs text-slate-500">{currentPlan.period} · billed monthly</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setTab('plans')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      Change Plan Tier
                    </button>
                    <button
                      onClick={() => setPaymentModal(true)}
                      className="px-5 py-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      Update Payment Method
                    </button>
                  </div>
                </div>

                {/* Usage */}
                <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs">
                  <div className="text-sm font-bold text-slate-900 mb-2">Usage This Cycle</div>
                  <div className="divide-y divide-slate-100">
                    {usageData.map((u, i) => (
                      <UsageMeter key={i} item={u} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment Method</span>
                    <button
                      onClick={() => setPaymentModal(true)}
                      className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center tracking-wider">
                        VISA
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 font-mono">•••• {cardLast4}</div>
                        <div className="text-[10px] text-slate-400">Expires {expiry}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>

                  <button
                    onClick={() => setPaymentModal(true)}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    <PlusIcon size={14} /> Add Backup Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansList.map(plan => {
                const isCurrent = plan.id === currentPlanId
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-7 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-white border-2 border-indigo-500 shadow-lg relative'
                        : 'bg-white/80 border border-slate-200 shadow-xs hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      {isCurrent && (
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Current Plan
                        </div>
                      )}
                      <div className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {plan.name}
                      </div>
                      <div className="flex items-baseline gap-1 mb-5">
                        <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-500">{plan.period}</span>
                      </div>

                      <div className="space-y-2.5 mb-6">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckIcon size={14} className="text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      }`}
                    >
                      {isCurrent ? 'Active Plan' : `Switch to ${plan.name}`}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'invoices' && (
            <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Payment History & Tax Receipts</div>
                  <div className="text-xs text-slate-400">All past monthly invoices for your workspace</div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-mono">{inv.id}</div>
                      <div className="text-[11px] text-slate-400">{inv.period} · {inv.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-900 font-mono">{inv.amount}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {inv.status}
                      </span>
                      <button
                        onClick={() => handleDownloadInvoice(inv)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <DownloadIcon size={12} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Update Card Modal */}
        {paymentModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
            onClick={() => setPaymentModal(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Update Payment Card</h3>
                <button onClick={() => setPaymentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                  <input
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                    <input
                      defaultValue="08/28"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC</label>
                    <input
                      defaultValue="•••"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPaymentModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setPaymentModal(false)
                    toast.success('Payment method updated successfully')
                  }}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700"
                >
                  Save Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}