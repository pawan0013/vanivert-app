'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import { DEFAULT_ARTICLES } from '@/lib/articles'

// ── DESIGN TOKENS (Collibra-inspired: teal-to-navy gradient, lime accent) ──────
// Background gradient: Dark Teal #0F3843 → Midnight Navy #020617
const BG_TOP   = '#0F3843'
const BG_MID   = '#0A2030'
const BG_BTM   = '#020617'
const BG_PAGE  = `linear-gradient(160deg, ${BG_TOP} 0%, ${BG_MID} 40%, ${BG_BTM} 100%)`
const BG_SOLID = 'linear-gradient(160deg,#0B2D38 0%,#071520 100%)'  // teal-tinted section bg
const BG_FLAT  = '#071520'   // flat fallback for gradients-in-gradients
const BG_CARD  = 'rgba(30,41,59,0.55)'   // #1E293B 55%
const BG_CARD2 = 'rgba(15,24,35,0.80)'

// Lime green primary (Collibra button: #84CC16)
const LIME   = '#84CC16'
const LIME2  = '#6BAE0F'
const LIME_LT= 'rgba(132,204,22,0.13)'
const LIME_GL= 'rgba(132,204,22,0.22)'

// Text
const WHITE  = '#FFFFFF'
const OFF    = '#F1F5F9'   // slightly warm white for body
const MUTED  = '#94A3B8'   // slate-400
const SUBTLE = '#64748B'   // slate-500

// Borders (teal glassmorphism)
const BDR    = 'rgba(100,200,200,0.12)'
const BDR2   = 'rgba(100,200,200,0.22)'
const BDR_LIME = 'rgba(132,204,22,0.35)'

// Accents
const TEAL   = '#2DD4BF'   // teal-400
const ORANGE = '#FB923C'   // for variety
const PURPLE = '#A78BFA'

// Fonts
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif"
const FONT_BODY = "'Inter', system-ui, sans-serif"

// Easing
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

// Phone / contact
const AI_PHONE_DISPLAY = '02 21 82 60 74'
const AI_PHONE_INTL    = '+33 2 21 82 60 74'
const AI_PHONE_TEL     = 'tel:+33221826074'
const SIRET            = '93429900900019'
const EMAIL            = 'team@vanivert.eu'
const PARIS_ADDRESS    = '1 Clos des Sylthes, 95800 Cergy, France'

// ── SCROLL PROGRESS BAR ────────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0,1], [0,1])
  return (
    <motion.div style={{
      position:'fixed',top:0,left:0,right:0,height:3,
      background:`linear-gradient(90deg,${LIME},${TEAL})`,
      transformOrigin:'left',scaleX,zIndex:600,pointerEvents:'none'
    }}/>
  )
}

// ── FADE UP ANIMATION ──────────────────────────────────────────────────────────
function FadeUp({ children, delay=0, style={}, className }: {
  children:React.ReactNode; delay?:number; style?:React.CSSProperties; className?:string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inV = useInView(ref, { once:true, margin:'-50px' })
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inV?{opacity:1,y:0}:{}}
      transition={{duration:0.7,ease:EZ,delay}} style={style} className={className}>
      {children}
    </motion.div>
  )
}

// ── LOGO (lime dots ring, matches page.tsx branding) ──────────────────────────
function Logo({ s=32 }: { s?:number }) {
  const cx=s/2, cy=s/2, R=s*0.38, nr=s*0.06, cr=s*0.15
  const pts = Array.from({length:8}, (_,i) => {
    const a = (i/8)*Math.PI*2 - Math.PI/2
    return { x: cx+R*Math.cos(a), y: cy+R*Math.sin(a) }
  })
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={LIME} strokeWidth={1} fill="none" strokeOpacity="0.5"/>
      {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={nr} fill={LIME} opacity={i%2===0?"0.9":"0.5"}/>)}
      <circle cx={cx} cy={cy} r={cr} fill={LIME}/>
    </svg>
  )
}

