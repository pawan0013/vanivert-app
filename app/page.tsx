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
  const links:[string,string][]=[['Fonctionnalités','#features'],['ROI','#roi'],["Tester l'IA",'#tester-ia'],['Équipe','#team'],['Investisseurs','/investisseurs']]
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
            <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer" style={{fontSize:13,fontWeight:700,color:'#000',textDecoration:'none',padding:'9px 22px',borderRadius:980,background:LIME,display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s',boxShadow:`0 4px 18px ${LIME_GL}`,fontFamily:FH}}
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
            {[...links,['Connexion','/login'],['Démo','https://realestate-eu-demo.vercel.app/login'],['📞 Appeler',AI_PHONE_TEL]].map(([l,h],i)=>(
              <motion.a key={l} href={h} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} onClick={()=>setMob(false)}
                style={{fontSize:22,fontFamily:FH,fontStyle:'italic',color:WHITE,textDecoration:'none',padding:'12px 32px',textAlign:'center'}}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── HERO — auto-sliding pain point panels ────────────────────────────────────
const SLIDES = [
  {
    id:'leads',
    tag:'Le problème n°1 des agences',
    headline:'Vous perdez des leads\npendant votre déjeuner.',
    sub:'SeLoger, LeBonCoin, BienIci, WhatsApp : les prospects arrivent de partout. Sans réponse en moins de 5 minutes, 35 % disparaissent.',
    accent:LIME,
    visual:'leads',
  },
  {
    id:'bot',
    tag:'La solution WhatsApp',
    headline:'Le bot répond.\nMême un dimanche à 19h.',
    sub:"Un prospect écrit. Le bot le salue, collecte ses critères, lui propose des biens et planifie la visite. Zéro intervention humaine.",
    accent:TEAL,
    visual:'bot',
  },
  {
    id:'voice',
    tag:'IA vocale Sophie',
    headline:'Chaque appel manqué\nest une commission perdue.',
    sub:"Sophie répond en français en moins de 60 secondes, qualifie l'appelant et envoie un résumé à l'agent par WhatsApp.",
    accent:LIME,
    visual:'voice',
  },
  {
    id:'visits',
    tag:'Coordination automatique',
    headline:'Fini les appels\npour caler une visite.',
    sub:'Acheteur, vendeur, agent : le système cale les trois disponibilités et envoie les confirmations. Rappels J-1 et H-2 automatiques.',
    accent:TEAL,
    visual:'visits',
  },
]

function LeadsVisual() {
  const portals = [
    {name:'SeLoger',color:'#E4002B',bg:'rgba(228,0,43,0.12)'},
    {name:'LeBonCoin',color:'#FF6E14',bg:'rgba(255,110,20,0.12)'},
    {name:'BienIci',color:'#00C4B3',bg:'rgba(0,196,179,0.12)'},
    {name:'WhatsApp',color:'#25D366',bg:'rgba(37,211,102,0.12)'},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
      <div style={{display:'flex',gap:10,flexWrap:'wrap' as const,justifyContent:'center'}}>
        {portals.map((p,i)=>(
          <motion.div key={p.name} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.12,duration:0.5}}
            style={{padding:'10px 18px',borderRadius:10,background:p.bg,border:`1px solid ${p.color}40`,color:p.color,fontWeight:700,fontSize:14,fontFamily:FH}}>
            {p.name}
          </motion.div>
        ))}
      </div>
      <motion.div initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:0.6,duration:0.4}}
        style={{width:2,height:28,background:`linear-gradient(to bottom,${LIME},transparent)`,borderRadius:2}}/>
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.85,duration:0.4}}
        style={{padding:'14px 24px',borderRadius:14,background:LIME_LT,border:`1px solid ${BDR_LIME}`,textAlign:'center' as const}}>
        <div style={{fontSize:11,color:LIME,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:4}}>Fiche créée en</div>
        <div style={{fontSize:32,fontWeight:800,color:LIME,fontFamily:FH}}>{'< 60 s'}</div>
        <div style={{fontSize:11,color:MUTED,fontFamily:FB,marginTop:2}}>Agent notifié par WhatsApp</div>
      </motion.div>
    </div>
  )
}

