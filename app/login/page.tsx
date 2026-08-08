'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── DARK THEME TOKENS ────────────────────────────────────────────────────────
const LIME   = '#84CC16'
const LIME2  = '#6BAE0F'
const LIME_LT= 'rgba(132,204,22,0.12)'
const TEAL   = '#2DD4BF'
const WHITE  = '#FFFFFF'
const OFF    = '#F1F5F9'
const MUTED  = '#94A3B8'
const SUBTLE = '#64748B'
const RED    = '#F87171'
const GR     = '#4ADE80'
const EM     = '#FBBF24'
const BG     = '#020617'
const BG2    = '#0F3843'
const CARD   = 'rgba(30,41,59,0.70)'
const BDR    = 'rgba(100,200,200,0.12)'
const BDR2   = 'rgba(100,200,200,0.22)'
const EZ: [number,number,number,number] = [0.32,0.72,0,1]
const FH = "'Plus Jakarta Sans',system-ui,sans-serif"
const FB = "'Inter',system-ui,sans-serif"

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ── RATE LIMITER ──────────────────────────────────────────────────────────────
class RL {
  private key: string; private max: number; private win: number
  constructor(key: string, max=5, win=900000) { this.key=key; this.max=max; this.win=win }
  check(): {ok:boolean;resetIn:number} {
    try {
      const raw=sessionStorage.getItem(this.key); const data=raw?JSON.parse(raw):{a:[]}
      const now=Date.now(); const recent:number[]=(data.a as number[]).filter((t:number)=>now-t<this.win)
      if (recent.length>=this.max) return {ok:false,resetIn:Math.ceil((Math.min(...recent)+this.win-now)/60000)}
      recent.push(now); sessionStorage.setItem(this.key,JSON.stringify({a:recent})); return {ok:true,resetIn:0}
    } catch { return {ok:true,resetIn:0} }
  }
}

const isEmail = (v:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isPhone = (v:string) => /^(\+33|0033|0)[1-9](\d{8})$/.test(v.replace(/[\s\-.]/g,''))
function pwStrength(p:string) {
  return { len:p.length>=8, upper:/[A-Z]/.test(p), num:/[0-9]/.test(p), sym:/[^A-Za-z0-9]/.test(p), score:[p.length>=8,/[A-Z]/.test(p),/[0-9]/.test(p),/[^A-Za-z0-9]/.test(p)].filter(Boolean).length }
}

async function sbLogin(email:string,password:string) {
  const r=await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})})
  const d=await r.json(); if (!r.ok) throw new Error(d.error_description||d.msg||'Identifiants incorrects'); return d
}
async function sbSignup(email:string,password:string,phone?:string) {
  const r=await fetch(`${SB_URL}/auth/v1/signup`,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password,data:{phone:phone||''}})})
  const d=await r.json()
  if (!r.ok||d.error||d.error_code) throw new Error(d.error_description||d.msg||d.error||d.message||'Erreur lors de la création')
  return d
}
async function sbReset(email:string) {
  const siteUrl=typeof window!=='undefined'?window.location.origin:''
  const r=await fetch(`${SB_URL}/auth/v1/recover`,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,options:{redirectTo:`${siteUrl}/reset-password`}})})
  if (!r.ok) throw new Error("Erreur lors de l'envoi")
}
function saveSession(d:{access_token:string;refresh_token:string;user:{email:string;id:string}}) {
  try { localStorage.setItem('vanivert_token',d.access_token); localStorage.setItem('vanivert_refresh',d.refresh_token); localStorage.setItem('vanivert_user',JSON.stringify({email:d.user.email,id:d.user.id})) } catch {}
}

function MsIcon() {
  return <svg width="16" height="16" viewBox="0 0 21 21"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
}
function GgIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
}

function Logo({ s=30 }: { s?:number }) {
  const cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.15
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><circle cx={cx} cy={cy} r={R} stroke={LIME} strokeWidth={1} fill="none" strokeOpacity="0.5"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill={LIME} opacity={i%2===0?"0.9":"0.5"}/>)}<circle cx={cx} cy={cy} r={cr} fill={LIME}/></svg>)
}

function Input({ label,type='text',value,onChange,placeholder,error,right }:{label:string;type?:string;value:string;onChange:(v:string)=>void;placeholder:string;error?:string;right?:React.ReactNode}) {
  const [focus,setFocus]=useState(false)
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <label style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>{label}</label>
        {right}
      </div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:'100%',padding:'12px 14px',border:`1px solid ${error?RED:focus?`${LIME}60`:BDR2}`,borderRadius:10,background:'rgba(30,41,59,0.60)',color:WHITE,fontSize:14,fontFamily:FB,outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
      {error&&<div style={{fontSize:11,color:RED,marginTop:4,fontFamily:FB}}>{error}</div>}
    </div>
  )
}

