"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

const OrgContext = createContext(null)

// userState enum:
// 'new'      - first time, no org, no pending
// 'pending'  - has pending request(s), no approved orgs
// 'active'   - has at least one approved org
const APPROVED_ORGS_KEY = 'meridian_approved_orgs'
const ACTIVE_ORG_KEY = 'meridian_active_org_id'
const PENDING_REQUESTS_KEY = 'meridian_pending_requests'
const APPROVAL_NOTIF_KEY = 'meridian_approval_notifications'

const DEMO_APPROVED_ORGS = [
  {
    id: 'org_1',
    name: 'Meridian Technologies',
    companyName: 'Meridian Tech Inc.',
    description: 'Primary product development workspace for Meridian SaaS.',
    code: '123456',
    role: 'Owner / Leader',
    members: [
      { id: 'm1', name: 'Nitya Gandhi', role: 'Owner / Leader', email: 'nitya@meridian.io', avatarColor: '#8b5cf6', initials: 'NG' },
      { id: 'm2', name: 'Rahul Patel', role: 'Member', email: 'rahul@meridian.io', avatarColor: '#6366f1', initials: 'RP' },
      { id: 'm3', name: 'Priya Shah', role: 'Member', email: 'priya@meridian.io', avatarColor: '#10b981', initials: 'PS' },
    ]
  },
  {
    id: 'org_2',
    name: 'College Project Team',
    companyName: 'University Research Labs',
    description: 'Academic capstone project collaboration workspace.',
    code: '654321',
    role: 'Member',
    members: [
      { id: 'm4', name: 'Aarav Sharma', role: 'Owner / Leader', email: 'aarav@univ.edu', avatarColor: '#f43f5e', initials: 'AS' },
      { id: 'm1', name: 'Nitya Gandhi', role: 'Member', email: 'nitya@meridian.io', avatarColor: '#8b5cf6', initials: 'NG' },
    ]
  },
  {
    id: 'org_3',
    name: 'Freelance Team',
    companyName: 'Studio Apex Design',
    description: 'Client design & engineering consultation projects.',
    code: '987654',
    role: 'Owner / Leader',
    members: [
      { id: 'm1', name: 'Nitya Gandhi', role: 'Owner / Leader', email: 'nitya@meridian.io', avatarColor: '#8b5cf6', initials: 'NG' },
      { id: 'm5', name: 'Dev Mehta', role: 'Member', email: 'dev@freelance.io', avatarColor: '#f59e0b', initials: 'DM' },
    ]
  }
]