function BotVisual() {
  const msgs = [
    {side:'bot',text:'Bonjour ! Je cherche un bien à acheter ou à louer ?',delay:0.1},
    {side:'user',text:'À acheter, un T3 sur Lannion.',delay:0.6},
    {side:'bot',text:'Budget approximatif ?',delay:1.1},
    {side:'user',text:'300 000 €',delay:1.6},
    {side:'bot',text:"J'ai 2 biens qui correspondent. Je vous les envoie maintenant.",delay:2.1},
  ]
  return (
    <div style={{maxWidth:320,margin:'0 auto'}}>
      <div style={{background:'rgba(30,41,59,0.70)',borderRadius:18,overflow:'hidden',border:`1px solid ${BDR2}`}}>
        <div style={{padding:'12px 16px',background:'rgba(0,0,0,0.30)',display:'flex',alignItems:'center',gap:10,borderBottom:`1px solid ${BDR}`}}>
          <span style={{fontSize:18}}>💬</span>
          <span style={{fontSize:13,fontWeight:600,color:WHITE,fontFamily:FH}}>Vanivert WhatsApp Bot</span>
          <span style={{marginLeft:'auto',width:8,height:8,borderRadius:'50%',background:'#22C55E'}}/>
        </div>
        <div style={{padding:'14px 12px',display:'flex',flexDirection:'column',gap:8,minHeight:160}}>
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,x:m.side==='bot'?-12:12}} animate={{opacity:1,x:0}} transition={{delay:m.delay,duration:0.35}}
              style={{alignSelf:m.side==='bot'?'flex-start':'flex-end',maxWidth:'82%',padding:'8px 12px',borderRadius:m.side==='bot'?'4px 12px 12px 12px':'12px 4px 12px 12px',background:m.side==='bot'?'rgba(45,212,191,0.15)':'rgba(132,204,22,0.15)',border:`1px solid ${m.side==='bot'?'rgba(45,212,191,0.25)':'rgba(132,204,22,0.25)'}`}}>
              <span style={{fontSize:12,color:OFF,fontFamily:FB,lineHeight:1.45}}>{m.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}} style={{marginTop:10,textAlign:'center' as const}}>
        <span style={{fontSize:11,color:TEAL,fontFamily:FB,fontWeight:600}}>0 intervention humaine · réponse en 12 minutes</span>
      </motion.div>
    </div>
  )
}

