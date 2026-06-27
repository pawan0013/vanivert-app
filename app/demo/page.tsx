'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const E: [number,number,number,number] = [0.16,1,0.3,1]
const C = { bg:'#F7F9FB',w:'#FFFFFF',ink:'#0A090A',g:'#6E6E73',lt:'#E8E8ED',sub:'#F2F2F7',b:'#1F49B0',b2:'#163A8C',grn:'#30D158' }

const vU = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:0.7,ease:E}} }
const vS = { hidden:{}, visible:{transition:{staggerChildren:0.08}} }

export default function Demo() {
  const [step,setStep]=useState(1)
  const [form,setForm]=useState({name:'',email:'',company:'',employees:'',service:'voice',phone:''})
  const [sent,setSent]=useState(false)

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setStep(3)
  }

  return (
    <div style={{minHeight:'100dvh',background:C.bg,fontFamily:'Inter, sans-serif',display:'flex',flexDirection:'column'}}>
      {/* Nav */}
      <nav style={{padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${C.lt}`,background:C.w}}>
        <a href="/" style={{fontWeight:800,fontSize:18,color:C.ink,textDecoration:'none',letterSpacing:'-0.04em',display:'flex',alignItems:'center',gap:7}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.b}}/>vanivert
        </a>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:13,color:C.g}}>Déjà client?</span>
          <a href="/login" style={{background:C.b,color:'#fff',fontSize:13,fontWeight:700,borderRadius:980,padding:'7px 18px',textDecoration:'none'}}>Connexion</a>
        </div>
      </nav>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px 24px'}}>
        <motion.div initial="hidden" animate="visible" variants={vS} style={{width:'100%',maxWidth:600}}>

          {/* Progress */}
          <motion.div variants={vU} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:36}}>
            {['Votre profil','Votre démo','Confirmation'].map((s,i)=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:step>i?C.b:step===i+1?C.b:'#E5E5EA',color:step>i?'#fff':step===i+1?'#fff':C.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,transition:'all 0.3s'}}>
                    {step>i+1?'✓':i+1}
                  </div>
                  <span style={{fontSize:12,fontWeight:step===i+1?700:400,color:step===i+1?C.ink:C.g}}>{s}</span>
                </div>
                {i<2&&<div style={{width:32,height:1,background:step>i+1?C.b:C.lt}}/>}
              </div>
            ))}
          </motion.div>

          {/* Step 1 */}
          {step===1&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:24,padding:40,boxShadow:'0 4px 32px rgba(0,0,0,0.06)',border:`1px solid ${C.lt}`}}>
              <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:28,letterSpacing:'-0.035em',color:C.ink,marginBottom:8,marginTop:0}}>Démarrez votre essai gratuit</h1>
              <p style={{fontSize:15,color:C.g,lineHeight:1.6,marginBottom:28}}>30 jours gratuits. Aucune carte bancaire. Configuration en 10 minutes.</p>
              <form onSubmit={e=>{e.preventDefault();setStep(2)}} style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Prénom *</label>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      placeholder="Marie" style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                      onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Entreprise *</label>
                    <input required value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))}
                      placeholder="Mon Cabinet" style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                      onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Email professionnel *</label>
                  <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    placeholder="marie@moncabinet.fr" style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Téléphone professionnel *</label>
                  <input required type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                    placeholder="+33 X XX XX XX XX" style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:8}}>Quel produit vous intéresse?</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[{v:'voice',l:'Réception vocale',icon:'🎙️'},{v:'compliance',l:'Conformité DGFiP',icon:'📋'},{v:'cfo',l:'Smart CFO',icon:'📊'}].map(opt=>(
                      <button type="button" key={opt.v} onClick={()=>setForm(f=>({...f,service:opt.v}))}
                        style={{padding:'14px 8px',borderRadius:14,border:`2px solid ${form.service===opt.v?C.b:C.lt}`,background:form.service===opt.v?'#EFF6FF':C.sub,cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}>
                        <div style={{fontSize:20,marginBottom:4}}>{opt.icon}</div>
                        <div style={{fontSize:11,fontWeight:600,color:form.service===opt.v?C.b:C.ink}}>{opt.l}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" style={{background:C.b,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:980,padding:'14px',cursor:'pointer',fontFamily:'Inter',marginTop:4}}>
                  Continuer →
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2 — Demo choice */}
          {step===2&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:24,padding:40,boxShadow:'0 4px 32px rgba(0,0,0,0.06)',border:`1px solid ${C.lt}`}}>
              <h2 style={{fontFamily:'Inter',fontWeight:900,fontSize:26,letterSpacing:'-0.035em',color:C.ink,marginBottom:8,marginTop:0}}>Comment souhaitez-vous découvrir Vanivert?</h2>
              <p style={{fontSize:15,color:C.g,marginBottom:28}}>Choisissez la démo qui correspond à votre rythme.</p>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
                {[
                  {icon:'📞',title:'Appel de démonstration',desc:'15 minutes avec notre équipe. On configure votre compte en direct.',badge:'Le plus rapide',href:'/demo/call'},
                  {icon:'🎙️',title:'Écouter l\'IA vocale maintenant',desc:'Appelez notre numéro de démonstration. Entendez-la répondre en direct.',badge:'',href:'tel:+33XXXXXXXXX'},
                  {icon:'🖥️',title:'Démo autonome',desc:'Accédez à un compte de test avec des données fictives. Explorez à votre rythme.',badge:'Disponible 24h/24',href:'/sandbox'},
                ].map(opt=>(
                  <a key={opt.title} href={opt.href} style={{display:'flex',alignItems:'center',gap:16,padding:'20px 22px',borderRadius:16,border:`1.5px solid ${C.lt}`,background:C.sub,textDecoration:'none',transition:'all 0.3s',cursor:'pointer'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.b;(e.currentTarget as HTMLElement).style.background='#EFF6FF'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.lt;(e.currentTarget as HTMLElement).style.background=C.sub}}>
                    <div style={{width:48,height:48,borderRadius:'50%',background:C.w,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>{opt.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:3,display:'flex',alignItems:'center',gap:8}}>
                        {opt.title}
                        {opt.badge&&<span style={{fontSize:10,fontWeight:700,background:'rgba(31,73,176,0.1)',color:C.b,padding:'2px 8px',borderRadius:6}}>{opt.badge}</span>}
                      </div>
                      <div style={{fontSize:13,color:C.g,lineHeight:1.4}}>{opt.desc}</div>
                    </div>
                    <span style={{color:C.b,fontSize:18,fontWeight:700}}>→</span>
                  </a>
                ))}
              </div>
              <button onClick={()=>setStep(1)} style={{background:'none',border:'none',color:C.g,fontSize:13,cursor:'pointer',fontFamily:'Inter'}}>← Retour</button>
            </motion.div>
          )}

          {/* Step 3 — Confirmation */}
          {step===3&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:24,padding:40,boxShadow:'0 4px 32px rgba(0,0,0,0.06)',border:`1px solid ${C.lt}`,textAlign:'center'}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 20px'}}>✓</div>
              <h2 style={{fontFamily:'Inter',fontWeight:900,fontSize:26,letterSpacing:'-0.035em',color:C.ink,marginBottom:10,marginTop:0}}>Vous êtes inscrit!</h2>
              <p style={{fontSize:15,color:C.g,lineHeight:1.6,marginBottom:28}}>Un membre de notre équipe vous contacte sous 2 heures pour configurer votre compte gratuitement.</p>
              <div style={{background:C.sub,borderRadius:16,padding:'20px 24px',marginBottom:28,textAlign:'left'}}>
                <div style={{fontFamily:'monospace',fontSize:10,textTransform:'uppercase' as const,letterSpacing:'0.1em',color:C.g,marginBottom:12}}>Récapitulatif</div>
                {[['Entreprise',form.company],['Email',form.email],['Téléphone',form.phone],['Service',{voice:'Réception vocale',compliance:'Conformité DGFiP',cfo:'Smart CFO'}[form.service]||'']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'6px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                    <span style={{color:C.g}}>{k}</span><span style={{fontWeight:600,color:C.ink}}>{v}</span>
                  </div>
                ))}
              </div>
              <a href="/" style={{display:'inline-block',background:C.b,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'13px 28px',textDecoration:'none'}}>Retour à l'accueil</a>
            </motion.div>
          )}

          {/* Social proof */}
          <motion.div variants={vU} style={{marginTop:28,textAlign:'center'}}>
            <div style={{fontSize:12,color:C.g,marginBottom:12}}>Ils nous font confiance</div>
            <div style={{display:'flex',gap:20,justifyContent:'center',alignItems:'center',flexWrap:'wrap' as const}}>
              {['Cabinet Dentaire','Kinesithérapie','SARL Industrielle','Hôtel 3★'].map(c=>(
                <div key={c} style={{fontSize:11,color:C.g,background:C.sub,borderRadius:8,padding:'4px 10px'}}>{c}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
