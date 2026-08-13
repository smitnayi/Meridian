"use client"

import { useState } from 'react'
import Sidebar from '../../components/sidebar'
import { ChevronRightIcon, PlusIcon } from '../../components/Icons'
import { toast } from 'react-hot-toast'

const ChevronLeftIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const events = [
  { id: 'e1', title: 'Sprint 14 Review', day: 9, color: '#6366f1', bg: '#eef2ff', time: '3:00 PM', type: 'meeting' },
  { id: 'e2', title: 'OAuth Integration deadline', day: 8, color: '#ef4444', bg: '#fef2f2', time: 'All day', type: 'deadline', project: 'Auth Service' },
  { id: 'e3', title: 'Stripe Webhook Setup', day: 10, color: '#f59e0b', bg: '#fffbeb', time: 'Due', type: 'deadline', project: 'Payment Gateway' },
  { id: 'e4', title: 'Design System Review', day: 11, color: '#10b981', bg: '#ecfdf5', time: '10:00 AM', type: 'meeting' },
  { id: 'e5', title: 'Customer Portal Launch', day: 14, color: '#f59e0b', bg: '#fffbeb', time: 'All day', type: 'deadline', project: 'Customer Portal' },
  { id: 'e6', title: 'Team 1:1 — Sarah', day: 12, color: '#8b5cf6', bg: '#f5f3ff', time: '2:00 PM', type: 'meeting' },
  { id: 'e7', title: 'Mobile App v2 Demo', day: 15, color: '#0ea5e9', bg: '#f0f9ff', time: '4:00 PM', type: 'meeting' },
  { id: 'e8', title: 'Backend Refactor PR review', day: 13, color: '#6366f1', bg: '#eef2ff', time: 'Task due', type: 'task', project: 'Analytics Dashboard' },
  { id: 'e9', title: 'Quarterly planning', day: 18, color: '#6366f1', bg: '#eef2ff', time: '9:00 AM', type: 'meeting' },
  { id: 'e10', title: 'Push Notification deadline', day: 18, color: '#ef4444', bg: '#fef2f2', time: 'Due', type: 'deadline', project: 'Mobile App v2' },
  { id: 'e11', title: 'Prod release v2.4.0', day: 21, color: '#10b981', bg: '#ecfdf5', time: '12:00 PM', type: 'deadline' },
  { id: 'e12', title: 'Security audit', day: 22, color: '#f59e0b', bg: '#fffbeb', time: '10:00 AM', type: 'meeting' },
  { id: 'e13', title: 'API rate limiting review', day: 25, color: '#0ea5e9', bg: '#f0f9ff', time: 'Task due', type: 'task' },
  { id: 'e14', title: 'Sprint 15 planning', day: 28, color: '#6366f1', bg: '#eef2ff', time: '2:00 PM', type: 'meeting' },
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function EventChip({ event, onClick }) {
  return (
    <div
      className="cal-chip"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        fontSize: 10.5, padding: '2px 7px', borderRadius: 5, marginBottom: 2,
        background: event.bg, color: event.color, fontWeight: 500,
        cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        border: `1px solid ${event.color}25`, lineHeight: 1.5,
        transition: 'all 0.12s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'brightness(0.95)'
        e.currentTarget.style.transform = 'translateX(1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'none'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      {event.type === 'deadline' && '⚑ '}{event.title}
    </div>
  )
}

function EventModal({ event, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 700 }} />
      <div
        className="glass-strong cal-modal"
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 701, width: 340, borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          animation: 'paletteIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <div style={{ height: 4, background: `linear-gradient(90deg, ${event.color}, ${event.color}99)` }} />
        <div style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 20, background: event.bg, color: event.color, fontWeight: 600 }}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>{event.title}</div>
          {event.project && <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 6 }}>📁 {event.project}</div>}
          <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 16 }}>🕐 August {event.day}, 2026 {event.time && `· ${event.time}`}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { toast.success('Opening task details'); onClose() }}
              style={{
                flex: 1, padding: '8px', borderRadius: 9, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}
            >
              View Details
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '8px', borderRadius: 9, border: '1px solid rgba(226,232,240,0.8)',
                background: 'rgba(255,255,255,0.8)', color: '#475569', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Calendar({ currentPage = 'calendar', navigate }) {
  const [view, setView] = useState('month')
  const [month, setMonth] = useState(7) // August (0-indexed)
  const [year] = useState(2026)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filter, setFilter] = useState('All')

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = 7

  const cells = Array.from({ length: 35 }, (_, i) => {
    const day = i - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  const filteredEvents = events.filter((e) => {
    if (filter === 'All') return true
    if (filter === 'Tasks') return e.type === 'task'
    if (filter === 'Meetings') return e.type === 'meeting'
    if (filter === 'Deadlines') return e.type === 'deadline'
    return true
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} navigate={navigate} />

      <main className="page-content cal-page flex-1 min-w-0 overflow-y-auto" style={{ padding: '24px' }}>
        {/* Header */}
        <div className="cal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 26, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Calendar</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Tasks, deadlines, and meetings at a glance</div>
          </div>
          <div className="cal-controls" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Category Filter */}
            <div className="cal-pillbar" style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.8)', borderRadius: 11, padding: 4, border: '1px solid rgba(226,232,240,0.8)', overflowX: 'auto' }}>
              {['All', 'Tasks', 'Meetings', 'Deadlines'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12,
                    background: filter === f ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                    color: filter === f ? 'white' : '#64748b',
                    fontWeight: filter === f ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="cal-pillbar" style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.8)', borderRadius: 11, padding: 4, border: '1px solid rgba(226,232,240,0.8)', overflowX: 'auto' }}>
              {['month', 'week', 'day'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12,
                    background: view === v ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                    color: view === v ? 'white' : '#64748b',
                    fontWeight: view === v ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>

            <button
              className="cal-add-btn"
              onClick={() => toast.info('Create event modal coming soon')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', borderRadius: 11, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              <PlusIcon size={14} strokeWidth={2.5} /> Add Event
            </button>
          </div>
        </div>

        <div className="glass cal-grid-wrap" style={{ borderRadius: 20, overflow: 'hidden', padding: 0 }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
            <button
              onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}
            >
              <ChevronLeftIcon size={16} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0f172a' }}>{months[month]} {year}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{filteredEvents.length} events this month</div>
            </div>
            <button
              onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>

          {/* Scrollable grid on small screens so days stay legible instead of crushing */}
          <div className="cal-scroll">
            <div className="cal-inner">
              {/* Day Headers */}
              <div className="cal-days-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
                {days.map((d) => (
                  <div key={d} style={{ padding: '10px 16px', fontSize: 11.5, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textAlign: 'center' }}>
                    <span className="cal-day-full">{d.toUpperCase()}</span>
                    <span className="cal-day-short">{d.charAt(0)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {cells.map((day, i) => {
                  const dayEvents = day ? filteredEvents.filter((e) => e.day === day) : []
                  const isToday = day === today
                  const isWeekend = i % 7 === 0 || i % 7 === 6

                  return (
                    <div
                      key={i}
                      className="cal-cell"
                      style={{
                        minHeight: 110, padding: '8px 10px',
                        borderRight: (i + 1) % 7 !== 0 ? '1px solid rgba(226,232,240,0.4)' : 'none',
                        borderBottom: i < 28 ? '1px solid rgba(226,232,240,0.4)' : 'none',
                        background: isWeekend && day ? 'rgba(248,250,252,0.5)' : 'transparent',
                        transition: 'background 0.15s', cursor: day ? 'pointer' : 'default',
                      }}
                      onMouseEnter={(e) => { if (day) e.currentTarget.style.background = 'rgba(99,102,241,0.03)' }}
                      onMouseLeave={(e) => { if (day) e.currentTarget.style.background = isWeekend ? 'rgba(248,250,252,0.5)' : 'transparent' }}
                    >
                      {day && (
                        <>
                          <div
                            style={{
                              width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
                              background: isToday ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                              color: isToday ? 'white' : day < today ? '#cbd5e1' : '#0f172a',
                              fontSize: 13, fontWeight: isToday ? 700 : 400,
                              boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                            }}
                          >
                            {day}
                          </div>
                          {dayEvents.slice(0, 3).map((ev) => (
                            <EventChip key={ev.id} event={ev} onClick={() => setSelectedEvent(ev)} />
                          ))}
                          {dayEvents.length > 3 && (
                            <div style={{ fontSize: 10, color: '#94a3b8', padding: '1px 4px' }}>+{dayEvents.length - 3} more</div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="cal-legend" style={{ display: 'flex', gap: 20, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { color: '#6366f1', label: 'Meetings' },
            { color: '#ef4444', label: 'Deadlines' },
            { color: '#10b981', label: 'Releases' },
            { color: '#0ea5e9', label: 'Tasks' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#64748b' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </main>

      <style jsx>{`
        .cal-day-short { display: none; }

        /* Tablet and down: tighten header + shrink grid a bit */
        @media (max-width: 860px) {
          .cal-page { padding: 16px !important; }
          .cal-header { margin-bottom: 20px !important; }
          .cal-header > div:first-child > div:first-child { font-size: 22px !important; }
          .cal-controls { width: 100%; }
          .cal-pillbar { flex: 1 1 auto; }
        }

        /* Phones: stack controls, compress the grid, keep it usable without horizontal scrolling */
        @media (max-width: 560px) {
          .cal-header { flex-direction: column; align-items: stretch; }
          .cal-controls { flex-direction: column; }
          .cal-pillbar { width: 100%; justify-content: space-between; }
          .cal-add-btn { width: 100%; }

          .cal-day-full { display: none; }
          .cal-day-short { display: inline; }

          .cal-cell { min-height: 68px !important; padding: 6px 4px !important; }
          .cal-cell :global(> div:first-child) { width: 20px !important; height: 20px !important; font-size: 11px !important; }

          .cal-legend { gap: 12px !important; font-size: 11px !important; }
        }

        @media (max-width: 420px) {
          .cal-modal { width: 92vw !important; left: 50% !important; }
        }
      `}</style>
    </div>
  )
}