'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BG = '#FAFAF8'
const BG2 = '#F3F2EE'
const CARD = '#FFFFFF'
const BORDER = 'rgba(13,13,15,0.08)'
const BORDER2 = 'rgba(13,13,15,0.14)'
const VI = '#6366F1'
const VI2 = '#4F46E5'
const GR = '#10B981'
const RED = '#EF4444'
const TEXT = 'rgba(13,13,15,0.88)'
const MUTED = 'rgba(13,13,15,0.50)'
const SUBTLE = 'rgba(13,13,15,0.32)'
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/* ── Rate limiter ── */
class RL {
  private key: string; private max: number; private win: number
  constructor(key: string, max = 5, win = 900000) { this.key = key; this.max = max; this.win = win }
  check(): { ok: boolean; resetIn: number } {
    try {
      const raw = sessionStorage.getItem(this.key)
      const data = raw ? JSON.parse(raw) : { a: [] }
      const now = Date.now()
      const recent: number[] = (data.a as number[]).filter((t: number) => now - t < this.win)
      if (recent.length >= this.max) {
        return { ok: false, resetIn: Math.ceil((Math.min(...recent) + this.win - now) / 60000) }
      }
      recent.push(now)
      sessionStorage.setItem(this.key, JSON.stringify({ a: recent }))
      return { ok: true, resetIn: 0 }
    } catch { return { ok: true, resetIn: 0 } }
  }
}

/* ── Validators ── */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isPhone = (v: string) => /^(\+33|0033|0)[1-9](\d{8})$/.test(v.replace(/[\s\-.]/g, ''))
function pwStrength(p: string) {
  return {
    len: p.length >= 8,
    upper: /[A-Z]/.test(p),
    num: /[0-9]/.test(p),
    sym: /[^A-Za-z0-9]/.test(p),
    score: [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length,
  }
}

/* ── Supabase helpers ── */
async function sbLogin(email: string, password: string) {
  const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.error_description || d.msg || 'Identifiants incorrects')
  return d
}
async function sbSignup(email: string, password: string, phone?: string) {
  const r = await fetch(`${SB_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, data: { phone: phone || '' } }),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.error_description || d.msg || 'Erreur lors de la creation')
  return d
}
async function sbReset(email: string) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const r = await fetch(`${SB_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, options: { redirectTo: `${siteUrl}/reset-password` } }),
  })
  if (!r.ok) throw new Error('Erreur lors de l\'envoi')
}
function saveSession(d: { access_token: string; refresh_token: string; user: { email: string; id: string } }) {
  try {
    localStorage.setItem('vanivert_token', d.access_token)
    localStorage.setItem('vanivert_refresh', d.refresh_token)
    localStorage.setItem('vanivert_user', JSON.stringify({ email: d.user.email, id: d.user.id }))
  } catch {}
}

/* ── OAuth icons ── */
function MsIcon() {
  return <svg width="16" height="16" viewBox="0 0 21 21"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
}
function GgIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
}

