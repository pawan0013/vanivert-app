'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = { bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73', lt:'#E8E8ED', sub:'#F2F2F7', b:'#1F49B0', grn:'#22C55E', red:'#EF4444', gold:'#F59E0B' }
const E: [number,number,number,number] = [0.16,1,0.3,1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL||''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''

/* Rate limiter: max 5 attempts per 15 min per session */
class RateLimiter {
  private key:string; private max:number; private window:number
  constructor(key:string,max=5,windowMs=900000) { this.key=key; this.max=max; this.window=windowMs }
  check():{ok:boolean;remaining:number;resetIn:number} {
    try {
      const raw=sessionStorage.getItem(this.key)
      const data=raw?JSON.parse(raw):{attempts:[]}
      const now=Date.now()
      const recent=(data.attempts as number[]).filter((t:number)=>now-t<this.window)
      if(recent.length>=this.max) {
        const oldest=Math.min(...recent)
        return {ok:false,remaining:0,resetIn:Math.ceil((oldest+this.window-now)/60000)}
      }
      recent.push(now)
      sessionStorage.setItem(this.key,JSON.stringify({attempts:recent}))
      return {ok:true,remaining:this.max-recent.length,resetIn:0}
    } catch { return {ok:true,remaining:this.max-1,resetIn:0} }
  }
  reset() { try { sessionStorage.removeItem(this.key) } catch {} }
}

const loginLimiter = typeof window!=='undefined' ? new RateLimiter('vanivert_login_rl') : null
const signupLimiter = typeof window!=='undefined' ? new RateLimiter('vanivert_signup_rl',3,3600000) : null

/* Validators */
function validateEmail(e:string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function validatePhone(p:string) { return /^(\+33|0033|0)[1-9](\d{8})$/.test(p.replace(/[\s\-\.]/g,'')) }
function validatePassword(p:string) {
  return {
    len: p.length>=8, upper:/[A-Z]/.test(p), num:/[0-9]/.test(p), sym:/[^A-Za-z0-9]/.test(p),
    score: [p.length>=8,/[A-Z]/.test(p),/[0-9]/.test(p),/[^A-Za-z0-9]/.test(p)].filter(Boolean).length
  }
}

/* Supabase auth helpers */
async function sbSignIn(email:string,password:string) {
  const res=await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{
    method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,password}),
  })
  const data=await res.json()
  if(!res.ok) throw new Error(data.error_description||data.msg||'Identifiants incorrects')
  return data
}
async function sbSignUp(email:string,password:string,phone?:string) {
  const res=await fetch(`${SB_URL}/auth/v1/signup`,{
    method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,password,data:{phone:phone||''}}),
  })
  const data=await res.json()
  if(!res.ok) throw new Error(data.error_description||data.msg||'Erreur lors de la creation du compte')
  return data
}
async function sbReset(email:string) {
  const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||window.location.origin
  const res=await fetch(`${SB_URL}/auth/v1/recover`,{
    method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({email,options:{redirectTo:`${siteUrl}/reset-password`}}),
  })
  if(!res.ok) throw new Error('Erreur lors de l\'envoi du lien')
  return true
}
function saveSession(data:{access_token:string;refresh_token:string;user:{email:string;id:string}}) {
  try {
    localStorage.setItem('vanivert_token',data.access_token)
    localStorage.setItem('vanivert_refresh',data.refresh_token)
    localStorage.setItem('vanivert_user',JSON.stringify({email:data.user.email,id:data.user.id}))
  } catch {}
}

/* OAuth SVGs */
const MicrosoftSVG = () => (
  <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
    <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
    <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
    <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
)
const GoogleSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

/* Field component */
function Field({label,type='text',value,onChange,placeholder,error,right}:{
  label:string;type?:string;value:string;onChange:(v:string)=>void;placeholder:string;error?:string;right?:React.ReactNode
}) {
  const [focus,setFocus]=useState(false)
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <label style={{fontSize:12,fontWeight:600,color:C.g}}>{label}</label>
        {right}
      </div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoComplete="off"
        style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${error?C.red:focus?C.b:C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,color:C.ink,transition:'border-color 0.2s'}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
      {error&&<div style={{fontSize:11,color:C.red,marginTop:4}}>{error}</div>}
    </div>
  )
}