// ── GLOBE (THREE.js) ──────────────────────────────────────────────────────────
function Globe() {
  const mount = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mount.current) return
    const W = mount.current.clientWidth || 460
    const H = mount.current.clientHeight || 460
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.current.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 100)
    camera.position.z = 3.4
    const wireGeo = new THREE.SphereGeometry(1, 28, 28)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(LIME), wireframe:true, opacity:0.10, transparent:true
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wire)
    const innerGeo = new THREE.SphereGeometry(0.88, 32, 32)
    const innerMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0D2535'), shininess:60, transparent:true, opacity:0.95
    })
    const inner = new THREE.Mesh(innerGeo, innerMat)
    scene.add(inner)
    const nodeMat   = new THREE.MeshBasicMaterial({ color: new THREE.Color(LIME) })
    const tealMat   = new THREE.MeshBasicMaterial({ color: new THREE.Color(TEAL) })
    const nodePos = [[0.9,0.3,0.3],[-0.85,0.4,0.3],[0.2,0.95,0.2],[0.1,-0.9,0.4],[-0.3,0.2,0.95],[0.7,-0.6,0.4],[-0.5,-0.7,0.5],[0.3,0.5,-0.8]]
    const nodes = nodePos.map(([x,y,z], i) => {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.044,8,8), i%3===0?tealMat:nodeMat)
      n.position.set(x as number, y as number, z as number)
      scene.add(n); return n
    })
    for (let i=0; i<nodes.length; i++) {
      const pts = [nodes[i].position.clone(), nodes[(i+3)%nodes.length].position.clone()]
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: new THREE.Color(LIME), opacity:0.15, transparent:true })
      ))
    }
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(2,3,2); scene.add(dl)
    let f=0, raf=0
    const animate = () => {
      raf = requestAnimationFrame(animate); f++
      wire.rotation.y = f*0.003; wire.rotation.x = f*0.001
      inner.rotation.y = -f*0.002; renderer.render(scene, camera)
    }
    animate()
    return () => {
      cancelAnimationFrame(raf); renderer.dispose()
      if (mount.current && renderer.domElement.parentNode === mount.current)
        mount.current.removeChild(renderer.domElement)
    }
  }, [])
  return <div ref={mount} style={{width:'100%',height:'100%'}}/>
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const h = () => setSc(window.scrollY > 30)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links: [string,string][] = [
    ['Fonctionnalités','#features'],
    ['ROI','#roi'],
    ['Tester l\u2019IA','#tester-ia'],
    ['Équipe','#team'],
    ['Investisseurs','#investors']
  ]
  const navBg = sc
    ? 'rgba(8,30,44,0.96)'
    : 'transparent'
  return (
    <>
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,height:64,
        display:'flex',alignItems:'center',
        background:navBg,
        backdropFilter:sc?'blur(20px)':'none',
        WebkitBackdropFilter:sc?'blur(20px)':'none',
        borderBottom:`1px solid ${sc?BDR2:'transparent'}`,
        transition:'all 0.35s cubic-bezier(0.32,0.72,0,1)'
      }}>
        <div style={{maxWidth:1240,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <Logo s={30}/>
            <span style={{fontFamily:FONT_HEAD,fontSize:17,color:WHITE,fontWeight:700,letterSpacing:'-0.02em'}}>Vanivert</span>
          </a>
          <div className="nav-links" style={{display:'flex',gap:2}}>
            {links.map(([l,h]) => (
              <a key={l} href={h}
                style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'7px 13px',borderRadius:8,fontWeight:450,transition:'color 0.2s',fontFamily:FONT_BODY}}
                onMouseEnter={e=>(e.currentTarget.style.color=WHITE)}
                onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
            ))}
          </div>
          <div className="nav-links" style={{display:'flex',gap:10,alignItems:'center'}}>
            <a href="/login"
              style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'8px 14px',fontWeight:450,transition:'color 0.2s',fontFamily:FONT_BODY}}
              onMouseEnter={e=>(e.currentTarget.style.color=WHITE)}
              onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>Connexion</a>
            <a href={AI_PHONE_TEL}
              style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'8px 14px',fontWeight:450,display:'inline-flex',alignItems:'center',gap:6,transition:'color 0.2s',fontFamily:FONT_BODY}}
              onMouseEnter={e=>(e.currentTarget.style.color=LIME)}
              onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>📞 Appeler l&apos;IA</a>
            <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
              style={{fontSize:13,fontWeight:700,color:'#000',textDecoration:'none',padding:'9px 22px',borderRadius:980,background:LIME,display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)',boxShadow:`0 4px 18px ${LIME_GL}`,fontFamily:FONT_HEAD}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              Augmentez vos ventes
              <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(0,0,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>→</span>
            </a>
          </div>
          <button className="mob-nav" onClick={()=>setMob(!mob)}
            style={{display:'none',background:'none',border:`1px solid ${BDR2}`,borderRadius:10,cursor:'pointer',padding:'8px 10px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            <motion.span animate={{rotate:mob?45:0,y:mob?5.5:0}} style={{width:18,height:1.5,background:WHITE,display:'block',transformOrigin:'center'}}/>
            <motion.span animate={{opacity:mob?0:1}} style={{width:18,height:1.5,background:WHITE,display:'block'}}/>
            <motion.span animate={{rotate:mob?-45:0,y:mob?-5.5:0}} style={{width:18,height:1.5,background:WHITE,display:'block',transformOrigin:'center'}}/>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mob && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,zIndex:250,background:'rgba(6,22,32,0.98)',backdropFilter:'blur(20px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            {[...links,['Connexion','/login'],['Voir la démo','/demo'],['📞 Appeler l\u2019IA',AI_PHONE_TEL]].map(([l,h],i) => (
              <motion.a key={l} href={h} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                onClick={()=>setMob(false)}
                style={{fontSize:22,fontFamily:FONT_HEAD,fontStyle:'italic',color:WHITE,textDecoration:'none',padding:'12px 32px',textAlign:'center'}}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
const ROTATING = [
  "De l'appel entrant à l'avis cinq étoiles.",
  "Zéro lead perdu. Zéro client oublié.",
  "Votre concurrent dort. Vous, non.",
  "L'agence qui tourne en pilote automatique."
]

function Hero() {
  const [phrase, setPhrase] = useState(0)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0,600], [0,80])
  useEffect(() => {
    const id = setInterval(() => setPhrase(p => (p+1)%ROTATING.length), 3800)
    return () => clearInterval(id)
  }, [])
  return (
    <section style={{minHeight:'100dvh',background:BG_PAGE,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',position:'relative',overflow:'hidden'}}>
      {/* Glowing orbs */}
      <motion.div style={{y:bgY,position:'absolute',top:'-10%',left:'-5%',width:'50vw',height:'50vw',maxWidth:600,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.07) 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <motion.div style={{y:bgY,position:'absolute',bottom:'-8%',right:'-3%',width:'40vw',height:'40vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,rgba(45,212,191,0.06) 0%,transparent 65%)`,pointerEvents:'none'}}/>

      <div style={{maxWidth:1200,width:'100%',display:'grid',gridTemplateColumns:'1fr 460px',gap:64,alignItems:'center',position:'relative',zIndex:2}} className="hero-grid">
        <div>
          {/* Badge pill — Collibra-style */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.05}} style={{marginBottom:24}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px 6px 10px',borderRadius:980,background:'rgba(45,212,191,0.10)',border:`1px solid ${BDR2}`}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:LIME,boxShadow:`0 0 8px ${LIME}`}}/>
              <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.09em',textTransform:'uppercase' as const,color:TEAL,fontFamily:FONT_BODY}}>IA immobilière · France · RGPD</span>
            </div>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.75,ease:EZ,delay:0.1}}
            style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:'clamp(36px,4.6vw,62px)',color:WHITE,lineHeight:1.05,marginBottom:14,letterSpacing:'-0.03em'}}>
            Le système de gestion<br/>
            <span style={{color:LIME}}>de bout en bout</span><br/>
            pour votre agence.
          </motion.h1>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.28}} style={{height:26,marginBottom:18,overflow:'hidden'}}>
            <AnimatePresence mode="wait">
              <motion.p key={phrase} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}}
                style={{fontSize:15,color:TEAL,fontWeight:600,fontStyle:'italic',fontFamily:FONT_BODY}}>
                {ROTATING[phrase]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}}
            style={{fontSize:17,color:MUTED,lineHeight:1.75,maxWidth:490,marginBottom:36,fontFamily:FONT_BODY}}>
            Vanivert gère vos appels, vos leads, vos visites et votre réputation en ligne. Vous, vous vendez.
          </motion.p>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}} style={{display:'flex',gap:12,flexWrap:'wrap' as const,marginBottom:40}}>
            <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
              style={{padding:'14px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)',boxShadow:`0 8px 28px ${LIME_GL}`,fontFamily:FONT_HEAD}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              Demander une démo gratuite
              <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>→</span>
            </a>
            <a href="#roi"
              style={{padding:'14px 28px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s',fontFamily:FONT_BODY}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
              Calculer mon gain
            </a>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}
            style={{display:'flex',alignItems:'center',gap:24,paddingTop:24,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['10+','agences pilotes'],['60s','lead WhatsApp'],['24/7','IA vocale'],['EU','données RGPD']].map(([v,l]) => (
              <div key={l}>
                <div style={{fontSize:20,fontWeight:700,color:WHITE,fontFamily:FONT_HEAD,letterSpacing:'-0.02em'}}>{v}</div>
                <div style={{fontSize:11,color:SUBTLE,fontFamily:FONT_BODY}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.35}}
          style={{position:'relative',height:460}} className="hero-sphere">
          <div style={{position:'absolute',inset:0,borderRadius:28,overflow:'hidden',border:`1px solid ${BDR}`}}><Globe/></div>
          {[
            {top:28,right:-18,delay:0,bg:`rgba(132,204,22,0.08)`,bdrc:LIME,children:<><div style={{fontSize:11,color:LIME,fontWeight:600,marginBottom:4}}>Appel entrant</div><div style={{display:'flex',alignItems:'center',gap:8}}><motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:8,height:8,borderRadius:'50%',background:'#22C55E',boxShadow:'0 0 0 3px rgba(34,197,94,0.2)'}}/><span style={{fontSize:13,fontWeight:600,color:WHITE}}>Sophie répond en 0s</span></div></>},
            {bottom:110,left:-18,delay:0.8,bg:BG_CARD,bdrc:BDR2,children:<><div style={{fontSize:11,color:MUTED,marginBottom:4}}>Visite planifiée</div><div style={{fontSize:13,fontWeight:600,color:WHITE}}>Mercredi 10h, Agenda ✓</div></>},
            {bottom:28,right:14,delay:1.4,bg:`rgba(45,212,191,0.08)`,bdrc:TEAL,children:<><div style={{fontSize:11,color:TEAL,fontWeight:600,marginBottom:2}}>Avis Google reçu</div><div style={{fontSize:13,color:TEAL,fontWeight:700}}>★★★★★  Nouveau</div></>},
          ].map(({top,bottom,left,right,delay,bg,bdrc,children},i) => (
            <motion.div key={i} animate={{y:[0,i%2===0?-7:7,0]}} transition={{duration:3.5+i*0.5,repeat:Infinity,ease:'easeInOut',delay}}
              style={{position:'absolute',top,bottom,left,right,background:bg,border:`1px solid ${bdrc}`,borderRadius:14,padding:'12px 16px',backdropFilter:'blur(12px)'}}>
              {children}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── TICKER ────────────────────────────────────────────────────────────────────
const PARIS_AGENCIES = ['Foncia Paris 8e','Century 21 Trocadéro','Laforêt Paris 16e','Orpi Paris Centre','Stéphane Plaza Paris 17e','IAD France Île-de-France','ERA Immobilier Paris','Guy Hoquet Paris 15e','Nexity Solutions Immobilières']

function Ticker() {
  return (
    <section style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'18px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px'}}>
        <p style={{textAlign:'center',fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:12,fontFamily:FONT_BODY}}>Agences en cours de déploiement pilote en Île-de-France et Province</p>
        <div style={{overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${BG_SOLID},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left,${BG_SOLID},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{display:'flex',gap:56,animation:'ticker 28s linear infinite',width:'max-content',alignItems:'center'}}>
            {[...PARIS_AGENCIES,...PARIS_AGENCIES,...PARIS_AGENCIES].map((n,i) => (
              <span key={i} style={{fontSize:13,color:SUBTLE,fontFamily:FONT_BODY,fontStyle:'italic',whiteSpace:'nowrap'}}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── TEST-THE-AI CALL SECTION ───────────────────────────────────────────────────
function Waveform() {
  const bars = 28
  return (
    <div style={{display:'flex',alignItems:'center',gap:3,height:34}}>
      {Array.from({length:bars}).map((_,i) => (
        <motion.span key={i} animate={{scaleY:[0.25,1,0.35,0.8,0.25]}}
          transition={{duration:1.1+((i%5)*0.15),repeat:Infinity,ease:'easeInOut',delay:i*0.04}}
          style={{width:3,height:'100%',borderRadius:2,background:LIME,transformOrigin:'center',display:'inline-block'}}/>
      ))}
    </div>
  )
}

function TestCallSection() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    try { navigator.clipboard.writeText(AI_PHONE_INTL) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <section id="tester-ia" style={{background:`radial-gradient(ellipse 80% 60% at 50% 0%,rgba(132,204,22,0.12),transparent 60%),linear-gradient(160deg,#0C3040 0%,#071825 100%)`,padding:'110px 32px',borderTop:`1px solid ${BDR}`,position:'relative',overflow:'hidden'}}>
      <div style={{maxWidth:880,margin:'0 auto',textAlign:'center' as const,position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px 6px 10px',borderRadius:980,background:'rgba(132,204,22,0.08)',border:`1px solid ${BDR_LIME}`,marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:LIME,boxShadow:`0 0 10px ${LIME}`}}/>
            <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.09em',textTransform:'uppercase' as const,color:LIME,fontFamily:FONT_BODY}}>Essai en direct, gratuit</span>
          </div>
          <h2 style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:'clamp(28px,4vw,48px)',color:WHITE,margin:'0 0 16px',letterSpacing:'-0.03em',lineHeight:1.1}}>
            Appelez notre IA.<br/><span style={{color:LIME}}>Maintenant.</span>
          </h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.75,maxWidth:560,margin:'0 auto 44px',fontFamily:FONT_BODY}}>
            Composez ce numéro, jouez le rôle d&apos;un client qui cherche un bien, comme s&apos;il appelait votre agence un dimanche soir, et laissez Sophie, notre agent vocal, vous répondre comme elle répondrait à vos clients.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{background:BG_CARD,border:`1.5px solid ${BDR2}`,borderRadius:28,padding:'44px 36px',backdropFilter:'blur(16px)',maxWidth:520,margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:18}}><Waveform/></div>
            <div style={{fontSize:12,color:SUBTLE,letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:10,fontFamily:FONT_BODY}}>Numéro à composer</div>
            <div style={{fontSize:'clamp(30px,4vw,42px)',fontWeight:700,color:WHITE,fontFamily:FONT_HEAD,letterSpacing:'-0.01em',marginBottom:26}}>{AI_PHONE_DISPLAY}</div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap' as const,justifyContent:'center'}}>
              <a href={AI_PHONE_TEL}
                style={{padding:'15px 30px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:9,boxShadow:`0 10px 30px ${LIME_GL}`,transition:'background 0.2s',fontFamily:FONT_HEAD}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                📞 Appeler {AI_PHONE_INTL}
              </a>
              <button onClick={copy}
                style={{padding:'15px 24px',borderRadius:980,border:`1.5px solid ${BDR2}`,background:'transparent',color:WHITE,fontWeight:500,fontSize:14,cursor:'pointer',transition:'all 0.2s',fontFamily:FONT_BODY}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2}}>
                {copied ? 'Copié ✓' : 'Copier le numéro'}
              </button>
            </div>
            <p style={{fontSize:11.5,color:SUBTLE,marginTop:22,lineHeight:1.6,fontFamily:FONT_BODY}}>Ligne de démonstration disponible 24h/24. Aucune donnée personnelle n&apos;est requise. Parlez simplement d&apos;un projet immobilier fictif.</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.18}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginTop:36,maxWidth:640,margin:'36px auto 0'}} className="stats-grid">
            {[
              ['1','Composez le numéro ci-dessus depuis votre téléphone'],
              ['2','Jouez un client : "Bonjour, je cherche un T3 dans le quartier..."'],
              ['3','Écoutez Sophie qualifier, répondre et proposer un créneau'],
            ].map(([n,t]) => (
              <div key={n} style={{padding:'18px 16px',borderRadius:14,background:'rgba(255,255,255,0.03)',border:`1px solid ${BDR}`,textAlign:'left' as const}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:LIME_LT,color:LIME,fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,fontFamily:FONT_HEAD}}>{n}</div>
                <div style={{fontSize:12.5,color:MUTED,lineHeight:1.55,fontFamily:FONT_BODY}}>{t}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── ROI CALCULATOR ────────────────────────────────────────────────────────────
function ROICalc() {
  const [leads, setLeads] = useState(40)
  const [closeRate, setCloseRate] = useState(15)
  const [avgComm, setAvgComm] = useState(8000)
  const [hoursAdmin, setHoursAdmin] = useState(2)
  const missedDeals = Math.round(leads*0.35*(closeRate/100))
  const extraRevenue = missedDeals*avgComm
  const hoursSaved = hoursAdmin*22
  const timeSaved = hoursSaved*80
  const total = extraRevenue+timeSaved
  return (
    <section id="roi" style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:52}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:'rgba(45,212,191,0.10)',border:`1px solid ${BDR2}`,marginBottom:16}}>
            <span style={{fontSize:11,fontWeight:600,color:TEAL,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Calculateur ROI</span>
          </div>
          <h2 style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:'clamp(24px,3vw,40px)',color:WHITE,marginTop:8,marginBottom:10,letterSpacing:'-0.025em'}}>
            Combien Vanivert peut vous rapporter ?
          </h2>
          <p style={{fontSize:15,color:MUTED,maxWidth:480,margin:'0 auto',fontFamily:FONT_BODY}}>Les agences perdent en moyenne 35 % de leurs leads faute de réponse rapide. Voici votre gain potentiel.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}} className="alt-grid">
          <FadeUp>
            <div style={{background:BG_CARD,border:`1px solid ${BDR}`,borderRadius:20,padding:'32px 28px'}}>
              <div style={{fontSize:13,fontWeight:700,color:WHITE,marginBottom:24,fontFamily:FONT_HEAD}}>Votre situation actuelle</div>
              {[
                {label:'Leads entrants par mois',val:leads,setVal:setLeads,min:10,max:200,step:5,suffix:' leads'},
                {label:'Taux de signature (%)',val:closeRate,setVal:setCloseRate,min:5,max:40,step:1,suffix:'%'},
                {label:'Commission moyenne (EUR)',val:avgComm,setVal:setAvgComm,min:2000,max:20000,step:500,suffix:' EUR'},
                {label:'Heures admin par jour',val:hoursAdmin,setVal:setHoursAdmin,min:0.5,max:6,step:0.5,suffix:'h'},
              ].map(({label,val,setVal,min,max,step,suffix}) => (
                <div key={label} style={{marginBottom:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontSize:12,color:MUTED,fontFamily:FONT_BODY}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:WHITE,fontFamily:FONT_HEAD}}>{val}{suffix}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val}
                    onChange={e=>setVal(Number(e.target.value))}
                    style={{width:'100%',accentColor:LIME,height:4,cursor:'pointer'}}/>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{background:'rgba(4,14,25,0.95)',border:`1px solid rgba(45,212,191,0.12)`,borderRadius:20,padding:'32px 28px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:340}}>
              <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:24,fontFamily:FONT_BODY}}>Votre gain avec Vanivert</div>
              <div>
                {[
                  {label:`+${missedDeals} deals récupérés/mois`,value:`+${extraRevenue.toLocaleString('fr-FR')} EUR`,color:LIME,sub:'leads non répondus transformés'},
                  {label:`${hoursSaved}h admin économisées/mois`,value:`+${timeSaved.toLocaleString('fr-FR')} EUR`,color:TEAL,sub:'temps valorisé à 80 EUR/h'},
                ].map(r => (
                  <div key={r.label} style={{marginBottom:20,padding:'16px 18px',borderRadius:14,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontSize:11,color:SUBTLE,marginBottom:4,fontFamily:FONT_BODY}}>{r.sub}</div>
                    <div style={{fontSize:13,fontWeight:600,color:OFF,marginBottom:6,fontFamily:FONT_BODY}}>{r.label}</div>
                    <div style={{fontSize:22,fontWeight:700,color:r.color,fontFamily:FONT_HEAD}}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.10)',paddingTop:20,marginTop:8}}>
                <div style={{fontSize:12,color:SUBTLE,marginBottom:4,fontFamily:FONT_BODY}}>Gain annuel estimé</div>
                <div style={{fontSize:36,fontWeight:700,fontFamily:FONT_HEAD,color:WHITE}}>{(total*12).toLocaleString('fr-FR')} EUR</div>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{display:'block',marginTop:20,padding:'12px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'background 0.25s',fontFamily:FONT_HEAD}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  Voir ma démo gratuitement →
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id:'leads',icon:'📥',color:LIME,tag:'Capture des leads',
    headline:'Chaque appel manqué vous coûte une commission.',
    stat:'35 % des leads perdus faute de réponse en moins de 5 minutes.',
    impact:'Récupérez 35 % de leads en plus. Sans effort.',
    body:"SeLoger, LeBonCoin, BienIci, Google My Business, WhatsApp entrant : tout arrive dans une seule interface en moins de 10 secondes. Sophie répond par voix en 0 seconde, 24h/24. Qualification automatique, score de priorité, zéro double saisie.",
    metrics:['+35 % leads traités','60s lead WhatsApp','Déduplication auto'],
  },
  {
    id:'visits',icon:'📅',color:TEAL,tag:'Planification des visites',
    headline:'25 minutes de trajet pour un bien vide.',
    stat:'23 % des visites se terminent par un no-show ou une annulation de dernière minute.',
    impact:'Zéro no-show non géré. Chaque visite confirmée.',
    body:'Coordination tripartite automatique : acheteur, vendeur, agent. Confirmation WhatsApp pour les trois parties simultanément. Rappel la veille, rappel 2 heures avant avec lien Maps. Si le vendeur annule, le système propose un créneau de remplacement sans intervention humaine.',
    metrics:['3 confirmations simultanées','Rappel J-1 et H-2','Lien Maps intégré'],
  },
  {
    id:'client',icon:'🎂',color:ORANGE,tag:'Client à vie',
    headline:"8 ans de clients que vous n'avez plus jamais contactés.",
    stat:'Un client fidèle coûte 5x moins à conserver qu\'à acquérir. Combien avez-vous contactés ce mois ?',
    impact:'Votre CRM se souvient de tout, tout le temps.',
    body:"Anniversaires, anniversaire d'achat, estimations trimestrielles gratuites, voeux de Noël et 14 Juillet. Chaque message personnalisé, envoyé automatiquement depuis le nom de l'agent. Quand un client doit vendre ou rénover, Vanivert le détecte et crée une opportunité de mandat.",
    metrics:['Anniversaires auto','Estimations trimestrielles','Ré-engagement 3 ans'],
  },
  {
    id:'reviews',icon:'⭐',color:ORANGE,tag:'Réputation Google',
    headline:'1 étoile de plus sur Google = 18 % de leads en plus.',
    stat:'80 % des agences ne collectent pas d\'avis systématiquement.',
    impact:'Chaque transaction devient un avis cinq étoiles.',
    body:"Deal marqué Gagné, 24 heures plus tard, acheteur et vendeur reçoivent chacun un WhatsApp personnalisé. Les avis Google arrivent dans le tableau de bord avec une réponse IA prête à valider en un clic. Si 5 étoiles : draft Instagram généré automatiquement pour validation directeur.",
    metrics:['Demande auto 24h après','Réponse IA en 1 clic','Draft Instagram inclus'],
  },
  {
    id:'compliance',icon:'🔒',color:PURPLE,tag:'Conformité LCB-FT',
    headline:'Une inspection DGCCRF peut vous coûter votre carte professionnelle.',
    stat:"Depuis le décret d'avril 2026, la traçabilité LCB-FT est une obligation renforcée. Les inspections se multiplient.",
    impact:'Audit trail complet. En un clic.',
    body:"Chaque dossier dépassant 100 K ou présentant une structure inhabituelle : signalement automatique pour due diligence renforcée. L'agent est guidé étape par étape. Le directeur voit un tableau de conformité par dossier : Vérifié, En cours, Action requise. Export PDF pour inspection DGCCRF en 30 secondes.",
    metrics:['Traçabilité LCB-FT','Export PDF inspection','Zéro non-conformité'],
  },
  {
    id:'valuation',icon:'📊',color:TEAL,tag:'Estimation du bien',
    headline:'Le vendeur a vérifié les prix DVF avant votre visite.',
    stat:'70 % des vendeurs arrivent informés sur les prix du marché.',
    impact:'Arrivez avec les chiffres. Gagnez le mandat.',
    body:"DVF récupère les 5 dernières transactions comparables. Géorisques identifie tous les risques réglementaires obligatoires. Le Cadastre confirme la surface officielle. Tout ça agrégé automatiquement en un rapport envoyé sur WhatsApp à l'agent 30 minutes avant sa visite.",
    metrics:['DVF data.gouv.fr','Géorisques API officielle','Cadastre surface exacte'],
  },
]

function FeaturesSection() {
  const [active, setActive] = useState(0)
  const f = FEATURES[active]
  return (
    <section id="features" style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:'rgba(132,204,22,0.08)',border:`1px solid ${BDR_LIME}`,marginBottom:16}}>
            <span style={{fontSize:11,fontWeight:600,color:LIME,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Fonctionnalités</span>
          </div>
          <h2 style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:'clamp(24px,3vw,40px)',color:WHITE,marginTop:8,marginBottom:10,letterSpacing:'-0.025em'}}>
            Ce que vos agents font manuellement.<br/><span style={{color:MUTED,fontWeight:400}}>Ce que Vanivert fait automatiquement.</span>
          </h2>
        </FadeUp>
        <div style={{display:'flex',gap:8,marginBottom:32,overflowX:'auto' as const,paddingBottom:4,scrollbarWidth:'none' as const}}>
          {FEATURES.map((feat,i) => (
            <button key={feat.id} onClick={()=>setActive(i)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:980,background:active===i?feat.color:BG_CARD,color:active===i?'#000':MUTED,fontWeight:active===i?700:450,fontSize:12,border:`1.5px solid ${active===i?feat.color:BDR}`,cursor:'pointer',transition:'all 0.25s',whiteSpace:'nowrap' as const,fontFamily:FONT_BODY,flexShrink:0}}>
              <span>{feat.icon}</span>{feat.tag}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.3}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}} className="alt-grid">
              <div style={{padding:'36px 32px',borderRadius:20,background:`rgba(30,41,59,0.40)`,border:`1.5px solid ${BDR}`}}>
                <div style={{fontSize:11,fontWeight:700,color:f.color,textTransform:'uppercase' as const,letterSpacing:'0.1em',marginBottom:16,fontFamily:FONT_BODY}}>{f.tag}</div>
                <div style={{fontFamily:FONT_HEAD,fontSize:'clamp(17px,2vw,24px)',color:WHITE,lineHeight:1.35,marginBottom:12,fontWeight:600}}>{f.headline}</div>
                <div style={{padding:'12px 16px',borderRadius:12,background:`rgba(30,41,59,0.60)`,border:`1px solid ${BDR}`,marginBottom:16}}>
                  <div style={{fontSize:12,color:MUTED,lineHeight:1.6,fontStyle:'italic',fontFamily:FONT_BODY}}>{f.stat}</div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:WHITE,marginBottom:10,fontFamily:FONT_HEAD}}>{f.impact}</div>
                <div style={{fontSize:13,color:MUTED,lineHeight:1.72,marginBottom:20,fontFamily:FONT_BODY}}>{f.body}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                  {f.metrics.map(m => (
                    <span key={m} style={{fontSize:11,fontWeight:600,color:f.color,background:`rgba(30,41,59,0.60)`,padding:'4px 10px',borderRadius:980,border:`1px solid ${BDR}`,fontFamily:FONT_BODY}}>{m}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{fontSize:36,padding:'24px',borderRadius:16,background:BG_CARD,border:`1px solid ${BDR}`,textAlign:'center' as const}}>{f.icon}</div>
                {[
                  {before:'Agent vérifie 3 boîtes mail et copie-colle les contacts',after:'Lead créé en 10 secondes depuis n\'importe quelle source',ok:active===0},
                  {before:'Agent appelle pour confirmer la visite avec chaque partie',after:'3 confirmations WhatsApp simultanées, rappels inclus',ok:active===1},
                  {before:'Le client ne rappelle plus après la vente',after:'Message anniversaire personnalisé depuis le nom de l\'agent',ok:active===2},
                  {before:'Moins de 3 % des clients laissent un avis sans relance',after:'34 % de taux de réponse avec WhatsApp personnalisé 24h après',ok:active===3},
                  {before:'Traçabilité LCB-FT dans un tableur Excel',after:'Audit trail automatique, export PDF en 30 secondes',ok:active===4},
                  {before:'Agent estime de mémoire pendant la visite vendeur',after:'Rapport DVF-Géorisques reçu sur WhatsApp avant la visite',ok:active===5},
                ].filter(r=>r.ok).map((r,i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div style={{padding:'14px 16px',borderRadius:12,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.20)'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#F87171',marginBottom:4,textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Avant</div>
                      <div style={{fontSize:12,color:'#FCA5A5',lineHeight:1.5,fontFamily:FONT_BODY}}>{r.before}</div>
                    </div>
                    <div style={{padding:'14px 16px',borderRadius:12,background:LIME_LT,border:`1px solid rgba(132,204,22,0.25)`}}>
                      <div style={{fontSize:10,fontWeight:700,color:LIME,marginBottom:4,textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Avec Vanivert</div>
                      <div style={{fontSize:12,color:OFF,lineHeight:1.5,fontWeight:500,fontFamily:FONT_BODY}}>{r.after}</div>
                    </div>
                  </div>
                ))}
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{padding:'13px',borderRadius:980,background:f.color,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'opacity 0.2s',display:'block',fontFamily:FONT_HEAD}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='0.85'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}>
                  Voir cette fonctionnalité en démo →
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── SOCIAL PROOF ──────────────────────────────────────────────────────────────
function SocialProof() {
  const stats = [
    {n:'+34 %',label:'de leads traités dans les 5 premières minutes',color:LIME},
    {n:'-60 %',label:'de temps consacré à la saisie manuelle',color:TEAL},
    {n:'4,8/5',label:'note Google moyenne après 3 mois de déploiement',color:ORANGE},
    {n:'<60s',label:"de l'appel entrant au WhatsApp agent",color:LIME},
  ]
  return (
    <section style={{background:'linear-gradient(160deg,#082230 0%,#040E18 100%)',borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'64px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <p style={{fontSize:11,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Résultats constatés sur nos agences pilotes</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}} className="stats-grid">
          {stats.map((s,i) => (
            <FadeUp key={s.label} delay={i*0.07}>
              <div style={{textAlign:'center',padding:'24px 16px',borderRadius:16,background:BG_CARD,border:`1px solid ${BDR}`}}>
                <div style={{fontSize:36,fontWeight:700,fontFamily:FONT_HEAD,color:s.color,marginBottom:8}}>{s.n}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FONT_BODY}}>{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── BLOG ──────────────────────────────────────────────────────────────────────
function BlogPreview() {
  const [articles, setArticles] = useState(DEFAULT_ARTICLES.filter(a=>a.published).slice(0,3))
  useEffect(() => {
    try {
      const s = localStorage.getItem('vanivert_blog_v1')
      if (s) setArticles(JSON.parse(s).filter((a:{published:boolean})=>a.published).slice(0,3))
    } catch {}
  }, [])
  if (!articles.length) return null
  const [first, ...rest] = articles
  return (
    <section id="blog" style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36,flexWrap:'wrap' as const,gap:12}}>
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:'rgba(132,204,22,0.08)',border:`1px solid ${BDR_LIME}`,marginBottom:12}}>
              <span style={{fontSize:11,fontWeight:600,color:LIME,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Blog</span>
            </div>
            <h2 style={{fontFamily:FONT_HEAD,fontWeight:600,fontSize:'clamp(20px,2.6vw,32px)',color:WHITE,marginTop:8,letterSpacing:'-0.02em'}}>Ce que les meilleures agences font déjà.</h2>
          </div>
          <a href="/blog" style={{fontSize:13,color:LIME,fontWeight:600,textDecoration:'none',fontFamily:FONT_BODY}}>Tous les articles →</a>
        </FadeUp>
        <FadeUp>
          <a href={`/blog/${first.slug}`} style={{textDecoration:'none',display:'grid',gridTemplateColumns:'1fr 1fr',borderRadius:20,overflow:'hidden',background:BG_CARD,border:`1px solid ${BDR}`,marginBottom:14,transition:'box-shadow 0.25s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 8px 32px ${LIME_LT}`}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}} className="blog-feat">
            <div style={{height:280,overflow:'hidden'}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={first.image} alt={first.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.75)'}} loading="eager"/>
            </div>
            <div style={{padding:'32px 28px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <div>
                <h3 style={{fontFamily:FONT_HEAD,fontSize:19,color:WHITE,lineHeight:1.35,margin:'14px 0 12px',fontWeight:600}}>{first.title}</h3>
                <p style={{fontSize:13,color:MUTED,lineHeight:1.65,fontFamily:FONT_BODY}}>{first.excerpt}</p>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
                <span style={{fontSize:11,color:SUBTLE,fontFamily:FONT_BODY}}>{first.readTime} · {first.date}</span>
                <span style={{fontSize:13,color:LIME,fontWeight:600,fontFamily:FONT_BODY}}>Lire →</span>
              </div>
            </div>
          </a>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="pricing-grid">
          {rest.map((p,i) => (
            <FadeUp key={p.slug} delay={i*0.08}>
              <a href={`/blog/${p.slug}`} style={{textDecoration:'none',display:'block',borderRadius:16,overflow:'hidden',background:BG_CARD,border:`1px solid ${BDR}`,transition:'box-shadow 0.25s,transform 0.25s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 8px 24px ${LIME_LT}`;(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none';(e.currentTarget as HTMLElement).style.transform='none'}}>
                <div style={{height:160,overflow:'hidden'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="lazy"/>
                </div>
                <div style={{padding:'18px 20px'}}>
                  <h3 style={{fontFamily:FONT_HEAD,fontSize:15,color:WHITE,lineHeight:1.35,margin:'10px 0 8px',fontWeight:600}}>{p.title}</h3>
                  <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:12,fontFamily:FONT_BODY}}>{p.excerpt}</p>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:11,color:SUBTLE,fontFamily:FONT_BODY}}>{p.readTime} · {p.date}</span>
                    <span style={{fontSize:12,color:LIME,fontWeight:600,fontFamily:FONT_BODY}}>Lire →</span>
                  </div>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TEAM STORY ────────────────────────────────────────────────────────────────
function TeamStory() {
  return (
    <section id="team" style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <FadeUp>
          <div style={{marginBottom:40}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
              <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Notre histoire</span>
            </div>
            <h2 style={{fontWeight:700,fontSize:'clamp(30px,3.8vw,48px)',color:WHITE,letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24,fontFamily:FONT_HEAD}}>
              On a travaillé pour des entreprises<br/>qui brassent des milliards.<br/>
              <span style={{color:MUTED,fontWeight:400}}>Puis on a vu l&apos;immobilier français.</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{fontSize:16,color:MUTED,lineHeight:1.85,fontFamily:FONT_BODY}}>
            <p style={{marginBottom:20}}>Logistique maritime internationale. Tech. Opérations dans 15 pays. Des systèmes où une erreur de 30 secondes coûte des millions. C&apos;est là où on a appris à construire des choses qui tournent sans supervision.</p>
            <p style={{marginBottom:20}}>Quand on a posé un pied dans l&apos;immobilier français, le contraste était brutal. Des agences avec 5 agents et 3 boîtes mail. Des leads qui arrivent à 21h et que personne ne rappelle. Des clients qui disparaissent après la vente. Des visites confirmées par téléphone, une par une.</p>
            <p style={{marginBottom:20}}>Ce n&apos;est pas un problème de talent. Les agents sont bons. C&apos;est un problème d&apos;infrastructure. Les outils n&apos;ont pas suivi.</p>
            <p style={{marginBottom:20,color:WHITE,fontWeight:600,fontSize:18}}>Alors on a tout construit de zéro.</p>
            <p>Vanivert automatise tout ce qui peut l&apos;être pour que l&apos;agent fasse ce qu&apos;il fait le mieux : vendre, négocier, convaincre. Le système fait le reste. 24h/24. Sans supervision.</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div style={{display:'flex',gap:32,marginTop:40,paddingTop:32,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['15+','pays d\'opérations'],['3','co-fondateurs'],['10+','agences pilotes'],['SIRET','93429900900019']].map(([v,l]) => (
              <div key={l}>
                <div style={{fontSize:22,fontWeight:700,color:WHITE,marginBottom:2,fontFamily:FONT_HEAD}}>{v}</div>
                <div style={{fontSize:12,color:SUBTLE,fontFamily:FONT_BODY}}>{l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── INVESTORS (100 % FRENCH) ──────────────────────────────────────────────────
function Investors() {
  return (
    <section id="investors" style={{background:'linear-gradient(160deg,#061D28 0%,#020D16 100%)',padding:'96px 32px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 20% 50%,rgba(132,204,22,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(45,212,191,0.06) 0%,transparent 50%)`,pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:TEAL,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Investisseurs</span>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(30px,4vw,50px)',color:WHITE,letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24,fontFamily:FONT_HEAD}}>
            Nous bâtissons le socle<br/>
            <span style={{color:LIME}}>d&apos;exploitation de l&apos;immobilier</span><br/>
            français.
          </h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.75,maxWidth:620,marginBottom:40,fontFamily:FONT_BODY}}>
            8 500 agences indépendantes paient entre 70 et 150 EUR par mois à des CRM qui ne font ni l&apos;automatisation WhatsApp, ni la centralisation des leads portails, ni la collecte d&apos;avis Google, ni la relation client post-vente. C&apos;est un marché de plus de 10 millions d&apos;euros par an rien qu&apos;en France. Nous bâtissons l&apos;alternative.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:48}} className="stats-grid">
            {[
              {n:'8 500+',l:'agences indépendantes en France',color:LIME},
              {n:'10 M EUR+',l:'marché CRM immobilier français annuel',color:TEAL},
              {n:'10+',l:'agences pilotes actives',color:'#22C55E'},
              {n:'0',l:'concurrent offrant WhatsApp + leads + avis + CRM',color:PURPLE},
            ].map(s => (
              <div key={s.l} style={{padding:'20px 18px',borderRadius:14,background:BG_CARD,border:`1px solid ${BDR}`}}>
                <div style={{fontSize:24,fontWeight:700,color:s.color,marginBottom:6,fontFamily:FONT_HEAD}}>{s.n}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FONT_BODY}}>{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div style={{display:'flex',gap:24,flexWrap:'wrap' as const,alignItems:'center',paddingTop:32,borderTop:`1px solid ${BDR}`}}>
            <div style={{flex:1,minWidth:240}}>
              <div style={{fontSize:14,color:MUTED,marginBottom:4,fontFamily:FONT_BODY}}>Enregistré en France</div>
              <div style={{fontSize:14,color:OFF,fontFamily:FONT_BODY}}>SIRET 93429900900019, Cergy, France</div>
            </div>
            <a href="mailto:investors@vanivert.eu"
              style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,display:'inline-flex',alignItems:'center',gap:8,fontFamily:FONT_HEAD}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              investors@vanivert.eu
              <span style={{fontSize:16}}>→</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── CONTACT FORM ──────────────────────────────────────────────────────────────
const FREE_EMAIL_DOMAINS = ['gmail.com','yahoo.com','yahoo.fr','hotmail.com','hotmail.fr','outlook.com','outlook.fr','live.com','live.fr','icloud.com','aol.com','gmx.com','gmx.fr','laposte.net','free.fr','orange.fr','wanadoo.fr','sfr.fr','protonmail.com','mail.com','yandex.com']
function isProfessionalEmail(email: string): boolean {
  const at = email.split('@')
  if (at.length !== 2) return false
  return !FREE_EMAIL_DOMAINS.includes(at[1].toLowerCase().trim())
}

function Contact() {
  const [prenom,setPrenom]=useState(''), [nom,setNom]=useState(''), [email,setEmail]=useState(''), [phone,setPhone]=useState(''), [agency,setAgency]=useState(''), [agents,setAgents]=useState(''), [message,setMessage]=useState(''), [sent,setSent]=useState(false), [loading,setLoading]=useState(false), [emailError,setEmailError]=useState('')
  async function submit(e:React.FormEvent) {
    e.preventDefault()
    if (!email||!prenom||!nom) return
    if (!isProfessionalEmail(email)) { setEmailError("Merci d'utiliser votre email professionnel (pas Gmail, Yahoo, Hotmail...)"); return }
    setEmailError(''); setLoading(true)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({ access_key:'35166257-a70e-45c4-895c-0f32d06200f8', subject:`Nouvelle demande de démo : ${agency||`${prenom} ${nom}`}`, from_name:'Vanivert Formulaire site', name:`${prenom} ${nom}`, email, phone, agency_name:agency, agent_count:agents, message:message||'(aucun message)' }),
      })
    } catch {}
    setSent(true); setLoading(false)
    setTimeout(() => { setSent(false); setPrenom(''); setNom(''); setEmail(''); setPhone(''); setAgency(''); setAgents(''); setMessage('') }, 3000)
  }
  const inp: React.CSSProperties = { width:'100%', padding:'13px 16px', borderRadius:12, border:`1px solid ${BDR2}`, fontSize:14, outline:'none', color:WHITE, fontFamily:FONT_BODY, background:'rgba(30,41,59,0.60)', boxSizing:'border-box' as const }
  return (
    <section id="contact" style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center' as const,marginBottom:36}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,justifyContent:'center'}}>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:11,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Contact</span>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(26px,3.2vw,40px)',color:WHITE,marginBottom:12,letterSpacing:'-0.03em',fontFamily:FONT_HEAD}}>Parlez-nous de votre agence.</h2>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,fontFamily:FONT_BODY}}>Demande de démo, question technique, partenariat : nous répondons personnellement sous 24h ouvrées.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.96}} transition={{duration:0.3}}
                style={{padding:40,borderRadius:18,background:LIME_LT,border:`1px solid ${BDR_LIME}`,textAlign:'center' as const}}>
                <div style={{fontSize:40,marginBottom:14}}>✅</div>
                <div style={{fontSize:17,fontWeight:700,color:WHITE,marginBottom:8,fontFamily:FONT_HEAD}}>Message envoyé !</div>
                <div style={{fontSize:13,color:MUTED,fontFamily:FONT_BODY}}>Nous vous répondons sous 24h ouvrées.</div>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
                onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <input required value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Prénom *" style={inp}/>
                  <input required value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom *" style={inp}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <input type="email" required value={email} onChange={e=>{setEmail(e.target.value);setEmailError('')}} placeholder="Email professionnel *" style={{...inp,borderColor:emailError?'#EF4444':BDR2}}/>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Téléphone" style={inp}/>
                </div>
                {emailError && <p style={{fontSize:12,color:'#F87171',margin:0,marginTop:-4,fontFamily:FONT_BODY}}>{emailError}</p>}
                <input value={agency} onChange={e=>setAgency(e.target.value)} placeholder="Nom de votre agence" style={inp}/>
                <select value={agents} onChange={e=>setAgents(e.target.value)} style={{...inp,appearance:'none' as const,color:agents?WHITE:MUTED}}>
                  <option value="" style={{background:'#071520'}}>Nombre d&apos;agents</option>
                  <option value="1" style={{background:'#071520'}}>1 agent</option>
                  <option value="2-5" style={{background:'#071520'}}>2 à 5 agents</option>
                  <option value="6-15" style={{background:'#071520'}}>6 à 15 agents</option>
                  <option value="15+" style={{background:'#071520'}}>Plus de 15 agents</option>
                </select>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Votre message (optionnel)" rows={3} style={{...inp,resize:'vertical' as const}}/>
                <p style={{fontSize:11,color:SUBTLE,lineHeight:1.55,textAlign:'center' as const,fontFamily:FONT_BODY}}>En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter. Conforme RGPD. Voir notre <a href="/legal/confidentialite" style={{color:LIME}}>politique de confidentialité</a>.</p>
                <button type="submit" disabled={loading}
                  style={{padding:'14px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',transition:'background 0.25s',boxShadow:`0 4px 14px ${LIME_GL}`,fontFamily:FONT_HEAD}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  {loading ? 'Envoi...' : 'Demander une démo gratuite →'}
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
    <section style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'0 32px 72px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp>
          <div style={{background:'rgba(4,14,25,0.95)',border:`1px solid ${BDR2}`,borderRadius:28,padding:'88px 40px',textAlign:'center' as const,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 30% 50%,rgba(132,204,22,0.10) 0%,transparent 55%),radial-gradient(circle at 70% 50%,rgba(45,212,191,0.07) 0%,transparent 55%)`,pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:2}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:980,background:'rgba(132,204,22,0.10)',border:`1px solid ${BDR_LIME}`,marginBottom:20}}>
                <span style={{fontSize:11,fontWeight:600,color:LIME,letterSpacing:'0.08em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Disponible maintenant, France entière</span>
              </div>
              <h2 style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:'clamp(28px,3.8vw,48px)',color:WHITE,margin:'0 auto 16px',letterSpacing:'-0.025em',lineHeight:1.15,maxWidth:620}}>
                L&apos;agence qui ne dort jamais.
              </h2>
              <p style={{fontSize:16,color:MUTED,maxWidth:440,margin:'0 auto 40px',fontFamily:FONT_BODY}}>
                Rejoignez les agences qui ont automatisé leur croissance avec Vanivert.
              </p>
              <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap' as const}}>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FONT_HEAD}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                  Boostez votre CA →
                </a>
                <a href="#contact"
                  style={{padding:'14px 32px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s',fontFamily:FONT_BODY}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── LOCATION MAP ──────────────────────────────────────────────────────────────
function LocationMap() {
  return (
    <section style={{background:'linear-gradient(160deg,#0B2D38 0%,#071520 100%)',padding:'56px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:32,alignItems:'center'}} className="alt-grid">
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
            <span style={{fontSize:11,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FONT_BODY}}>Où nous trouver</span>
          </div>
          <h3 style={{fontWeight:700,fontSize:'clamp(20px,2.4vw,28px)',color:WHITE,letterSpacing:'-0.02em',marginBottom:14,lineHeight:1.25,fontFamily:FONT_HEAD}}>
            Basés en France.<br/>Déployés partout.
          </h3>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,marginBottom:16,fontFamily:FONT_BODY}}>Vanivert est enregistré à Cergy, en région parisienne, et déploie ses agences pilotes dans toute la France.</p>
          <div style={{fontSize:14,color:WHITE,fontWeight:600,marginBottom:4,fontFamily:FONT_BODY}}>1 Clos des Sylthes</div>
          <div style={{fontSize:14,color:MUTED,marginBottom:12,fontFamily:FONT_BODY}}>95800 Cergy, France</div>
          <a href="https://maps.google.com/?q=1+Clos+des+Sylthes,95800+Cergy,France" target="_blank" rel="noopener noreferrer"
            style={{fontSize:13,color:LIME,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6,fontFamily:FONT_BODY}}>
            Ouvrir dans Google Maps <span>→</span>
          </a>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{borderRadius:20,overflow:'hidden',border:`1px solid ${BDR}`,height:280}}>
            <iframe title="Vanivert location Cergy, France" width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=1+Clos+des+Sylthes,95800+Cergy,France&output=embed"/>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {h:'Produit',links:[['Fonctionnalités','#features'],['ROI','#roi'],["Tester l'IA",'#tester-ia'],['Démo','https://realestate-eu-demo.vercel.app/login'],['Connexion','/login']]},
    {h:'Ressources',links:[['Équipe','#team'],['Contact','#contact'],['Investisseurs','mailto:investors@vanivert.eu']]},
    {h:'Légal',links:[['Mentions légales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Confidentialité','/legal/confidentialite'],['Admin','/admin']]},
  ]
  return (
    <footer style={{background:'linear-gradient(160deg,#061D28 0%,#020D16 100%)',borderTop:`1px solid ${BDR}`,padding:'56px 32px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr repeat(3,1fr)',gap:32,marginBottom:48}} className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <Logo s={26}/>
              <span style={{fontFamily:FONT_HEAD,fontSize:16,color:WHITE,fontWeight:700}}>Vanivert</span>
            </div>
            <p style={{fontSize:13,color:MUTED,lineHeight:1.65,maxWidth:220,marginBottom:16,fontFamily:FONT_BODY}}>L&apos;IA immobilière qui ne dort jamais. Enregistré en France, déployé partout.</p>
            <a href={AI_PHONE_TEL} style={{fontSize:13,color:LIME,textDecoration:'none',display:'block',marginBottom:16,fontFamily:FONT_BODY}}>📞 {AI_PHONE_INTL}</a>
            <a href="https://www.linkedin.com/company/vanivert" target="_blank" rel="noopener noreferrer"
              style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.08)',border:`1px solid ${BDR}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:WHITE,textDecoration:'none'}}>in</a>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{fontSize:11,fontWeight:600,color:SUBTLE,marginBottom:14,textTransform:'uppercase' as const,letterSpacing:'0.07em',fontFamily:FONT_BODY}}>{col.h}</div>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {col.links.map(([l,h]) => (
                  <a key={l} href={h} target={h.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
                    style={{fontSize:13,color:MUTED,textDecoration:'none',transition:'color 0.2s',fontFamily:FONT_BODY}}
                    onMouseEnter={e=>(e.currentTarget.style.color=WHITE)}
                    onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${BDR}`,paddingTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:10}}>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FONT_BODY}}>© 2026 Vanivert · SIRET {SIRET}</span>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FONT_BODY}}>{PARIS_ADDRESS}</span>
          <a href={`mailto:${EMAIL}`} style={{fontSize:12,color:SUBTLE,textDecoration:'none',fontFamily:FONT_BODY}}>{EMAIL}</a>
        </div>
      </div>
    </footer>
  )
}

// ── GDPR ──────────────────────────────────────────────────────────────────────
function GDPR() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { try { if (!localStorage.getItem('vanivert_gdpr_v4')) setVisible(true) } catch {} }, [])
  const accept = () => { try { localStorage.setItem('vanivert_gdpr_v4','accepted') } catch {}; setVisible(false) }
  const decline = () => { try { localStorage.setItem('vanivert_gdpr_v4','declined') } catch {}; setVisible(false) }
  if (!visible) return null
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:2.5}}
      style={{position:'fixed',bottom:20,left:20,right:20,zIndex:9990,maxWidth:480,margin:'0 auto',background:BG_CARD,border:`1px solid ${BDR2}`,borderRadius:18,padding:'20px 22px',boxShadow:'0 8px 40px rgba(0,0,0,0.30)',display:'flex',flexDirection:'column',gap:10,backdropFilter:'blur(16px)'}}>
      <p style={{fontSize:13,fontWeight:600,color:WHITE,margin:0,fontFamily:FONT_HEAD}}>Ce site utilise des cookies</p>
      <p style={{fontSize:12,color:MUTED,lineHeight:1.55,margin:0,fontFamily:FONT_BODY}}>Cookies fonctionnels uniquement. Hébergement 100 % UE. Aucune donnée transmise à des tiers. <a href="/legal/confidentialite" style={{color:LIME}}>privacy@vanivert.eu</a></p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={accept} style={{flex:1,padding:'9px 16px',borderRadius:980,background:LIME,color:'#000',fontWeight:600,fontSize:12,border:'none',cursor:'pointer',fontFamily:FONT_HEAD}}>Accepter</button>
        <button onClick={decline} style={{flex:1,padding:'9px 16px',borderRadius:980,background:'transparent',color:MUTED,fontWeight:500,fontSize:12,border:`1px solid ${BDR2}`,cursor:'pointer',fontFamily:FONT_BODY}}>Refuser</button>
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
        body{background:#020617;color:${OFF};font-family:'Inter',system-ui,sans-serif;overflow-x:hidden}
        input,textarea,select,button{font-family:'Inter',system-ui,sans-serif}
        input::placeholder,textarea::placeholder{color:${SUBTLE}}
        input[type=range]{cursor:pointer}
        .nav-links{display:flex}.mob-nav{display:none}
        @media(max-width:860px){.nav-links{display:none!important}.mob-nav{display:flex!important}}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-sphere{display:none}.alt-grid{grid-template-columns:1fr!important}}
        @media(max-width:768px){.pricing-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}.blog-feat{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:1fr!important}}
        ::-webkit-scrollbar{display:none}
        select option{background:#071520;color:${OFF}}
      `}</style>
      <ScrollBar/>
      <Nav/>
      <main>
        <Hero/>
        <Ticker/>
        <TestCallSection/>
        <ROICalc/>
        <FeaturesSection/>
        <SocialProof/>
        <TeamStory/>
        <Investors/>
        <Contact/>
        <FooterCTA/>
      </main>
      <LocationMap/>
      <Footer/>
      <GDPR/>
    </>
  )
}