function readLS(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function OrgProvider({ children }) {
  // Approved organizations the user belongs to
  const [approvedOrgs, setApprovedOrgs] = useState(() => readLS(APPROVED_ORGS_KEY, DEMO_APPROVED_ORGS))

  // Currently active org id
  const [activeOrgId, setActiveOrgId] = useState(() => readLS(ACTIVE_ORG_KEY, 'org_1'))

  // Pending join requests: { id, name, companyName, requestedAt, status: 'pending' | 'approved' }
  const [pendingRequests, setPendingRequests] = useState(() => readLS(PENDING_REQUESTS_KEY, []))

  // Approval notifications to show
  const [approvalNotifications, setApprovalNotifications] = useState(() => readLS(APPROVAL_NOTIF_KEY, []))

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  // Persist state
  useEffect(() => { writeLS(APPROVED_ORGS_KEY, approvedOrgs) }, [approvedOrgs])
  useEffect(() => { writeLS(ACTIVE_ORG_KEY, activeOrgId) }, [activeOrgId])
  useEffect(() => { writeLS(PENDING_REQUESTS_KEY, pendingRequests) }, [pendingRequests])
  useEffect(() => { writeLS(APPROVAL_NOTIF_KEY, approvalNotifications) }, [approvalNotifications])

  const activeOrg = approvedOrgs.find(o => o.id === activeOrgId) || approvedOrgs[0] || null

  // Derived user state
  const hasApprovedOrg = approvedOrgs.length > 0
  const hasPendingOnly = !hasApprovedOrg && pendingRequests.filter(r => r.status === 'pending').length > 0
  const isNewUser = !hasApprovedOrg && pendingRequests.length === 0

  // userState: 'active' | 'pending' | 'new'
  const userState = hasApprovedOrg ? 'active' : hasPendingOnly ? 'pending' : 'new'

  const switchOrg = (id) => {
    const target = approvedOrgs.find(o => o.id === id)
    if (target) setActiveOrgId(target.id)
  }

  const createOrg = ({ name, companyName, description }) => {
    const newOrg = {
      id: `org_${Date.now()}`,
      name: name || 'New Organization',
      companyName: companyName || '',
      description: description || '',
      code: '123456',
      role: 'Owner / Leader',
      members: [
        { id: `m_new`, name: 'You', role: 'Owner / Leader', email: 'you@meridian.io', avatarColor: '#8b5cf6', initials: 'ME' }
      ]
    }
    setApprovedOrgs(prev => [...prev, newOrg])
    setActiveOrgId(newOrg.id)
    return newOrg
  }

  // Send a join request — puts into pending, NOT into approved orgs
  const sendJoinRequest = (orgData) => {
    const existsApproved = approvedOrgs.find(o => o.code === orgData.code)
    const existsPending = pendingRequests.find(r => r.code === orgData.code && r.status === 'pending')
    if (existsApproved || existsPending) return false

    const req = {
      id: `req_${Date.now()}`,
      name: orgData.name,
      companyName: orgData.companyName,
      code: orgData.code,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    }
    setPendingRequests(prev => [...prev, req])
    return true
  }

  // Mock: approve a pending request (simulates leader accepting)
  const approvePendingRequest = (reqId) => {
    const req = pendingRequests.find(r => r.id === reqId)
    if (!req) return

    // Move from pending to approved
    const newOrg = {
      id: `org_approved_${Date.now()}`,
      name: req.name,
      companyName: req.companyName,
      description: 'Joined via organization invite code.',
      code: req.code,
      role: 'Member',
      members: [
        { id: 'm_you', name: 'You', role: 'Member', email: 'you@meridian.io', avatarColor: '#8b5cf6', initials: 'ME' },
        { id: 'm_leader', name: 'Rahul Patel', role: 'Owner / Leader', email: 'rahul@meridian.io', avatarColor: '#6366f1', initials: 'RP' }
      ]
    }

    setApprovedOrgs(prev => [...prev, newOrg])
    setPendingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r))

    // Add notification
    const notif = {
      id: `notif_${Date.now()}`,
      orgName: req.name,
      orgId: newOrg.id,
      seen: false,
      approvedAt: new Date().toISOString()
    }
    setApprovalNotifications(prev => [...prev, notif])
  }

  const dismissNotification = (notifId) => {
    setApprovalNotifications(prev => prev.map(n => n.id === notifId ? { ...n, seen: true } : n))
  }

  const openOrgFromNotification = (notifId, orgId) => {
    dismissNotification(notifId)
    switchOrg(orgId)
  }

  // Demo helpers for testing different states
  const simulateFirstTimeLogin = () => {
    setApprovedOrgs([])
    setActiveOrgId(null)
    setPendingRequests([])
    setApprovalNotifications([])
  }

  const simulatePendingState = () => {
    setApprovedOrgs([])
    setActiveOrgId(null)
    setPendingRequests([
      {
        id: 'req_demo_1',
        name: 'Meridian Technologies',
        companyName: 'Meridian Tech Inc.',
        code: '123456',
        requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ])
    setApprovalNotifications([])
  }

  const simulateReturningUser = () => {
    setApprovedOrgs(DEMO_APPROVED_ORGS)
    setActiveOrgId('org_1')
    setPendingRequests([])
    setApprovalNotifications([])
  }

  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)
  const openJoinModal = () => setIsJoinModalOpen(true)
  const closeJoinModal = () => setIsJoinModalOpen(false)

  // Unseeen notifications
  const unseenNotifications = approvalNotifications.filter(n => !n.seen)

  return (
    <OrgContext.Provider
      value={{
        // State
        approvedOrgs,
        activeOrg,
        activeOrgId,
        pendingRequests: pendingRequests.filter(r => r.status === 'pending'),
        approvalNotifications,
        unseenNotifications,
        userState, // 'active' | 'pending' | 'new'
        isNewUser,
        hasPendingOnly,
        hasApprovedOrg,

        // Actions
        switchOrg,
        createOrg,
        sendJoinRequest,
        approvePendingRequest,
        dismissNotification,
        openOrgFromNotification,

        // Modal state
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isJoinModalOpen,
        openJoinModal,
        closeJoinModal,

        // Demo helpers
        simulateFirstTimeLogin,
        simulatePendingState,
        simulateReturningUser,
      }}
    >
      {children}
    </OrgContext.Provider>
  )
}

export function useOrg() {
  const context = useContext(OrgContext)
  if (!context) throw new Error('useOrg must be used within an OrgProvider')
  return context
}
