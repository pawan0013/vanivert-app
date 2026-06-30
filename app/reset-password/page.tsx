'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BG = '#FAFAF8'
const BG2 = '#F3F2EE'
const CARD = '#FFFFFF'
const INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)'
const BORDER2 = 'rgba(13,13,15,0.14)'
const VI = '#6366F1'
const GR = '#10B981'
const RED = '#EF4444'
const EM = '#F59E0B'
const MUTED = 'rgba(13,13,15,0.50)'
const SUBTLE = 'rgba(13,13,15,0.32)'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill={VI}/>
      <path d="M9 16.5L14 21.5L23 10.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 21.5C11.5 19 9.5 15.5 9.5 11.5C9.5 9.8 9.9 8.4 10.5 7.5C11.8 9.2 13.2 10 14.8 10C13.8 11.6 13.5 13.5 14 15.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
    </svg>
  )
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')
  const [expired, setExpired] = useState(false)
  const [focusPw, setFocusPw] = useState(false)
  const [focusCf, setFocusCf] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const at = params.get('access_token') || ''
    const tt = params.get('type') || ''
    const err = params.get('error')
    const errCode = params.get('error_code')
    if (err || errCode === 'otp_expired') { setExpired(true); return }
    if (at && tt === 'recovery') { setToken(at) }
    else if (!at) { setExpired(true) }
  }, [])

  const strength = [
    { label: '8 car.', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
    { label: 'Symbole', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = strength.filter(s => s.ok).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('8 caracteres minimum.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${SB_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error_description || 'Erreur lors de la mise a jour')
      setSuccess(true)
      setTimeout(() => { window.location.href = '/login' }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
      <nav style={{ height: 68, display: 'flex', alignItems: 'center', padding: '0 32px', background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 19, color: INK, fontStyle: 'italic' }}>vanivert</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: CARD, borderRadius: 20, padding: '36px 32px', border: `1px solid ${BORDER2}`, boxShadow: '0 8px 40px rgba(13,13,15,0.08)' }}>

            {/* Expired */}
            {expired && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${EM}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>⏱</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 24, color: INK, marginBottom: 10, marginTop: 0 }}>Lien expire</h1>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, marginBottom: 24 }}>Ce lien a expire ou a deja ete utilise. Les liens sont valides 1 heure.</p>
                <a href="/login" style={{ display: 'block', background: INK, color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 980, padding: '13px', textDecoration: 'none', textAlign: 'center' as const }}>
                  Retour a la connexion
                </a>
              </div>
            )}

            {/* Success */}
            {!expired && success && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${GR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 22, color: GR }}>✓</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 24, color: INK, marginBottom: 10, marginTop: 0 }}>Mot de passe mis a jour</h1>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 20 }}>Redirection dans 3 secondes…</p>
                <div style={{ width: '100%', height: 3, background: BG2, borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ height: '100%', background: GR, borderRadius: 2, animation: 'progress 3s linear forwards' }} />
                </div>
                <a href="/login" style={{ fontSize: 13, color: VI, textDecoration: 'none', fontWeight: 500 }}>Connexion maintenant →</a>
              </div>
            )}

            {/* Form */}
            {!expired && !success && (
              <>
                <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 24, color: INK, marginBottom: 8, marginTop: 0 }}>Nouveau mot de passe</h1>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.5 }}>Choisissez un mot de passe fort pour votre compte Vanivert.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: SUBTLE, display: 'block', marginBottom: 6 }}>Nouveau mot de passe</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 caracteres" required
                      style={{ width: '100%', padding: '11px 14px', border: `1px solid ${focusPw ? `${VI}70` : BORDER2}`, borderRadius: 10, fontSize: 14, outline: 'none', background: CARD, boxSizing: 'border-box' as const, color: INK, transition: 'border-color 0.2s' }}
                      onFocus={() => setFocusPw(true)} onBlur={() => setFocusPw(false)} />
                    {password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                          {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'background 0.3s', background: i < score ? score <= 1 ? RED : score <= 2 ? EM : score === 3 ? VI : GR : BORDER2 }} />)}
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                          {strength.map(s => <span key={s.label} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: s.ok ? `${GR}15` : BG2, color: s.ok ? GR : SUBTLE }}>{s.ok ? '✓' : '○'} {s.label}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: SUBTLE, display: 'block', marginBottom: 6 }}>Confirmer le mot de passe</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetez le mot de passe" required
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, color: INK, transition: 'all 0.2s',
                        border: `1px solid ${confirm.length > 0 ? (confirm === password ? `${GR}50` : `${RED}50`) : focusCf ? `${VI}70` : BORDER2}`,
                        background: confirm.length > 0 ? (confirm === password ? `${GR}05` : `${RED}05`) : CARD }}
                      onFocus={() => setFocusCf(true)} onBlur={() => setFocusCf(false)} />
                    {confirm.length > 0 && (
                      <div style={{ fontSize: 12, marginTop: 5, color: confirm === password ? GR : RED }}>
                        {confirm === password ? '✓ Les mots de passe correspondent' : '✗ Ne correspondent pas'}
                      </div>
                    )}
                  </div>
                  {error && <div style={{ background: `${RED}08`, border: `1px solid ${RED}30`, borderRadius: 9, padding: '10px 14px', fontSize: 13, color: RED }}>⚠ {error}</div>}
                  <button type="submit" disabled={loading || password !== confirm || password.length < 8}
                    style={{ background: (loading || password !== confirm || password.length < 8) ? BG2 : INK, color: (loading || password !== confirm || password.length < 8) ? MUTED : '#fff', fontWeight: 600, fontSize: 14, border: 'none', borderRadius: 980, padding: '13px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'system-ui', marginTop: 4 }}>
                    {loading ? 'Mise a jour…' : 'Enregistrer le nouveau mot de passe →'}
                  </button>
                </form>
              </>
            )}
          </div>
          <p style={{ textAlign: 'center', marginTop: 14 }}>
            <a href="/login" style={{ fontSize: 12, color: SUBTLE, textDecoration: 'none' }}>← Retour a la connexion</a>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes progress{from{width:0}to{width:100%}}*{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:rgba(13,13,15,0.3)}`}</style>
    </div>
  )
}
