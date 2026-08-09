"use client";
import React, { useState, useRef, useEffect } from 'react';
import {useRouter} from 'next/navigation';

/* ── Tiny Icons ── */
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

/* ── Password Strength Bar ── */
function PasswordStrength({ password }) {
  const checks = [
    { ok: password.length >= 8, label: '8+ characters' },
    { ok: /[A-Z]/.test(password), label: 'Uppercase' },
    { ok: /\d/.test(password), label: 'Number' },
    { ok: /[^a-zA-Z0-9]/.test(password), label: 'Symbol' },
  ];
  const score = checks.filter(c => c.ok).length;
  const colorClass = score <= 1 ? 'bg-red-500' : score === 2 || score === 3 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColorClass = score <= 1 ? 'text-red-500' : score === 2 || score === 3 ? 'text-amber-500' : 'text-emerald-500';
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];

  if (!password) return null;

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${i < score ? colorClass : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {checks.map(c => (
          <span
            key={c.label}
            className={`text-[11px] flex items-center gap-0.5 ${c.ok ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            <span>{c.ok ? '✓' : '○'}</span>
            {c.label}
          </span>
        ))}
        {score > 0 && (
          <span className={`text-[11px] font-semibold ml-auto ${textColorClass}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── OTP Input ── */
function OtpInput({ onComplete, hasError }) {
  const [vals, setVals] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...vals];
    next[i] = v.slice(-1);
    setVals(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(x => x) && onComplete) onComplete(next.join(''));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setVals(text.split(''));
      refs.current[5]?.focus();
      if (onComplete) onComplete(text);
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          maxLength={1}
          className={`w-[50px] h-[56px] rounded-xl text-center text-2xl font-bold font-mono text-slate-900 outline-none transition-all duration-150 ${
            hasError
              ? 'border-2 border-red-500 bg-white'
              : v
              ? 'border-2 border-indigo-600 bg-indigo-500/10 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
              : 'border-2 border-slate-200 bg-white focus:border-indigo-600'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Countdown Timer ── */
function Countdown({ onResend }) {
  const [t, setT] = useState(300);

  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(p => p - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);

  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');

  return (
    <div className="text-center text-xs text-slate-500 mt-4">
      {t > 0 ? (
        <>
          Code expires in{' '}
          <span className={`font-mono font-bold ${t < 60 ? 'text-red-500' : 'text-indigo-600'}`}>
            {mm}:{ss}
          </span>
        </>
      ) : (
        <button
          type="button"
          onClick={() => { setT(300); onResend(); }}
          className="bg-transparent border-none text-indigo-600 font-semibold text-xs cursor-pointer"
        >
          Resend code →
        </button>
      )}
      {t > 0 && (
        <div className="mt-1.5">
          Didnt receive it?{' '}
          <button
            type="button"
            onClick={() => { setT(300); onResend(); }}
            className="bg-transparent border-none text-indigo-600 font-medium text-xs cursor-pointer"
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
}

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

/* ── Main Forgot Password Component ── */
export default function ForgotPasswordPage({ onNavigateToLogin }) {
    const router = useRouter();
  const [step, setStep] = useState('request'); // 'request' | 'verify' | 'reset' | 'success'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [otpErr, setOtpErr] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [cPwErr, setCPwErr] = useState('');

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

  return (
    <div className="flex min-h-screen bg-[#f8f7ff]">
      {/* Marketing Left Panel */}
      <LeftPanel />

      {/* Form Right Panel */}
      <div className="w-full lg:w-[500px] shrink-0 flex items-start justify-center bg-white px-7 py-8 md:px-14 md:py-10 shadow-2xl lg:shadow-[-4px_0_32px_rgba(99,102,241,0.06)] min-h-screen overflow-y-auto">
        <div className="w-full max-w-[380px] py-6 md:py-10">

          {/* STEP 1: Request Reset Link/Code */}
          {step === 'request' && (
            <div>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-transparent border-none text-indigo-600 text-xs font-medium cursor-pointer mb-5 p-0 hover:underline"
              >
                ← Back to login
              </button>
              <div className="mb-7">
                <div className="text-4xl mb-4">🔑</div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Forgot password?
                </h2>
                <p className="text-sm text-slate-500 m-0">
                  No worries — we will send you a reset code.
                </p>
              </div>
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
              <PrimaryBtn
                loading={loading}
                onClick={() => {
                  const e = validateEmail(email);
                  if (e) {
                    setEmailErr(e);
                    return;
                  }
                  load(() => setStep('verify'));
                }}
              >
                Send Reset Code
              </PrimaryBtn>
            </div>
          )}

          {/* STEP 2: Verify OTP Code */}
          {step === 'verify' && (
            <div className="text-center">
              <div className="w-[60px] h-[60px] rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5 text-3xl">
                🔒
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                Enter reset code
              </h2>
              <p className="text-sm text-slate-500 mb-7">
                Sent to <strong className="text-slate-900">{email || 'your email'}</strong>
              </p>
              <OtpInput
                hasError={otpErr}
                onComplete={(otp) => {
                  if (otp === '000000') {
                    setOtpErr(true);
                    return;
                  }
                  setOtpErr(false);
                  setStep('reset');
                }}
              />
              {otpErr && (
                <p className="text-red-500 text-xs font-medium mt-2.5">
                  ⚠ Invalid code. Try again.
                </p>
              )}
              <Countdown onResend={() => {}} />
              <div className="mt-5">
                <PrimaryBtn loading={loading} onClick={() => setStep('reset')}>
                  Verify Code
                </PrimaryBtn>
              </div>
            </div>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 'reset' && (
            <div>
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                  Create new password
                </h2>
                <p className="text-sm text-slate-500 m-0">
                  Must be different from your previous passwords
                </p>
              </div>
              <Field
                label="New password"
                type="password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setPwErr('');
                }}
                placeholder="New password"
                error={pwErr}
                icon={<LockIcon />}
                autoFocus
              />
              {password && <PasswordStrength password={password} />}
              <div className="mt-3">
                <Field
                  label="Confirm password"
                  type="password"
                  value={confirmPw}
                  onChange={(v) => {
                    setConfirmPw(v);
                    setCPwErr('');
                  }}
                  placeholder="Confirm password"
                  error={cPwErr}
                  icon={<LockIcon />}
                />
              </div>
              <div className="mt-1">
                <PrimaryBtn
                  loading={loading}
                  onClick={() => {
                    if (password.length < 8) {
                      setPwErr('At least 8 characters');
                      return;
                    }
                    if (password !== confirmPw) {
                      setCPwErr("Passwords don't match");
                      return;
                    }
                    load(() => setStep('success'));
                  }}
                >
                  Update Password
                </PrimaryBtn>
              </div>
            </div>
          )}

          {/* STEP 4: Password Reset Success */}
          {step === 'success' && (
            <div className="text-center pt-5">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/35">
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                Password updated!
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Your password has been changed. You can now sign in with your new credentials.
              </p>
              <PrimaryBtn loading={false} onClick={onNavigateToLogin}>
                Back to Sign In
              </PrimaryBtn>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}