export default function Login() {
  const [mode,setMode]=useState<'login'|'signup'|'reset'>('login')
  const [loginMethod,setLoginMethod]=useState<'email'|'phone'>('email')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [success,setSuccess]=useState('')
  const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({})
  const [rateLimited,setRateLimited]=useState(false)
  const [rlResetIn,setRlResetIn]=useState(0)

  const pw=validatePassword(password)

  const errMap: Record<string,string> = {
    'Invalid login credentials':'Email ou mot de passe incorrect.',
    'Email not confirmed':'Confirmez votre email avant de vous connecter.',
    'User already registered':'Un compte existe deja avec cet email.',
    'Password should be at least 6 characters':'Le mot de passe doit faire au moins 8 caracteres.',
    'Unable to validate email address: invalid format':'Format d\'email invalide.',
    'signup is disabled':'Inscriptions temporairement desactivees.',
  }

  function validate() {
    const errs: Record<string,string>={}
    if(mode!=='phone' && loginMethod==='email' && !validateEmail(email)) errs.email='Email invalide'
    if(loginMethod==='phone' && !validatePhone(phone)) errs.phone='Format invalide (+33 6 12 34 56 78)'
    if(mode!=='reset') {
      if(password.length<8) errs.password='Minimum 8 caracteres'
      if(mode==='signup' && pw.score<3) errs.password='Mot de passe trop faible (majuscule + chiffre + symbole)'
      if(mode==='signup' && confirm!==password) errs.confirm='Les mots de passe ne correspondent pas'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length===0
  }

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    if(!validate()) return
    setError(''); setSuccess('')

    // Rate limit check
    const limiter=mode==='signup'?signupLimiter:loginLimiter
    if(limiter) {
      const rl=limiter.check()
      if(!rl.ok) { setRateLimited(true); setRlResetIn(rl.resetIn); return }
    }

    setLoading(true)
    try {
      if(mode==='reset') {
        await sbReset(email)
        setSuccess('Lien de reinitialisation envoye. Verifiez votre boite mail.')
        setLoading(false)
        return
      }
      if(mode==='signup') {
        const data=await sbSignUp(email,password,phone)
        if(data.user&&!data.session) {
          setSuccess('Compte cree. Verifiez votre email pour confirmer votre compte.')
          setLoading(false)
          return
        }
        if(data.session) { saveSession(data.session); window.location.href='/dashboard'; return }
        throw new Error('Erreur lors de la creation du compte')
      }
      const data=await sbSignIn(loginMethod==='email'?email:phone,password)
      saveSession(data)
      window.location.href='/dashboard'
    } catch(err:unknown) {
      const msg=err instanceof Error?err.message:'Une erreur est survenue'
      setError(errMap[msg]||msg)
      setLoading(false)
    }
  }

  function signInWithProvider(provider:'google'|'azure') {
    const redirectTo=`${window.location.origin}/dashboard`
    window.location.href=`${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
  }

  if(rateLimited) return (
    <div style={{minHeight:'100dvh',background:C.bg,fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:C.w,borderRadius:20,padding:36,maxWidth:380,textAlign:'center',border:`1px solid ${C.lt}`,boxShadow:'0 4px 32px rgba(0,0,0,0.07)'}}>
        <div style={{fontSize:36,marginBottom:14}}>⏱</div>
        <h2 style={{fontWeight:900,fontSize:22,color:C.ink,marginBottom:8,marginTop:0}}>Trop de tentatives</h2>
        <p style={{fontSize:14,color:C.g,marginBottom:20}}>Pour votre securite, les connexions ont ete temporairement bloquees. Reessayez dans <strong>{rlResetIn} minute(s)</strong>.</p>
        <button onClick={()=>setRateLimited(false)} style={{width:'100%',padding:'12px',background:C.b,color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'Inter'}}>Retour</button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100dvh',background:C.bg,fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column'}}>
      <nav style={{padding:'18px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{fontWeight:800,fontSize:18,color:C.ink,textDecoration:'none',letterSpacing:'-0.04em',display:'flex',alignItems:'center',gap:7}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.b,boxShadow:`0 0 8px ${C.b}44`}}/>vanivert
        </a>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <a href="/admin" style={{fontSize:13,color:C.g,textDecoration:'none'}}>Acces admin</a>
          <a href="/demo" style={{fontSize:13,color:C.g,textDecoration:'none'}}>Pas encore client? <span style={{color:C.b,fontWeight:600}}>Essai gratuit</span></a>
        </div>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:E}} style={{width:'100%',maxWidth:420}}>
          <div style={{background:C.w,borderRadius:24,padding:'36px 36px 32px',boxShadow:'0 4px 40px rgba(0,0,0,0.07)',border:`1px solid ${C.lt}`}}>
            <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:24,letterSpacing:'-0.035em',color:C.ink,marginBottom:4,marginTop:0}}>
              {mode==='login'?'Connexion':mode==='signup'?'Creer un compte':'Mot de passe oublie'}
            </h1>
            <p style={{fontSize:14,color:C.g,marginBottom:22}}>
              {mode==='login'?'Acces a votre tableau de bord Vanivert.':mode==='signup'?'Commencez votre essai gratuit de 30 jours.':'Entrez votre email pour recevoir un lien.'}
            </p>

            {/* Mode tabs */}
            {mode!=='reset'&&(
              <div style={{display:'flex',gap:2,background:C.sub,borderRadius:10,padding:3,marginBottom:22}}>
                {(['login','signup'] as const).map(m=>(
                  <button key={m} onClick={()=>{setMode(m);setError('');setSuccess('');setFieldErrors({})}}
                    style={{flex:1,padding:'8px 0',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'Inter',fontSize:13,fontWeight:600,transition:'all 0.2s',
                      background:mode===m?C.w:'transparent',color:mode===m?C.ink:C.g,boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.08)':'none'}}>
                    {m==='login'?'Connexion':'Inscription'}
                  </button>
                ))}
              </div>
            )}

            {/* Login method toggle (signup only) */}
            {mode==='signup'&&(
              <div style={{display:'flex',gap:6,marginBottom:16}}>
                {(['email','phone'] as const).map(m=>(
                  <button key={m} onClick={()=>setLoginMethod(m)}
                    style={{flex:1,padding:'7px',borderRadius:9,border:`1px solid ${loginMethod===m?C.b:C.lt}`,cursor:'pointer',fontFamily:'Inter',fontSize:12,fontWeight:600,
                      background:loginMethod===m?'#EEF2FF':'transparent',color:loginMethod===m?C.b:C.g}}>
                    {m==='email'?'Email':'Telephone'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              {/* Email field */}
              {(loginMethod==='email'||mode==='login'||mode==='reset')&&(
                <Field label="Email" type="email" value={email} onChange={setEmail}
                  placeholder="vous@entreprise.fr" error={fieldErrors.email}/>
              )}
              {/* Phone field (signup) */}
              {mode==='signup'&&loginMethod==='phone'&&(
                <Field label="Telephone professionnel" type="tel" value={phone} onChange={setPhone}
                  placeholder="+33 6 12 34 56 78" error={fieldErrors.phone}/>
              )}
              {/* Also collect email for phone signup */}
              {mode==='signup'&&loginMethod==='phone'&&(
                <Field label="Email (pour confirmation)" type="email" value={email} onChange={setEmail}
                  placeholder="vous@entreprise.fr" error={fieldErrors.email}/>
              )}

              {mode!=='reset'&&(
                <Field label="Mot de passe" type="password" value={password} onChange={setPassword}
                  placeholder="Minimum 8 caracteres" error={fieldErrors.password}
                  right={mode==='login'?(
                    <button type="button" onClick={()=>{setMode('reset');setError('');setSuccess('')}}
                      style={{fontSize:11,fontWeight:500,color:C.b,background:'none',border:'none',cursor:'pointer',fontFamily:'Inter',padding:0}}>
                      Oublie?
                    </button>
                  ):undefined}/>
              )}

              {/* Password strength (signup) */}
              {mode==='signup'&&password.length>0&&(
                <div>
                  <div style={{display:'flex',gap:3,marginBottom:5}}>
                    {[0,1,2,3].map(i=>(
                      <div key={i} style={{flex:1,height:3,borderRadius:2,transition:'background 0.3s',
                        background:i<pw.score?pw.score<=1?C.red:pw.score<=2?C.gold:pw.score===3?C.b:C.grn:C.lt}}/>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {[{l:'8 car.',ok:pw.len},{l:'Majuscule',ok:pw.upper},{l:'Chiffre',ok:pw.num},{l:'Symbole',ok:pw.sym}].map(c=>(
                      <span key={c.l} style={{fontSize:10,padding:'2px 7px',borderRadius:5,background:c.ok?'#DCFCE7':C.sub,color:c.ok?C.grn:C.g,fontWeight:600}}>
                        {c.ok?'ok':'o'} {c.l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm password */}
              {mode==='signup'&&(
                <Field label="Confirmer le mot de passe" type="password" value={confirm} onChange={setConfirm}
                  placeholder="Repetez le mot de passe" error={fieldErrors.confirm}/>
              )}

              {/* RGPD notice for signup */}
              {mode==='signup'&&(
                <div style={{fontSize:11,color:C.g,lineHeight:1.6,padding:'8px 12px',borderRadius:8,background:C.sub,border:`1px solid ${C.lt}`}}>
                  En creant un compte, vous acceptez nos <a href="/legal/cgv" style={{color:C.b}}>CGV</a> et notre <a href="/legal/confidentialite" style={{color:C.b}}>politique de confidentialite</a>. Donnees hebergees en Europe (Supabase IE).
                </div>
              )}

              {error&&(
                <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px',fontSize:13,color:C.red,display:'flex',gap:7,alignItems:'flex-start'}}>
                  <span style={{flexShrink:0}}>!</span> {error}
                </div>
              )}
              {success&&(
                <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'10px 14px',fontSize:13,color:C.grn,display:'flex',gap:7,alignItems:'flex-start'}}>
                  <span style={{flexShrink:0}}>ok</span> {success}
                </div>
              )}

              <button type="submit" disabled={loading||!!success}
                style={{background:loading?C.g:C.b,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:12,padding:'13px',cursor:loading?'not-allowed':'pointer',fontFamily:'Inter',transition:'all 0.3s',marginTop:2,boxShadow:loading?'none':`0 4px 16px rgba(37,99,235,0.25)`,opacity:loading||!!success?0.8:1}}>
                {loading?(
                  <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    <span style={{width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block'}}/>
                    {mode==='reset'?'Envoi...':mode==='signup'?'Creation...':'Connexion...'}
                  </span>
                ):mode==='reset'?'Envoyer le lien':mode==='signup'?'Creer mon compte':'Se connecter'}
              </button>

              {mode==='reset'&&(
                <button type="button" onClick={()=>{setMode('login');setError('');setSuccess('')}}
                  style={{background:'none',border:'none',color:C.g,fontSize:13,cursor:'pointer',fontFamily:'Inter',padding:0,textAlign:'center'}}>
                  Retour a la connexion
                </button>
              )}
            </form>

            {/* OAuth */}
            {mode!=='reset'&&(
              <div style={{marginTop:20,paddingTop:18,borderTop:`1px solid ${C.lt}`,textAlign:'center'}}>
                <p style={{fontSize:12,color:C.g,marginBottom:12,marginTop:0}}>Ou continuer avec</p>
                <div style={{display:'flex',gap:8}}>
                  {[
                    {provider:'azure' as const,svg:<MicrosoftSVG/>,name:'Microsoft'},
                    {provider:'google' as const,svg:<GoogleSVG/>,name:'Google'},
                  ].map(p=>(
                    <button key={p.name} onClick={()=>signInWithProvider(p.provider)}
                      style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',border:`1.5px solid ${C.lt}`,borderRadius:12,background:C.w,cursor:'pointer',fontFamily:'Inter',fontSize:13,fontWeight:500,color:C.ink,transition:'all 0.2s'}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.b;(e.currentTarget as HTMLElement).style.background=C.sub}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.lt;(e.currentTarget as HTMLElement).style.background=C.w}}>
                      {p.svg}{p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{textAlign:'center',marginTop:16}}>
            <p style={{fontSize:12,color:C.g,margin:0}}>
              Donnees hebergees en Europe - Conforme RGPD -
              <a href="/legal/confidentialite" style={{color:C.b,textDecoration:'none'}}> Confidentialite</a>
            </p>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}input::placeholder{color:rgba(10,9,10,0.3)}`}</style>
    </div>
  )
}
