"use client"

import React, { useEffect, useSyncExternalStore } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const emptySubscribe = () => () => {}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, demoLogin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    const  params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if(!tokenFromUrl) {
      localStorage.setItem('meridian_token', tokenFormUrl);
      window.history.replaceState({}, "", "/dashboard");
      window.location.reload();
    }
    if (!loading && isHydrated && !isAuthenticated) {

    
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('meridian_redirect_after_login', pathname)
        } catch {
          // ignore
        }
      }
      router.push('/')
    }
  }, [isAuthenticated, loading, isHydrated, router, pathname])

  if (loading || !isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#eef2ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <span className="text-sm font-medium text-slate-500">Checking authentication...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#eef2ff] p-4 text-center">
        <div className="max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-xl border border-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            🔒
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Protected Route
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            You need to be signed in to access this workspace section.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Go to Sign In
            </button>
            <button
              onClick={demoLogin}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Continue as Demo Alex
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
