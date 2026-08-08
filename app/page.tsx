'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { DEFAULT_ARTICLES } from '@/lib/articles'

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG_PAGE  = 'linear-gradient(160deg,#0F3843 0%,#0A2030 40%,#020617 100%)'
const BG_SEC   = 'linear-gradient(160deg,#0B2D38 0%,#071520 100%)'
const BG_DEEP  = 'linear-gradient(160deg,#061D28 0%,#020D16 100%)'
const BG_CARD  = 'rgba(30,41,59,0.55)'
const LIME     = '#84CC16'
const LIME2    = '#6BAE0F'
const LIME_LT  = 'rgba(132,204,22,0.13)'
const LIME_GL  = 'rgba(132,204,22,0.22)'
const TEAL     = '#2DD4BF'
const WHITE    = '#FFFFFF'
const OFF      = '#F1F5F9'
const MUTED    = '#94A3B8'
const SUBTLE   = '#64748B'
const ORANGE   = '#FB923C'
const PURPLE   = '#A78BFA'
const BDR      = 'rgba(100,200,200,0.12)'
const BDR2     = 'rgba(100,200,200,0.22)'
const BDR_LIME = 'rgba(132,204,22,0.35)'
const FH       = "'Plus Jakarta Sans',system-ui,sans-serif"
const FB       = "'Inter',system-ui,sans-serif"
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const AI_PHONE_TEL = 'tel:+33221826074'
const AI_PHONE_INT = '+33 2 21 82 60 74'
const SIRET        = '93429900900019'
const EMAIL        = 'team@vanivert.eu'
const ADDRESS      = '1 Clos des Sylthes, 95800 Cergy, France'
const CMS_KEY      = 'vanivert_cms_v4'

// ── FREE EMAIL DOMAINS ────────────────────────────────────────────────────────
const FREE_DOMAINS = ['gmail.com','yahoo.com','yahoo.fr','hotmail.com','hotmail.fr','outlook.com','outlook.fr','live.com','live.fr','icloud.com','aol.com','gmx.com','gmx.fr','laposte.net','free.fr','orange.fr','wanadoo.fr','sfr.fr','protonmail.com','mail.com','yandex.com']
function isPro(email:string):boolean {
  const parts = email.split('@')
  return parts.length===2 && !FREE_DOMAINS.includes(parts[1].toLowerCase().trim())
}

