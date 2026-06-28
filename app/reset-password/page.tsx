'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const C = { bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73', lt:'#E8E8ED', sub:'#F2F2F7', b:'#1F49B0', grn:'#22C55E', red:'#EF4444' }
const E: [number,number,number,number] = [0.16,1,0.3,1]
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')
  const [tokenType, setTokenType] = useState('')
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    // Supabase puts the token in the URL hash after redirect
    // URL looks like: /reset-password#access_token=XXX&type=recovery
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const at = params.get('access_token') || ''
    const tt = params.get('type') || ''
    const err = params.get('error')
    const errCode = params.get('error_code')

    if (err || errCode === 'otp_expired') {
      setExpired(true)
      return
    }

    if (at && tt === 'recovery') {
      setToken(at)
      setTokenType(tt)
    } else if (!at) {
      setExpired(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      // Use the access token from the URL to update the password
      const res = await fetch(`${SB_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: SB_KEY,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error_description || 'Erreur lors de la mise à jour')

      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => { window.location.href = '/login' }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  const strength = [
    { label: '8 caractères', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
    { label: 'Symbole', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const strengthScore = strength.filter(s => s.ok).length

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: C.ink, textDecoration: 'none', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.b, boxShadow: `0 0 8px ${C.b}44` }} />
          vanivert
        </a>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: E }}
          style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ background: C.w, borderRadius: 24, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.07)', border: `1px solid ${C.lt}` }}>

            {/* Expired state */}
            {expired && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏱</div>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', color: C.ink, marginBottom: 10, marginTop: 0 }}>
                  Lien expiré
                </h1>
                <p style={{ fontSize: 14, color: C.g, lineHeight: 1.7, marginBottom: 24 }}>
                  Ce lien de réinitialisation a expiré ou a déjà été utilisé. Les liens sont valides 1 heure.
                  <br /><br />
                  Demandez un nouveau lien depuis la page de connexion.
                </p>
                <a href="/login" style={{ display: 'block', background: C.b, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, padding: '13px', textDecoration: 'none', textAlign: 'center' }}>
                  Retour à la connexion →
                </a>
              </div>
            )}

            {/* Success state */}
            {!expired && success && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>✓</div>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', color: C.ink, marginBottom: 10, marginTop: 0 }}>
                  Mot de passe mis à jour
                </h1>
                <p style={{ fontSize: 14, color: C.g, marginBottom: 20 }}>
                  Votre mot de passe a été changé avec succès. Redirection vers la connexion dans 3 secondes…
                </p>
                <div style={{ width: '100%', height: 4, background: C.sub, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: C.grn, borderRadius: 2, animation: 'progress 3s linear forwards' }} />
                </div>
                <a href="/login" style={{ display: 'block', marginTop: 16, color: C.b, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                  Connexion maintenant →
                </a>
              </div>
            )}

            {/* Reset form */}
            {!expired && !success && (
              <>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 26, letterSpacing: '-0.035em', color: C.ink, marginBottom: 6, marginTop: 0 }}>
                  Nouveau mot de passe
                </h1>
                <p style={{ fontSize: 14, color: C.g, marginBottom: 28 }}>
                  Choisissez un mot de passe fort pour votre compte Vanivert.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.g, display: 'block', marginBottom: 5 }}>
                      Nouveau mot de passe
                    </label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères" required
                      style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.lt}`, borderRadius: 12, fontSize: 14, fontFamily: 'Inter', outline: 'none', background: C.sub, boxSizing: 'border-box' as const, color: C.ink }}
                      onFocus={e => (e.target.style.borderColor = C.b)}
                      onBlur={e => (e.target.style.borderColor = C.lt)} />

                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                          {[0,1,2,3].map(i => (
                            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'background 0.3s',
                              background: i < strengthScore
                                ? strengthScore <= 1 ? C.red : strengthScore <= 2 ? '#F59E0B' : strengthScore === 3 ? '#3B82F6' : C.grn
                                : C.lt }} />
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                          {strength.map(s => (
                            <span key={s.label} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5,
                              background: s.ok ? '#DCFCE7' : C.sub, color: s.ok ? C.grn : C.g, fontWeight: 600 }}>
                              {s.ok ? '✓' : '○'} {s.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.g, display: 'block', marginBottom: 5 }}>
                      Confirmer le mot de passe
                    </label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Répétez le mot de passe" required
                      style={{ width: '100%', padding: '12px 14px',
                        border: `1.5px solid ${confirm.length > 0 ? (confirm === password ? '#BBF7D0' : '#FECACA') : C.lt}`,
                        borderRadius: 12, fontSize: 14, fontFamily: 'Inter', outline: 'none',
                        background: confirm.length > 0 ? (confirm === password ? '#F0FDF4' : '#FEF2F2') : C.sub,
                        boxSizing: 'border-box' as const, color: C.ink }}
                      onFocus={e => { if (!confirm) e.target.style.borderColor = C.b }}
                      onBlur={e => { if (!confirm) e.target.style.borderColor = C.lt }} />
                    {confirm.length > 0 && (
                      <div style={{ fontSize: 12, marginTop: 5, color: confirm === password ? C.grn : C.red }}>
                        {confirm === password ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: C.red }}>
                      ⚠ {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading || password !== confirm || password.length < 8}
                    style={{ background: loading ? C.g : C.b, color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 12, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter', transition: 'all 0.3s', marginTop: 4, opacity: password !== confirm || password.length < 8 ? 0.6 : 1 }}>
                    {loading ? 'Mise à jour…' : 'Enregistrer le nouveau mot de passe →'}
                  </button>
                </form>
              </>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/login" style={{ fontSize: 12, color: C.g, textDecoration: 'none' }}>
              ← Retour à la connexion
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes progress { from { width:0% } to { width:100% } }
        * { box-sizing: border-box }
      `}</style>
    </div>
  )
}
