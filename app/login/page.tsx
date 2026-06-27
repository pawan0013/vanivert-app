'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const E: [number,number,number,number] = [0.16,1,0.3,1]
const C = { bg:'#F7F9FB',w:'#FFFFFF',ink:'#0A090A',g:'#6E6E73',lt:'#E8E8ED',sub:'#F2F2F7',b:'#1F49B0',b2:'#163A8C' }
const vU = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.6,ease:E}} }
const vS = { hidden:{}, visible:{transition:{staggerChildren:0.07}} }

export default function Login() {
  const [mode,setMode]=useState<'login'|'signup'>('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r=>setTimeout(r,1200))
    // TODO: replace with supabase.auth.signInWithPassword({email,password})
    // On success: router.push('/dashboard')
    setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100dvh',background:C.bg,fontFamily:'Inter, sans-serif',display:'flex',flexDirection:'column'}}>
      {/* Nav */}
      <nav style={{padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{fontWeight:800,fontSize:18,color:C.ink,textDecoration:'none',letterSpacing:'-0.04em',display:'flex',alignItems:'center',gap:7}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.b}}/>vanivert
        </a>
        <a href="/demo" style={{fontSize:13,color:C.g,textDecoration:'none'}}>
          Pas encore client? <span style={{color:C.b,fontWeight:600}}>Essai gratuit →</span>
        </a>
      </nav>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
        <motion.div initial="hidden" animate="visible" variants={vS} style={{width:'100%',maxWidth:400}}>
          <motion.div variants={vU} style={{background:C.w,borderRadius:24,padding:40,boxShadow:'0 4px 32px rgba(0,0,0,0.06)',border:`1px solid ${C.lt}`}}>
            <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:26,letterSpacing:'-0.035em',color:C.ink,marginBottom:6,marginTop:0}}>
              {mode==='login'?'Connexion':'Créer un compte'}
            </h1>
            <p style={{fontSize:14,color:C.g,marginBottom:28}}>
              {mode==='login'?'Accédez à votre tableau de bord Vanivert.':'Commencez votre essai gratuit de 30 jours.'}
            </p>

            {/* Mode tabs */}
            <div style={{display:'flex',gap:2,background:C.sub,borderRadius:10,padding:3,marginBottom:24}}>
              {(['login','signup'] as const).map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  style={{flex:1,padding:'8px 0',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'Inter',fontSize:13,fontWeight:600,transition:'all 0.2s',background:mode===m?C.w:'transparent',color:mode===m?C.ink:C.g,boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.08)':'none'}}>
                  {m==='login'?'Connexion':'Inscription'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Email</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="vous@entreprise.fr"
                  style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,transition:'border-color 0.2s'}}
                  onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>
                  Mot de passe
                  {mode==='login'&&<a href="/forgot-password" style={{float:'right',color:C.b,fontSize:11,fontWeight:500,textDecoration:'none'}}>Oublié?</a>}
                </label>
                <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,transition:'border-color 0.2s'}}
                  onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
              </div>

              {error&&(
                <div style={{background:'#FFF1F0',border:'1px solid #FFCCC7',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#CF1322'}}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{background:loading?C.g:C.b,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:980,padding:'14px',cursor:loading?'not-allowed':'pointer',fontFamily:'Inter',transition:'all 0.3s',marginTop:4}}>
                {loading?'Connexion...':(mode==='login'?'Se connecter →':'Créer mon compte →')}
              </button>
            </form>

            <div style={{marginTop:20,paddingTop:20,borderTop:`1px solid ${C.lt}`,textAlign:'center'}}>
              <p style={{fontSize:12,color:C.g,marginBottom:12}}>Ou continuer avec</p>
              <div style={{display:'flex',gap:8}}>
                {[{icon:'🔷',name:'Microsoft'},{ icon:'🔴',name:'Google'}].map(p=>(
                  <button key={p.name}
                    style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px',border:`1.5px solid ${C.lt}`,borderRadius:12,background:C.w,cursor:'pointer',fontFamily:'Inter',fontSize:13,fontWeight:500,color:C.ink,transition:'all 0.2s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.b;(e.currentTarget as HTMLElement).style.background=C.sub}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.lt;(e.currentTarget as HTMLElement).style.background=C.w}}>
                    <span>{p.icon}</span>{p.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={vU} style={{textAlign:'center',marginTop:20}}>
            <p style={{fontSize:12,color:C.g}}>
              Données hébergées en Europe · Conforme RGPD · <a href="/legal/confidentialite" style={{color:C.b,textDecoration:'none'}}>Confidentialité</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