function VoiceVisual() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <motion.div animate={{scale:[1,1.06,1]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
        style={{width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle,${LIME_LT},rgba(132,204,22,0.04))`,border:`2px solid ${LIME}60`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36}}>
        🎙️
      </motion.div>
      <div style={{display:'flex',alignItems:'center',gap:4,height:40}}>
        {Array.from({length:20}).map((_,i)=>(
          <motion.span key={i} animate={{scaleY:[0.2,1,0.3,0.8,0.2]}} transition={{duration:0.9+((i%4)*0.15),repeat:Infinity,ease:'easeInOut',delay:i*0.05}}
            style={{width:4,height:'100%',borderRadius:3,background:LIME,transformOrigin:'center',display:'inline-block'}}/>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%',maxWidth:300}}>
        {[
          {label:'Délai de réponse',val:'< 60 s'},
          {label:'Langue','val':'Français natif'},
          {label:'Disponible','val':'24h/24'},
          {label:'Résumé agent','val':'WhatsApp auto'},
        ].map(r=>(
          <div key={r.label} style={{padding:'10px 14px',borderRadius:10,background:'rgba(30,41,59,0.60)',border:`1px solid ${BDR}`}}>
            <div style={{fontSize:10,color:SUBTLE,fontFamily:FB,marginBottom:3}}>{r.label}</div>
            <div style={{fontSize:14,fontWeight:700,color:LIME,fontFamily:FH}}>{r.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisitsVisual() {
  const steps = [
    {icon:'👤',label:'Acheteur',sub:'Propose mercredi soir',ok:true},
    {icon:'🏠',label:'Vendeur',sub:'Disponible mercredi 18h',ok:true},
    {icon:'🧑‍💼',label:'Agent',sub:'Valide en 1 clic',ok:true},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {steps.map((s,i)=>(
          <div key={s.icon} style={{display:'flex',alignItems:'center',gap:8}}>
            <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:i*0.3,duration:0.4}}
              style={{padding:'12px 14px',borderRadius:14,background:'rgba(30,41,59,0.70)',border:`1px solid ${s.ok?TEAL+'40':BDR}`,textAlign:'center' as const}}>
              <div style={{fontSize:22}}>{s.icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:WHITE,fontFamily:FH,marginTop:4}}>{s.label}</div>
              <div style={{fontSize:10,color:MUTED,fontFamily:FB,marginTop:2,maxWidth:80}}>{s.sub}</div>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5+i*0.3}}
                style={{marginTop:6,fontSize:14,color:'#22C55E'}}>✓</motion.div>
            </motion.div>
            {i<steps.length-1&&<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8+i*0.2}}
              style={{fontSize:20,color:TEAL}}>→</motion.div>}
          </div>
        ))}
      </div>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
        style={{padding:'12px 24px',borderRadius:12,background:'rgba(45,212,191,0.12)',border:`1px solid ${TEAL}40`,textAlign:'center' as const}}>
        <div style={{fontSize:12,color:TEAL,fontWeight:600,fontFamily:FH}}>Confirmation envoyée aux 3 parties + lien Maps</div>
        <div style={{fontSize:11,color:MUTED,fontFamily:FB,marginTop:3}}>Rappel automatique J-1 à 18h et H-2</div>
      </motion.div>
    </div>
  )
}

function Hero() {
  const [slide,setSlide]=useState(0)
  const [paused,setPaused]=useState(false)
  const {scrollY}=useScroll()
  const bgY=useTransform(scrollY,[0,600],[0,60])

  useEffect(()=>{
    if(paused) return
    const id=setInterval(()=>setSlide(s=>(s+1)%SLIDES.length),5000)
    return()=>clearInterval(id)
  },[paused])

  const s=SLIDES[slide]

  return (
    <section style={{minHeight:'100dvh',background:BG_PAGE,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 24px 64px',position:'relative',overflow:'hidden'}}>
      {/* glows */}
      <motion.div style={{y:bgY,position:'absolute',top:'-15%',left:'15%',width:'60vw',height:'60vw',maxWidth:700,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.06) 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <motion.div style={{y:bgY,position:'absolute',bottom:'-10%',right:'10%',width:'45vw',height:'45vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,rgba(45,212,191,0.05) 0%,transparent 65%)`,pointerEvents:'none'}}/>

      <div style={{maxWidth:1100,width:'100%',position:'relative',zIndex:2}}>
        {/* Slide progress dots */}
        <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:40}}>
          {SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>{setSlide(i);setPaused(true)}}
              style={{width:slide===i?28:8,height:8,borderRadius:4,background:slide===i?s.accent:'rgba(255,255,255,0.15)',border:'none',cursor:'pointer',transition:'all 0.4s',padding:0}}/>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}} className="hero-grid">
          {/* Left — text */}
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:24}} transition={{duration:0.45,ease:EZ}}>
              {/* Tag line */}
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}>
                <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${s.accent},transparent)`}}/>
                <span style={{fontSize:11,fontWeight:700,color:s.accent,letterSpacing:'0.12em',textTransform:'uppercase' as const,fontFamily:FB}}>{s.tag}</span>
              </div>

              <h1 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(34px,4.5vw,58px)',color:WHITE,lineHeight:1.06,marginBottom:20,letterSpacing:'-0.03em',whiteSpace:'pre-line' as const}}>
                {s.headline.split('\n').map((line,i)=>i===1?<span key={i} style={{color:s.accent}}>{line}</span>:<span key={i}>{line}<br/></span>)}
              </h1>

              <p style={{fontSize:17,color:MUTED,lineHeight:1.75,maxWidth:460,marginBottom:36,fontFamily:FB}}>{s.sub}</p>

              <div style={{display:'flex',gap:12,flexWrap:'wrap' as const}}>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer" style={{padding:'14px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  Demander une démo gratuite →
                </a>
                <a href={AI_PHONE_TEL} style={{padding:'14px 22px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s',fontFamily:FB}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
                  📞 Appeler Sophie
                </a>
              </div>

              {/* Quick stats */}
              <div style={{display:'flex',gap:24,marginTop:36,paddingTop:24,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
                {[['10+','agences pilotes'],['< 60 s','réponse lead'],['24/7','IA vocale'],['RGPD','hébergé UE']].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontSize:18,fontWeight:700,color:WHITE,fontFamily:FH,letterSpacing:'-0.02em'}}>{v}</div>
                    <div style={{fontSize:11,color:SUBTLE,fontFamily:FB}}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right — visual */}
          <AnimatePresence mode="wait">
            <motion.div key={slide+'-vis'} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.02}} transition={{duration:0.45,ease:EZ}}
              style={{padding:'36px',borderRadius:24,background:'rgba(30,41,59,0.45)',border:`1px solid ${s.accent}25`,backdropFilter:'blur(12px)',minHeight:280,display:'flex',alignItems:'center',justifyContent:'center'}} className="hero-sphere">
              {slide===0&&<LeadsVisual/>}
              {slide===1&&<BotVisual/>}
              {slide===2&&<VoiceVisual/>}
              {slide===3&&<VisitsVisual/>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:36}}>
          <button onClick={()=>{setSlide(s=>(s-1+SLIDES.length)%SLIDES.length);setPaused(true)}}
            style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:`1px solid ${BDR2}`,color:MUTED,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>←</button>
          <button onClick={()=>{setSlide(s=>(s+1)%SLIDES.length);setPaused(true)}}
            style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:`1px solid ${BDR2}`,color:MUTED,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>→</button>
        </div>
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
   headline:'Le lead arrive. La fiche est créée avant même que vous l\'ayez lu.',
   body:'SeLoger, LeBonCoin, BienIci ou WhatsApp : Vanivert scanne votre boîte en continu, extrait le nom, le téléphone, le type de bien et la source, crée la fiche dans le CRM et notifie l\'agent par WhatsApp. Cycle complet en moins de 60 secondes, sans aucun geste humain.',
   steps:['Email de lead reçu de SeLoger / LeBonCoin / BienIci / WhatsApp','Vanivert extrait : nom, téléphone, type, localisation, source','Fiche prospect créée dans le CRM, statut = Nouveau','Agent notifié par WhatsApp + email en moins de 60 s'],
   metrics:['< 60 s de l\'email à la notification','4 sources supportées','Zéro double saisie']},
  {id:'bot',icon:'💬',color:TEAL,tag:'Bot WhatsApp 24h/24',
   headline:'Un prospect écrit le dimanche à 19h. Le bot qualifie, matche et planifie.',
   body:'Le bot salue le prospect par son prénom, collecte 4 critères clés (achat/location, type, budget, secteur), lui envoie 2 biens réels en cartes WhatsApp, et propose un créneau de visite, tout ça sans intervention humaine. C\'est exactement ce qui s\'est passé lors de notre démo Century 21, un dimanche soir.',
   steps:['Prospect écrit au numéro WhatsApp de l\'agence','Bot collecte les 4 critères de recherche','2 biens réels envoyés en cartes WhatsApp','Créneau de visite proposé et confirmé'],
   metrics:['0 intervention humaine','4 critères en 12 minutes','Fonctionne 24h/24, 7j/7']},
  {id:'visits',icon:'📅',color:TEAL,tag:'Coordination 3 parties',
   headline:'Acheteur, vendeur, agent. Le bot gère les trois. L\'agent valide en un clic.',
   body:'Quand le prospect confirme son intérêt, le système ouvre simultanément WhatsApp avec le vendeur. Il croise les disponibilités, identifie un créneau commun et présente la proposition finale à l\'agent. Rappels J-1 à 18h et H-2 envoyés aux trois parties. Taux de no-show attendu : moins de 8 %.',
   steps:['Acheteur confirme un créneau au bot','Bot contacte le vendeur et récupère ses disponibilités','Créneau commun identifié, proposition envoyée à l\'agent','Confirmations + lien Maps envoyés aux 3 parties'],
   metrics:['No-show < 8 % (vs 23 % sans rappels)','Rappels J-1 et H-2 automatiques','Email récap + Maps aux 3 parties']},
  {id:'voice',icon:'🎙️',color:LIME,tag:'IA vocale Sophie',
   headline:'Sophie répond à chaque appel manqué. En français. En moins de 60 secondes.',
   body:'Sophie qualifie l\'appelant, récupère ses critères de recherche et envoie un résumé structuré à l\'agent par WhatsApp. Même cerveau IA que le bot WhatsApp : quand on améliore la compréhension de Sophie, les deux s\'améliorent. Hébergé en UE, aucune donnée transmise à un tiers.',
   steps:['Appel manqué détecté','Sophie rappelle en moins de 60 secondes','Critères collectés : type, budget, secteur, délai','Résumé structuré envoyé à l\'agent par WhatsApp'],
   metrics:['< 60 s de délai de rappel','Résumé WhatsApp à l\'agent','Hébergé en UE, 100 % RGPD']},
  {id:'client',icon:'🎂',color:ORANGE,tag:'Client à vie',
   headline:'La relation ne s\'arrête pas chez le notaire.',
   body:'Anniversaire d\'acquisition, estimation trimestrielle DVF, voeux de Noël et 14 juillet, tout est envoyé automatiquement depuis le nom de l\'agent. Quand un client est prêt à revendre, Vanivert le détecte et crée une opportunité de mandat. Coût d\'acquisition d\'un mandat referral : 0 €.',
   steps:['Signature détectée dans le CRM','Demande d\'avis Google envoyée J+1','Contacts personnalisés tout au long de l\'année','Opportunité de mandat créée automatiquement'],
   metrics:['4+ contacts personnalisés par an','0 € de coût d\'acquisition referral','12 000–20 000 € de CA réactivé / an']},
  {id:'compliance',icon:'🔒',color:PURPLE,tag:'Conformité & mandats',
   headline:'Registre Loi Hoguet. Diagnostics. LCB-FT. Un seul écran.',
   body:'Chaque mandat reçoit un numéro séquentiel horodaté, conforme Loi Hoguet, exportable en PDF pour inspection T-GCA. Les 5 diagnostics obligatoires (DPE, amiante, plomb, électricité, gaz) sont suivis avec alertes J-60, J-30 et J-7. Chaque dossier LCB-FT suspect est signalé automatiquement.',
   steps:['Mandat créé avec numéro séquentiel Loi Hoguet','Diagnostics suivis avec alertes J-60, J-30, J-7','Dossier LCB-FT suspect signalé automatiquement','Export PDF T-GCA en 30 secondes'],
   metrics:['Registre mandats conforme Loi Hoguet','Alertes diagnostics J-60 / J-30 / J-7','Export PDF inspection en 30 s']},
]

function FeaturesSection() {
  const [active,setActive]=useState(0)
  const f=FEATURES_FULL[active]
  return (
    <section id="features" style={{background:BG_SEC,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Fonctionnalités</span>
          </div>
          <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(26px,3.2vw,42px)',color:WHITE,marginTop:12,marginBottom:10,letterSpacing:'-0.03em'}}>
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
                <h3 style={{fontFamily:FH,fontSize:'clamp(17px,2vw,22px)',color:WHITE,lineHeight:1.3,marginBottom:14,fontWeight:600}}>{f.headline}</h3>
                <p style={{fontSize:13,color:MUTED,lineHeight:1.7,marginBottom:18,fontFamily:FB}}>{f.body}</p>
                {(f as {steps?:string[]}).steps && (
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,fontWeight:700,color:f.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,marginBottom:10,fontFamily:FB}}>Comment ça marche</div>
                    {((f as {steps?:string[]}).steps||[]).map((step,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:8}}>
                        <span style={{width:20,height:20,borderRadius:'50%',background:`${f.color}20`,color:f.color,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,fontFamily:FH}}>{i+1}</span>
                        <span style={{fontSize:12,color:MUTED,lineHeight:1.55,fontFamily:FB}}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                  {f.metrics.map(m=>(
                    <span key={m} style={{fontSize:11,fontWeight:600,color:f.color,background:`rgba(30,41,59,0.60)`,padding:'4px 12px',borderRadius:980,border:`1px solid ${BDR}`,fontFamily:FB}}>{m}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{padding:'28px',borderRadius:16,background:BG_CARD,border:`1px solid ${BDR}`,textAlign:'center' as const,fontSize:52}}>{f.icon}</div>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer" style={{padding:'14px',borderRadius:980,background:f.color,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'opacity 0.2s',display:'block',fontFamily:FH}}
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
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,justifyContent:'center'}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Tester l&apos;IA</span>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
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
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,justifyContent:'center'}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:TEAL,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Calculateur ROI</span>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
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
              <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer" style={{display:'block',marginTop:24,padding:'13px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'background 0.25s',fontFamily:FH}}
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

// ── INVESTOR TEASER (links to /investisseurs) ────────────────────────────────
function Investors() {
  return (
    <section id="investors" style={{background:BG_DEEP,padding:'72px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        <FadeUp>
          <div style={{borderRadius:24,padding:'52px 48px',background:'rgba(30,41,59,0.45)',border:`1px solid ${BDR}`,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'space-between',gap:40,flexWrap:'wrap' as const}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(ellipse 70% 80% at 0% 50%,rgba(132,204,22,0.06) 0%,transparent 60%)`,pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:1,maxWidth:500}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <span style={{width:24,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
                <span style={{fontSize:11,fontWeight:700,color:TEAL,letterSpacing:'0.12em',textTransform:'uppercase' as const,fontFamily:FB}}>Investisseurs</span>
              </div>
              <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(22px,3vw,34px)',color:WHITE,letterSpacing:'-0.025em',lineHeight:1.2,marginBottom:12}}>
                104 M€ de marché adressable.<br/><span style={{color:LIME}}>Zéro concurrent full-stack.</span>
              </h2>
              <p style={{fontSize:14,color:MUTED,lineHeight:1.7,fontFamily:FB}}>
                30 000 agences en France, ARPU 239 €/mois, ARR 14,3 M€ à 5 ans. TAM/SAM/SOM, modèle de revenus et trajectoire détaillés dans notre dossier investisseur.
              </p>
            </div>
            <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',gap:12,flexShrink:0}}>
              <a href="/investisseurs" style={{padding:'14px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH,whiteSpace:'nowrap' as const}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                Voir le dossier investisseur →
              </a>
              <a href="mailto:investors@vanivert.eu" style={{padding:'12px 24px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:13,textDecoration:'none',textAlign:'center' as const,fontFamily:FB,transition:'all 0.2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
                investors@vanivert.eu
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── CONTACT FORM// ── CONTACT FORM (phone with +33 prefix, pro email detector) ──────────────────
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
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer" style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH}}
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
    {h:'Entreprise',links:[['Équipe','#team'],['Contact','#contact'],['Investisseurs','/investisseurs']]},
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
