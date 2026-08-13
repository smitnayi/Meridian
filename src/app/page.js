"use client";

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';

/* ── Tiny Icons ── */
const GoogleIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="#1a1a2e">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const MailIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/>
  </svg>
);

const CheckIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
  </svg>
);

const ZapIconSVG = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
  </svg>
);

/* ── Reusable Input Field ── */
function Field({ label, type = 'text', value, onChange, placeholder, error, icon, autoFocus }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          autoFocus={autoFocus}
          type={isPw && showPw ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-2.5 text-sm text-slate-900 bg-white rounded-xl border outline-none font-sans transition-all duration-150 ${
            isPw ? 'pr-10' : 'pr-3.5'
          } ${icon ? 'pl-10' : 'pl-3.5'} ${
            error
              ? 'border-red-500 bg-red-50/30 focus:ring-4 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
          }`}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
          >
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      {error && <div className="text-xs text-red-500 mt-1 font-medium">⚠ {error}</div>}
    </div>
  );
}

/* ── Social Button ── */
function SocialBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full py-3 px-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 text-sm font-medium text-slate-700 flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer font-sans"
    >
      {children}
    </button>
  );
}

/* ── Primary CTA Button ── */
function PrimaryBtn({ children, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      type="button"
      className={`w-full py-3.5 px-4 rounded-full border-none text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg font-sans transition-all duration-200 ${
        loading
          ? 'bg-indigo-400 cursor-wait'
          : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/45 hover:-translate-y-0.5 cursor-pointer shadow-indigo-500/35'
      }`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
      )}
      {children}
      {!loading && <ArrowRightIcon />}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-xs font-medium text-slate-400 tracking-wider">OR</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

/* ── Left Marketing Panel ── */
function LeftPanel() {
  const features = [
    { icon: '⊞', title: 'Kanban boards with real-time collaboration', sub: 'Move faster with clarity and alignment', bg: 'bg-purple-100' },
    { icon: '◎', title: 'Sprint planning & velocity tracking', sub: 'Plan smarter. Deliver consistently.', bg: 'bg-indigo-100' },
    { icon: '▦', title: 'Analytics dashboards that actually make sense', sub: 'Get insights that help you make better decisions', bg: 'bg-blue-100' },
    { icon: '◫', title: 'Built-in team chat & notifications', sub: 'Stay in sync without leaving your workspace', bg: 'bg-purple-100' },
  ];

  return (
    <div className="hidden lg:flex flex-1 min-h-screen bg-gradient-to-br from-[#f8f7ff] via-[#f0edff] to-[#eef2ff] relative p-12 lg:p-14 flex-col overflow-hidden">
      {/* Radial Blobs */}
      <div className="absolute -top-20 -right-16 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-10 w-88 h-88 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-12 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
          <ZapIconSVG />
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">Meridian</span>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 bg-white border border-indigo-500/20 rounded-full px-3.5 py-1.5 w-fit mb-6 relative z-10 shadow-sm shadow-indigo-500/10">
        <span className="text-indigo-600 text-xs">⚡</span>
        <span className="text-xs font-semibold text-indigo-600">All-in-one workspace</span>
      </div>

      {/* Headline */}
      <h1 className="font-extrabold text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight mb-4 relative z-10">
        Where great teams<br />build <span className="text-indigo-600">great products</span>.
      </h1>
      <p className="text-base text-slate-500 leading-relaxed mb-10 max-w-md relative z-10">
        Meridian brings your teams work into one place — tasks, sprints, analytics, and communication.
      </p>

      {/* Features List */}
      <div className="flex flex-col gap-5 relative z-10 mb-auto">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center text-xl shrink-0 shadow-sm shadow-indigo-500/10`}>
              {f.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 leading-snug">{f.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Proof */}
      <div className="mt-10 bg-white/75 backdrop-blur-md rounded-2xl p-5 border border-white/90 shadow-lg shadow-indigo-500/10 relative z-10">
        <div className="flex items-center mb-2">
          {['👩🏻', '👨🏽', '👦🏻', '👩🏾', '👨🏼'].map((em, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm -ml-2 first:ml-0"
              style={{ backgroundColor: `hsl(${i * 50 + 200}, 65%, 60%)`, zIndex: 5 - i }}
            >
              {em}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white -ml-2 z-0">
            +8K
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Trusted by <strong className="text-slate-900">12,000+</strong> teams worldwide
        </div>
      </div>
    </div>
  );
}

/* ── Main Login Component ── */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');

  const load = (fn) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (fn) fn();
    }, 1000);
  };

  const validateEmail = (v) => {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = () => {
    const e = validateEmail(email);
    if (e) {
      setEmailErr(e);
      return;
    }
    if (!password) {
      setPwErr('Password is required');
      return;
    }
    load(() => router.push('/dashboard'));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f7ff]">
      {/* Marketing Left Panel */}
      <LeftPanel />

      {/* Form Right Panel */}
      <div className="w-full lg:w-[500px] shrink-0 flex items-start justify-center bg-white px-7 py-8 md:px-14 md:py-10 shadow-2xl lg:shadow-[-4px_0_32px_rgba(99,102,241,0.06)] min-h-screen overflow-y-auto">
        <div className="w-full max-w-[380px] py-6 md:py-10">
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 m-0">
              Sign in to your workspace
            </p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5 mb-1">
            <SocialBtn onClick={() => load(() => router.push('/dashboard'))}>
              <GoogleIcon />
              Continue with Google
            </SocialBtn>
            <SocialBtn onClick={() => load(() => router.push('/dashboard'))}>
              <GitHubIcon />
              Continue with GitHub
            </SocialBtn>
          </div>

          <Divider />

          {/* Form Fields */}
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setEmailErr('');
            }}
            placeholder="you@company.com"
            error={emailErr}
            icon={<MailIcon />}
            autoFocus
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setPwErr('');
            }}
            placeholder="Your password"
            error={pwErr}
            icon={<LockIcon />}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-5.5 -mt-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setRemember(r => !r)}
                className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center cursor-pointer transition-all duration-150 ${
                  remember ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                }`}
              >
                {remember && <CheckIcon />}
              </div>
              <span className="text-sm text-slate-700">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="bg-transparent border-none text-indigo-600 text-sm font-semibold cursor-pointer hover:underline p-0"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <PrimaryBtn loading={loading} onClick={handleSubmit}>
            Sign in
          </PrimaryBtn>

          <Divider />

          {/* OTP Alternate Login */}
          <SocialBtn onClick={() => toast.info('OTP login coming soon')}
          >
            <MailIcon />
            Sign in with email OTP instead
          </SocialBtn>

          {/* Create Account Switch */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Dont have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="bg-transparent border-none text-indigo-600 font-bold hover:underline cursor-pointer p-0 text-sm"
            >
              Create account
            </button>
          </p>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <ShieldCheckIcon />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}