function Input({ label, type = 'text', value, onChange, placeholder, error, right }: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder: string; error?: string; right?: React.ReactNode
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: SUBTLE, fontFamily: 'system-ui' }}>{label}</label>
        {right}
      </div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${error ? RED : focus ? 'rgba(99,102,241,0.5)' : BORDER}`, borderRadius: 10, background: 'rgba(13,13,15,0.03)', color: TEXT, fontSize: 14, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.25s' }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      {error && <div style={{ fontSize: 11, color: RED, marginTop: 4, fontFamily: 'system-ui' }}>{error}</div>}
    </div>
  )
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [locked, setLocked] = useState(false)
  const [lockMin, setLockMin] = useState(0)
  const pw = pwStrength(password)
  const rl = typeof window !== 'undefined' ? new RL('vanivert_login_rl') : null

  const errMap: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect.',
    'Email not confirmed': 'Confirmez votre email avant de vous connecter.',
    'User already registered': 'Un compte existe deja avec cet email.',
  }

  function validate() {
    const e: Record<string, string> = {}
    if (method === 'email' && !isEmail(email)) e.email = 'Email invalide'
    if (method === 'phone' && !isPhone(phone)) e.phone = 'Format : +33 6 12 34 56 78'
    if (mode !== 'reset') {
      if (password.length < 8) e.password = '8 caracteres minimum'
      if (mode === 'signup' && pw.score < 3) e.password = 'Trop faible. Ajoutez majuscule, chiffre et symbole.'
      if (mode === 'signup' && confirm !== password) e.confirm = 'Les mots de passe ne correspondent pas'
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setError(''); setSuccess('')
    if (rl) {
      const check = rl.check()
      if (!check.ok) { setLocked(true); setLockMin(check.resetIn); return }
    }
    setLoading(true)
    try {
      if (mode === 'reset') {
        await sbReset(email)
        setSuccess('Lien envoye. Verifiez votre boite mail.')
        setLoading(false); return
      }
      if (mode === 'signup') {
        const d = await sbSignup(email, password, phone)
        if (d.user && !d.session) { setSuccess('Compte cree. Verifiez votre email pour confirmer.'); setLoading(false); return }
        if (d.session) { saveSession(d.session); window.location.href = '/dashboard'; return }
        throw new Error('Erreur lors de la creation')
      }
      const d = await sbLogin(method === 'email' ? email : phone, password)
      saveSession(d)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errMap[msg] || msg)
      setLoading(false)
    }
  }

  function oAuth(provider: 'google' | 'azure') {
    const redirect = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : ''
    window.location.href = `${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirect)}`
  }

  if (locked) return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '36px 32px', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏱</div>
        <div style={{ fontSize: 18, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: TEXT, marginBottom: 10 }}>Trop de tentatives</div>
        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>Reessayez dans <strong style={{ color: TEXT }}>{lockMin} minute(s)</strong>.</p>
        <button onClick={() => setLocked(false)} style={{ width: '100%', padding: '12px', background: VI, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui' }}>Retour</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>v</span>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, color: TEXT }}>vanivert</span>
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/admin" style={{ fontSize: 12, color: SUBTLE, textDecoration: 'none' }}>Administration</a>
          <a href="/demo" style={{ fontSize: 13, color: TEXT, textDecoration: 'none', padding: '7px 16px', borderRadius: 980, border: `1px solid ${BORDER2}` }}>Essai gratuit</a>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EZ }} style={{ width: '100%', maxWidth: 420 }}>
          {/* Double-bezel */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 22, padding: 8, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ background: CARD, borderRadius: 16, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)' }}>
              {/* Mode tabs */}
              {mode !== 'reset' && (
                <div style={{ display: 'flex', gap: 4, background: 'rgba(13,13,15,0.03)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                  {(['login', 'signup'] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); setFieldErrors({}) }}
                      style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13, fontWeight: 500, transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)', background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent', color: mode === m ? TEXT : SUBTLE }}>
                      {m === 'login' ? 'Connexion' : 'Inscription'}
                    </button>
                  ))}
                </div>
              )}

              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 22, color: TEXT, marginBottom: 6, marginTop: 0 }}>
                {mode === 'login' ? 'Content de vous revoir.' : mode === 'signup' ? 'On commence ?' : 'Mot de passe oublie ?'}
              </h1>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.5 }}>
                {mode === 'login' ? 'Acces a votre espace Vanivert.' : mode === 'signup' ? '30 jours gratuits, sans carte bancaire.' : 'On vous envoie un lien par email.'}
              </p>

              {/* Method toggle for signup */}
              {mode === 'signup' && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {(['email', 'phone'] as const).map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      style={{ flex: 1, padding: '7px', borderRadius: 9, border: `1px solid ${method === m ? 'rgba(99,102,241,0.4)' : BORDER}`, background: method === m ? 'rgba(99,102,241,0.1)' : 'transparent', color: method === m ? 'rgba(165,163,255,0.9)' : SUBTLE, fontFamily: 'system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {m === 'email' ? 'Email' : 'Telephone'}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(method === 'email' || mode === 'login' || mode === 'reset') && (
                  <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@entreprise.fr" error={fieldErrors.email} />
                )}
                {mode === 'signup' && method === 'phone' && (
                  <Input label="Telephone" type="tel" value={phone} onChange={setPhone} placeholder="+33 6 12 34 56 78" error={fieldErrors.phone} />
                )}
                {mode === 'signup' && method === 'phone' && (
                  <Input label="Email (pour la confirmation)" type="email" value={email} onChange={setEmail} placeholder="vous@entreprise.fr" error={fieldErrors.email} />
                )}
                {mode !== 'reset' && (
                  <Input label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="8 caracteres minimum" error={fieldErrors.password}
                    right={mode === 'login' ? (
                      <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                        style={{ fontSize: 11, color: 'rgba(165,163,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui' }}>
                        Oublie ?
                      </button>
                    ) : undefined} />
                )}
                {/* Password strength */}
                {mode === 'signup' && password.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'background 0.3s', background: i < pw.score ? pw.score <= 1 ? RED : pw.score <= 2 ? '#F59E0B' : pw.score === 3 ? VI : GR : 'rgba(255,255,255,0.08)' }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                      {[{ l: '8 car.', ok: pw.len }, { l: 'Majuscule', ok: pw.upper }, { l: 'Chiffre', ok: pw.num }, { l: 'Symbole', ok: pw.sym }].map(c => (
                        <span key={c.l} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: c.ok ? `${GR}20` : 'rgba(255,255,255,0.04)', color: c.ok ? GR : SUBTLE, fontFamily: 'system-ui' }}>
                          {c.ok ? 'ok' : 'o'} {c.l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mode === 'signup' && (
                  <Input label="Confirmer le mot de passe" type="password" value={confirm} onChange={setConfirm} placeholder="Repetez le mot de passe" error={fieldErrors.confirm} />
                )}
                {mode === 'signup' && (
                  <div style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.6, padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                    En creant un compte, vous acceptez nos <a href="/legal/cgv" style={{ color: MUTED }}>CGV</a> et notre <a href="/legal/confidentialite" style={{ color: MUTED }}>politique de confidentialite</a>. Hebergement Supabase EU.
                  </div>
                )}
                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: RED }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{ background: `${GR}15`, border: `1px solid ${GR}30`, borderRadius: 9, padding: '10px 14px', fontSize: 13, color: GR }}>
                    {success}
                  </div>
                )}
                <button type="submit" disabled={loading || !!success}
                  style={{ background: loading ? 'rgba(255,255,255,0.08)' : '#fff', color: loading ? MUTED : BG, fontWeight: 600, fontSize: 14, border: 'none', borderRadius: 980, padding: '13px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'system-ui', transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? (
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  ) : mode === 'reset' ? 'Envoyer le lien' : mode === 'signup' ? 'Creer mon compte' : 'Me connecter'}
                  {!loading && mode !== 'reset' && <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>→</span>}
                </button>
                {mode === 'reset' && (
                  <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                    style={{ background: 'none', border: 'none', color: SUBTLE, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', textAlign: 'center' as const }}>
                    Retour a la connexion
                  </button>
                )}
              </form>

              {/* OAuth */}
              {mode !== 'reset' && (
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 11, color: SUBTLE, textAlign: 'center' as const, marginBottom: 10 }}>Ou continuer avec</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[{ p: 'azure' as const, icon: <MsIcon />, label: 'Microsoft' }, { p: 'google' as const, icon: <GgIcon />, label: 'Google' }].map(({ p, icon, label }) => (
                      <button key={p} onClick={() => oAuth(p)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', border: `1px solid ${BORDER2}`, borderRadius: 10, background: 'rgba(13,13,15,0.03)', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13, fontWeight: 500, color: TEXT, transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}>
                        {icon}{label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: SUBTLE }}>
            Hebergement Europe. <a href="/legal/confidentialite" style={{ color: SUBTLE, textDecoration: 'underline' }}>Confidentialite</a>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:rgba(13,13,15,0.3)}`}</style>
    </div>
  )
}