// ── SCROLL BAR ────────────────────────────────────────────────────────────────
function ScrollBar() {
  const {scrollYProgress} = useScroll()
  const scaleX = useTransform(scrollYProgress,[0,1],[0,1])
  return <motion.div style={{position:'fixed',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${LIME},${TEAL})`,transformOrigin:'left',scaleX,zIndex:600,pointerEvents:'none'}}/>
}

// ── FADE UP ───────────────────────────────────────────────────────────────────
function FadeUp({children,delay=0,style={},className}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties;className?:string}) {
  const ref=useRef<HTMLDivElement>(null)
  const inV=useInView(ref,{once:true,margin:'-50px'})
  return (
    <motion.div ref={ref} initial={{opacity:0,y:22}} animate={inV?{opacity:1,y:0}:{}} transition={{duration:0.7,ease:EZ,delay}} style={style} className={className}>
      {children}
    </motion.div>
  )
}

// ── LOGO ──────────────────────────────────────────────────────────────────────
function Logo({s=32}:{s?:number}) {
  const cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.15
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={LIME} strokeWidth={1} fill="none" strokeOpacity="0.5"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill={LIME} opacity={i%2===0?"0.9":"0.5"}/>)}
      <circle cx={cx} cy={cy} r={cr} fill={LIME}/>
    </svg>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc,setSc]=useState(false)
  const [mob,setMob]=useState(false)
  useEffect(()=>{const h=()=>setSc(window.scrollY>30);window.addEventListener('scroll',h,{passive:true});return()=>window.removeEventListener('scroll',h)},[])
  const links:[string,string][]=[['Fonctionnalités','#features'],['ROI','#roi'],["Tester l'IA",'#tester-ia'],['Équipe','#team'],['Investisseurs','#investors']]
  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,height:64,display:'flex',alignItems:'center',background:sc?'rgba(8,30,44,0.96)':'transparent',backdropFilter:sc?'blur(20px)':'none',WebkitBackdropFilter:sc?'blur(20px)':'none',borderBottom:`1px solid ${sc?BDR2:'transparent'}`,transition:'all 0.35s cubic-bezier(0.32,0.72,0,1)'}}>
        <div style={{maxWidth:1240,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <Logo s={30}/>
            <span style={{fontFamily:FH,fontSize:17,color:WHITE,fontWeight:700,letterSpacing:'-0.02em'}}>Vanivert</span>
          </a>
          <div className="nav-links" style={{display:'flex',gap:2}}>
            {links.map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'7px 13px',borderRadius:8,fontWeight:450,transition:'color 0.2s',fontFamily:FB}}
                onMouseEnter={e=>(e.currentTarget.style.color=WHITE)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
            ))}
          </div>
          <div className="nav-links" style={{display:'flex',gap:10,alignItems:'center'}}>
            <a href="/login" style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'8px 14px',fontWeight:450,transition:'color 0.2s',fontFamily:FB}}
              onMouseEnter={e=>(e.currentTarget.style.color=WHITE)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>Connexion</a>
            <a href={AI_PHONE_TEL} style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'8px 14px',fontWeight:450,display:'inline-flex',alignItems:'center',gap:6,transition:'color 0.2s',fontFamily:FB}}
              onMouseEnter={e=>(e.currentTarget.style.color=LIME)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>📞 Appeler l&apos;IA</a>
            <a href="#contact" style={{fontSize:13,fontWeight:700,color:'#000',textDecoration:'none',padding:'9px 22px',borderRadius:980,background:LIME,display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s',boxShadow:`0 4px 18px ${LIME_GL}`,fontFamily:FH}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              Demander une démo
            </a>
          </div>
          <button className="mob-nav" onClick={()=>setMob(!mob)} style={{display:'none',background:'none',border:`1px solid ${BDR2}`,borderRadius:10,cursor:'pointer',padding:'8px 10px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            <motion.span animate={{rotate:mob?45:0,y:mob?5.5:0}} style={{width:18,height:1.5,background:WHITE,display:'block',transformOrigin:'center'}}/>
            <motion.span animate={{opacity:mob?0:1}} style={{width:18,height:1.5,background:WHITE,display:'block'}}/>
            <motion.span animate={{rotate:mob?-45:0,y:mob?-5.5:0}} style={{width:18,height:1.5,background:WHITE,display:'block',transformOrigin:'center'}}/>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mob&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:250,background:'rgba(6,22,32,0.98)',backdropFilter:'blur(20px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            {[...links,['Connexion','/login'],['Démo','#contact'],['📞 Appeler',AI_PHONE_TEL]].map(([l,h],i)=>(
              <motion.a key={l} href={h} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} onClick={()=>setMob(false)}
                style={{fontSize:22,fontFamily:FH,fontStyle:'italic',color:WHITE,textDecoration:'none',padding:'12px 32px',textAlign:'center'}}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── HERO (clean, centered, no globe, no AI boxes) ─────────────────────────────
const FEATURES_QUICK = [
  {icon:'📥',label:'Leads centralisés',sub:'Tous vos portails en un seul endroit'},
  {icon:'🎙️',label:'IA vocale 24h/24',sub:'Sophie répond à votre place'},
  {icon:'📅',label:'Visites planifiées',sub:'Confirmation automatique des 3 parties'},
  {icon:'⭐',label:'Avis Google auto',sub:'Chaque vente génère un avis'},
  {icon:'🎂',label:'Client à vie',sub:'Anniversaires et relances automatiques'},
  {icon:'🔒',label:'Conformité LCB-FT',sub:'Traçabilité et export PDF en 30 s'},
]

function Hero() {
  const [active,setActive]=useState(0)
  const {scrollY}=useScroll()
  const bgY=useTransform(scrollY,[0,600],[0,60])

  useEffect(()=>{
    const id=setInterval(()=>setActive(a=>(a+1)%FEATURES_QUICK.length),2800)
    return()=>clearInterval(id)
  },[])

  return (
    <section style={{minHeight:'100dvh',background:BG_PAGE,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',position:'relative',overflow:'hidden',textAlign:'center' as const}}>
      {/* ambient glows */}
      <motion.div style={{y:bgY,position:'absolute',top:'-15%',left:'20%',width:'60vw',height:'60vw',maxWidth:700,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.06) 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <motion.div style={{y:bgY,position:'absolute',bottom:'-10%',right:'15%',width:'45vw',height:'45vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,rgba(45,212,191,0.05) 0%,transparent 65%)`,pointerEvents:'none'}}/>

      <div style={{maxWidth:860,width:'100%',position:'relative',zIndex:2}}>
        {/* Badge */}
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.05}} style={{marginBottom:28}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px 6px 12px',borderRadius:980,background:'rgba(45,212,191,0.10)',border:`1px solid ${BDR2}`}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:LIME,boxShadow:`0 0 8px ${LIME}`}}/>
            <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.10em',textTransform:'uppercase' as const,color:TEAL,fontFamily:FB}}>IA immobilière · France · RGPD</span>
          </div>
        </motion.div>

        {/* H1 */}
        <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.75,ease:EZ,delay:0.1}}
          style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(40px,5.5vw,72px)',color:WHITE,lineHeight:1.04,marginBottom:20,letterSpacing:'-0.035em'}}>
          Votre agence tourne.<br/>
          <span style={{color:LIME}}>Même quand vous dormez.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}}
          style={{fontSize:18,color:MUTED,lineHeight:1.7,maxWidth:580,margin:'0 auto 40px',fontFamily:FB}}>
          Vanivert prend en charge vos appels, vos leads, vos visites et votre réputation. Vous, vous vous concentrez sur la vente.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}} style={{display:'flex',gap:14,flexWrap:'wrap' as const,justifyContent:'center',marginBottom:56}}>
          <a href="#contact" style={{padding:'15px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:15,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,transition:'background 0.25s',boxShadow:`0 8px 28px ${LIME_GL}`,fontFamily:FH}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
            Demander une démo gratuite
            <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>→</span>
          </a>
          <a href={AI_PHONE_TEL} style={{padding:'15px 32px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:OFF,fontWeight:500,fontSize:15,textDecoration:'none',transition:'all 0.25s',fontFamily:FB}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=OFF}}>
            📞 Appeler l&apos;IA maintenant
          </a>
        </motion.div>

        {/* Auto-sliding feature pills */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}>
          <div style={{marginBottom:16,fontSize:11,color:SUBTLE,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB}}>Ce que Vanivert fait pour vous</div>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' as const}}>
            {FEATURES_QUICK.map((f,i)=>(
              <motion.div key={f.label} animate={{
                background:active===i?LIME_LT:'rgba(255,255,255,0.04)',
                borderColor:active===i?BDR_LIME:BDR,
                scale:active===i?1.04:1
              }} transition={{duration:0.4}}
                style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',borderRadius:12,border:`1px solid ${BDR}`,cursor:'pointer'}}
                onClick={()=>setActive(i)}>
                <span style={{fontSize:16}}>{f.icon}</span>
                <div style={{textAlign:'left' as const}}>
                  <div style={{fontSize:12,fontWeight:600,color:active===i?LIME:OFF,fontFamily:FH,transition:'color 0.3s'}}>{f.label}</div>
                  <div style={{fontSize:11,color:SUBTLE,fontFamily:FB}}>{f.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── TICKER ────────────────────────────────────────────────────────────────────
const AGENCIES=['Foncia Paris 8e','Century 21 Trocadéro','Laforêt Paris 16e','Orpi Paris Centre','Stéphane Plaza Paris 17e','IAD France Île-de-France','ERA Immobilier Paris','Guy Hoquet Paris 15e','Nexity Solutions Immobilières']

function Ticker() {
  return (
    <section style={{background:BG_DEEP,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'16px 0'}}>
      <p style={{textAlign:'center',fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:10,fontFamily:FB}}>Agences pilotes en France</p>
      <div style={{overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:'linear-gradient(to right,#020D16,transparent)',zIndex:2,pointerEvents:'none'}}/>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:'linear-gradient(to left,#020D16,transparent)',zIndex:2,pointerEvents:'none'}}/>
        <div style={{display:'flex',gap:56,animation:'ticker 28s linear infinite',width:'max-content',alignItems:'center'}}>
          {[...AGENCIES,...AGENCIES,...AGENCIES].map((n,i)=>(
            <span key={i} style={{fontSize:13,color:SUBTLE,fontFamily:FB,fontStyle:'italic',whiteSpace:'nowrap'}}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES (full tab section) ───────────────────────────────────────────────
const FEATURES_FULL = [
  {id:'leads',icon:'📥',color:LIME,tag:'Capture des leads',
   headline:'Chaque appel manqué, c\'est une commission perdue.',
   body:'Tous vos portails (SeLoger, LeBonCoin, BienIci, WhatsApp) centralisés en une seule interface. Sophie répond en 0 seconde, 24h/24, qualifie le prospect et crée la fiche automatiquement.',
   metrics:['+35 % de leads traités','Réponse en moins de 60 s','Zéro double saisie']},
  {id:'visits',icon:'📅',color:TEAL,tag:'Planification des visites',
   headline:'Fini les allers-retours pour confirmer une visite.',
   body:'Coordination automatique entre acheteur, vendeur et agent. Confirmation WhatsApp simultanée pour les trois parties, rappel la veille et deux heures avant.',
   metrics:['3 confirmations simultanées','Rappel J-1 et H-2','Lien Maps intégré']},
  {id:'client',icon:'🎂',color:ORANGE,tag:'Client à vie',
   headline:'Vos anciens clients sont votre meilleure source de mandats.',
   body:'Anniversaires d\'acquisition, estimations trimestrielles, voeux personnalisés : tout est envoyé automatiquement depuis le nom de l\'agent. Vanivert détecte quand un client est prêt à revendre.',
   metrics:['Messages personnalisés auto','Estimations trimestrielles','Ré-engagement sur 3 ans']},
  {id:'reviews',icon:'⭐',color:ORANGE,tag:'Réputation Google',
   headline:'Une étoile de plus sur Google = 18 % de leads supplémentaires.',
   body:'24 heures après chaque vente, acheteur et vendeur reçoivent un WhatsApp personnalisé. Les avis arrivent dans votre tableau de bord avec une réponse IA prête en un clic.',
   metrics:['Demande auto 24h après la vente','Réponse IA validable en 1 clic','Draft Instagram généré']},
  {id:'compliance',icon:'🔒',color:PURPLE,tag:'Conformité LCB-FT',
   headline:'Une inspection DGCCRF peut vous coûter votre carte professionnelle.',
   body:'Chaque dossier suspect est signalé automatiquement. L\'agent est guidé étape par étape. Export PDF pour inspection en 30 secondes.',
   metrics:['Traçabilité automatique','Export PDF instantané','Zéro non-conformité']},
  {id:'data',icon:'📊',color:TEAL,tag:'Intelligence du bien',
   headline:'Le vendeur a consulté DVF avant votre visite. Vous aussi ?',
   body:'Rapport DVF, Géorisques et Cadastre agrégé automatiquement, envoyé sur WhatsApp 30 minutes avant chaque visite vendeur.',
   metrics:['DVF data.gouv.fr','Géorisques officiel','Surface Cadastre exacte']},
]

function FeaturesSection() {
  const [active,setActive]=useState(0)
  const f=FEATURES_FULL[active]
  return (
    <section id="features" style={{background:BG_SEC,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:LIME_LT,border:`1px solid ${BDR_LIME}`,marginBottom:16}}>
            <span style={{fontSize:11,fontWeight:600,color:LIME,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FB}}>Fonctionnalités</span>
          </div>
          <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(26px,3.2vw,42px)',color:WHITE,marginTop:8,marginBottom:10,letterSpacing:'-0.03em'}}>
            Tout ce qu&apos;une agence fait à la main,<br/><span style={{color:LIME}}>Vanivert le fait à votre place.</span>
          </h2>
        </FadeUp>
        {/* Tab bar */}
        <div style={{display:'flex',gap:8,marginBottom:32,overflowX:'auto' as const,paddingBottom:4,scrollbarWidth:'none' as const}}>
          {FEATURES_FULL.map((feat,i)=>(
            <button key={feat.id} onClick={()=>setActive(i)} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:980,background:active===i?feat.color:BG_CARD,color:active===i?'#000':MUTED,fontWeight:active===i?700:450,fontSize:12,border:`1.5px solid ${active===i?feat.color:BDR}`,cursor:'pointer',transition:'all 0.25s',whiteSpace:'nowrap' as const,fontFamily:FB,flexShrink:0}}>
              <span>{feat.icon}</span>{feat.tag}
            </button>
          ))}
        </div>
        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.28}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}} className="alt-grid">
              <div style={{padding:'36px 32px',borderRadius:20,background:'rgba(30,41,59,0.40)',border:`1.5px solid ${BDR}`}}>
                <div style={{fontSize:11,fontWeight:700,color:f.color,textTransform:'uppercase' as const,letterSpacing:'0.1em',marginBottom:14,fontFamily:FB}}>{f.tag}</div>
                <h3 style={{fontFamily:FH,fontSize:'clamp(18px,2vw,24px)',color:WHITE,lineHeight:1.3,marginBottom:16,fontWeight:600}}>{f.headline}</h3>
                <p style={{fontSize:14,color:MUTED,lineHeight:1.75,marginBottom:24,fontFamily:FB}}>{f.body}</p>
                <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                  {f.metrics.map(m=>(
                    <span key={m} style={{fontSize:11,fontWeight:600,color:f.color,background:`rgba(30,41,59,0.60)`,padding:'4px 12px',borderRadius:980,border:`1px solid ${BDR}`,fontFamily:FB}}>{m}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{padding:'28px',borderRadius:16,background:BG_CARD,border:`1px solid ${BDR}`,textAlign:'center' as const,fontSize:52}}>{f.icon}</div>
                <a href="#contact" style={{padding:'14px',borderRadius:980,background:f.color,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'opacity 0.2s',display:'block',fontFamily:FH}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='0.85'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}>
                  Voir cette fonctionnalité en action →
                </a>
                <a href={AI_PHONE_TEL} style={{padding:'14px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'all 0.25s',fontFamily:FB}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
                  📞 Appeler l&apos;IA pour tester
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── TEST CALL ─────────────────────────────────────────────────────────────────
function Waveform() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:3,height:32}}>
      {Array.from({length:24}).map((_,i)=>(
        <motion.span key={i} animate={{scaleY:[0.25,1,0.35,0.8,0.25]}} transition={{duration:1.1+((i%5)*0.15),repeat:Infinity,ease:'easeInOut',delay:i*0.04}}
          style={{width:3,height:'100%',borderRadius:2,background:LIME,transformOrigin:'center',display:'inline-block'}}/>
      ))}
    </div>
  )
}

function TestCallSection() {
  const [copied,setCopied]=useState(false)
  return (
    <section id="tester-ia" style={{background:`radial-gradient(ellipse 80% 60% at 50% 0%,rgba(132,204,22,0.10),transparent 60%),${BG_SEC.replace('linear-gradient(160deg,','').slice(0,-1).split(',')[0]}`,backgroundImage:`radial-gradient(ellipse 80% 60% at 50% 0%,rgba(132,204,22,0.10),transparent 60%),${BG_SEC}`,padding:'100px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:680,margin:'0 auto',textAlign:'center' as const}}>
        <FadeUp>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px 6px 10px',borderRadius:980,background:LIME_LT,border:`1px solid ${BDR_LIME}`,marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:LIME,boxShadow:`0 0 10px ${LIME}`}}/>
            <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.09em',textTransform:'uppercase' as const,color:LIME,fontFamily:FB}}>Essai en direct, gratuit</span>
          </div>
          <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(28px,4vw,46px)',color:WHITE,margin:'0 0 14px',letterSpacing:'-0.03em',lineHeight:1.1}}>
            Appelez Sophie.<br/><span style={{color:LIME}}>Maintenant.</span>
          </h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.7,maxWidth:500,margin:'0 auto 40px',fontFamily:FB}}>
            Composez le numéro, jouez un client qui cherche un bien, et écoutez comment Sophie gère l&apos;appel à votre place.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{background:BG_CARD,border:`1.5px solid ${BDR2}`,borderRadius:24,padding:'40px 32px',backdropFilter:'blur(16px)'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:16}}><Waveform/></div>
            <div style={{fontSize:11,color:SUBTLE,letterSpacing:'0.10em',textTransform:'uppercase' as const,marginBottom:8,fontFamily:FB}}>Numéro à composer</div>
            <div style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:700,color:WHITE,fontFamily:FH,letterSpacing:'-0.01em',marginBottom:24}}>02 21 82 60 74</div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap' as const,justifyContent:'center'}}>
              <a href={AI_PHONE_TEL} style={{padding:'14px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:`0 10px 30px ${LIME_GL}`,transition:'background 0.2s',fontFamily:FH}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                📞 Appeler {AI_PHONE_INT}
              </a>
              <button onClick={()=>{try{navigator.clipboard.writeText(AI_PHONE_INT)}catch{};setCopied(true);setTimeout(()=>setCopied(false),2000)}}
                style={{padding:'14px 22px',borderRadius:980,border:`1.5px solid ${BDR2}`,background:'transparent',color:WHITE,fontWeight:500,fontSize:14,cursor:'pointer',transition:'all 0.2s',fontFamily:FB}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2}}>
                {copied?'Copié ✓':'Copier'}
              </button>
            </div>
            <p style={{fontSize:11,color:SUBTLE,marginTop:18,lineHeight:1.6,fontFamily:FB}}>Disponible 24h/24. Aucune donnée personnelle requise pour le test.</p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── ROI CALCULATOR ────────────────────────────────────────────────────────────
function ROICalc() {
  const [leads,setLeads]=useState(40),[closeRate,setCloseRate]=useState(15),[avgComm,setAvgComm]=useState(8000),[hoursAdmin,setHoursAdmin]=useState(2)
  const missedDeals=Math.round(leads*0.35*(closeRate/100))
  const total=(missedDeals*avgComm + hoursAdmin*22*80)*12
  return (
    <section id="roi" style={{background:BG_DEEP,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:960,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:'rgba(45,212,191,0.10)',border:`1px solid ${BDR2}`,marginBottom:14}}>
            <span style={{fontSize:11,fontWeight:600,color:TEAL,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FB}}>Calculateur ROI</span>
          </div>
          <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,40px)',color:WHITE,marginTop:8,marginBottom:10,letterSpacing:'-0.025em'}}>Combien Vanivert peut vous rapporter ?</h2>
          <p style={{fontSize:15,color:MUTED,maxWidth:460,margin:'0 auto',fontFamily:FB}}>Les agences perdent en moyenne 35 % de leurs leads sans réponse rapide.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}} className="alt-grid">
          <FadeUp>
            <div style={{background:BG_CARD,border:`1px solid ${BDR}`,borderRadius:20,padding:'30px 26px'}}>
              <div style={{fontSize:13,fontWeight:700,color:WHITE,marginBottom:22,fontFamily:FH}}>Votre situation</div>
              {[
                {label:'Leads entrants / mois',val:leads,set:setLeads,min:10,max:200,step:5,suf:' leads'},
                {label:'Taux de signature',val:closeRate,set:setCloseRate,min:5,max:40,step:1,suf:' %'},
                {label:'Commission moyenne',val:avgComm,set:setAvgComm,min:2000,max:20000,step:500,suf:' €'},
                {label:'Heures admin / jour',val:hoursAdmin,set:setHoursAdmin,min:0.5,max:6,step:0.5,suf:'h'},
              ].map(({label,val,set,min,max,step,suf})=>(
                <div key={label} style={{marginBottom:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                    <span style={{fontSize:12,color:MUTED,fontFamily:FB}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:WHITE,fontFamily:FH}}>{val}{suf}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} style={{width:'100%',accentColor:LIME,height:4,cursor:'pointer'}}/>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{background:'rgba(4,14,25,0.95)',border:`1px solid rgba(45,212,191,0.12)`,borderRadius:20,padding:'30px 26px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:320}}>
              <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:22,fontFamily:FB}}>Votre gain estimé avec Vanivert</div>
              <div style={{textAlign:'center' as const,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6}}>
                <div style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>Gain annuel estimé</div>
                <div style={{fontSize:52,fontWeight:700,fontFamily:FH,color:LIME,letterSpacing:'-0.03em'}}>{(total/1000).toFixed(0)}K €</div>
                <div style={{fontSize:13,color:MUTED,fontFamily:FB}}>soit {Math.round(total/12).toLocaleString('fr-FR')} € par mois</div>
              </div>
              <a href="#contact" style={{display:'block',marginTop:24,padding:'13px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'background 0.25s',fontFamily:FH}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                Demander ma démo gratuite →
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ── SOCIAL PROOF ──────────────────────────────────────────────────────────────
function SocialProof() {
  const stats=[
    {n:'+34 %',l:'de leads traités dans les 5 premières minutes',c:LIME},
    {n:'-60 %',l:'de temps passé à la saisie manuelle',c:TEAL},
    {n:'4,8 / 5',l:'note Google moyenne après 3 mois',c:ORANGE},
    {n:'< 60 s',l:"de l'appel entrant au WhatsApp agent",c:LIME},
  ]
  return (
    <section style={{background:BG_SEC,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'60px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <p style={{textAlign:'center',fontSize:11,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:36,fontFamily:FB}}>Résultats constatés sur nos agences pilotes</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}} className="stats-grid">
          {stats.map((s,i)=>(
            <FadeUp key={s.l} delay={i*0.07}>
              <div style={{textAlign:'center',padding:'24px 16px',borderRadius:16,background:BG_CARD,border:`1px solid ${BDR}`}}>
                <div style={{fontSize:34,fontWeight:700,fontFamily:FH,color:s.c,marginBottom:8}}>{s.n}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FB}}>{s.l}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function TeamStory() {
  return (
    <section id="team" style={{background:BG_SEC,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:780,margin:'0 auto'}}>
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Notre histoire</span>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(28px,3.8vw,46px)',color:WHITE,letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24,fontFamily:FH}}>
            On a bossé dans la logistique mondiale.<br/>
            <span style={{color:MUTED,fontWeight:400}}>Puis on a découvert l&apos;immobilier français.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{fontSize:16,color:MUTED,lineHeight:1.85,fontFamily:FB}}>
            <p style={{marginBottom:20}}>Systèmes qui tournent dans 15 pays, sans supervision. Une erreur de 30 secondes, c&apos;est des millions de perdus. C&apos;est là qu&apos;on a appris à construire des outils fiables.</p>
            <p style={{marginBottom:20}}>En regardant le marché immobilier français, le contraste était saisissant. Des leads qui arrivent à 21h et que personne ne rappelle. Des visites confirmées à la main, une par une. Des clients perdus après la signature.</p>
            <p style={{marginBottom:20,color:WHITE,fontWeight:600,fontSize:18}}>Alors on a tout construit de zéro.</p>
            <p>Vanivert automatise tout ce qui peut l&apos;être pour que l&apos;agent fasse ce qu&apos;il fait le mieux : vendre, négocier, convaincre.</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div style={{display:'flex',gap:32,marginTop:40,paddingTop:32,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['15+','pays d\'opérations'],['3','co-fondateurs'],['10+','agences pilotes']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:22,fontWeight:700,color:WHITE,marginBottom:2,fontFamily:FH}}>{v}</div>
                <div style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>{l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── INVESTORS (reads from CMS localStorage) ───────────────────────────────────
const DEFAULT_INVESTOR = {
  h2_line1:"Nous bâtissons le socle",
  h2_line2:"de l'immobilier français.",
  body:"8 500 agences indépendantes paient entre 70 et 150 € par mois à des CRM qui ne font ni la gestion des leads WhatsApp, ni la centralisation des portails, ni la collecte d'avis Google. C'est un marché de plus de 10 millions d'euros par an, rien qu'en France.",
  stat1_n:"8 500+", stat1_l:"agences indépendantes en France",
  stat2_n:"10 M€+", stat2_l:"marché CRM immobilier annuel",
  stat3_n:"10+",    stat3_l:"agences pilotes actives",
  stat4_n:"0",      stat4_l:"concurrent offrant WhatsApp + leads + avis + CRM",
  investor_email:"investors@vanivert.eu",
  siret_line:"SIRET 93429900900019, Cergy, France",
}

function Investors() {
  const [d,setD]=useState(DEFAULT_INVESTOR)
  useEffect(()=>{
    try{
      const s=localStorage.getItem(CMS_KEY)
      if(s){const p=JSON.parse(s);setD({...DEFAULT_INVESTOR,...p})}
    }catch{}
  },[])
  const stats=[
    {n:d.stat1_n,l:d.stat1_l,c:LIME},{n:d.stat2_n,l:d.stat2_l,c:TEAL},
    {n:d.stat3_n,l:d.stat3_l,c:'#22C55E'},{n:d.stat4_n,l:d.stat4_l,c:PURPLE},
  ]
  return (
    <section id="investors" style={{background:BG_DEEP,padding:'96px 32px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 20% 50%,rgba(132,204,22,0.07) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(45,212,191,0.05) 0%,transparent 50%)`,pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:TEAL,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Investisseurs</span>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(28px,4vw,50px)',color:WHITE,letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24,fontFamily:FH}}>
            {d.h2_line1}<br/><span style={{color:LIME}}>{d.h2_line2}</span>
          </h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.75,maxWidth:620,marginBottom:40,fontFamily:FB}}>{d.body}</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:48}} className="stats-grid">
            {stats.map(s=>(
              <div key={s.l} style={{padding:'20px 18px',borderRadius:14,background:BG_CARD,border:`1px solid ${BDR}`}}>
                <div style={{fontSize:24,fontWeight:700,color:s.c,marginBottom:6,fontFamily:FH}}>{s.n}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FB}}>{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div style={{display:'flex',gap:24,flexWrap:'wrap' as const,alignItems:'center',paddingTop:32,borderTop:`1px solid ${BDR}`}}>
            <div style={{flex:1,minWidth:240}}>
              <div style={{fontSize:14,color:MUTED,marginBottom:4,fontFamily:FB}}>Enregistré en France</div>
              <div style={{fontSize:14,color:OFF,fontFamily:FB}}>{d.siret_line}</div>
            </div>
            <a href={`mailto:${d.investor_email}`} style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,display:'inline-flex',alignItems:'center',gap:8,fontFamily:FH}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              {d.investor_email} →
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── CONTACT FORM (phone with +33 prefix, pro email detector) ──────────────────
const COUNTRY_CODES=[
  {code:'+33',flag:'🇫🇷',label:'France'},
  {code:'+32',flag:'🇧🇪',label:'Belgique'},
  {code:'+41',flag:'🇨🇭',label:'Suisse'},
  {code:'+352',flag:'🇱🇺',label:'Luxembourg'},
  {code:'+44',flag:'🇬🇧',label:'Royaume-Uni'},
  {code:'+49',flag:'🇩🇪',label:'Allemagne'},
  {code:'+34',flag:'🇪🇸',label:'Espagne'},
  {code:'+39',flag:'🇮🇹',label:'Italie'},
]

function Contact() {
  const [prenom,setPrenom]=useState(''),[nom,setNom]=useState(''),[email,setEmail]=useState('')
  const [countryCode,setCountryCode]=useState('+33'),[phoneNum,setPhoneNum]=useState('')
  const [agency,setAgency]=useState(''),[agents,setAgents]=useState(''),[message,setMessage]=useState('')
  const [sent,setSent]=useState(false),[loading,setLoading]=useState(false)
  const [emailError,setEmailError]=useState(''),[emailTouched,setEmailTouched]=useState(false)
  const [showCountry,setShowCountry]=useState(false)

  const emailOk=email.length>3&&isPro(email)
  const emailBad=emailTouched&&email.length>3&&!isPro(email)

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(!email||!prenom||!nom) return
    if(!isPro(email)){setEmailError("Merci d'utiliser votre adresse email professionnelle.");return}
    setEmailError('');setLoading(true)
    try{
      await fetch('https://api.web3forms.com/submit',{
        method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({access_key:'35166257-a70e-45c4-895c-0f32d06200f8',subject:`Démo Vanivert : ${agency||`${prenom} ${nom}`}`,from_name:'Vanivert',name:`${prenom} ${nom}`,email,phone:`${countryCode} ${phoneNum}`,agency_name:agency,agent_count:agents,message:message||'(aucun message)'}),
      })
    }catch{}
    setSent(true);setLoading(false)
    setTimeout(()=>{setSent(false);setPrenom('');setNom('');setEmail('');setPhoneNum('');setAgency('');setAgents('');setMessage('');setEmailTouched(false)},3500)
  }

  const inp:React.CSSProperties={width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BDR2}`,fontSize:14,outline:'none',color:WHITE,fontFamily:FB,background:'rgba(30,41,59,0.60)',boxSizing:'border-box' as const,transition:'border-color 0.2s'}

  return (
    <section id="contact" style={{background:BG_SEC,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center' as const,marginBottom:36}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,justifyContent:'center'}}>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:11,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Contact</span>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(26px,3.2vw,40px)',color:WHITE,marginBottom:12,letterSpacing:'-0.03em',fontFamily:FH}}>Parlez-nous de votre agence.</h2>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,fontFamily:FB}}>Demande de démo, question technique, partenariat : nous répondons sous 24h ouvrées.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <AnimatePresence mode="wait">
            {sent?(
              <motion.div key="sent" initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}} style={{padding:40,borderRadius:18,background:LIME_LT,border:`1px solid ${BDR_LIME}`,textAlign:'center' as const}}>
                <div style={{fontSize:40,marginBottom:14}}>✅</div>
                <div style={{fontSize:17,fontWeight:700,color:WHITE,marginBottom:8,fontFamily:FH}}>Message envoyé !</div>
                <div style={{fontSize:13,color:MUTED,fontFamily:FB}}>On vous répond sous 24h ouvrées.</div>
              </motion.div>
            ):(
              <motion.form key="form" initial={{opacity:0}} animate={{opacity:1}} onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <input required value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Prénom *" style={inp}/>
                  <input required value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom *" style={inp}/>
                </div>
                {/* Email with live validation */}
                <div style={{position:'relative'}}>
                  <input type="email" required value={email}
                    onChange={e=>{setEmail(e.target.value);setEmailError('')}}
                    onBlur={()=>setEmailTouched(true)}
                    placeholder="Email professionnel *"
                    style={{...inp,borderColor:emailBad?'#F87171':emailOk?LIME:BDR2,paddingRight:40}}/>
                  {emailOk&&<span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:LIME,fontSize:16}}>✓</span>}
                  {emailBad&&<span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'#F87171',fontSize:16}}>✗</span>}
                </div>
                {emailBad&&<p style={{fontSize:12,color:'#F87171',margin:'-4px 0 0',fontFamily:FB}}>Merci d&apos;utiliser votre email professionnel (pas Gmail, Hotmail...)</p>}
                {emailError&&<p style={{fontSize:12,color:'#F87171',margin:'-4px 0 0',fontFamily:FB}}>{emailError}</p>}
                {/* Phone with country code selector */}
                <div style={{display:'flex',gap:0,position:'relative'}}>
                  <button type="button" onClick={()=>setShowCountry(!showCountry)}
                    style={{padding:'13px 14px',borderRadius:'12px 0 0 12px',border:`1px solid ${BDR2}`,borderRight:'none',background:'rgba(30,41,59,0.60)',color:WHITE,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap',fontFamily:FB,flexShrink:0}}>
                    {COUNTRY_CODES.find(c=>c.code===countryCode)?.flag} {countryCode} ▾
                  </button>
                  <input type="tel" value={phoneNum} onChange={e=>setPhoneNum(e.target.value)} placeholder="6 12 34 56 78"
                    style={{...inp,borderRadius:'0 12px 12px 0',flex:1}}/>
                  {showCountry&&(
                    <div style={{position:'absolute',top:'100%',left:0,zIndex:50,marginTop:4,background:'#0B2D38',border:`1px solid ${BDR2}`,borderRadius:12,overflow:'hidden',minWidth:200,boxShadow:'0 8px 24px rgba(0,0,0,0.40)'}}>
                      {COUNTRY_CODES.map(c=>(
                        <button key={c.code} type="button" onClick={()=>{setCountryCode(c.code);setShowCountry(false)}}
                          style={{width:'100%',padding:'10px 16px',background:c.code===countryCode?LIME_LT:'transparent',color:WHITE,border:'none',cursor:'pointer',textAlign:'left' as const,display:'flex',alignItems:'center',gap:10,fontSize:13,fontFamily:FB}}>
                          <span>{c.flag}</span><span>{c.label}</span><span style={{color:SUBTLE,marginLeft:'auto'}}>{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input value={agency} onChange={e=>setAgency(e.target.value)} placeholder="Nom de votre agence" style={inp}/>
                <select value={agents} onChange={e=>setAgents(e.target.value)} style={{...inp,appearance:'none' as const,color:agents?WHITE:MUTED}}>
                  <option value="" style={{background:'#071520'}}>Nombre d&apos;agents</option>
                  <option value="1" style={{background:'#071520'}}>1 agent</option>
                  <option value="2-5" style={{background:'#071520'}}>2 à 5 agents</option>
                  <option value="6-15" style={{background:'#071520'}}>6 à 15 agents</option>
                  <option value="15+" style={{background:'#071520'}}>Plus de 15 agents</option>
                </select>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Votre message (optionnel)" rows={3} style={{...inp,resize:'vertical' as const}}/>
                <p style={{fontSize:11,color:SUBTLE,lineHeight:1.55,textAlign:'center' as const,fontFamily:FB}}>En soumettant ce formulaire, vous acceptez l&apos;utilisation de vos données pour vous recontacter. Conforme RGPD. <a href="/legal/confidentialite" style={{color:LIME}}>Politique de confidentialité</a>.</p>
                <button type="submit" disabled={loading} style={{padding:'14px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',transition:'background 0.25s',boxShadow:`0 4px 14px ${LIME_GL}`,fontFamily:FH}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  {loading?'Envoi en cours...':'Demander une démo gratuite →'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>
    </section>
  )
}

// ── FOOTER CTA ────────────────────────────────────────────────────────────────
function FooterCTA() {
  return (
    <section style={{background:BG_SEC,padding:'0 32px 72px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp>
          <div style={{background:'rgba(4,14,25,0.95)',border:`1px solid ${BDR}`,borderRadius:28,padding:'80px 40px',textAlign:'center' as const,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 30% 50%,rgba(132,204,22,0.09) 0%,transparent 55%),radial-gradient(circle at 70% 50%,rgba(45,212,191,0.06) 0%,transparent 55%)`,pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:2}}>
              <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(28px,3.8vw,48px)',color:WHITE,margin:'0 auto 14px',letterSpacing:'-0.025em',lineHeight:1.15,maxWidth:580}}>
                Prêt à automatiser votre agence ?
              </h2>
              <p style={{fontSize:16,color:MUTED,maxWidth:420,margin:'0 auto 36px',fontFamily:FB}}>Rejoignez les agences qui ont automatisé leur croissance.</p>
              <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap' as const}}>
                <a href="#contact" style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  Demander une démo gratuite →
                </a>
                <a href={AI_PHONE_TEL} style={{padding:'14px 32px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s',fontFamily:FB}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
                  📞 Appeler l&apos;IA
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols=[
    {h:'Produit',links:[['Fonctionnalités','#features'],['ROI','#roi'],["Tester l'IA",'#tester-ia'],['Connexion','/login']]},
    {h:'Entreprise',links:[['Équipe','#team'],['Contact','#contact'],['Investisseurs','#investors']]},
    {h:'Légal',links:[['Mentions légales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Confidentialité','/legal/confidentialite'],['Admin','/admin']]},
  ]
  return (
    <footer style={{background:BG_DEEP,borderTop:`1px solid ${BDR}`,padding:'52px 32px 28px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr repeat(3,1fr)',gap:32,marginBottom:44}} className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <Logo s={26}/><span style={{fontFamily:FH,fontSize:16,color:WHITE,fontWeight:700}}>Vanivert</span>
            </div>
            <p style={{fontSize:13,color:MUTED,lineHeight:1.65,maxWidth:220,marginBottom:14,fontFamily:FB}}>L&apos;IA immobilière qui ne dort jamais. Enregistré en France.</p>
            <a href={AI_PHONE_TEL} style={{fontSize:13,color:LIME,textDecoration:'none',display:'block',marginBottom:14,fontFamily:FB}}>📞 {AI_PHONE_INT}</a>
            <a href="https://www.linkedin.com/company/vanivert" target="_blank" rel="noopener noreferrer"
              style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.08)',border:`1px solid ${BDR}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:WHITE,textDecoration:'none'}}>in</a>
          </div>
          {cols.map(col=>(
            <div key={col.h}>
              <div style={{fontSize:11,fontWeight:600,color:SUBTLE,marginBottom:12,textTransform:'uppercase' as const,letterSpacing:'0.07em',fontFamily:FB}}>{col.h}</div>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {col.links.map(([l,h])=>(
                  <a key={l} href={h} target={h.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
                    style={{fontSize:13,color:MUTED,textDecoration:'none',transition:'color 0.2s',fontFamily:FB}}
                    onMouseEnter={e=>(e.currentTarget.style.color=WHITE)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${BDR}`,paddingTop:18,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:10}}>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>© 2026 Vanivert · SIRET {SIRET}</span>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>{ADDRESS}</span>
          <a href={`mailto:${EMAIL}`} style={{fontSize:12,color:SUBTLE,textDecoration:'none',fontFamily:FB}}>{EMAIL}</a>
        </div>
      </div>
    </footer>
  )
}

// ── GDPR ──────────────────────────────────────────────────────────────────────
function GDPR() {
  const [v,setV]=useState(false)
  useEffect(()=>{try{if(!localStorage.getItem('vanivert_gdpr_v4'))setV(true)}catch{}},[])
  const accept=()=>{try{localStorage.setItem('vanivert_gdpr_v4','accepted')}catch{};setV(false)}
  const decline=()=>{try{localStorage.setItem('vanivert_gdpr_v4','declined')}catch{};setV(false)}
  if(!v) return null
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:2.5}}
      style={{position:'fixed',bottom:20,left:20,right:20,zIndex:9990,maxWidth:460,margin:'0 auto',background:BG_CARD,border:`1px solid ${BDR2}`,borderRadius:18,padding:'20px 22px',backdropFilter:'blur(16px)',display:'flex',flexDirection:'column',gap:10}}>
      <p style={{fontSize:13,fontWeight:600,color:WHITE,margin:0,fontFamily:FH}}>Ce site utilise des cookies</p>
      <p style={{fontSize:12,color:MUTED,lineHeight:1.55,margin:0,fontFamily:FB}}>Cookies fonctionnels uniquement. Hébergement 100 % UE. Aucune donnée transmise à des tiers.</p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={accept} style={{flex:1,padding:'9px 16px',borderRadius:980,background:LIME,color:'#000',fontWeight:600,fontSize:12,border:'none',cursor:'pointer',fontFamily:FH}}>Accepter</button>
        <button onClick={decline} style={{flex:1,padding:'9px 16px',borderRadius:980,background:'transparent',color:MUTED,fontWeight:500,fontSize:12,border:`1px solid ${BDR2}`,cursor:'pointer',fontFamily:FB}}>Refuser</button>
      </div>
    </motion.div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#020617;color:#F1F5F9;font-family:'Inter',system-ui,sans-serif;overflow-x:hidden}
        input,textarea,select,button{font-family:'Inter',system-ui,sans-serif}
        input::placeholder,textarea::placeholder{color:#64748B}
        input[type=range]{cursor:pointer}
        .nav-links{display:flex}.mob-nav{display:none}
        @media(max-width:860px){.nav-links{display:none!important}.mob-nav{display:flex!important}}
        @media(max-width:768px){.alt-grid{grid-template-columns:1fr!important}.pricing-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}.stats-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:1fr!important}}
        ::-webkit-scrollbar{display:none}
        select option{background:#071520;color:#F1F5F9}
      `}</style>
      <ScrollBar/>
      <Nav/>
      <main>
        <Hero/>
        <Ticker/>
        <FeaturesSection/>
        <TestCallSection/>
        <ROICalc/>
        <SocialProof/>
        <TeamStory/>
        <Investors/>
        <Contact/>
        <FooterCTA/>
      </main>
      <Footer/>
      <GDPR/>
    </>
  )
}
