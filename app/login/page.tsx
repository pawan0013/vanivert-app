'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const E: [number,number,number,number] = [0.16,1,0.3,1]
const C = {
  bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73',
  lt:'#E8E8ED', sub:'#F2F2F7', b:'#1F49B0', b2:'#163A8C',
  grn:'#22C55E', red:'#EF4444',
}
const vU = { hidden:{opacity:0,y:18}, visible:{opacity:1,y:0,transition:{duration:0.55,ease:E}} }
const vS = { hidden:{}, visible:{transition:{staggerChildren:0.07}} }

// ── Supabase REST (no SDK — keeps bundle tiny) ────────────────────────────
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

async function sbSignIn(email: string, password: string) {
  const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Identifiants incorrects')
  return data // { access_token, refresh_token, user }
}

async function sbSignUp(email: string, password: string) {
  const res = await fetch(`${SB_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Erreur lors de la création du compte')
  return data
}

async function sbResetPassword(email: string) {
  const res = await fetch(`${SB_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Erreur lors de l\'envoi du lien de réinitialisation')
  return true
}

function saveSession(data: { access_token: string; refresh_token: string; user: { email: string; id: string } }) {
  try {
    localStorage.setItem('vanivert_token', data.access_token)
    localStorage.setItem('vanivert_refresh', data.refresh_token)
    localStorage.setItem('vanivert_user', JSON.stringify({ email: data.user.email, id: data.user.id }))
  } catch {}
}

// ── Input component ────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, right }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; right?: React.ReactNode
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:C.g }}>{label}</label>
        {right}
      </div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required
        style={{ width:'100%', padding:'12px 14px',
          border:`1.5px solid ${focus ? C.b : C.lt}`,
          borderRadius:12, fontSize:14, fontFamily:'Inter', outline:'none',
          background:C.sub, boxSizing:'border-box' as const, color:C.ink,
          transition:'border-color 0.2s' }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
export default function Login() {
  const [mode, setMode] = useState<'login'|'signup'|'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'reset') {
        await sbResetPassword(email)
        setSuccess('Lien de réinitialisation envoyé. Vérifiez votre boîte mail.')
        setLoading(false)
        return
      }

      if (mode === 'signup') {
        const data = await sbSignUp(email, password)
        if (data.user && !data.session) {
          // Email confirmation required
          setSuccess('Compte créé. Vérifiez votre email pour confirmer votre compte.')
          setLoading(false)
          return
        }
        if (data.session) {
          saveSession(data.session)
          window.location.href = '/dashboard'
          return
        }
        throw new Error('Erreur lors de la création du compte')
      }

      // Login
      const data = await sbSignIn(email, password)
      saveSession(data)
      window.location.href = '/dashboard'

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      // Translate common Supabase errors to French
      const translated: Record<string, string> = {
        'Invalid login credentials': 'Email ou mot de passe incorrect.',
        'Email not confirmed': 'Confirmez votre email avant de vous connecter.',
        'User already registered': 'Un compte existe déjà avec cet email.',
        'Password should be at least 6 characters': 'Le mot de passe doit faire au moins 6 caractères.',
        'Unable to validate email address: invalid format': 'Format d\'email invalide.',
        'signup is disabled': 'Les inscriptions sont temporairement désactivées.',
      }
      setError(translated[msg] || msg)
      setLoading(false)
    }
  }

  async function signInWithProvider(provider: 'google' | 'azure') {
    const redirectTo = `${window.location.origin}/dashboard`
    window.location.href = `${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
  }

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, fontFamily:'Inter, sans-serif', display:'flex', flexDirection:'column' }}>
      {/* Nav */}
      <nav style={{ padding:'20px 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontWeight:800, fontSize:18, color:C.ink, textDecoration:'none',
          letterSpacing:'-0.04em', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.b, boxShadow:`0 0 8px ${C.b}44` }}/>
          vanivert
        </a>
        <a href="/demo" style={{ fontSize:13, color:C.g, textDecoration:'none' }}>
          Pas encore client? <span style={{ color:C.b, fontWeight:600 }}>Essai gratuit →</span>
        </a>
      </nav>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
        <motion.div initial="hidden" animate="visible" variants={vS} style={{ width:'100%', maxWidth:400 }}>

          <AnimatePresence mode="wait">
            <motion.div key={mode} variants={vU} initial="hidden" animate="visible" exit={{ opacity:0, y:-12 }}
              style={{ background:C.w, borderRadius:24, padding:40,
                boxShadow:'0 4px 40px rgba(0,0,0,0.07)', border:`1px solid ${C.lt}` }}>

              {/* Header */}
              <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:26, letterSpacing:'-0.035em',
                color:C.ink, marginBottom:6, marginTop:0 }}>
                {mode==='login' ? 'Connexion' : mode==='signup' ? 'Créer un compte' : 'Mot de passe oublié'}
              </h1>
              <p style={{ fontSize:14, color:C.g, marginBottom:24 }}>
                {mode==='login' ? 'Accédez à votre tableau de bord Vanivert.'
                  : mode==='signup' ? 'Commencez votre essai gratuit de 30 jours.'
                  : 'Entrez votre email pour recevoir un lien de réinitialisation.'}
              </p>

              {/* Login / Signup tabs */}
              {mode !== 'reset' && (
                <div style={{ display:'flex', gap:2, background:C.sub, borderRadius:10, padding:3, marginBottom:24 }}>
                  {(['login','signup'] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                      style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', cursor:'pointer',
                        fontFamily:'Inter', fontSize:13, fontWeight:600, transition:'all 0.2s',
                        background:mode===m ? C.w : 'transparent',
                        color:mode===m ? C.ink : C.g,
                        boxShadow:mode===m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                      {m==='login' ? 'Connexion' : 'Inscription'}
                    </button>
                  ))}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <Field label="Email" type="email" value={email}
                  onChange={setEmail} placeholder="vous@entreprise.fr"/>

                {mode !== 'reset' && (
                  <Field label="Mot de passe" type="password" value={password}
                    onChange={setPassword} placeholder="••••••••"
                    right={mode==='login' ? (
                      <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                        style={{ fontSize:11, fontWeight:500, color:C.b, background:'none',
                          border:'none', cursor:'pointer', fontFamily:'Inter', padding:0 }}>
                        Oublié?
                      </button>
                    ) : undefined}/>
                )}

                {/* Password strength hint */}
                {mode === 'signup' && password.length > 0 && (
                  <div style={{ display:'flex', gap:4 }}>
                    {[
                      { label:'6 car.', ok:password.length >= 6 },
                      { label:'Majuscule', ok:/[A-Z]/.test(password) },
                      { label:'Chiffre', ok:/[0-9]/.test(password) },
                    ].map(c => (
                      <span key={c.label} style={{ fontSize:10, padding:'2px 8px', borderRadius:5,
                        background:c.ok ? '#DCFCE7' : C.sub, color:c.ok ? C.grn : C.g, fontWeight:600 }}>
                        {c.ok ? '✓' : '○'} {c.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                    style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10,
                      padding:'10px 14px', fontSize:13, color:C.red, display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0 }}>⚠</span> {error}
                  </motion.div>
                )}

                {/* Success */}
                {success && (
                  <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                    style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10,
                      padding:'10px 14px', fontSize:13, color:C.grn, display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0 }}>✓</span> {success}
                  </motion.div>
                )}

                <button type="submit" disabled={loading || !!success}
                  style={{ background:loading ? C.g : C.b, color:'#fff', fontWeight:700, fontSize:15,
                    border:'none', borderRadius:12, padding:'14px', cursor:loading?'not-allowed':'pointer',
                    fontFamily:'Inter', transition:'all 0.3s', marginTop:4,
                    boxShadow:loading ? 'none' : `0 4px 16px rgba(37,99,235,0.25)` }}>
                  {loading ? (
                    <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)',
                        borderTopColor:'#fff', borderRadius:'50%',
                        animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                      {mode==='reset' ? 'Envoi...' : mode==='signup' ? 'Création...' : 'Connexion...'}
                    </span>
                  ) : (
                    mode==='reset' ? 'Envoyer le lien →'
                      : mode==='signup' ? 'Créer mon compte →'
                      : 'Se connecter →'
                  )}
                </button>

                {mode === 'reset' && (
                  <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                    style={{ background:'none', border:'none', color:C.g, fontSize:13, cursor:'pointer',
                      fontFamily:'Inter', padding:0, textAlign:'center' as const }}>
                    ← Retour à la connexion
                  </button>
                )}
              </form>

              {/* OAuth */}
              {mode !== 'reset' && (
                <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.lt}`, textAlign:'center' as const }}>
                  <p style={{ fontSize:12, color:C.g, marginBottom:12, marginTop:0 }}>Ou continuer avec</p>
                  <div style={{ display:'flex', gap:8 }}>
                    {[
                      { provider:'azure' as const, icon:'🔷', name:'Microsoft' },
                      { provider:'google' as const, icon:'🔴', name:'Google' },
                    ].map(p => (
                      <button key={p.name} onClick={() => signInWithProvider(p.provider)}
                        style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                          gap:8, padding:'11px', border:`1.5px solid ${C.lt}`, borderRadius:12,
                          background:C.w, cursor:'pointer', fontFamily:'Inter', fontSize:13,
                          fontWeight:500, color:C.ink, transition:'all 0.2s' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = C.b
                          ;(e.currentTarget as HTMLElement).style.background = C.sub
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = C.lt
                          ;(e.currentTarget as HTMLElement).style.background = C.w
                        }}>
                        <span>{p.icon}</span>{p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <motion.div variants={vU} style={{ textAlign:'center', marginTop:20 }}>
            <p style={{ fontSize:12, color:C.g, margin:0 }}>
              Données hébergées en Europe · Conforme RGPD ·{' '}
              <a href="/legal/confidentialite" style={{ color:C.b, textDecoration:'none' }}>Confidentialité</a>
            </p>
          </motion.div>

        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box }
        input::placeholder { color: rgba(10,9,10,0.3) }
      `}</style>
    </div>
  )
}