export default function Login() {
  const [mode,setMode]=useState<'login'|'signup'|'reset'>('login')
  const [method,setMethod]=useState<'email'|'phone'>('email')
  const [email,setEmail]=useState(''); const [phone,setPhone]=useState(''); const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState(''); const [loading,setLoading]=useState(false)
  const [error,setError]=useState(''); const [success,setSuccess]=useState('')
  const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({}); const [locked,setLocked]=useState(false); const [lockMin,setLockMin]=useState(0)
  const pw=pwStrength(password)

  const errMap:Record<string,string>={
    'Invalid login credentials':'Email ou mot de passe incorrect.',
    'Email not confirmed':'Vérifiez votre email : un lien de confirmation vous a été envoyé.',
    'User already registered':'Un compte existe déjà avec cet email. Connectez-vous.',
    'Password should be at least 6 characters':'Le mot de passe doit faire au moins 8 caractères.',
    'Email rate limit exceeded':'Trop de tentatives. Attendez quelques minutes et réessayez.',
  }

  function validate() {
    const e:Record<string,string>={}
    if (method==='email'&&!isEmail(email)) e.email='Email invalide'
    if (method==='phone'&&!isPhone(phone)) e.phone='Format : +33 6 12 34 56 78'
    if (mode!=='reset') {
      if (password.length<8) e.password='8 caractères minimum'
      if (mode==='signup'&&pw.score<3) e.password='Trop faible. Ajoutez majuscule, chiffre et symbole.'
      if (mode==='signup'&&confirm!==password) e.confirm='Les mots de passe ne correspondent pas'
    }
    setFieldErrors(e); return Object.keys(e).length===0
  }

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault(); if (!validate()) return
    setError(''); setSuccess('')
    const rl=new RL('vanivert_login_rl'); const check=rl.check()
    if (!check.ok) { setLocked(true); setLockMin(check.resetIn); return }
    setLoading(true)
    try {
      if (mode==='reset') { await sbReset(email); setSuccess('Lien envoyé. Vérifiez votre boîte mail.'); setLoading(false); return }
      if (mode==='signup') {
        const d=await sbSignup(email,password,phone)
        if (d.session) { saveSession(d.session); window.location.href='/dashboard'; return }
        if (d.user&&d.user.id) {
          if (d.user.identities&&d.user.identities.length===0) throw new Error('Un compte existe déjà avec cet email.')
          setSuccess('Compte créé ! Vérifiez votre boîte email pour confirmer.'); setLoading(false); return
        }
        throw new Error('Erreur inattendue. Réessayez dans quelques secondes.')
      }
      const d=await sbLogin(method==='email'?email:phone,password); saveSession(d); window.location.href='/dashboard'
    } catch (err:unknown) {
      const msg=err instanceof Error?err.message:'Une erreur est survenue'
      const matched=Object.keys(errMap).find(k=>msg.includes(k)||msg.startsWith(k))
      setError(matched?errMap[matched]:msg); setLoading(false)
    }
  }

  function oAuth(provider:'google'|'azure') {
    const redirect=typeof window!=='undefined'?`${window.location.origin}/dashboard`:''
    window.location.href=`${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirect)}`
  }

  if (locked) return (
    <div style={{minHeight:'100dvh',background:BG,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FB}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:${BG}}`}</style>
      <div style={{background:CARD,border:`1px solid ${BDR2}`,borderRadius:20,padding:'36px 32px',maxWidth:380,textAlign:'center',backdropFilter:'blur(16px)'}}>
        <div style={{width:48,height:48,borderRadius:12,background:`rgba(251,191,36,0.15)`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24}}>⏱</div>
        <div style={{fontSize:18,fontFamily:FH,fontWeight:700,color:WHITE,marginBottom:10}}>Trop de tentatives</div>
        <p style={{fontSize:14,color:MUTED,lineHeight:1.6,marginBottom:24,fontFamily:FB}}>Réessayez dans <strong style={{color:WHITE}}>{lockMin} minute(s)</strong>.</p>
        <button onClick={()=>setLocked(false)} style={{width:'100%',padding:'12px',background:LIME,color:'#000',border:'none',borderRadius:10,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:FH}}>Retour</button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100dvh',background:`linear-gradient(160deg,${BG2} 0%,${BG} 60%)`,display:'flex',flexDirection:'column',fontFamily:FB}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500&display=swap');@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:${SUBTLE}}body{background:${BG}}`}</style>

      {/* Glow orbs */}
      <div style={{position:'fixed',top:'8%',left:'10%',width:'40vw',height:'40vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.06) 0%,transparent 65%)`,pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',bottom:'5%',right:'8%',width:'30vw',height:'30vw',maxWidth:400,borderRadius:'50%',background:`radial-gradient(circle,rgba(45,212,191,0.05) 0%,transparent 65%)`,pointerEvents:'none',zIndex:0}}/>

      {/* Nav */}
      <nav style={{height:68,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',background:'rgba(2,6,23,0.80)',backdropFilter:'blur(18px)',borderBottom:`1px solid ${BDR}`,position:'relative',zIndex:10}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
          <Logo s={28}/><span style={{fontFamily:FH,fontWeight:700,fontSize:17,color:WHITE,letterSpacing:'-0.02em'}}>Vanivert</span>
        </a>
        <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
          style={{fontSize:14,fontWeight:700,color:'#000',textDecoration:'none',padding:'10px 22px',borderRadius:980,background:LIME,fontFamily:FH}}>
          Essai gratuit
        </a>
      </nav>

      {/* Main */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 20px',position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:EZ}} style={{width:'100%',maxWidth:420}}>
          <div style={{background:CARD,borderRadius:20,padding:'36px 32px',border:`1px solid ${BDR2}`,backdropFilter:'blur(20px)',boxShadow:'0 24px 60px rgba(0,0,0,0.40)'}}>
            {/* Mode tabs */}
            {mode!=='reset'&&(
              <div style={{display:'flex',gap:4,background:'rgba(255,255,255,0.05)',borderRadius:12,padding:4,marginBottom:28}}>
                {(['login','signup'] as const).map(m=>(
                  <button key={m} onClick={()=>{setMode(m);setError('');setSuccess('');setFieldErrors({})}}
                    style={{flex:1,padding:'9px 0',borderRadius:9,border:'none',cursor:'pointer',fontFamily:FH,fontSize:13,fontWeight:500,transition:'all 0.2s',background:mode===m?LIME:'transparent',color:mode===m?'#000':MUTED,boxShadow:mode===m?'0 2px 8px rgba(132,204,22,0.20)':'none'}}>
                    {m==='login'?'Connexion':'Inscription'}
                  </button>
                ))}
              </div>
            )}

            <h1 style={{fontFamily:FH,fontWeight:700,fontSize:22,color:WHITE,marginBottom:6,marginTop:0}}>
              {mode==='login'?'Content de vous revoir.':mode==='signup'?"On commence ?":'Mot de passe oublié ?'}
            </h1>
            <p style={{fontSize:13,color:MUTED,marginBottom:24,lineHeight:1.5,fontFamily:FB}}>
              {mode==='login'?"Accès à votre espace Vanivert.":mode==='signup'?'30 jours gratuits, sans carte bancaire.':"On vous envoie un lien par email."}
            </p>

            {mode==='signup'&&(
              <div style={{display:'flex',gap:6,marginBottom:16}}>
                {(['email','phone'] as const).map(m=>(
                  <button key={m} onClick={()=>setMethod(m)}
                    style={{flex:1,padding:'8px',borderRadius:9,border:`1.5px solid ${method===m?LIME:BDR}`,background:method===m?LIME_LT:'transparent',color:method===m?LIME:MUTED,fontFamily:FB,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all 0.2s'}}>
                    {m==='email'?'Email':'Téléphone'}
                  </button>
                ))}
              </div>
            )}

            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {(method==='email'||mode==='login'||mode==='reset')&&(
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@entreprise.fr" error={fieldErrors.email}/>
              )}
              {mode==='signup'&&method==='phone'&&(
                <Input label="Téléphone" type="tel" value={phone} onChange={setPhone} placeholder="+33 6 12 34 56 78" error={fieldErrors.phone}/>
              )}
              {mode==='signup'&&method==='phone'&&(
                <Input label="Email (pour la confirmation)" type="email" value={email} onChange={setEmail} placeholder="vous@entreprise.fr" error={fieldErrors.email}/>
              )}
              {mode!=='reset'&&(
                <Input label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="8 caractères minimum" error={fieldErrors.password}
                  right={mode==='login'?(
                    <button type="button" onClick={()=>{setMode('reset');setError('');setSuccess('')}}
                      style={{fontSize:11,color:LIME,background:'none',border:'none',cursor:'pointer',fontFamily:FB,fontWeight:500}}>Oublié ?</button>
                  ):undefined}/>
              )}

              {mode==='signup'&&password.length>0&&(
                <div>
                  <div style={{display:'flex',gap:4,marginBottom:6}}>
                    {[0,1,2,3].map(i=>(
                      <div key={i} style={{flex:1,height:3,borderRadius:2,transition:'background 0.3s',background:i<pw.score?pw.score<=1?RED:pw.score<=2?EM:pw.score===3?TEAL:GR:BDR2}}/>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap' as const}}>
                    {[{l:'8 car.',ok:pw.len},{l:'Majuscule',ok:pw.upper},{l:'Chiffre',ok:pw.num},{l:'Symbole',ok:pw.sym}].map(c=>(
                      <span key={c.l} style={{fontSize:9,padding:'2px 7px',borderRadius:5,background:c.ok?'rgba(74,222,128,0.12)':'rgba(255,255,255,0.05)',color:c.ok?GR:SUBTLE,fontFamily:FB}}>
                        {c.ok?'✓':'○'} {c.l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {mode==='signup'&&(
                <Input label="Confirmer le mot de passe" type="password" value={confirm} onChange={setConfirm} placeholder="Répétez le mot de passe" error={fieldErrors.confirm}/>
              )}

              {mode==='signup'&&(
                <div style={{fontSize:11,color:SUBTLE,lineHeight:1.6,padding:'9px 12px',borderRadius:9,background:'rgba(255,255,255,0.04)',border:`1px solid ${BDR}`,fontFamily:FB}}>
                  En créant un compte, vous acceptez nos <a href="/legal/cgv" style={{color:MUTED}}>CGV</a> et notre <a href="/legal/confidentialite" style={{color:MUTED}}>politique de confidentialité</a>. Données hébergées en Europe.
                </div>
              )}

              {error&&(
                <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.30)',borderRadius:9,padding:'10px 14px',fontSize:13,color:RED,fontFamily:FB}}>{error}</div>
              )}
              {success&&(
                <div style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.30)',borderRadius:9,padding:'10px 14px',fontSize:13,color:GR,fontFamily:FB}}>{success}</div>
              )}

              <button onClick={handleSubmit} disabled={loading||!!success}
                style={{background:loading?'rgba(255,255,255,0.10)':LIME,color:loading?MUTED:'#000',fontWeight:700,fontSize:14,border:'none',borderRadius:980,padding:'13px',cursor:loading?'not-allowed':'pointer',fontFamily:FH,transition:'all 0.2s',marginTop:4,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                {loading?(
                  <span style={{width:16,height:16,border:`2px solid ${BDR2}`,borderTopColor:MUTED,borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block'}}/>
                ):mode==='reset'?'Envoyer le lien':mode==='signup'?'Créer mon compte':'Me connecter →'}
              </button>

              {mode==='reset'&&(
                <button type="button" onClick={()=>{setMode('login');setError('');setSuccess('')}}
                  style={{background:'none',border:'none',color:SUBTLE,fontSize:13,cursor:'pointer',fontFamily:FB,textAlign:'center' as const}}>
                  ← Retour à la connexion
                </button>
              )}
            </div>

            {mode!=='reset'&&(
              <div style={{marginTop:22,paddingTop:20,borderTop:`1px solid ${BDR}`}}>
                <p style={{fontSize:11,color:SUBTLE,textAlign:'center' as const,marginBottom:12,fontFamily:FB}}>Ou continuer avec</p>
                <div style={{display:'flex',gap:8}}>
                  {[{p:'azure' as const,icon:<MsIcon/>,label:'Microsoft'},{p:'google' as const,icon:<GgIcon/>,label:'Google'}].map(({p,icon,label})=>(
                    <button key={p} onClick={()=>oAuth(p)}
                      style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',border:`1px solid ${BDR2}`,borderRadius:10,background:'rgba(255,255,255,0.04)',cursor:'pointer',fontFamily:FB,fontSize:13,fontWeight:500,color:OFF,transition:'all 0.2s'}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.08)';(e.currentTarget as HTMLElement).style.borderColor=BDR2}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor=BDR2}}>
                      {icon}{label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p style={{textAlign:'center',marginTop:16,fontSize:11,color:SUBTLE,fontFamily:FB}}>
            Données hébergées en Europe (Supabase Irlande).{' '}
            <a href="/legal/confidentialite" style={{color:SUBTLE,textDecoration:'underline'}}>Confidentialité</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
